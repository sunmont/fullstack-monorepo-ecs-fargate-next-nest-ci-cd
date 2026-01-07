import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsOptional, MinLength, MaxLength } from "class-validator";

export class CreateCommentDto {
  @ApiProperty({ example: "This is a great post!" })
  @IsString()
  @MinLength(1)
  @MaxLength(1000)
  content: string;

  @ApiProperty({ example: "64f1b2c3d4e5f6a7b8c9d0e1" })
  @IsString()
  postId: string;

  @ApiProperty({
    example: "64f1b2c3d4e5f6a7b8c9d0e2",
    required: false,
    description: "ID of parent comment for nested comments",
  })
  @IsOptional()
  @IsString()
  parentCommentId?: string;

  @ApiProperty({
    example: ["@user1", "@user2"],
    required: false,
    description: "User mentions in the comment",
  })
  @IsOptional()
  @IsString({ each: true })
  mentions?: string[];
}
