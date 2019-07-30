import React, { useState, useEffect, useContext } from "react";
import Context from "../context";
import { withStyles } from "@material-ui/core/styles";
import ReactMapGL, { NavigationControl, Marker, Popup } from "react-map-gl";
import PinIcon from "./PinIcon";
import Blog from "./Blog";
import differentsInMinutes from "date-fns/difference_in_minutes";

import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import DeleteIcon from "@material-ui/icons/DeleteTwoTone";

import { useClient } from "../clientQl";
import { GET_PINS_QUERY } from "../graphql/queries";
import { DELETE_PIN_MUTATION } from "../graphql/mutations";

import { Subscription } from "react-apollo";
import {
  PIN_ADDED_SUBSCRIPTION,
  PIN_UPDATED_SUBSCRIPTION,
  PIN_DELETED_SUBSCRIPTION
} from "../graphql/subscriptions";

const INITIAL_VIEWPORT = {
  latitude: 37.7557,
  longitude: -122.4376,
  zoom: 13
};

const Map = ({ classes }) => {
  const [viewport, setViewport] = useState(INITIAL_VIEWPORT);
  const [userPosition, setUserPosition] = useState(null);
  const [popup, setPopup] = useState(null);
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

  const handleSelectPin = pin => {
    setPopup(pin);
    dispatch({ type: "SET_PIN", payload: pin });
  };

  const handleMapClick = ({ lngLat, leftButton }) => {
    setPopup(null);
    if (!leftButton) return;
    if (!state.draft) {
      dispatch({ type: "CREATE_DRAFT" });
    }
    const [longitude, latitude] = lngLat;
    dispatch({ type: "UPDATE_PIN_LOCATION", payload: { longitude, latitude } });
  };

  const isAuthUser = () => {
    return state.currentUser._id === popup.author._id;
  };

  const handeDeletePin = async pin => {
    const variables = { pinId: pin._id };
    const data = await client.request(DELETE_PIN_MUTATION, variables);
    const { deletedPin } = data;
    dispatch({ type: "DELETE_PIN", payload: deletedPin });
    setPopup(null);
    getPins();
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
              <PinIcon
                onClick={() => handleSelectPin(pin)}
                size={40}
                color={highlightNewPin(pin)}
              />
            </Marker>
          );
        })}

        {/* Popup dialog for created pins */}
        {popup && (
          <Popup
            anchor="top"
            latitude={popup.latitude}
            longitude={popup.longitude}
            closeOnClick={false}
            onClose={() => setPopup(null)}
          >
            <img
              className={classes.popupImage}
              src={popup.image}
              alt={popup.title}
            />
            <div className={classes.popupTab}>
              <Typography>
                {popup.latitude.toFixed(6)},{popup.latitude.toFixed(6)}
              </Typography>
              {isAuthUser() && (
                <Button>
                  <DeleteIcon
                    className={classes.deleteIcon}
                    onClick={() => handeDeletePin(popup)}
                  />
                </Button>
              )}
            </div>
          </Popup>
        )}
      </ReactMapGL>
      {/* Subscriptions - for addinf /update/delete pins */}
      <Subscription
        subscription={PIN_ADDED_SUBSCRIPTION}
        onSubscriptionData={({ subscriptionData }) => {
          const { pinAdded } = subscriptionData.data;
          dispatch({ type: "CREATE_PIN", payload: pinAdded });
        }}
      />
      <Subscription
        subscription={PIN_UPDATED_SUBSCRIPTION}
        onSubscriptionData={({ subscriptionData }) => {
          const { pinUpdate } = subscriptionData.data;
          dispatch({ type: "CREATE_COMMENT", payload: pinUpdate });
        }}
      />
      <Subscription
        subscription={PIN_DELETED_SUBSCRIPTION}
        onSubscriptionData={({ subscriptionData }) => {
          const { pinDeleted } = subscriptionData.data;
          dispatch({ type: "DELETE_PIN", payload: pinDeleted });
        }}
      />
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
