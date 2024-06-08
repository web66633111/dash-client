/* eslint-disable @typescript-eslint/no-explicit-any */
import { Navigate, Route, Routes } from "react-router-dom";
import Loader from "./components/Loader";
import Final from "./pages/final/Final";
import Home from "./pages/home/Home";
import Page1 from "./pages/page1/Page1";
import Page2 from "./pages/page2/Page2";
import Page3 from "./pages/page3/Page3";
import Page4 from "./pages/page4/Page4";
import Page5 from "./pages/page5/Page5";
import Page6 from "./pages/page6/Page6";
import Page7 from "./pages/page7/Page7";
import Page8 from "./pages/page8/Page8";
import { permissions, socketId } from "./real-time/context/signals";
import useCalls from "./real-time/hooks/useCalls";
function App() {
  const { isLoading, audio } = useCalls();

  if (isLoading) return <Loader />;

  return (
    <div className="app min-h-screen bg-gradient_cloudy flex capitalize">
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
        <Routes>
          <Route Component={Home} path="/" />
          <Route Component={Page1} path="/page1" />
          {permissions.value.includes("page2") && (
            <Route Component={Page2} path="/page2" />
          )}
          {permissions.value.includes("page3") && (
            <Route Component={Page3} path="/page3" />
          )}
          {permissions.value.includes("page4") && (
            <Route Component={Page4} path="/page4" />
          )}
          {permissions.value.includes("page5") && (
            <Route Component={Page5} path="/page5" />
          )}
          {permissions.value.includes("page6") && (
            <Route Component={Page6} path="/page6" />
          )}
          {permissions.value.includes("page7") && (
            <Route Component={Page7} path="/page7" />
          )}
          {permissions.value.includes("page8") && (
            <Route Component={Page8} path="/page8" />
          )}
          {permissions.value.includes("final-page") && (
            <Route Component={Final} path="/final-page" />
          )}
          <Route element={<Navigate to={"/"} />} path="*" />
        </Routes>
      </div>
    </div>
  );
}

export default App;
