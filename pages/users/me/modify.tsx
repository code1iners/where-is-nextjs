import HorizontalButton from "@components/horizontal-button";
import MobileLayout from "@components/mobile-layout";
import Image from "next/image";
import useDiff from "@libs/clients/useDiff";
import useMutation from "@libs/clients/useMutation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useSWR from "swr";
import { UserMeResult } from ".";
import useRandom from "@libs/clients/useRandom";
import useCloudflare from "@libs/clients/useCloudflare";
import EmptyAvatar from "@components/empty-avatar";

interface UserModifyForm {
  email: string;
  name: string;
  phone?: string;
  gender: "MALE" | "FEMALE" | null;
  avatarPreview?: FileList;
  avatar?: string;
}

export default function Modify() {
  const { data, error, mutate } = useSWR<UserMeResult>("/api/v1/users/me");
  const { handleSubmit, register, setValue, watch } = useForm<UserModifyForm>();
  const { objectComparator } = useDiff();
  const [modify, { ok: modifyOk, error: modifyError, loading: modifyLoading }] =
    useMutation("/api/v1/users/me/modify");
  const { createRandomString } = useRandom();
  const { createImageUrl } = useCloudflare();

  const isValid = async (form: UserModifyForm) => {
    // Is loading?
    if (modifyLoading) return;

    const originData: any = { ...data?.me };
    delete originData.id;
    const newData: any = { ...form };

    // Image process.
    // Getting cloudflare images upload direct url.
    if (avatarPreview) {
      const { ok: hasUploadUrl, result: uploadUrl } = await fetch(
        "/api/v1/cloudflares/images/urls"
      ).then((res) => res.json());
      if (hasUploadUrl && avatar?.length && data) {
        const file = avatar[0] as File;

        const form = new FormData();
        form.append(
          "file",
          file,
          `/where-is/users/${data.me.id}/avatars/${createRandomString()}-${
            file.name
          }`
        );

        const { result: uploadedResult } = await fetch(uploadUrl?.uploadURL, {
          method: "POST",
          body: form,
        }).then((res) => res.json());

        newData["avatar"] = uploadedResult?.id;
      }
    }

    const result: UserModifyForm = objectComparator(originData, newData);

    if (result) modify({ data: result, method: "PATCH" });
    else alert("There is no change.");
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

  const avatar = watch("avatarPreview");
  const [avatarPreview, setAvatarPreview] = useState("");
  useEffect(() => {
    if (avatar?.length) {
      const file = avatar[0];
      setAvatarPreview(URL.createObjectURL(file));
    }
  }, [avatar]);

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
              <div className="flex justify-center items-center p-5">
                <label>
                  {avatarPreview ? (
                    <Image
                      className="cursor-pointer rounded-full object-cover"
                      src={avatarPreview}
                      width={120}
                      height={120}
                      alt="Avatar"
                    />
                  ) : data.me.avatar ? (
                    <Image
                      className="cursor-pointer rounded-full object-cover"
                      src={createImageUrl({
                        imageId: data.me.avatar,
                        variant: "avatar",
                      })}
                      width={120}
                      height={120}
                      alt="Avatar"
                    />
                  ) : (
                    <EmptyAvatar name={data.me.name} />
                  )}

                  <input
                    {...register("avatarPreview")}
                    accept="image/*"
                    type="file"
                    className="hidden"
                  />
                </label>
              </div>

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
