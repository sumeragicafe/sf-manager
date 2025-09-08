import { Request, Response } from 'express';
import { SequelizeMediaRepository } from '@infra/sequelize/repositories/SequelizeMediaRepository';
import { uploadMedia } from '@usecases/Media/uploadMedia';
import { getMediaById } from '@usecases/Media/getMediaById';
import { listMedia } from '@usecases/Media/listMedia';
import { updateMedia } from '@usecases/Media/updateMedia';
import { deleteMedia } from '@usecases/Media/deleteMedia';

const mediaRepo = new SequelizeMediaRepository();

export class MediaController {
  static async upload(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }
      const file = {
        buffer: req.file.buffer,
        fileName: req.file.originalname,
        mimeType: req.file.mimetype,
      };
      const media = await uploadMedia(mediaRepo)(file);
      res.status(201).json(media);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const media = await getMediaById(mediaRepo)(id, req.session);
      if (!media) return res.status(404).json({ error: 'Media not found' });

      // Se quiser retornar o arquivo binário:
      // res.contentType(media.mimeType).send(media.data);

      // Ou apenas os metadados:
      res.status(200).json(media);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  static async list(req: Request, res: Response) {
    try {
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const pageSize = req.query.pageSize ? parseInt(req.query.pageSize as string, 10) : 10;
      const search = req.query.search as string | undefined;
      const type = req.query.type as 'image' | 'video' | 'document' | 'all' | undefined;
      const dateFrom = req.query.dateFrom ? new Date(req.query.dateFrom as string) : undefined;
      const dateTo = req.query.dateTo ? new Date(req.query.dateTo as string) : undefined;

      const result = await listMedia(mediaRepo)(req.session, {
        page,
        pageSize,
        search,
        type,
        dateFrom,
        dateTo,
      });

      res.status(200).json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }


  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data = req.body;
      const updated = await updateMedia(mediaRepo)(id, data);
      res.status(200).json(updated);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await deleteMedia(mediaRepo)(id);
      res.status(204).send();
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  static async view(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const media = await getMediaById(mediaRepo)(id, req.session);

      res.contentType(media.mimeType).send(media.data);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  static async download(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const media = await getMediaById(mediaRepo)(id, req.session);

      if (!media) {
        return res.status(404).json({ error: 'Media not found' });
      }

      // Força o download
      res.setHeader('Content-Disposition', `attachment; filename="${media.fileName}"`);
      res.contentType(media.mimeType).send(media.data);

    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }



}