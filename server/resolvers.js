const user = {
  _id: "1",
  name: "Sorin",
  email: "t@t.com",
  picture:
    "https://res.cloudinary.com/dhsegkn40/image/upload/v1563542859/samples/ecommerce/leather-bag-gray.jpg"
};

module.exports = {
  Query: {
    me: () => user
  }
};
