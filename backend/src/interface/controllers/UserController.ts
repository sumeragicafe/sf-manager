import { Request, Response } from 'express';
import { userRepositorySingleton } from 'src/dependencies/singletons';
import { authServiceSingleton } from 'src/dependencies/singletons';

import { registerUser } from '@usecases/User/registerUser';
import { loginUser } from '@usecases/User/loginUser';
import { listUserPermissions } from '@usecases/User/listUserPermissions';
import { deleteUser } from '@usecases/User/deleteUser';
import { updateUser } from '@usecases/User/updateUser';
import { adminChangePassword } from '@usecases/User/adminChangePassword';
import { changePassword } from '@usecases/User/changePassword';


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

  static async delete(req: Request, res: Response) {
    const { id } = req.params;

    try {
      await deleteUser(userRepositorySingleton)(id);
      res.status(200).json({ message: 'Usuário deletado com sucesso' });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  static async update(req: Request, res: Response) {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ error: 'ID do usuário não informado' });
      return;
    }

    const updatedUserProps = { ...req.body, id };

    try {
      const updatedUser = await updateUser(userRepositorySingleton)(updatedUserProps);

      if (!updatedUser) {
        res.status(404).json({ error: 'Usuário não encontrado' });
      }

      res.status(200).json({
        message: 'Usuário atualizado com sucesso',
        user: updatedUser.toPersistence()
      });
    } catch (err: any) {
      // Se o erro for de usuário não encontrado, retorne 404
      if (err.message === 'Usuário não encontrado') {
        res.status(404).json({ error: err.message });
      }else{
        res.status(400).json({ error: err.message });
      }
    } finally {
      return;
    }
  }

   // Usuário troca a própria senha (precisa informar senha antiga)
  static async changePassword(req: Request, res: Response) {
    const userId = req.user?.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      res.status(400).json({ error: 'Senha atual e nova senha são obrigatórias.' });
      return;
    }

    try {
      await changePassword(userRepositorySingleton)(userId, currentPassword, newPassword);
      res.status(200).json({ message: 'Senha alterada com sucesso.' });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    } finally{
      return;
    }
  }

  // Admin troca a senha de um usuário (sem senha antiga)
  static async adminChangePassword(req: Request, res: Response) {
    const userId = req.params.id;
    const { newPassword } = req.body;

    if (!newPassword) {
      res.status(400).json({ error: 'Nova senha é obrigatória.' });
      return;
    }

    try {
      const message = await adminChangePassword(userRepositorySingleton)(userId, newPassword);
      res.status(200).json({ message: message });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    } finally{
      return;
    }
  }

}
