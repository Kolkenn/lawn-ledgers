import React from "react";
import { pendingInvoices } from "../../data/mockData";
import { Plus, Search } from "lucide-react";

const InvoicesPage = () => {
  // Combine with other invoice data as needed
  const allInvoices = [...pendingInvoices];

  const getStatusBadge = (status) => {
    switch (status) {
      case "Paid":
        return "badge-success";
      case "Pending":
        return "badge-warning";
      case "Overdue":
        return "badge-error";
      default:
        return "badge-ghost";
    }
  };

  return (
    <div>
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Invoices</h1>
          <p className="text-base-content/70 mt-1">
            Create, send, and track all your client invoices.
          </p>
        </div>
        <button className="btn btn-primary">
          <Plus size={16} className="mr-2" />
          Create Invoice
        </button>
      </div>

      {/* Invoices Table Card */}
      <div className="card bg-base-100 shadow">
        <div className="card-body">
          {/* Filter/Search Controls */}
          <div className="flex justify-end mb-4">
            <div className="form-control">
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Search by client..."
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
                  <th>Client</th>
                  <th>Due Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {allInvoices.map((invoice) => (
                  <tr key={invoice.id}>
                    <td>
                      <div className="font-bold">{invoice.clientName}</div>
                    </td>
                    <td>{invoice.dueDate}</td>
                    <td>${invoice.amount.toFixed(2)}</td>
                    <td>
                      <div
                        className={`badge ${getStatusBadge(invoice.status)}`}
                      >
                        {invoice.status}
                      </div>
                    </td>
                    <td className="text-right">
                      <button className="btn btn-ghost btn-xs">View</button>
                      <button className="btn btn-ghost btn-xs">
                        Send Reminder
                      </button>
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

export default InvoicesPage;
