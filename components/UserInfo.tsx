"use client"

import { useUser } from "@/context/UserContext";

export default function UserInfo() {
  const { user } = useUser();
  return <p>Welcome, {user?.email}</p>;
}
