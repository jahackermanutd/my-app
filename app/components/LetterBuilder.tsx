'use client';

import React, { useState, useRef } from 'react';
import { 
  FileText, Upload, Download, Eye, Save, 
  Image as ImageIcon, Settings, X, CheckCircle
} from 'lucide-react';
import { PDFLetterDocument } from './PDFLetterDocument';
import { 
  downloadPDFDocument, 
  generateQRCodeDataURL, 
  fileToDataURL,
  generateReferenceNumber 
} from '../lib/reactPDFGenerator';
import { useAuth } from '../lib/AuthContext';
import LetterPreview from './LetterPreview';

interface LetterBuilderProps {
  letterId?: string;
  initialData?: any;
  onSave?: (data: any) => void;
  onClose?: () => void;
}

const LetterBuilder: React.FC<LetterBuilderProps> = ({
  letterId,
  initialData,
  onSave,
  onClose,
}) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [isSaving, setIsSaving] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  
  // Letter Data
  const [letterData, setLetterData] = useState({
    reference: initialData?.reference || generateReferenceNumber('LTR'),
    subject: initialData?.subject || '',
    recipientName: initialData?.recipientName || '',
    recipientOrganization: initialData?.recipientOrganization || '',
    recipientAddress: initialData?.recipientAddress || '',
    body: initialData?.body || '',
    signeeName: initialData?.signeeName || 'Mirzaev B.A.',
    signeeTitle: initialData?.signeeTitle || 'Bosh Direktor',
    organizationName: 'PFK AGMK MChJ',
    organizationAddress: 'Almaliq shahar, O\'zbekiston',
    organizationPhone: '+998 70 123 45 67',
    organizationEmail: 'info@agmk.uz',
    logoUrl: initialData?.logoUrl || '',
  });

  const logoInputRef = useRef<HTMLInputElement>(null);

  // Generate QR code when component mounts
  React.useEffect(() => {
    const verificationUrl = `https://agmk.uz/verify/${letterData.reference}`;
    generateQRCodeDataURL(verificationUrl)
      .then(setQrCodeUrl)
      .catch(console.error);
  }, [letterData.reference]);

  const handleFileUpload = async (type: 'logo') => {
    const input = logoInputRef.current;
    if (!input?.files?.[0]) return;

    const file = input.files[0];
    try {
      const dataURL = await fileToDataURL(file);
      setLetterData(prev => ({
        ...prev,
        logoUrl: dataURL,
      }));
    } catch (error) {
      console.error('File upload error:', error);
      alert('Fayl yuklashda xatolik');
    }
  };

  const handleSaveDraft = async () => {
    setIsSaving(true);
    try {
      if (onSave) {
        await onSave({ ...letterData, status: 'Draft' });
      }
      alert('Xat qoralama sifatida saqlandi!');
    } catch (error) {
      console.error('Save error:', error);
      alert('Saqlashda xatolik yuz berdi');
    } finally {
      setIsSaving(false);
    }
  };

  const handleGeneratePDF = async () => {
    try {
      const pdfDocument = (
        <PDFLetterDocument
          {...letterData}
          date={new Date()}
          qrCodeUrl={qrCodeUrl}
        />
      );
      
      await downloadPDFDocument(pdfDocument, `${letterData.reference}.pdf`);
      alert('PDF muvaffaqiyatli yaratildi va yuklab olindi!');
    } catch (error) {
      console.error('PDF generation error:', error);
      alert('PDF yaratishda xatolik yuz berdi');
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900 bg-opacity-50 z-50 overflow-auto">
      <div className="min-h-screen p-4 md:p-8">
        <div className="max-w-[1400px] mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Xat Yaratish va Dizayn</h2>
                <p className="text-sm text-blue-100">Professional A4 formatdagi rasmiy xat</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveTab(activeTab === 'edit' ? 'preview' : 'edit')}
                className="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg text-white font-medium transition-colors flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                {activeTab === 'edit' ? 'Ko\'rish' : 'Tahrirlash'}
              </button>
              {onClose && (
                <button
                  onClick={onClose}
                  className="w-8 h-8 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
            {/* Editor Panel */}
            {activeTab === 'edit' && (
              <div className="space-y-6">
                {/* Organization Settings */}
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                    <Settings className="w-5 h-5 text-blue-600" />
                    Tashkilot Ma'lumotlari
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Tashkilot Nomi
                      </label>
                      <input
                        type="text"
                        value={letterData.organizationName}
                        onChange={(e) => setLetterData({ ...letterData, organizationName: e.target.value })}
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Manzil
                      </label>
                      <input
                        type="text"
                        value={letterData.organizationAddress}
                        onChange={(e) => setLetterData({ ...letterData, organizationAddress: e.target.value })}
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Telefon
                        </label>
                        <input
                          type="text"
                          value={letterData.organizationPhone}
                          onChange={(e) => setLetterData({ ...letterData, organizationPhone: e.target.value })}
                          className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          value={letterData.organizationEmail}
                          onChange={(e) => setLetterData({ ...letterData, organizationEmail: e.target.value })}
                          className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    {/* Logo Upload */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Logo Yuklash
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="file"
                          ref={logoInputRef}
                          onChange={() => handleFileUpload('logo')}
                          accept="image/*"
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => logoInputRef.current?.click()}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                        >
                          <Upload className="w-4 h-4" />
                          Logo Tanlash
                        </button>
                        {letterData.logoUrl && (
                          <div className="flex items-center gap-2 text-green-600">
                            <CheckCircle className="w-4 h-4" />
                            <span className="text-sm">Yuklandi</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Letter Content */}
                <div className="bg-white rounded-lg p-4 border border-slate-200">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 shrink-0 text-green-600" />
                    Xat Matni
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Mavzu *
                      </label>
                      <input
                        type="text"
                        required
                        value={letterData.subject}
                        onChange={(e) => setLetterData({ ...letterData, subject: e.target.value })}
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Xat mavzusini kiriting"
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Qabul Qiluvchi Ismi *
                        </label>
                        <input
                          type="text"
                          required
                          value={letterData.recipientName}
                          onChange={(e) => setLetterData({ ...letterData, recipientName: e.target.value })}
                          className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Tashkilot
                        </label>
                        <input
                          type="text"
                          value={letterData.recipientOrganization}
                          onChange={(e) => setLetterData({ ...letterData, recipientOrganization: e.target.value })}
                          className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Manzil
                        </label>
                        <input
                          type="text"
                          value={letterData.recipientAddress}
                          onChange={(e) => setLetterData({ ...letterData, recipientAddress: e.target.value })}
                          className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Xat Matni *
                      </label>
                      <textarea
                        required
                        rows={12}
                        value={letterData.body}
                        onChange={(e) => setLetterData({ ...letterData, body: e.target.value })}
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-serif"
                        placeholder="Xat matnini kiriting. Har bir paragrafni yangi qatordan boshlang."
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Imzolovchi Ismi *
                        </label>
                        <input
                          type="text"
                          required
                          value={letterData.signeeName}
                          onChange={(e) => setLetterData({ ...letterData, signeeName: e.target.value })}
                          className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Lavozimi *
                        </label>
                        <input
                          type="text"
                          required
                          value={letterData.signeeTitle}
                          onChange={(e) => setLetterData({ ...letterData, signeeTitle: e.target.value })}
                          className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={handleSaveDraft}
                    disabled={isSaving}
                    className="flex-1 bg-slate-600 text-white py-3 rounded-lg font-semibold hover:bg-slate-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Save className="w-5 h-5" />
                    {isSaving ? 'Saqlanmoqda...' : 'Qoralama Saqlash'}
                  </button>
                  <button
                    onClick={handleGeneratePDF}
                    className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Download className="w-5 h-5" />
                    PDF Yuklab Olish
                  </button>
                </div>
              </div>
            )}

            {/* Preview Panel */}
            <div className="lg:sticky lg:top-6 lg:self-start">
              <div className="bg-slate-100 rounded-lg p-6 overflow-auto" style={{ maxHeight: '90vh' }}>
                <LetterPreview
                  {...letterData}
                  date={new Date()}
                  qrCodeData={`https://agmk.uz/verify/${letterData.reference}`}
                  pageNumber={1}
                  totalPages={1}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LetterBuilder;
