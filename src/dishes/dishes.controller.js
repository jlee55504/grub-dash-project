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


// Router handlers
const create = (req, res) => {
  
};

const read = (req, res) => {
  
};

const update = (req, res) => {
  
};

const list = (req, res) => {
  
};

module.exports = {
  
}
