import { Permission } from '@domain/entities/Permission';

export interface IPermissionRepository {
  create(name: string, description?: string): Promise<Permission>;
  list(): Promise<Permission[]>;
  delete(permissionId: string): Promise<void>;
  findByRoleId(roleId: string): Promise<Permission[]>;
}