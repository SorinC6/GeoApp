require("dotenv").config();
const mongoose = require("mongoose");
const { ApolloServer } = require("apollo-server");

const typeDefs = require("./typeDefs");
const resolvers = require("./resolvers");

// mongoose
//   .connect(
//     "mongodb+srv://Scama:test123@geoapp-zjuzv.mongodb.net/test?retryWrites=true&w=majority",
//     { useNewUrlParser: true }
//   )
//   .then(() => console.log("MongoDb connected"))
//   .catch(err => console.log(err));

mongoose.connect(
  "mongodb://Scama:test123@geoapp-shard-00-00-zjuzv.mongodb.net:27017,geoapp-shard-00-01-zjuzv.mongodb.net:27017,geoapp-shard-00-02-zjuzv.mongodb.net:27017/test?ssl=true&replicaSet=GeoApp-shard-0&authSource=admin&retryWrites=true&w=majority",
  { useNewUrlParser: true }
);
mongoose.connection.once("open", () => {
  console.log("Connected to Database Woop Woop");
});

const server = new ApolloServer({
  typeDefs,
  resolvers
});

server.listen().then(({ url }) => {
  console.log(`Server is listening on : ${url}`);
});
