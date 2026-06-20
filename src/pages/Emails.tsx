import { useState, useEffect } from 'react';
import { ThumbsUp, ThumbsDown, CheckCircle, XCircle } from 'lucide-react';
import api from '../lib/api';

interface EmailLog {
  id: string;
  subject: string;
  from: string;
  action: string;
  priority: string;
  date: string;
  feedback_correct: boolean | null;
}

export default function Emails() {
  const [emails, setEmails] = useState<EmailLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmails();
  }, []);

  const fetchEmails = () => {
    api.get('/emails')
      .then(res => setEmails(res.data.data))
      .catch(err => console.error("Failed to fetch emails", err))
      .finally(() => setLoading(false));
  };

  const handleFeedback = (id: string, is_correct: boolean) => {
    api.patch(`/emails/${id}/feedback`, { is_correct })
      .then(() => {
        setEmails(emails.map(e => e.id === id ? { ...e, feedback_correct: is_correct } : e));
      })
      .catch(err => console.error("Failed to submit feedback", err));
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Email Processing Log</h1>
      
      {loading ? (
        <div className="text-slate-500 animate-pulse">Loading emails...</div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-800 font-medium">
              <tr>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Sender</th>
                <th className="px-6 py-4">Subject</th>
                <th className="px-6 py-4">AI Action</th>
                <th className="px-6 py-4">Human Feedback</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {emails.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">No emails processed yet.</td>
                </tr>
              )}
              {emails.map((email) => (
                <tr key={email.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap">{new Date(email.date).toLocaleString()}</td>
                  <td className="px-6 py-4 font-medium text-slate-700">{email.from}</td>
                  <td className="px-6 py-4 truncate max-w-xs">{email.subject}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      email.action === 'reply' ? 'bg-blue-100 text-blue-800' :
                      email.action === 'skip' ? 'bg-slate-100 text-slate-800' :
                      email.action === 'forward' ? 'bg-purple-100 text-purple-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {email.action?.toUpperCase() || 'UNKNOWN'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {email.feedback_correct === true ? (
                      <span className="flex items-center text-emerald-600 font-medium">
                        <CheckCircle className="w-4 h-4 mr-1" /> Correct
                      </span>
                    ) : email.feedback_correct === false ? (
                      <span className="flex items-center text-red-600 font-medium">
                        <XCircle className="w-4 h-4 mr-1" /> Incorrect
                      </span>
                    ) : (
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleFeedback(email.id, true)}
                          className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
                          title="Mark Correct"
                        >
                          <ThumbsUp className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleFeedback(email.id, false)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          title="Mark Incorrect"
                        >
                          <ThumbsDown className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
