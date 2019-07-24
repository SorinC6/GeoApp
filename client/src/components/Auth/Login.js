import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { GoogleLogin } from "react-google-login";
import FacebookLogin from "react-facebook-login";
// import Typography from "@material-ui/core/Typography";

const Login = ({ classes }) => {
  const onSuccess = googleUser => {
    console.log(googleUser);
  };
  const responseFacebook = response => {
    console.log(response);
  };
  return (
    <div>
      <GoogleLogin
        clientId="1011724089714-u8bf9rs6fauq4uvvc83ufcirkapq9fh0.apps.googleusercontent.com"
        onSuccess={onSuccess}
      />
      <FacebookLogin
        appId="506464763425499"
        fields="name,email,picture"
        callback={responseFacebook}
      />
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
