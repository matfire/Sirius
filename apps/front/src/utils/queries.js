import { gql } from '@urql/svelte';

export const lastRecord = gql`
	query {
		lastRecord {
			id
			latitude
			longitude
		}
	}
`;

export const recordCreated = gql`
	subscription {
		recordCreated {
			id
			latitude
			longitude
		}
	}
`;
