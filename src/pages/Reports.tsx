import { useState, useEffect } from 'react';
import { FileText } from 'lucide-react';
import api from '../lib/api';

interface Report {
  id: string;
  text: string;
  date: string;
}

export default function Reports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/reports/daily')
      .then(res => setReports(res.data.data))
      .catch(err => console.error("Failed to fetch reports", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Agent Reports</h1>
      
      {loading ? (
        <div className="text-slate-500 animate-pulse">Loading reports...</div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {reports.length === 0 && (
            <div className="bg-white p-6 rounded-xl border border-slate-200 text-center text-slate-500">
              No daily reports generated yet.
            </div>
          )}
          {reports.map((report) => (
            <div key={report.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <div className="flex items-center space-x-3 mb-4 border-b border-slate-100 pb-4">
                <div className="p-2 bg-indigo-50 rounded-lg">
                  <FileText className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">Daily CrewAI Summary</h3>
                  <p className="text-sm text-slate-500">{new Date(report.date).toLocaleString()}</p>
                </div>
              </div>
              <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">{report.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
