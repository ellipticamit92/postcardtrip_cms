"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import clsx from "clsx";

interface StarRatingProps {
  value?: number;
  onChange?: (value: number) => void;
  maxStars?: number;
  size?: number;
  disabled?: boolean;
  label: string;
}

export function StarRating({
  value = 0,
  onChange,
  maxStars = 5,
  size = 24,
  disabled = false,
  label,
}: StarRatingProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  return (
    <div className="flex gap-1 flex-col">
      {label && (
        <label className="text-sm font-medium text-gray-700">{label}</label>
      )}

      <div>
        {Array.from({ length: maxStars }, (_, i) => {
          const starValue = i + 1;
          const isFilled =
            hoverValue !== null ? starValue <= hoverValue : starValue <= value;

          return (
            <button
              key={starValue}
              type="button"
              onClick={() => !disabled && onChange?.(starValue)}
              onMouseEnter={() => !disabled && setHoverValue(starValue)}
              onMouseLeave={() => !disabled && setHoverValue(null)}
              className="focus:outline-none"
            >
              <Star
                size={size}
                className={clsx(
                  "transition-colors",
                  isFilled ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                )}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
