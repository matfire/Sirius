import mapbox from "mapbox-gl";
import { useParams } from "react-router-dom";
import userContext from "../context/userContext";
import { useContext, useState, useEffect, useRef } from "react";
import { useHistory, useLocation } from "react-router";
import queryString from "query-string";
import {
  app,
  createPositionRecord,
  ISSPosition,
  UserPosition,
} from "../utils/appwrite";
import toast from "react-hot-toast";
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
  const map = useRef<mapbox.Map>();
  const userC = useContext(userContext);
  const [position, setPosition] = useState<UserPosition | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const marker = useRef<HTMLDivElement>(null);
  const IssPosition = useRef<mapbox.Marker>(new mapbox.Marker());
  const [issLocation, setIssLocation] = useState<ISSPosition | undefined>(
    undefined
  );
  const mapContainer = useRef<HTMLDivElement>(null);
  mapbox.accessToken = MAPBOX_TOKEN;

  useEffect(() => {
    const getPosition = async () => {
      try {
        const res = await app.database.getDocument<UserPosition>(
          USER_POSITION_COLLECTION,
          idlocation
        );
        setPosition(res);
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
          map.current !== undefined &&
          marker.current !== null &&
          issLocation !== undefined
        ) {
          console.log("positioning stuff");
          IssPosition.current = new mapbox.Marker(marker.current);
          IssPosition.current
            .setLngLat({
              lat: issLocation.latitude,
              lon: issLocation.longitude,
            })
            .addTo(map.current);
        }
      } catch (error) {
        toast.error(
          "Something went wrong while trying to retrieve iss position. Please try again"
        );
        console.error(error);
      }
    };
    checkForISS();
  }, [location, map, issLocation]);

  useEffect(() => {
    const getPositions = () => {
      if (map.current !== undefined && position) {
        new mapbox.Marker()
          .setLngLat({ lat: position.latitude, lon: position.longitude })
          .addTo(map.current);
        map.current?.setCenter({
          lon: position.longitude,
          lat: position.latitude,
        });
      }
    };
    if (userC.user) getPositions();
  }, [userC, map, position]);

  useEffect(() => {
    if (map.current) return;
    if (mapContainer.current !== null) {
      map.current = new mapbox.Map({
        container: mapContainer.current,
        center: { lat: 46.56667, lon: 3.33333 },
        zoom: 4,
        style: "mapbox://styles/mapbox/dark-v10",
      });
    }
  });

  return (
    <div className="w-full h-full flex flex-col md:flex-row">
      {loading && (
        <LoadingScreen text="Fetching data for selected time, please wait..." />
      )}

      <div
        ref={marker}
        className={`h-12 w-12 bg-cover cursor-pointer ${!issLocation ? "hidden" : ""
          }`}
        style={{ backgroundImage: "url('/assets/satellite.png')" }}
        onClick={() => {
          history.push(`/details/${issLocation?.timestamp}`);
        }}
      ></div>
      <div className="w-full md:w-2/3 h-96 md:h-full">
        <div className="h-full w-full" ref={mapContainer} />
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
