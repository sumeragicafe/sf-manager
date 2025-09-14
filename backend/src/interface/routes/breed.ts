// src/routes/breed.routes.ts
import { Router } from 'express';
import { BreedController } from '@interface/controllers/BreedController';

const router = Router();

router.get('/', BreedController.getAll);                  // /api/breeds
router.get('/:id', BreedController.getById);              // /api/breeds/:id
router.get('/species/:speciesId', BreedController.getBySpecies); // /api/breeds/species/:speciesId
router.post('/', BreedController.create);                 // /api/breeds
router.put('/:id', BreedController.update);               // /api/breeds/:id
router.delete('/:id', BreedController.delete);            // /api/breeds/:id

export default router;
