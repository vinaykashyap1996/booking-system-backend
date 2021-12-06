const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql').graphqlHTTP;
var { buildSchema } = require('graphql');

var schema = buildSchema(`
  type Event{
      _id:ID!
      title:String!
      description:String!
      price:Float!
      date:String!

  }

  input EventInput {
    title:String!
    description:String!
    price:Float!
    date:String!
  }

  type RootQuery {
    events: [Event!]!
  }

  type RootMutation {
    createEvent(eventInput: EventInput): Event 
  }

  schema {
      query: RootQuery
      mutation:RootMutation
  }  
`);

const events =[];

const app = express();

app.use(bodyParser.json())

app.use('/graphql', graphqlHttp({
    schema: schema,
    rootValue: {
        events: () => {
         return events;
        } ,
        createEvent:(args) =>{
            const event = {
                _id:Math.random.toString(),
                title:args.eventInput.title,
                description:args.eventInput.description,
                price: +args.eventInput.price,
                date: args.eventInput.date
            }
            events.push(event);
            return event;
        }
    },
    graphiql: true,
  }));
  

app.listen('3000')