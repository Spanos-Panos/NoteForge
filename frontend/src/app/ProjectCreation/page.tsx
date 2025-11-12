"use client";

import { useState } from "react";

import styles from "./ProjectCreation.module.css";
import ImageDisplay from "../Components/ImageDisplay/ImageDisplay";
import TextInput from "../Components/TextInput/TextInput";
import TextArea from "../Components/TextArea/TextArea";
import TechStackField from "../Components/TechStackField/TechStackField";

export default function ProjectCreation()
{

    const [projectName , setProjectName] = useState("");
    const suggestions=[
        "My React App",
        "My .Net App",
        "Hello word"
    ];

    const [description , setDescription] = useState("");

    const [enableFrontend , setEnableFrontend] = useState(false);
    const [frontendStates, setFrontendStates] = useState<Record<string, { value: string; enabled: boolean }>>({
        language: { value: "" , enabled: false},
        framework: { value: "" , enabled: false},
        styling: { value: "" , enabled: false}
    });
    
    const frontendFields = 
    [
        {
            id: "language",
            label: "Language",
            placeholder: "Select language",
            options:
            [
                { value: "HTML" , label: "HTML" },
                { value: "Javascript" , label: "Javascript" },
                { value: "Typescript" , label: "Typescript" },
            ]
        },
        {
            id: "framework",
            label: "Framework",
            placeholder: "Select framework",
            options:
            [
                { value: "React" , label: "React" },
                { value: "React Native" , label: "React Native" },
                { value: "Next.js" , label: "Next.js" },
                { value: "Vue.js" , label: "Vue.js" },
                { value: "Angular" , label: "Angular" },
                { value: "Blazor" , label: "Blazor" },  
                { value: "Flutter" , label: "Flutter" },
                { value: "Expo" , label: "Expo" },
            ]
        }, 
        {
            id: "Styling",
            label: "Styling",
            placeholder: "Select Style",
            options:
            [
                { value: "CSS" , label: "CSS" },
                { value: "TailwindCSS" , label: "TailwindCSS" },
            ]
        },
        {
            id: "UiTools",
            label: "UiTools",
            placeholder: "UiTools",
            options:
            [
                { value: "Figma" , label: "Figma" },
                { value: "Framer" , label: "Framer" },
            ]
        }
    ]

    return(
        <main className={styles["bookContainer"]}>
            <div className={styles["mainContainer"]}>
        
            <div className={styles["projectImage"]}>
            <ImageDisplay
            imageSrc="/Pictures/DefaultPictures/default.png"
            alt="defaultImage"
            width="300px"
            height="150px">                  
            </ImageDisplay></div>

            <div className={styles["projectNameInput"]}>
            <TextInput
            value={projectName}
            onChange={setProjectName}
            placeholder="Enter project name"
            suggestions={suggestions}
            showSuggestions={true}
            maxLength={100}
            showCharCount={true}
            required={true}>  
            </TextInput>
            </div>

            <div className={styles["textAreaInput"]}>
            <TextArea
            value={description}
            onChange={setDescription}
            placeholder="Project Description">   
            </TextArea>
            </div>
    
            </div>
            <div className={styles["middleBookLine"]}></div>
            <div className={styles["mainContainer"]}>
                
            <div className={styles["frontendOptions"]}>
            <TechStackField
            label="Frontend"
            checked={enableFrontend}
            onToggle={setEnableFrontend}
            fields={frontendFields}
            fieldStates={frontendStates}
            onFieldStatesChange={setFrontendStates}
            layout="horizontal"
            checkboxPosition="left"
            columns={2}>
            </TechStackField>
            </div>

            </div>
        </main>
    );
}