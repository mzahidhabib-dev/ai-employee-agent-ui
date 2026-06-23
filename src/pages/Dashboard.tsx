import { useState, useEffect } from 'react';
import { Mail, Users, DollarSign, Activity } from 'lucide-react';
import api from '../lib/api';

interface DashboardMetrics {
  emails_processed: number;
  leads_found: number;
  total_cost_usd: number;
}

interface Evaluation {
  id: string;
  accuracy: number;
  faithfulness: number;
  relevancy: number;
  date: string;
}

export default function Dashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [latestEval, setLatestEval] = useState<Evaluation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard/metrics')
      .then(res => setMetrics(res.data))
      .catch(err => console.error("Failed to fetch metrics", err))
      .finally(() => setLoading(false));

    // Hardcoded dummy data for evaluations
    setLatestEval({
      id: "dummy_1",
      accuracy: 92.5,
      faithfulness: 0.94,
      relevancy: 0.96,
      date: new Date().toISOString()
    });
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-slate-800 tracking-tight">System Dashboard</h1>
      
      {loading ? (
        <div className="text-slate-500 animate-pulse">Loading live metrics...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <MetricCard 
            title="Total Emails Processed" 
            value={metrics?.emails_processed || 0} 
            icon={Mail} 
            color="bg-blue-500" 
          />
          <MetricCard 
            title="High-Priority Leads Found" 
            value={metrics?.leads_found || 0} 
            icon={Users} 
            color="bg-emerald-500" 
          />
          <MetricCard 
            title="Total LangGraph Cost" 
            value={`$${(metrics?.total_cost_usd || 0).toFixed(4)}`} 
            icon={DollarSign} 
            color="bg-indigo-500" 
          />
          <MetricCard 
            title="System Accuracy" 
            value={latestEval ? `${latestEval.accuracy}%` : "N/A"} 
            icon={Activity} 
            color="bg-violet-500" 
          />
        </div>
      )}
    </div>
  );
}

function MetricCard({ title, value, icon: Icon, color }: any) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center space-x-4">
      <div className={`p-4 rounded-xl text-white ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
        <p className="text-3xl font-bold text-slate-800 tracking-tight">{value}</p>
      </div>
    </div>
  );
}
