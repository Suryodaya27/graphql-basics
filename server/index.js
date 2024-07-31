const express = require('express');
const {ApolloServer} = require('@apollo/server')
const {expressMiddleware} = require('@apollo/server/express4')
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');


async function startApolloServer(){
    const app = express();
    app.use(cors());
    app.use(bodyParser.json());

    const server = new ApolloServer({
        typeDefs:`

            type User {
                id: ID!
                name: String!
                username: String!
                email: String!
                phone: String!
                website: String!
            }

            type Todo {
                id: ID!
                title: String!
                completed: Boolean!
                user: User!
            }

            type Query {
                todos: [Todo]
                users: [User]
                user(id: ID!): User
            }

        `,
        resolvers:{
            Todo:{
                // parent is the Todo object
                user: async (parent) => {
                    return (await axios.get(`https://jsonplaceholder.typicode.com/users/${parent.userId}`)).data;
                }
            },
            Query:{
                todos: async () => {
                    return (await axios.get("https://jsonplaceholder.typicode.com/todos")).data;
                } ,
                users : async () => {
                    return (await axios.get("https://jsonplaceholder.typicode.com/users")).data;
                },
                user: async (_, {id}) => {
                    return (await axios.get(`https://jsonplaceholder.typicode.com/users/${id}`)).data;
                }
            }
        },
    });

    await server.start();

    app.use("/graphql",expressMiddleware(server));

    app.listen(4000, () => {
        console.log('Server is running on port 4000');
    });
}

startApolloServer();