import { Op, Model, ModelStatic } from 'sequelize';

export interface IFilterOptions {
  search?: string;
  searchFields?: string[];
  dateFrom?: string | Date;
  dateTo?: string | Date;
  dateFields?: string[];
  includeAssociations?: boolean | string[];
  [key: string]: any;
}

interface BuildWhereResult {
  where: Record<string, any>;
  include: any[];
}

export function buildWhere(
  model: ModelStatic<Model>,
  filters: IFilterOptions = {}
): { where: any; include: IncludeOptions[] } {
  const where: any = {};
  const include: IncludeOptions[] = [];

  // ⚙️ Verifica se o model possui atributos (se não tiver, retorna where vazio)
  const hasAttributes =
    typeof (model as any).getAttributes === 'function' &&
    !!(model as any).getAttributes();

  const attributes = hasAttributes
    ? Object.keys((model as any).getAttributes())
    : [];

  // --- 🔍 SEARCH GENÉRICO ---
  if (filters.search) {
    const searchTerm = `%${filters.search}%`;
    const searchInFields =
      filters.searchFields && filters.searchFields.length
        ? filters.searchFields.filter(f => attributes.includes(f))
        : attributes.filter(attr => {
            const attrType = (model as any).getAttributes()[attr].type.constructor.name;
            return ['STRING', 'TEXT', 'UUID'].includes(attrType);
          });

    const orConditions: any[] = [];

    // Campos do próprio modelo
    if (searchInFields.length) {
      orConditions.push(...searchInFields.map(attr => ({ [attr]: { [Op.like]: searchTerm } })));
    }

    // --- 🔁 Campos das associações ---
    if (filters.includeAssociations) {
      const associations = Object.keys(model.associations);

      const associationsToSearch = Array.isArray(filters.includeAssociations)
        ? associations.filter(a => filters.includeAssociations!.includes(a))
        : associations;

      for (const assocName of associationsToSearch) {
        const association = model.associations[assocName];
        const target = association.target as ModelStatic<Model>;

        if (typeof target.getAttributes !== 'function') continue;

        const targetAttributes = Object.keys(target.getAttributes());
        const stringFields = targetAttributes.filter(attr => {
          const type = target.getAttributes()[attr].type.constructor.name;
          return ['STRING', 'TEXT', 'UUID'].includes(type);
        });

        if (stringFields.length) {
          include.push({
            association: assocName,
            required: false,
          });

          stringFields.forEach(attr => {
            orConditions.push({ [`$${assocName}.${attr}$`]: { [Op.like]: searchTerm } });
          });
        }
      }
    }

    if (orConditions.length) {
      where[Op.or] = orConditions;
    }
  }

  // --- 📅 FILTROS DE DATA ---
  if (filters.dateFrom || filters.dateTo) {
    const dateFields =
      filters.dateFields && filters.dateFields.length
        ? filters.dateFields.filter(f => attributes.includes(f))
        : attributes.filter(a =>
            ['createdAt', 'updatedAt', 'uploadDate', 'applicationDate', 'entryDate'].includes(a)
          );

    dateFields.forEach(field => {
      where[field] = where[field] || {};
      if (filters.dateFrom) where[field][Op.gte] = new Date(filters.dateFrom);
      if (filters.dateTo) where[field][Op.lte] = new Date(filters.dateTo);
    });
  }

  // --- ⚙️ OUTROS FILTROS DIRETOS ---
  for (const key of Object.keys(filters)) {
    if (
      ![
        'search',
        'searchFields',
        'dateFrom',
        'dateTo',
        'dateFields',
        'includeAssociations',
      ].includes(key) &&
      attributes.includes(key)
    ) {
      where[key] = filters[key];
    }
  }

  return { where, include };
}


// import { Op, Model, ModelStatic } from 'sequelize';

// export interface IFilterOptions {
//   search?: string;
//   searchFields?: string[];
//   dateFrom?: string | Date;
//   dateTo?: string | Date;
//   dateFields?: string[];
//   [key: string]: any;
// }

// export function buildWhere(model: ModelStatic<Model>, filters: IFilterOptions = {}) {
//   const where: any = {};
//   const attributes = Object.keys(model.getAttributes());

//   // Search genérico
//   if (filters.search) {
//     const searchTerm = `%${filters.search}%`;
//     const searchInFields = filters.searchFields && filters.searchFields.length
//       ? filters.searchFields.filter(f => attributes.includes(f))
//       : attributes.filter(attr => {
//           const type = model.getAttributes()[attr].type.constructor.name;
//           return ['STRING', 'TEXT', 'UUID'].includes(type);
//         });

//     if (searchInFields.length) {
//       where[Op.or] = searchInFields.map(attr => ({ [attr]: { [Op.like]: searchTerm } }));
//     }
//   }

//   // Filtros de datas múltiplas
//   if (filters.dateFrom || filters.dateTo) {
//     const dateFields = filters.dateFields && filters.dateFields.length
//       ? filters.dateFields.filter(f => attributes.includes(f))
//       : attributes.filter(a => ['createdAt', 'updatedAt', 'uploadDate', 'applicationDate'].includes(a));

//     dateFields.forEach(field => {
//       where[field] = where[field] || {};
//       if (filters.dateFrom) where[field][Op.gte] = new Date(filters.dateFrom);
//       if (filters.dateTo) where[field][Op.lte] = new Date(filters.dateTo);
//     });
//   }

//   // Outros filtros diretos
//   for (const key of Object.keys(filters)) {
//     if (!['search', 'searchFields', 'dateFrom', 'dateTo', 'dateFields'].includes(key) && attributes.includes(key)) {
//       where[key] = filters[key];
//     }
//   }

//   return where;
// }
