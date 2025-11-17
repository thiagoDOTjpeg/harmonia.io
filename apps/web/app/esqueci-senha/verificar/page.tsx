import { Suspense } from "react";
import VerifyCodeContent from "./verify-code-content";

export default function VerifyCodePage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <VerifyCodeContent />
    </Suspense>
  );
}
