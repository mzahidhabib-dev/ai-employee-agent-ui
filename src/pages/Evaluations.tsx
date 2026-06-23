import { useState, useEffect } from 'react';
import { Activity } from 'lucide-react';
import api from '../lib/api';

interface Evaluation {
  id: string;
  accuracy: number;
  faithfulness: number;
  relevancy: number;
  date: string;
}

export default function Evaluations() {
  const [evals, setEvals] = useState<Evaluation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Dummy data to bypass LLM rate limits for now
    const dummyEvals: Evaluation[] = [
      {
        id: "eval_1",
        accuracy: 92.5,
        faithfulness: 0.94,
        relevancy: 0.96,
        date: new Date().toISOString(),
      },
      {
        id: "eval_2",
        accuracy: 88.0,
        faithfulness: 0.89,
        relevancy: 0.90,
        date: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: "eval_3",
        accuracy: 85.5,
        faithfulness: 0.91,
        relevancy: 0.88,
        date: new Date(Date.now() - 172800000).toISOString(),
      }
    ];
    setEvals(dummyEvals);
    setLoading(false);
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-slate-800 tracking-tight">System Evaluations</h1>
      
      {loading ? (
        <div className="text-slate-500 animate-pulse">Loading evaluations...</div>
      ) : evals.length === 0 ? (
        <div className="bg-white p-6 rounded-xl border border-slate-200 text-center text-slate-500">
          No evaluations generated yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {evals.map((e) => (
            <div key={e.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-slate-500 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-slate-400" />
                  {new Date(e.date).toLocaleString()}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${e.accuracy > 80 ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                  Accuracy: {e.accuracy}%
                </span>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600">Faithfulness</span>
                    <span className="font-medium text-slate-800">{(e.faithfulness * 100).toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${e.faithfulness * 100}%` }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600">Relevancy</span>
                    <span className="font-medium text-slate-800">{(e.relevancy * 100).toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${e.relevancy * 100}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
