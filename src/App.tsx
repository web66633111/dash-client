/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSignals } from "@preact/signals-react/runtime";
import { Suspense } from "react";
import { IoWarning } from "react-icons/io5";
import Loader from "./components/Loader";
import { isError, socketId } from "./real-time/context/signals";
import useCalls from "./real-time/hooks/useCalls";
import Router from "./routes/Router";

function App() {
  console.warn = () => {};
  useSignals();
  const { isLoading, audio } = useCalls();

  if (isLoading) return <Loader />;

  return (
    <div className="app min-h-screen bg-gradient_cloudy flex capitalize">
      {isError.value && (
        <div className="fixed z-50 px-8 text-center w-full h-full bg-white bg-opacity-90 flex justify-center items-center flex-col gap-4">
          <IoWarning className="text-9xl text-red-500 bg-white" />
          <p className="text-gray-600">{isError.value}</p>
        </div>
      )}
      <audio
        src="/message-notification-190034.mp3"
        ref={audio}
        autoPlay
      ></audio>
      <div
        className={`fixed right-0 top-0 p-2 text-white font-medium text-sm rounded-tl-xl rounded-bl-xl flex justify-center items-center ${
          socketId.value ? "bg-green-600 " : "bg-red-500"
        }`}
      >
        {socketId.value ? "connected" : "disconnected"}
      </div>
      <div className="container lg:px-32 md:px-16 sm:px-8 px-4 py-6 flex flex-col gap-6">
        <Suspense>
          <Router />
        </Suspense>
      </div>
    </div>
  );
}

export default App;
