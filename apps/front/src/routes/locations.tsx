import { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { useMutation, useQuery } from "urql"
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { Location } from "../models/Location.model"
import { ReverseLocation } from "../models/ReverseLocation.model"
import { CREATE_LOCATION, DELETE_LOCATION } from "../utils/mutations"
import { LOCATIONS } from "../utils/queries"

export default function Locations() {

    const [result, refetch] = useQuery({
        query: LOCATIONS
    })
    const [, createLocation] = useMutation(CREATE_LOCATION)
    const [, deleteLocation] = useMutation(DELETE_LOCATION)
    const [searchResults, setSearchResults] = useState<ReverseLocation[]>([])
    const [searchLoading, setSearchLoading] = useState(false);
    const [tableParent] = useAutoAnimate()
    const [listParent] = useAutoAnimate()
    const locations: Location[] = useMemo(() => {
        return result?.data?.locations || []
    }, [result.data])

    const { register, handleSubmit, watch } = useForm()
    const searchValue = watch("location");

    useEffect(() => {
        if (searchValue === "" && searchResults.length > 0) {
            setSearchResults([])
        }
    }, [searchValue])

    if (result.fetching) {
        return <p>loading...</p>
    }


    const onSubmit = async (v: any) => {
        setSearchLoading(true)
        let res = await (await fetch(`https://geocode.maps.co/search?q=${v.location}`)).json()
        setSearchResults(res);
        setSearchLoading(false)
    }

    const saveLocation = async (e: ReverseLocation) => {
        await createLocation({ name: e.display_name, latitude: parseFloat(e.lat), longitude: parseFloat(e.lon) })
    }


    return (
        <div className="w-full h-full flex flex-col">


            <table className="table w-full">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Latitude</th>
                        <th>Longitude</th>
                        <th>GeoLocation</th>
                    </tr>
                </thead>
                <tbody ref={tableParent}>
                    {locations.map((e) => (
                        <tr key={e.id}>
                            <td>{e.id}</td>
                            <td>{e.latitude}</td>
                            <td>{e.longitude}</td>
                            <td>{e.name}</td>
                            <td><button onClick={() => {
                                deleteLocation({ id: e.id }).then(() => {
                                    refetch()
                                })
                            }}>Delete</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="divider"></div>
            <div className="w-full flex">
                <div className="card w-1/3 bg-base-100 shadow-xl self-center">
                    <div className="card-body">
                        <h2 className="card-title">Add Location</h2>
                        <form onSubmit={handleSubmit(onSubmit)} className="mb-5 ">
                            <label className="label">Location</label>
                            <input disabled={searchLoading} type="search" placeholder="search for a location" className="input" {...register("location")} required />
                            <button disabled={searchLoading} className={`btn ${searchLoading ? "loading" : ""}`} type="submit">Search</button>
                        </form>
                    </div>
                </div>
                <div className="w-full">

                    <ul ref={listParent}>
                        {searchResults.map((e) => (
                            <li className="flex justify-between" key={e.place_id}><span>{e.display_name}</span><button className="btn" onClick={() => saveLocation(e)}>Save</button></li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}