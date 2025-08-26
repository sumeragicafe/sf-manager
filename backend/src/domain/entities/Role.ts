export interface RoleProps {
  id: string;
  name: string;
  description?: string;
  permissions?: {
    id: string;
    name: string;
    description?: string;
  }[];
}

export class Role {
  constructor(public props: RoleProps)
  {}

  toJSON() {
    return {
      id: this.props.id,
      name: this.props.name,
      description: this.props.description,
      permissions: this.props.permissions ?? []
    };
  }
}