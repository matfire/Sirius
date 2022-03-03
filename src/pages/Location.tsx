import { useParams } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router";
import queryString from "query-string";
import toast from "react-hot-toast";
import { Map, Marker } from "react-map-gl";
import {
  app,
  createPositionRecord,
  ISSPosition,
  UserPosition,
} from "../utils/appwrite";
import userContext from "../context/userContext";
import LoadingScreen from "../components/LoadingScreen";
import {
  MAPBOX_TOKEN,
  POSITION_COLLECTION,
  USER_POSITION_COLLECTION,
} from "../utils/constants";

const Location = () => {
  const { idlocation } = useParams<{ idlocation: string }>();
  const history = useHistory();
  const location = useLocation();
  const userC = useContext(userContext);
  const [position, setPosition] = useState<UserPosition | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [issLocation, setIssLocation] = useState<ISSPosition | undefined>(
    undefined
  );
  const [viewState, setViewState] = useState({
    longitude: -100,
    latitude: 40,
    zoom: 4
  });

  useEffect(() => {
    const getPosition = async () => {
      try {
        const res = await app.database.getDocument<UserPosition>(
          USER_POSITION_COLLECTION,
          idlocation
        );
        setPosition(res);
        setViewState({ ...viewState, latitude: res.latitude, longitude: res.longitude })
        console.log(res);
        console.log(userC.user);
        setLoading(false);
      } catch (error) {
        console.error(error);
        toast.error("Error position");
        setLoading(false);
      }
    };
    if (userC.user && !position) getPosition();
  });

  useEffect(() => {
    const checkForISS = async () => {
      try {
        if (issLocation === undefined) {
          const { issId } = queryString.parse(location.search);
          console.log(issId);
          if (issId !== undefined && typeof issId === "string") {
            const iss = await app.database.getDocument<ISSPosition>(
              POSITION_COLLECTION,
              issId
            );
            setIssLocation(iss);
          }
        }
        if (
          issLocation !== undefined
        ) {
          console.log("positioning stuff");
        }
      } catch (error) {
        toast.error(
          "Something went wrong while trying to retrieve iss position. Please try again"
        );
        console.error(error);
      }
    };
    checkForISS();
  }, [location, issLocation]);

  if (loading) {
    return (
      <div className="w-full h-full">
        <LoadingScreen text="Fetching data for selected time, please wait..." />
      </div>
    )
  }

  return (
    <div className="w-full h-full flex flex-col md:flex-row">
      <div className="w-full md:w-2/3 h-96 md:h-full">
        <Map
          style={{ height: "100%", width: "100%" }}
          mapStyle="mapbox://styles/mapbox/dark-v10"
          mapboxAccessToken={MAPBOX_TOKEN}
          onMove={evt => setViewState(evt.viewState)}
          {...viewState}>
          <Marker
            longitude={position?.longitude}
            latitude={position?.latitude}
          >

          </Marker>
          {issLocation &&
            <Marker
              latitude={issLocation.latitude}
              longitude={issLocation.longitude}
              onClick={() => {
                history.push(`/details/${issLocation?.timestamp}`);
              }}
            >
              <img className={`h-12 w-12 bg-cover cursor-pointer ${!issLocation ? "hidden" : ""
                }`} alt="satellite" src="/assets/satellite.png" />
            </Marker>}
        </Map>
      </div>
      <div className="flex flex-col justify-evenly w-full md:w-1/3">
        <div className="w-full">
          <div className="w-full px-4">
            <button
              onClick={async () => {
                await app.database.deleteDocument(
                  USER_POSITION_COLLECTION,
                  idlocation
                );
                history.push("/");
                toast.success("Delete position");
              }}
              className={`btn btn-primary btn-block mt-5 lg:mt-0`}
              disabled={userC.user?.$id !== position?.user}
            >
              Delete Position
            </button>
            {userC.user !== undefined &&
              userC.user?.$id !== position?.user &&
              position !== undefined && (
                <button
                  className="btn btn-secondary btn-block mt-3"
                  onClick={async () => {
                    try {
                      await createPositionRecord({
                        user: userC.user!.$id,
                        latitude: position?.latitude,
                        longitude: position?.longitude,
                      });
                      toast.success("Added location to track record");
                    } catch (error) {
                      console.error(error);
                      toast.error("Could not add location to track record");
                    }
                  }}
                >
                  Track Position
                </button>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Location;
