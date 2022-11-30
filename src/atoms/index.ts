// import { atom } from "nanostores";

import { map } from "nanostores";

// export interface ProfileValue {
//   name: string,
//   email?: string
// }

// export const profile = map<ProfileValue>({
//   name: 'anonymous'
// })

import type { User } from "../types/index";

export const userData = map<User>(null);

export const setUser = (data: User | null) => {
  userData.set(data);
};

// import type { User } from "../types/index";

// export const user = atom<null | User>(null);

// export const setUser = (data: User | null) => {
//   user.set(data);
// };
