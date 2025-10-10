"use client";
import React from "react";
import { useTranslations } from "next-intl";

interface PasswordChecksProps {
  password: string;
}

export default function PasswordChecks({ password }: PasswordChecksProps) {
  const t = useTranslations("register");

  const passwordChecks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*()_+\-={}[\]|:;"'<>,.?/]/.test(password),
  };

  const passedChecks = Object.values(passwordChecks).filter(Boolean).length;
  const passwordStrength = (passedChecks / 5) * 100;

  const renderCheck = (ok: boolean, text: string) => (
    <p
      key={text}
      className={`flex items-center text-sm ${ok ? "text-green-600" : "text-gray-500"}`}
    >
      {ok ? "✔️" : "○"} <span className="ml-2">{text}</span>
    </p>
  );

  const strengthColor =
    passwordStrength < 40
      ? "bg-red-500"
      : passwordStrength < 80
      ? "bg-yellow-500"
      : "bg-green-500";

  return (
    <div className="space-y-2">
      <div className="bg-gray-100 p-3 rounded-lg space-y-1">
        {renderCheck(passwordChecks.uppercase, t("uppercase"))}
        {renderCheck(passwordChecks.lowercase, t("lowercase"))}
        {renderCheck(passwordChecks.number, t("number"))}
        {renderCheck(passwordChecks.special, t("special"))}
        {renderCheck(passwordChecks.length, t("length"))}
      </div>
      <div className="w-full bg-gray-200 h-2 rounded-lg overflow-hidden">
        <div
          className={`${strengthColor} h-2 transition-all duration-300`}
          style={{ width: `${passwordStrength}%` }}
        />
      </div>
    </div>
  );
}
