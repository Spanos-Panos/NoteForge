import { useState } from "react";
import styles from "./settings.module.css";

export default function Settings() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.wrapper}>
      <button
        className={styles.settingsButton}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className={styles.gear}>
          {/* Each span = one tooth */}
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </button>

      {isOpen && (
        <div className={styles.panel}>
          <h2>Settings</h2>
          <p>Settings panel placeholder</p>
        </div>
      )}
    </div>
  );
}
