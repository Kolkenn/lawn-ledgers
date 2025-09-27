import React, { useState } from "react";
import { mockTimeLogs } from "../../data/mockData";

// Assume the logged-in crew member has ID 'crew_1'
const CURRENT_CREW_ID = "crew_1";

const TimeclockPage = () => {
  const latestLog = mockTimeLogs[CURRENT_CREW_ID][0];
  const [isClockedIn, setIsClockedIn] = useState(latestLog.type === "in");

  const handleClockIn = () => {
    console.log("Clocking In...");
    setIsClockedIn(true);
  };

  const handleClockOut = () => {
    console.log("Clocking Out...");
    setIsClockedIn(false);
  };

  return (
    <div className="text-center">
      <div className="card bg-base-100 shadow-sm p-6">
        <p className="text-lg font-semibold">Current Status</p>
        <div
          className={`mt-2 flex items-center justify-center gap-2 text-2xl font-bold ${
            isClockedIn ? "text-success" : "text-error"
          }`}
        >
          <div
            className={`h-4 w-4 rounded-full ${
              isClockedIn ? "bg-success" : "bg-error"
            }`}
          ></div>
          {isClockedIn ? "Clocked In" : "Clocked Out"}
        </div>
        <p className="text-xs mt-1">
          Since {new Date(latestLog.timestamp).toLocaleTimeString()}
        </p>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <button
            className="btn btn-success btn-lg"
            onClick={handleClockIn}
            disabled={isClockedIn}
          >
            Clock In
          </button>
          <button
            className="btn btn-error btn-lg"
            onClick={handleClockOut}
            disabled={!isClockedIn}
          >
            Clock Out
          </button>
        </div>
      </div>

      <div className="mt-8 text-left">
        <h3 className="font-bold mb-2">Recent Activity</h3>
        <ul className="space-y-2">
          {mockTimeLogs[CURRENT_CREW_ID].map((log, index) => (
            <li
              key={index}
              className="bg-base-100 p-2 rounded-lg text-sm flex justify-between"
            >
              <span
                className={`font-semibold ${
                  log.type === "in" ? "text-success" : "text-error"
                }`}
              >
                {log.type.toUpperCase()}
              </span>
              <span>{new Date(log.timestamp).toLocaleString()}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TimeclockPage;
