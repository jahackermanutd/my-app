'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { CheckCircle, FileText, Calendar, User, Building2, Shield } from 'lucide-react';

export default function VerifyPage() {
  const params = useParams();
  const letterId = params?.id as string;

  // Mock letter data - in production, fetch from database
  const letterInfo = {
    reference: letterId || 'LMS-202511-0001',
    subject: 'Rasmiy Xat Namunasi',
    date: '3 Noyabr 2025 yil',
    signee: 'Mirzaev B.A.',
    signeeTitle: 'Bosh Direktor',
    organization: 'PFK AGMK MChJ',
    status: 'Tasdiqlangan va Imzolangan',
    verifiedDate: '3 Noyabr 2025 yil, 14:30',
    isValid: true,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            {letterInfo.isValid ? (
              <CheckCircle className="w-12 h-12 text-green-600" />
            ) : (
              <Shield className="w-12 h-12 text-red-600" />
            )}
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Xat Tasdiqlandi
          </h1>
          <p className="text-slate-600">
            Ushbu xat rasmiy va elektron imzo bilan tasdiqlangan
          </p>
        </div>

        {/* Letter Information Card */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
          {/* Status Banner */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4">
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                <span className="font-semibold">{letterInfo.status}</span>
              </div>
              <div className="text-sm opacity-90">
                {letterInfo.verifiedDate}
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="p-6 space-y-6">
            {/* Reference Number */}
            <div className="flex items-start gap-4 pb-4 border-b border-slate-200">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-slate-600 mb-1">
                  Raqami
                </div>
                <div className="text-lg font-bold text-slate-800">
                  № {letterInfo.reference}
                </div>
              </div>
            </div>

            {/* Subject */}
            <div className="flex items-start gap-4 pb-4 border-b border-slate-200">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-slate-600 mb-1">
                  Mavzu
                </div>
                <div className="text-base text-slate-800">
                  {letterInfo.subject}
                </div>
              </div>
            </div>

            {/* Date */}
            <div className="flex items-start gap-4 pb-4 border-b border-slate-200">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5 text-amber-600" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-slate-600 mb-1">
                  Sana
                </div>
                <div className="text-base text-slate-800">
                  {letterInfo.date}
                </div>
              </div>
            </div>

            {/* Organization */}
            <div className="flex items-start gap-4 pb-4 border-b border-slate-200">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                <Building2 className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-slate-600 mb-1">
                  Tashkilot
                </div>
                <div className="text-base text-slate-800">
                  {letterInfo.organization}
                </div>
              </div>
            </div>

            {/* Signee */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-slate-600 mb-1">
                  Imzolovchi
                </div>
                <div className="text-base font-semibold text-slate-800">
                  {letterInfo.signee}
                </div>
                <div className="text-sm text-slate-600">
                  {letterInfo.signeeTitle}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-slate-50 px-6 py-4 border-t border-slate-200">
            <div className="flex items-center justify-between text-sm">
              <div className="text-slate-600">
                <span className="font-medium">Tasdiqlash kodi:</span>{' '}
                <code className="bg-slate-200 px-2 py-1 rounded text-xs font-mono">
                  {letterId}
                </code>
              </div>
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="w-4 h-4" />
                <span className="font-medium">Haqiqiy</span>
              </div>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex gap-3">
            <Shield className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-1">Xavfsizlik Haqida</p>
              <p className="text-blue-700">
                Ushbu xat QR kod va elektron imzo yordamida tasdiqlangan. 
                Hujjat ma'lumotlarini tekshirish uchun tashkilot bilan bog'laning.
              </p>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-8 text-center">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Bosh sahifaga qaytish
          </a>
        </div>
      </div>
    </div>
  );
}
