import { httpMethod } from "./../servers/apiCaller";
import { useState } from "react";

export interface SimpleError {
  code: string;
  message: string;
}

interface useMutationState<T> {
  ok: boolean;
  loading: boolean;
  data?: T;
  error?: SimpleError;
}

interface useMutationProps {
  data: any;
  headers?: any;
  method?: httpMethod;
}

type useMutationResult<T> = [
  (props: useMutationProps) => void,
  useMutationState<T>
];

export default function useMutation<T = any>(
  url: string
): useMutationResult<T> {
  const [state, setState] = useState<useMutationState<T>>({
    ok: false,
    loading: false,
    data: undefined,
    error: undefined,
  });

  function mutation({ data, headers, method = "POST" }: useMutationProps) {
    const authorization = sessionStorage.getItem("ACCESS_TOKEN") || "";
    setState((p) => ({ ...p, loading: true }));
    fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(authorization && { authorization }),
        ...headers,
      },
      ...(data && { body: JSON.stringify(data) }),
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
