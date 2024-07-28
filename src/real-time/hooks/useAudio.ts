import { isNewMessage } from "@/real-time/context/signals";
import { useEffect, useRef } from "react";
import useRealTime from "./useRealTime";

function useAudio() {
  useRealTime();

  const audio = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (isNewMessage.value > 0) {
      audio.current?.play();
    }
  }, [isNewMessage.value]);
  return { audio };
}
export default useAudio;
