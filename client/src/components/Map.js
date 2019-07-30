import React, { useState, useEffect, useContext } from "react";
import Context from "../context";
import { withStyles } from "@material-ui/core/styles";
import ReactMapGL, { NavigationControl, Marker } from "react-map-gl";
import PinIcon from "./PinIcon";
import Blog from "./Blog";
import differentsInMinutes from "date-fns/difference_in_minutes";

// import Button from "@material-ui/core/Button";
// import Typography from "@material-ui/core/Typography";
// import DeleteIcon from "@material-ui/icons/DeleteTwoTone";

import { useClient } from "../clientQl";
import { GET_PINS_QUERY } from "../graphql/queries";

const INITIAL_VIEWPORT = {
  latitude: 37.7557,
  longitude: -122.4376,
  zoom: 13
};

const Map = ({ classes }) => {
  const [viewport, setViewport] = useState(INITIAL_VIEWPORT);
  const [userPosition, setUserPosition] = useState(null);
  const { state, dispatch } = useContext(Context);
  const client = useClient();

  useEffect(() => {
    getUserPosition();
  }, []);

  useEffect(() => {
    getPins();
  }, []);

  const getPins = async () => {
    const { getPins } = await client.request(GET_PINS_QUERY);
    console.log(getPins);
    dispatch({ type: "GET_PINS", payload: getPins });
  };

  const getUserPosition = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          setViewport({ ...viewport, latitude, longitude });
          setUserPosition({ latitude, longitude });
        },
        failure => {
          console.log(failure);
        },
        { timeout: 10000, enableHighAccuracy: true }
      );
    }
  };

  const highlightNewPin = pin => {
    const isNewPin =
      differentsInMinutes(Date.now(), Number(pin.createdAt)) <= 300;

    return isNewPin ? "hotpink" : "blue";
  };

  const handleMapClick = ({ lngLat, leftButton }) => {
    if (!leftButton) return;
    if (!state.draft) {
      dispatch({ type: "CREATE_DRAFT" });
    }
    const [longitude, latitude] = lngLat;
    dispatch({ type: "UPDATE_PIN_LOCATION", payload: { longitude, latitude } });
  };

  return (
    <div className={classes.root}>
      <ReactMapGL
        width="100vw"
        height="calc(100vh - 64px)"
        mapStyle="mapbox://styles/mapbox/streets-v9"
        mapboxApiAccessToken="pk.eyJ1Ijoic29yaW5jNiIsImEiOiJjanlqdm5mbzMwM25kM2N0NXlyamt5azUyIn0.9_AQS_7oO8NUIJeCbk6SkQ"
        onViewportChange={newViewport => setViewport(newViewport)}
        onClick={handleMapClick}
        {...viewport}
      >
        <div className={classes.navigationControl}>
          <NavigationControl
            onViewportChange={newViewport => setViewport(newViewport)}
          />
        </div>
        {userPosition && (
          <Marker
            latitude={userPosition.latitude}
            longitude={userPosition.longitude}
            offsetLeft={-19}
            offsetTop={-37}
          >
            <PinIcon size={40} color="red" />
          </Marker>
        )}

        {/* Draft Pin */}
        {state.draft && (
          <Marker
            latitude={state.draft.latitude}
            longitude={state.draft.longitude}
            offsetLeft={-19}
            offsetTop={-37}
          >
            <PinIcon size={40} color="blue" />
          </Marker>
        )}
        {/* Created PINS: */}
        {state.pins.map(pin => {
          return (
            <Marker
              key={pin._id}
              latitude={pin.latitude}
              longitude={pin.longitude}
              offsetLeft={-19}
              offsetTop={-37}
            >
              <PinIcon size={40} color={highlightNewPin(pin)} />
            </Marker>
          );
        })}
      </ReactMapGL>
      {/* Blog Area */}
      <Blog />
    </div>
  );
};

const styles = {
  root: {
    display: "flex"
  },
  rootMobile: {
    display: "flex",
    flexDirection: "column-reverse"
  },
  navigationControl: {
    position: "absolute",
    top: 0,
    left: 0,
    margin: "1em"
  },
  deleteIcon: {
    color: "red"
  },
  popupImage: {
    padding: "0.4em",
    height: 200,
    width: 200,
    objectFit: "cover"
  },
  popupTab: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column"
  }
};

export default withStyles(styles)(Map);
