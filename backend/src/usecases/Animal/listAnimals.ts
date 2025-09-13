import { IAnimalRepository } from '@domain/repositories/IAnimalRepository';
import { ISpeciesRepository } from '@domain/repositories/ISpeciesRepository';
import { IBreedRepository } from '@domain/repositories/IBreedRepository';
import { Animal } from '@domain/entities/Animal';
import { PaginationOptions } from '@types/Pagination';

export function listAnimals(
  animalRepository: IAnimalRepository,
  speciesRepository: ISpeciesRepository,
  breedRepository: IBreedRepository
) {
  return async (pagination?: PaginationOptions, includeRelations = false) => {
    const result = await animalRepository.findAll(pagination);

    if (!includeRelations) {
      return {
        ...result,
        items: result.items.map(a => ({ ...a.props })),
      };
    }

    const items = await Promise.all(
      result.items.map(async (animal) => {
        const species = animal.props.speciesId
          ? await speciesRepository.findById(animal.props.speciesId)
          : undefined;

        let breed;
        if (animal.props.breedId) {
          const b = await breedRepository.findById(animal.props.breedId);
          if (b) {
            breed = { id: b.id, name: b.name }; 
          }
        }

        return {
          id: animal.props.id,
          name: animal.props.name,
          gender: animal.props.gender,
          size: animal.props.size,
          status: animal.props.status,
          isCastrated: animal.props.isCastrated,
          notes: animal.props.notes,
          entryDate: animal.props.entryDate,
          birthDate: animal.props.birthDate,
          isBirthDateEstimated: animal.props.isBirthDateEstimated,
          // mantém os IDs se fizer sentido expor
          speciesId: animal.props.speciesId,
          breedId: animal.props.breedId,
          // adiciona os objetos resolvidos
          species: species ? { id: species.id, name: species.name } : undefined,
          breed,
        };

      })
    );

    // 👇 faltava isso
    return {
      ...result,
      items,
    };
  };
}



// import { IAnimalRepository } from '@domain/repositories/IAnimalRepository';
// import { Animal } from '@domain/entities/Animal';
// import { PaginationOptions } from '@types/Pagination';


// export function listAnimals(animalRepository: IAnimalRepository) {
//   return async (pagination?: PaginationOptions) => {
//     return await animalRepository.findAll(pagination);
//   };
// }
