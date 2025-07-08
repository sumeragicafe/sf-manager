export interface UserProps{
    id?: string; //uuid
    name: string;
    username: string;
    email: string;
    password: string;
    profilePictureUrl?: string;
    createdAt?: Date;
    updatedAt?: Date;
    lastLoginAt?:Date;
    isActive:boolean;
    role?: string;
}

export class User{
    constructor(public props: UserProps){
        if(!props.email || !props.password){
            throw new Error("Email e senha não passados ao criar o usuário.");
        }

        if(props.email && !this.isValidEmail(props.email)){
            throw new Error("Invalid email format.");
        }
    }

    static createNew(data: Omit<UserProps, 'id' | 'createdAt' | 'updatedAt' | 'lastLoginAt' | 'profilePictureUrl'>): User {
        const now = new Date();
        return new User({
        ...data,
        isActive: true,
        createdAt: now,
        updatedAt: now
        });
    }

    toPersistence(): Record<string, any> {
        return {
            id: this.props.id,
            name: this.props.name,
            username: this.props.username,
            email: this.props.email,
            password: this.props.password,
            profilePictureUrl: this.props.profilePictureUrl,
            isActive: this.props.isActive,
            createdAt: this.props.createdAt,
            updatedAt: this.props.updatedAt,
            lastLoginAt: this.props.lastLoginAt,
            role: this.props.role
        };
    }


    private isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    get fullName(): string | undefined {
        return this.props.name;
    }
}