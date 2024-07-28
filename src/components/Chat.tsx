import { MAIN_BTN } from "@/constants/data";
import { formatDate } from "@/lib/utils";
import { isChat, mainInfo, messages } from "@/real-time/context/signals";
import { sendMessage } from "@/real-time/utils/utils";
import { useSignals } from "@preact/signals-react/runtime";
import { useEffect, useRef } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { IoIosSend } from "react-icons/io";
import { IoCloseCircleOutline } from "react-icons/io5";
import Input from "./Input";
import { Button } from "./ui/button";

function Chat() {
  useSignals();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ mode: "all" });

  const containerRef = useRef<HTMLDivElement>(null);

  function send(data: FieldValues) {
    sendMessage(data.message);

    reset();
  }
  useEffect(() => {
    setTimeout(() => {
      if (containerRef.current) {
        containerRef.current.scrollTop = containerRef.current.scrollHeight;
      }
    }, 0);
  }, [messages.value]);

  return (
    <div className="flex flex-col justify-start px-2 pt-6 pb-2 flex-1 gap-2 h-full overflow-y-auto">
      <IoCloseCircleOutline
        className="absolute text-2xl top-1 right-1 cursor-pointer z-50 text-main"
        onClick={() => (isChat.value = false)}
      />
      <div
        className="flex overflow-y-auto w-full flex-col items-start h-[300px] gap-2 flex-1"
        ref={containerRef}
      >
        {messages.value?.map((message, index) => (
          <span
            key={index}
            className={`${
              message.myId == mainInfo.value?._id ||
              message.id === mainInfo.value.socketId
                ? "ml-auto bg-main"
                : "mr-auto bg-alt"
            }  text-white p-2 rounded-2xl flex flex-col gap-2`}
          >
            <span>{message.content}</span>
            <span className="text-[10px]">
              {formatDate(new Date(message.createdAt))}
            </span>
          </span>
        ))}
      </div>

      <form onSubmit={handleSubmit(send)} className="flex items-end gap-2">
        <Input
          errors={errors}
          id="message"
          register={register}
          placeholder="Write Your Message"
          options={{ required: true }}
        />
        <Button className={"rounded-full aspect-square relative " + MAIN_BTN}>
          <IoIosSend className="text-xl absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
        </Button>
      </form>
    </div>
  );
}

export default Chat;
