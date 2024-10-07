import { forwardRef, InputHTMLAttributes, useEffect, useRef } from "react";
import * as React from "react";

import "./IG_Input.styles.scss";
import { IG_Spinner } from "../spinner/IG_Spinner.component";

export enum InputStateType {
  VERIFIED = "verified",
  LOADING = "loading",
  BLANK = "",
}

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label?: string;
  classes?: string;
  value?: string;
  onInputChange?: (val: string) => void;
  msgType?: "info" | "success" | "error" | "loading" | "verified" | "";
  stateType?:
    | InputStateType.LOADING
    | InputStateType.VERIFIED
    | InputStateType.BLANK;
  infoMsgText?: string;
  suffixText?: string;
  suffixIcon?: string;
  prefixIcon?: string;
  prefixChild?: React.ReactNode;
  prefixCard?: React.ReactNode;
  regex?: any;
  onIconClick?: any;
  ref?: React.RefObject<HTMLInputElement>;
}

const InputComponent = function (
  {
    id,
    label,
    classes = "",
    value,
    placeholder,
    type = "text",
    onInputChange,
    msgType = "",
    infoMsgText,
    suffixText,
    suffixIcon,
    prefixIcon,
    prefixChild,
    disabled,
    autoFocus,
    prefixCard,
    regex,
    onIconClick,
    stateType,
    ...otherProps
  }: InputProps,
  ref
) {
  const inputRef = useRef<HTMLDivElement | null>(null);

  const buildClassList = () => {
    const classArray = ["input"];
    classes && classArray.push(classes);
    msgType && classArray.push(`input--${msgType}`);
    suffixText && classArray.push("input--s-text");
    suffixIcon && classArray.push("input--s-icon");
    prefixIcon && classArray.push("input--p-icon");
    prefixChild && classArray.push("input--p-child");
    prefixCard && classArray.push("input--p-card");
    disabled && classArray.push("input--disabled");
    return classArray.filter(Boolean);
  };

  const handleInputChange = (target: HTMLInputElement) => {
    const newValue = target.value;
    if (regex) {
      const regexRes = regex.test(newValue);
      if (regexRes) {
        onInputChange?.(newValue);
      } else if (!regexRes && newValue !== "") {
        onInputChange?.(value ?? "");
        target.setSelectionRange(target.selectionStart, target.selectionEnd);
      } else onInputChange?.("");
    } else {
      onInputChange?.(newValue);
    }
  };

  const renderIconArray = (condition, className) =>
    condition ? [className] : [];

  const renderSuffixText = (text) => {
    let renderedEl = <></>;
    if (text) {
      renderedEl = <span className="suffix-text">{suffixText}</span>;
    }
    return renderedEl;
  };

  const noop = () => {
    // This is intentional
  };

  const classList = buildClassList();
  if (msgType) {
    otherProps["aria-describedby"] = `${id}-${msgType}`;
  }

  useEffect(() => {
    const inputEl = inputRef.current?.getElementsByTagName("input")[0];
    inputEl?.addEventListener("focus", () => {
      inputRef.current?.classList.add("input--focused");
    });
    inputEl?.addEventListener("blur", () => {
      inputRef.current?.classList.remove("input--focused");
    });
  }, []);

  return (
    <div className={`${classList.join(" ")}`} ref={inputRef}>
      {label && (
        <label htmlFor={id} className="label-class">
          {label}
        </label>
      )}
      <div className="input__wrapper">
        {renderIconArray(prefixIcon, "p-icon").map((iconClass, index) => (
          <span key={`p-icon-${index}`} className={iconClass}></span>
        ))}
        {renderIconArray(prefixChild, "prefix").map((iconClass, index) => (
          <div key={`prefix-1-${index}`} className={iconClass}>
            {prefixChild}
          </div>
        ))}
        {renderIconArray(prefixCard, "prefix").map((iconClass, index) => (
          <div key={`prefix-2-${index}`} className={iconClass}>
            {prefixCard}
          </div>
        ))}
        <input
          id={id}
          data-testid={`INPT`}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => handleInputChange(e.target)}
          disabled={disabled}
          autoFocus={autoFocus}
          autoComplete="off"
          ref={ref}
          {...otherProps}
        />
        {msgType === "error" && (
          <span
            className={`s-icon-error ${suffixIcon ?? suffixText ? "mr-3" : ""}`}
          ></span>
        )}
        {(msgType === "loading" || stateType === InputStateType.LOADING) && (
          <div className="indicator">
            <IG_Spinner size={"sm"} />
          </div>
        )}

        {suffixIcon && (
          <span
            className={`s-icon ${suffixText ? "mr-3.5" : ""}`}
            onPointerDown={
              !disabled
                ? (event) => {
                    onIconClick(event);
                  }
                : noop
            }
            onPointerUp={
              !disabled
                ? (event) => {
                    onIconClick(event);
                  }
                : noop
            }
            // intentionall on mouse leave state is clear bug
            // onMouseLeave={(event) => {
            //   onIconClick(event);
            // }}
          ></span>
        )}
        {renderSuffixText(suffixText)}
      </div>
      {msgType && (
        <span
          className="input__additional-text block m-text-md-regular pt-1.5"
          id={`${id}-${msgType}`}
        >
          {infoMsgText}
        </span>
      )}
    </div>
  );
};

export const IG_Input = forwardRef<HTMLInputElement, InputProps>(
  InputComponent
);
IG_Input.displayName = "IG_Input";
