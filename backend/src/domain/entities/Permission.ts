export interface PermissionProps {
  id: string;
  name: string;
  description?: string;
}

export class Permission {
  constructor(public props: PermissionProps)
  {}

  toJSON() {
    return {
      id: this.props.id,
      name: this.props.name,
      description: this.props.description,
    };
  }
}