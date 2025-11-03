import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface LetterConfig {
  organizationName: string;
  organizationAddress?: string;
  organizationPhone?: string;
  organizationEmail?: string;
  logoUrl?: string;
  watermarkUrl?: string;
}

export interface SignatureData {
  signeeName: string;
  signeeTitle: string;
  organizationName: string;
  qrCodeUrl: string;
  signatureDate?: string;
}

/**
 * Generate PDF from HTML element with A4 format
 */
export const generateLetterPDF = async (
  elementId: string,
  fileName: string = 'letter.pdf'
): Promise<void> => {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(`Element with id "${elementId}" not found`);
  }

  // Create canvas from HTML with high quality
  const canvas = await html2canvas(element, {
    scale: 3, // Higher quality for crisp text
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff',
    windowWidth: 794, // A4 width in pixels at 96 DPI
    windowHeight: 1123, // A4 height in pixels at 96 DPI
  });

  // A4 dimensions in mm
  const a4Width = 210;
  const a4Height = 297;

  // Calculate dimensions to fit A4
  const imgWidth = a4Width;
  const imgHeight = (canvas.height * a4Width) / canvas.width;

  // Create PDF with A4 format
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  let heightLeft = imgHeight;
  let position = 0;

  // Add first page
  const imgData = canvas.toDataURL('image/png', 1.0);
  pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
  heightLeft -= a4Height;

  // Add additional pages if content exceeds one page
  while (heightLeft > 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
    heightLeft -= a4Height;
  }

  // Save PDF
  pdf.save(fileName);
};

/**
 * Generate QR code data URL
 */
export const generateQRCode = async (text: string): Promise<string> => {
  const QRCode = (await import('qrcode')).default;
  return QRCode.toDataURL(text, {
    errorCorrectionLevel: 'H',
    margin: 1,
    width: 200,
  });
};

/**
 * Create letter reference for QR code
 */
export const createLetterReference = (letterId: string): string => {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  return `${baseUrl}/verify/${letterId}`;
};

/**
 * Format date for letter
 */
export const formatLetterDate = (date: Date = new Date()): string => {
  const months = [
    'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun',
    'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'
  ];
  
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  
  return `${day} ${month} ${year} yil`;
};
