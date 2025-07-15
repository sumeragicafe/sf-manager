import { Request, Response, NextFunction } from 'express';
import { AuthService } from '@infra/services/AuthService';
import { IUserRepository } from '@domain/repositories/IUserRepository';

export function hasPermissions(
  requiredPermissions: string[],
  authService: AuthService,
  userRepo: IUserRepository
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.session.token;
      if (!token) {
        res.status(401).json({ error: 'Token não enviado' });
        return;
      }

      const payload = authService.verifyToken(token);
      const userId = payload.id;

      const permissions = await userRepo.getUserPermissions(userId);
      const hasAll = requiredPermissions.every(p => permissions?.includes(p));

      if (!hasAll) {
        res.status(403).json({ error: 'Permissões insuficientes' });
        return;
      }

      req.session.userId = userId;
      next();
    } catch (err: any) {
      res.status(401).json({ error: err.message });
      return;
    }
  };
}