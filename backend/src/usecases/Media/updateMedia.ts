import { IMediaRepository } from '@domain/repositories/IMediaRepository';
import { MediaProps } from '@domain/entities/Media';

export function updateMedia(mediaRepository: IMediaRepository) {
  return async (id: string, data: Partial<Omit<MediaProps, 'id' | 'data'>>): Promise<MediaProps> => {
    const updated = await mediaRepository.update(id, data);
    if (!updated) throw new Error('Media not found');
    return updated;
  };
}