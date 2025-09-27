import React from "react";
import { mockJobs, mockClients, mockCrew } from "../../data/mockData";
import { Calendar, User, MapPin } from "lucide-react";

// A small component to render the status badge
const StatusBadge = ({ status }) => {
  const statusStyles = {
    scheduled: "badge-info",
    in_progress: "badge-warning",
    completed: "badge-success",
  };
  return (
    <div className={`badge ${statusStyles[status]}`}>
      {status.replace("_", " ")}
    </div>
  );
};

const SchedulePage = () => {
  // Group jobs by date for the schedule view
  const jobsByDate = mockJobs.reduce((acc, job) => {
    const date = job.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(job);
    return acc;
  }, {});

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Company Schedule</h1>
      <div className="space-y-8">
        {Object.entries(jobsByDate).map(([date, jobs]) => (
          <div key={date}>
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
              <Calendar size={20} />
              {new Date(date + "T00:00:00").toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {jobs.map((job) => {
                const client = mockClients[job.clientId];
                const crew = mockCrew[job.crewId];
                return (
                  <div key={job.id} className="card bg-base-100 shadow">
                    <div className="card-body p-4">
                      <div className="flex justify-between items-start">
                        <h3 className="card-title text-base">{job.service}</h3>
                        <StatusBadge status={job.status} />
                      </div>
                      <p className="text-sm text-base-content/70 mt-2 flex items-center gap-2">
                        <MapPin size={14} /> {client.name} - {client.address}
                      </p>
                      <p className="text-sm text-base-content/70 mt-1 flex items-center gap-2">
                        <User size={14} /> Assigned to: {crew.name}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SchedulePage;
