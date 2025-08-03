import { Role } from '@domain/entities/Role';

export interface IRoleRepository {
  findById(id: string): Promise<Role | null>;
  findByIdWithPermissions(id: string): Promise<Role | null>;
  findByName(name: string): Promise<Role | null>;

  create(name: string, description:string): Promise<Role>;
  createWithPermissions(name: string, description: string, permissionIds: string[]): Promise<Role>;
  update(id: string, name: string, description: string, permissionIds: string[]): Promise<Role>;

  list(): Promise<Object[]>;
  delete(id: string): Promise<boolean>;
}
