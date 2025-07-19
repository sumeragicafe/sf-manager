import { Request, Response, NextFunction } from 'express';

// export function requireAuth(req: Request, res: Response, next: NextFunction) {
//   if (!req.session || !req.session.token) {
//     res.status(401).json({ error: 'Usuário não autenticado' });
//     return;
//   }
//   next();
// }

export function requireAuth(authService: AuthService) {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = req.session?.token;

    if (!token) {
      res.status(401).json({ error: 'Sessão não encontrada' });
      return;
    }

    try {
      const user = authService.verifyToken(token);
      req.user = user; // opcional: anexar ao req
      next();
    } catch (error) {
      res.status(403).json({ error: 'Token inválido ou expirado' });
      return;
    }
  };
}