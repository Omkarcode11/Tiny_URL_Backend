import { UserService } from "../services/user.service";
import { Request, Response } from "express";
import { createUserSchema } from "../schemas/user.schema";

export class UserController {
  private static instance: UserController;
  private userService: UserService;

  private constructor() {
    this.userService = UserService.getInstance();
  }

  public static getInstance(): UserController {
    if (!UserController.instance) {
      UserController.instance = new UserController();
    }
    return UserController.instance;
  }

  public async createUser(req: Request, res: Response) {
    try {
        const { name, email, password } = createUserSchema.parse(req.body);
        const user = await this.userService.getOrCreateUser({ name, email, password });
        res.status(201).json(user);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
  }

  public async getUser(req: Request, res: Response) {
    try {
        const { id } = req.params;
        
        if (!id) {
          res.status(400).json({ error: 'User ID is required' });
          return;
        }
        
        const user = await this.userService.getUser(id as string);
        res.status(200).json(user);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
  }

  public async updateUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      if (!id) {
        res.status(400).json({ error: 'User ID is required' });
        return;
      }
      
      const { name, email, password } = createUserSchema.parse(req.body);
      const user = await this.userService.updateUser(id as string, {
        name,
        email,
        password,
      });
      res.status(200).json(user);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
  }

}
