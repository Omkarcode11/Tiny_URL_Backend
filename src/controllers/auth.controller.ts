import { AuthService } from "../services/auth.service";
import { Request, Response } from "express";

export class AuthController {
  private static instance: AuthController;
  private authService: AuthService;

  private constructor() {
    this.authService = AuthService.getInstance();
  }

  public static getInstance(): AuthController {
    if (!AuthController.instance) {
      AuthController.instance = new AuthController();
    }
    return AuthController.instance;
  }

  public async signIn(req: Request, res: Response) {
    const { email, password } = req.body;
    const { token, user } = await this.authService.signIn(
      email,
      password as string
    );
    res.json({ token, user });
  }

  public async signUp(req: Request, res: Response) {
    const { name, email, password } = req.body;
    const { token, user } = await this.authService.signUp({
      name,
      email,
      password,
    });
    res.json({ token, user });
  }
}
