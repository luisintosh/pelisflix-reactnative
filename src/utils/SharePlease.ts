import {AsyncStorage} from "react-native";
import Log from "./Log";

const SharePlease = async (shareDays = 3) => {
  const messages = [
    "¿Sabias que... Solo la gente bonita comparte Pelisflix? 🤩",
    "¿Sabias que... Las personas sexys son las que más comparten Pelisflix? 🔥",
    "¿Tienes un segundo para compartir Pelisflix? 👀",
    "Seguro que a tus amigos les gustaría conocer Pelisflix 🙌",
    "¡Atención! Comparte Pelisflix hoy y descubre lo que pasa 👽",
    "¿Dice mi mamá que porqué no compartes Pelisflix? 💁"
  ];

  const now = new Date().getTime();
  const days = shareDays * 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  const nextSharePleaseCheck = await AsyncStorage.getItem("nextSharePleaseCheck");
  const sharePleaseMsgsCount = await AsyncStorage.getItem("sharePleaseMsgsCount");
  const nmCheck = nextSharePleaseCheck !== null ? parseInt(nextSharePleaseCheck) : 0;
  const count = nextSharePleaseCheck !== null ? parseInt(sharePleaseMsgsCount) : 0;

  if (now >= nmCheck && count > 0) {
    // show message
    setTimeout(() => {
      alert(messages[Math.floor(Math.random() * messages.length)]);
    }, 1000);

    await AsyncStorage.setItem("nextSharePleaseCheck", `${now + days}`); // save last check time
    await AsyncStorage.setItem("sharePleaseMsgsCount", `${count + 1}`);
    Log.i("Share please message displayed");
  }
};

export default SharePlease;
