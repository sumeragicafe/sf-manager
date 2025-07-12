import { Permission } from '@domain/entities/Permission';

export interface IPermissionRepository {
  findByRoleId(roleId: string): Promise<Permission[]>;
  list(): Promise<Permission[]>;
}