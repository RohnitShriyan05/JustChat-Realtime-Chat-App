const mongoose = require("mongoose");

const discordSchema = new mongoose.Schema({
  channel: {
    channelname: String,
    conversation: [
      {
        message: String,
        user : String,
        timestamp: String,
        profilepic: String,
      }
    ]
  },
});

const discordModel = mongoose.model("conversations", discordSchema);
module.exports = discordModel;
