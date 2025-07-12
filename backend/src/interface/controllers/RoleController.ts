import { Request, Response } from 'express';
import { SequelizeRoleRepository } from '@infra/sequelize/repositories/SequelizeRoleRepository';

const roleRepo = new SequelizeRoleRepository();


export class RoleController {
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

      req.session.token = token;

      res.status(200).json({ token });
    } catch (err: any) {
      res.status(401).json({ error: err.message });
    }
  }

  static async list(req: Request, res: Response) {
    try {
      let responseBody = ["teste", "teste1"];

      res.status(200).json({ responseBody });
    } catch (err: any) {
      res.status(401).json({ error: err.message });
    }
  }
  
}
