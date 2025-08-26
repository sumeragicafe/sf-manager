export interface EventProps {
    id?: string; //uuid
    name: string;
    description: string;
    place: string;
    start_at: Date;
    end_at: Date;
}

export class Event {
    constructor(public props: EventProps) {
    }

    static createNew(data: Omit<EventProps, 'id'>): Event {
        return new Event({
        ...data
        });
    }

    toPersistence(): Record<string, any> {
        return {
            id: this.props.id,
            name: this.props.name,
            description: this.props.description,
            place: this.props.place,
            start_at: this.props.start_at,
            end_at: this.props.end_at,
        };
    }
}