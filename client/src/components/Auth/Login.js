import React, { useContext } from "react";
import { withStyles } from "@material-ui/core/styles";
import { GoogleLogin } from "react-google-login";
// import FacebookLogin from "react-facebook-login";
import { GraphQLClient } from "graphql-request";
import Typography from "@material-ui/core/Typography";
import Context from "../../context";
import { ME_Query } from "../../graphql/queries";

const Login = ({ classes }) => {
  const { dispatch } = useContext(Context);
  const onSuccess = async googleUser => {
    try {
      const idToken = googleUser.getAuthResponse().id_token;
      const client = new GraphQLClient("http://localhost:4000/graphql", {
        headers: { authorization: idToken }
      });
      const { me } = await client.request(ME_Query);
      dispatch({ type: "LOGIN_USER", payload: me });
    } catch (err) {
      onFailure(err);
    }
  };

  const onFailure = err => {
    console.err("Error: ", err);
  };

  // const responseFacebook = response => {
  //   console.log(response);
  // };

  return (
    <div className={classes.root}>
      <Typography
        component="h1"
        variant="h3"
        gutterBottom
        noWrap
        style={{ color: "rgb(66,133,244" }}
      >
        Welcome
      </Typography>
      <GoogleLogin
        clientId="1011724089714-u8bf9rs6fauq4uvvc83ufcirkapq9fh0.apps.googleusercontent.com"
        onSuccess={onSuccess}
        isSignedIn={true}
        onFailure={onFailure}
      />
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
    alignItems: "center"
  }
};

export default withStyles(styles)(Login);
