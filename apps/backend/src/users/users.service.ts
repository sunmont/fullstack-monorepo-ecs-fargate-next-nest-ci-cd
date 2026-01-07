import {
  Injectable,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument, UserRole } from "./schemas/user.schema";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import * as bcrypt from "bcrypt";

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Check if user already exists
    const existingUser = await this.userModel.findOne({
      email: createUserDto.email,
    });

    if (existingUser) {
      throw new ConflictException("User with this email already exists");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });

    return user.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().select("-password -refreshToken").exec();
  }

  async findById(id: string): Promise<User> {
    const user = await this.userModel
      .findById(id)
      .select("-password -refreshToken")
      .exec();

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return user;
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .select("-password -refreshToken")
      .exec();

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return user;
  }

  async remove(id: string): Promise<void> {
    const result = await this.userModel.deleteOne({ _id: id }).exec();

    if (result.deletedCount === 0) {
      throw new NotFoundException("User not found");
    }
  }

  async updateRefreshToken(id: string, refreshToken: string): Promise<void> {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.userModel
      .updateOne({ _id: id }, { refreshToken: hashedRefreshToken })
      .exec();
  }

  async clearRefreshToken(id: string): Promise<void> {
    await this.userModel.updateOne({ _id: id }, { refreshToken: null }).exec();
  }

  async changePassword(
    id: string,
    oldPassword: string,
    newPassword: string,
  ): Promise<void> {
    const user = await this.userModel.findById(id).select("+password").exec();

    if (!user) {
      throw new NotFoundException("User not found");
    }

    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

    if (!isPasswordValid) {
      throw new ConflictException("Old password is incorrect");
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();
  }

  async updateProfilePicture(
    id: string,
    profilePicture: string,
  ): Promise<User> {
    const user = await this.userModel
      .findByIdAndUpdate(id, { profilePicture }, { new: true })
      .select("-password -refreshToken")
      .exec();

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return user;
  }

  async getUsersByRole(role: UserRole): Promise<User[]> {
    return this.userModel
      .find({ role })
      .select("-password -refreshToken")
      .exec();
  }

  async searchUsers(query: string): Promise<User[]> {
    return this.userModel
      .find({
        $or: [
          { name: { $regex: query, $options: "i" } },
          { email: { $regex: query, $options: "i" } },
        ],
      })
      .select("-password -refreshToken")
      .exec();
  }

  async getUsersStats(): Promise<{
    total: number;
    byRole: Record<UserRole, number>;
    activeToday: number;
  }> {
    const total = await this.userModel.countDocuments();

    const byRole = {
      [UserRole.USER]: await this.userModel.countDocuments({
        role: UserRole.USER,
      }),
      [UserRole.ADMIN]: await this.userModel.countDocuments({
        role: UserRole.ADMIN,
      }),
      [UserRole.MODERATOR]: await this.userModel.countDocuments({
        role: UserRole.MODERATOR,
      }),
    };

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const activeToday = await this.userModel.countDocuments({
      lastLogin: { $gte: today },
    });

    return {
      total,
      byRole,
      activeToday,
    };
  }
}
