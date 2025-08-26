export interface SpeciesProps {
  id: number;
  name: string;
}

export class Species {
  constructor(public props: SpeciesProps) {
    if (!props.name) throw new Error("Nome da espécie é obrigatório");
  }

  static createNew(name: string): Species {
    return new Species({ id: 0, name });
  }

  toPersistence(): Record<string, any> {
    return {
      id: this.props.id,
      name: this.props.name,
    };
  }
}
