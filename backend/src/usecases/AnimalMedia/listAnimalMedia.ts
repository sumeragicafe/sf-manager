import { IAnimalMediaRepository } from '@domain/repositories/IAnimalMediaRepository';
import { PaginationOptions } from '@types/Pagination';
import { authServiceSingleton } from '@dependencies/singletons';
import { userRepositorySingleton } from '@dependencies/singletons';


export function listAnimalMedia(animalMediaRepo: IAnimalMediaRepository) {
  return async (
    petId: string,
    session: any | undefined,
    {
      page = 1,
      pageSize = 10,
      filters = {},
      sortBy = 'uploadDate',
      sortOrder = 'desc',
      isPublic
    }: PaginationOptions & { isPublic?: boolean }
  ) => {
    if (!petId) {
      throw new Error('petId é obrigatório');
    }

    let canViewPrivate = false;

    // valida token e permissões
    if (session?.token) {
      try {
        const payload = authServiceSingleton.verifyToken(session.token);
        const permissions = await userRepositorySingleton.getUserPermissions(payload.id);
        canViewPrivate = permissions?.includes('media.view_private_media') ?? false;
      } catch (e) {
        throw Error('Ocorreu um erro ao validar o token: ' + e);
      }
    }

    // lógica do filtro isPublic
    let finalFilters = { ...filters };

    // se o front-end passar isPublic, respeitamos o filtro
    if (isPublic == true) {
      finalFilters.isPublic = true; // força isPublic true
    } else if (!canViewPrivate) {
      // se não tem permissão, só vê públicas
      finalFilters.isPublic = true;
    }

    return await animalMediaRepo.findByPet(petId, {
      page,
      pageSize,
      filters: finalFilters,
      sortBy,
      sortOrder
    });
  };
}
