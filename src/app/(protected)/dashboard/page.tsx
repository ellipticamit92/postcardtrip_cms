import React from "react";
//import { getTodayDetails } from "@/lib/helper";

export default function DashboardPage() {
  // const { day, date, year, month } = getTodayDetails();
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative mt-16 px-10">
      <div className="flex flex-col gap-4">
        <div
          className="flex w-full items-center px-6 h-22 justify-between bg-no-repeat bg-[position:top_right] shadow-md rounded-sm relative bg-white"
          style={{ backgroundImage: "url(/bggreen.png)" }}
        >
          <div className="">
            <h2 className="text-xl text-postcard-green font-semibold">
              Good Morning
            </h2>
            <h3 className="font-bold text-md">Postcard Trip</h3>
          </div>
          <div className="flex flex-col text-white text-center"></div>
        </div>
      </div>
    </div>
  );
}
