require("dotenv").config();
const mongoose = require("mongoose");
const { ApolloServer } = require("apollo-server");
const { findOrCreateUser } = require("./controllers/userControler");

const typeDefs = require("./typeDefs");
const resolvers = require("./resolvers");

mongoose
  .connect(
    "mongodb://Scama:test123@geoapp-shard-00-00-zjuzv.mongodb.net:27017,geoapp-shard-00-01-zjuzv.mongodb.net:27017,geoapp-shard-00-02-zjuzv.mongodb.net:27017/test?ssl=true&replicaSet=GeoApp-shard-0&authSource=admin&retryWrites=true&w=majority",
    { useNewUrlParser: true }
  )
  .then(() => console.log("DB connected"))
  .catch(err => console.log(err));

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    let authToken = null;
    let currentUser = null;
    try {
      authToken = req.headers.authorization;
      if (authToken) {
        //find and create user
        currentUser = await findOrCreateUser(authToken);
      }
    } catch (error) {
      console.error(`Unable to authentificate user with token ${authToken}`);
    }
    return { currentUser };
  }
});

server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
  console.log(`Server is listening on : ${url}`);
});
