import { createClient, defaultExchanges, subscriptionExchange } from '@urql/svelte';
import { createClient as createWSClient } from 'graphql-ws';
import { w3cwebsocket } from 'websocket';
import { PUBLIC_API } from '$env/static/public';

const wsClient = createWSClient({
	url: `${PUBLIC_API.replace('http', 'ws')}`,
	webSocketImpl: w3cwebsocket
});

const client = createClient({
	url: PUBLIC_API,
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
