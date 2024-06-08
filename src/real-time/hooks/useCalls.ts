import { getInitInfo, isNewMessage } from "@/real-time/context/signals";
import { useSignals } from "@preact/signals-react/runtime";
import { getCookie } from "cookies-next";
import { useEffect, useRef, useState } from "react";

function useCalls() {
  useSignals();
  const audio = useRef<HTMLAudioElement>(null);

  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    if (getCookie("ID")) {
      setLoading(true);
      getInitInfo().then(() => setLoading(false));
    }
  }, []);

  useEffect(() => {
    if (isNewMessage.value > 0) {
      audio.current?.play();
    }
  }, [isNewMessage.value]);
  return { isLoading, audio, getInitInfo };
}
export default useCalls;
