const { AuthenticationError, PubSub } = require("apollo-server");
const Pin = require("./models/Pin");

const pubsub = new PubSub();
const PIN_ADDED = "PIN_ADDED";
const PIN_DELETED = "PIN_DELETED";
const PIN_UPDATE = "PIN_UPDATE";

const authenticated = next => (root, args, ctx, info) => {
  console.log(ctx.currentUser);
  if (!ctx.currentUser) {
    throw new AuthenticationError("You must be logged in");
  }
  return next(root, args, ctx);
};

module.exports = {
  Query: {
    me: authenticated((root, args, ctx) => ctx.currentUser),
    getPins: async (root, args, ctx) => {
      const pins = await Pin.find({})
        .populate("author")
        .populate("comments.author");
      return pins;
    }
  },
  Mutation: {
    createPin: authenticated(async (root, args, ctx) => {
      const newPin = await new Pin({
        ...args.input,
        author: ctx.currentUser._id
      }).save();
      const pinAdded = await Pin.populate(newPin, "author");
      pubsub.publish(PIN_ADDED, { pinAdded });
      return pinAdded;
    }),
    deletePin: authenticated(async (root, args, ctx) => {
      const pinDeleted = await Pin.findOneAndDelete({ _id: args.pinId }).exec();
      pubsub.publish(PIN_DELETED, { pinDeleted });
      return pinDeleted;
    }),
    createComment: authenticated(async (root, args, ctx) => {
      const newComment = { text: args.text, author: ctx.currentUser._id };
      const pinUpdate = await Pin.findOneAndUpdate(
        { _id: args.pinId },
        { $push: { comments: newComment } },
        { new: true }
      )
        .populate("author")
        .populate("comments.author");
      pubsub.publish(PIN_UPDATE, { pinUpdate });
      return pinUpdate;
    })
  },
  Subscriptions: {
    pinAdded: {
      subscribe: () => pubsub.asyncIterator(PIN_ADDED)
    },
    pinDeleted: {
      subscribe: () => pubsub.asyncIterator(PIN_DELETED)
    },
    pinUpdate: {
      subscribe: () => pubsub.asyncIterator(PIN_UPDATE)
    }
  }
};
