'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, FileText, User, Building2, Mail, AlignLeft, Tag, Lock, AlertCircle, Send, Save, ArrowLeft } from 'lucide-react';
import { defaultTemplates } from '../lib/mockData';
import { createId, isoNow, applyMergeValues, createHistoryEvent } from '../lib/utils';
import { addLetter } from '../lib/letterStore';
import type { LetterTemplate, Letter, LetterRecipient } from '../lib/types';
import { useAuth } from '../lib/AuthContext';

const CreateLetterPage: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [step, setStep] = useState<'template' | 'form'>('template');
  const [selectedTemplate, setSelectedTemplate] = useState<LetterTemplate | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    department: user?.department || '',
    recipientName: '',
    recipientEmail: '',
    recipientOrganization: '',
    priority: 'Normal' as 'Low' | 'Normal' | 'High',
    isConfidential: false,
    tags: '',
    body: '',
    mergeFields: {} as Record<string, string>,
  });

  const handleTemplateSelect = (template: LetterTemplate | null) => {
    setSelectedTemplate(template);
    setStep('form');
    if (template && template.body) {
      setFormData(prev => ({ 
        ...prev, 
        body: template.body,
        mergeFields: template.fields.reduce((acc, field) => {
          acc[field.key] = '';
          return acc;
        }, {} as Record<string, string>)
      }));
    }
  };

  const generateReference = (): string => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const random = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
    return `LMS-${year}${month}-${random}`;
  };

  const createLetter = (isDraft: boolean): Letter => {
    const now = isoNow();
    const reference = generateReference();
    
    // Apply merge values to template body
    let letterBody = formData.body;
    if (selectedTemplate && selectedTemplate.fields) {
      letterBody = applyMergeValues(selectedTemplate.body, formData.mergeFields);
    }

    const recipient: LetterRecipient = {
      id: createId(),
      name: formData.recipientName,
      email: formData.recipientEmail,
      organization: formData.recipientOrganization || undefined,
      deliveryMethod: 'Email',
      status: 'Pending',
    };

    const letter: Letter = {
      id: createId(),
      reference,
      subject: formData.subject,
      department: formData.department,
      templateId: selectedTemplate?.id || '',
      templateName: selectedTemplate?.name || 'Custom Letter',
      body: letterBody,
      mergeValues: formData.mergeFields,
      status: isDraft ? 'Draft' : 'Pending Approval',
      priority: formData.priority,
      isConfidential: formData.isConfidential,
      createdAt: now,
      updatedAt: now,
      submittedAt: isDraft ? undefined : now,
      workflow: [
        {
          id: createId(),
          level: 1,
          approverName: 'Department Head',
          approverEmail: 'head@example.uz',
          approverRole: 'Department Head',
          status: 'Pending',
        },
      ],
      currentStepIndex: 0,
      history: [
        createHistoryEvent('Created', user?.name || 'User', isDraft ? 'Saved as draft' : 'Submitted for approval'),
      ],
      recipients: [recipient],
      tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
    };

    return letter;
  };

  const handleSubmit = async (e: React.FormEvent, isDraft: boolean = true) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const newLetter = createLetter(isDraft);
      addLetter(newLetter);
      
      // Show success message
      const message = isDraft 
        ? 'Xat qoralama sifatida saqlandi!' 
        : 'Xat tasdiqlash uchun yuborildi!';
      
      alert(message);
      
      // Navigate back to dashboard
      router.push('/');
    } catch (error) {
      console.error('Error creating letter:', error);
      alert('Xatni saqlashda xatolik yuz berdi');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    if (step === 'form') {
      setStep('template');
    } else {
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">{step === 'form' ? 'Shablonlar' : 'Bosh sahifa'}</span>
          </button>
          
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shrink-0">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Yangi Xat Yaratish</h1>
                <p className="text-slate-600 mt-1">
                  {step === 'template' ? 'Shablon tanlang yoki bo\'sh xat yarating' : 'Barcha maydonlarni to\'ldiring'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <form onSubmit={(e) => handleSubmit(e, true)} className="p-8 space-y-8">
            {/* Template Selection */}
            {step === 'template' && (
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-4">Shablon tanlang</h2>
                <p className="text-slate-600 mb-6">Tayyor shablondan foydalaning yoki bo'sh xat yarating</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {defaultTemplates.map((template) => (
                    <button
                      key={template.id}
                      type="button"
                      onClick={() => handleTemplateSelect(template)}
                      className="group p-6 border-2 border-slate-200 rounded-xl hover:border-blue-500 hover:shadow-md transition-all text-left"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-blue-100 group-hover:bg-blue-200 rounded-lg flex items-center justify-center transition-colors">
                          <FileText className="w-5 h-5 text-blue-600" />
                        </div>
                        <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {template.name}
                        </h3>
                      </div>
                      <p className="text-sm text-slate-600">{template.description}</p>
                    </button>
                  ))}
                  
                  <button
                    type="button"
                    onClick={() => handleTemplateSelect(null)}
                    className="group p-6 border-2 border-dashed border-slate-300 rounded-xl hover:border-blue-500 hover:shadow-md transition-all"
                  >
                    <div className="flex flex-col items-center justify-center text-center min-h-[120px]">
                      <div className="w-12 h-12 bg-slate-100 group-hover:bg-blue-100 rounded-xl flex items-center justify-center mb-3 transition-colors">
                        <FileText className="w-6 h-6 text-slate-400 group-hover:text-blue-600 transition-colors" />
                      </div>
                      <p className="font-semibold text-slate-700 group-hover:text-blue-600 transition-colors">Bo'sh Xat</p>
                      <p className="text-xs text-slate-500 mt-1">Noldan boshlang</p>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {step === 'form' && (
              <>
                {/* Selected Template Info */}
                {selectedTemplate && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-sm font-medium text-blue-900">Tanlangan shablon:</p>
                        <p className="text-sm text-blue-700">{selectedTemplate.name}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Basic Information */}
                <div>
                  <h2 className="text-xl font-bold text-slate-900 mb-6">Asosiy Ma'lumotlar</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        <div className="flex items-center gap-2">
                          <AlignLeft className="w-4 h-4" />
                          Mavzu *
                        </div>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800"
                        placeholder="Xat mavzusini kiriting"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4" />
                          Bo'lim *
                        </div>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800"
                        placeholder="Bo'lim nomini kiriting"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          Qabul qiluvchi *
                        </div>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.recipientName}
                        onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800"
                        placeholder="Qabul qiluvchi ismi"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          Email *
                        </div>
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.recipientEmail}
                        onChange={(e) => setFormData({ ...formData, recipientEmail: e.target.value })}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800"
                        placeholder="email@example.uz"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4" />
                          Tashkilot (ixtiyoriy)
                        </div>
                      </label>
                      <input
                        type="text"
                        value={formData.recipientOrganization}
                        onChange={(e) => setFormData({ ...formData, recipientOrganization: e.target.value })}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800"
                        placeholder="Tashkilot nomi"
                      />
                    </div>
                  </div>
                </div>

                {/* Template Merge Fields */}
                {selectedTemplate && selectedTemplate.fields && selectedTemplate.fields.length > 0 && (
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 mb-6">Shablon Maydonlari</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {selectedTemplate.fields.map((field) => (
                        <div key={field.key}>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">
                            {field.label} {field.required && <span className="text-red-500">*</span>}
                          </label>
                          <input
                            type="text"
                            required={field.required}
                            value={formData.mergeFields[field.key] || ''}
                            onChange={(e) => setFormData({
                              ...formData,
                              mergeFields: {
                                ...formData.mergeFields,
                                [field.key]: e.target.value
                              }
                            })}
                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800"
                            placeholder={field.description || field.label}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Priority and Tags */}
                <div>
                  <h2 className="text-xl font-bold text-slate-900 mb-6">Qo'shimcha Sozlamalar</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="w-4 h-4" />
                          Ustuvorlik
                        </div>
                      </label>
                      <select
                        value={formData.priority}
                        onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800"
                      >
                        <option value="Low">Past</option>
                        <option value="Normal">O'rta</option>
                        <option value="High">Yuqori</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        <div className="flex items-center gap-2">
                          <Tag className="w-4 h-4" />
                          Teglar (vergul bilan ajrating)
                        </div>
                      </label>
                      <input
                        type="text"
                        value={formData.tags}
                        onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800"
                        placeholder="Policy, HR, Important"
                      />
                    </div>
                  </div>

                  {/* Confidential Checkbox */}
                  <div className="flex items-center gap-3 mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <input
                      type="checkbox"
                      id="confidential"
                      checked={formData.isConfidential}
                      onChange={(e) => setFormData({ ...formData, isConfidential: e.target.checked })}
                      className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="confidential" className="text-sm font-semibold text-slate-700 flex items-center gap-2 cursor-pointer">
                      <Lock className="w-4 h-4 text-amber-600" />
                      Maxfiy xat
                    </label>
                  </div>
                </div>

                {/* Body */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Xat matni *
                    </div>
                  </label>
                  <textarea
                    required
                    rows={12}
                    value={formData.body}
                    onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 font-mono text-sm"
                    placeholder="Xat matnini kiriting..."
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t-2 border-slate-200">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-slate-600 text-white py-4 rounded-lg font-semibold hover:bg-slate-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                  >
                    <Save className="w-5 h-5" />
                    {isSubmitting ? 'Saqlanmoqda...' : 'Qoralama Saqlash'}
                  </button>
                  <button
                    type="button"
                    onClick={(e) => handleSubmit(e as any, false)}
                    disabled={isSubmitting}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                  >
                    <Send className="w-5 h-5" />
                    {isSubmitting ? 'Yuborilmoqda...' : 'Tasdiqlashga Yuborish'}
                  </button>
                </div>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateLetterPage;
