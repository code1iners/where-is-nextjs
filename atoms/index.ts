import { atom } from "recoil";
import { UserWithLocations } from "@pages/users/me";

export const selectedMemberAtom = atom<UserWithLocations | undefined>({
  key: "selectedMember",
  default: undefined,
});
