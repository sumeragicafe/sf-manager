import { Request, Response, NextFunction } from 'express';

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session || !req.session.token) {
    res.status(401).json({ error: 'Usuário não autenticado' });
    return;
  }
  next();
}
