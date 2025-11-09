import React from "react";

interface TodayFocusData {
  today?: {
    hours?: number;
    minutes?: number;
  };
}

interface TodayFocusCardProps {
  data?: TodayFocusData;
}

export function TodayFocusCard({ data }: TodayFocusCardProps) {
  const hours = data?.today?.hours ?? 0;
  const minutes = data?.today?.minutes ?? 0;

  return (
    <div className="p-6 bg-white rounded-md shadow-md dark:bg-gray-800">
      <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
        Today's Focus Time
      </h2>
      <p className="text-5xl font-bold text-slate-900 dark:text-white">
        {hours}
        <span className="text-3xl ml-3">h</span> {minutes}
        <span className="text-3xl ml-1">m</span>
      </p>
    </div>
  );
}
