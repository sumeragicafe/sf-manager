import { Request, Response } from 'express';
import { userRepositorySingleton } from 'src/dependencies/singletons';
import { authServiceSingleton } from 'src/dependencies/singletons';

import { registerUser } from '@usecases/User/registerUser';
import { loginUser } from '@usecases/User/loginUser';
import { listUserPermissions } from '@usecases/User/listUserPermissions';

export class UserController {
  static async register(req: Request, res: Response) {
    try {

      const user = await registerUser(userRepositorySingleton)(req.body); // usa o DTO
      res.status(201).json({
        id: user.props.id,
        email: user.props.email,
        username: user.props.username,
        createdAt: user.props.createdAt,
        lastLoginAt: user.props.lastLoginAt,
        roleId: user.props.roleId,
        role: user.props.role
      });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
  
  static async login(req: Request, res: Response) {
    try {
      const token = await loginUser(userRepositorySingleton, authServiceSingleton)(
        req.body.email,
        req.body.password
      );

      req.session.token = token;

      res.status(200).json({ token });
    } catch (err: any) {
      res.status(401).json({ error: err.message });
    }
  }

  static async logout(req: Request, res: Response) {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao encerrar sessão' });
      }
      res.clearCookie('connect.sid'); // nome do cookie pode variar
      return res.status(200).json({ message: 'Logout realizado com sucesso' });
    });
  }


  static async list(req: Request, res: Response) {
    try {
      const users = await userRepositorySingleton.list();

      const serialized = users.map(user => user.toPersistence());

      res.status(200).json(serialized);
    } catch (err: any) {
      res.status(401).json({ error: err.message });
    }
  }

  static async listPermissions(req: Request, res: Response) {
    const token = req.session.token;

    if (!token){
      res.status(401).json({ error: 'Token não enviado' });
      return;
    } 

    try {
      const payload = authServiceSingleton.verifyToken(token);
      req.session.userId = payload.id;  // Salva userId na sessão para uso futuro

      // Agora busque as permissões
      //const permissions = await getUserPermissions(payload.id);
      const permissions = await listUserPermissions(userRepositorySingleton)(req.session.userId);

      res.status(200).json(permissions);
      return;
    } catch (err: any) {
      res.status(401).json({ error: err.message });
      return;
    }
  }

}
