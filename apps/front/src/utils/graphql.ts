import { createClient } from 'urql';

const client = createClient({
  url: import.meta.env.VITE_API_URL!,
});

export default client;