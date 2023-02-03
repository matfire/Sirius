import {gql} from "urql"

export const LAST_RECORD = gql`
query {
  lastRecord {
    date
    longitude
    latitude
  }
}
`