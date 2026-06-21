import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../lib/api';

interface BillingLog {
  id: string;
  email_id: string;
  node: string;
  tokens: number;
  cost: number;
  date: string;
}

export default function Billing() {
  const [logs, setLogs] = useState<BillingLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/billing/usage')
      .then(res => setLogs(res.data.data))
      .catch(err => console.error("Failed to fetch billing", err))
      .finally(() => setLoading(false));
  }, []);

  // Aggregate cost by node for the chart
  const nodeCosts = logs.reduce((acc, log) => {
    acc[log.node] = (acc[log.node] || 0) + log.cost;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(nodeCosts).map(([name, cost]) => ({
    name: name.toUpperCase(),
    cost: Number(cost.toFixed(4))
  }));

  const totalSpend = logs.reduce((sum, log) => sum + log.cost, 0);

  const exportToCSV = () => {
    if (logs.length === 0) return;
    const headers = ['Timestamp', 'Target Node', 'Tokens Used', 'Calculated Cost (USD)'];
    const csvContent = [
      headers.join(','),
      ...logs.map(log => 
        `"${new Date(log.date).toLocaleString()}","${log.node}",${log.tokens},${log.cost.toFixed(5)}`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `billing_invoice_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Client Billing</h1>
      
      {loading ? (
        <div className="text-slate-500 animate-pulse">Loading billing data...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Summary Card */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 lg:col-span-1 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Total Accumulated Spend</h3>
              <p className="text-4xl font-bold text-indigo-600 mb-2">${totalSpend.toFixed(4)}</p>
              <p className="text-sm text-slate-500 mb-6">Based on Gemini 1.5 Flash token rates</p>
            </div>
            <button 
              onClick={exportToCSV}
              className="w-full py-2.5 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors font-medium"
            >
              Export CSV Invoice
            </button>
          </div>

          {/* Chart */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 lg:col-span-2">
            <h3 className="text-lg font-semibold text-slate-800 mb-6">Spend by LangGraph Node</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} tickFormatter={(val) => `$${val}`} />
                  <Tooltip 
                    cursor={{fill: '#f1f5f9'}}
                    contentStyle={{borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                  />
                  <Bar dataKey="cost" fill="#4f46e5" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden lg:col-span-3 mt-2">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-800 font-medium">
                <tr>
                  <th className="px-6 py-4">Timestamp</th>
                  <th className="px-6 py-4">Target Node</th>
                  <th className="px-6 py-4">Tokens Used</th>
                  <th className="px-6 py-4 text-right">Calculated Cost (USD)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {logs.length === 0 && (
                  <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-500">No usage recorded.</td></tr>
                )}
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">{new Date(log.date).toLocaleString()}</td>
                    <td className="px-6 py-4 font-medium text-slate-700">{log.node}</td>
                    <td className="px-6 py-4">{log.tokens.toLocaleString()}</td>
                    <td className="px-6 py-4 font-mono text-right">${log.cost.toFixed(5)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
