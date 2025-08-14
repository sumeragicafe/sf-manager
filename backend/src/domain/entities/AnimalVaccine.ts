export interface AnimalVaccineProps {
  id: string; // uuid
  petId: string;
  vaccineId: number;
  applicationDate: Date;
  applicator?: string;
}

export class AnimalVaccine {
  constructor(public props: AnimalVaccineProps) {
    if (!props.petId || !props.vaccineId) {
      throw new Error("Pet and vaccine IDs are required.");
    }
  }

  static createNew(petId: string, vaccineId: number, applicationDate: Date, applicator?: string): AnimalVaccine {
    return new AnimalVaccine({
      id: crypto.randomUUID(),
      petId,
      vaccineId,
      applicationDate,
      applicator,
    });
  }

  toPersistence(): Record<string, any> {
    return {
      id: this.props.id,
      pet_id: this.props.petId,
      vaccine_id: this.props.vaccineId,
      application_date: this.props.applicationDate,
      applicator: this.props.applicator,
    };
  }
}
