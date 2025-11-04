'use client';

import React, { useState, useEffect } from 'react';
import { defaultLetters } from '../lib/mockData';
import { initializeLetters, getLetters } from '../lib/letterStore';
import type { Letter } from '../lib/types';
import { useAuth } from '../lib/AuthContext';
import { 
  LayoutDashboard, LogOut, FileText, FilePen, Clock, 
  CheckCircle, FileCheck, XCircle, Users, FileStack,
  Settings, PlusCircle
} from 'lucide-react';

const AdminDashboard = () => {
  const [letters, setLetters] = useState<Letter[]>(defaultLetters);
  const { user, logout } = useAuth();

  // Initialize letter store on mount
  useEffect(() => {
    initializeLetters(defaultLetters);
    
    // Listen for letter updates
    const handleLettersUpdate = (event: CustomEvent) => {
      setLetters(event.detail);
    };
    
    window.addEventListener('lettersUpdated' as any, handleLettersUpdate as any);
    
    return () => {
      window.removeEventListener('lettersUpdated' as any, handleLettersUpdate as any);
    };
  }, []);

  const stats = {
    total: letters.length,
    draft: letters.filter((l) => l.status === 'Draft').length,
    pending: letters.filter((l) => l.status === 'Pending Approval').length,
    approved: letters.filter((l) => l.status === 'Approved').length,
    signed: letters.filter((l) => l.status === 'Signed').length,
    rejected: letters.filter((l) => l.status === 'Rejected').length,
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Admin Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Administrator Paneli</h1>
              <p className="text-sm text-slate-600">111To'liq tizim boshqaruvi</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="font-semibold text-slate-800">{user?.name}</div>
              <div className="text-sm text-slate-600">{user?.email}</div>
            </div>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 hover:shadow-md active:scale-95 transition-all duration-200 flex items-center gap-2 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              Chiqish
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-slate-600">Jami</div>
              <FileText className="w-5 h-5 text-slate-400" />
            </div>
            <div className="text-3xl font-bold text-slate-800">{stats.total}</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-slate-600">Qoralama</div>
              <FilePen className="w-5 h-5 text-slate-400" />
            </div>
            <div className="text-3xl font-bold text-slate-600">{stats.draft}</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-slate-600">Kutilmoqda</div>
              <Clock className="w-5 h-5 text-amber-500" />
            </div>
            <div className="text-3xl font-bold text-amber-600">{stats.pending}</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-slate-600">Tasdiqlangan</div>
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-green-600">{stats.approved}</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-slate-600">Imzolangan</div>
              <FileCheck className="w-5 h-5 text-blue-500" />
            </div>
            <div className="text-3xl font-bold text-blue-600">{stats.signed}</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-slate-600">Rad etilgan</div>
              <XCircle className="w-5 h-5 text-red-500" />
            </div>
            <div className="text-3xl font-bold text-red-600">{stats.rejected}</div>
          </div>
        </div>

        {/* Admin Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <button className="bg-blue-600 text-white p-6 rounded-lg hover:bg-blue-700 active:scale-95 transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer">
            <PlusCircle className="w-8 h-8 mb-3 mx-auto" />
            <div className="font-semibold">Yangi Xat</div>
          </button>
          <button className="bg-purple-600 text-white p-6 rounded-lg hover:bg-purple-700 active:scale-95 transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer">
            <Users className="w-8 h-8 mb-3 mx-auto" />
            <div className="font-semibold">Foydalanuvchilar</div>
          </button>
          <button className="bg-green-600 text-white p-6 rounded-lg hover:bg-green-700 active:scale-95 transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer">
            <FileStack className="w-8 h-8 mb-3 mx-auto" />
            <div className="font-semibold">Shablonlar</div>
          </button>
          <button className="bg-slate-600 text-white p-6 rounded-lg hover:bg-slate-700 active:scale-95 transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer">
            <Settings className="w-8 h-8 mb-3 mx-auto" />
            <div className="font-semibold">Sozlamalar</div>
          </button>
        </div>

        {/* All Letters Table */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
            <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Barcha Xatlar
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase">Malumot</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase">Mavzu</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase">Bo'lim</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase">Holati</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase">Sana</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {letters.map((letter) => (
                  <tr key={letter.id} className="hover:bg-slate-50 cursor-pointer transition-colors">
                    <td className="px-6 py-4 text-sm font-mono text-slate-800">{letter.reference}</td>
                    <td className="px-6 py-4 text-sm text-slate-800 font-medium">{letter.subject}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{letter.department}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
                        {letter.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {new Date(letter.createdAt).toLocaleDateString('uz-UZ')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
