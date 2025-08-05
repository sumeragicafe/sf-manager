import { Request, Response, NextFunction } from 'express';

export function requireAuth(authService: AuthService) {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = req.session?.token;

    if (!token) {
      res.status(401).json({ message: 'Sessão não encontrada' });
      return;
    }

    try {
      const user = authService.verifyToken(token);
      req.user = user;
      next();
    } catch (error) {
      res.status(403).json({ error: 'Token inválido ou expirado' });
      return;
    }
  };
}