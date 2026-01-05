import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, MaxLength, IsOptional, IsEnum } from 'class-validator';
import { UserRole } from '../schemas/user.schema';

export class CreateUserDto {
    @ApiProperty({ example: 'user@example.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'Password123!' })
    @IsString()
    @MinLength(8)
    @MaxLength(100)
    password: string;

    @ApiProperty({ example: 'John Doe' })
    @IsString()
    @MinLength(2)
    @MaxLength(100)
    name: string;

    @ApiProperty({
        example: 'user',
        enum: UserRole,
        required: false,
        default: UserRole.USER
    })
    @IsOptional()
    @IsEnum(UserRole)
    role?: UserRole;

    @ApiProperty({ example: 'https://example.com/avatar.jpg', required: false })
    @IsOptional()
    @IsString()
    profilePicture?: string;
}