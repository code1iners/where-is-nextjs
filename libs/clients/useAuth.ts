import { useState } from "react";
import { SimpleError } from "./useMutation";

interface useAuthResult {
  checker: () => Promise<{
    ok: boolean;
    error: SimpleError;
  }>;
}

export default function useAuth(): useAuthResult {
  const checker = async () => {
    const token = sessionStorage.getItem("ACCESS_TOKEN");

    const { ok, error } = await fetch("/api/v1/auth/check", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: token }),
      },
    })
      .then((res) => res.json())
      .catch((error) => {
        console.error(error);
        return { ok: false };
      });

    return {
      ok,
      error,
    };
  };

  return {
    checker,
  };
}
