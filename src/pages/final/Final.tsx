import Main from "@/components/Main";
import { useSignals } from "@preact/signals-react/runtime";
import { useEffect } from "react";
import { currentPage, lastMessage } from "../../context/signals";

function Final() {
  useSignals();
  useEffect(() => {
    currentPage.value = "Final";
  }, []);
  return (
    <Main>
      {lastMessage.value ? (
        <>
          <p className="text-gray-500 pt-8 w-full">
            <span className="text-black font-medium">admin message: </span>
            {lastMessage.value}
          </p>
          <p className="text-main font-medium text-sm mx-auto flex-1 pb-5 flex items-end">
            thanks for communicate with our page!
          </p>
        </>
      ) : (
        <p className="text-gray-400 font-medium text-xs">
          Admin write The Last message for you, please waite for response ...
        </p>
      )}
    </Main>
  );
}

export default Final;
