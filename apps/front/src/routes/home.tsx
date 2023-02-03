import { useContext, useMemo } from "react";
import { Map, Marker } from "react-map-gl";
import { useQuery } from "urql"
import { Icon } from '@iconify/react';
import { Record } from "../models/Record.model";
import { LAST_RECORD } from "../utils/queries";
import 'mapbox-gl/dist/mapbox-gl.css';
import { themeContext } from "../contexts/theme.context";

export default function Home() {

    const { theme } = useContext(themeContext)
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