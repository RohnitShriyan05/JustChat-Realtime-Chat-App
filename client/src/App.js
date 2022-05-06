import "./App.css";
import { useState } from "react";
import React from "react";
import HomePg from "./Components/HomePg/HomePg";
import LoginPg from "./Components/LoginPg/LoginPg";

export const userContext = React.createContext(null);
function App() {
  const [user, setUser] = useState({});
  const [login, setLogin] = useState(0);
  const [currentChannelId, setCurrentChannelId] = useState("6273a9a3ae5269ebb5e20909");
  const [currentChannel, setCurrentChannel] = useState("General");
  return (
    <div className="App bg-chatbg">
      <userContext.Provider value={{user, setUser, setLogin, currentChannelId, setCurrentChannelId, currentChannel, setCurrentChannel }}>
        {login === 1 ? <HomePg /> : <LoginPg />}
      </userContext.Provider>
    </div>
  );
}

export default App;
