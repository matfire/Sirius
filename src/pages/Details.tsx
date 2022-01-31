import mapbox from "mapbox-gl";
import { useEffect, useState, useRef, useContext } from "react";
import toast from "react-hot-toast";
import { Query } from "appwrite";
import { useParams } from "react-router-dom";
import LoadingScreen from "../components/LoadingScreen";
import userContext from "../context/userContext";
import { useHasInternet } from "../context/hasInternetContext";
import { app, createPositionRecord, ISSPosition } from "../utils/appwrite";
import { MAPBOX_TOKEN, POSITION_COLLECTION } from "../utils/constants";

const Details = () => {
  const { timestamp } = useParams<{ timestamp: string }>();
  const userC = useContext(userContext);
  const hasInternet = useHasInternet();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapbox.Map>();
  const marker = useRef<HTMLDivElement>(null);
  const IssPosition = useRef<mapbox.Marker>(new mapbox.Marker());
  mapbox.accessToken = MAPBOX_TOKEN;

  useEffect(() => {
    if (map.current) return;
    if (!hasInternet) return;
    if (mapContainer.current !== null) {
      map.current = new mapbox.Map({
        container: mapContainer.current,
        center: { lat: 46.56667, lon: 3.33333 },
        zoom: 4,
        style: "mapbox://styles/mapbox/dark-v10",
      });
    }
  }, [hasInternet]);

  useEffect(() => {
    const getPositions = async () => {
      if (timestamp) {
        try {
          console.log(Query.equal("timestamp", parseFloat(timestamp)))
          const value = await app.database.listDocuments<ISSPosition>(
            POSITION_COLLECTION,
            [
              Query.equal("timestamp", parseInt(timestamp))
            ]
          );
          const res = value.documents[0];
          setData({ ...res, onboard: JSON.parse(res.onboard) });
          if (marker.current !== null) {
            IssPosition.current = new mapbox.Marker(marker.current);
          }
          if (map.current?.setCenter && IssPosition.current !== null) {
            map.current.setCenter({ lat: res.latitude, lon: res.longitude });
            IssPosition.current
              .setLngLat({ lat: res.latitude, lon: res.longitude })
              .addTo(map.current);
          }
          setLoading(false);
        } catch (error) {
          console.error(error);
          toast.error(
            "Could not get data, something must have gone terribly wrong"
          );
          setLoading(false);
        }
      }
    };
    getPositions();
  }, [timestamp, hasInternet]);

  return (
    <div className="w-full h-full flex flex-col md:flex-row">
      {hasInternet && loading && (
        <LoadingScreen text="Fetching data for selected time, please wait..." />
      )}
      {hasInternet || (!hasInternet && map.current) ? (
        <>
          <div className="w-full md:w-2/3 h-96 md:h-full">
            <div
              ref={marker}
              className="h-12 w-12 bg-cover"
              style={{ backgroundImage: "url('/assets/satellite.png')" }}
            ></div>
            <div className="h-full w-full" ref={mapContainer} />
          </div>
          <div className="flex flex-col justify-evenly">
            <div className="text-center">
              <h1 className="font-bold text-xl">
                {new Date(parseInt(timestamp) * 1000).toLocaleString()}
              </h1>
              <span>
                {data?.latitude} Lat, {data?.longitude} Lon
              </span>
            </div>
            <div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                {data?.onboard.map((e: { name: string; craft: string }) => (
                  <div
                    className="flex flex-col items-center mx-2 my-2 text-center"
                    key={e.name}
                  >
                    <div className="avatar">
                      <div className="mb-4 rounded-full w-24 h-24">
                        <img
                          src={app.avatars.getInitials(e.name).toString()}
                          alt={e.name}
                        />
                      </div>
                    </div>
                    <span>{e.name}</span>
                    <span>Onboard the</span>
                    <span>{e.craft}</span>
                  </div>
                ))}
              </div>
              <div className="w-full px-4">
                <button
                  className={`btn btn-primary btn-block`}
                  onClick={() => {
                    if (navigator.share) {
                      navigator
                        .share({
                          title: "Sirius",
                          text: "The ISS was right here!",
                          url: `https://sirius.nirah.tech/details/${timestamp}`,
                        })
                        .then(() => {
                          toast.success("Shared!");
                        })
                        .catch(() => {
                          toast.error(
                            "Something went wrong while trying to share"
                          );
                        });
                    } else {
                      navigator.permissions
                        .query({ name: "clipboard-write" as PermissionName })
                        .then((result) => {
                          if (
                            result.state === "granted" ||
                            result.state === "prompt"
                          ) {
                            navigator.clipboard
                              .writeText(
                                `https://sirius.nirah.tech/details/${timestamp}`
                              )
                              .then(() => {
                                toast.success("Copied page url to clipboard");
                              })
                              .catch(() => {
                                toast.error(
                                  "Something prevented copying to clipboard"
                                );
                              });
                          }
                        });
                    }
                  }}
                >
                  Share this page
                </button>
              </div>
              <div className="w-full mt-4 px-4">
                {userC.user !== undefined ? (
                  <button
                    className="btn btn-block btn-info"
                    onClick={async () => {
                      if (userC.user) {
                        await createPositionRecord(
                          {
                            user: userC.user.$id,
                            latitude: data?.latitude,
                            longitude: data?.longitude,
                          },
                          true
                        );
                        toast.success("Tracking point added succesfully");
                      }
                    }}
                  >
                    Track this position
                  </button>
                ) : (
                  <div
                    data-tip="You need to sign in to use this functionality"
                    className="tooltip w-full"
                  >
                    <button className="btn btn-block btn-info" disabled>
                      Track this position
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="hero">
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

export default Details;
