import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength, MaxLength, IsEnum, IsEmail } from 'class-validator';
import { UserRole } from '../schemas/user.schema';

export class UpdateUserDto {
    @ApiProperty({ example: 'user@example.com', required: false })
    @IsOptional()
    @IsEmail()
    email?: string;

    @ApiProperty({ example: 'John Doe Updated', required: false })
    @IsOptional()
    @IsString()
    @MinLength(2)
    @MaxLength(100)
    name?: string;

    @ApiProperty({
        example: 'admin',
        enum: UserRole,
        required: false
    })
    @IsOptional()
    @IsEnum(UserRole)
    role?: UserRole;

    @ApiProperty({ example: 'https://example.com/new-avatar.jpg', required: false })
    @IsOptional()
    @IsString()
    profilePicture?: string;

    @ApiProperty({ example: ['tech', 'programming'], required: false })
    @IsOptional()
    @IsString({ each: true })
    preferences?: string[];

    @ApiProperty({ example: true, required: false })
    @IsOptional()
    isVerified?: boolean;
}