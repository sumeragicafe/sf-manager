import { AnimalModel } from '@infra/sequelize/models/Animal.model';
import { AnimalProps, Animal } from '@domain/entities/Animal';
import { PaginationOptions, PaginatedResult } from '@types/Pagination';
import { IAnimalRepository} from '@domain/repositories/IAnimalRepository';
import { Op } from 'sequelize';

export class SequelizeAnimalRepository implements IAnimalRepository {

  private mapToEntity(model: AnimalModel): Animal {
    return new Animal(model.toJSON() as AnimalProps);
  }

  async findById(id: string): Promise<Animal | null> {
    const animal = await AnimalModel.findByPk(id);
    return animal ? this.mapToEntity(animal) : null;
  }

  async searchByName(name: string, pagination?: PaginationOptions): Promise<PaginatedResult<Animal>> {
    const { page = 1, pageSize = 10 } = pagination || {};
    const { rows, count } = await AnimalModel.findAndCountAll({
      where: { name: { [Op.iLike]: `%${name}%` } },
      offset: (page - 1) * pageSize,
      limit: pageSize,
    });
    return {
      items: rows.map(row => this.mapToEntity(row)),
      total: count,
      page,
      pageSize
    };
  }

  async create(data: Omit<AnimalProps, 'id'>): Promise<Animal> {
    const entity = Animal.createNew(data); 
    const model = await AnimalModel.create(entity.toPersistence());
    return this.mapToEntity(model);
  }

  async update(id: string, data: Partial<Omit<AnimalProps, 'id'>>): Promise<Animal | null> {
    const animal = await AnimalModel.findByPk(id);
    if (!animal) return null;
    // const updated = await animal.update(data);
    await animal.update(data);
    await animal.reload();

    return this.mapToEntity(animal);
  }

  async delete(id: string): Promise<boolean> {
    const deleted = await AnimalModel.destroy({ where: { id } });
    return deleted > 0;
  }

  async findAll(pagination?: PaginationOptions): Promise<PaginatedResult<Animal>> {
    const { page = 1, pageSize = 10 } = pagination || {};
    const { rows, count } = await AnimalModel.findAndCountAll({
      offset: (page - 1) * pageSize,
      limit: pageSize,
      order: [['entry_date', 'DESC']]
    });
    return {
      items: rows.map(row => this.mapToEntity(row)),
      total: count,
      page,
      pageSize
    };
  }
}