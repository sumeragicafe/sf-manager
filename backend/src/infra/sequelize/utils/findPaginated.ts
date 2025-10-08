import { Model, ModelStatic } from 'sequelize';
import { buildWhere, IFilterOptions } from '@infra/sequelize/utils/filters';

export async function findPaginated<T extends Model>(
  model: ModelStatic<T>,
  options: {
    page?: number;
    pageSize?: number;
    filters?: IFilterOptions;
  }
) {
  const {
    page = 1,
    pageSize = 20,
    filters = {},
  } = options;

  // buildWhere já retorna: where, include, order
  const { where, include, order } = buildWhere(model, filters);

  const offset = (page - 1) * pageSize;

  const { count, rows } = await model.findAndCountAll({
    where,
    include,
    order: order,
    offset,
    limit: pageSize,
    distinct: true, // importante quando há joins para não duplicar contagem
  });

  return {
    total: count,
    page,
    pageSize,
    items: rows,
    appliedFilters: filters,
  };

}
