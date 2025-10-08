import { Op, Model, ModelStatic, IncludeOptions } from 'sequelize';

export interface IFilterOptions {
  search?: string; // termo de busca genérico
  searchFields?: string[]; // campos específicos para busca
  fieldFilters?: Record<string, any>; // filtros diretos (igual chave = valor)
  dateFilters?: Record<string, { from?: Date | string; to?: Date | string }>; // filtros de datas por campo
  includeAssociations?: boolean | string[]; // incluir associações na busca
  sort?: { field: string; direction: 'asc' | 'desc' }[]; // ordenação
  [key: string]: any; // para filtros extras dinâmicos
}


interface BuildWhereResult {
  where: Record<string, any>;
  include: IncludeOptions[];
  order?: [string, 'ASC' | 'DESC'][];
}

export function buildWhere(
  model: ModelStatic<Model>,
  options: IFilterOptions = {}
): BuildWhereResult {
  const where: Record<string, any> = {};
  const include: IncludeOptions[] = [];
  const order: [string, 'ASC' | 'DESC'][] = [];

  // Detecta atributos do model
  const attributes = typeof model.getAttributes === 'function' ? model.getAttributes() : {};
  const attrNames = Object.keys(attributes);

  if (options.includeAssociations) {
    const associations = Object.keys(model.associations);

    let assocToInclude: string[] = [];

    if (options.includeAssociations === true) {
      assocToInclude = associations;

    } else if (Array.isArray(options.includeAssociations)) {
      assocToInclude = options.includeAssociations.filter(a => associations.includes(a));

    }

    for (const assocName of assocToInclude) {
      const association = model.associations[assocName];
      if (!association) continue;

      console.log(associations);
      include.push({ association: assocName, required: false });

      // opcional: aqui você pode adicionar campos de string da associação para search
    }
  }


  // SEARCH GENÉRICO
  if (options.search) {
    const term = `%${options.search}%`;
    const fieldsToSearch = options.searchFields?.filter(f => attrNames.includes(f)) ||
                           attrNames.filter(a => ['STRING', 'TEXT', 'UUID'].includes(attributes[a].type.constructor.name));

    const orConditions = fieldsToSearch.map(field => ({ [field]: { [Op.like]: term } }));

    // Busca em associações
    if (options.includeAssociations) {
      const associations = Object.keys(model.associations);
      const assocToInclude = Array.isArray(options.includeAssociations)
        ? associations.filter(a => options.includeAssociations.includes(a))
        : associations;

      for (const assocName of assocToInclude) {
        const target = model.associations[assocName].target as ModelStatic<Model>;
        if (!target.getAttributes) continue;
        const stringFields = Object.keys(target.getAttributes()).filter(f =>
          ['STRING', 'TEXT', 'UUID'].includes(target.getAttributes()[f].type.constructor.name)
        );
        if (stringFields.length) {
          include.push({ association: assocName, required: false });
          stringFields.forEach(f => orConditions.push({ [`$${assocName}.${f}$`]: { [Op.like]: term } }));
        }
      }
    }

    if (orConditions.length) where[Op.or] = orConditions;
  }

  // FILTROS DE DATA
  if (options.dateFilters) {
    for (const field in options.dateFilters) {
      if (!attrNames.includes(field)) continue;
      const { from, to } = options.dateFilters[field];
      where[field] = where[field] || {};
      if (from) where[field][Op.gte] = new Date(from);
      if (to) where[field][Op.lte] = new Date(to);
    }
  }

  // FILTROS DIRETOS (agora renamed)
  if (options.fieldFilters) {
    for (const key in options.fieldFilters) {
      if (attrNames.includes(key)) where[key] = options.fieldFilters[key];
    }
  }

  // ORDENAÇÃO
  if (options.sort) {
    for (const s of options.sort) {
      if (attrNames.includes(s.field)) order.push([s.field, s.direction.toUpperCase() as 'ASC' | 'DESC']);
    }
  }

  return { where, include, order: order.length ? order : undefined };
}
