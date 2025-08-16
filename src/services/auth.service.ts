import prisma from "../../db/connection";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserResponse } from "../types/user.types";
import { UserService } from "./user.service";
import { CreateUserInput } from "../schemas/user.schema";

export class AuthService {
  private static instance: AuthService;
  private userService: UserService;

  private constructor() {
    this.userService = UserService.getInstance();
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  public async signIn(
    email: string,
    password: string
  ): Promise<{ token: string; user: UserResponse }> {
    const user = await this.userService.getUserByEmail(email);

    if (!user) {
      throw new Error("User not found");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password!);
    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

    let token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });

    return {
      token,
      user: {
        id: user.id.toString(),
        name: user.name,
        email: user.email,
      },
    };
  }

  public async signUp(
    user: CreateUserInput
  ): Promise<{ token: string; user: UserResponse }> {
    const existingUser = await prisma.user.findUnique({
      where: {
        email: user.email,
      },
    });

    if (existingUser) {
      throw new Error("User already exists");
    }

    const newUser = await this.userService.createUser(user);

    let token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });

    return {
      token,
      user: {
        id: newUser.id.toString(),
        name: newUser.name,
        email: newUser.email,
      },
    };
  }
}
