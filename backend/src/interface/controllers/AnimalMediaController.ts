import { Request, Response } from 'express';
import { SequelizeMediaRepository } from '@infra/sequelize/repositories/SequelizeMediaRepository';
import { SequelizeAnimalMediaRepository } from '@infra/sequelize/repositories/SequelizeAnimalMediaRepository';
import { uploadAnimalMedia } from '@usecases/AnimalMedia/uploadAnimalMedia';
import { listAnimalMedia } from '@usecases/AnimalMedia/listAnimalMedia';

const mediaRepo = new SequelizeMediaRepository();
const animalMediaRepo = new SequelizeAnimalMediaRepository();

export class AnimalMediaController {
  static async upload(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const { petId } = req.params;
      const { type } = req.body; // opcional

      const result = await uploadAnimalMedia(mediaRepo, animalMediaRepo)({
        petId,
        type: type || 'image', // se não mandar, vira "image"
        file: {
          buffer: req.file.buffer,
          fileName: req.file.originalname,
          mimeType: req.file.mimetype,
        },
      });

      res.status(201).json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  static async listByPet(req: Request, res: Response) {
    try {
      const { petId } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 10;
      const sortBy = (req.query.sortBy as string) || 'uploadDate';
      const sortOrder = (req.query.sortOrder as 'asc' | 'desc') || 'desc';

      // Parse filters
      let filters: Record<string, any> = {};
      if (req.query.filters && typeof req.query.filters === 'string') {
        try {
          filters = JSON.parse(req.query.filters);
        } catch {
          filters = {};
        }
      }

      const isPublic = filters.isPublic === true;

      const result = await listAnimalMedia(animalMediaRepo)(
        petId,
        req.session,
        {
          page,
          pageSize,
          filters,
          sortBy,
          sortOrder,
          isPublic
        }
      );

      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }


}