import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, MinLength, MaxLength } from 'class-validator';

export class UpdateCommentDto {
    @ApiProperty({
        example: 'Updated comment content',
        required: false
    })
    @IsOptional()
    @IsString()
    @MinLength(1)
    @MaxLength(1000)
    content?: string;

    @ApiProperty({
        example: ['@user3'],
        required: false
    })
    @IsOptional()
    @IsString({ each: true })
    mentions?: string[];
}