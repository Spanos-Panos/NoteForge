"use client";

import styles from "./home.module.css";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleSignup = () => 
  {
    router.push('/SignUp');
  };
  const handleLogin = () => 
  {
    router.push('/Login');
  };
  return (
    <div className={styles["main-container"]}>
      <h1 className={styles["title"]}>Noteforge</h1>
      <p className={styles["description"]}>Craft your notes, projects, and progress all in one place.</p>

      <div>
        <button className={styles["LoginButton"]} onClick={handleLogin}>Login</button>
        <button className={styles["SignUpButton"]} onClick={handleSignup}>Sign Up</button>
      </div>
    </div>
  );
}
