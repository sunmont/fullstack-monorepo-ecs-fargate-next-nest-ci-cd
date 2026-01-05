import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Query,
    UseGuards,
    Request,
    Put,
    Delete
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/schemas/user.schema';
import { PaginationDto } from '@fullstack-monorepo/shared/dto/pagination.dto';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
    constructor(private readonly postsService: PostsService) {}

    @Post()
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Create a new post' })
    @ApiResponse({ status: 201, description: 'Post created successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async create(@Request() req, @Body() createPostDto: CreatePostDto) {
        return this.postsService.create(req.user.id, createPostDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all posts with pagination' })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiQuery({ name: 'status', required: false, enum: ['draft', 'published', 'archived'] })
    @ApiQuery({ name: 'search', required: false, type: String })
    @ApiResponse({ status: 200, description: 'Posts retrieved successfully' })
    async findAll(@Query() pagination: PaginationDto, @Request() req) {
        return this.postsService.findAll(pagination, req.user?.id);
    }

    @Get('trending')
    @ApiOperation({ summary: 'Get trending posts' })
    @ApiResponse({ status: 200, description: 'Trending posts retrieved' })
    async getTrending() {
        return this.postsService.getTrendingPosts(10);
    }

    @Get('stats')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Get post statistics (Admin only)' })
    @ApiResponse({ status: 200, description: 'Statistics retrieved' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    async getStats() {
        return this.postsService.getStats();
    }

    @Get('author/:authorId')
    @ApiOperation({ summary: 'Get posts by author' })
    @ApiResponse({ status: 200, description: 'Posts retrieved' })
    async getByAuthor(@Param('authorId') authorId: string) {
        return this.postsService.getPostsByAuthor(authorId);
    }

    @Get('search')
    @ApiOperation({ summary: 'Search posts' })
    @ApiQuery({ name: 'q', required: true, type: String })
    @ApiResponse({ status: 200, description: 'Search results' })
    async search(@Query('q') query: string, @Query() filters: any) {
        return this.postsService.searchPosts(query, filters);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a post by ID' })
    @ApiResponse({ status: 200, description: 'Post retrieved' })
    @ApiResponse({ status: 404, description: 'Post not found' })
    async findOne(@Param('id') id: string, @Request() req) {
        return this.postsService.findOne(id, req.user?.id);
    }

    @Put(':id')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Update a post' })
    @ApiResponse({ status: 200, description: 'Post updated' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiResponse({ status: 404, description: 'Post not found' })
    async update(
        @Param('id') id: string,
        @Request() req,
        @Body() updatePostDto: UpdatePostDto,
    ) {
        return this.postsService.update(id, req.user.id, updatePostDto);
    }

    @Delete(':id')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Delete (archive) a post' })
    @ApiResponse({ status: 200, description: 'Post archived' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiResponse({ status: 404, description: 'Post not found' })
    async remove(@Param('id') id: string, @Request() req) {
        return this.postsService.remove(id, req.user.id);
    }

    @Post(':id/like')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Like/Unlike a post' })
    @ApiResponse({ status: 200, description: 'Like status toggled' })
    async like(@Param('id') id: string, @Request() req) {
        return this.postsService.likePost(id, req.user.id);
    }
}