import { useContext, useMemo } from "react";
import { Map, Marker } from "react-map-gl";
import { useQuery, useSubscription } from "urql"
import { Icon } from '@iconify/react';
import { Record } from "../models/Record.model";
import { LAST_RECORD } from "../utils/queries";
import 'mapbox-gl/dist/mapbox-gl.css';
import { themeContext } from "../contexts/theme.context";
import { GET_RECORDS } from "../utils/subscriptions";

function handleNewRecords(old: Record[] | undefined, response: { recordCreated: Record; }) {
    console.log(old, response)
    if (old) {
        return [response.recordCreated, ...old]
    }
    return [response.recordCreated]
}

export default function Home() {

    const { theme } = useContext(themeContext)
    const [record] = useQuery({
        query: LAST_RECORD,
    });
    const [res] = useSubscription({ query: GET_RECORDS }, handleNewRecords);
    const lastPosition: Record = useMemo(() => {
        if (res?.data?.length && res?.data.length > 0) return res?.data?.at(0)
        if (record.data) return record.data.lastRecord
    }, [record, res])

    if (record.fetching) return (<p>loading...</p>)

    return (
        <div className="w-full h-full">
            <Map
                mapboxAccessToken={import.meta.env.VITE_MAP_TOKEN}
                mapStyle={theme === "light" ? "mapbox://styles/mapbox/streets-v9" : "mapbox://styles/mapbox/dark-v11"}
                style={{ width: "100%", height: "100%" }}
                initialViewState={
                    {
                        latitude: lastPosition.latitude,
                        longitude: lastPosition.longitude,
                        zoom: 9
                    }
                }
            >
                <Marker latitude={lastPosition.latitude} longitude={lastPosition.longitude}>
                    <Icon className="h-16 w-auto" icon="noto:satellite" />
                </Marker>
            </Map>
        </div>
    )
}