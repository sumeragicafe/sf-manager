import { Role } from '@domain/entities/Role';

export interface IRoleRepository {
  findById(id: string): Promise<Role | null>;
  findByIdWithPermissions(roleId: string): Promise<Role | null>;
  findByName(name: string): Promise<Role | null>;
  list(): Promise<Role[]>;
}
