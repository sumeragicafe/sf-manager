import { IMediaRepository } from '@domain/repositories/IMediaRepository';
import { PaginationOptions } from '@types/Pagination';
import { authServiceSingleton } from '@dependencies/singletons';
import { userRepositorySingleton } from '@dependencies/singletons';

export function listMedia(mediaRepository: IMediaRepository) {
  return async (session: any, options?: PaginationOptions) => {
    let canViewPrivate = false;

    // valida token e permissões
    if (session?.token) {
      try {
        const payload = authServiceSingleton.verifyToken(session.token);
        const permissions = await userRepositorySingleton.getUserPermissions(payload.id);
        canViewPrivate = permissions?.includes('media.view_private_media') ?? false;
      } catch (e) {
        throw new Error("Ocorreu um erro ao validar o token: " + e);
      }
    }

    // garante que filtros existam
    const filters = options?.filters ? { ...options.filters } : {};

    // aplica filtro de visibilidade
    if (!canViewPrivate) {
      filters.isPublic = true;
    }

    // repassa tudo para o repositório
    return await mediaRepository.findAll({
      page: options?.page ?? 1,
      pageSize: options?.pageSize ?? 10,
      sortBy: options?.sortBy ?? 'uploadDate',
      sortOrder: options?.sortOrder ?? 'desc',
      filters
    }, canViewPrivate);
  };
}
