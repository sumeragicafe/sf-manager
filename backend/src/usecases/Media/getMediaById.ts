import { IMediaRepository } from '@domain/repositories/IMediaRepository';
import { authServiceSingleton } from '@dependencies/singletons';
import { userRepositorySingleton } from '@dependencies/singletons';

export function getMediaById(mediaRepository: IMediaRepository) {
  return async (id: string, session: any) => {
    let canViewPrivate = false;

    if (session?.token) {
      try {
        const payload = authServiceSingleton.verifyToken(session.token);
        const permissions = await userRepositorySingleton.getUserPermissions(payload.id);
        canViewPrivate = permissions?.includes('media.view_private_media') ?? false;
      } catch (e) {
        // token inválido → não tem permissão
        throw Error("Ocorreu um erro ao validar o token" + e);
      }
    }else{
      console.log("Token não existente");
    }


    const media = await mediaRepository.findById(id, canViewPrivate);

    if (!media) throw new Error('Media not found');
    return media;
  };
}