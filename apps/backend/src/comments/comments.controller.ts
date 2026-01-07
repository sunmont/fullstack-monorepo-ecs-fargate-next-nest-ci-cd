import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
  UseGuards,
  Request,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from "@nestjs/swagger";
import { CommentsService } from "./comments.service";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { UpdateCommentDto } from "./dto/update-comment.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { UserRole } from "../users/schemas/user.schema";

@ApiTags("comments")
@Controller("comments")
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Create a new comment" })
  @ApiResponse({ status: 201, description: "Comment created successfully" })
  @ApiResponse({ status: 404, description: "Post not found" })
  async create(@Request() req, @Body() createCommentDto: CreateCommentDto) {
    return this.commentsService.create(
      req.user.id,
      createCommentDto.postId,
      createCommentDto,
    );
  }

  @Get("post/:postId")
  @ApiOperation({ summary: "Get comments for a post" })
  @ApiQuery({ name: "page", required: false, type: Number, default: 1 })
  @ApiQuery({ name: "limit", required: false, type: Number, default: 20 })
  @ApiResponse({ status: 200, description: "Comments retrieved successfully" })
  async findAllByPost(
    @Param("postId") postId: string,
    @Query("page") page = 1,
    @Query("limit") limit = 20,
  ) {
    return this.commentsService.findAllByPost(postId, page, limit);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a comment by ID" })
  @ApiResponse({ status: 200, description: "Comment retrieved" })
  @ApiResponse({ status: 404, description: "Comment not found" })
  async findOne(@Param("id") id: string) {
    return this.commentsService.findOne(id);
  }

  @Put(":id")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Update a comment" })
  @ApiResponse({ status: 200, description: "Comment updated" })
  @ApiResponse({ status: 403, description: "Forbidden" })
  @ApiResponse({ status: 404, description: "Comment not found" })
  async update(
    @Param("id") id: string,
    @Request() req,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return this.commentsService.update(id, req.user.id, updateCommentDto);
  }

  @Delete(":id")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Delete a comment" })
  @ApiResponse({ status: 200, description: "Comment deleted" })
  @ApiResponse({ status: 403, description: "Forbidden" })
  @ApiResponse({ status: 404, description: "Comment not found" })
  async remove(@Param("id") id: string, @Request() req) {
    return this.commentsService.remove(
      id,
      req.user.id,
      req.user.role === UserRole.ADMIN,
    );
  }

  @Post(":id/like")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Like/Unlike a comment" })
  @ApiResponse({ status: 200, description: "Like status toggled" })
  async like(@Param("id") id: string, @Request() req) {
    return this.commentsService.likeComment(id, req.user.id);
  }

  @Get("post/:postId/stats")
  @ApiOperation({ summary: "Get comment statistics for a post" })
  @ApiResponse({ status: 200, description: "Statistics retrieved" })
  async getCommentStats(@Param("postId") postId: string) {
    return this.commentsService.getCommentStats(postId);
  }
}
