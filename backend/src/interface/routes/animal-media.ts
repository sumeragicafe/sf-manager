import { Router } from 'express';
import multer from 'multer';
import { AnimalMediaController } from '@interface/controllers/AnimalMediaController';
import { requireAuth } from '@interface/middlewares/requireAuth';
import { authServiceSingleton } from '@dependencies/singletons';

const upload = multer();
const router = Router({ mergeParams: true }); // importante para acessar :petId

// Upload mídia vinculada ao animal
router.post('/:petId/media/upload', requireAuth(authServiceSingleton), upload.single('file'), AnimalMediaController.upload);

// Vincular mídia existente
//router.post('/:petId/media/link', requireAuth(authServiceSingleton), AnimalMediaController.link);

// Desvincular
//router.delete('/media/:id/unlink', requireAuth(authServiceSingleton), AnimalMediaController.unlink);

// Listar mídias de um animal
//router.get('/:petId/media', AnimalMediaController.listByPet);

export default router;
