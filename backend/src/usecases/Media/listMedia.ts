import { IMediaRepository } from '@domain/repositories/IMediaRepository';
import { PaginationOptions } from '@types/Pagination';
import { authServiceSingleton } from '@dependencies/singletons';
import { userRepositorySingleton } from '@dependencies/singletons';

export function listMedia(mediaRepository: IMediaRepository) {
  return async (session: any, pagination?: PaginationOptions) => {
    let canViewPrivate = false;

    if (session?.token) {
      try {
        const payload = authServiceSingleton.verifyToken(session.token);
        const permissions = await userRepositorySingleton.getUserPermissions(payload.id);
        canViewPrivate = permissions?.includes('VIEW_PRIVATE_MEDIA') ?? false;
      } catch (e) {
        // token inválido → não tem permissão
        throw Error("Ocorreu um erro ao validar o token" + e);
      }
    }else{
      console.log("Token não existente");
    }

    return await mediaRepository.findAll(pagination, canViewPrivate);
  };
}