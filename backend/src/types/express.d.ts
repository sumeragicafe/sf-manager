import { UserProps } from '@domain/entities/User';

declare global {
  namespace Express {
    interface Request {
      session?: object;
      user?: UserProps;
      file?: any;
    }
  }
} 