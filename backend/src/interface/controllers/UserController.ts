import { Request, Response } from 'express';
import { SequelizeUserRepository } from '@infra/sequelize/repositories/SequelizeUserRepository';
import { AuthService } from '@infra/services/AuthService';
import { registerUser } from '@usecases/User/registerUser';
import { loginUser } from '@usecases/User/loginUser';

const userRepo = new SequelizeUserRepository();
const authService = new AuthService(process.env.JWT_SECRET || 'secret');

export class UserController {
  static async register(req: Request, res: Response) {
    try {
      const user = await registerUser(userRepo)(req.body); // usa o DTO
      res.status(201).json({
        id: user.props.id,
        email: user.props.email,
        username: user.props.username
      });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const token = await loginUser(userRepo, authService)(
        req.body.email,
        req.body.password
      );

      res.status(200).json({ token });
    } catch (err: any) {
      res.status(401).json({ error: err.message });
    }
  }
}
