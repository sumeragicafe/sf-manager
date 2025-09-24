
export interface AnimalVaccineProps {
  id?: string;
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

  static createNew(data: Omit<AnimalVaccineProps, 'id'>): AnimalVaccine {
     const now = new Date();
    return new AnimalVaccine({
      ...data,
      applicationDate: data.applicationDate ?? now
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
