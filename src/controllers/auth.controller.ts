import { AuthService } from "../services/auth.service";
import { Request, Response } from "express";
import logger from "../lib/logger";

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
    try {
      const { email, password } = req.body;
      logger.info(`Sign in attempt for email: ${email}`);
      
      const { token, user } = await this.authService.signIn(
        email,
        password as string
      );
      
      logger.info(`User signed in successfully: ${email}`);
      res.json({ token, user });
    } catch (error: any) {
      logger.error('Sign in failed:', { 
        error: error.message, 
        email: req.body.email,
        ip: req.ip 
      });
      res.status(400).json({ error: error.message });
    }
  }

  public async signUp(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body;
      logger.info(`Sign up attempt for email: ${email}, name: ${name}`);
      
      const { token, user } = await this.authService.signUp({
        name,
        email,
        password,
      });
      
      logger.info(`User signed up successfully: ${email}`);
      res.json({ token, user });
    } catch (error: any) {
      logger.error('Sign up failed:', { 
        error: error.message, 
        email: req.body.email,
        name: req.body.name,
        ip: req.ip 
      });
      res.status(400).json({ error: error.message });
    }
  }
}
