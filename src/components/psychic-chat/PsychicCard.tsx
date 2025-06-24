"use client";

import * as React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

interface PsychicCardProps {
  psychic: {
    id: string;
    name: string;
    image: string;
    specialty: string;
    phrase: string;
    rating: number;
    readings: number;
    status: "Available" | "Busy" | "Meditating";
  };
  onClick: () => void;
  dictionary: Record<string, string>;
}

const PsychicCard: React.FC<PsychicCardProps> = ({ psychic, onClick, dictionary }) => {
  const statusColor =
    psychic.status === "Available"
      ? "text-green-500"
      : psychic.status === "Busy"
      ? "text-yellow-500"
      : "text-blue-500";

  return (
    <motion.div
      className="relative flex flex-col items-center justify-center p-6 bg-gradient-to-br from-purple-900 to-indigo-900 rounded-xl shadow-lg cursor-pointer overflow-hidden group"
      whileHover={{ scale: 1.05, rotateY: 5 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      style={{ perspective: 1000 }}
    >
      <motion.div
        className="absolute inset-0 bg-cover bg-center opacity-30 group-hover:opacity-50 transition-opacity"
        style={{ backgroundImage: "url('/custom_assets/tarot-card-back.png')" }}
        initial={{ opacity: 0.1 }}
        whileHover={{ opacity: 0.5 }}
      ></motion.div>

      <div className="relative z-10 flex flex-col items-center">
        <motion.div
          className="w-24 h-24 rounded-full overflow-hidden border-4 border-yellow-400 mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Image
            src={psychic.image}
            alt={psychic.name}
            width={96}
            height={96}
            className="object-cover"
          />
        </motion.div>

        <h3 className="text-xl font-bold text-white mb-1">{psychic.name}</h3>
        <p className="text-sm text-gray-300 mb-2">
          {dictionary[psychic.specialty] || psychic.specialty}
        </p>

        <motion.p
          className="italic text-yellow-300 text-center mb-4 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          "{dictionary[psychic.phrase] || psychic.phrase}"
        </motion.p>

        <div className="flex items-center text-yellow-400 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={16}
              fill={i < psychic.rating ? "currentColor" : "none"}
              stroke="currentColor"
              className={i < psychic.rating ? "" : "text-gray-400"}
            />
          ))}
          <span className="ml-2 text-white text-sm">
            ({psychic.readings} {dictionary["PsychicCard.readings"] || "readings"})
          </span>
        </div>

        <motion.p
          className={`text-sm font-semibold ${statusColor}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          {dictionary["PsychicCard.status"] || "Status"}: {psychic.status}
        </motion.p>
      </div>
    </motion.div>
  );
};

export default PsychicCard;
