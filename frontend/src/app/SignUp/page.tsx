"use client"
import styles from "./signUp.module.css";

import { supabase } from "@/lib/supabaseClient";

import { useRouter } from "next/navigation";
import { useState } from "react";

async function handleSignUp(email: string, password: string)
{
    const { data , error } = await supabase.auth.signUp({
        email,
        password,
    });

    if(error)
    {
        console.error("Signup error: ",error.message);
        alert("Signup failed: " + error.message);
    }
    else
    {
        console.log("Signup success: " , data);
        alert("Signup successful! Check your email to verify your account.");
    }
}

export default function signUp(){

    const router = useRouter();
    const [email , setEmail] = useState("");
    const [password , setPassword] = useState("");
    const [message , setMessage] = useState("");
    const [isValid , setIsValid] = useState<boolean | null>(null);
    const [animationKey , setAnimationKey] = useState(0);

    const handleReturn = () =>
    {
        router.push('/Home');
    };

    const validateEmail = (email:string) =>
    {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const validatePassword = (password:string) => 
    {
        const hasUpperCase = /[A-Z]/.test(password);
        const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        const hasLenght = password.length >= 8;
        return hasUpperCase && hasSymbol && hasLenght;
    };

    const handleSignup = () => 
    {
        if(!validateEmail(email))
        {
            setMessage("X Invalid email format!");
            setIsValid(false);
            setAnimationKey(prev => prev + 1 );
            return;
        }

        if(!validatePassword(password))
        {
            setMessage("X Password does not meet requirements!");
            setIsValid(false);
            setAnimationKey(prev => prev + 1 );
            return;
        }

        else
        {
            setMessage("Processing signup...");
            setIsValid(true);
            setAnimationKey(prev => prev + 1 );

            handleSignUp(email , password);
        }
    };

    
    const messageClassName = isValid === null 
        ? "" 
        : isValid 
            ? styles["setStyleCorrect"] 
            : styles["setStyleFalse"];
    
    return (
        <main className={styles["main-container"]}>
            <h1><div className={styles["title"]}>Sign up</div></h1>
            
            <div className={styles["inputFields"]}>

            <div className={styles["email"]}>Email</div>
            <input className={styles["emailInput"]} type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)}></input>

            <div className={styles["password"]}>Password</div>
            <input className={styles["passwordInput"]} type="password" value={password} onChange={(e) => setPassword(e.target.value)}></input>
            <div className={styles["passwordReqierments"]}>
                <div> 1. Password must contains at least one symbol (! , @ , # ,$ , %) </div>
                <div> 2. Password must contains at least one capitalized letter </div>  
                <div> 3. Password must be atleast 8 characters</div>
            </div>
            </div>

            {message && 
            (
                <p key={animationKey} className={messageClassName}>{message}</p>
            )}

            <button className={styles["confirmSignupButton"]} onClick={handleSignup}>SIGN UP</button>
            <button className={styles["returnButton"]} onClick={handleReturn}>X</button>

        </main>

        
    );
}