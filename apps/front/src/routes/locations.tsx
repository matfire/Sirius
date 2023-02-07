import { useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { useMutation, useQuery } from "urql"
import { Location } from "../models/Location.model"
import { ReverseLocation } from "../models/ReverseLocation.model"
import { CREATE_LOCATION } from "../utils/mutations"
import { LOCATIONS } from "../utils/queries"

export default function Locations() {

    const [result] = useQuery({
        query: LOCATIONS
    })
    const [createResult, createLocation] = useMutation(CREATE_LOCATION)
    const [searchResults, setSearchResults] = useState<ReverseLocation[]>([])
    const locations: Location[] = useMemo(() => {
        return result?.data?.locations || []
    }, [result.data])

    const { register, handleSubmit } = useForm()

    if (result.fetching) {
        return <p>loading...</p>
    }


    const onSubmit = async (v: any) => {
        let res = await (await fetch(`https://geocode.maps.co/search?q=${v.location}`)).json()
        setSearchResults(res);
        console.log(res)
    }

    const saveLocation = async (e: ReverseLocation) => {
        await createLocation({ name: e.display_name, latitude: parseFloat(e.lat), longitude: parseFloat(e.lon) })
    }


    return (
        <div className="w-full h-full">
            <form onSubmit={handleSubmit(onSubmit)}>
                <label className="label">Location</label>
                <input type="text" placeholder="search for a location" className="input" {...register("location")} required />
                <button className="btn" type="submit">Search</button>
            </form>

            <ul>
                {searchResults.map((e) => (
                    <li key={e.place_id}><span>{e.display_name}</span><button className="btn" onClick={() => saveLocation(e)}>Save</button></li>
                ))}
            </ul>
            <div className="divider"></div>

            <table className="table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Latitude</th>
                        <th>Longitude</th>
                        <th>GeoLocation</th>
                    </tr>
                </thead>
                <tbody>
                    {locations.map((e) => (
                        <tr key={e.id}>
                            <td>{e.id}</td>
                            <td>{e.latitude}</td>
                            <td>{e.longitude}</td>
                            <td>{e.name}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}