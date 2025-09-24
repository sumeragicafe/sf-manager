// src/routes/species.routes.ts
import { Router } from 'express';
import { SpeciesController } from '@interface/controllers/SpeciesController';

const router = Router();

router.get('/', SpeciesController.getAll);        // /api/species
router.get('/:id', SpeciesController.getById);    // /api/species/:id
router.post('/', SpeciesController.create);       // /api/species
router.put('/:id', SpeciesController.update);     // /api/species/:id
router.delete('/:id', SpeciesController.delete);  // /api/species/:id

export default router;
