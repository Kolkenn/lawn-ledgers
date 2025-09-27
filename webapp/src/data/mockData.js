export const upcomingJobs = [
  {
    id: 1,
    clientName: "Jane Smith",
    address: "456 Oak Avenue",
    date: "2025-09-11",
    status: "scheduled",
  },
  {
    id: 2,
    clientName: "Bob Johnson",
    address: "789 Pine Lane",
    date: "2025-09-12",
    status: "scheduled",
  },
  {
    id: 3,
    clientName: "The Millers",
    address: "101 Elm Court",
    date: "2025-09-12",
    status: "inProgress",
  },
];

export const pendingInvoices = [
  {
    id: 101,
    clientName: "Sam Wilson",
    amount: 450.0,
    dueDate: "2025-09-05",
    status: "Overdue",
  },
  {
    id: 102,
    clientName: "Green Thumb Nursery",
    amount: 1250.5,
    dueDate: "2025-09-15",
    status: "Pending",
  },
  {
    id: 103,
    clientName: "Maria Garcia",
    amount: 275.0,
    dueDate: "2025-09-20",
    status: "Pending",
  },
];

export const mockClients = {
  client_1: { name: "John Smith", address: "123 Maple St, Cutler Bay, FL" },
  client_2: { name: "Maria Garcia", address: "456 Oak Ave, Cutler Bay, FL" },
  client_3: {
    name: "Pinecrest Gardens",
    address: "11000 Red Rd, Pinecrest, FL",
  },
};

export const mockCrew = {
  crew_1: { name: "Mike Johnson" },
  crew_2: { name: "Sarah Lee" },
};

export const mockJobs = [
  {
    id: "job_101",
    clientId: "client_1",
    crewId: "crew_1",
    date: "2025-09-26",
    service: "Weekly Lawn Maintenance",
    status: "completed",
  },
  {
    id: "job_102",
    clientId: "client_2",
    crewId: "crew_1",
    date: "2025-09-26",
    service: "Tree Trimming",
    status: "in_progress",
  },
  {
    id: "job_103",
    clientId: "client_3",
    crewId: "crew_2",
    date: "2025-09-26",
    service: "Garden Weeding & Mulching",
    status: "scheduled",
  },
  {
    id: "job_104",
    clientId: "client_1",
    crewId: "crew_2",
    date: "2025-09-27",
    service: "Sprinkler System Check",
    status: "scheduled",
  },
];

export const mockTimeLogs = {
  crew_1: [{ type: "in", timestamp: "2025-09-26T08:02:14" }],
  crew_2: [
    { type: "out", timestamp: "2025-09-25T17:05:30" },
    { type: "in", timestamp: "2025-09-25T07:59:51" },
  ],
};
