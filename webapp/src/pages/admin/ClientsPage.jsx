import React from "react";
import { mockClients } from "../../data/mockData";
import { Plus, Search } from "lucide-react";

const ClientsPage = () => {
  const clients = Object.values(mockClients);

  return (
    <div>
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Clients</h1>
          <p className="text-base-content/70 mt-1">
            Manage your client profiles and contact information.
          </p>
        </div>
        <button className="btn btn-primary">
          <Plus size={16} className="mr-2" />
          Add Client
        </button>
      </div>

      {/* Client Table Card */}
      <div className="card bg-base-100 shadow">
        <div className="card-body">
          {/* Search/Filter Controls */}
          <div className="flex justify-end mb-4">
            <div className="form-control">
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Search…"
                  className="input input-bordered"
                />
                <button className="btn btn-square btn-ghost">
                  <Search size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Address</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client, index) => (
                  <tr key={index}>
                    <td>
                      <div className="font-bold">{client.name}</div>
                    </td>
                    <td>{client.address}</td>
                    <td className="text-right">
                      <button className="btn btn-ghost btn-xs">View</button>
                      <button className="btn btn-ghost btn-xs">Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientsPage;
