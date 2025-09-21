"use client";

import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

export default function BackButton({
  type,
}: {
  type?: "product" | "profile" | "default";
}) {
  const navigate = useNavigate();
  return (
    <Button
      className={`rounded-lg border-[1px] border-black/20 w-fit ${
        type === "product" ? "my-4 ml-4" : "fixed top-6 left-4 md:left-7 "
      }`}
      variant="ghost"
      onClick={() => navigate(-1)}
    >
      <ArrowLeft /> Back
    </Button>
  );
}
