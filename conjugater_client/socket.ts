import { Channel, Socket } from "phoenix";

export default function socket(topic: string): Channel {
  let socket = new Socket(import.meta.env.VITE_SOCKET_URL, {})
  socket.connect();
  let channel = socket.channel(topic, {});
  channel
    .join()
    .receive('ok', (_response) => {
      console.log("joined")
    })
    .receive('error', (_response) => {
      console.log("errorrr", _response)
    })
  return channel;
}
