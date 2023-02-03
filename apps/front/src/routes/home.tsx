import { useMemo } from "react";
import { Map, Marker } from "react-map-gl";
import { useQuery } from "urql"
import { Record } from "../models/Record.model";
import { LAST_RECORD } from "../utils/queries";
import 'mapbox-gl/dist/mapbox-gl.css';

export default function Home() {


    const [record] = useQuery({
        query: LAST_RECORD,
    });
    const lastPosition: Record = useMemo(() => {
        if (record.data) return record.data.lastRecord
    }, [record])

    if (record.fetching) return (<p>loading...</p>)

    return (
        <div className="w-full h-full">
            <Map
                mapboxAccessToken={import.meta.env.VITE_MAP_TOKEN}
                mapStyle="mapbox://styles/mapbox/streets-v9"
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
                </Marker>
            </Map>
        </div>
    )
}