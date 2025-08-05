import { useState } from "react";
import { useEffect } from "react";

interface Props {
  onRatingChange?: (rating: number) => void;
  initialRating?: number; // Optional initial rating
};

export default function DynamicStars({ onRatingChange, initialRating = 0 }: Props) {
  const [rating, setRating] = useState(0); // Current rating (0 by default)
  
  useEffect(() => {
    setRating(initialRating);
  }, [initialRating]);

  let newRating = initialRating;
  const handleStarClick = (index: number) => {
    newRating = index + 1;
    setRating(newRating);

    if (onRatingChange) {
      onRatingChange(newRating);
    }
  };

  return (
    <div style={{ fontSize: "2rem", cursor: "pointer" }}>
      {[...Array(5)].map((_, index) => (
        <span
          key={index}
          style={{ color: index < rating ? "#FF5A2D" : "gray" }}
          onClick={() => handleStarClick(index)}
        >
          ★
        </span>
      ))}
    </div>
  );
};

