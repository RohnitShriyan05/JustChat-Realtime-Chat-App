import {useContext} from 'react';
import {userContext} from '../../../App';
import "./Chat.css";
import ChatInput from "../Chat/ChatInput/ChatInput";
import Message from './ShowMessage/Message';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import PeopleIcon from '@mui/icons-material/People';
import MenuIcon from '@mui/icons-material/Menu';
import Axios from 'axios';
export default function Chat(){
    const context = useContext(userContext);
    const changeChannelName = ()=>{
        const updatedname = prompt("edit channel name:")
        if(updatedname){
           Axios.post(`http://localhost:4000/update/channel?id=${context.currentChannelId}`,{channelname:updatedname}).catch((err)=>alert(err));
        }
        context.setCurrentChannel(updatedname);
        context.setEdited(context.edited+1);
    }
    return(
        <div className="message__wrapper h-screen md:w-3/4 w-screen bg-chatbg flex flex-col text-white">
            <div className="chat__header border-b-2 border-sidebarunder flex items-center">
                <button className='md:hidden block'><MenuIcon className='svgicon hidden'/></button>
                <h1 className='flex-1'>{context.currentChannel}</h1>
                <button onClick={changeChannelName}><ModeEditIcon className='mx-4 text-neutral-300 hover:text-white svgicon'/></button>
                <button><PeopleIcon className='text-neutral-300 hover:text-white svgicon'/></button>
             </div>
            <Message className='flex-1' id={context.currentChannelId} user={context.user.name}/>
            <ChatInput className='bg-white' user={context.user} id={context.currentChannelId} channelName={context.currentChannel} username={context.name}/>
        </div>
    );
}