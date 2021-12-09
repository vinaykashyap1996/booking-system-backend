const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql').graphqlHTTP;
var { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const Event = require('./models/events')
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

const app = express();

app.use(bodyParser.json())

app.use('/graphql', graphqlHttp({
    schema: schema,
    rootValue: {
        events: () => {
        return Event.find().then(results =>{
         return results.map(result =>{
            return {...result._doc , _id: result.id}
          })
        }).catch(err =>{
          throw err;
        })
        } ,
        createEvent:(args) =>{
            const event = new Event({
              title:args.eventInput.title,
                description:args.eventInput.description,
                price: +args.eventInput.price,
                date: new Date(args.eventInput.date)
            })
            event.save().then(result =>{
              return {...result}
            }).catch(err =>{
              throw err;
            })
            return event;
        
    }
  },
    graphiql: true,

  }));

   mongoose.connect(process.env.MONGO_user).then().catch(err =>{
  console.log(err)
})
app.listen('4000')