import React from "react";
import { Star } from "lucide-react";

const getRandomRating = () => {
  return Math.random() < 0.5 ? 5 : (Math.random() * 1.5 + 3).toFixed(1);
};

const UserRating = ({ user }) => {
  const rating = parseFloat(getRandomRating()); // Convert string to number

  return (
    <div className="flex items-center justify-evenly p-2 rounded-md w-48 mx-auto">
      <div className="flex gap-1 mt-2">
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            size={20}
            className={index < Math.floor(rating) ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}
          />
        ))}
      </div>
      <span className="font-semibold text-yellow-500 mt-1">{rating.toFixed(1)}</span>
    </div>
  );
};

export default UserRating;
