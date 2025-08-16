import prisma from "../../db/connection";
import { CreateUserInput } from "../schemas/user.schema";
import { CreateUserResponse, UserResponse } from "../types/user.types";

export class UserService {
    private static instance: UserService;

    public static getInstance(): UserService {
        if (!UserService.instance) {
            UserService.instance = new UserService();
        }
        return UserService.instance;
    }

    public async createUser(user: CreateUserInput): Promise<CreateUserResponse> {
        const newUser = await prisma.user.create({
            data: {
                name: user.name,
                email: user.email,
                password: user.password
            }
        });
        return {
            id: newUser.id.toString(),
            name: newUser.name,
            email: newUser.email
        };
    }

    public async getUser(id: string): Promise<UserResponse> {
        const user = await prisma.user.findUnique({
            where: {
                id: parseInt(id)
            }
        });

        if (!user) {
            throw new Error("User not found");
        }

        return {
            id: user.id.toString(),
            name: user.name,
            email: user.email
        };
    }

    public async getUserByEmail(email: string): Promise<UserResponse | null> {
        const user = await prisma.user.findUnique({
            where: {
                email
            }
        });

        if (!user) {
            return null;
        }

        return {
            id: user.id.toString(),
            name: user.name,
            email: user.email,
            password: user.password
        };
    }

    public async updateUser(id: string, user: CreateUserInput): Promise<UserResponse> {
        const updatedUser = await prisma.user.update({
            where: {
                id: parseInt(id)
            },
            data: {
                name: user.name,
                email: user.email
            }
        });

        return {
            id: updatedUser.id.toString(),
            name: updatedUser.name,
            email: updatedUser.email
        };
    }

    public async getOrCreateUser(user: CreateUserInput): Promise<CreateUserResponse> {
        const existingUser = await prisma.user.findUnique({
            where: {
                email: user.email
            }
        });

        if (existingUser) {
            return {
                id: existingUser.id.toString(),
                name: existingUser.name,
                email: existingUser.email
            };
        }

        return this.createUser(user);
    }
}