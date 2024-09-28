"use client";

import { useAuthActions } from "@convex-dev/auth/react";

import { Button } from "@/components/ui/button";

export default function Home() {
  const { signOut } = useAuthActions();

  return (
    <div>
      <p>Logged in!</p>
      <Button onClick={() => signOut()}>Sign out</Button>
    </div>
  );
}
