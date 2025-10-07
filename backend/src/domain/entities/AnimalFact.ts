export interface AnimalFactProps {
  id?: string;
  petId: string;
  text: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class AnimalFact {
  constructor(public props: AnimalFactProps) {
    if (!props.text) throw new Error("Texto do fato é obrigatório");
    if (!props.petId) throw new Error("ID do pet é obrigatório");
  }

  static createNew(petId: string, type: string, text: string): AnimalFact {
    const now = new Date();
    return new AnimalFact({
      petId,
      text,
      createdAt: now,
      updatedAt: now,
    });
  }

  toPersistence(): Record<string, any> {
    return {
      ...(this.props.id && { id: this.props.id }), // inclui id só se existir
      pet_id: this.props.petId,
      text: this.props.text,
      created_at: this.props.createdAt,
      updated_at: this.props.updatedAt,
    };
  }
}
