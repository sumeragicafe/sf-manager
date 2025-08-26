export interface AnimalFactProps {
  id: string; 
  petId: string;
  type: string;
  text: string;
  date: Date;
}

export class AnimalFact {
  constructor(public props: AnimalFactProps) {
    if (!props.type) throw new Error("Tipo de fato é obrigatório");
  }

  static createNew(petId: string, type: string, text: string, date: Date): AnimalFact {
    return new AnimalFact({
      id: crypto.randomUUID(),
      petId,
      type,
      text,
      date,
    });
  }

  toPersistence(): Record<string, any> {
    return {
      id: this.props.id,
      pet_id: this.props.petId,
      type: this.props.type,
      text: this.props.text,
      date: this.props.date,
    };
  }
}
