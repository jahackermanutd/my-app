import { pdf } from '@react-pdf/renderer';
import QRCode from 'qrcode';
import React from 'react';

export interface LetterData {
  reference: string;
  date?: Date;
  subject: string;
  recipientName: string;
  recipientOrganization?: string;
  recipientAddress?: string;
  body: string;
  signeeName: string;
  signeeTitle: string;
  organizationName: string;
  organizationAddress?: string;
  organizationPhone?: string;
  organizationEmail?: string;
  logoUrl?: string;
  watermarkUrl?: string;
}

/**
 * Generate QR code as data URL for use in PDF
 */
export const generateQRCodeDataURL = async (text: string): Promise<string> => {
  try {
    const qrCodeDataURL = await QRCode.toDataURL(text, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      width: 200,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    });
    return qrCodeDataURL;
  } catch (error) {
    console.error('QR Code generation failed:', error);
    throw error;
  }
};

/**
 * Download react-pdf document as PDF file
 * This generates vector PDF with selectable text (not rasterized)
 */
export const downloadPDFDocument = async (
  documentComponent: React.ReactElement<any>,
  fileName: string = 'letter.pdf'
): Promise<void> => {
  try {
    // Generate PDF blob from react-pdf component
    const blob = await pdf(documentComponent).toBlob();
    
    // Create download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('PDF generation failed:', error);
    throw error;
  }
};

/**
 * Generate PDF blob for preview or server-side processing
 */
export const generatePDFBlob = async (
  documentComponent: React.ReactElement<any>
): Promise<Blob> => {
  try {
    return await pdf(documentComponent).toBlob();
  } catch (error) {
    console.error('PDF blob generation failed:', error);
    throw error;
  }
};

/**
 * Format date in Uzbek style
 */
export const formatLetterDate = (date: Date): string => {
  const months = [
    'yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun',
    'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr'
  ];
  
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  
  return `${day}-${month}, ${year}-yil`;
};

/**
 * Generate unique reference number for letter
 */
export const generateReferenceNumber = (prefix: string = 'LTR'): string => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  
  return `${prefix}-${year}${month}${day}-${random}`;
};

/**
 * Convert file to base64 data URL for use in react-pdf
 */
export const fileToDataURL = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};
