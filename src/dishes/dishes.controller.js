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
}

const priceIsValidNumber = (req, res, next) => {
  const { data: { price } = {} } = req.body;
  if (Number.isInteger(price) && price > 0) return next();
  next({
    status: 400,
    message: `Price requires a valid number`,
  })
} 

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
  console.log(newDish);
  res.status(201).json({ data: newDish });
};

const read = (req, res) => {
  
};

const update = (req, res) => {
  
};

const list = (req, res) => {
  res.json({ data: dishes });
};

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
  list
};
