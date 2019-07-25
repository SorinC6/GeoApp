const { AuthenticationError } = require("apollo-server");

const user = {
  _id: "1",
  name: "Sorin",
  email: "t@t.com",
  picture:
    "https://res.cloudinary.com/dhsegkn40/image/upload/v1563542859/samples/ecommerce/leather-bag-gray.jpg"
};

const authenticated = next => (root, args, ctx, info) => {
  if (!ctx.currentUser) {
    throw new AuthenticationError("You must be logged in");
  }
  return next(root, args, ctx);
};

module.exports = {
  Query: {
    me: authenticated((root, args, ctx) => ctx.currentUser)
  }
};
