const express = require('express');
const path = require('path');
const db = require('./config/connection');
// const routes = require('./routes');

const { ApolloServer } = require('apollo-server-express');
const { authMiddleware } = require('./utils/auth');
// impor typeDefs and resolvers
const { typeDefs, resolvers } = require('./Schemas');
const { type } = require('os');

const app = express();
const PORT = process.env.PORT || 3001;

// Create new Apollor  server and pass in the schema data
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware
});


server.applyMiddleware({ app });

app.use(express.urlencoded({ extended: false }));
app.use(express.json());



// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

// app.use(routes);

// db.once('open', () => {
//   app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
// });

// Create a new instance of an Apollo server with the GraphQL schema
const startApolloSever = async (typeDefs, resolvers) => {
  await server.start();
  server.applyMiddleware({ app });

  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
    })
  })
};

// Call the funcion to start the server 
startApolloSever(typeDefs, resolvers);