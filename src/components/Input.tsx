import { isAdminError } from "@/real-time/context/signals";
import { useSignals } from "@preact/signals-react/runtime";
import { useState } from "react";
import {
  FieldErrors,
  FieldValues,
  RegisterOptions,
  UseFormRegister,
} from "react-hook-form";
import { AiFillEyeInvisible } from "react-icons/ai";
import { BsFillEyeFill } from "react-icons/bs";
import { IoCloseSharp } from "react-icons/io5";

interface props {
  label?: string;
  id: string;
  disabled?: boolean;
  options?: RegisterOptions;
  register: UseFormRegister<FieldValues>;
  value?: string;
  errors: FieldErrors;
  type?: string;
  placeholder?: string;
  textarea?: boolean;
  multiple?: boolean;
  isAr?: boolean;
}

function Input({
  errors,
  id,
  label,
  register,
  disabled,
  options,
  value,
  placeholder,
  type = "text",
  textarea,
  multiple,
  isAr,
}: props) {
  useSignals();
  const [isShowen, setIsShowen] = useState(false);
  function handleShowPass() {
    setIsShowen((prev) => !prev);
  }

  return (
    <>
      <div className={`flex flex-col gap-2 w-full`} dir={isAr ? "rtl" : "ltr"}>
        {label && (
          <label htmlFor={id} className="text-xs capitalize font-medium">
            {label}
          </label>
        )}
        <div className="relative">
          {((errors[id] && errors[id]?.message) || isAdminError.value) && (
            <span
              className={`absolute text-[10px] font-medium top-full text-red-500 ${
                isAr ? "left-0" : "right-0"
              }`}
            >
              {errors[id]?.message?.toString()}
            </span>
          )}

          {isAdminError.value && id == "code" && (
            <span className="text-red-500 absolute -bottom-10 left-1/2 -translate-x-1/2 font-medium">
              يجب ادخال الرمز بشكل صحيح
            </span>
          )}

          <span
            className={`top-1/2 absolute  z-20 -translate-y-1/2  ${
              id === "password" || id === "passwordC"
                ? isAr
                  ? "left-1/2"
                  : "right-12"
                : isAr
                ? "left-4"
                : "right-4"
            }`}
          >
            {(errors[id] || isAdminError.value) && (
              <IoCloseSharp className="text-lg text-red-500" />
            )}
          </span>

          {(id === "password" || id === "passwordC") && (
            <div
              className={`absolute top-1/2 z-10 -translate-y-1/2 text-gray-400 text-sm cursor-pointer ${
                isAr ? "left-4" : "right-4"
              } `}
              onClick={handleShowPass}
            >
              {isShowen ? <AiFillEyeInvisible /> : <BsFillEyeFill />}
            </div>
          )}

          {textarea ? (
            <textarea
              id={id}
              disabled={disabled}
              className={`p-2 bg-black resize-none h-[130px]  border  w-full outline-none rounded-md relative transition-all   ${
                errors[id] ? "border-red-500" : "border-gray-300"
              }`}
              {...register(id, options)}
              autoComplete="off"
              defaultValue={value}
              name={id}
              placeholder={placeholder ? placeholder : ""}
            />
          ) : (
            <input
              id={id}
              dir={isAr ? "rtl" : "ltr"}
              type={
                id === "password" || id === "passwordC"
                  ? isShowen
                    ? "text"
                    : type
                  : type
              }
              placeholder={placeholder ? placeholder : ""}
              disabled={disabled}
              className={`p-2 bg-gray-100  w-full outline-none border rounded-lg relative transition-all   ${
                errors[id] || isAdminError.value
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              {...register(id, options)}
              autoComplete="off"
              defaultValue={value}
              name={id}
              multiple={multiple ? true : false}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default Input;
