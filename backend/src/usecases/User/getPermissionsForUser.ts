import { IUserRepository } from "@domain/repositories/IUserRepository";
import { IPermissionRepository } from "@domain/repositories/IPermissionRepository";
import { IRoleRepository } from "@domain/repositories/IRoleRepository";

export async function getPermissionsForUser(userRepo: IUserRepository, permissionRepo: IPermissionRepository, roleRepo: IRoleRepository): Promise<string[]> {

    return async (userId: string) => {
        const user = await userRepo.findById(userId, {
          include: {
            model: roleRepo,
            as: 'role',
            include: {
              model: permissionRepo,
              as: 'permissions'
            }
          }
        });
      
        if (!user || !user.role) return [];
      
        return (user.role.permissions || []).map((p: any) => p.name);
    }
}