const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /dishes handlers needed to make the tests pass

// Middleware functions
const bodyHasData = propertyName => {
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
    if (typeof object.values(data[propertyName] === "string") || data[propertyName] !== "") return next();
    next({
      status: 400,
      message: `${propertyName} text is missing`,
    });
  };
}

// Router handlers
const create = (req, res) => {
  const { data: { name, description, price, image_url } = {} }  = req.body;
  const newDish = {
    id: nextId(),
    name: name,
    description: description,
    price: price,
    image_url: image_url,
  };
  dishes(newDish);
  json.status(201).json({ data: newDish });
};

const read = (req, res) => {
  
};

const update = (req, res) => {
  
};

const list = (req, res) => {
  
};

module.exports = {
  create: [
    bodyHasData("name"),
    bodyHasData("description"),
    bodyHasData("price"),
    bodyHasData("image_url"),
    propertiesHaveSyntax("name"),
    propertiesHaveSyntax("description"),
    propertiesHaveSyntax("price"),
    propertiesHaveSyntax("image_url"),
    create,
    bodyHasData("id")
  ]
};
