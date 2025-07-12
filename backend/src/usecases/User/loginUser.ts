import { IUserRepository } from "@domain/repositories/IUserRepository";
import bcrypt from 'bcrypt';
import { AuthService } from '@infra/services/AuthService';

export function loginUser(userRepo: IUserRepository, authService: AuthService){
    return async (email: string, password: string) => {
        const user = await userRepo.findByEmail(email);
        if(!user) throw new Error("Usuário não encontrado");

        const valid = await bcrypt.compare(password, user.props.password);
        if(!valid) throw new Error("Invalid credentials");

        return authService.generateToken(
            {
                id: user.props.id,
                name: user.props.name,
                email: user.props.email,
                profile_picture_url: user.props.profilePictureUrl
            });
    }
}