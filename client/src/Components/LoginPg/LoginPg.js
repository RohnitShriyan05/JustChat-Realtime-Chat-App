import "./LoginPg.css";
import { useContext} from "react";
import { userContext } from "../../App";
import { auth, provider } from "../../firebase";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import SendIcon from "@mui/icons-material/Send";
export default function LoginPg() {
  const context = useContext(userContext);
  const setUser = context.setUser;
  const setLogin = context.setLogin;
  const signIn = () => {
    auth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        setUser({
          name: firebaseUser.displayName,
          email: firebaseUser.email,
          profilepic: firebaseUser.photoURL,
        });
        setLogin(1);
      } else {
        auth
          .signInWithPopup(provider)
          .then((res) => {
            context.setUser({
              name: res.user.displayName,
              email: res.user.email,
              profilepic: res.user.photoURL,
            });
            context.setLogin(1);
          })
          .catch((error) => alert(error.message));
      }
    });
  };
  return (
    <div className="h-screen w-full grid grid-rows-2 place-items-center bg-chatbg text-emerald-500 ">
      <div className="login__title flex items-center">
        <h1 className="login__title text-white">JUSTCHAT</h1>
        <SendIcon
          className="login__icon text-emerald-500"
          fontSize="xx-large"
        />
      </div>
      <button
        onClick={signIn}
        className="login__signin border border-emerald-500 rounded-full hover:bg-emerald-500 hover:text-chatbg"
      >
        Sign In
      </button>
    </div>
  );
}
