export const getPagination = (req) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || parseInt(process.env.DEFAULT_PAGE_SIZE) || 20;
  const maxLimit = parseInt(process.env.MAX_PAGE_SIZE) || 100;
  
  const finalLimit = Math.min(limit, maxLimit);
  const skip = (page - 1) * finalLimit;

  return {
    page,
    limit: finalLimit,
    skip,
  };
};

export const getPaginationMeta = (total, page, limit) => {
  const totalPages = Math.ceil(total / limit);
  
  return {
    total,
    page,
    limit,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
};
