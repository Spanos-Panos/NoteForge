"use client";

import React, { useState } from "react";
import styles from "./login.module.css";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [animationKey, setAnimationKey] = useState(0);
  const [isChecked , setIsChecked] = useState(false);

  
  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password: string) =>
    password.length >= 8;


  const handleLogin = async () => {
    if (!validateEmail(email)) {
      setMessage("Invalid email format");
      setIsValid(false);
      setAnimationKey((prev) => prev + 1);
      return;
    }

    if (!validatePassword(password)) {
      setMessage("Password must be at least 8 characters");
      setIsValid(false);
      setAnimationKey((prev) => prev + 1);
      return;
    }

    setMessage("Logging in...");
    setIsValid(true);
    setAnimationKey((prev) => prev + 1);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Login error:", error.message);
      setMessage("Login failed: " + error.message);
      setIsValid(false);
    } else {
      console.log("Login success:", data);
      setMessage("Login successful!");
      setIsValid(true);
      setTimeout(() => router.push("/Home"), 1500);
    }

    if(!error)
    {
      if(isChecked)
      {
        localStorage.setItem("nf_remember" ,"1");
      }
      else
      {
        localStorage.removeItem("nf_remember");
      }
      setTimeout(() => router.push("/Home"),800);
    }

  };

  const handleReturn = () => {
    router.push("/Home");
  };

  const messageClassName =
    isValid === null
      ? ""
      : isValid
      ? styles["setStyleCorrect"]
      : styles["setStyleFalse"];

  return (
    <main className={styles["main-container"]}>
      <h1>
        <div className={styles["title"]}>Login</div>
      </h1>

      <div className={styles["inputFields"]}>
        <div className={styles["email"]}>Email</div>
        <input
          className={styles["emailInput"]}
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className={styles["password"]}>Password</div>
        <input
          className={styles["passwordInput"]}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <label className={styles["checkboxLabel"]}>
        <input type="checkbox" checked={isChecked} onChange={(e) => setIsChecked(e.target.checked)}></input>
        <span> Remember me </span>   
      </label>

      <button className={styles["confirmSignupButton"]} onClick={handleLogin}>
        Login
      </button>
      <button className={styles["returnButton"]} onClick={handleReturn}>
        X
      </button>

      {message && (
        <div key={animationKey} className={messageClassName}>
          {message}
        </div>
      )}
    </main>
  );
}
