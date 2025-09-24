// src/routes/breed.routes.ts
import { Router } from 'express';
import VaccineController from '@interface/controllers/VaccineController';
import { authServiceSingleton } from '@dependencies/singletons';
import { userRepositorySingleton } from '@dependencies/singletons';
import { hasPermissions } from '@interface/middlewares/hasPermissions';

const router = Router();

router.get('/', hasPermissions(['pet.vaccine_add'],authServiceSingleton,userRepositorySingleton), VaccineController.list);             
router.post('/',  hasPermissions(['pet.vaccine_add'],authServiceSingleton,userRepositorySingleton), VaccineController.create);               
router.put('/:id',  hasPermissions(['pet.vaccine_add'],authServiceSingleton,userRepositorySingleton), VaccineController.update);               
router.delete('/:id',  hasPermissions(['pet.vaccine_add'],authServiceSingleton,userRepositorySingleton), VaccineController.delete);         

export default router;
