import React from "react";
import { mockJobs, mockClients } from "../../data/mockData";
import { MapPin, CheckCircle, Clock } from "lucide-react";

// Assume the logged-in crew member has ID 'crew_1'
const CURRENT_CREW_ID = "crew_1";

const TodaysJobsPage = () => {
  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  const todaysJobs = mockJobs.filter(
    (job) => job.crewId === CURRENT_CREW_ID && job.date === today
  );

  return (
    <div className="space-y-4">
      {todaysJobs.length > 0 ? (
        todaysJobs.map((job) => {
          const client = mockClients[job.clientId];
          const isCompleted = job.status === "completed";
          return (
            <div
              key={job.id}
              className={`card bg-base-100 shadow-sm ${
                isCompleted ? "opacity-60" : ""
              }`}
            >
              <div className="card-body p-4">
                <div className="flex justify-between items-center">
                  <p className="font-bold">{client.name}</p>
                  {isCompleted ? (
                    <CheckCircle className="text-success" />
                  ) : (
                    <Clock className="text-warning" />
                  )}
                </div>
                <p className="text-sm">{job.service}</p>
                <p className="text-sm text-base-content/70 flex items-center gap-2 mt-2">
                  <MapPin size={14} /> {client.address}
                </p>
                <div className="card-actions justify-end mt-2">
                  <button className="btn btn-sm btn-outline btn-primary">
                    Get Directions
                  </button>
                  {!isCompleted && (
                    <button className="btn btn-sm btn-primary">
                      Start Job
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div className="text-center p-8">
          <p>No jobs scheduled for today.</p>
        </div>
      )}
    </div>
  );
};

export default TodaysJobsPage;
