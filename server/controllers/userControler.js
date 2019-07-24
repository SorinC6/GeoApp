const User = require("../models/User");
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.API_URL_GOOGLE);

const findOrCreateUser = async token => {
  const googleUser = await verifiyAuthToken(token);
  const user = await checkIfUserExists(googleUser.email);

  return user ? user :
};

verifiyAuthToken = async token => {
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

checkIfUserExists = async email => await User.findOne({ email }).exec();



exports.exports = findOrCreateUser;
