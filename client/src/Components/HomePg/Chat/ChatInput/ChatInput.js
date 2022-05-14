import AddCircleIcon from '@mui/icons-material/AddCircle';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import {useState} from 'react';
import "./ChatInput.css";
import Axios from 'axios';
export default function ChatInput(props) {
    const [input, setInput] = useState();
    const sendMessage = (e)=>{
        e.preventDefault();
        Axios.post(`https://justchat-mern.herokuapp.com/new/message`,{
            id: props.id,
            message: input,
            user : props.user.name,
            timestamp: Date.now(),
            profilepic: props.user.profilepic
        }).catch((err)=>console.log(err));
        setInput("");
    }
  return (
    <div className='chatinput__wrapper'>
      <div className="mt-2 ChatInput items-center text-gray-300 flex justify-between bg-chatbg rounded-2xl border-2 border-emerald-500 mb-2">
        <AddCircleIcon
          className="hover:text-white cursor-pointer svgicon"
        />
        <form action="" className="flex-1">
          <input
            className="bg-transparent w-full h-full"
            value={input}
            disabled={!props.channelName}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Message #${props.channelName}`}
            
          />
          <button
            type="submit"
            className="hidden"
            disabled={!props.channelName}
            onClick={sendMessage}
          >
            Send Message
          </button>
        </form>
        <div className="ChatInputIcons">
          <EmojiEmotionsIcon
            className="hover:text-white cursor-pointer svgicon"
          />
        </div>
      </div>
    </div>
  );
}
