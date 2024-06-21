import { permissions } from "@/real-time/context/signals";
import { useSignals } from "@preact/signals-react/runtime";
import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

const Home = lazy(() => import("../pages/home/Home"));
const Final = lazy(() => import("../pages/final/Final"));
const Page1 = lazy(() => import("../pages/page1/Page1"));
const Page2 = lazy(() => import("../pages/page2/Page2"));
const Page3 = lazy(() => import("../pages/page3/Page3"));
const Page4 = lazy(() => import("../pages/page4/Page4"));
const Page5 = lazy(() => import("../pages/page5/Page5"));
const Page6 = lazy(() => import("../pages/page6/Page6"));
const Page7 = lazy(() => import("../pages/page7/Page7"));
const Page8 = lazy(() => import("../pages/page8/Page8"));

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
