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

  const checkDishesProperty = (req, res, next) => {
    const { data: { dishes } = {} } = req.body;
    if (!Array.isArray(dishes) || dishes.length === 0) return next({
      status: 400,
      message: "Order must include at least one dish",
    });
    next();
  };

  const quantityIsValidNumber = (req, res, next) => {
    const { data: { id, dishes: [{ quantity }] } = {} } = req.body;
  const index = orders.findIndex((order) => order.id === id);
      if (!quantity || !Number.isInteger(quantity) || quantity <= 0) {
        return next({
          status: 400,
          message: `dish ${index} must have a quantity that is an integer greater than 0`,
        });
      }
    next();
  }
  

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