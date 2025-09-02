"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { User, Headphones } from "lucide-react";
import { useRouter } from "next/navigation";

const RoleSelect = ({ username, onBack }) => {
  const [selectedRole, setSelectedRole] = useState("");
  const router = useRouter();

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setTimeout(() => {
      if (role === "customer") {
        router.push("/customer");
      } else if (role === "support") {
        router.push("/support");
      }
    }, 500);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  };


  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4"
    >
      <div className="text-center mb-4">
        <p className="text-sm text-gray-600">
          Merhaba <span className="font-medium text-gray-900">{username}</span>
        </p>
      </div>

      <div className="space-y-3">
        <button onClick={() => handleRoleSelect("customer")}
          className={`w-full p-3 border rounded-md text-left transition-all duration-200 ${selectedRole === "customer"
              ? "border-black bg-gray-50"
              : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
            }`}
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 text-sm">Müşteri</h3>
              <p className="text-xs text-gray-600">Destek almak istiyorum</p>
            </div>
          </div>
        </button>

        <button onClick={() => handleRoleSelect("support")}
          className={`w-full p-3 border rounded-md text-left transition-all duration-200 ${selectedRole === "support"
              ? "border-black bg-gray-50"
              : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
            }`}
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
              <Headphones className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 text-sm">Destek</h3>
              <p className="text-xs text-gray-600">Müşterilere yardım etmek istiyorum</p>
            </div>
          </div>
        </button>
      </div>

      <div className="pt-2">
        <button onClick={onBack} className="w-full py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200">
          Geri Dön
        </button>
      </div>
    </motion.div>
  );
};

export default RoleSelect;
