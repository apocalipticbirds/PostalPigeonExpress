
import express from 'express';
import {
  graphqlExpress,
  graphiqlExpress,
} from 'graphql-server-express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import { schema } from './src/schema';

import { execute, subscribe } from 'graphql';
import { createServer } from 'http';
import { SubscriptionServer } from 'subscriptions-transport-ws';

const isAuth = require('./middleware/is-auth');

mongoose.connect('mongodb+srv://user1:ZZQLuMDv5dOJEEmB@cluster0-jhmtv.mongodb.net/postalpigeon?retryWrites=true');
mongoose.connection.once('open', () => {
  console.log('Connected to Mongo')
});


const PORT = 4000;
const server = express();

//Czemu tutaj jest port 3000 a serwer się uruchamia na 4000??
//CORS służy do ochrony przed dostępem z nieautoryzowanych stron
server.use('*', cors({ origin: 'http://localhost:3000' }));

server.use(isAuth);
server.use('/graphql', bodyParser.json(), graphqlExpress(req => ({
  schema,
  context: req
})));

server.use('/graphiql', graphiqlExpress({
  endpointURL: '/graphql',
  subscriptionsEndpoint: `ws://localhost:4000/subscriptions`
}));

// We wrap the express server so that we can attach the WebSocket for subscriptions
const ws = createServer(server);

ws.listen(PORT, () => {
  console.log(`GraphQL Server is now running on http://localhost:${PORT}`);

  // Set up the WebSocket for handling GraphQL subscriptions
  new SubscriptionServer({
    execute,
    subscribe,
    schema
  }, {
    server: ws,
    path: '/subscriptions',
  });
});
