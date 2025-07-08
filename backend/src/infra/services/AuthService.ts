import jwt from 'jsonwebtoken';

export class AuthService{
    constructor(private secret: string) {}

    generateToken(payload: object): string {
        return jwt.sign(payload, this.secret, {expiresIn: '1h'});
    }
}