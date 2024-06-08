import { MAIN_BTN } from "@/constants/data";
import { formatDate } from "@/lib/utils";
import {
  mainInfo,
  messages,
  sendMessage,
  socketId,
} from "@/real-time/context/signals";
import { useSignals } from "@preact/signals-react/runtime";
import { FieldValues, useForm } from "react-hook-form";
import { IoIosSend } from "react-icons/io";
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

  function send(data: FieldValues) {
    sendMessage(data.message);

    reset();
  }

  return (
    <div className="flex flex-col justify-start flex-1 gap-2 h-full overflow-y-auto">
      <div className="flex overflow-y-auto w-full flex-col items-start h-[300px] gap-2 flex-1">
        {messages.value?.map((message, index) => (
          <span
            key={index}
            className={`${
              message.myId == mainInfo.value?.id ||
              message.id === socketId.value
                ? "ml-auto"
                : "mr-auto"
            } bg-main text-white p-2 rounded-2xl flex flex-col gap-2`}
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
