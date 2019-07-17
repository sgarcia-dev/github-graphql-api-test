const { ApolloServer, gql } = require('apollo-server');
const { RedisCache } = require('apollo-server-cache-redis');
const fs = require('fs');
const resolvers = require('./resolvers');
const UserAPI = require('./data/user');
const CustomUserAPI = require('./data/user.custom');

const schema = fs.readFileSync('./schema.graphql');
const typeDefs = gql`${schema}`;
let cache = new RedisCache({
  host: 'localhost',
  port: 6379
});

const server = new ApolloServer({
  typeDefs,
  resolvers,
  cache,
  dataSources: () => ({
    userAPI: new UserAPI(),
    customUserAPI: new CustomUserAPI()
  })
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
