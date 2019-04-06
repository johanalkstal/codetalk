import React, { useEffect } from "react";
import { signOut } from "../core/firebase-auth";

export default function SignOut() {
  useEffect(() => signOut(), []);
  return <p>Signing you out...</p>;
}
