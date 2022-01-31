import mapbox from "mapbox-gl";
import { useContext, useEffect, useRef, useState } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import { app, ISSPosition, UserPosition } from "../utils/appwrite";
import {
  MAPBOX_TOKEN,
  POSITION_COLLECTION,
  USER_POSITION_COLLECTION,
} from "../utils/constants";
import { useHistory } from "react-router";
import LoadingScreen from "../components/LoadingScreen";
import userContext from "../context/userContext";
import { useHasInternet } from "../context/hasInternetContext";
import { Query } from "appwrite";

const Home = () => {
  mapbox.accessToken = MAPBOX_TOKEN;
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapbox.Map>();
  const marker = useRef<HTMLDivElement>(null);
  const history = useHistory();
  const userC = useContext(userContext);
  const hasInternet = useHasInternet();
  const IssPosition = useRef<mapbox.Marker>(new mapbox.Marker());
  const [currentIss, setCurrentIss] = useState<ISSPosition>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initMapAndPositions = async () => {
      if (map.current) return;
      if (!hasInternet) return;
      if (
        mapContainer.current !== null &&
        IssPosition.current !== null &&
        marker.current !== null
      ) {
        map.current = new mapbox.Map({
          container: mapContainer.current,
          center: { lat: 46.56667, lon: 3.33333 },
          zoom: 2,
          style: "mapbox://styles/mapbox/dark-v10",
        });
        IssPosition.current = new mapbox.Marker(marker.current);
        const lastPosition = await app.database.listDocuments<ISSPosition>(
          POSITION_COLLECTION,
          [],
          1,
          0,
          undefined,
          undefined,
          ["timestamp"],
          ["DESC"]
        );
        IssPosition.current
          .setLngLat({
            lat: lastPosition.documents[0]["latitude"],
            lon: lastPosition.documents[0]["longitude"],
          })
          .addTo(map.current);
        setCurrentIss(lastPosition.documents[0]);
        setLoading(false);
      }
    };
    initMapAndPositions();
  }, [hasInternet]);

  useEffect(() => {
    if (hasInternet) {
      const unsub = app.subscribe(
        `collections.${POSITION_COLLECTION}.documents`,
        onDocumentsUpdate
      );

      return unsub;
    }
  }, [hasInternet]);

  const onDocumentsUpdate = (payload: {
    event: string;
    payload: ISSPosition;
  }) => {
    if (payload.event === "database.documents.create") {
      IssPosition.current.setLngLat({
        lon: payload.payload.longitude,
        lat: payload.payload.latitude,
      });
      setCurrentIss(payload.payload);
    }
  };

  useEffect(() => {
    const getPositions = async () => {
      try {
        if (userC.user !== undefined) {
          const positions = await app.database.listDocuments<UserPosition>(
            USER_POSITION_COLLECTION,
            [Query.equal("user", userC.user.$id)]
          );
          positions.documents.forEach((e) => {
            if (map.current !== undefined) {
              new mapbox.Marker()
                .setLngLat({ lat: e.latitude, lon: e.longitude })
                .addTo(map.current)
                .getElement().onclick = () => {
                  history.push(`/location/${e.$id}`);
                };
            }
          });
        }
      } catch (error) {
        console.log("could not get user position");
      }
    };
    if (userC.user !== undefined) getPositions();
  }, [userC, map, history]);

  return (
    <div className="h-full w-full">
      {hasInternet && loading && (
        <LoadingScreen text="Fetching latest data, please wait..." />
      )}
      <div />
      {hasInternet || (!hasInternet && map.current) ? (
        <>
          <div
            ref={marker}
            className="h-12 w-12 bg-cover cursor-pointer"
            style={{ backgroundImage: "url('/assets/satellite.png')" }}
            onClick={() => {
              history.push(`/details/${currentIss?.timestamp}`);
            }}
          />
          <div className="h-full w-full" ref={mapContainer} />
        </>
      ) : (
        <div className="hero flex justify-center items-center h-full w-full">
          <div className="text-center hero-content">
            <div className="max-w-md">
              <h1 className="mb-5 text-5xl font-bold">Error</h1>
              <p className="mb-5">
                We cannot display the exact position of the ISS while you are
                offline. The page will reload automatically when you are
                connected to the internet again.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
