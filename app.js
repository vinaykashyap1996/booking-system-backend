const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql').graphqlHTTP;
var { buildSchema } = require('graphql');

var schema = buildSchema(`
  type RootQuery {
    events: [String!]!
  }

  type RootMutation {
    createEvent(name: String): String 
  }

  schema {
      query: RootQuery
      mutation:RootMutation
  }  
`);



const app = express();

app.use(bodyParser.json())

app.use('/graphql', graphqlHttp({
    schema: schema,
    rootValue: {
        events: () => {

         return ["Gaming" , "playing" , "movie night"]

        } ,
        createEvent:(args) =>{
            const EventName = args.name;
            return EventName;
        }
    },
    graphiql: true,
  }));
  

app.listen('3000')