import { Request, Response } from 'express';
import { SequelizeUserRepository } from '@infra/sequelize/repositories/SequelizeUserRepository';
import { AuthService } from '@infra/services/AuthService';
import { registerUser } from '@usecases/User/registerUser';
import { loginUser } from '@usecases/User/loginUser';
import { getUserPermissions } from '@usecases/User/getUserPermissions';

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

      req.session.token = token;

      res.status(200).json({ token });
    } catch (err: any) {
      res.status(401).json({ error: err.message });
    }
  }

  static async list(req: Request, res: Response) {
    try {
      const users = await userRepo.list();

      const serialized = users.map(user => user.toPersistence());

      res.status(200).json(serialized);
    } catch (err: any) {
      res.status(401).json({ error: err.message });
    }
  }

  static async getUserPermissions(req: Request, res: Response) {
    const token = req.cookies.token;

    console.log(token);

    if (!token) return res.status(401).json({ error: 'Token não enviado' });

    try {
      const payload = authService.verifyToken(token);
      req.session.userId = payload.id;  // Salva userId na sessão para uso futuro

      // Agora busque as permissões
      const permissions = await userRepo.getUserPermissions(payload.id);

      return res.status(200).json(permissions);
    } catch (err: any) {
      return res.status(401).json({ error: err.message });
    }
  }

}
