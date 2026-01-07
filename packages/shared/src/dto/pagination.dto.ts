import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsInt, Min, Max, IsString, IsIn, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationDto {
    @ApiProperty({ required: false, default: 1, minimum: 1 })
    @IsOptional()
    @IsInt()
    @Min(1)
    page?: number = 1;

    @ApiProperty({ required: false, default: 10, minimum: 1, maximum: 100 })
    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(100)
    limit?: number = 10;

    @ApiProperty({ required: false, default: 'createdAt' })
    @IsOptional()
    @IsString()
    sortBy?: string = 'createdAt';

    @ApiProperty({ required: false, default: 'desc', enum: ['asc', 'desc'] })
    @IsOptional()
    @IsString()
    @IsIn(['asc', 'desc'])
    sortOrder?: 'asc' | 'desc' = 'desc';

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    search?: string;

    @IsOptional()
    @IsString()
    status?: string;

    @IsOptional()
    @IsString()
    author?: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true }) // Ensures every item in the array is a string
    tags?: string[];

    @IsOptional()
    @IsString()
    category?: string;

    @IsOptional()
    @IsString()
    includeDrafts?: string;

    @IsOptional()
    @IsString()
    publishedAt?: string;

    constructor(partial?: Partial<PaginationDto>) {
        if (partial) {
            Object.assign(this, partial);
        }
    }

    get skip(): number {
        const page = this.page ?? 1;
        const limit = this.limit ?? 10;
        return (page - 1) * limit;
    }
}