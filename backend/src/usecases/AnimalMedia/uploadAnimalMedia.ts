import { IMediaRepository } from '@domain/repositories/IMediaRepository';
import { IAnimalMediaRepository } from '@domain/repositories/IAnimalMediaRepository';
import { MediaProps } from '@domain/entities/Media';
import { AnimalMediaProps } from '@domain/repositories/IAnimalMediaRepository';

interface UploadAnimalMediaInput {
  petId: string;
  type: string;
  file: { buffer: Buffer; fileName: string; mimeType: string };
}

export function uploadAnimalMedia(
  mediaRepository: IMediaRepository,
  animalMediaRepository: IAnimalMediaRepository
) {
  return async (input: UploadAnimalMediaInput): Promise<{ media: MediaProps; link: AnimalMediaProps }> => {
    const { petId, type, file } = input;

    if (!file.buffer || !file.fileName || !file.mimeType) {
      throw new Error('Missing file data');
    }

    // 1. salva o arquivo na tabela media
    const media = await mediaRepository.saveFile(file);

    // 2. cria o vínculo na tabela animal_media
    const link = await animalMediaRepository.create({
      petId,
      mediaId: media.id,
      type,
    });

    return { media, link };
  };
}
