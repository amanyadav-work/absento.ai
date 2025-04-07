import React from 'react';
import { Star, StarHalf, StarOff } from 'lucide-react'; // Import the icons from lucide-react

const StarRating = ({ rating }) => {
  // Ensure rating is within the range of 0 and 5
  const clampedRating = Math.max(0, Math.min(5, rating));

  // Generate an array of 5 stars
  const stars = Array(5).fill(false).map((_, index) => {
    if (clampedRating >= index + 1) {
      return 'full';
    } else if (clampedRating > index && clampedRating < index + 1) {
      return 'half';
    }
    return 'empty';
  });

  return (
    <div className="flex">
      {stars.map((star, index) => {
        if (star === 'full') {
          return <Star size={17} key={index} className="text-yellow-400" />;
        } else if (star === 'half') {
          return <StarHalf size={17} key={index} className="text-yellow-400" />;
        }
        return <StarOff size={17} key={index} className="text-muted-foreground opacity-35" />;
      })}
    </div>
  );
};

export default StarRating;
