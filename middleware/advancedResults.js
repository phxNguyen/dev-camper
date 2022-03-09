const advancedResults = (model, populate) => async(req,res,next)=>{
  // Copy req.query
  const reqQuery = { ...req.query };

  // Bo cac field de query dc
  const removeFields = ["select", "sort", "page", "limit"];

  // Loop over removeFields and delete them from reqQuery
  removeFields.forEach((param) => delete reqQuery[param]);

  //chuyen doi query parameter trong URL qua String de manipulate
  let queryString = JSON.stringify(req.query);

  // Regex bat dau double foward slash, \b la search pattern
  // g(global) o cuoi de tim toan bo trong document, khong dung lai o tim kiem dau tien
  // $match la MongoDB syntax
  // src: https://docs.mongodb.com/manual/reference/operator/query-comparison/
  // `${}` template literal
  queryString = queryString.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  // Finding resource
  let query = model.find(JSON.parse(queryString))

  // Select Fields
  // src: https://mongoosejs.com/docs/queries.html
  // keyword: select
  if (req.query.select) {
    const fields = req.query.select.split(",").join(" "); //split chuyen tu query => array, join chuyen tu array => string
    query = query.select(fields);
  }

  // Sort
  // src: https://mongoosejs.com/docs/queries.html
  // keyword: sort

  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }

  //Pagination
  const page = parseInt(req.query.page, 10) || 1; // Thu tu trang
  const limit = parseInt(req.query.limit, 10) || 10; //Gioi han moi trang
  const startIndex = (page - 1) * limit; // Item bat dau moi trang (skip cac trang truoc)

  const endIndex = page * limit; // hien thi cac trang...
  const total = await model.countDocuments(); // tiep theo

  query = query.skip(startIndex).limit(limit);

  if(populate){
    query = query.populate(populate)
  }

  //Executing query
  const results = await query;

  //Ket qua phan trang
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }


  res.advancedResults = {
    success: true,
    count: results.length,
    pagination,
    data: results
  }

  next();
}

module.exports = advancedResults;