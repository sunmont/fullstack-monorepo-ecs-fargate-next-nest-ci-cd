import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, MaxLength, Matches, IsOptional } from 'class-validator';

export class RegisterDto {
    @ApiProperty({ example: 'user@example.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'Password123!' })
    @IsString()
    @MinLength(8)
    @MaxLength(100)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'Password too weak',
    })
    password: string;

    @ApiProperty({ example: 'John Doe' })
    @IsString()
    @MinLength(2)
    @MaxLength(100)
    name: string;

    @ApiProperty({ example: 'https://example.com/avatar.jpg', required: false })
    @IsOptional()
    @IsString()
    profilePicture?: string;
}