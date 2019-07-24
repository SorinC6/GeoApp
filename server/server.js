require("dotenv").config();
const mongoose = require("mongoose");
const { ApolloServer } = require("apollo-server");

const typeDefs = require("./typeDefs");
const resolvers = require("./resolvers");

mongoose.connect(
  "mongodb://Scama:test123@geoapp-shard-00-00-zjuzv.mongodb.net:27017,geoapp-shard-00-01-zjuzv.mongodb.net:27017,geoapp-shard-00-02-zjuzv.mongodb.net:27017/test?ssl=true&replicaSet=GeoApp-shard-0&authSource=admin&retryWrites=true&w=majority",
  { useNewUrlParser: true }
);
mongoose.connection.once("open", () => {
  console.log("Connected to Database Woop Woop");
});

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    let authToken = null;
    try {
      authToken = req.headers.authorization;
      if (authToken) {
        //find and create user
      }
    } catch (error) {
      console.error(`Unable to authentificate user with token ${authToken}`);
    }
  }
});

server.listen().then(({ url }) => {
  console.log(`Server is listening on : ${url}`);
});
