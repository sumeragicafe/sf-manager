export interface BreedProps {
  id: number;
  speciesId: number;
  name: string;
}

export class Breed {
  constructor(public props: BreedProps) {
    if (!props.name) throw new Error("Breed name is required.");
  }

  static createNew(speciesId: number, name: string): Breed {
    return new Breed({ id: 0, speciesId, name });
  }

  toPersistence(): Record<string, any> {
    return {
      id: this.props.id,
      species_id: this.props.speciesId,
      name: this.props.name,
    };
  }
}
