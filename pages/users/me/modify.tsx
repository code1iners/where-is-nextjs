import HorizontalButton from "@components/horizontal-button";
import MobileLayout from "@components/mobile-layout";
import useDiff from "@libs/clients/useDiff";
import useMutation from "@libs/clients/useMutation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import useSWR from "swr";
import { UserMeResult } from ".";

interface UserModifyForm {
  email: string;
  name: string;
  phone?: string;
  gender: "MALE" | "FEMALE" | null;
  avatar?: string;
}

export default function Modify() {
  const { data, error, mutate } = useSWR<UserMeResult>("/api/v1/users/me");
  const { handleSubmit, register, setValue } = useForm<UserModifyForm>();
  const { objectComparator } = useDiff();
  const [modify, { ok: modifyOk, error: modifyError, loading: modifyLoading }] =
    useMutation("/api/v1/users/me/modify");

  const isValid = (form: UserModifyForm) => {
    // Is loading?
    if (modifyLoading) return;

    const originData: any = { ...data?.me };
    delete originData.id;
    const newData: any = { ...form };

    const result: UserModifyForm = objectComparator(originData, newData);

    if (result) modify({ data: result, method: "PATCH" });
  };

  useEffect(() => {
    if (data && data.me) {
      setValue("email", data.me.email);
      setValue("name", data.me.name);
      setValue("phone", data.me.phone);
      setValue("gender", data.me.gender);
      setValue("avatar", data.me.avatar);
    }
    if (error) console.error("[modify]", error);
  }, [data, error]);

  useEffect(() => {
    if (modifyOk && !modifyLoading) {
      alert("정상적으로 저장되었습니다.");
    }
    if (modifyError) console.error("[modify]", modifyError);
    mutate();
  }, [modifyOk, modifyError, modifyLoading]);

  return (
    <MobileLayout seoTitle="">
      <article>
        {data ? (
          <section>
            <form
              onSubmit={handleSubmit(isValid)}
              className="flex flex-col gap-3"
            >
              {/* Avatar */}
              <label>
                <input {...register("avatar")} type="file" />
              </label>

              {/* Email */}
              <div className="flex items-center gap-2">
                <label htmlFor="email" className="capitalize">
                  email
                </label>
                <input
                  {...register("email", {
                    required: "Email is required.",
                  })}
                  id="email"
                  type="email"
                  placeholder="Email"
                  autoComplete="off"
                  autoCapitalize="off"
                  required
                />
              </div>

              {/* Name */}
              <div className="flex items-center gap-2">
                <label htmlFor="name" className="capitalize">
                  name
                </label>
                <input
                  {...register("name", {
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
                  id="name"
                  type="name"
                  placeholder="name"
                  autoComplete="off"
                  autoCapitalize="off"
                  required
                />
              </div>

              {/* Phone */}
              <div className="flex items-center gap-2">
                <label htmlFor="phone" className="capitalize">
                  phone
                </label>
                <input
                  {...register("phone")}
                  id="phone"
                  type="phone"
                  placeholder="phone"
                  autoComplete="off"
                  autoCapitalize="off"
                />
              </div>

              {/* Phone */}
              <div className="flex items-center gap-2">
                <label className="capitalize">gender</label>
                <label className="flex items-center gap-2">
                  남성
                  <input
                    {...register("gender")}
                    id="gender-male"
                    type="radio"
                    name="gender"
                    value="MALE"
                  />
                </label>

                <label className="flex items-center gap-2">
                  여성
                  <input
                    {...register("gender")}
                    id="gender-female"
                    type="radio"
                    name="gender"
                    value="FEMALE"
                  />
                </label>
              </div>

              <HorizontalButton text="저장" />
            </form>
          </section>
        ) : null}
      </article>
    </MobileLayout>
  );
}
