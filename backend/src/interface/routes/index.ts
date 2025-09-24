import { Router } from 'express';
import userRoutes from '@interface/routes/user';
import permissionRoutes from '@interface/routes/permission';
import roleRoutes from '@interface/routes/role';
import adoptionRequestRoutes from '@interface/routes/adoption-request';
import animalRoutes from '@interface/routes/animal';
import mediaRoutes from '@interface/routes/media';
import eventRoutes from '@interface/routes/event';
import animalMediaRoutes from '@interface/routes/animal-media';
import speciesRoutes from '@interface/routes/species';
import breedRoutes from '@interface/routes/breed';
import animalVaccineRoutes from '@interface/routes/animal-vaccine';
import vaccineRoutes from '@interface/routes/vaccine';
import contactRoutes from '@interface/routes/contact'



const router = Router();

router.use('/user', userRoutes);
router.use('/permission', permissionRoutes);
router.use('/role', roleRoutes);

router.use('/media', mediaRoutes);

router.use('/animal', animalRoutes);
router.use('/animal', animalMediaRoutes);
router.use('/animal', animalVaccineRoutes)

router.use('/species', speciesRoutes);
router.use('/breed', breedRoutes);


router.use('/adoption-request', adoptionRequestRoutes);
router.use('/event', eventRoutes);


router.use('/vaccine', vaccineRoutes);

router.use('/contact', contactRoutes);


export default router;