const express = require('express');
const path = require('path');
const db = require('./config/connection');
// const routes = require('./routes');

// import apollo server
const { ApolloServer } = require('apollo-server-express');
const { authMiddleware } = require('./utils/auth');
// impor typeDefs and resolvers
const { typeDefs, resolvers } = require('./Schemas');


const app = express();
const PORT = process.env.PORT || 3001;

// Create new Apollor  server and pass in the schema data
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});


// Create a new instance of an Apollo server with the GraphQL schema
const startApolloSever = async (typeDefs, resolvers) => {
  await server.start();
  server.applyMiddleware({ app });

  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`API server running on port http://localhost:${PORT}`);
      console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
    })
  })
};

// Call the funcion to start the server 
startApolloSever(typeDefs, resolvers);