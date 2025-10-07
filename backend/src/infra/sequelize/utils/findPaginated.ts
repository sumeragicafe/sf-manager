import { Model, ModelStatic, IncludeOptions } from 'sequelize';
import { buildWhere, IFilterOptions } from '@infra/sequelize/utils/filters';

export async function findPaginated<T extends Model>(
  model: ModelStatic<T>,
  options: {
    page?: number;
    pageSize?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    filters?: IFilterOptions;
  }
) {
  const {
    page = 1,
    pageSize = 20,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    filters = {},
  } = options;

  const { where, include } = buildWhere(model, filters);
  const offset = (page - 1) * pageSize;

    if (!include || include.length === 0) {
        if (filters.includeAssociations) {
            let assocNames: string[] = [];

            if (filters.includeAssociations === true) {
                // inclui todas as associações
                assocNames = Object.keys(model.associations);

            } else if (Array.isArray(filters.includeAssociations)) {
                // inclui apenas as associações passadas
                assocNames = filters.includeAssociations.filter(
                    name => model.associations[name]
                );
            }

                include.push(
                ...assocNames.map(name => ({
                    association: name,
                    required: false,
                } as IncludeOptions))
            );
        }
    }

    const { count, rows } = await model.findAndCountAll({
        where,
        include,
        order: [[sortBy, sortOrder]],
        offset,
        limit: pageSize,
        distinct: true, 
    });

    return {
        total: count,
        page,
        pageSize,
        items: rows,
    };
}