'use client';

import React, { useState, useEffect } from 'react';
import { defaultLetters } from '../lib/mockData';
import { initializeLetters, getLetters } from '../lib/letterStore';
import type { Letter } from '../lib/types';
import { useAuth } from '../lib/AuthContext';
import { 
  FileSignature, LogOut, Clock, CheckCircle, FileCheck,
  Eye, AlertCircle, X
} from 'lucide-react';

const SigneeDashboard = () => {
  const { user, logout } = useAuth();
  const [pendingLetters, setPendingLetters] = useState<Letter[]>(
    defaultLetters.filter(l => l.status === 'Pending Approval' || l.status === 'Approved')
  );

  // Initialize letter store on mount
  useEffect(() => {
    initializeLetters(defaultLetters);
    
    // Listen for letter updates
    const handleLettersUpdate = (event: CustomEvent) => {
      const updated = event.detail.filter((l: Letter) => l.status === 'Pending Approval' || l.status === 'Approved');
      setPendingLetters(updated);
    };
    
    window.addEventListener('lettersUpdated' as any, handleLettersUpdate as any);
    
    return () => {
      window.removeEventListener('lettersUpdated' as any, handleLettersUpdate as any);
    };
  }, []);

  const stats = {
    pending: pendingLetters.filter((l) => l.status === 'Pending Approval').length,
    approved: pendingLetters.filter((l) => l.status === 'Approved').length,
    total: pendingLetters.length,
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
              <FileSignature className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Imzolovchi Paneli</h1>
              <p className="text-sm text-slate-600">Xatlarni tasdiqlash va imzolash</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="font-semibold text-slate-800">{user?.name}</div>
              <div className="text-sm text-slate-600">{user?.email}</div>
            </div>
            <button onClick={logout} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 hover:shadow-md active:scale-95 transition-all duration-200 flex items-center gap-2 cursor-pointer">
              <LogOut className="w-4 h-4" />
              Chiqish
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-slate-600">Jami Xatlar</div>
              <FileCheck className="w-5 h-5 text-slate-400" />
            </div>
            <div className="text-3xl font-bold text-slate-800">{stats.total}</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-slate-600">Tasdiqlash Kutilmoqda</div>
              <Clock className="w-5 h-5 text-amber-500" />
            </div>
            <div className="text-3xl font-bold text-amber-600">{stats.pending}</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-slate-600">Imzo Kutilmoqda</div>
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-green-600">{stats.approved}</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 mb-8">
          <div className="px-6 py-4 border-b border-slate-200 bg-amber-50">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-6 h-6 text-amber-600" />
              <div>
                <h2 className="text-xl font-semibold text-slate-800">Tasdiqlash Kutilmoqda</h2>
                <p className="text-sm text-slate-600">Sizning tasdiqingizni kutayotgan xatlar</p>
              </div>
            </div>
          </div>
          <div className="divide-y divide-slate-200">
            {pendingLetters
              .filter((l) => l.status === 'Pending Approval')
              .map((letter) => (
                <div key={letter.id} className="px-6 py-6 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-slate-800">{letter.subject}</h3>
                        <span className="px-2 py-0.5 text-xs font-medium rounded bg-amber-100 text-amber-700">
                          Tasdiqlash kutilmoqda
                        </span>
                        {letter.priority === 'High' && (
                          <span className="px-2 py-0.5 text-xs font-medium rounded bg-red-100 text-red-700 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            Yuqori ustuvorlik
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-slate-600 mb-2 flex items-center gap-2">
                        <span className="font-mono">{letter.reference}</span>
                        <span>•</span>
                        <span>{letter.department}</span>
                      </div>
                      <div className="text-sm text-slate-500">
                        Yuborilgan: {letter.submittedAt ? new Date(letter.submittedAt).toLocaleDateString('uz-UZ') : 'N/A'}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 hover:shadow-md active:scale-95 transition-all duration-200 font-semibold flex items-center gap-2 cursor-pointer">
                      <CheckCircle className="w-4 h-4" />
                      Tasdiqlash
                    </button>
                    <button className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 hover:shadow-md active:scale-95 transition-all duration-200 font-semibold flex items-center gap-2 cursor-pointer">
                      <X className="w-4 h-4" />
                      Rad Etish
                    </button>
                    <button className="px-6 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 hover:shadow-md active:scale-95 transition-all duration-200 flex items-center gap-2 cursor-pointer">
                      <Eye className="w-4 h-4" />
                      Ko'rish
                    </button>
                  </div>
                </div>
              ))}
            {pendingLetters.filter((l) => l.status === 'Pending Approval').length === 0 && (
              <div className="px-6 py-12 text-center text-slate-500">
                Tasdiqlash uchun xatlar yo'q
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200">
          <div className="px-6 py-4 border-b border-slate-200 bg-green-50">
            <div className="flex items-center gap-2">
              <FileSignature className="w-6 h-6 text-green-600" />
              <div>
                <h2 className="text-xl font-semibold text-slate-800">Imzolashga Tayyor</h2>
                <p className="text-sm text-slate-600">Tasdiqlangan va imzo kutayotgan xatlar</p>
              </div>
            </div>
          </div>
          <div className="divide-y divide-slate-200">
            {pendingLetters
              .filter((l) => l.status === 'Approved')
              .map((letter) => (
                <div key={letter.id} className="px-6 py-6 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-slate-800">{letter.subject}</h3>
                        <span className="px-2 py-0.5 text-xs font-medium rounded bg-green-100 text-green-700">
                          Tasdiqlangan
                        </span>
                      </div>
                      <div className="text-sm text-slate-600 mb-2 flex items-center gap-2">
                        <span className="font-mono">{letter.reference}</span>
                        <span>•</span>
                        <span>{letter.department}</span>
                      </div>
                      <div className="text-sm text-slate-500">
                        Tasdiqlangan: {letter.approvedAt ? new Date(letter.approvedAt).toLocaleDateString('uz-UZ') : 'N/A'}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:shadow-md active:scale-95 transition-all duration-200 font-semibold flex items-center gap-2 cursor-pointer">
                      <FileSignature className="w-4 h-4" />
                      Imzolash
                    </button>
                    <button className="px-6 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 hover:shadow-md active:scale-95 transition-all duration-200 flex items-center gap-2 cursor-pointer">
                      <Eye className="w-4 h-4" />
                      Ko'rish
                    </button>
                  </div>
                </div>
              ))}
            {pendingLetters.filter((l) => l.status === 'Approved').length === 0 && (
              <div className="px-6 py-12 text-center text-slate-500">
                Imzolash uchun xatlar yo'q
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SigneeDashboard;
