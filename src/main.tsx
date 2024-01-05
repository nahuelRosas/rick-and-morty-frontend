import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import React from 'react';
import './index.css';

const client = new ApolloClient({
	uri: 'https://rickandmortyapi.com/graphql',
	cache: new InMemoryCache(),
});

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<ApolloProvider client={client}>
			<App />
		</ApolloProvider>
	</React.StrictMode>,
);
