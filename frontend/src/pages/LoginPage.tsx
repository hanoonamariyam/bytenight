import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, ShieldCheck, ArrowRight, KeyRound, AlertCircle, Sparkles } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const emailPattern = /^[A-Za-z0-9][A-Za-z0-9._%+-]*@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  const passwordPattern = /^[A-Za-z0-9]+$/;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!emailPattern.test(email.trim())) {
      setErrorMessage('Enter a valid email address using letters and numbers.');
      return;
    }

    if (!passwordPattern.test(password)) {
      setErrorMessage('Password can contain only letters and numbers.');
      return;
    }

    setIsLoading(true);

    try {
      await login({ email, password });
      navigate('/dashboard');
    } catch (err: any) {
      setErrorMessage(err.message || 'Invalid login credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('prof.smith@university.edu');
    setPassword('Password123');
    setErrorMessage(null);
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
        
        {/* Academic Brand Identity */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-slate-900 text-white mx-auto flex items-center justify-center shadow-xs mb-3">
            <GraduationCap size={26} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            ByteNight EarlySupport
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Explainable Student Performance &amp; Early Intervention Platform
          </p>
        </div>

        {/* Demo Credentials Quick-Fill Banner */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 mb-6 text-xs text-slate-600">
          <div className="flex items-center justify-between font-semibold text-slate-800 mb-1.5">
            <span className="flex items-center gap-1.5">
              <KeyRound size={14} className="text-indigo-600" />
              <span>Faculty Demo Credentials</span>
            </span>
            <button
              type="button"
              onClick={handleFillDemo}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 underline cursor-pointer"
            >
              Auto-fill
            </button>
          </div>
          <p className="font-mono text-[11px] text-slate-500">
            Email: <strong className="text-slate-700">prof.smith@university.edu</strong><br />
            Password: <strong className="text-slate-700">Password123</strong>
          </p>
        </div>

        {/* Error Alert Message */}
        {errorMessage && (
          <div className="mb-5 p-3 rounded-lg bg-rose-50 border border-rose-200 flex items-start gap-2 text-xs text-rose-700">
            <AlertCircle size={16} className="shrink-0 mt-0.5 text-rose-600" />
            <p>{errorMessage}</p>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Faculty Institutional Email
            </label>
            <input
              type="email"
              required
              value={email}
              pattern="[A-Za-z0-9][A-Za-z0-9._%+-]*@[A-Za-z0-9.-]+\.[A-Za-z]{2,}"
              onChange={(e) => setEmail(e.target.value.replace(/[^A-Za-z0-9@._%+-]/g, ''))}
              placeholder="e.g. prof.smith@university.edu"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-slate-900 focus:border-slate-900 text-xs sm:text-sm bg-slate-50/50"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              pattern="[A-Za-z0-9]+"
              onChange={(e) => setPassword(e.target.value.replace(/[^A-Za-z0-9]/g, ''))}
              placeholder="••••••••••••"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-slate-900 focus:border-slate-900 text-xs sm:text-sm bg-slate-50/50"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-2.5 px-4 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <span>Authenticating Session...</span>
            ) : (
              <>
                <span>Sign In to Faculty Portal</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
          <ShieldCheck size={13} className="text-emerald-600" />
          <span>Stateless Role-Based Academic Authentication</span>
        </div>

      </div>
    </div>
  );
};
