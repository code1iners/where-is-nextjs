import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { JoinResultData } from "pages/api/v1/auth/join";
import { LoginResultData } from "pages/api/v1/auth/login";
import MobileLayout from "@components/mobile-layout";
import HorizontalDivider from "@components/horizontal-divider";
import useMutation from "@libs/clients/useMutation";
import LoadingTextWavy from "@components/loading-text-wavy";
import useLength from "@libs/clients/useLength";

export interface JoinForm {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

export default function Join() {
  const {
    handleSubmit,
    register,
    formState: { errors },
    getValues,
    setError,
  } = useForm<JoinForm>();
  const router = useRouter();
  const { getStringLength } = useLength();

  const [
    join,
    { ok: joinOk, data: joinData, error: joinError, loading: joinLoading },
  ] = useMutation<JoinResultData>("/api/v1/auth/join");
  const [
    login,
    { ok: loginOk, data: loginData, error: loginError, loading: loginLoading },
  ] = useMutation<LoginResultData>("/api/v1/auth/login");

  const isConfirmPasswordValid = (confirmPasswordValue: string) =>
    getValues("password") === confirmPasswordValue;

  const onSubmitValid = (form: JoinForm) => {
    if (!joinLoading) join({ data: form });
  };

  const isMinLengthValid = (username: string) => {
    const length = getStringLength(username);
    return length < 4 ? "Username must have at least 4 digits." : true;
  };

  useEffect(() => {
    if (joinOk && joinData) {
      if (!loginLoading)
        login({
          data: {
            email: getValues("email"),
            password: getValues("password"),
          },
        });
    }

    if (joinError) {
      // Error toast.
      console.error("[join]", joinError);

      setError("email", {
        message: joinError.message,
      });
    }
  }, [joinOk, joinData, joinError]);

  useEffect(() => {
    if (loginOk && loginData) {
      // Set user session.
      sessionStorage.setItem("ACCESS_TOKEN", loginData.token);
      router.replace("/");
    }

    if (loginError) {
      // Error toast.
      console.error("[login]", joinError);
    }
  }, [loginOk, loginData, loginError]);

  if (joinLoading || loginLoading) return <LoadingTextWavy />;

  return (
    <MobileLayout seoTitle="????????????">
      <article>
        <section>
          <form
            className="flex flex-col space-y-5"
            onSubmit={handleSubmit(onSubmitValid)}
          >
            <div className="flex flex-col">
              <input
                {...register("email", {
                  required: true,
                })}
                className="input-text"
                type="email"
                placeholder="Email."
                autoComplete="off"
                autoCapitalize="off"
                required
              />
              {errors.email ? (
                <span className="error-message">{errors.email.message}</span>
              ) : null}
            </div>

            <div className="flex flex-col">
              <input
                {...register("username", {
                  required: "Username is required.",
                  minLength: {
                    value: 8,
                    message: "Username must have at least 8 digits.",
                  },
                  maxLength: {
                    value: 16,
                    message: "Username it must be no more than 16 digits.",
                  },
                  validate: isMinLengthValid,
                })}
                className="input-text"
                type="text"
                placeholder="Username."
                autoComplete="off"
                autoCapitalize="off"
                required
              />
              {errors.username ? (
                <span className="error-message">{errors.username.message}</span>
              ) : null}
            </div>

            <div className="flex flex-col">
              <input
                {...register("password", {
                  required: "Password is required.",
                  minLength: {
                    value: 8,
                    message: "Password must have at least 8 digits.",
                  },
                })}
                className="input-text"
                type="password"
                placeholder="Password."
                required
              />
              {errors.password ? (
                <span className="error-message">{errors.password.message}</span>
              ) : null}
            </div>

            <div className="flex flex-col">
              <input
                {...register("confirmPassword", {
                  required: "Confirm password is required.",
                  validate: {
                    isConfirmPasswordValid,
                  },
                })}
                className="input-text"
                type="password"
                placeholder="Confirm password."
                required
              />
              {errors.confirmPassword ? (
                errors.confirmPassword.type === "isConfirmPasswordValid" ? (
                  <span className="error-message">Password is not same.</span>
                ) : (
                  <span className="error-message">
                    {errors.confirmPassword.message}
                  </span>
                )
              ) : null}
            </div>

            <input
              className="rounded-md bg-purple-500 text-white text-lg font-semibold tracking-widest p-2 cursor-pointer hover:bg-purple-600 focus:bg-purple-600"
              type="submit"
              value="Join"
            />
          </form>
        </section>

        <HorizontalDivider margin="md" />

        <section>
          <nav className="flex justify-center">
            <Link href={"/auth/login"}>
              <a>
                <span className="tracking-wider">
                  Do you have an
                  <span className="text-purple-500 mx-1">Account</span>
                  already?
                </span>
              </a>
            </Link>
          </nav>
        </section>
      </article>
    </MobileLayout>
  );
}
