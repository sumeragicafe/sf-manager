import { Op, Model, ModelStatic } from 'sequelize';

export interface IFilterOptions {
  search?: string;
  searchFields?: string[];
  dateFrom?: string | Date;
  dateTo?: string | Date;
  dateFields?: string[];
  [key: string]: any;
}

export function buildWhere(model: ModelStatic<Model>, filters: IFilterOptions = {}) {
  const where: any = {};
  const attributes = Object.keys(model.getAttributes());

  // Search genérico
  if (filters.search) {
    const searchTerm = `%${filters.search}%`;
    const searchInFields = filters.searchFields && filters.searchFields.length
      ? filters.searchFields.filter(f => attributes.includes(f))
      : attributes.filter(attr => {
          const type = model.getAttributes()[attr].type.constructor.name;
          return ['STRING', 'TEXT', 'UUID'].includes(type);
        });

    if (searchInFields.length) {
      where[Op.or] = searchInFields.map(attr => ({ [attr]: { [Op.like]: searchTerm } }));
    }
  }

  // Filtros de datas múltiplas
  if (filters.dateFrom || filters.dateTo) {
    const dateFields = filters.dateFields && filters.dateFields.length
      ? filters.dateFields.filter(f => attributes.includes(f))
      : attributes.filter(a => ['createdAt', 'updatedAt', 'uploadDate', 'applicationDate'].includes(a));

    dateFields.forEach(field => {
      where[field] = where[field] || {};
      if (filters.dateFrom) where[field][Op.gte] = new Date(filters.dateFrom);
      if (filters.dateTo) where[field][Op.lte] = new Date(filters.dateTo);
    });
  }

  // Outros filtros diretos
  for (const key of Object.keys(filters)) {
    if (!['search', 'searchFields', 'dateFrom', 'dateTo', 'dateFields'].includes(key) && attributes.includes(key)) {
      where[key] = filters[key];
    }
  }

  return where;
}
