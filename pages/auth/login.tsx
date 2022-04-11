import HorizontalButton from "@components/HorizontalButton";
import HorizontalDivider from "@components/HorizontalDivider";
import useMutation from "@libs/clients/useMutation";
import Link from "next/link";
import { useRouter } from "next/router";
import { LoginResultData } from "pages/api/v1/auth/login";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

export interface LoginForm {
  email: string;
  password: string;
}

export default function Login() {
  const {
    handleSubmit,
    register,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<LoginForm>();

  const [login, { ok, data, error, loading }] =
    useMutation<LoginResultData>("/api/v1/auth/login");

  const router = useRouter();

  const onSubmitValid = (form: LoginForm) => {
    if (!loading) {
      clearErrors();
      login(form);
    }
  };

  useEffect(() => {
    if (ok && data) {
      sessionStorage.setItem("ACCESS_TOKENS", data.token);

      router.push("/");
    } else {
      if (error) {
        switch (error.code) {
          case "002":
            setError("email", {
              message: error?.message,
            });
            break;

          case "003":
            setError("password", {
              message: error?.message,
            });
            break;
          default:
            setError("password", {
              message: error?.message,
            });
            break;
        }
      }
    }
  }, [ok, data, error, loading]);

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

        <HorizontalButton text="Login" />
      </form>

      <HorizontalDivider margin="md" />

      <nav className="flex justify-center">
        <Link href={"/auth/join"}>
          <a>
            <span className="tracking-wider">
              Do you need a<span className="text-purple-500 mx-1">New</span>
              account?
            </span>
          </a>
        </Link>
      </nav>
    </main>
  );
}
