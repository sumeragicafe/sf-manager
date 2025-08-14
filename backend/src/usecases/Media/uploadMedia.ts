import { IMediaRepository } from '@domain/repositories/IMediaRepository';
import { MediaProps } from '@domain/entities/Media';

export function uploadMedia(mediaRepository: IMediaRepository) {
  return async (file: { buffer: Buffer; fileName: string; mimeType: string }): Promise<MediaProps> => {
    if (!file.buffer || !file.fileName || !file.mimeType) {
      throw new Error('Missing file data');
    }
    return await mediaRepository.saveFile(file);
  };
}