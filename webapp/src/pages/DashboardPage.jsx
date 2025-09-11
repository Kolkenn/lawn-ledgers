import { useTranslation } from 'react-i18next';
import { upcomingJobs, pendingInvoices } from '../data/mockData';
import { CalendarClock, FileText, HandCoins } from 'lucide-react';

const StatCard = ({ title, value, icon }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm flex items-center space-x-4">
    <div className="bg-green-100 text-green-700 p-3 rounded-full">
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-500 font-medium">{title}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  </div>
);

const DashboardPage = ({ companyProfile }) => {
  const { t } = useTranslation();

  const totalPendingAmount = pendingInvoices.reduce((sum, invoice) => sum + invoice.amount, 0);

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-8">
      {/* Stat Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard 
          title={t('dashboard.upcomingJobs')}
          value={upcomingJobs.length} 
          icon={<CalendarClock />} 
        />
        <StatCard 
          title={t('dashboard.pendingInvoices')} 
          value={pendingInvoices.length} 
          icon={<FileText />} 
        />
        <StatCard 
          title={t('dashboard.totalPending')}
          value={`$${totalPendingAmount.toFixed(2)}`}
          icon={<HandCoins />}
        />
      </div>

      {/* Upcoming Jobs & Pending Invoices Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Jobs List */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold text-gray-800 mb-4">{t('dashboard.upcomingJobs')}</h2>
          <ul className="space-y-4">
            {upcomingJobs.map(job => (
              <li key={job.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                <div>
                  <p className="font-semibold text-gray-900">{job.clientName}</p>
                  <p className="text-sm text-gray-500">{job.address}</p>
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${job.status === 'inProgress' ? 'bg-blue-100 text-blue-800' : 'bg-gray-200 text-gray-800'}`}>
                  {t(`jobStatuses.${job.status}`)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Pending Invoices List */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold text-gray-800 mb-4">{t('dashboard.pendingInvoices')} </h2>
          <ul className="space-y-4">
            {pendingInvoices.map(invoice => (
              <li key={invoice.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                <div>
                  <p className="font-semibold text-gray-900">{invoice.clientName}</p>
                  <p className="text-sm text-gray-500">Due: {invoice.dueDate}</p>
                </div>
                <span className={`text-sm font-bold px-3 py-1 rounded-full ${invoice.status === 'Overdue' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  ${invoice.amount.toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;