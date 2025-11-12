"use client";

import { useState, useRef, useEffect, ChangeEvent, KeyboardEvent } from "react";
import styles from "./TextInput.module.css";

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  suggestions?: string[];
  showSuggestions?: boolean;
  maxLength?: number;
  disabled?: boolean;
  error?: string;
  required?: boolean;
  type?: "text" | "email" | "url" | "password";
  showCharCount?: boolean;
  onEnter?: () => void;
}

export default function TextInput({
  value,
  onChange,
  placeholder = "",
  suggestions = [],
  showSuggestions = false,
  maxLength,
  disabled = false,
  error,
  required = false,
  type = "text",
  showCharCount = false,
  onEnter,
}: TextInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestionsList, setShowSuggestionsList] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Filter suggestions based on input value
  useEffect(() => {
    if (showSuggestions && value && suggestions.length > 0) {
      const filtered = suggestions.filter((suggestion) =>
        suggestion.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSuggestions(filtered);
      setShowSuggestionsList(filtered.length > 0 && isFocused);
    } else {
      setShowSuggestionsList(false);
      setFilteredSuggestions([]);
    }
    setSelectedSuggestionIndex(-1);
  }, [value, suggestions, showSuggestions, isFocused]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(e.target as Node) &&
        !inputRef.current?.contains(e.target as Node)
      ) {
        setShowSuggestionsList(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (!maxLength || newValue.length <= maxLength) {
      onChange(newValue);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion);
    setShowSuggestionsList(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (showSuggestionsList && filteredSuggestions.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedSuggestionIndex((prev) =>
          prev < filteredSuggestions.length - 1 ? prev + 1 : prev
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedSuggestionIndex((prev) => (prev > 0 ? prev - 1 : -1));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (selectedSuggestionIndex >= 0) {
          onChange(filteredSuggestions[selectedSuggestionIndex]);
          setShowSuggestionsList(false);
        } else if (onEnter) {
          onEnter();
        }
      } else if (e.key === "Escape") {
        setShowSuggestionsList(false);
      }
    } else if (e.key === "Enter" && onEnter) {
      e.preventDefault();
      onEnter();
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (showSuggestions && value && filteredSuggestions.length > 0) {
      setShowSuggestionsList(true);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    // Delay to allow suggestion click to register
    setTimeout(() => {
      setShowSuggestionsList(false);
    }, 300);
  };

  const charCount = value.length;
  const isOverLimit = maxLength ? charCount > maxLength : false;

  return (
    <div className={styles.textInputContainer}>
      <div
        className={`${styles.inputWrapper} ${
          isFocused ? styles.focused : ""
        } ${error ? styles.error : ""} ${disabled ? styles.disabled : ""}`}
      >
        <input
          ref={inputRef}
          type={type}
          value={value}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={styles.input}
          aria-invalid={!!error}
          aria-describedby={error ? "input-error" : undefined}
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
        <div className={styles.errorMessage} id="input-error">
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

      {showSuggestionsList && filteredSuggestions.length > 0 && (
        <div ref={suggestionsRef} className={styles.suggestionsDropdown}>
          <div className={styles.suggestionsHeader}>Suggestions</div>
          <div className={styles.suggestionsList}>
            {filteredSuggestions.map((suggestion, index) => (
              <div
                key={index}
                className={`${styles.suggestionItem} ${
                  index === selectedSuggestionIndex ? styles.selected : ""
                }`}
                onMouseDown={(e) => {
                  e.preventDefault(); // Prevent input from losing focus
                  handleSuggestionClick(suggestion);
                }}
                onMouseEnter={() => setSelectedSuggestionIndex(index)}
              >
                <svg
                  className={styles.suggestionIcon}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
                {suggestion}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

