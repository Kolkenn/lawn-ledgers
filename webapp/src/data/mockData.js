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
  {
    id: 4,
    clientName: "Emily Davis",
    address: "321 Cedar Street",
    date: "2025-09-13",
    status: "scheduled",
  },
  {
    id: 5,
    clientName: "Michael Brown",
    address: "654 Birch Road",
    date: "2025-09-13",
    status: "scheduled",
  },
  {
    id: 6,
    clientName: "Sarah Adams",
    address: "987 Pinecrest Street",
    date: "2025-09-14",
    status: "scheduled",
  },
  {
    id: 7,
    clientName: "David Wilson",
    address: "654 Palm Drive",
    date: "2025-09-14",
    status: "scheduled",
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
  {
    id: 104,
    clientName: "Pinecrest Gardens",
    amount: 800.0,
    dueDate: "2025-09-22",
    status: "Pending",
  },
  {
    id: 105,
    clientName: "Emily Davis",
    amount: 550.0,
    dueDate: "2025-09-10",
    status: "Overdue",
  },
  {
    id: 106,
    clientName: "Bob Johnson",
    amount: 300.0,
    dueDate: "2025-09-25",
    status: "Pending",
  },
  {
    id: 107,
    clientName: "David Wilson",
    amount: 675.0,
    dueDate: "2025-09-18",
    status: "Overdue",
  },
];

export const mockClients = {
  client_1: { name: "John Smith", address: "123 Maple St, Cutler Bay, FL" },
  client_2: { name: "Maria Garcia", address: "456 Oak Ave, Cutler Bay, FL" },
  client_3: {
    name: "Pinecrest Gardens",
    address: "11000 Red Rd, Pinecrest, FL",
  },
  client_4: { name: "Emily Davis", address: "321 Cedar St, Cutler Bay, FL" },
  client_5: { name: "Michael Brown", address: "654 Birch Rd, Cutler Bay, FL" },
  client_6: {
    name: "Sarah Adams",
    address: "987 Pinecrest St, Cutler Bay, FL",
  },
  client_7: { name: "David Wilson", address: "654 Palm Dr, Cutler Bay, FL" },
};

export const mockCrew = {
  crew_1: { name: "Mike Johnson" },
  crew_2: { name: "Sarah Lee" },
  crew_3: { name: "David Chen" },
  crew_4: { name: "Jessica Martinez" },
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
  {
    id: "job_105",
    clientId: "client_4",
    crewId: "crew_3",
    date: "2025-09-27",
    service: "Hedge Trimming",
    status: "scheduled",
  },
  {
    id: "job_106",
    clientId: "client_5",
    crewId: "crew_1",
    date: "2025-09-27",
    service: "Garden Weeding",
    status: "completed",
  },
  {
    id: "job_107",
    clientId: "client_6",
    crewId: "crew_4",
    date: "2025-09-28",
    service: "Landscape Design Consultation",
    status: "completed",
  },
  {
    id: "job_108",
    clientId: "client_7",
    crewId: "crew_3",
    date: "2025-09-28",
    service: "Lawn Aeration",
    status: "scheduled",
  },
];

export const mockTimeLogs = {
  crew_1: [
    { type: "out", timestamp: "2025-09-27T17:30:10" },
    { type: "in", timestamp: "2025-09-27T08:05:45" },
    { type: "in", timestamp: "2025-09-26T08:02:14" },
  ],
  crew_2: [
    { type: "out", timestamp: "2025-09-26T17:05:30" },
    { type: "in", timestamp: "2025-09-26T07:59:51" },
    { type: "out", timestamp: "2025-09-25T17:05:30" },
    { type: "in", timestamp: "2025-09-25T07:59:51" },
  ],
  crew_3: [
    { type: "out", timestamp: "2025-09-28T16:30:00" },
    { type: "in", timestamp: "2025-09-28T08:15:00" },
    { type: "in", timestamp: "2025-09-27T08:15:00" },
  ],
  crew_4: [
    { type: "out", timestamp: "2025-09-28T14:45:00" },
    { type: "in", timestamp: "2025-09-28T09:00:00" },
  ],
};
