import type { User as BaseUser } from "@/types";

export type SessionUser = BaseUser;

export type Session = {
  user: SessionUser;
};
