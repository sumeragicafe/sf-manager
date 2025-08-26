export interface VaccineProps {
  id: number;
  name: string;
  description?: string;
}

export class Vaccine {
  constructor(public props: VaccineProps) {
    if (!props.name) throw new Error("Nome da Vacina é obrigatório");
  }

  static createNew(name: string, description?: string): Vaccine {
    return new Vaccine({ id: 0, name, description });
  }

  toPersistence(): Record<string, any> {
    return {
      id: this.props.id,
      name: this.props.name,
      description: this.props.description,
    };
  }
}
