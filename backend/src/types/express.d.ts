import { UserProps } from '@domain/entities/User';

declare global {
  namespace Express {
    interface Request {
      user?: UserProps;
      file?: any;
    }
  }
} 