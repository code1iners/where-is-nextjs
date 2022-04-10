import { useState } from "react";

interface SimpleError {
  code: number;
  message: string;
}

interface useMutationState<T> {
  ok: boolean;
  loading: boolean;
  data?: T;
  error?: SimpleError;
}

type useMutationResult<T> = [(data: any) => void, useMutationState<T>];

export default function useMutation<T = any>(
  url: string
): useMutationResult<T> {
  const [state, setState] = useState<useMutationState<T>>({
    ok: false,
    loading: false,
    data: undefined,
    error: undefined,
  });

  function mutation(data: any) {
    setState((p) => ({ ...p, loading: true }));
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then(async (res) => res.json())
      .then(({ ok, data, error }) =>
        setState((p) => ({ ...p, ok, data, error, loading: false }))
      )
      .catch((error) =>
        setState((p) => ({ ...p, ok: false, error, loading: false }))
      );
  }

  return [mutation, { ...state }];
}
