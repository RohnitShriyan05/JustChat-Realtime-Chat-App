import Chat from "./Chat/Chat";
import Sidebar from "./Sidebar/Sidebar";
export default function HomePg(){
    return(
        <div className="home__wrapper flex">
            <Sidebar/>
            <Chat/>
        </div>
    );
}