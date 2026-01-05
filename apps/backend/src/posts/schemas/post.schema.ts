import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

export type PostDocument = Post & Document;

export enum PostStatus {
    DRAFT = 'draft',
    PUBLISHED = 'published',
    ARCHIVED = 'archived',
}

@Schema({
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
})
export class Post {
    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    content: string;

    @Prop()
    excerpt?: string;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
    author: User;

    @Prop({
        type: String,
        enum: PostStatus,
        default: PostStatus.DRAFT,
    })
    status: PostStatus;

    @Prop({ type: [String], default: [] })
    tags: string[];

    @Prop({ type: [String], default: [] })
    categories: string[];

    @Prop({ default: 0 })
    viewCount: number;

    @Prop({ default: 0 })
    likeCount: number;

    @Prop()
    publishedAt?: Date;

    @Prop()
    featuredImage?: string;

    @Prop({ type: [String], default: [] })
    images: string[];

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Post' })
    parentPost?: Post;

    @Prop({ default: false })
    isFeatured: boolean;

    @Prop({ type: Object, default: {} })
    seo: {
        metaTitle?: string;
        metaDescription?: string;
        keywords?: string[];
    };

    // Virtual for reading time
    get readingTime(): number {
        const wordsPerMinute = 200;
        const wordCount = this.content.split(/\s+/).length;
        return Math.ceil(wordCount / wordsPerMinute);
    }
}

export const PostSchema = SchemaFactory.createForClass(Post);

// Indexes
PostSchema.index({ status: 1, publishedAt: -1 });
PostSchema.index({ author: 1, createdAt: -1 });
PostSchema.index({ tags: 1 });
PostSchema.index({ title: 'text', content: 'text', excerpt: 'text' });