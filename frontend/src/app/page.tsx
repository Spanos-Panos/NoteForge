"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation"; // ✅ correct import for App Router (Next.js 13+)
import { supabase } from "@/lib/supabaseClient";
import Home from "./Home/page";

function AuthCheckOnStart() {
  const router = useRouter();

  useEffect(() => {
    async function check() {
      // Check Supabase session
      const { data } = await supabase.auth.getSession();
      const session = data?.session ?? null;

      // Get remember-me setting
      const remember = localStorage.getItem("nf_remember") === "1";

      // If logged in and remember=true → go Home
      if (session && remember) {
        router.push("/Home");
        return;
      }

      // If logged in but remember=false → sign out
      if (session && !remember) {
        await supabase.auth.signOut();
      }
    }

    check();
  }, [router]);

  // This component doesn't render anything
  return null;
}

export default function Page() {
  return (
    <main>
      <AuthCheckOnStart />
      <Home />
    </main>
  );
}
