import {
  isAdminError,
  isChat,
  isNewMessage,
  loading,
  message,
  permissions,
  socket,
} from "@/context/signals";
import { ReactNode, useEffect } from "react";
import { DiMeteor } from "react-icons/di";
import { IoMdChatbubbles } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import Chat from "./Chat";

function Main({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  useEffect(() => {
    socket.value.on(
      "admin-response",
      ({ state, next }: { state: boolean; next: string }) => {
        loading.value = false;
        permissions.value = [...permissions.value, next];
        if (state) {
          navigate("/" + next);
        } else {
          isAdminError.value = true;
          message.value =
            "Admin Rejected The Info That You Send To Him, Pleas Make Sure About Them And Try Again !";
        }
      }
    );
  }, []);

  return (
    <section className="flex gap-2 justify-center items-center w-full flex-wrap  h-full">
      {/* <Dialog open={isChat.value} onOpenChange={() => (isChat.value = false)}>
        <DialogContent className="h-[500px]">
          <Chat />
        </DialogContent>
      </Dialog> */}

      <div className="sm:w-[500px] w-full min-h-[500px] relative overflow-hidden items-center p-5 rounded-xl shadow-lg bg-white border-gray-300 border flex flex-col gap-4">
        {message.value && (
          <span className="absolute left-0 top-0 text-[10px] font-medium p-2 text-red-500">
            {message.value}
          </span>
        )}
        {loading.value && (
          <div className="absolute cursor-wait left-0 top-0 w-full h-full bg-white bg-opacity-80 z-50 flex justify-center items-center flex-col gap-4">
            <div className="loader"></div>
            <span className="text-xs font-medium">
              يرجى الانتظار جاري التأكد من صحه البيانات المدخلة
            </span>
          </div>
        )}
        <DiMeteor className="text-main text-9xl" />
        <h2 className="font-medium text-3xl">Web App</h2>
        {children}
      </div>
      {isChat.value && (
        <div className="h-[500px] w-[400px] shadow-xl p-3 bg-white border fixed top-16 right-10 border-gray-300  rounded-xl">
          <Chat />
        </div>
      )}
      <div
        className={`fixed hover:scale-95 transition-all right-10 bottom-10 p-2 text-3xl aspect-square rounded-full cursor-pointer  text-white ${
          isChat.value ? "bg-main" : " bg-gray-600"
        }`}
        onClick={() => (isChat.value = !isChat.value)}
      >
        <IoMdChatbubbles />
        {isNewMessage.value > 0 && (
          <div className="absolute text-[10px] font-bold -top-1 right-0 w-4 h-4  rounded-full flex justify-center items-center text-white bg-orange-500">
            {isNewMessage.value}
          </div>
        )}
      </div>
    </section>
  );
}

export default Main;
