import { User } from "@prisma/client";
import { atom } from "recoil";

export const selectedMemberAtom = atom<User>({
  key: "selectedMember",
  default: undefined,
});
