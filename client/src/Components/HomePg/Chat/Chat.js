import {useContext} from 'react';
import {userContext} from '../../../App';
import "./Chat.css";
import ChatInput from "../Chat/ChatInput/ChatInput";
import Message from './ShowMessage/Message';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import PeopleIcon from '@mui/icons-material/People';
import MenuIcon from '@mui/icons-material/Menu';
import Axios from 'axios';
import DeleteIcon from '@mui/icons-material/Delete';

export default function Chat(){
    const context = useContext(userContext);


    const changeChannelName = ()=>{
        const updatedname = prompt("edit channel name:")
        if(updatedname){
           Axios.post(`https://justchat-mern.herokuapp.com/update/channel?id=${context.currentChannelId}`,{channelname:updatedname}).catch((err)=>console.log(err));
        }
        context.setCurrentChannel(updatedname);
    }
    const sidebarToggleHandle = ()=>{
        context.setSidebarToggle(!context.sidebarToggle);
    }
    const deleteChannel= ()=>{
        const deletedChannel= prompt("THIS WILL DELELTE ALL THE DATA IN THE CHANNEL TO CONTINUE ENTER THE CURRENT CHANNEL NAME");
        if(deletedChannel==="General"){
            alert("Cannot delete channel:General");
        }
        else if(deletedChannel===context.currentChannel){
            Axios.post("https://justchat-mern.herokuapp.com/delete/channel", {id:context.currentChannelId}).catch((err)=>console.log(err));
            window.location.reload();
        }
        else{
            alert("Entered wrong name");
        }
    }

    return(
        <div className="message__wrapper h-screen md:w-3/4 w-screen bg-chatbg flex flex-col text-white">
            <div className="chat__header border-b-2 border-sidebarunder flex items-center">
                <button onClick={sidebarToggleHandle} className="md:hidden flex">{context.sidebarToggle? <MenuIcon/>: null}</button>
                <h1 className='flex-1'>{context.currentChannel}</h1>
                <button onClick={changeChannelName}><ModeEditIcon className='text-neutral-300 hover:text-white svgicon'/></button>
                <button><PeopleIcon className=' text-neutral-300 hover:text-white svgicon'/></button>
                <button onClick={deleteChannel}><DeleteIcon className='text-neutral-300 hover:text-white svgicon'/></button>
             </div>
            <Message className='flex-1' id={context.currentChannelId} user={context.user.name}/>
            <ChatInput className='bg-white' user={context.user} id={context.currentChannelId} channelName={context.currentChannel} username={context.name}/>
        </div>
    );
}
