import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from "mongoose";
import { User } from "../../users/schemas/user.schema";
import { Post } from "../../posts/schemas/post.schema";

export type CommentDocument = Comment & Document;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (doc, ret: any) => {
      delete ret.__v;
      return ret;
    },
  },
})
export class Comment {
  @Prop({ required: true })
  content: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: "User",
    required: true,
  })
  author: User;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: "Post",
    required: true,
  })
  post: Post;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: "Comment",
    default: null,
  })
  parentComment?: Comment;

  @Prop({ default: 0 })
  depth: number;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: 0 })
  likeCount: number;

  @Prop({ default: 0 })
  replyCount: number;

  @Prop({
    type: [
      {
        user: { type: MongooseSchema.Types.ObjectId, ref: "User" },
        likedAt: Date,
      },
    ],
  })
  likes: Array<{ user: MongooseSchema.Types.ObjectId; likedAt: Date }>;

  @Prop({ type: [String], default: [] })
  mentions: string[];

  @Prop()
  editedAt?: Date;

  // Virtual for checking if comment has replies
  get hasReplies(): boolean {
    return this.replyCount > 0;
  }

  // Virtual for checking if comment is a reply
  get isReply(): boolean {
    return !!this.parentComment;
  }
}

export const CommentSchema = SchemaFactory.createForClass(Comment);

// Indexes for better query performance
CommentSchema.index({ post: 1, createdAt: -1 });
CommentSchema.index({ author: 1 });
CommentSchema.index({ parentComment: 1 });
CommentSchema.index({ content: "text" });
CommentSchema.index({ isActive: 1 });
CommentSchema.index({ createdAt: -1 });
