export interface AnimalProps {
    id?: string; // uuid
    name: string;
    species: string; // 'dog', 'cat', etc.
    breed?: string;
    age?: number; // in months
    gender: 'male' | 'female';
    size: 'small' | 'medium' | 'large';
    color?: string;
    description?: string;
    healthStatus?: string;
    isVaccinated: boolean;
    isCastrated: boolean;
    isAvailable: boolean;
    adoptionFee?: number;
    imageUrl?: string;
    rescueDate?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

export class Animal {
    constructor(public props: AnimalProps) {
        if (!props.name || !props.species) {
            throw new Error("Nome e espécie são obrigatórios para criar um animal.");
        }

        if (props.age && props.age < 0) {
            throw new Error("Idade deve ser um número positivo.");
        }

        if (props.adoptionFee && props.adoptionFee < 0) {
            throw new Error("Taxa de adoção deve ser um número positivo.");
        }
    }

    static createNew(data: Omit<AnimalProps, 'id' | 'createdAt' | 'updatedAt'>): Animal {
        const now = new Date();
        return new Animal({
            ...data,
            isAvailable: data.isAvailable ?? true,
            isVaccinated: data.isVaccinated ?? false,
            isCastrated: data.isCastrated ?? false,
            createdAt: now,
            updatedAt: now,
        });
    }

    toPersistence(): Record<string, any> {
        return {
            id: this.props.id,
            name: this.props.name,
            species: this.props.species,
            breed: this.props.breed,
            age: this.props.age,
            gender: this.props.gender,
            size: this.props.size,
            color: this.props.color,
            description: this.props.description,
            healthStatus: this.props.healthStatus,
            isVaccinated: this.props.isVaccinated,
            isCastrated: this.props.isCastrated,
            isAvailable: this.props.isAvailable,
            adoptionFee: this.props.adoptionFee,
            imageUrl: this.props.imageUrl,
            rescueDate: this.props.rescueDate,
            createdAt: this.props.createdAt,
            updatedAt: this.props.updatedAt
        };
    }

    markAsAdopted(): void {
        this.props.isAvailable = false;
        this.props.updatedAt = new Date();
    }

    markAsAvailable(): void {
        this.props.isAvailable = true;
        this.props.updatedAt = new Date();
    }

    get displayName(): string {
        return `${this.props.name} (${this.props.species})`;
    }

    get ageInYears(): number {
        return this.props.age ? Math.floor(this.props.age / 12) : 0;
    }
} 