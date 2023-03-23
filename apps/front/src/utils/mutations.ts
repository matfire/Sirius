import {gql} from "urql"
export const REGISTER = gql`
    mutation($username: String!, $password: String!, $email: String!) {
        register(registerInput: {email: $email, password:$password, username:$username}) {
            access_token
        }
    }
`

export const LOGIN = gql`
    mutation($password: String!, $email: String!) {
        login(loginInput: {email: $email, password:$password}) {
            access_token
        }
    }
`

export const CREATE_LOCATION = gql`
    mutation($latitude: Float!, $longitude: Float!, $name: String!) {
        createLocation(locationInput: {latitude:$latitude, longitude:$longitude, name:$name}) {
            id
        }
    }
`

export const DELETE_LOCATION = gql`
    mutation($id: Float!) {
        deleteLocation(id: $id) {
            id
        }
    }
`