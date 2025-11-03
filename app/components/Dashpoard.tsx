'use client';

import React, { useState } from 'react';
import { defaultLetters, defaultTemplates } from '../lib/mockData';
import type { Letter, LetterStatus } from '../lib/types';
import { getCurrentUser, setCurrentUser, mockUsers, hasPermission, getRoleDisplayName } from '../lib/auth';

const Dashboard = () => {
  const [letters] = useState<Letter[]>(defaultLetters);
  const [selectedLetter, setSelectedLetter] = useState<Letter | null>(null);
  const [currentUser, setCurrentUserState] = useState(getCurrentUser());

  const handleUserSwitch = (userId: string) => {
    const user = mockUsers.find(u => u.id === userId);
    if (user) {
      setCurrentUser(user);
      setCurrentUserState(user);
    }
  };

  // Filter letters based on user role
  const visibleLetters = hasPermission(currentUser, 'canViewAllLetters')
    ? letters
    : letters.filter(l => l.status !== 'Draft' || hasPermission(currentUser, 'canViewOwnLetters'));

  // Calculate statistics
  const stats = {
    total: visibleLetters.length,
    draft: visibleLetters.filter((l) => l.status === 'Draft').length,
    pending: visibleLetters.filter((l) => l.status === 'Pending Approval').length,
    approved: visibleLetters.filter((l) => l.status === 'Approved').length,
    signed: visibleLetters.filter((l) => l.status === 'Signed').length,
    rejected: visibleLetters.filter((l) => l.status === 'Rejected').length,
  };

  const getStatusColor = (status: LetterStatus) => {
    switch (status) {
      case 'Draft':
        return 'bg-gray-100 text-gray-800';
      case 'Pending Approval':
        return 'bg-yellow-100 text-yellow-800';
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Signed':
        return 'bg-blue-100 text-blue-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'text-red-600';
      case 'Normal':
        return 'text-blue-600';
      case 'Low':
        return 'text-gray-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with User Switcher */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Xatlar Boshqaruv Paneli
              </h1>
              <p className="text-gray-600">
                Barcha tashkiliy yozishmalarni boshqarish va kuzatish
              </p>
            </div>
            {/* User Role Switcher */}
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-xs text-gray-500 mb-2">Joriy foydalanuvchi:</div>
              <div className="font-semibold text-gray-900 mb-1">{currentUser.name}</div>
              <div className="text-sm text-gray-600 mb-3">{getRoleDisplayName(currentUser.role)}</div>
              <select
                value={currentUser.id}
                onChange={(e) => handleUserSwitch(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                {mockUsers.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({getRoleDisplayName(user.role)})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Role Permissions Banner */}
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">Sizning huquqlaringiz:</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
            {hasPermission(currentUser, 'canCreateLetter') && (
              <div className="flex items-center gap-1">
                <span className="text-green-600">✓</span>
                <span className="text-gray-700">Xat yaratish</span>
              </div>
            )}
            {hasPermission(currentUser, 'canSubmitLetter') && (
              <div className="flex items-center gap-1">
                <span className="text-green-600">✓</span>
                <span className="text-gray-700">Xat yuborish</span>
              </div>
            )}
            {hasPermission(currentUser, 'canApproveLetter') && (
              <div className="flex items-center gap-1">
                <span className="text-green-600">✓</span>
                <span className="text-gray-700">Tasdiqlash</span>
              </div>
            )}
            {hasPermission(currentUser, 'canSignLetter') && (
              <div className="flex items-center gap-1">
                <span className="text-green-600">✓</span>
                <span className="text-gray-700">Imzolash</span>
              </div>
            )}
            {hasPermission(currentUser, 'canManageUsers') && (
              <div className="flex items-center gap-1">
                <span className="text-green-600">✓</span>
                <span className="text-gray-700">Foydalanuvchilarni boshqarish</span>
              </div>
            )}
            {hasPermission(currentUser, 'canCreateTemplate') && (
              <div className="flex items-center gap-1">
                <span className="text-green-600">✓</span>
                <span className="text-gray-700">Shablon yaratish</span>
              </div>
            )}
            {hasPermission(currentUser, 'canViewReports') && (
              <div className="flex items-center gap-1">
                <span className="text-green-600">✓</span>
                <span className="text-gray-700">Hisobotlarni ko'rish</span>
              </div>
            )}
            {hasPermission(currentUser, 'canViewAllLetters') && (
              <div className="flex items-center gap-1">
                <span className="text-green-600">✓</span>
                <span className="text-gray-700">Barcha xatlarni ko'rish</span>
              </div>
            )}
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500">Jami Xatlar</div>
            <div className="mt-2 text-3xl font-semibold text-gray-900">
              {stats.total}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500">Qoralama</div>
            <div className="mt-2 text-3xl font-semibold text-gray-600">
              {stats.draft}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500">Kutilmoqda</div>
            <div className="mt-2 text-3xl font-semibold text-yellow-600">
              {stats.pending}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500">Tasdiqlangan</div>
            <div className="mt-2 text-3xl font-semibold text-green-600">
              {stats.approved}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500">Imzolangan</div>
            <div className="mt-2 text-3xl font-semibold text-blue-600">
              {stats.signed}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500">Rad etilgan</div>
            <div className="mt-2 text-3xl font-semibold text-red-600">
              {stats.rejected}
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Letters List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  So'nggi Xatlar
                </h2>
              </div>
              <div className="divide-y divide-gray-200">
                {visibleLetters.map((letter) => (
                  <div
                    key={letter.id}
                    onClick={() => setSelectedLetter(letter)}
                    className="px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {letter.subject}
                          </p>
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(
                              letter.status
                            )}`}
                          >
                            {letter.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                          <span className="font-mono text-xs">
                            {letter.reference}
                          </span>
                          <span>•</span>
                          <span>{letter.department}</span>
                          <span>•</span>
                          <span className={getPriorityColor(letter.priority)}>
                            {letter.priority === 'High' ? 'Yuqori' : letter.priority === 'Normal' ? 'O\'rta' : 'Past'} Ustuvorlik
                          </span>
                        </div>
                        <div className="mt-1 text-xs text-gray-400">
                          Yaratilgan: {new Date(letter.createdAt).toLocaleDateString('uz-UZ')}
                        </div>
                      </div>
                      {letter.isConfidential && (
                        <span className="ml-2 inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-800">
                          Maxfiy
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Details Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  Xat Tafsilotlari
                </h2>
              </div>
              <div className="px-6 py-4">
                {selectedLetter ? (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Mavzu</h3>
                      <p className="mt-1 text-sm text-gray-900">
                        {selectedLetter.subject}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Malumot raqami</h3>
                      <p className="mt-1 text-sm font-mono text-gray-900">
                        {selectedLetter.reference}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Holati</h3>
                      <span
                        className={`mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          selectedLetter.status
                        )}`}
                      >
                        {selectedLetter.status}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Shablon
                      </h3>
                      <p className="mt-1 text-sm text-gray-900">
                        {selectedLetter.templateName}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Ish Jarayoni
                      </h3>
                      <div className="mt-2 space-y-2">
                        {selectedLetter.workflow.map((step, index) => (
                          <div key={step.id} className="flex items-start gap-2">
                            <div
                              className={`w-2 h-2 mt-1.5 rounded-full ${
                                step.status === 'Approved'
                                  ? 'bg-green-500'
                                  : step.status === 'Rejected'
                                  ? 'bg-red-500'
                                  : 'bg-gray-300'
                              }`}
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900">
                                {step.approverName}
                              </p>
                              <p className="text-xs text-gray-500">
                                {step.approverRole} - {step.status === 'Approved' ? 'Tasdiqlangan' : step.status === 'Rejected' ? 'Rad etilgan' : 'Kutilmoqda'}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Qabul qiluvchilar</h3>
                      <div className="mt-2 space-y-1">
                        {selectedLetter.recipients.map((recipient) => (
                          <div key={recipient.id} className="text-sm text-gray-900">
                            <p className="font-medium">{recipient.name}</p>
                            <p className="text-xs text-gray-500">
                              {recipient.email}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                    {selectedLetter.tags.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-2">
                          Teglar
                        </h3>
                        <div className="flex flex-wrap gap-1">
                          {selectedLetter.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">
                    Tafsilotlarni ko'rish uchun xatni tanlang
                  </p>
                )}
              </div>
            </div>

            {/* Templates Section */}
            <div className="bg-white rounded-lg shadow mt-6">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  Mavjud Shablonlar
                </h2>
              </div>
              <div className="px-6 py-4 space-y-3">
                {hasPermission(currentUser, 'canCreateTemplate') ? (
                  <>
                    {defaultTemplates.map((template) => (
                      <div
                        key={template.id}
                        className="p-3 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
                      >
                        <h3 className="text-sm font-medium text-gray-900">
                          {template.name}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                          {template.category}
                        </p>
                      </div>
                    ))}
                    <button className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 active:scale-[0.98] transition-all duration-200 text-sm text-gray-600 hover:text-blue-600 cursor-pointer">
                      + Yangi shablon yaratish
                    </button>
                  </>
                ) : (
                  <p className="text-sm text-gray-500">
                    Shablonlarni ko'rish uchun ruxsat yo'q
                  </p>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow mt-6">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  Tezkor Harakatlar
                </h2>
              </div>
              <div className="px-6 py-4 space-y-2">
                {hasPermission(currentUser, 'canCreateLetter') && (
                  <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:shadow-md active:scale-[0.98] transition-all duration-200 text-sm cursor-pointer">
                    + Yangi xat yaratish
                  </button>
                )}
                {hasPermission(currentUser, 'canViewReports') && (
                  <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 hover:shadow-md active:scale-[0.98] transition-all duration-200 text-sm cursor-pointer">
                    📊 Hisobotlarni ko'rish
                  </button>
                )}
                {hasPermission(currentUser, 'canManageUsers') && (
                  <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 hover:shadow-md active:scale-[0.98] transition-all duration-200 text-sm cursor-pointer">
                    👥 Foydalanuvchilarni boshqarish
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;