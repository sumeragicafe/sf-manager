import { IMediaRepository } from '@domain/repositories/IMediaRepository';
import { PaginationOptions } from '@types/Pagination';
import { authServiceSingleton } from '@dependencies/singletons';
import { userRepositorySingleton } from '@dependencies/singletons';

type MediaPaginationOptions = PaginationOptions & {
  search?: string;
  type?: 'image' | 'video' | 'document' | 'all';
  dateFrom?: Date;
  dateTo?: Date;
};

export function listMedia(mediaRepository: IMediaRepository) {
  return async (session: any, pagination?: MediaPaginationOptions) => {
    let canViewPrivate = false;

    if (session?.token) {
      try {
        const payload = authServiceSingleton.verifyToken(session.token);
        const permissions = await userRepositorySingleton.getUserPermissions(payload.id);
        canViewPrivate = permissions?.includes('media.view_private_media') ?? false;
      } catch (e) {
        throw Error("Ocorreu um erro ao validar o token: " + e);
      }
    }

    return await mediaRepository.findAll(pagination, canViewPrivate);
  };
}
