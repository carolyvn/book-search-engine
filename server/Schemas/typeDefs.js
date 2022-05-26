const { gql } = require('apollo-server-express');

// Define the Query and Mutation types
const typeDefs = gql`
    type User {
        _id: ID
        username: String
        email: String
        bookCount: Int
        saveBooks: [Book] 
    }

    type Book {
        bookId: String
        authors: [String]!
        description: String
        title: String
        image: String
        link: String
    }

    type Auth {
        token: ID!
        user: User
    }

    input saveBook {
        authors: [String]
        description: String
        title: String
        bookId: Sring
        image: String
        link: String
    }

    type Query {
        me: User
        # user(userId: ID!): User
    }

    type Mutation {
        addUser(username: String!, email: String!, password: String!): Auth
        login(email: String!, password: String!): Auth
        saveBook(input: saveBook!): User
        removeBook(bookId: String!): User
    }
`;

module.exports = typeDefs;