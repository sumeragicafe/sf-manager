import { IAdoptionRequestRepository } from '@domain/repositories/IAdoptionRequestRepository';
import { AdoptionRequest, AdoptionRequestProps } from '@domain/entities/AdoptionRequest';
import { AdoptionRequestModel } from '@infra/sequelize/models/AdoptionRequest.model';
import { AnimalModel } from '@infra/sequelize/models/Animal.model';
import { UserModel } from '@infra/sequelize/models/User.model';

export class SequelizeAdoptionRequestRepository implements IAdoptionRequestRepository {
    async create(adoptionRequest: AdoptionRequest): Promise<AdoptionRequest> {
        const created = await AdoptionRequestModel.create(adoptionRequest.toPersistence());
        return new AdoptionRequest(created.dataValues as AdoptionRequestProps);
    }

    async findById(id: string): Promise<AdoptionRequest | null> {
        const adoptionRequest = await AdoptionRequestModel.findByPk(id, {
            include: [
                {
                    model: AnimalModel,
                    as: 'animal'
                },
                {
                    model: UserModel,
                    as: 'reviewer',
                    attributes: ['id', 'name', 'email']
                }
            ]
        });
        
        if (!adoptionRequest) return null;
        return new AdoptionRequest(adoptionRequest.dataValues as AdoptionRequestProps);
    }

    async findAll(): Promise<AdoptionRequest[]> {
        const adoptionRequests = await AdoptionRequestModel.findAll({
            include: [
                {
                    model: AnimalModel,
                    as: 'animal'
                },
                {
                    model: UserModel,
                    as: 'reviewer',
                    attributes: ['id', 'name', 'email']
                }
            ],
            order: [['submittedAt', 'DESC']]
        });
        
        return adoptionRequests.map(req => new AdoptionRequest(req.dataValues as AdoptionRequestProps));
    }

    async findByAnimalId(animalId: string): Promise<AdoptionRequest[]> {
        const adoptionRequests = await AdoptionRequestModel.findAll({
            where: { animalId },
            include: [
                {
                    model: AnimalModel,
                    as: 'animal'
                },
                {
                    model: UserModel,
                    as: 'reviewer',
                    attributes: ['id', 'name', 'email']
                }
            ],
            order: [['submittedAt', 'DESC']]
        });
        
        return adoptionRequests.map(req => new AdoptionRequest(req.dataValues as AdoptionRequestProps));
    }

    async findByStatus(status: string): Promise<AdoptionRequest[]> {
        const adoptionRequests = await AdoptionRequestModel.findAll({
            where: { status },
            include: [
                {
                    model: AnimalModel,
                    as: 'animal'
                },
                {
                    model: UserModel,
                    as: 'reviewer',
                    attributes: ['id', 'name', 'email']
                }
            ],
            order: [['submittedAt', 'DESC']]
        });
        
        return adoptionRequests.map(req => new AdoptionRequest(req.dataValues as AdoptionRequestProps));
    }

    async update(id: string, adoptionRequest: AdoptionRequest): Promise<AdoptionRequest | null> {
        const persistenceData = adoptionRequest.toPersistence();
        const [updatedRowsCount] = await AdoptionRequestModel.update(persistenceData, {
            where: { id }
        });

        if (updatedRowsCount === 0) return null;

        const updated = await AdoptionRequestModel.findByPk(id, {
            include: [
                {
                    model: AnimalModel,
                    as: 'animal'
                },
                {
                    model: UserModel,
                    as: 'reviewer',
                    attributes: ['id', 'name', 'email']
                }
            ]
        });
        
        if (!updated) return null;
        return new AdoptionRequest(updated.dataValues as AdoptionRequestProps);
    }

    async delete(id: string): Promise<boolean> {
        const deletedRowsCount = await AdoptionRequestModel.destroy({
            where: { id }
        });
        return deletedRowsCount > 0;
    }
} 