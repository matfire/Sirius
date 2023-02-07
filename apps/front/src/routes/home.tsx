import { useContext, useMemo, useRef, useState } from "react";
import { Map, MapRef, Marker, Popup } from "react-map-gl";
import { useQuery, useSubscription } from "urql"
import { Icon } from '@iconify/react';
import { Record } from "../models/Record.model";
import { LAST_RECORD, LOCATIONS } from "../utils/queries";
import 'mapbox-gl/dist/mapbox-gl.css';
import { themeContext } from "../contexts/theme.context";
import { GET_RECORDS } from "../utils/subscriptions";
import { Location } from "../models/Location.model";

function handleNewRecords(old: Record[] | undefined, response: { recordCreated: Record; }) {
    console.log(old, response)
    if (old) {
        return [response.recordCreated, ...old]
    }
    return [response.recordCreated]
}

export default function Home() {

    const { theme } = useContext(themeContext)
    const mapRef = useRef<MapRef | null>(null)
    const [record] = useQuery({
        query: LAST_RECORD,
    });
    const [popup, setPopup] = useState(-1)
    const [locationsQuery] = useQuery({ query: LOCATIONS })
    const [res] = useSubscription({ query: GET_RECORDS }, handleNewRecords);
    const lastPosition: Record = useMemo(() => {
        if (res?.data?.length && res?.data.length > 0) return res?.data?.at(0)
        if (record.data) return record.data.lastRecord
    }, [record, res])
    const locations: Location[] = useMemo(() => {
        return locationsQuery?.data?.locations || []
    }, [locationsQuery?.data])

    if (record.fetching) return (<p>loading...</p>)

    const changePopup = (idx: number) => {
        console.log("changing", idx)
        setPopup(idx)
    }

    return (
        <div className="w-full h-full relative">
            <div className="tooltip tooltip-left lg:tooltip-bottom absolute bottom-0  lg:top-0 lg:bottom-auto right-0 z-10 " data-tip="center on station">
                <button className="btn" onClick={() => {
                    mapRef?.current?.flyTo({ center: [lastPosition.longitude, lastPosition.latitude] })
                }}>Center On Station</button>
            </div>
            <Map
                ref={mapRef}
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
                {popup !== -1 && <Popup anchor="bottom" latitude={locations[popup].latitude} longitude={locations[popup].longitude} onClose={() => setPopup(-1)}>{locations[popup].name}</Popup>}
                {locations.map((e, idx) => <Marker key={e.id} onClick={() => { console.log(idx); changePopup(1) }} latitude={e.latitude} longitude={e.longitude} />)}
                <Marker latitude={lastPosition.latitude} longitude={lastPosition.longitude}>
                    <Icon className="h-16 w-auto" icon="noto:satellite" />
                </Marker>
            </Map>
        </div>
    )
}