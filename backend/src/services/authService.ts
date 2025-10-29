import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient, User } from '@prisma/client';

const prisma = new PrismaClient();

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  company?: string;
}

interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

class AuthService {
  private readonly JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key';
  private readonly JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
  private readonly SALT_ROUNDS = 12;

  async register(userData: RegisterData): Promise<{ user: Omit<User, 'password'>; token: string }> {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email.toLowerCase() },
    });

    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, this.SALT_ROUNDS);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: userData.email.toLowerCase(),
        password: hashedPassword,
        firstName: userData.firstName,
        lastName: userData.lastName,
        company: userData.company,
      },
    });

    // Generate token
    const token = this.generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, token };
  }

  async login(credentials: LoginCredentials): Promise<{ user: Omit<User, 'password'>; token: string }> {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: credentials.email.toLowerCase() },
    });

    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new Error('Account is deactivated. Please contact support.');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Generate token
    const token = this.generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, token };
  }

  async getUserById(userId: string): Promise<Omit<User, 'password'> | null> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return null;
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async changePassword(userId: string, oldPassword: string, newPassword: string): Promise<boolean> {
    // Get user with password
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Verify old password
    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);

    if (!isOldPasswordValid) {
      throw new Error('Current password is incorrect');
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, this.SALT_ROUNDS);

    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword },
    });

    return true;
  }

  async updateProfile(userId: string, updateData: Partial<Pick<User, 'firstName' | 'lastName' | 'company'>>): Promise<Omit<User, 'password'>> {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  verifyToken(token: string): TokenPayload {
    try {
      const decoded = jwt.verify(token, this.JWT_SECRET) as TokenPayload;
      return decoded;
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  private generateToken(payload: TokenPayload): string {
    return jwt.sign(payload, this.JWT_SECRET, {
      expiresIn: this.JWT_EXPIRES_IN,
    });
  }

  async refreshToken(token: string): Promise<string> {
    try {
      const decoded = this.verifyToken(token);
      
      // Generate new token with fresh expiry
      return this.generateToken(decoded);
    } catch (error) {
      throw new Error('Invalid token for refresh');
    }
  }

  async deactivateUser(userId: string): Promise<boolean> {
    await prisma.user.update({
      where: { id: userId },
      data: { isActive: false },
    });

    return true;
  }

  async reactivateUser(userId: string): Promise<boolean> {
    await prisma.user.update({
      where: { id: userId },
      data: { isActive: true },
    });

    return true;
  }
}

export default new AuthService();