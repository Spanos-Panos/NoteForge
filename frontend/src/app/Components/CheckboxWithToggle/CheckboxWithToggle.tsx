"use client";

import { ReactNode } from "react";
import styles from "./CheckboxWithToggle.module.css";

interface CheckboxWithToggleProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  children: ReactNode;
  description?: string;
  disabled?: boolean;
  icon?: string;
}

export default function CheckboxWithToggle({
  label,
  checked,
  onChange,
  children,
  description,
  disabled = false,
  icon,
}: CheckboxWithToggleProps) {
  return (
    <div className={`${styles.container} ${disabled ? styles.disabled : ""}`}>
      <div className={styles.header}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            disabled={disabled}
            className={styles.checkbox}
          />
          <span className={styles.checkboxCustom}>
            {checked && <span className={styles.checkmark}>✓</span>}
          </span>
          <span className={styles.labelText}>
            {icon && <span className={styles.icon}>{icon}</span>}
            {label}
          </span>
        </label>
        {description && (
          <p className={styles.description}>{description}</p>
        )}
      </div>

      <div
        className={`${styles.content} ${
          !checked ? styles.contentDisabled : ""
        }`}
      >
        {children}
      </div>
    </div>
  );
}

