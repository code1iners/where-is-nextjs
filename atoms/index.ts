import { User } from "@prisma/client";
import { atom } from "recoil";

export const selectedMemberAtom = atom<User | undefined>({
  key: "selectedMember",
  default: undefined,
});
