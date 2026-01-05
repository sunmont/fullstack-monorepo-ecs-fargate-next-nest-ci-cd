import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { AuthService } from '../../src/auth/auth.service';
import { User } from '../../src/users/schemas/user.schema';
import { LoginDto } from '../../src/auth/dto/login.dto';
import { RegisterDto } from '../../src/auth/dto/register.dto';

describe('AuthService', () => {
    let service: AuthService;
    let userModel: any;
    let jwtService: JwtService;

    const mockUser = {
        _id: '507f1f77bcf86cd799439011',
        email: 'test@example.com',
        password: 'hashedPassword',
        name: 'Test User',
        role: 'user',
        save: jest.fn(),
        toObject: jest.fn().mockReturnValue({
            _id: '507f1f77bcf86cd799439011',
            email: 'test@example.com',
            name: 'Test User',
            role: 'user',
        }),
    };

    const mockUserModel = {
        findOne: jest.fn(),
        create: jest.fn(),
        findById: jest.fn(),
        findByIdAndUpdate: jest.fn(),
    };

    const mockJwtService = {
        sign: jest.fn(),
        verify: jest.fn(),
    };

    const mockConfigService = {
        get: jest.fn().mockImplementation((key: string) => {
            switch (key) {
                case 'JWT_SECRET':
                    return 'test-secret';
                case 'JWT_EXPIRATION':
                    return '15m';
                case 'JWT_REFRESH_SECRET':
                    return 'test-refresh-secret';
                case 'JWT_REFRESH_EXPIRATION':
                    return '7d';
                default:
                    return null;
            }
        }),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: getModelToken(User.name),
                    useValue: mockUserModel,
                },
                {
                    provide: JwtService,
                    useValue: mockJwtService,
                },
                {
                    provide: ConfigService,
                    useValue: mockConfigService,
                },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
        userModel = module.get(getModelToken(User.name));
        jwtService = module.get<JwtService>(JwtService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('validateUser', () => {
        it('should validate user successfully', async () => {
            const loginDto: LoginDto = {
                email: 'test@example.com',
                password: 'Password123!',
            };

            userModel.findOne.mockResolvedValue({
                ...mockUser,
                password: await bcrypt.hash(loginDto.password, 10),
            });

            bcrypt.compare = jest.fn().mockResolvedValue(true);

            const result = await service.validateUser(loginDto.email, loginDto.password);

            expect(userModel.findOne).toHaveBeenCalledWith({ email: loginDto.email });
            expect(result.email).toBe(loginDto.email);
        });

        it('should throw UnauthorizedException for invalid credentials', async () => {
            userModel.findOne.mockResolvedValue(null);

            await expect(
                service.validateUser('wrong@example.com', 'wrongPassword'),
            ).rejects.toThrow('Invalid credentials');
        });
    });

    describe('login', () => {
        it('should login successfully', async () => {
            const loginDto: LoginDto = {
                email: 'test@example.com',
                password: 'Password123!',
            };

            jest.spyOn(service, 'validateUser').mockResolvedValue(mockUser as any);
            mockJwtService.sign
                .mockReturnValueOnce('access-token')
                .mockReturnValueOnce('refresh-token');
            userModel.findByIdAndUpdate.mockResolvedValue({});

            const result = await service.login(loginDto);

            expect(result).toHaveProperty('access_token');
            expect(result).toHaveProperty('refresh_token');
            expect(result).toHaveProperty('user');
        });
    });

    describe('register', () => {
        it('should register new user successfully', async () => {
            const registerDto: RegisterDto = {
                email: 'new@example.com',
                password: 'Password123!',
                name: 'New User',
            };

            userModel.findOne.mockResolvedValue(null);
            bcrypt.hash = jest.fn().mockResolvedValue('hashedPassword');
            userModel.create.mockResolvedValue(mockUser);

            const result = await service.register(registerDto);

            expect(result.message).toBe('Registration successful');
            expect(result.user.email).toBe(registerDto.email);
        });

        it('should throw ConflictException for existing email', async () => {
            const registerDto: RegisterDto = {
                email: 'existing@example.com',
                password: 'Password123!',
                name: 'Existing User',
            };

            userModel.findOne.mockResolvedValue(mockUser);

            await expect(service.register(registerDto)).rejects.toThrow(
                'User with this email already exists',
            );
        });
    });
});