const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const mongoData = require("./Models/mongoData.js");
const Pusher = require('pusher');
require("dotenv").config();

app.use(cors({origin: '*'}));
app.use(express.json());
mongoose.Promise = global.Promise;

const pusher = new Pusher({
  appId: "1404379",
  key: "fc844d9fd378358e8dcb",
  secret: "f0f4cf4d671fb7fa0e0c",
  cluster: "ap2",
  useTLS: true,
});

//DATABASE CONNECTION
const dblink =
  `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.weq1x.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
mongoose.set("strictQuery", false);
mongoose.connect(dblink, {useNewUrlParser: true,});
mongoose.connection.once('open', ()=>{
  console.log("Connected to database");
  const changeStream = mongoose.connection.collection('conversations').watch();
  changeStream.on('change', (change)=>{
    if(change.operationType==='insert')
      pusher.trigger('channels','newChannel',{'change':change});
    else if(change.operationType==='update')
      pusher.trigger('conversation','newMessage', {'change':change});
    else console.log("error in pusher-js");
  })
});


app.get("/read", (req, res) => {
  mongoData.find({}, (err, result) => {
    if (err) res.send(err);
    else res.send(result);
  });
});

app.post("/new/channel", (req, res) => {
  const newChannelName = req.body.channelname;
  mongoData.create(
    { channel: { channelname: newChannelName } },
    (err, data) => {
      if (err) res.send(err);
      else res.send(data);
    }
  );
});

app.post("/update/channel", (req, res) => {
  const updatedChannelName = req.body.channelname;
  const id = req.query.id;
  mongoData
    .updateOne(
      { _id: id },
      {
        $set: {
          "channel.channelname": updatedChannelName,
        },
      }
    )
    .then(() => console.log("success"))
    .catch((err) => console.log(err));
});

app.post("/delete/channel", (req, res) => {
  const deletedchannelid = req.body.id;
  mongoData
    .findByIdAndDelete({ _id: deletedchannelid })
    .catch((err) => console.log(err));
});

app.get("/get/channelList", (req, res) => {
  mongoData.find({}, (err, data) => {
    if (err) res.send(err);
    else {
      let channels = [];
      data.map((channelData) => {
        const channelInfo = {
          id: channelData._id,
          name: channelData.channel.channelname,
        };
        channels.push(channelInfo);
      });
      res.send(channels);
    }
  });
});

app.post("/new/message", (req, res) => {
  const id = req.body.id;
  const { user, message, timestamp, profilepic } = req.body;
  mongoData
    .findOne({ _id: id })
    .then((data) => {
      if (data) {
        data.channel.conversation.push({
          user,
          message,
          timestamp,
          profilepic,
        });
        data.save();
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/get/conversation", (req, res) => {
  const id = req.query.id;
  mongoData.find({ _id: id }, (err, data) => {
    if (err) res.send(err);
    else {
      const messages = [];
      data[0].channel.conversation.map((message) => {
        const newmessage = {
          message: message.message,
          user: message.user,
          timestamp: message.timestamp,
          profilepic: message.profilepic,
          id: message._id
        };
        messages.push(newmessage);
      });
      res.send(messages);
    }
  });
});

app.get("/", (req, res) => {
  res.send("Connected");
});

app.listen(process.env.PORT || 4000);
