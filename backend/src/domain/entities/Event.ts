export interface EventProps {
    id?: string; //uuid
    name: string;
    description: string;
    startAt: Date;
    endAt: Date;
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
            createdAt: this.props.startAt,
            updatedAt: this.props.endAt,
        };
    }
}