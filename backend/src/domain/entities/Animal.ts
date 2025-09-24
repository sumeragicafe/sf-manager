import crypto from 'crypto';
import { SpeciesProps } from "@domain/entities/Species";
import { BreedProps } from "@domain/entities/Breed";
import { AnimalFactProps } from "@domain/entities/AnimalFact";
import { AnimalVaccineProps } from "@domain/entities/AnimalVaccine";
import { AnimalMediaProps } from "@domain/entities/AnimalMedia";

export interface AnimalProps {
  id: string; // uuid
  name: string;
  speciesId?: number;
  breedId?: number;
  gender: string; // "M" or "F"
  size: string;   // "Small", "Medium", "Large"
  status: string;
  isCastrated: boolean;
  notes?: string;
  entryDate: Date;
  birthDate?: Date;
  isBirthDateEstimated: boolean;

  // Relations
  adoption?: string;
  species?: SpeciesProps;
  breed?: BreedProps;
  facts?: AnimalFactProps[];
  vaccines?: AnimalVaccineProps[];
  media?: AnimalMediaProps[];
}

export class Animal {
  constructor(public props: AnimalProps) {
    if (!props.name) throw new Error("Animal name is required.");
  }

  static createNew(data: Omit<AnimalProps, 'id'>): Animal {
    return new Animal({
      ...data,
      id: crypto.randomUUID(),
    });
  }

  toPersistence(): Record<string, any> {
    return {
      id: this.props.id,
      name: this.props.name,
      speciesId: this.props.speciesId,
      breedId: this.props.breedId,
      gender: this.props.gender,
      size: this.props.size,
      status: this.props.status,
      isCastrated: this.props.isCastrated,
      notes: this.props.notes,
      entryDate: this.props.entryDate,
      birthDate: this.props.birthDate,
      isBirthDateEstimated: this.props.isBirthDateEstimated,
    };
  }
}