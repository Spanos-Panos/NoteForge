"use client";

import { useState, ChangeEvent, useRef, useEffect } from "react";
import styles from "./TextArea.module.css";

interface TextAreaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  maxLength?: number;
  disabled?: boolean;
  error?: string;
  required?: boolean;
  showCharCount?: boolean;
  autoResize?: boolean;
}

export default function TextArea({
  value,
  onChange,
  placeholder = "",
  rows = 4,
  maxLength,
  disabled = false,
  error,
  required = false,
  showCharCount = false,
  autoResize = false,
}: TextAreaProps) {
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize functionality
  useEffect(() => {
    if (autoResize && textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value, autoResize]);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (!maxLength || newValue.length <= maxLength) {
      onChange(newValue);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const charCount = value.length;
  const isOverLimit = maxLength ? charCount > maxLength : false;

  return (
    <div className={styles.textAreaContainer}>
      <div
        className={`${styles.textAreaWrapper} ${
          isFocused ? styles.focused : ""
        } ${error ? styles.error : ""} ${disabled ? styles.disabled : ""}`}
      >
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          rows={autoResize ? 1 : rows}
          disabled={disabled}
          required={required}
          maxLength={maxLength}
          className={styles.textarea}
          aria-invalid={!!error}
          aria-describedby={error ? "textarea-error" : undefined}
        />

        {showCharCount && maxLength && (
          <span
            className={`${styles.charCount} ${
              isOverLimit ? styles.overLimit : ""
            }`}
          >
            {charCount}/{maxLength}
          </span>
        )}

        {required && !disabled && (
          <span className={styles.requiredIndicator}>*</span>
        )}
      </div>

      {error && (
        <div className={styles.errorMessage} id="textarea-error">
          <svg
            className={styles.errorIcon}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </div>
      )}
    </div>
  );
}

