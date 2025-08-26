// src/domain/entities/PetMedia.ts
export interface AnimalMediaProps {
  id: string; // uuid
  petId: string;
  mediaId: string;
  type: string;
}

export class AnimalMedia {
  constructor(public props: AnimalMediaProps) {
    if (!props.type) throw new Error("Media type is required.");
  }

  static createNew(petId: string, mediaId: string, type: string): AnimalMedia {
    return new AnimalMedia({
      id: crypto.randomUUID(),
      petId,
      mediaId,
      type,
    });
  }

  toPersistence(): Record<string, any> {
    return {
      id: this.props.id,
      pet_id: this.props.petId,
      media_id: this.props.mediaId,
      type: this.props.type,
    };
  }
}
