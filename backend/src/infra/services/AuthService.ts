import jwt from 'jsonwebtoken';

export class AuthService{
    constructor(private secret: string) {}

    generateToken(payload: object): string {
        return jwt.sign(payload, this.secret, {expiresIn: '1h'});
    }

    verifyToken(token: string): any {
        try {
        return jwt.verify(token, this.secret);
        } catch (error) {
        throw new Error('Token inválido ou expirado');
        }
    }
}