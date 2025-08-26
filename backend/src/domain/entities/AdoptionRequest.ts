export interface AdoptionRequestProps {
    id?: string; // uuid
    responsibleName: string;
    contactPhone: string;
    animalId: string;
    termsAccepted: boolean;
    status: 'pending' | 'approved' | 'rejected' | 'completed';
    submittedAt?: Date;
    reviewedAt?: Date;
    reviewedBy?: string; // userId who reviewed
    notes?: string;
    createdAt?: Date;
    updatedAt?: Date;
    
    // Relations
    animal?: any; // Will be populated with Animal data
}

export class AdoptionRequest {
    constructor(public props: AdoptionRequestProps) {
        if (!props.responsibleName || !props.contactPhone || !props.animalId) {
            throw new Error("Nome, telefone e ID do animal são obrigatórios.");
        }

        if (!props.termsAccepted) {
            throw new Error("Os termos de adoção devem ser aceitos.");
        }

        if (!this.isValidPhone(props.contactPhone)) {
            throw new Error("Formato de telefone inválido.");
        }
    }

    static createNew(data: Omit<AdoptionRequestProps, 'id' | 'createdAt' | 'updatedAt' | 'submittedAt' | 'status'>): AdoptionRequest {
        const now = new Date();
        return new AdoptionRequest({
            ...data,
            status: 'pending',
            submittedAt: now,
            createdAt: now,
            updatedAt: now,
        });
    }

    toPersistence(): Record<string, any> {
        return {
            id: this.props.id,
            responsibleName: this.props.responsibleName,
            contactPhone: this.props.contactPhone,
            animalId: this.props.animalId,
            termsAccepted: this.props.termsAccepted,
            status: this.props.status,
            submittedAt: this.props.submittedAt,
            reviewedAt: this.props.reviewedAt,
            reviewedBy: this.props.reviewedBy,
            notes: this.props.notes,
            createdAt: this.props.createdAt,
            updatedAt: this.props.updatedAt
        };
    }

    approve(reviewedBy: string, notes?: string): void {
        this.props.status = 'approved';
        this.props.reviewedAt = new Date();
        this.props.reviewedBy = reviewedBy;
        this.props.notes = notes;
        this.props.updatedAt = new Date();
    }

    reject(reviewedBy: string, notes?: string): void {
        this.props.status = 'rejected';
        this.props.reviewedAt = new Date();
        this.props.reviewedBy = reviewedBy;
        this.props.notes = notes;
        this.props.updatedAt = new Date();
    }

    complete(): void {
        this.props.status = 'completed';
        this.props.updatedAt = new Date();
    }

    private isValidPhone(phone: string): boolean {
        // Remove all non-digits
        const cleanPhone = phone.replace(/\D/g, '');
        // Brazilian phone: 10 or 11 digits
        return cleanPhone.length === 10 || cleanPhone.length === 11;
    }

    get isPending(): boolean {
        return this.props.status === 'pending';
    }

    get isApproved(): boolean {
        return this.props.status === 'approved';
    }
} 