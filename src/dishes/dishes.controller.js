const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /dishes handlers needed to make the tests pass

// Middleware functions
const bodyDataHas = propertyName => {
  return (req, res, next) => {
    const { data = {} } = req.body;
    if (data[propertyName]) return next();
    next({
      status: 400,
      message: `Must include a ${propertyName}`,
    });
  };
};

const propertiesHaveSyntax = propertyName => {
    return (req, res, next) => {
    const { data = {} } = req.body;
    if (typeof data[propertyName] === "string" || data[propertyName] !== "") return next();
    next({
      status: 400,
      message: `${propertyName} text is missing`,
    });
  };
};

const priceIsValidNumber = (req, res, next) => {
  const { data: { price } = {} } = req.body;
  if (Number.isInteger(price) && price > 0) return next();
  next({
    status: 400,
    message: `Dish must have a price that is an integer greater than 0`,
  });
};

const dishExists = (req, res, next) => {
  const { dishId } = req.params;
  const foundDish = dishes.find(dish => dish.id === dishId);
  if (foundDish) {
    res.locals.dish = foundDish;
    return next();
  };
  next({
    status: 404,
    message: `Dish id not found: ${dishId}`,
  });
};

const dishIdsmatch = (req, res, next) => {
  const { dishId } = req.params;
  const { data: { id } = {} } = req.body;
  if (id && dishId !== id) return next({
    status: 400,
    message: `Dish id does not match route id. Dish: ${id}, Route: ${dishId}`,
  });
  next();
};

// Router handlers
const create = (req, res) => {
  const { data: { name, description, price, image_url } = {} }  = req.body;
  const newDish = {
    id: nextId(),
    name,
    description,
    price,
    image_url,
  };
  dishes.push(newDish);
  res.status(201).json({ data: newDish });
};

const read = (req, res) => res.json({ data: res.locals.dish });


const update = (req, res) => {
  const { data: { name, description, price, image_url } = {} } = req.body;
  const dish = res.locals.dish;
  dish.name = name;
  dish.description = description;
  dish.price = price;
  dish.image_url = image_url;
  res.json({ data: dish });
};

const list = (req, res) => res.json({ data: dishes });


module.exports = {
  create: [
    bodyDataHas("name"),
    bodyDataHas("description"),
    bodyDataHas("price"),
    bodyDataHas("image_url"),
    propertiesHaveSyntax("name"),
    propertiesHaveSyntax("description"),
    propertiesHaveSyntax("price"),
    propertiesHaveSyntax("image_url"),
    priceIsValidNumber,
    create,
    bodyDataHas("id")
  ],
  list,
  read: [
    dishExists,
    read
  ],
  update: [
    dishExists,
    dishIdsmatch,
    bodyDataHas("name"),
    bodyDataHas("description"),
    bodyDataHas("price"),
    bodyDataHas("image_url"),
    propertiesHaveSyntax("name"),
    propertiesHaveSyntax("description"),
    propertiesHaveSyntax("price"),
    propertiesHaveSyntax("image_url"),
    priceIsValidNumber,
    update
  ]
};
