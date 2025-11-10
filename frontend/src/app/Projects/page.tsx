"use client";

import styles from "./projects.module.css";

import { useRouter } from "next/navigation";

export default function Projects(){
    
    const router = useRouter();

    const handleCreateProject = () =>{
        router.push('/ProjectCreation');
    }
    
    return(
        <main className={styles["bookContainer"]}>
            <div className={styles["mainContainer"]}>
                
                <button className={styles["createProjectButton"]} onClick={handleCreateProject}>➕</button>

            </div>
            <div className={styles["middleBookLine"]}></div>
            <div className={styles["mainContainer"]}>
                


            </div>
        </main>
    );
}