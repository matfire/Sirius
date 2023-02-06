import { createClient, defaultExchanges, subscriptionExchange } from 'urql';
import { createClient as createWSClient } from 'graphql-ws';

const wsClient = createWSClient({
  url: import.meta.env.VITE_API_URL.replace("http", "ws"),
});

const client = createClient({
  url: import.meta.env.VITE_API_URL!,
  exchanges: [
    ...defaultExchanges,
    subscriptionExchange({
      forwardSubscription: (operation) => ({
        subscribe: (sink) => ({
          unsubscribe: wsClient.subscribe(operation, sink)
        })
      })
    })
  ]
});

export default client;