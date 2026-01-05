import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/schemas/user.schema';
import { Post } from '../../posts/schemas/post.schema';

export type CommentDocument = Comment & Document;

@Schema({
    timestamps: true,
})
export class Comment {
    @Prop({ required: true })
    content: string;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
    author: User;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Post', required: true })
    post: Post;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Comment' })
    parentComment?: Comment;

    @Prop({ default: 0 })
    depth: number;

    @Prop({ default: true })
    isActive: boolean;

    @Prop({ default: 0 })
    likeCount: number;

    @Prop({ default: 0 })
    replyCount: number;

    @Prop({ type: [String], default: [] })
    mentions: string[];
}

export const CommentSchema = SchemaFactory.createForClass(Comment);

// Indexes
CommentSchema.index({ post: 1, createdAt: -1 });
CommentSchema.index({ author: 1 });
CommentSchema.index({ parentComment: 1 });
CommentSchema.index({ 'content': 'text' });