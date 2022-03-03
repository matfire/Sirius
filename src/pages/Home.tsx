import { ReactElement, useContext, useEffect, useState } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import Map, { Marker } from 'react-map-gl';
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
  const history = useHistory();
  const userC = useContext(userContext);
  const hasInternet = useHasInternet();
  const [currentIss, setCurrentIss] = useState<ISSPosition>();
  const [savedPositions, setSavedPositions] = useState<ReactElement[]>([])
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initMapAndPositions = async () => {
      if (!hasInternet) return;
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
      setCurrentIss(lastPosition.documents[0]);
      setLoading(false);

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
          const tmpPositions = positions.documents.map((e) => {
            return (
              <Marker
                onClick={() => history.push(`/location/${e.$id}`)}
                latitude={e.latitude}
                longitude={e.longitude}
              />
            );
          });
          setSavedPositions(tmpPositions);
        }
      } catch (error) {
        console.log("could not get user position");
      }
    };
    if (userC.user !== undefined) getPositions();
  }, [userC, history]);

  if (loading) {
    return (
      <div className="h-full w-full">
        <LoadingScreen text="Fetching latest data, please wait..." />
      </div>
    )
  }

  return (
    <div className="h-full w-full">
      {hasInternet ? (
        <>


          <Map style={{ height: "100%", width: "100%" }}
            mapboxAccessToken={MAPBOX_TOKEN}
            mapStyle="mapbox://styles/mapbox/dark-v10"
            initialViewState={{
              zoom: 2,
            }}>
            <Marker
              onClick={() => {
                history.push(`/details/${currentIss?.timestamp}`);
              }}
              latitude={currentIss?.latitude}
              longitude={currentIss?.longitude}
            >
              <img src="/assets/satellite.png" alt="satellite" className="h-12 w-12 bg-cover cursor-pointer"
              />
            </Marker>
            {savedPositions}
          </Map>
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
