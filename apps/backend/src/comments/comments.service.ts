import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Comment, CommentDocument } from "./schemas/comment.schema";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { UpdateCommentDto } from "./dto/update-comment.dto";

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
  ) {}

  async create(
    userId: string,
    postId: string,
    createCommentDto: CreateCommentDto,
  ) {
    const commentData: any = {
      content: createCommentDto.content,
      author: new Types.ObjectId(userId),
      post: new Types.ObjectId(postId),
      isActive: true,
    };

    if (createCommentDto.parentCommentId) {
      const parentComment = await this.commentModel.findById(
        createCommentDto.parentCommentId,
      );

      if (!parentComment) {
        throw new NotFoundException("Parent comment not found");
      }

      commentData.parentComment = parentComment._id;
      commentData.depth = parentComment.depth + 1;

      // Update parent comment's reply count
      await this.commentModel.updateOne(
        { _id: parentComment._id },
        { $inc: { replyCount: 1 } },
      );
    } else {
      commentData.depth = 0;
    }

    const comment = await this.commentModel.create(commentData);

    // Populate author information
    return this.commentModel
      .findById(comment._id)
      .populate("author", "name email profilePicture")
      .populate("parentComment")
      .lean();
  }

  async findAllByPost(postId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [comments, total] = await Promise.all([
      this.commentModel
        .find({ post: postId, isActive: true } as any)
        .populate("author", "name email profilePicture")
        .sort({ createdAt: 1 }) // Chronological order for nested comments
        .skip(skip)
        .limit(limit)
        .lean(),
      this.commentModel.countDocuments({ post: postId, isActive: true } as any),
    ]);

    // Build nested comment structure
    const nestedComments = this.buildNestedComments(comments);

    return {
      comments: nestedComments,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  private buildNestedComments(comments: any[], parentId = null): any[] {
    return comments
      .filter(
        (comment) =>
          (!parentId && !comment.parentComment) ||
          (parentId &&
            comment.parentComment &&
            comment.parentComment.toString() === parentId),
      )
      .map((comment) => ({
        ...comment,
        replies: this.buildNestedComments(comments, comment._id.toString()),
      }));
  }

  async findOne(id: string) {
    const comment = await this.commentModel
      .findById(id)
      .populate("author", "name email profilePicture")
      .populate("post")
      .lean();

    if (!comment) {
      throw new NotFoundException("Comment not found");
    }

    return comment;
  }

  async update(id: string, userId: string, updateCommentDto: UpdateCommentDto) {
    const comment = await this.commentModel.findById(id);

    if (!comment) {
      throw new NotFoundException("Comment not found");
    }

    // Check ownership
    if (comment.author.toString() !== userId) {
      throw new ForbiddenException("You can only update your own comments");
    }

    const updatedComment = await this.commentModel
      .findByIdAndUpdate(
        id,
        { ...updateCommentDto, editedAt: new Date() },
        { new: true },
      )
      .populate("author", "name email profilePicture");

    return updatedComment;
  }

  async remove(id: string, userId: string, isAdmin = false) {
    const comment = await this.commentModel.findById(id);

    if (!comment) {
      throw new NotFoundException("Comment not found");
    }

    // Check ownership or admin status
    if (!isAdmin && comment.author.toString() !== userId) {
      throw new ForbiddenException("You can only delete your own comments");
    }

    // Soft delete for comments with replies, hard delete for others
    if (comment.replyCount > 0) {
      comment.isActive = false;
      comment.content = "[Deleted]";
      await comment.save();
    } else {
      await comment.deleteOne();

      // Update parent comment's reply count if exists
      if (comment.parentComment) {
        await this.commentModel.updateOne(
          { _id: comment.parentComment },
          { $inc: { replyCount: -1 } },
        );
      }
    }

    return { message: "Comment deleted successfully" };
  }

  async likeComment(id: string, userId: string) {
    const comment = await this.commentModel.findById(id);

    if (!comment) {
      throw new NotFoundException("Comment not found");
    }

    // Check if already liked
    const alreadyLiked = await this.commentModel.findOne({
      _id: id,
      "likes.user": userId,
    } as any);

    if (alreadyLiked) {
      // Unlike
      await this.commentModel.updateOne(
        { _id: id },
        {
          $pull: { likes: { user: userId } },
          $inc: { likeCount: -1 },
        },
      );
      return { liked: false };
    } else {
      // Like
      await this.commentModel.updateOne(
        { _id: id },
        {
          $push: { likes: { user: userId, likedAt: new Date() } },
          $inc: { likeCount: 1 },
        },
      );
      return { liked: true };
    }
  }

  async getCommentStats(postId: string) {
    const stats = await this.commentModel.aggregate([
      { $match: { post: new Types.ObjectId(postId), isActive: true } },
      {
        $group: {
          _id: null,
          totalComments: { $sum: 1 },
          totalLikes: { $sum: "$likeCount" },
          avgLikes: { $avg: "$likeCount" },
        },
      },
    ]);

    const topComments = await this.commentModel
      .find({ post: postId, isActive: true } as any)
      .sort({ likeCount: -1 })
      .limit(5)
      .populate("author", "name profilePicture")
      .lean();

    return {
      stats: stats[0] || {
        totalComments: 0,
        totalLikes: 0,
        avgLikes: 0,
      },
      topComments,
    };
  }
}
