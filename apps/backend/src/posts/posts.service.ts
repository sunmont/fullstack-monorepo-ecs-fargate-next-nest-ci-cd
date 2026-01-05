import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Post, PostDocument, PostStatus } from './schemas/post.schema';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PaginationDto } from '@fullstack-monorepo/shared/dto/pagination.dto';

@Injectable()
export class PostsService {
    constructor(
        @InjectModel(Post.name) private postModel: Model<PostDocument>,
    ) {}

    async create(userId: string, createPostDto: CreatePostDto) {
        const post = new this.postModel({
            ...createPostDto,
            author: userId,
            status: createPostDto.status || PostStatus.DRAFT,
        });

        if (createPostDto.status === PostStatus.PUBLISHED) {
            post.publishedAt = new Date();
        }

        return post.save();
    }

    async findAll(pagination: PaginationDto, userId?: string) {
        const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc', ...filters } = pagination;

        const query: any = {};

        // Apply filters
        if (filters.status) {
            query.status = filters.status;
        } else {
            // Default: only published posts for non-admins
            query.status = PostStatus.PUBLISHED;
        }

        if (filters.author) {
            query.author = new Types.ObjectId(filters.author);
        }

        if (filters.tags && filters.tags.length > 0) {
            query.tags = { $in: filters.tags };
        }

        if (filters.category) {
            query.categories = filters.category;
        }

        if (filters.search) {
            query.$text = { $search: filters.search };
        }

        // For authors, show their own drafts
        if (userId && filters.includeDrafts) {
            query.$or = [
                { status: PostStatus.PUBLISHED },
                { author: new Types.ObjectId(userId), status: PostStatus.DRAFT }
            ];
        }

        const skip = (page - 1) * limit;

        const [posts, total] = await Promise.all([
            this.postModel
                .find(query)
                .populate('author', 'name email profilePicture')
                .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            this.postModel.countDocuments(query),
        ]);

        return {
            posts,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async findOne(id: string, userId?: string) {
        const post = await this.postModel
            .findById(id)
            .populate('author', 'name email profilePicture')
            .lean();

        if (!post) {
            throw new NotFoundException('Post not found');
        }

        // Check permissions
        if (post.status === PostStatus.DRAFT && post.author._id.toString() !== userId) {
            throw new ForbiddenException('You do not have permission to view this post');
        }

        // Increment view count
        await this.postModel.updateOne(
            { _id: id },
            { $inc: { viewCount: 1 } }
        );

        return post;
    }

    async update(id: string, userId: string, updatePostDto: UpdatePostDto) {
        const post = await this.postModel.findById(id);

        if (!post) {
            throw new NotFoundException('Post not found');
        }

        // Check ownership
        if (post.author.toString() !== userId) {
            throw new ForbiddenException('You can only update your own posts');
        }

        // Handle status changes
        if (updatePostDto.status === PostStatus.PUBLISHED && post.status !== PostStatus.PUBLISHED) {
            updatePostDto.publishedAt = new Date();
        }

        const updatedPost = await this.postModel
            .findByIdAndUpdate(id, updatePostDto, { new: true })
            .populate('author', 'name email profilePicture');

        return updatedPost;
    }

    async remove(id: string, userId: string) {
        const post = await this.postModel.findById(id);

        if (!post) {
            throw new NotFoundException('Post not found');
        }

        // Check ownership or admin
        if (post.author.toString() !== userId) {
            throw new ForbiddenException('You can only delete your own posts');
        }

        // Soft delete by changing status
        post.status = PostStatus.ARCHIVED;
        await post.save();

        return { message: 'Post archived successfully' };
    }

    async likePost(id: string, userId: string) {
        const post = await this.postModel.findById(id);

        if (!post) {
            throw new NotFoundException('Post not found');
        }

        // Check if already liked
        const alreadyLiked = await this.postModel.findOne({
            _id: id,
            'likes.user': userId,
        });

        if (alreadyLiked) {
            // Unlike
            await this.postModel.updateOne(
                { _id: id },
                {
                    $pull: { likes: { user: userId } },
                    $inc: { likeCount: -1 }
                }
            );
            return { liked: false };
        } else {
            // Like
            await this.postModel.updateOne(
                { _id: id },
                {
                    $push: { likes: { user: userId, likedAt: new Date() } },
                    $inc: { likeCount: 1 }
                }
            );
            return { liked: true };
        }
    }

    async getTrendingPosts(limit = 10) {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);

        return this.postModel
            .find({
                status: PostStatus.PUBLISHED,
                publishedAt: { $gte: weekAgo },
            })
            .sort({ viewCount: -1, likeCount: -1 })
            .limit(limit)
            .populate('author', 'name email profilePicture')
            .lean();
    }

    async getPostsByAuthor(authorId: string, includeDrafts = false) {
        const query: any = { author: authorId };

        if (!includeDrafts) {
            query.status = PostStatus.PUBLISHED;
        }

        return this.postModel
            .find(query)
            .sort({ createdAt: -1 })
            .populate('author', 'name email profilePicture')
            .lean();
    }

    async searchPosts(query: string, filters: any = {}) {
        const searchQuery: any = {
            status: PostStatus.PUBLISHED,
            $text: { $search: query },
        };

        if (filters.tags && filters.tags.length > 0) {
            searchQuery.tags = { $in: filters.tags };
        }

        if (filters.category) {
            searchQuery.categories = filters.category;
        }

        return this.postModel
            .find(searchQuery)
            .sort({ score: { $meta: 'textScore' } })
            .populate('author', 'name email profilePicture')
            .lean();
    }

    async getStats() {
        const stats = await this.postModel.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                    totalViews: { $sum: '$viewCount' },
                    totalLikes: { $sum: '$likeCount' },
                    avgViews: { $avg: '$viewCount' },
                    avgLikes: { $avg: '$likeCount' },
                },
            },
        ]);

        const totalPosts = await this.postModel.countDocuments();
        const publishedPosts = await this.postModel.countDocuments({ status: PostStatus.PUBLISHED });
        const totalViews = await this.postModel.aggregate([
            { $group: { _id: null, total: { $sum: '$viewCount' } } },
        ]);

        return {
            stats,
            summary: {
                totalPosts,
                publishedPosts,
                draftPosts: totalPosts - publishedPosts,
                totalViews: totalViews[0]?.total || 0,
            },
        };
    }
}