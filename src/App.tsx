/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSignals } from "@preact/signals-react/runtime";
import { IoWarning } from "react-icons/io5";
import { isError, mainInfo } from "./real-time/context/signals";
import useAudio from "./real-time/hooks/useAudio";
import Router from "./routes/Router";

function App() {
  useSignals();

  const { audio } = useAudio();

  return (
    <div className="app min-h-screen bg-gradient_cloudy flex capitalize">
      {isError.value && (
        <div className="fixed z-50 px-8 text-center w-full h-full bg-white bg-opacity-90 flex justify-center items-center flex-col gap-4">
          <IoWarning className="text-9xl text-red-500 bg-white" />
          <p className="text-gray-400">{isError.value}</p>
        </div>
      )}
      <audio
        src="/message-notification-190034.mp3"
        ref={audio}
        autoPlay
      ></audio>
      <div
        className={`fixed right-0 top-0 p-2 text-white font-medium text-sm rounded-tl-xl rounded-bl-xl flex justify-center items-center ${
          mainInfo.value.socketId ? "bg-green-600 " : "bg-red-500"
        }`}
      >
        {mainInfo.value.socketId ? "connected" : "disconnected"}
      </div>
      <div className="container lg:px-32 md:px-16 sm:px-8 px-4 py-6 flex flex-col gap-6">
        <Router />
      </div>
    </div>
  );
}

export default App;
