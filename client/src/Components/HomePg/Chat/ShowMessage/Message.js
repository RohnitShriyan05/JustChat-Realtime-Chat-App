import { Avatar } from "@mui/material";
import Axios from "axios";
import { useState, useEffect} from "react";
import "./Messsage.css";
import Pusher from "pusher-js";
import ScrollableFeed from 'react-scrollable-feed'
const pusher = new Pusher("fc844d9fd378358e8dcb", {
  cluster: "ap2",
});

export default function Message(props) {
  const [message, setMessage] = useState([]);
  const channelId = props.id;
  
  const getConversation = (channelId) => {
    if (channelId) {
      Axios.get(`https://justchat-mern.herokuapp.com/get/conversation?id=${channelId}`).then(
        (res) => {
          setMessage(res.data);
        }
      );
    }
  };
  useEffect(() => {
    getConversation(channelId);
    const channel = pusher.subscribe("conversation");
    channel.bind("newMessage", function (data) {
      getConversation(channelId);
    });
  },[channelId]);
  return (
    <ScrollableFeed className="flex-1 message__wrapper flex flex-col  overflow-scroll">
      {message.map((messages, key) => {
        return (
          <div className="relative flex items-center message__display justify-start " key={messages.id}>
            <Avatar alt={messages.user} src={messages.profilepic} className='realtive svgicon'/>
            <div className="relative px-2 ">
              <h3 className="username text-neutral-300">
                {messages.user}
                {"  "}
                <span className="timestamp text-neutral-500">
                  {new Date(parseInt(messages.timestamp)).toDateString()}
                </span>
              </h3>
              <h2 className="message">{messages.message}</h2>
            </div>
          </div>
        );
      })}
    </ScrollableFeed>
  );
}
