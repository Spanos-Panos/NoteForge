"use client";

import styles from "./main.module.css";
import {useRouter} from "next/navigation";  

export default function Main() {
  const router = useRouter();

  const handleProjects = () =>{
    router.push('/Projects');
  }
  
  return (
    <div>
        <div className={styles["mainContainer"]}></div>
        <button className={styles["ProjectButton"]} onClick={handleProjects}>Projects</button>
    </div>
  );
}
