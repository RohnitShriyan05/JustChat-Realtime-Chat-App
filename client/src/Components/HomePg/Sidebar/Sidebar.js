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
import CloseIcon from '@mui/icons-material/Close';

const pusher = new Pusher("fc844d9fd378358e8dcb", {
  cluster: "ap2",
});

export default function Sidebar() {
  const context = useContext(userContext);
  const logout = () => {
    context.setUser({});
    context.setLogin(0);
    localStorage.clear();
  };
  const addChannelPrompt = () => {
    const newChannelName = prompt("Enter name of channel:");
    if (newChannelName) {
      Axios.post("https://justchat-mern.herokuapp.com/new/channel", {
        channelname: newChannelName,
      }).catch((err) => console.log(err));
    }
  };
  const [channelList, setChannelList] = useState([]);
  const getChannels = () => {
    Axios.get("https://justchat-mern.herokuapp.com/get/channelList").then((res) => {
      setChannelList(res.data);
    });
  };
  useEffect(() => {
    getChannels();
    const channel = pusher.subscribe("channels");
    channel.bind("newChannel", function (data) {
      getChannels();
    });
  },[context.currentChannel]);
  const sidebarToggleHandle = ()=>{
    context.setSidebarToggle(!context.sidebarToggle);
}
  return (
    <div className={context.sidebarToggle ? "sidebar__wrapper hidden md:flex flex-col h-screen w-1/4 bg-sidebg text-white border-r-2 border-sidebarunder" : "sidebar__wrapper flex flex-col h-screen w-full bg-sidebg text-white border-r-2 border-sidebarunder"}>
      <div className="sidebar__header border-b-2 flex border-sidebarunder text-emerald-500">
        <h1 className="flex-1 flex items-center">JUSCHAT</h1>
        <button onClick={sidebarToggleHandle}>{context.sidebarToggle? null : <CloseIcon/>}</button>
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
