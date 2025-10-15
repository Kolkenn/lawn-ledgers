import { useTranslation } from "react-i18next";
import { upcomingJobs, pendingInvoices } from "../../data/mockData";
import { CalendarClock, FileText, HandCoins } from "lucide-react";

const DashboardPage = () => {
  const { t } = useTranslation();

  const totalPendingAmount = pendingInvoices.reduce(
    (sum, invoice) => sum + invoice.amount,
    0
  );

  return (
    <div className="space-y-6">
      {/* DaisyUI Stats Component */}
      <div className="stats bg-base-100 shadow-lg w-full">
        <div className="stat">
          <div className="stat-figure text-primary">
            <CalendarClock size={32} />
          </div>
          <div className="stat-title">{t("dashboard.upcomingJobs")}</div>
          <div className="stat-value">{upcomingJobs.length}</div>
        </div>

        <div className="stat">
          <div className="stat-figure text-info">
            <FileText size={32} />
          </div>
          <div className="stat-title">{t("dashboard.pendingInvoices")}</div>
          <div className="stat-value">{pendingInvoices.length}</div>
        </div>

        <div className="stat">
          <div className="stat-figure text-success">
            <HandCoins size={32} />
          </div>
          <div className="stat-title">{t("dashboard.totalPending")}</div>
          <div className="stat-value">{`$${totalPendingAmount.toFixed(
            2
          )}`}</div>
        </div>
      </div>

      {/* Upcoming Jobs & Pending Invoices Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Jobs List */}
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h2 className="card-title">{t("dashboard.upcomingJobs")}</h2>
            <div className="space-y-3 mt-4">
              {upcomingJobs.map((job) => (
                <div
                  key={job.id}
                  className="flex items-center justify-between p-3 bg-base-200 rounded-lg"
                >
                  <div>
                    <p className="font-semibold">{job.clientName}</p>
                    <p className="text-sm text-base-content/70">
                      {job.address}
                    </p>
                  </div>
                  <div
                    className={`badge ${
                      job.status === "inProgress" ? "badge-info" : "badge-ghost"
                    }`}
                  >
                    {t(`dashboard.jobStatuses.${job.status}`)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pending Invoices List */}
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h2 className="card-title">{t("dashboard.pendingInvoices")}</h2>
            <div className="space-y-3 mt-4">
              {pendingInvoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="flex items-center justify-between p-3 bg-base-200 rounded-lg"
                >
                  <div>
                    <p className="font-semibold">{invoice.clientName}</p>
                    <p className="text-sm text-base-content/70">
                      Due: {invoice.dueDate}
                    </p>
                  </div>
                  <div
                    className={`badge ${
                      invoice.status === "Overdue"
                        ? "badge-error"
                        : "badge-warning"
                    }`}
                  >
                    ${invoice.amount.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
