const path = require("path");

// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));

// Use this function to assigh ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /orders handlers needed to make the tests pass

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


const propertiesHaveSyntax = propertyName =>{
    return (req, res, next) => {
      const { data = {} } = req.body;
      if (data[propertyName] !== "") return next();
      next({
        status: 400,
        message: `Order must includes a ${propertyName}`,
      });  
    };
  };

// Router handlers
const list = (req, res) => {
  res.json({ data: orders });
}

const create = (req, res) => {
  
}

const read = (req, res) => {
  
}

const update = (req, res) => {

}

const destroy = (req, res) => {
  
}
module.exports = {
  create: [
    
  ],
  list
}