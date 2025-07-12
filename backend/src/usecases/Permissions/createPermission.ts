import { Permission } from '@infra/sequelize/models/Permission.model';

export async function createPermission(name: string, description?: string) {
  return await Permission.create({ name, description });
}
