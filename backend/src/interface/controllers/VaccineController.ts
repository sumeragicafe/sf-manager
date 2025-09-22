import { Request, Response } from 'express';
import { SequelizeVaccineRepository } from '@infra/sequelize/repositories/SequelizeVaccineRepository';
import { listVaccines } from '@usecases/Vaccine/listVaccines';
import { createVaccine } from '@usecases/Vaccine/createVaccine';
import { updateVaccine } from '@usecases/Vaccine/updateVaccine';
import { deleteVaccine } from '@usecases/Vaccine/deleteVaccine';

const vaccineRepo = new SequelizeVaccineRepository();

export default class VaccineController {
  static async create(req: Request, res: Response) {
    try {
        const { name, description } = req.body;

        const vaccine = await createVaccine(vaccineRepo)({ name, description });

        res.status(201).json(vaccine);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  static async list(req: Request, res: Response) {
    try {
        const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
        const pageSize = req.query.pageSize ? parseInt(req.query.pageSize as string, 10) : 10;

        // Parse filters
        let filters: Record<string, any> = {};
        if (req.query.filters && typeof req.query.filters === 'string') {
        try {
            filters = JSON.parse(req.query.filters);
            console.log('filters');
            console.log(filters);
        } catch {
            filters = {};
        }
        }

        const result = await listVaccines(vaccineRepo)({
        page,
        pageSize,
        filters
        });

        res.status(200).json(result);
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
  }

  static async update(req: Request, res: Response) {
    try {
        const id = parseInt(req.params.id, 10); 
        const { name, description } = req.body;
        const vaccine = await updateVaccine(vaccineRepo)(id, {name, description });
    
        if(vaccine == null){
            res.status(404).json({ message: 'Vacina não encontrada' });
            return;
        }

        res.status(200).json({message: 'Vacina atualizada com sucesso',vaccine: vaccine});
    }catch(err: any){
        res.status(400).json({ error: err.message });
    }
  }

    static async delete(req: Request, res: Response) {
    try {
        const id = parseInt(req.params.id, 10); 
        const deleteVaccineResult = await deleteVaccine(vaccineRepo)(id);
    
        deleteVaccineResult.vaccine ?
        res.status(200).json({ isDeleted: deleteVaccineResult.success, vaccine: deleteVaccineResult.vaccine, message: 'Vacina excluída com sucesso' }) : res.status(404).json({ message: 'Vacina não encontrada' });
    
    }catch(err: any){
        res.status(400).json({ error: err.message });
    }
  }
}