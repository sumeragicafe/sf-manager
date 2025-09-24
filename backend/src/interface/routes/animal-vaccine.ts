import { Router } from 'express';
import { AnimalVaccineController } from '@interface/controllers/AnimalVaccineController';

const router = Router();

router.post('/:petId/vaccines', AnimalVaccineController.create);
router.get('/:petId/vaccines', AnimalVaccineController.list);
router.get('/vaccines/:id', AnimalVaccineController.getById);
router.put('/:petId/vaccines/:id', AnimalVaccineController.update);
router.delete('/vaccines/:id', AnimalVaccineController.delete);

export default router;
