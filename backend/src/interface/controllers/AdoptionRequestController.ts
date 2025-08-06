import { Request, Response } from 'express';
// import { adoptionRequestRepositorySingleton, animalRepositorySingleton } from 'src/dependencies/singletons';
import { SequelizeAdoptionRequestRepository } from '@infra/sequelize/repositories/SequelizeAdoptionRequestRepository';
import { SequelizeAnimalRepository } from '@infra/sequelize/repositories/SequelizeAnimalRepository';

import { createAdoptionRequest } from '@usecases/AdoptionRequest/createAdoptionRequest';
import { listAdoptionRequests } from '@usecases/AdoptionRequest/listAdoptionRequests';
import { reviewAdoptionRequest } from '@usecases/AdoptionRequest/reviewAdoptionRequest';

const adoptionRequestRepo = new SequelizeAdoptionRequestRepository();
const animalRepo = new SequelizeAnimalRepository();

export class AdoptionRequestController {
  static async create(req: Request, res: Response) {
    try {
      const { responsibleName, contactPhone, animalId, termsAccepted } = req.body;

      // Validate required fields
      if (!responsibleName || !contactPhone || !animalId || termsAccepted !== true) {
        return res.status(400).json({
          error: 'Todos os campos são obrigatórios e os termos devem ser aceitos.'
        });
      }

      const adoptionRequest = await createAdoptionRequest(adoptionRequestRepo, animalRepo)
      ({
        responsibleName,
        contactPhone,
        animalId,
        termsAccepted
      });

      res.status(201).json({
        id: adoptionRequest.props.id,
        responsibleName: adoptionRequest.props.responsibleName,
        contactPhone: adoptionRequest.props.contactPhone,
        animalId: adoptionRequest.props.animalId,
        status: adoptionRequest.props.status,
        submittedAt: adoptionRequest.props.submittedAt,
        message: 'Pedido de adoção enviado com sucesso!'
      });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  static async list(req: Request, res: Response) {
    try {
      const { status, animalId } = req.query;

      const adoptionRequests = await listAdoptionRequests(adoptionRequestRepo)
      ({
        status: status as string,
        animalId: animalId as string
      });

      const formattedRequests = adoptionRequests.map(request => ({
        id: request.props.id,
        responsibleName: request.props.responsibleName,
        contactPhone: request.props.contactPhone,
        animalId: request.props.animalId,
        status: request.props.status,
        submittedAt: request.props.submittedAt,
        reviewedAt: request.props.reviewedAt,
        reviewedBy: request.props.reviewedBy,
        notes: request.props.notes,
        animal: request.props.animal
      }));

      res.json(formattedRequests);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const adoptionRequest = await adoptionRequestRepo.findById(id);
      
      if (!adoptionRequest) {
        return res.status(404).json({ error: 'Pedido de adoção não encontrado.' });
      }

      res.json({
        id: adoptionRequest.props.id,
        responsibleName: adoptionRequest.props.responsibleName,
        contactPhone: adoptionRequest.props.contactPhone,
        animalId: adoptionRequest.props.animalId,
        status: adoptionRequest.props.status,
        submittedAt: adoptionRequest.props.submittedAt,
        reviewedAt: adoptionRequest.props.reviewedAt,
        reviewedBy: adoptionRequest.props.reviewedBy,
        notes: adoptionRequest.props.notes,
        animal: adoptionRequest.props.animal
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  static async review(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { action, notes } = req.body;
      const reviewedBy = req.user?.id; // From auth middleware

      if (!reviewedBy) {
        return res.status(401).json({ error: 'Usuário não autenticado.' });
      }

      if (!action || !['approve', 'reject'].includes(action)) {
        return res.status(400).json({ error: 'Ação inválida. Use "approve" ou "reject".' });
      }

      const updatedRequest = await reviewAdoptionRequest(
        adoptionRequestRepo,
        animalRepo
      )({
        adoptionRequestId: id,
        action,
        reviewedBy,
        notes
      });

      res.json({
        id: updatedRequest.props.id,
        status: updatedRequest.props.status,
        reviewedAt: updatedRequest.props.reviewedAt,
        reviewedBy: updatedRequest.props.reviewedBy,
        notes: updatedRequest.props.notes,
        message: `Pedido de adoção ${action === 'approve' ? 'aprovado' : 'rejeitado'} com sucesso!`
      });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
} 