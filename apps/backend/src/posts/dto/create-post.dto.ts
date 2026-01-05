import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray, IsEnum, MinLength, MaxLength } from 'class-validator';
import { PostStatus } from '../schemas/post.schema';

export class CreatePostDto {
    @ApiProperty({ example: 'My First Post' })
    @IsString()
    @MinLength(5)
    @MaxLength(200)
    title: string;

    @ApiProperty({ example: 'This is the content of my first post...' })
    @IsString()
    @MinLength(10)
    content: string;

    @ApiProperty({ example: 'A brief excerpt about my post', required: false })
    @IsOptional()
    @IsString()
    @MaxLength(500)
    excerpt?: string;

    @ApiProperty({
        example: 'draft',
        enum: PostStatus,
        required: false,
        default: PostStatus.DRAFT
    })
    @IsOptional()
    @IsEnum(PostStatus)
    status?: PostStatus;

    @ApiProperty({ example: ['technology', 'programming'], required: false })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    tags?: string[];

    @ApiProperty({ example: ['tutorial', 'guide'], required: false })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    categories?: string[];

    @ApiProperty({ example: 'https://example.com/featured-image.jpg', required: false })
    @IsOptional()
    @IsString()
    featuredImage?: string;
}