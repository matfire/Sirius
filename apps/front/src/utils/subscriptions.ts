import {gql} from "urql"

export const GET_RECORDS = gql`
    subscription {
        recordCreated {
            id
            latitude
            longitude
            date
        }
}
`