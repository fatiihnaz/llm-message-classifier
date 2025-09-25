"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import RoleSelect from "./RoleSelect";

const LoginForm = () => {
  const [step, setStep] = useState(1); // 1: username, 2: role selection
  const [username, setUsername] = useState(() => {
    const storageName = typeof window !== "undefined" ? localStorage.getItem("username") : "";
    return storageName || "";
  });

  const handleUsernameSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) {
      setStep(2);
    }
  };

  const handleBackToUsername = () => {
    setStep(1);
  };

  useEffect(() => {
    localStorage.setItem("username", username);
  }, [username]);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" }
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.3 }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <motion.div initial="hidden" animate="visible" variants={containerVariants} className="w-full max-w-sm">
        <div className={`${step === 1 ? "bg-white border border-gray-200 rounded-lg shadow-sm" : ""} p-6`}>
          <div className="text-center mb-6">
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-2xl font-semibold text-gray-900 mb-2"
            >
              {step === 1 ? "Giriş Yap" : "Rol Seçin"}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-sm text-gray-600"
            >
              {step === 1 ? "Kullanıcı adınızı girin" : "Devam etmek için rolünüzü seçin"}
            </motion.p>
          </div>

          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.form
                key="username-form"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onSubmit={handleUsernameSubmit}
                className="space-y-4"
              >
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-900 mb-2">
                    Kullanıcı Adı
                  </label>
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                    placeholder="kullanici@example.com"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-black text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors duration-200"
                >
                  Devam Et
                </button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500">veya</span>
                  </div>
                </div>

                <div className="mt-4">
                  <button
                    className="w-full inline-flex justify-center py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <svg className="w-4 h-4 mt-0.5" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    <span className="ml-2">Google</span>
                  </button>
                </div>
              </motion.form>


            ) : (
              <RoleSelect
                key="role-selection"
                username={username}
                onBack={handleBackToUsername}
              />
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginForm;