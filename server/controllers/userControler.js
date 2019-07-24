const User = require("../models/User");
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.API_URL_GOOGLE);

exports.findOrCreateUser = async token => {
  const googleUser = await verifiyAuthToken(token);
  const user = await checkIfUserExists(googleUser.email);
  console.log(user);
  return user ? user : createNewUser(googleUser);
  //return createNewUser(googleUser);
};

const verifiyAuthToken = async token => {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.API_URL_GOOGLE
    });
    return ticket.getPayload();
  } catch (err) {
    console.err("error verifing the token");
  }
};

const checkIfUserExists = async email => {
  try {
    const u = await User.findOne({ email }).exec();
    return u;
  } catch (error) {}
};

const createNewUser = googleUser => {
  const { name, email, picture } = googleUser;
  const user = { name, email, picture };
  return new User(user).save();
};
