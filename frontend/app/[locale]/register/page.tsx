"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import CustomSnackbar from "@/components/CustomSnackbar";

interface InputFieldProps {
  type: string;
  placeholderKey: string;
  value: string;
  onChange: (val: string) => void;
  required?: boolean;
  showToggle?: boolean;
  locale: string;
}

const InputField: React.FC<InputFieldProps> = ({
  type,
  placeholderKey,
  value,
  onChange,
  required = false,
  showToggle = false,
  locale,
}) => {
  const t = useTranslations("register");
  const [visible, setVisible] = useState(false);

  return (
    <div className="flex flex-col w-full relative">
      <label htmlFor={placeholderKey} className="mb-1 font-medium text-gray-700 dark:text-gray-200">
        {t(placeholderKey)}
      </label>
      <input
        id={placeholderKey}                   // ← تم الإضافة
        name={placeholderKey}                 // ← تم الإضافة
        type={showToggle ? (visible ? "text" : "password") : type}
        placeholder={t(placeholderKey)}
	autoComplete={
  	placeholderKey === "email" ? "email":
	placeholderKey === "password" || placeholderKey === "confirm"? "new-password":
	placeholderKey === "oldPassword"? "current-password": "name"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition shadow-sm hover:shadow-md placeholder-black dark:placeholder-gray-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 w-full"
      />
      {showToggle && (
        <button
          type="button"
          className={`absolute top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-300 ${
            locale === "ar" ? "left-4" : "right-4"
          }`}
          onClick={() => setVisible(prev => !prev)}
        >
          {visible ? "🙈" : "👁️"}
        </button>
      )}
    </div>
  );
};

interface SnackbarState {
  message: string;
  type: "success" | "error";
}

export default function RegisterPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale ?? "ar"; // fallback
  const t = useTranslations("register");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<SnackbarState | null>(null);

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const passwordChecks = {
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*()_+\-={}[\]|:;"'<>,.?/]/.test(password),
    length: password.length >= 8,
  };
  const passedChecks = Object.values(passwordChecks).filter(Boolean).length;
  const passwordStrength = (passedChecks / 5) * 100;
  const strengthColor =
    passwordStrength < 40
      ? "bg-red-500"
      : passwordStrength < 80
      ? "bg-yellow-500"
      : "bg-green-500";

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSnackbar(null);

    if (!isValidEmail(email)) {
      setSnackbar({ message: `${t("error")} ${t("email")}`, type: "error" });
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setSnackbar({ message: `${t("error")} ${t("passwords_mismatch")}`, type: "error" });
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_AUTH_API}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, confirmPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setSnackbar({ message: t("success"), type: "success" });

      setTimeout(() => router.replace(`/${locale}/login`), 1500);
    } catch (err: any) {
      setSnackbar({ message: `${t("error")} ${err.message}`, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const renderCheck = (condition: boolean, labelKey: string) => (
    <div className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-200">
      <span>{condition ? "✅" : "❌"}</span>
      <span>{t(labelKey)}</span>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-900 dark:to-gray-800 p-4">
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md sm:max-w-lg lg:max-w-2xl p-6 sm:p-8 lg:p-10 rounded-3xl shadow-2xl bg-white dark:bg-gray-800"
      >
     {/* اللوجو مع الدوران */}
     <div className="flex justify-center mb-6">
       <div className="relative w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32">
         {/* البوردر الدائري المتدرج */}
         <div className="absolute inset-0 rounded-full border-4 border-t-blue-500 border-r-transparent border-b-blue-400 border-l-transparent animate-spin-slow"></div>
         {/* الصورة نفسها */}
         <div className="absolute inset-1/4 sm:inset-1/5 lg:inset-1/6 rounded-full overflow-hidden flex items-center justify-center bg-white dark:bg-gray-800">
           <img src="/logo.png" alt="Logo" className="h-full w-full object-contain" />
         </div>
       </div>
     </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-center mb-6 text-gray-900 dark:text-gray-100">
          {t("title")}
        </h2>

        <form onSubmit={handleRegister} className="space-y-6 sm:space-y-8">
          <InputField type="text" placeholderKey="name" locale={locale} value={name} onChange={setName} required />
          <InputField type="email" placeholderKey="email" locale={locale} value={email} onChange={setEmail} required />
          <InputField type="password" placeholderKey="password" locale={locale} value={password} onChange={setPassword} required showToggle />
          <InputField type="password" placeholderKey="confirm" locale={locale}  value={confirmPassword} onChange={setConfirmPassword} required showToggle />

          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl space-y-2 sm:space-y-3 shadow-inner">
            {renderCheck(passwordChecks.uppercase, "uppercase")}
            {renderCheck(passwordChecks.lowercase, "lowercase")}
            {renderCheck(passwordChecks.number, "number")}
            {renderCheck(passwordChecks.special, "special")}
            {renderCheck(passwordChecks.length, "length")}
          </div>

          <div className="w-full bg-gray-200 dark:bg-gray-600 h-3 rounded-xl overflow-hidden">
            <div className={`${strengthColor} h-3 transition-all duration-300`} style={{ width: `${passwordStrength}%` }} />
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center mt-4">
            <motion.button
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={loading || passedChecks < 5 || password !== confirmPassword}
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white py-3 sm:py-4 rounded-2xl font-semibold shadow-lg disabled:opacity-50 transition mb-3 sm:mb-0"
            >
              {loading ? t("loading") : t("submit")}
            </motion.button>

            <motion.button
              type="button"
              onClick={() => router.replace(`/${locale}/login`)}
              className="w-full sm:w-auto sm:ml-4 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-gray-100 py-3 sm:py-4 rounded-2xl font-semibold shadow-lg hover:shadow-md transition"
            >
              {t("already_have_account")}
            </motion.button>
          </div>
        </form>
      </motion.div>

      {snackbar && (
        <CustomSnackbar
          items={[{ id: Date.now(), message: snackbar.message, type: snackbar.type }]}
          onRemove={() => setSnackbar(null)}
        />
      )}
    </div>
  );
}



/*


"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import CustomSnackbar from "@/components/CustomSnackbar";

interface InputFieldProps {
  type: string;
  placeholderKey: string;
  value: string;
  onChange: (val: string) => void;
  required?: boolean;
  showToggle?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  type,
  placeholderKey,
  value,
  onChange,
  required = false,
  showToggle = false,
}) => {
  const t = useTranslations("register");
  const [visible, setVisible] = useState(false);

  return (
    <div className="flex flex-col w-full relative">
      <label className="mb-1 font-medium text-gray-700 dark:text-gray-200">
        {t(placeholderKey)}
      </label>
      <input
        type={showToggle ? (visible ? "text" : "password") : type}
        placeholder={t(placeholderKey)}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition shadow-sm hover:shadow-md placeholder-black dark:placeholder-gray-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 w-full"
      />
      {showToggle && (
        <button
          type="button"
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-300"
          onClick={() => setVisible((prev) => !prev)}
        >
          {visible ? "🙈" : "👁️"}
        </button>
      )}
    </div>
  );
};

interface SnackbarState {
  message: string;
  type: "success" | "error";
}

export default function RegisterPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale ?? "en"; // fallback
  const t = useTranslations("register");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<SnackbarState | null>(null);

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const passwordChecks = {
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*()_+\-={}[\]|:;"'<>,.?/]/.test(password),
    length: password.length >= 8,
  };
  const passedChecks = Object.values(passwordChecks).filter(Boolean).length;
  const passwordStrength = (passedChecks / 5) * 100;
  const strengthColor =
    passwordStrength < 40
      ? "bg-red-500"
      : passwordStrength < 80
      ? "bg-yellow-500"
      : "bg-green-500";

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSnackbar(null);

    if (!isValidEmail(email)) {
      setSnackbar({ message: `${t("error")} ${t("email")}`, type: "error" });
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setSnackbar({ message: `${t("error")} ${t("passwords_mismatch")}`, type: "error" });
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, confirmPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setSnackbar({ message: t("success"), type: "success" });

      setTimeout(() => router.push(`/${locale}/login`), 1500); // تحويل بعد النجاح فقط
    } catch (err: any) {
      setSnackbar({ message: `${t("error")} ${err.message}`, type: "error" });
    } finally {
      setLoading(false);
    }
  };
  const renderCheck = (condition: boolean, labelKey: string) => (
    <div className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-200">
      <span>{condition ? "✅" : "❌"}</span>
      <span>{t(labelKey)}</span>
    </div>
  );
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-900 dark:to-gray-800 p-4">
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md sm:max-w-lg lg:max-w-2xl p-6 sm:p-8 lg:p-10 rounded-3xl shadow-2xl bg-white dark:bg-gray-800"
      >
        <div className="flex justify-center mb-6">
          <img src="/logo.png" alt="Logo" className="h-14 sm:h-16 lg:h-20" />
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-center mb-6 text-gray-900 dark:text-gray-100">
          {t("title")}
        </h2>

        <form onSubmit={handleRegister} className="space-y-6 sm:space-y-8">
          <InputField type="text" placeholderKey="name" value={name} onChange={setName} required />
          <InputField type="email" placeholderKey="email" value={email} onChange={setEmail} required />
          <InputField type="password" placeholderKey="password" value={password} onChange={setPassword} required showToggle />
          <InputField type="password" placeholderKey="confirm" value={confirmPassword} onChange={setConfirmPassword} required showToggle />

          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl space-y-2 sm:space-y-3 shadow-inner">
            {renderCheck(passwordChecks.uppercase, "uppercase")}
            {renderCheck(passwordChecks.lowercase, "lowercase")}
            {renderCheck(passwordChecks.number, "number")}
            {renderCheck(passwordChecks.special, "special")}
            {renderCheck(passwordChecks.length, "length")}
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-600 h-3 rounded-xl overflow-hidden">
            <div className={`${strengthColor} h-3 transition-all duration-300`} style={{ width: `${passwordStrength}%` }} />
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center mt-4">
            <motion.button
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={loading || passedChecks < 5 || password !== confirmPassword}
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white py-3 sm:py-4 rounded-2xl font-semibold shadow-lg disabled:opacity-50 transition mb-3 sm:mb-0"
            >
              {loading ? t("loading") : t("submit")}
            </motion.button>

            <motion.button
              type="button"
              onClick={() => router.push(`/${locale}/login`)}
              className="w-full sm:w-auto sm:ml-4 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-gray-100 py-3 sm:py-4 rounded-2xl font-semibold shadow-lg hover:shadow-md transition"
            >
              {t("already_have_account")}
            </motion.button>
          </div>
        </form>
      </motion.div>

      {snackbar && (
        <CustomSnackbar
          items={[{ id: Date.now(), message: snackbar.message, type: snackbar.type }]}
          onRemove={() => setSnackbar(null)}
        />
      )}
    </div>
  );
}

*/

/*

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import CustomSnackbar from "@/components/CustomSnackbar";

interface InputFieldProps {
  type: string;
  placeholderKey: string;
  value: string;
  onChange: (val: string) => void;
  required?: boolean;
  showToggle?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  type,
  placeholderKey,
  value,
  onChange,
  required = false,
  showToggle = false,
}) => {
  const t = useTranslations("register");
  const [visible, setVisible] = useState(false);

  return (
    <div className="flex flex-col w-full relative">
      <label className="mb-1 font-medium text-gray-700 dark:text-gray-200">
        {t(placeholderKey)}
      </label>
      <input
        type={showToggle ? (visible ? "text" : "password") : type}
        placeholder={t(placeholderKey)}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition shadow-sm hover:shadow-md placeholder-black dark:placeholder-gray-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 w-full"
      />
      {showToggle && (
        <button
          type="button"
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-300"
          onClick={() => setVisible((prev) => !prev)}
        >
          {visible ? "🙈" : "👁️"}
        </button>
      )}
    </div>
  );
};

interface SnackbarState {
  id: number;
  message: string;
  type: "success" | "error";
}

interface RegisterPageProps {
  locale: string;
}

export default function RegisterPage({ locale }: RegisterPageProps) {
  const router = useRouter();
  const t = useTranslations("register");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbarItems, setSnackbarItems] = useState<SnackbarState[]>([]);

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const passwordChecks = {
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*()_+\-={}[\]|:;"'<>,.?/]/.test(password),
    length: password.length >= 8,
  };

  const passedChecks = Object.values(passwordChecks).filter(Boolean).length;
  const passwordStrength = (passedChecks / 5) * 100;
  const strengthColor =
    passwordStrength < 40
      ? "bg-red-500"
      : passwordStrength < 80
      ? "bg-yellow-500"
      : "bg-green-500";

  const addSnackbar = (message: string, type: "success" | "error") => {
    setSnackbarItems((prev) => [...prev, { id: Date.now(), message, type }]);
  };

  const removeSnackbar = (id: number) => {
    setSnackbarItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!isValidEmail(email)) {
      addSnackbar(`${t("error")} ${t("email")}`, "error");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      addSnackbar(`${t("error")} ${t("passwords_mismatch")}`, "error");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, confirmPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      addSnackbar(t("success"), "success");

      setTimeout(() => router.push(`/${locale}/login`), 1500);
    } catch (err: any) {
      addSnackbar(`${t("error")} ${err.message}`, "error");
    } finally {
      setLoading(false);
    }
  };

  const renderCheck = (condition: boolean, labelKey: string) => (
    <div className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-200">
      <span>{condition ? "✅" : "❌"}</span>
      <span>{t(labelKey)}</span>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-900 dark:to-gray-800 p-4">
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md sm:max-w-lg lg:max-w-2xl p-6 sm:p-8 lg:p-10 rounded-3xl shadow-2xl bg-white dark:bg-gray-800"
      >
        <div className="flex justify-center mb-6">
          <img src="/logo.png" alt="Logo" className="h-14 sm:h-16 lg:h-20" />
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-center mb-6 text-gray-900 dark:text-gray-100">
          {t("title")}
        </h2>

        <form onSubmit={handleRegister} className="space-y-6 sm:space-y-8">
          <InputField type="text" placeholderKey="name" value={name} onChange={setName} required />
          <InputField type="email" placeholderKey="email" value={email} onChange={setEmail} required />
          <InputField type="password" placeholderKey="password" value={password} onChange={setPassword} required showToggle />
          <InputField type="password" placeholderKey="confirm" value={confirmPassword} onChange={setConfirmPassword} required showToggle />

          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl space-y-2 sm:space-y-3 shadow-inner">
            {renderCheck(passwordChecks.uppercase, "uppercase")}
            {renderCheck(passwordChecks.lowercase, "lowercase")}
            {renderCheck(passwordChecks.number, "number")}
            {renderCheck(passwordChecks.special, "special")}
            {renderCheck(passwordChecks.length, "length")}
          </div>

          <div className="w-full bg-gray-200 dark:bg-gray-600 h-3 rounded-xl overflow-hidden">
            <div className={`${strengthColor} h-3 transition-all duration-300`} style={{ width: `${passwordStrength}%` }} />
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center mt-4">
            <motion.button
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={loading || passedChecks < 5 || password !== confirmPassword}
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white py-3 sm:py-4 rounded-2xl font-semibold shadow-lg disabled:opacity-50 transition mb-3 sm:mb-0"
            >
              {loading ? t("loading") : t("submit")}
            </motion.button>

            <motion.button
              type="button"
              onClick={() => router.push(`/${locale}/login`)}
              className="w-full sm:w-auto sm:ml-4 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-gray-100 py-3 sm:py-4 rounded-2xl font-semibold shadow-lg hover:shadow-md transition"
            >
              {t("already_have_account")}
            </motion.button>
          </div>
        </form>
      </motion.div>

      {snackbarItems.length > 0 && (
        <CustomSnackbar items={snackbarItems} onRemove={removeSnackbar} />
      )}
    </div>
  );
}


*/

/*

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import CustomSnackbar from "@/components/CustomSnackbar";

interface InputFieldProps {
  type: string;
  placeholderKey: string;
  value: string;
  onChange: (val: string) => void;
  required?: boolean;
  showToggle?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  type,
  placeholderKey,
  value,
  onChange,
  required = false,
  showToggle = false,
}) => {
  const t = useTranslations("register");
  const [visible, setVisible] = useState(false);

  return (
    <div className="flex flex-col w-full relative">
      <label className="mb-1 font-medium text-gray-700 dark:text-gray-200">
        {t(placeholderKey)}
      </label>
      <input
        type={showToggle ? (visible ? "text" : "password") : type}
        placeholder={t(placeholderKey)}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition shadow-sm hover:shadow-md placeholder-black dark:placeholder-gray-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 w-full"
      />
      {showToggle && (
        <button
          type="button"
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-300"
          onClick={() => setVisible((prev) => !prev)}
        >
          {visible ? "🙈" : "👁️"}
        </button>
      )}
    </div>
  );
};

interface SnackbarState {
  message: string;
  type: "success" | "error";
}

interface RegisterPageProps {
  locale: string;
}

export default function RegisterPage({ locale }: RegisterPageProps) {
  const router = useRouter();
  const t = useTranslations("register");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<SnackbarState | null>(null);

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const passwordChecks = {
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*()_+\-={}[\]|:;"'<>,.?/]/.test(password),
    length: password.length >= 8,
  };
  const passedChecks = Object.values(passwordChecks).filter(Boolean).length;
  const passwordStrength = (passedChecks / 5) * 100;
  const strengthColor =
    passwordStrength < 40
      ? "bg-red-500"
      : passwordStrength < 80
      ? "bg-yellow-500"
      : "bg-green-500";

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSnackbar(null);

    if (!isValidEmail(email)) {
      setSnackbar({ message: `${t("error")} ${t("email")}`, type: "error" });
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setSnackbar({ message: `${t("error")} ${t("passwords_mismatch")}`, type: "error" });
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, confirmPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setSnackbar({ message: t("success"), type: "success" });

      // توجيه حسب اللغة
      setTimeout(() => router.push(`/${locale}/login`), 1500);
    } catch (err: any) {
      setSnackbar({ message: `${t("error")} ${err.message}`, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const renderCheck = (condition: boolean, labelKey: string) => (
    <div className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-200">
      <span>{condition ? "✅" : "❌"}</span>
      <span>{t(labelKey)}</span>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-900 dark:to-gray-800 p-4">
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md sm:max-w-lg lg:max-w-2xl p-6 sm:p-8 lg:p-10 rounded-3xl shadow-2xl bg-white dark:bg-gray-800"
      >
        <div className="flex justify-center mb-6">
          <img src="/logo.png" alt="Logo" className="h-14 sm:h-16 lg:h-20" />
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-center mb-6 text-gray-900 dark:text-gray-100">
          {t("title")}
        </h2>

        <form onSubmit={handleRegister} className="space-y-6 sm:space-y-8">
          <InputField type="text" placeholderKey="name" value={name} onChange={setName} required />
          <InputField type="email" placeholderKey="email" value={email} onChange={setEmail} required />
          <InputField type="password" placeholderKey="password" value={password} onChange={setPassword} required showToggle />
          <InputField type="password" placeholderKey="confirm" value={confirmPassword} onChange={setConfirmPassword} required showToggle />

          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl space-y-2 sm:space-y-3 shadow-inner">
            {renderCheck(passwordChecks.uppercase, "uppercase")}
            {renderCheck(passwordChecks.lowercase, "lowercase")}
            {renderCheck(passwordChecks.number, "number")}
            {renderCheck(passwordChecks.special, "special")}
            {renderCheck(passwordChecks.length, "length")}
          </div>

          <div className="w-full bg-gray-200 dark:bg-gray-600 h-3 rounded-xl overflow-hidden">
            <div className={`${strengthColor} h-3 transition-all duration-300`} style={{ width: `${passwordStrength}%` }} />
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center mt-4">
            <motion.button
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={loading || passedChecks < 5 || password !== confirmPassword}
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white py-3 sm:py-4 rounded-2xl font-semibold shadow-lg disabled:opacity-50 transition mb-3 sm:mb-0"
            >
              {loading ? t("loading") : t("submit")}
            </motion.button>

            <motion.button
              type="button"
              onClick={() => router.push(`/${locale}/login`)}
              className="w-full sm:w-auto sm:ml-4 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-gray-100 py-3 sm:py-4 rounded-2xl font-semibold shadow-lg hover:shadow-md transition"
            >
              {t("already_have_account")}
            </motion.button>
          </div>
        </form>
      </motion.div>

      {snackbar && (
        <CustomSnackbar
          message={snackbar.message}
          type={snackbar.type}
          onClose={() => setSnackbar(null)}
        />
      )}
    </div>
  );
}


*/

/*


"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import CustomSnackbar from "@/components/CustomSnackbar";

interface InputFieldProps {
  type: string;
  placeholderKey: string;
  value: string;
  onChange: (val: string) => void;
  required?: boolean;
  showToggle?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  type,
  placeholderKey,
  value,
  onChange,
  required = false,
  showToggle = false,
}) => {
  const t = useTranslations("register");
  const [visible, setVisible] = useState(false);
  const inputType = showToggle ? (visible ? "text" : "password") : type;

  return (
    <div className="flex flex-col w-full relative">
      <label className="mb-1 font-medium text-gray-700 dark:text-gray-200">{t(placeholderKey)}</label>
      <input
        type={inputType}
        placeholder={t(placeholderKey)}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition shadow-sm hover:shadow-md placeholder-black dark:placeholder-gray-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 w-full"
      />
      {showToggle && (
        <button
          type="button"
          onClick={() => setVisible((prev) => !prev)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-300"
        >
          {visible ? "🙈" : "👁️"}
        </button>
      )}
    </div>
  );
};

export default function RegisterPage({ locale }: { locale: string }) {
  const router = useRouter();
  const t = useTranslations("register");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const passwordChecks = {
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*()_+\-={}[\]|:;"'<>,.?/]/.test(password),
    length: password.length >= 8,
  };

  const passedChecks = Object.values(passwordChecks).filter(Boolean).length;
  const passwordStrength = (passedChecks / 5) * 100;
  const strengthColor =
    passwordStrength < 40 ? "bg-red-500" : passwordStrength < 80 ? "bg-yellow-500" : "bg-green-500";

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSnackbar(null);

    if (!isValidEmail(email)) {
      setSnackbar({ message: `${t("error")} ${t("email")} invalid`, type: "error" });
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setSnackbar({ message: `${t("error")} ${t("passwords_mismatch")}`, type: "error" });
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, confirmPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setSnackbar({ message: t("success"), type: "success" });
      setTimeout(() => router.push(`/${locale}/login`), 1500);
    } catch (err: any) {
      setSnackbar({ message: `${t("error")} ${err.message}`, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const renderCheck = (condition: boolean, labelKey: string) => (
    <div className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-200">
      <span>{condition ? "✅" : "❌"}</span>
      <span>{t(labelKey)}</span>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-900 dark:to-gray-800 p-4">
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md sm:max-w-lg lg:max-w-2xl p-6 sm:p-8 lg:p-10 rounded-3xl shadow-2xl bg-white dark:bg-gray-800"
      >
        <div className="flex justify-center mb-6">
          <img src="/logo.png" alt="Logo" className="h-14 sm:h-16 lg:h-20" />
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-center mb-6 text-gray-900 dark:text-gray-100">
          {t("title")}
        </h2>

        <form onSubmit={handleRegister} className="space-y-6 sm:space-y-8">
          <InputField type="text" placeholderKey="name" value={name} onChange={setName} required />
          <InputField type="email" placeholderKey="email" value={email} onChange={setEmail} required />
          <InputField type="password" placeholderKey="password" value={password} onChange={setPassword} required showToggle />
          <InputField type="password" placeholderKey="confirm" value={confirmPassword} onChange={setConfirmPassword} required showToggle />

          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl space-y-2 sm:space-y-3 shadow-inner">
            {renderCheck(passwordChecks.uppercase, "uppercase")}
            {renderCheck(passwordChecks.lowercase, "lowercase")}
            {renderCheck(passwordChecks.number, "number")}
            {renderCheck(passwordChecks.special, "special")}
            {renderCheck(passwordChecks.length, "length")}
          </div>

          <div className="w-full bg-gray-200 dark:bg-gray-600 h-3 rounded-xl overflow-hidden">
            <div
              className={`${strengthColor} h-3 transition-all duration-300`}
              style={{ width: `${passwordStrength}%` }}
            />
          </div>

          <motion.button
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={loading || passedChecks < 5 || password !== confirmPassword}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white py-3 sm:py-4 rounded-2xl font-semibold shadow-lg disabled:opacity-50 transition"
          >
            {loading ? t("loading") : t("submit")}
          </motion.button>
        </form>
      </motion.div>

      {snackbar && (
        <CustomSnackbar
          message={snackbar.message}
          type={snackbar.type}
          onClose={() => setSnackbar(null)}
        />
      )}
    </div>
  );
}

*/

/*


"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import CustomSnackbar from "@/components/CustomSnackbar";

interface InputFieldProps {
  type: string;
  placeholderKey: string;
  value: string;
  onChange: (val: string) => void;
  required?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  type,
  placeholderKey,
  value,
  onChange,
  required = false,
}) => {
  const t = useTranslations("register");
  return (
    <div className="flex flex-col w-full">
      <label className="mb-1 font-medium text-gray-700 dark:text-gray-200">{t(placeholderKey)}</label>
      <input
        type={type}
        placeholder={t(placeholderKey)}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="px-4 
py-3 
border border-gray-300 
dark:border-gray-600 
rounded-2xl focus:ring-2 
focus:ring-blue-500 
focus:outline-none 
transition shadow-sm hover:shadow-md placeholder-black dark:placeholder-gray-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 w-full"
      />
    </div>
  );
};

export default function RegisterPage() {
  const router = useRouter();
  const t = useTranslations("register");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const passwordChecks = {
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*()_+\-={}[\]|:;"'<>,.?/]/.test(password),
    length: password.length >= 8,
  };
  const passedChecks = Object.values(passwordChecks).filter(Boolean).length;
  const passwordStrength = (passedChecks / 5) * 100;
  const strengthColor =
    passwordStrength < 40
      ? "bg-red-500"
      : passwordStrength < 80
      ? "bg-yellow-500"
      : "bg-green-500";

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSnackbar(null);

    if (!isValidEmail(email)) {
      setSnackbar({ message: `${t("error")} ${t("email")} invalid`, type: "error" });
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setSnackbar({ message: `${t("error")} ${t("passwords_mismatch")}`, type: "error" });
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, confirmPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setSnackbar({ message: t("success"), type: "success" });
      setTimeout(() => router.push("/login"), 1500);
    } catch (err: any) {
      setSnackbar({ message: `${t("error")} ${err.message}`, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const renderCheck = (condition: boolean, labelKey: string) => (
    <div className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-200">
      <span>{condition ? "✅" : "❌"}</span>
      <span>{t(labelKey)}</span>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-900 dark:to-gray-800 p-4">
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md sm:max-w-lg lg:max-w-2xl p-6 sm:p-8 lg:p-10 rounded-3xl shadow-2xl bg-white dark:bg-gray-800"
      >
        <div className="flex justify-center mb-6">
          <img src="/logo.png" alt="Logo" className="h-14 sm:h-16 lg:h-20" />
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-center mb-6 text-gray-900 dark:text-gray-100">
          {t("title")}
        </h2>

        <form onSubmit={handleRegister} className="space-y-6 sm:space-y-8">
          <InputField type="text" placeholderKey="name" value={name} onChange={setName} required />
          <InputField type="email" placeholderKey="email" value={email} onChange={setEmail} required />
          <InputField type="password" placeholderKey="password" value={password} onChange={setPassword} required />

          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl space-y-2 sm:space-y-3 shadow-inner">
            {renderCheck(passwordChecks.uppercase, "uppercase")}
            {renderCheck(passwordChecks.lowercase, "lowercase")}
            {renderCheck(passwordChecks.number, "number")}
            {renderCheck(passwordChecks.special, "special")}
            {renderCheck(passwordChecks.length, "length")}
          </div>

          <div className="w-full bg-gray-200 dark:bg-gray-600 h-3 rounded-xl overflow-hidden">
            <div
              className={`${strengthColor} h-3 transition-all duration-300`}
              style={{ width: `${passwordStrength}%` }}
            />
          </div>

          <InputField type="password" placeholderKey="confirm" value={confirmPassword} onChange={setConfirmPassword} required />

          <motion.button
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={loading || passedChecks < 5 || password !== confirmPassword}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white py-3 sm:py-4 rounded-2xl font-semibold shadow-lg disabled:opacity-50 transition"
          >
            {loading ? t("loading") : t("submit")}
          </motion.button>
        </form>
      </motion.div>

      {snackbar && (
        <CustomSnackbar
          message={snackbar.message}
          type={snackbar.type}
          onClose={() => setSnackbar(null)}
        />
      )}
    </div>
  );
}

*/

/*

"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import CustomSnackbar from "@/components/CustomSnackbar";

interface InputFieldProps {
  type: string;
  placeholderKey: string;
  value: string;
  onChange: (val: string) => void;
  required?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  type,
  placeholderKey,
  value,
  onChange,
  required = false,
}) => {
  const t = useTranslations("register");
  return (
    <div className="flex flex-col w-full">
      <label className="mb-1 font-medium text-gray-700 dark:text-gray-200">{t(placeholderKey)}</label>
      <input
        type={type}
        placeholder={t(placeholderKey)}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition shadow-sm hover:shadow-md placeholder-black dark:placeholder-gray-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 w-full"
      />
    </div>
  );
};

export default function RegisterPage() {
  const router = useRouter();
  const t = useTranslations("register");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Dark/Light mode state
  const [darkMode, setDarkMode] = useState<boolean>(false);
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const passwordChecks = {
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*()_+\-={}[\]|:;"'<>,.?/]/.test(password),
    length: password.length >= 8,
  };
  const passedChecks = Object.values(passwordChecks).filter(Boolean).length;
  const passwordStrength = (passedChecks / 5) * 100;
  const strengthColor =
    passwordStrength < 40
      ? "bg-red-500"
      : passwordStrength < 80
      ? "bg-yellow-500"
      : "bg-green-500";

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSnackbar(null);

    if (!isValidEmail(email)) {
      setSnackbar({ message: `${t("error")} ${t("email")} invalid`, type: "error" });
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setSnackbar({ message: `${t("error")} ${t("passwords_mismatch")}`, type: "error" });
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, confirmPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setSnackbar({ message: t("success"), type: "success" });
      setTimeout(() => router.push("/login"), 1500);
    } catch (err: any) {
      setSnackbar({ message: `${t("error")} ${err.message}`, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const renderCheck = (condition: boolean, labelKey: string) => (
    <div className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-200">
      <span>{condition ? "✅" : "❌"}</span>
      <span>{t(labelKey)}</span>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-900 dark:to-gray-800 p-4">
      {/* Dark/Light Toggle *}
      <button
        onClick={toggleDarkMode}
        className="mb-4 px-4 py-2 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow hover:shadow-md transition"
      >
        {darkMode ? "🌙 Dark Mode" : "☀️ Light Mode"}
      </button>

      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md sm:max-w-lg lg:max-w-2xl p-6 sm:p-8 lg:p-10 rounded-3xl shadow-2xl bg-white dark:bg-gray-800"
      >
        {/* Logo *}
        <div className="flex justify-center mb-6">
          <img src="/logo.png" alt="Logo" className="h-14 sm:h-16 lg:h-20" />
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-center mb-6 text-gray-900 dark:text-gray-100">
          {t("title")}
        </h2>

        <form onSubmit={handleRegister} className="space-y-6 sm:space-y-8">
          <InputField type="text" placeholderKey="name" value={name} onChange={setName} required />
          <InputField type="email" placeholderKey="email" value={email} onChange={setEmail} required />
          <InputField type="password" placeholderKey="password" value={password} onChange={setPassword} required />

          {/* Password Checks *}
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl space-y-2 sm:space-y-3 shadow-inner">
            {renderCheck(passwordChecks.uppercase, "uppercase")}
            {renderCheck(passwordChecks.lowercase, "lowercase")}
            {renderCheck(passwordChecks.number, "number")}
            {renderCheck(passwordChecks.special, "special")}
            {renderCheck(passwordChecks.length, "length")}
          </div>

          {/* Password Strength *}
          <div className="w-full bg-gray-200 dark:bg-gray-600 h-3 rounded-xl overflow-hidden">
            <div
              className={`${strengthColor} h-3 transition-all duration-300`}
              style={{ width: `${passwordStrength}%` }}
            />
          </div>

          <InputField type="password" placeholderKey="confirm" value={confirmPassword} onChange={setConfirmPassword} required />

          {/* Submit Button *}
          <motion.button
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={loading || passedChecks < 5 || password !== confirmPassword}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white py-3 sm:py-4 rounded-2xl font-semibold shadow-lg disabled:opacity-50 transition"
          >
            {loading ? t("loading") : t("submit")}
          </motion.button>
        </form>
      </motion.div>

      {snackbar && (
        <CustomSnackbar
          message={snackbar.message}
          type={snackbar.type}
          onClose={() => setSnackbar(null)}
        />
      )}
    </div>
  );
}



*/



/*

"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import CustomSnackbar from "@/components/CustomSnackbar";

interface InputFieldProps {
  type: string;
  placeholderKey: string;
  value: string;
  onChange: (val: string) => void;
  required?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  type,
  placeholderKey,
  value,
  onChange,
  required = false,
}) => {
  const t = useTranslations("register");
  return (
    <div className="flex flex-col w-full">
      <label className="mb-1 font-medium text-gray-700 dark:text-gray-200">{t(placeholderKey)}</label>
      <input
        type={type}
        placeholder={t(placeholderKey)}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition shadow-sm hover:shadow-md placeholder-black dark:placeholder-gray-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 w-full"
      />
    </div>
  );
};

export default function RegisterPage() {
  const router = useRouter();
  const t = useTranslations("register");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const passwordChecks = {
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*()_+\-={}[\]|:;"'<>,.?/]/.test(password),
    length: password.length >= 8,
  };
  const passedChecks = Object.values(passwordChecks).filter(Boolean).length;
  const passwordStrength = (passedChecks / 5) * 100;
  const strengthColor =
    passwordStrength < 40
      ? "bg-red-500"
      : passwordStrength < 80
      ? "bg-yellow-500"
      : "bg-green-500";

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSnackbar(null);

    if (!isValidEmail(email)) {
      setSnackbar({ message: `${t("error")} ${t("email")} invalid`, type: "error" });
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setSnackbar({ message: `${t("error")} ${t("passwords_mismatch")}`, type: "error" });
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, confirmPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setSnackbar({ message: t("success"), type: "success" });
      setTimeout(() => router.push("/login"), 1500);
    } catch (err: any) {
      setSnackbar({ message: `${t("error")} ${err.message}`, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const renderCheck = (condition: boolean, labelKey: string) => (
    <div className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-200">
      <span>{condition ? "✅" : "❌"}</span>
      <span>{t(labelKey)}</span>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-900 dark:to-gray-800 p-4">
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md sm:max-w-lg lg:max-w-2xl p-6 sm:p-8 lg:p-10 rounded-3xl shadow-2xl bg-white dark:bg-gray-800"
      >
        {/* Logo *}
        <div className="flex justify-center mb-6">
          <img src="/logo.png" alt="Logo" className="h-14 sm:h-16 lg:h-20" />
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-center mb-6 text-gray-900 dark:text-gray-100">
          {t("title")}
        </h2>

        <form onSubmit={handleRegister} className="space-y-6 sm:space-y-8">
          <InputField type="text" placeholderKey="name" value={name} onChange={setName} required />
          <InputField type="email" placeholderKey="email" value={email} onChange={setEmail} required />
          <InputField type="password" placeholderKey="password" value={password} onChange={setPassword} required />

          {/* Password Checks *}
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl space-y-2 sm:space-y-3 shadow-inner">
            {renderCheck(passwordChecks.uppercase, "uppercase")}
            {renderCheck(passwordChecks.lowercase, "lowercase")}
            {renderCheck(passwordChecks.number, "number")}
            {renderCheck(passwordChecks.special, "special")}
            {renderCheck(passwordChecks.length, "length")}
          </div>

          {/* Password Strength *}
          <div className="w-full bg-gray-200 dark:bg-gray-600 h-3 rounded-xl overflow-hidden">
            <div
              className={`${strengthColor} h-3 transition-all duration-300`}
              style={{ width: `${passwordStrength}%` }}
            />
          </div>

          <InputField type="password" placeholderKey="confirm" value={confirmPassword} onChange={setConfirmPassword} required />

          {/* Submit Button *}
          <motion.button
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={loading || passedChecks < 5 || password !== confirmPassword}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white py-3 sm:py-4 rounded-2xl font-semibold shadow-lg disabled:opacity-50 transition"
          >
            {loading ? t("loading") : t("submit")}
          </motion.button>
        </form>
      </motion.div>

      {snackbar && (
        <CustomSnackbar
          message={snackbar.message}
          type={snackbar.type}
          onClose={() => setSnackbar(null)}
        />
      )}
    </div>
  );
}

*/

/*

"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import CustomSnackbar from "@/components/CustomSnackbar";

interface InputFieldProps {
  type: string;
  placeholderKey: string;
  value: string;
  onChange: (val: string) => void;
  required?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  type,
  placeholderKey,
  value,
  onChange,
  required = false,
}) => {
  const t = useTranslations("register");
  return (
    <div className="flex flex-col">
      <label className="mb-1 font-medium text-gray-700 dark:text-gray-200">{t(placeholderKey)}</label>
      <input
        type={type}
        placeholder={t(placeholderKey)}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition shadow-sm hover:shadow-md placeholder-black dark:placeholder-gray-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 w-full"
      />
    </div>
  );
};

export default function RegisterPage() {
  const router = useRouter();
  const t = useTranslations("register");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const passwordChecks = {
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*()_+\-={}[\]|:;"'<>,.?/]/.test(password),
    length: password.length >= 8,
  };
  const passedChecks = Object.values(passwordChecks).filter(Boolean).length;
  const passwordStrength = (passedChecks / 5) * 100;
  const strengthColor =
    passwordStrength < 40
      ? "bg-red-500"
      : passwordStrength < 80
      ? "bg-yellow-500"
      : "bg-green-500";

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSnackbar(null);

    if (!isValidEmail(email)) {
      setSnackbar({ message: `${t("error")} ${t("email")} invalid`, type: "error" });
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setSnackbar({ message: `${t("error")} ${t("passwords_mismatch")}`, type: "error" });
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, confirmPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setSnackbar({ message: t("success"), type: "success" });
      setTimeout(() => router.push("/login"), 1500);
    } catch (err: any) {
      setSnackbar({ message: `${t("error")} ${err.message}`, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const renderCheck = (condition: boolean, labelKey: string) => (
    <div className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-200">
      <span>{condition ? "✅" : "❌"}</span>
      <span>{t(labelKey)}</span>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-900 dark:to-gray-800 p-4">
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md sm:max-w-lg lg:max-w-xl p-6 sm:p-8 rounded-3xl shadow-2xl bg-white dark:bg-gray-800"
      >
        {/* Logo *}
        <div className="flex justify-center mb-6">
          <img src="/logo.png" alt="Logo" className="h-14" />
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-center mb-6 text-gray-900 dark:text-gray-100">
          {t("title")}
        </h2>

        <form onSubmit={handleRegister} className="space-y-6 sm:space-y-8">
          <InputField type="text" placeholderKey="name" value={name} onChange={setName} required />
          <InputField type="email" placeholderKey="email" value={email} onChange={setEmail} required />
          <InputField type="password" placeholderKey="password" value={password} onChange={setPassword} required />

          {/* Password Checks *}
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl space-y-2 sm:space-y-3 shadow-inner">
            {renderCheck(passwordChecks.uppercase, "uppercase")}
            {renderCheck(passwordChecks.lowercase, "lowercase")}
            {renderCheck(passwordChecks.number, "number")}
            {renderCheck(passwordChecks.special, "special")}
            {renderCheck(passwordChecks.length, "length")}
          </div>

          {/* Password Strength *}
          <div className="w-full bg-gray-200 dark:bg-gray-600 h-3 rounded-xl overflow-hidden">
            <div
              className={`${strengthColor} h-3 transition-all duration-300`}
              style={{ width: `${passwordStrength}%` }}
            />
          </div>

          <InputField type="password" placeholderKey="confirm" value={confirmPassword} onChange={setConfirmPassword} required />

          {/* Submit Button *}
          <motion.button
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={loading || passedChecks < 5 || password !== confirmPassword}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white py-3 sm:py-4 rounded-2xl font-semibold shadow-lg disabled:opacity-50 transition"
          >
            {loading ? t("loading") : t("submit")}
          </motion.button>
        </form>
      </motion.div>

      {snackbar && (
        <CustomSnackbar
          message={snackbar.message}
          type={snackbar.type}
          onClose={() => setSnackbar(null)}
        />
      )}
    </div>
  );
}

*/

/*

"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import CustomSnackbar from "@/components/CustomSnackbar";

export default function RegisterPage() {
  const router = useRouter();
  const t = useTranslations("register");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const passwordChecks = {
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*()_+\-={}[\]|:;"'<>,.?/]/.test(password),
    length: password.length >= 8,
  };
  const passedChecks = Object.values(passwordChecks).filter(Boolean).length;
  const passwordStrength = (passedChecks / 5) * 100;
  const strengthColor =
    passwordStrength < 40
      ? "bg-red-500"
      : passwordStrength < 80
      ? "bg-yellow-500"
      : "bg-green-500";

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSnackbar(null);

    if (!isValidEmail(email)) {
      setSnackbar({ message: `${t("error")} ${t("email")} invalid`, type: "error" });
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setSnackbar({ message: `${t("error")} Passwords do not match`, type: "error" });
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, confirmPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setSnackbar({ message: t("success"), type: "success" });
      setTimeout(() => router.push("/login"), 1500);
    } catch (err: any) {
      setSnackbar({ message: `${t("error")} ${err.message}`, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const renderCheck = (condition: boolean, label: string) => (
    <div className="flex items-center space-x-2 text-sm text-gray-700">
      <span>{condition ? "✅" : "❌"}</span>
      <span>{label}</span>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300 p-4">
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8"
      >
        {/* Logo *}
        <div className="flex justify-center mb-6">
          <img src="/logo.png" alt="Logo" className="h-14" />
        </div>

        <h2 className="text-3xl font-extrabold text-center mb-6">{t("title")}</h2>

        <form onSubmit={handleRegister} className="space-y-6">
          {/* Name /}
          <div className="flex flex-col">
            <label className="mb-1 font-medium text-gray-700">{t("name")}</label>
            <input
              type="text"
              placeholder={t("name")}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="px-4 py-3 border border-gray-900 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition shadow-sm hover:shadow-md"
            />
          </div>

          {/* Email *}
          <div className="flex flex-col">
            <label className="mb-1 font-medium text-gray-700">{t("email")}</label>
            <input
              type="email"
              placeholder={t("email")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="px-4 py-3 border border-gray-900 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition shadow-sm hover:shadow-md"
            />
          </div>

          {/* Password *}
          <div className="flex flex-col">
            <label className="mb-1 font-medium text-gray-700">{t("password")}</label>
            <input
              type="password"
              placeholder={t("password")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="px-4 py-3 border border-gray-900 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition shadow-sm hover:shadow-md"
            />
          </div>

          {/* Password Checks *}
          <div className="bg-gray-50 p-4 rounded-xl space-y-2 shadow-inner">
            {renderCheck(passwordChecks.uppercase, t("uppercase"))}
            {renderCheck(passwordChecks.lowercase, t("lowercase"))}
            {renderCheck(passwordChecks.number, t("number"))}
            {renderCheck(passwordChecks.special, t("special"))}
            {renderCheck(passwordChecks.length, t("length"))}
          </div>

          {/* Password Strength *}
          <div className="w-full bg-gray-200 h-3 rounded-xl overflow-hidden">
            <div
              className={`${strengthColor} h-3 transition-all duration-300`}
              style={{ width: `${passwordStrength}%` }}
            />
          </div>

          {/* Confirm Password *}
          <div className="flex flex-col">
            <label className="mb-1 font-medium text-gray-700">{t("confirm")}</label>
            <input
              type="password"
              placeholder={t("confirm")}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition shadow-sm hover:shadow-md"
            />
          </div>

          {/* Submit Button *}
          <motion.button
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={loading || passedChecks < 5 || password !== confirmPassword}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white py-3 rounded-xl font-semibold shadow-lg disabled:opacity-50 transition"
          >
            {loading ? t("loading") : t("submit")}
          </motion.button>
        </form>
      </motion.div>

      {snackbar && (
        <CustomSnackbar
          message={snackbar.message}
          type={snackbar.type}
          onClose={() => setSnackbar(null)}
        />
      )}
    </div>
  );
}

*/

/*

"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import CustomSnackbar from "@/components/CustomSnackbar";
import { motion } from "framer-motion";

export default function RegisterPage() {
  const router = useRouter();
  const t = useTranslations("register");

  // ✅ الـ States
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // ✅ التحقق من البريد الإلكتروني
  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // ✅ شروط الباسورد
  const passwordChecks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*()_+\-={}[\]|:;"'<>,.?/]/.test(password),
  };
  const passedChecks = Object.values(passwordChecks).filter(Boolean).length;

  // ✅ قوة الباسورد
  const passwordStrength = (passedChecks / 5) * 100;
  const strengthColor =
    passwordStrength < 40
      ? "bg-red-500"
      : passwordStrength < 80
      ? "bg-yellow-500"
      : "bg-green-500";

  // ✅ إرسال البيانات للباك إند
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSnackbar(null);

    // تحقق سريع قبل الطلب
    if (!isValidEmail(email)) {
      setSnackbar({ message: "❌ البريد الإلكتروني غير صالح", type: "error" });
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setSnackbar({ message: "❌ كلمة المرور غير متطابقة", type: "error" });
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, confirmPassword }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setSnackbar({ message: "✅ تم التسجيل بنجاح!", type: "success" });

      setTimeout(() => router.push("/login"), 1500);
    } catch (err: any) {
      setSnackbar({ message: `❌ ${err.message}`, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  // ✅ renderCheck function
  const renderCheck = (condition: boolean, label: string) => (
    <div className="flex items-center space-x-2 text-sm">
      <span>{condition ? "✅" : "❌"}</span>
      <span>{label}</span>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-white rounded-xl shadow-lg border border-gray-200 p-8"
      >
        {/* لوجو صغير *}
        <div className="flex justify-center mb-4">
          <img src="/logo.png" alt="Logo" className="h-10" />
        </div>

        <h2 className="text-2xl font-bold text-center mb-6">
          📝 {t("title") || "إنشاء حساب"}
        </h2>

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            placeholder={t("name") || "الاسم"}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoFocus
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />

          <input
            type="email"
            placeholder={t("email") || "البريد الإلكتروني"}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />

          <input
            type="password"
            placeholder={t("password") || "كلمة المرور"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />

          {/* ✅ تحقق الباسورد *}
          <div className="bg-gray-50 p-3 rounded-lg space-y-1">
            {renderCheck(passwordChecks.uppercase, "حرف كبير")}
            {renderCheck(passwordChecks.lowercase, "حرف صغير")}
            {renderCheck(passwordChecks.number, "رقم")}
            {renderCheck(passwordChecks.special, "رمز خاص")}
            {renderCheck(passwordChecks.length, "٨ أحرف على الأقل")}
          </div>

          {/* ✅ مؤشر قوة الباسورد *}
          <div className="w-full bg-gray-200 h-2 rounded-lg overflow-hidden">
            <div
              className={`${strengthColor} h-2 transition-all duration-300`}
              style={{ width: `${passwordStrength}%` }}
            />
          </div>

          <input
            type="password"
            placeholder={t("confirm") || "تأكيد كلمة المرور"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />

          <motion.button
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={loading || passedChecks < 5 || password !== confirmPassword}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-semibold shadow-md disabled:opacity-50 transition"
          >
            {loading ? "جارٍ التسجيل..." : "إنشاء الحساب"}
          </motion.button>
        </form>
      </motion.div>

      {snackbar && (
        <CustomSnackbar
          message={snackbar.message}
          type={snackbar.type}
          onClose={() => setSnackbar(null)}
        />
      )}
    </div>
  );
}

*/

/*

"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import CustomSnackbar from "@/components/CustomSnackbar";

export default function RegisterPage() {
  const router = useRouter();
  const t = useTranslations("register");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [snackbar, setSnackbar] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // ✅ شروط الباسورد
  const passwordChecks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*()_+\-={}[\]|:;"'<>,.?/]/.test(password),
  };
  const passedChecks = Object.values(passwordChecks).filter(Boolean).length;

  // ✅ قوة الباسورد
  const passwordStrength = (passedChecks / 5) * 100;
  const strengthColor =
    passwordStrength < 40 ? "bg-red-500" : passwordStrength < 80 ? "bg-yellow-500" : "bg-green-500";

  // ✅ renderCheck function
  const renderCheck = (condition: boolean, label: string) => (
    <div className="flex items-center space-x-2 text-sm">
      <span>{condition ? "✅" : "❌"}</span>
      <span>{label}</span>
    </div>
  );

  // ✅ إرسال البيانات للباك إند
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSnackbar(null);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, confirmPassword }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setSnackbar({ message: t("success"), type: "success" });
      setTimeout(() => router.push("/login"), 1500);
    } catch (err: any) {
      setSnackbar({ message: `${t("error")} ${err.message}`, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-white/95 rounded-2xl shadow-2xl p-8"
      >
        <h2 className="text-2xl font-bold text-center mb-6">📝 {t("title")}</h2>
        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            placeholder={t("name")}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoFocus
            className="w-full px-4 py-2 border rounded-lg"
          />
          <input
            type="email"
            placeholder={t("email")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg"
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder={t("password")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 right-2 flex items-center text-sm"
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>

          {/* ✅ تحقق الباسورد *}
          <div className="bg-gray-100 p-3 rounded-lg space-y-1">
            {renderCheck(passwordChecks.uppercase, t("uppercase"))}
            {renderCheck(passwordChecks.lowercase, t("lowercase"))}
            {renderCheck(passwordChecks.number, t("number"))}
            {renderCheck(passwordChecks.special, t("special"))}
            {renderCheck(passwordChecks.length, t("length"))}
          </div>

          {/* ✅ مؤشر قوة الباسورد *}
          <div className="w-full bg-gray-200 h-2 rounded-lg overflow-hidden">
            <div
              className={`${strengthColor} h-2 transition-all duration-300`}
              style={{ width: `${passwordStrength}%` }}
            />
          </div>

          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder={t("confirm")}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute inset-y-0 right-2 flex items-center text-sm"
            >
              {showConfirmPassword ? "🙈" : "👁️"}
            </button>
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={loading || passedChecks < 5 || password !== confirmPassword}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2.5 rounded-lg font-semibold shadow-md disabled:opacity-50"
          >
            {loading ? t("loading") : t("submit")}
          </motion.button>
        </form>
      </motion.div>

      {snackbar && (
        <CustomSnackbar
          message={snackbar.message}
          type={snackbar.type}
          onClose={() => setSnackbar(null)}
        />
      )}
    </div>
  );
}

*/
