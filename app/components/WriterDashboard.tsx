'use client';

import React, { useState, useEffect } from 'react';
import { defaultLetters, defaultTemplates } from '../lib/mockData';
import { initializeLetters, getLetters } from '../lib/letterStore';
import type { Letter } from '../lib/types';
import { useAuth } from '../lib/AuthContext';
import { 
  PenTool, LogOut, FilePen, Clock, PlusCircle, 
  FileText, Edit, Send, FileStack, Sparkles
} from 'lucide-react';
import NewLetterModal from './NewLetterModal';
import LetterBuilder from './LetterBuilder';

const WriterDashboard = () => {
  const { user, logout } = useAuth();
  const [myLetters, setMyLetters] = useState<Letter[]>(defaultLetters.filter(l => l.status === 'Draft' || l.status === 'Pending Approval'));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);

  // Initialize letter store on mount
  useEffect(() => {
    initializeLetters(defaultLetters);
    
    // Listen for letter updates
    const handleLettersUpdate = (event: CustomEvent) => {
      const updatedLetters = event.detail.filter((l: Letter) => l.status === 'Draft' || l.status === 'Pending Approval');
      setMyLetters(updatedLetters);
    };
    
    window.addEventListener('lettersUpdated' as any, handleLettersUpdate as any);
    
    return () => {
      window.removeEventListener('lettersUpdated' as any, handleLettersUpdate as any);
    };
  }, []);

  // Refresh letters when modal closes
  const handleLetterCreated = () => {
    const updatedLetters = getLetters().filter(l => l.status === 'Draft' || l.status === 'Pending Approval');
    setMyLetters(updatedLetters);
  };

  const stats = {
    drafts: myLetters.filter((l) => l.status === 'Draft').length,
    pending: myLetters.filter((l) => l.status === 'Pending Approval').length,
    total: myLetters.length,
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
              <PenTool className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Xat Muharriri Paneli</h1>
              <p className="text-sm text-slate-600">Xatlarni yaratish va boshqarish</p>
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
              <div className="text-sm font-medium text-slate-600">Jami Xatlarim</div>
              <FileText className="w-5 h-5 text-slate-400" />
            </div>
            <div className="text-3xl font-bold text-slate-800">{stats.total}</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-slate-600">Qoralamalar</div>
              <FilePen className="w-5 h-5 text-amber-500" />
            </div>
            <div className="text-3xl font-bold text-amber-600">{stats.drafts}</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-slate-600">Kutilmoqda</div>
              <Clock className="w-5 h-5 text-blue-500" />
            </div>
            <div className="text-3xl font-bold text-blue-600">{stats.pending}</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-lg p-8 mb-8 text-white">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                <Sparkles className="w-7 h-7" />
                Yangi xat yaratish
              </h2>
              <p className="mb-6 text-blue-100">Professional A4 formatdagi xat yarating, PDF yuklab oling va QR kod bilan tasdiqlang</p>
              <div className="flex gap-4">
                <button 
                  onClick={() => setIsBuilderOpen(true)}
                  className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 hover:shadow-md active:scale-95 transition-all duration-200 flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-5 h-5" />
                  Xat yaratish
                </button>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="bg-blue-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-900 hover:shadow-md active:scale-95 transition-all duration-200 flex items-center gap-2 cursor-pointer"
                >
                  <PlusCircle className="w-5 h-5" />
                  Oddiy Xat
                </button>
              </div>
            </div>
            <FileText className="w-24 h-24 opacity-20" />
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <FileStack className="w-5 h-5" />
            Mavjud Shablonlar
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {defaultTemplates.map((template) => (
              <div key={template.id} className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md transition-all duration-200">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-slate-800">{template.name}</h3>
                  </div>
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                    {template.category}
                  </span>
                </div>
                <p className="text-sm text-slate-600 mb-4">{template.description}</p>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 hover:shadow-md active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  Shablondan Foydalanish
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
            <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Mening Xatlarim
            </h2>
          </div>
          <div className="divide-y divide-slate-200">
            {myLetters.map((letter) => (
              <div key={letter.id} className="px-6 py-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-slate-800">{letter.subject}</h3>
                      <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                        letter.status === 'Draft' ? 'bg-slate-100 text-slate-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {letter.status === 'Draft' ? 'Qoralama' : 'Kutilmoqda'}
                      </span>
                    </div>
                    <div className="text-sm text-slate-600 flex items-center gap-2">
                      <span className="font-mono">{letter.reference}</span>
                      <span>•</span>
                      <span>{letter.department}</span>
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      {new Date(letter.createdAt).toLocaleDateString('uz-UZ')}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {letter.status === 'Draft' && (
                      <>
                        <button className="px-3 py-1.5 bg-slate-100 text-slate-700 text-sm rounded hover:bg-slate-200 active:scale-95 transition-all duration-200 flex items-center gap-1 cursor-pointer">
                          <Edit className="w-3.5 h-3.5" />
                          Tahrirlash
                        </button>
                        <button className="px-3 py-1.5 bg-green-600 text-white text-sm rounded hover:bg-green-700 hover:shadow-md active:scale-95 transition-all duration-200 flex items-center gap-1 cursor-pointer">
                          <Send className="w-3.5 h-3.5" />
                          Yuborish
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* New Letter Modal */}
      <NewLetterModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onLetterCreated={handleLetterCreated}
      />

      {/* Letter Builder */}
      {isBuilderOpen && (
        <LetterBuilder
          onClose={() => setIsBuilderOpen(false)}
          onSave={(data) => {
            console.log('Letter saved:', data);
            setIsBuilderOpen(false);
            handleLetterCreated();
          }}
        />
      )}
    </div>
  );
};

export default WriterDashboard;
