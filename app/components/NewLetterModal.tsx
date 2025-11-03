'use client';

import React, { useState } from 'react';
import { X, FileText, User, Building2, Mail, AlignLeft, Tag, Lock, AlertCircle, Send, Save } from 'lucide-react';
import { defaultTemplates } from '../lib/mockData';
import { createId, isoNow, applyMergeValues, createHistoryEvent } from '../lib/utils';
import { addLetter } from '../lib/letterStore';
import type { LetterTemplate, Letter, LetterRecipient } from '../lib/types';
import { useAuth } from '../lib/AuthContext';

interface NewLetterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLetterCreated?: () => void;
}

const NewLetterModal: React.FC<NewLetterModalProps> = ({ isOpen, onClose, onLetterCreated }) => {
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

  if (!isOpen) return null;

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
      
      // Reset form
      setFormData({
        subject: '',
        department: user?.department || '',
        recipientName: '',
        recipientEmail: '',
        recipientOrganization: '',
        priority: 'Normal',
        isConfidential: false,
        tags: '',
        body: '',
        mergeFields: {},
      });
      setSelectedTemplate(null);
      setStep('template');
      
      // Notify parent and close
      if (onLetterCreated) {
        onLetterCreated();
      }
      onClose();
    } catch (error) {
      console.error('Error creating letter:', error);
      alert('Xatni saqlashda xatolik yuz berdi');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (step === 'form' && !selectedTemplate?.id) {
      setStep('template');
    } else {
      setFormData({
        subject: '',
        department: user?.department || '',
        recipientName: '',
        recipientEmail: '',
        recipientOrganization: '',
        priority: 'Normal',
        isConfidential: false,
        tags: '',
        body: '',
        mergeFields: {},
      });
      setSelectedTemplate(null);
      setStep('template');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center shrink-0">
              <FileText className="w-6 h-6 text-white shrink-0" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Yangi Xat Yaratish</h2>
              <p className="text-sm text-blue-100">Barcha maydonlarni to'ldiring</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg flex items-center justify-center transition-colors shrink-0"
          >
            <X className="w-5 h-5 text-white shrink-0" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          <form onSubmit={(e) => handleSubmit(e, true)} className="p-6 space-y-6">
            {/* Template Selection */}
            {step === 'template' && (
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-3">
                  Shablon tanlang (ixtiyoriy)
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {defaultTemplates.map((template) => (
                    <button
                      key={template.id}
                      type="button"
                      onClick={() => handleTemplateSelect(template)}
                      className="p-4 border-2 border-slate-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                        <h3 className="font-semibold text-slate-800">{template.name}</h3>
                      </div>
                      <p className="text-xs text-slate-600">{template.description}</p>
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => handleTemplateSelect(null)}
                    className="p-4 border-2 border-dashed border-slate-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-center"
                  >
                    <FileText className="w-6 h-6 text-slate-400 mx-auto mb-2 shrink-0" />
                    <p className="font-semibold text-slate-700">Bo'sh Xat</p>
                  </button>
                </div>
              </div>
            )}

            {step === 'form' && (
              <>
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      <div className="flex items-center gap-2">
                        <AlignLeft className="w-4 h-4 shrink-0" />
                        Mavzu *
                      </div>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800"
                      placeholder="Xat mavzusini kiriting"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 shrink-0" />
                        Bo'lim *
                      </div>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800"
                      placeholder="Bo'lim nomini kiriting"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 shrink-0" />
                        Qabul qiluvchi *
                      </div>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.recipientName}
                      onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800"
                      placeholder="Qabul qiluvchi ismi"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 shrink-0" />
                        Email *
                      </div>
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.recipientEmail}
                      onChange={(e) => setFormData({ ...formData, recipientEmail: e.target.value })}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800"
                      placeholder="email@example.uz"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 shrink-0" />
                        Tashkilot (ixtiyoriy)
                      </div>
                    </label>
                    <input
                      type="text"
                      value={formData.recipientOrganization}
                      onChange={(e) => setFormData({ ...formData, recipientOrganization: e.target.value })}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800"
                      placeholder="Tashkilot nomi"
                    />
                  </div>
                </div>

                {/* Template Merge Fields */}
                {selectedTemplate && selectedTemplate.fields && selectedTemplate.fields.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-slate-800 mb-3">Shablon Maydonlari</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedTemplate.fields.map((field) => (
                        <div key={field.key}>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            {field.label} {field.required && '*'}
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
                            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800"
                            placeholder={field.description || field.label}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Priority and Tags */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        Ustuvorlik
                      </div>
                    </label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800"
                    >
                      <option value="Low">Past</option>
                      <option value="Normal">O'rta</option>
                      <option value="High">Yuqori</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 shrink-0" />
                        Teglar (vergul bilan ajrating)
                      </div>
                    </label>
                    <input
                      type="text"
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800"
                      placeholder="Policy, HR, Important"
                    />
                  </div>
                </div>

                {/* Confidential Checkbox */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="confidential"
                    checked={formData.isConfidential}
                    onChange={(e) => setFormData({ ...formData, isConfidential: e.target.checked })}
                    className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="confidential" className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <Lock className="w-4 h-4 shrink-0" />
                    Maxfiy xat
                  </label>
                </div>

                {/* Body */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 shrink-0" />
                      Xat matni *
                    </div>
                  </label>
                  <textarea
                    required
                    rows={8}
                    value={formData.body}
                    onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800"
                    placeholder="Xat matnini kiriting..."
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-slate-200">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-slate-600 text-white py-3 rounded-lg font-semibold hover:bg-slate-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="w-5 h-5 shrink-0" />
                    {isSubmitting ? 'Saqlanmoqda...' : 'Qoralama Saqlash'}
                  </button>
                  <button
                    type="button"
                    onClick={(e) => handleSubmit(e as any, false)}
                    disabled={isSubmitting}
                    className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-5 h-5 shrink-0" />
                    {isSubmitting ? 'Yuborilmoqda...' : 'Yuborish'}
                  </button>
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={isSubmitting}
                    className="px-6 py-3 bg-slate-200 text-slate-700 rounded-lg font-semibold hover:bg-slate-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Bekor Qilish
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

export default NewLetterModal;
