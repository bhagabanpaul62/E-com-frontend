import React, { Suspense } from "react";
import OtpVerify from "./otpVerify";
export default function OtpVerifyPage() {
  return (
    <Suspense fallback={<div>Loading.....</div>}>
      <OtpVerify />
    </Suspense>
  );
}
