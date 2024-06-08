import Main from "@/components/Main";
import { Button } from "@/components/ui/button";
import { MAIN_BTN } from "@/constants/data";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { currentPage } from "../../context/signals";

function Home() {
  useEffect(() => {
    currentPage.value = "Home";
  }, []);

  return (
    <Main>
      <span className="text-lg">hello form home page to our app</span>
      <p className="text-gray-400 text-sm">let's get in touch !</p>
      <div className="flex-1 justify-end flex w-full items-end">
        <Link to={"/page1"}>
          <Button className={MAIN_BTN + " w-[150px] ml-auto"}>Next</Button>
        </Link>
      </div>
    </Main>
  );
}

export default Home;
