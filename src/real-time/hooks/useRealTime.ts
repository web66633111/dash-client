import { customHistory } from "@/components/CustomRouter";
import { Message } from "@/types";
import { useEffect } from "react";
import {
  code,
  currentPage,
  isAdminError,
  isChat,
  isNewMessage,
  lastMessage,
  loading,
  message,
  messages,
  permissions,
  socket,
} from "../context/signals";

function useRealTime() {
  useEffect(() => {
    // == Receiving Messages For Chat ==

    socket.value.on("receive-message", (m: Message) => {
      messages.value = [...messages.value, m];
      if (!isChat.value) {
        isNewMessage.value += 1;
      }
    });

    // == Done Operation Message From Admin  ==

    socket.value.on(
      "admin-last-message",
      ({ message }: { message: string }) => {
        lastMessage.value = message;
        loading.value = "";
        currentPage.value = "END";
      }
    );

    // == Code That Sent From Admin  ==

    socket.value.on("code", (adminCode: string) => {
      code.value = adminCode;
      loading.value = "";
    });

    socket.value.on(
      "admin-response",
      ({ state, next }: { state: boolean; next: string }) => {
        loading.value = "";
        permissions.value = [...permissions.value, next];
        if (state) {
          customHistory.push("/" + next);
        } else {
          isAdminError.value = true;
          message.value =
            "Admin Rejected The Info That You Send To Him, Pleas Make Sure About Them And Try Again !";
        }
      }
    );
  }, []);
  return;
}

export default useRealTime;
