import { writable } from 'svelte/store';

export const position = writable({ latitude: 0, longitude: 0 });
