import "./Sidebar.css";
import { useContext, useEffect, useState } from "react";
import { userContext } from "../../../App";
import Avatar from "@mui/material/Avatar";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import AddIcon from "@mui/icons-material/Add";
import SignalCellularAltIcon from "@mui/icons-material/SignalCellularAlt";
import LogoutIcon from "@mui/icons-material/Logout";
import Axios from "axios";
import Pusher from "pusher-js";
const pusher = new Pusher("fc844d9fd378358e8dcb", {
  cluster: "ap2",
});

export default function Sidebar() {
  const context = useContext(userContext);
  const logout = () => {
    context.setUser({});
    context.setLogin(0);
  };
  const addChannelPrompt = () => {
    const newChannelName = prompt("Enter name of channel:");
    if (newChannelName) {
      Axios.post("http://localhost:4000/new/channel", {
        channelname: newChannelName,
      }).catch((err) => alert(err));
    }
  };
  const [channelList, setChannelList] = useState([]);
  const getChannels = () => {
    Axios.get("http://localhost:4000/get/channelList").then((res) => {
      setChannelList(res.data);
    });
    console.log("this is useeffect of sidebar.js");
  };
  useEffect(() => {
    getChannels();
    const channel = pusher.subscribe("channels");
    channel.bind("newChannel", function (data) {
      getChannels();
    });
  },[]);
  return (
    <div className="sidebar__wrapper hidden md:flex flex-col h-screen w-1/4 bg-sidebg text-white border-r-2 border-sidebarunder">
      <div className="sidebar__header border-b-2 border-sidebarunder px-2 py-2 text-emerald-500">
        <h1>JUSTCHAT</h1>
      </div>

      <div className="sidebar__channels flex-1 flex flex-col">
        <div className="channels__head flex flex-row border-b-2 border-sidebarunder px-4 py-1 items-center text-neutral-300">
          <h2 className="flex-1 sidebar__mediumtext">Channels</h2>
          <button onClick={addChannelPrompt}>
            <AddIcon className="hover:text-white cursor-pointer svgicon" />
          </button>
          <KeyboardArrowDownIcon className="hover:text-white cursor-pointer svgicon" />
        </div>
        <div className="showchannels flex-1 flex flex-col items-start">
          {channelList.map((val, key) => {
            return (
              <button
                onClick={() => {
                  context.setCurrentChannelId(val.id);
                  context.setCurrentChannel(val.name);
                }}
                key={val.id}
              >
                <h3 className="px-8 text-neutral-400 hover:text-white sidebar__smalltext">
                  {"# " + val.name}
                </h3>
              </button>
            );
          })}
        </div>
      </div>

      <div className="connected border-t-2 border-sidebarunder text-green-500 flex items-center">
        <span>
          <SignalCellularAltIcon className='cellular'/>
        </span>
        <h3>Connected</h3>
      </div>

      <div className="sidebar__profile border-t-2 border-sidebarunder flex text-left items-center">
        <Avatar alt={context.user.name} src={context.user.profilepic} className='svgicon'/>
        <h3 className="flex-1 sidebar__mediumtext px-2 ">
          {context.user.name}
        </h3>
        <button onClick={logout} className="hover:text-emerald-500">
          <LogoutIcon className='svgicon'/>
        </button>
      </div>
    </div>
  );
}
