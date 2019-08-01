import React, { useContext } from "react";
import { withStyles } from "@material-ui/core/styles";
import { GoogleLogin } from "react-google-login";
// import FacebookLogin from "react-facebook-login";
import { GraphQLClient } from "graphql-request";
import Typography from "@material-ui/core/Typography";
import Context from "../../context";
import { ME_Query } from "../../graphql/queries";
import bg from "../../assets/bg.jpg";
import { blue } from "@material-ui/core/colors";

const Login = ({ classes }) => {
  const { dispatch } = useContext(Context);

  const onSuccess = async googleUser => {
    try {
      const idToken = googleUser.getAuthResponse().id_token;
      const client = new GraphQLClient("https://geoappin.herokuapp.com", {
        headers: { authorization: idToken }
      });
      const { me } = await client.request(ME_Query);
      dispatch({ type: "LOGIN_USER", payload: me });
      dispatch({ type: "IS_LOGGED_IN", payload: googleUser.isSignedIn() });
    } catch (err) {
      onFailure(err);
    }
  };

  const onFailure = err => {
    console.log("Error: ", err);
    dispatch({ type: "IS_LOGGED_IN", payload: false });
  };

  // const responseFacebook = response => {
  //   console.log(response);
  // };

  return (
    <div className={classes.root}>
      <div className={classes.circle}>
        <Typography
          component="h1"
          variant="h3"
          gutterBottom
          noWrap
          style={{ color: "darkred" }}
        >
          Welcome
        </Typography>
        <GoogleLogin
          clientId="624306110902-useik1f26ki4o8c72i0m9m2l9kkvvssm.apps.googleusercontent.com"
          onSuccess={onSuccess}
          isSignedIn={true}
          onFailure={onFailure}
          buttonText="Login with Google"
        />
      </div>
      {/* <FacebookLogin
        appId="506464763425499"
        autoLoad={true}
        fields="name,email,picture"
        callback={responseFacebook}
        isSignedIn={true}
      /> */}
    </div>
  );
};

const styles = {
  root: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center",
    backgroundImage: `url(${bg})`,
    backgroundSize: "cover"
  },

  circle: {
    border: "4px dotted blue",
    borderRadius: "100px",
    height: "200px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    padding: "50px",
    backgroundColor: "rgba(0, 0, 255, 0.3)",
    margin: "0"
  }
};

export default withStyles(styles)(Login);
