import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { GoogleLogin } from "react-google-login";
import FacebookLogin from "react-facebook-login";
import { GraphQLClient } from "graphql-request";
// import Typography from "@material-ui/core/Typography";

const ME_Query = `
{
  me{
    _id
    name
    email
    picture
  }
}
`;

const Login = ({ classes }) => {
  const onSuccess = async googleUser => {
    const idToken = googleUser.getAuthResponse().id_token;
    //console.log(idToken);
    const client = new GraphQLClient("http://localhost:4000/graphql", {
      headers: { authorization: idToken }
    });
    const data = await client.request(ME_Query);
    //debugger;
    console.log(data);
  };
  const responseFacebook = response => {
    console.log(response);
  };

  return (
    <div>
      <GoogleLogin
        clientId="1011724089714-u8bf9rs6fauq4uvvc83ufcirkapq9fh0.apps.googleusercontent.com"
        onSuccess={onSuccess}
        isSignedIn={true}
      />
      <FacebookLogin
        appId="506464763425499"
        autoLoad={true}
        fields="name,email,picture"
        callback={responseFacebook}
        isSignedIn={true}
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
