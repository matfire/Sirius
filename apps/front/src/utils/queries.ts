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

export const LOCATIONS = gql`
query {
  locations {
    latitude
    longitude
    id
    name
  }
}
`