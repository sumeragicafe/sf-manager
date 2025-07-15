import { IRoleRepository } from "@domain/repositories/IRoleRepository";

export function listRoles(roleRepo: IRoleRepository) {
  return async () => {
    return await roleRepo.list();
  };
}
