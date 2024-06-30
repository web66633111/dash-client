import Final from "@/pages/final/Final";
import Home from "@/pages/home/Home";
import Page1 from "@/pages/page1/Page1";
import Page2 from "@/pages/page2/Page2";
import Page3 from "@/pages/page3/Page3";
import Page4 from "@/pages/page4/Page4";
import Page5 from "@/pages/page5/Page5";
import Page6 from "@/pages/page6/Page6";
import Page7 from "@/pages/page7/Page7";
import Page8 from "@/pages/page8/Page8";
import { permissions } from "@/real-time/context/signals";
import { useSignals } from "@preact/signals-react/runtime";
import { Navigate, Route, Routes } from "react-router-dom";

function Router() {
  useSignals();
  return (
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
  );
}

export default Router;
