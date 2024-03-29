import { PaginatedQuery, PaginationDTO } from './pagination.dto';

export const paginated = async (
  query: PaginationDTO,
  dataFn: CallableFunction,
  countFn: CallableFunction,
) => {
  let data: any;
  let totalCount: number;

  if (!query.paginated) {
    return dataFn({ filter: query.filter, sort: query.sort });
  }

  await Promise.all([
    (data = await dataFn(query)),
    (totalCount = await countFn(query)),
  ]);

  return {
    data,
    page: query.page,
    limit: query.limit,
    count: data.length,
    filter: query.filter,
    sort: query.sort,
    totalItems: totalCount,
    totalPages: Math.ceil(totalCount / query.limit),
  };
};

export const buildPaginationQuery = (query: PaginationDTO): PaginatedQuery => {
  const { filter = {}, sort = {}, limit, page } = query;

  const skip = (page - 1) * limit || 0;

  return { filter, sort, skip, limit };
};
