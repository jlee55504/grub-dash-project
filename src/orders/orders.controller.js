const path = require("path");

// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));

// Use this function to assigh ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /orders handlers needed to make the tests pass

// Middleware functions
const bodyDataHas = propertyName => {
  const checkbodyDataHas = (req, res, next) => {
    const { data = {} } = req.body;
    if (data[propertyName]) return next();
    next({
      status: 400,
      message: `Must include a ${propertyName}`,
    });
  };
  return checkbodyDataHas;
};


const propertiesHaveSyntax = propertyName =>{
  const checkPropertiesHaveSyntax = (req, res, next) => {
      const { data = {} } = req.body;
      if (data[propertyName] !== "") return next();
      next({
        status: 400,
        message: `Order must includes a ${propertyName}`,
      });  
    };
  return checkPropertiesHaveSyntax;
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
  const { data: { dishes } = {} } = req.body;
  for (let i = 0; i < dishes.length; i++) {
    if (!dishes[i].quantity || typeof dishes[i].quantity !== "number" ||  dishes[i].quantity <= 0) return next({
        status: 400,
        message: `dish ${i} must have a quantity that is an integer greater than 0`,
    });
  };
  next();
};

const orderExists = (req, res, next) => {
  const { orderId } = req.params;
  const foundOrder = orders.find(order => order.id === orderId);
  if (foundOrder) {
    res.locals.order = foundOrder;
    return next();
  };
  next({
    status: 404,
    message: `Order id not found: ${orderId}`,
  });
};

const orderIdsMatch = (req, res, next) => {
  const { orderId } = req.params;
  const { data: { id } = {} } = req.body;
  if (id && id !== orderId) return next({
    status: 400,
    message: `Order id does not match route id. Order: ${id}, route: ${orderId}`,
  });
  next();
};

const statusPropertyIsValid = (req, res, next) => {
  const { data = {} } = req.body;
  const { status } = data;
  if (!data.hasOwnProperty("status") || status === "" || status !== "pending") return next({
    status: 400,
    message: "Order must have a status of pending, preparing, out-for-delivery, delivered",
  }); else if (status === "delivered") return next({
        status: 400,
        message: "A delivered order cannot be changed",
      });
  next();
};

const statusPropertyNotPending = (req, res, next) => {
  const { status }  = res.locals.order;
  if (status !== "pending") return next({
    status: 400,
    message: "An order cannot be deleted unless it is pending."
  });
  next();
};


// Router handlers
const list = (req, res) => res.json({ data: orders });


const create = (req, res) => {
  const { data: { deliverTo, mobileNumber, status, dishes } = {} } = req.body;
  const newOrder = {
    id: nextId(),
    deliverTo,
    mobileNumber,
    status,
    ...dishes,
  };
  orders.push(newOrder);
  res.status(201).json({ data: newOrder });  
};

const read = (req, res) => res.json({ data: res.locals.order });


const update = (req, res) => {
  const { data: { deliverTo, mobileNumber, status, dishes } = {} } = req.body;
  const order = res.locals.order;
  order.deliverTo = deliverTo;
  order.mobileNumber = mobileNumber;
  order.status = status;
  order.dishes = dishes;
  res.json({ data: order });
};

const destroy = (req, res) => {
  const { orderId } = req.params;
  const index = orders.findIndex((order) => order.id === orderId);
  orders.splice(index, 1);
  res.sendStatus(204);  
};

module.exports = {
  create: [
    bodyDataHas("deliverTo"),
    bodyDataHas("mobileNumber"),
    propertiesHaveSyntax("status"),
    checkDishesProperty,
    quantityIsValidNumber,
    create
  ],
  read: [
    orderExists,
    read
  ],
  update: [
    orderExists,
    orderIdsMatch,
    statusPropertyIsValid,
    bodyDataHas("deliverTo"),
    bodyDataHas("mobileNumber"),
    checkDishesProperty,
    quantityIsValidNumber,
    update
  ],
  delete: [
    orderExists,
    orderIdsMatch,
    statusPropertyNotPending,
    destroy
  ],
  list
};