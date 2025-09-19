import React from "react";

const StarRating = ({ rating }) => {
  const totalStars = 5;
  const stars = [];

  for (let i = 1; i <= totalStars; i++) {
    stars.push(
      <span
        key={i}
        className={i <= rating ? "text-yellow-400" : "text-gray-300"}
      >
        ★
      </span>
    );
  }

  return <div className="flex">{stars}</div>;
};

export default StarRating;
