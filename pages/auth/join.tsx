import Link from "next/link";
import { useRouter } from "next/router";
import { JoinResultData } from "pages/api/v1/auth/join";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import HorizontalDivider from "../../components/HorizontalDivider";
import useMutation from "../../libs/clients/useMutation";

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
  } = useForm<JoinForm>();
  const router = useRouter();

  const [
    join,
    { ok: joinOk, data: joinData, error: joinError, loading: joinLoading },
  ] = useMutation<JoinResultData>("/api/v1/auth/join");

  const isConfirmPasswordValid = (confirmPasswordValue: string) =>
    getValues("password") === confirmPasswordValue;

  const onSubmitValid = (form: JoinForm) => {
    if (!joinLoading) join(form);
  };

  useEffect(() => {
    if (joinOk && joinData) {
      // Set user session.
      sessionStorage.setItem("ACCESS_TOKEN", joinData.token);

      router.push("/");
    } else {
      // Error toast.
      console.error(joinError);
    }
  }, [joinOk, joinData, joinError, joinLoading]);

  return (
    <main className="m-5">
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
            <span className="error-message text-sm">
              {errors.email.message}
            </span>
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
            })}
            className="input-text"
            type="text"
            placeholder="Username."
            autoComplete="off"
            autoCapitalize="off"
            required
          />
          {errors.username ? (
            <span className="error-message text-sm">
              {errors.username.message}
            </span>
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
            <span className="error-message text-sm">
              {errors.password.message}
            </span>
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
              <span className="error-message text-sm">
                Password is not same.
              </span>
            ) : (
              <span className="error-message text-sm">
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

      <HorizontalDivider margin="md" />

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
    </main>
  );
}
