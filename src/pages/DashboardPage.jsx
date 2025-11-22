import { useEffect, useState } from 'react';
import { useEmail } from '../context/EmailContext';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { BarChart3, TrendingUp, Mail, Zap, CheckCircle, AlertCircle } from 'lucide-react';
import './DashboardPage.css';

const DashboardPage = () => {
  const { emails = [] } = useEmail();
  const [stats, setStats] = useState({
    total: 0,
    processed: 0,
    unprocessed: 0,
    categories: {},
    actionItems: 0,
    processingRate: 0
  });

  useEffect(() => {
    calculateStats();
  }, [emails]);

  const calculateStats = () => {
    const total = emails.length;
    const processed = emails.filter(e => e.processed).length;
    const unprocessed = total - processed;

    const categories = {
      Important: emails.filter(e => e.category === 'Important').length,
      'To-Do': emails.filter(e => e.category === 'To-Do').length,
      Newsletter: emails.filter(e => e.category === 'Newsletter').length,
      Spam: emails.filter(e => e.category === 'Spam').length,
      Uncategorized: emails.filter(e => !e.category || e.category === 'Uncategorized').length,
    };

    const actionItems = emails.reduce((count, email) =>
      count + (email.actionItems?.length || 0), 0
    );

    const processingRate = total > 0 ? Math.round((processed / total) * 100) : 0;

    setStats({
      total,
      processed,
      unprocessed,
      categories,
      actionItems,
      processingRate
    });
  };

  const categoryData = [
    { name: 'Important', value: stats.categories.Important || 0, color: '#ef4444' },
    { name: 'To-Do', value: stats.categories['To-Do'] || 0, color: '#3b82f6' },
    { name: 'Newsletter', value: stats.categories.Newsletter || 0, color: '#10b981' },
    { name: 'Spam', value: stats.categories.Spam || 0, color: '#6b7280' },
    { name: 'Uncategorized', value: stats.categories.Uncategorized || 0, color: '#f59e0b' },
  ].filter(item => item.value > 0);

  const processingData = [
    { name: 'Processed', count: stats.processed, fill: '#10b981' },
    { name: 'Unprocessed', count: stats.unprocessed, fill: '#ef4444' },
  ];

  return (
    <div className="dashboard-page">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1>
            <BarChart3 size={32} />
            Dashboard
          </h1>
          <p className="dashboard-subtitle">
            Email analytics and insights
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#dbeafe' }}>
            <Mail size={24} color="#3b82f6" />
          </div>
          <div className="stat-content">
            <span className="stat-label">Total Emails</span>
            <span className="stat-value">{stats.total}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#d1fae5' }}>
            <CheckCircle size={24} color="#10b981" />
          </div>
          <div className="stat-content">
            <span className="stat-label">Processed</span>
            <span className="stat-value">{stats.processed}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#fee2e2' }}>
            <AlertCircle size={24} color="#ef4444" />
          </div>
          <div className="stat-content">
            <span className="stat-label">Unprocessed</span>
            <span className="stat-value">{stats.unprocessed}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#fef3c7' }}>
            <Zap size={24} color="#f59e0b" />
          </div>
          <div className="stat-content">
            <span className="stat-label">Action Items</span>
            <span className="stat-value">{stats.actionItems}</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="progress-card">
        <div className="progress-header">
          <div>
            <h3>Processing Progress</h3>
            <p>{stats.processed} of {stats.total} emails processed</p>
          </div>
          <span className="progress-percentage">{stats.processingRate}%</span>
        </div>
        <div className="progress-bar-container">
          <div 
            className="progress-bar-fill" 
            style={{ width: `${stats.processingRate}%` }}
          ></div>
        </div>
      </div>

      {/* Charts */}
      <div className="charts-grid">
        {/* Category Distribution Pie Chart */}
        <div className="chart-card">
          <h3>
            <TrendingUp size={20} />
            Category Distribution
          </h3>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="chart-empty">
              <p>No data available</p>
            </div>
          )}
        </div>

        {/* Processing Status Bar Chart */}
        <div className="chart-card">
          <h3>
            <BarChart3 size={20} />
            Processing Status
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={processingData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Breakdown Table */}
      <div className="table-card">
        <h3>Category Breakdown</h3>
        <table className="category-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Count</th>
              <th>Percentage</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(stats.categories).map(([category, count]) => {
              const percentage = stats.total > 0 ? ((count / stats.total) * 100).toFixed(1) : 0;
              return (
                <tr key={category}>
                  <td>
                    <span className={`category-badge badge-${category.toLowerCase().replace('-', '').replace(' ', '')}`}>
                      {category}
                    </span>
                  </td>
                  <td className="count-cell">{count}</td>
                  <td className="percentage-cell">{percentage}%</td>
                  <td>
                    <div className="mini-progress">
                      <div 
                        className="mini-progress-fill" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardPage;