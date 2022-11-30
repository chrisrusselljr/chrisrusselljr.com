import { map } from "nanostores";

import type { User } from "../types/index";

export const userData = map<User>(null);

export const setUser = (data: User | null) => {
  userData.set(data);
};
