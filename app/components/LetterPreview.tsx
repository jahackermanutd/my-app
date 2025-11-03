'use client';

import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { formatLetterDate } from '../lib/letterPDF';

export interface LetterPreviewProps {
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
  qrCodeData?: string;
  pageNumber?: number;
  totalPages?: number;
}

const LetterPreview: React.FC<LetterPreviewProps> = ({
  reference,
  date = new Date(),
  subject,
  recipientName,
  recipientOrganization,
  recipientAddress,
  body,
  signeeName,
  signeeTitle,
  organizationName,
  organizationAddress,
  organizationPhone,
  organizationEmail,
  logoUrl,
  watermarkUrl,
  qrCodeData,
  pageNumber = 1,
  totalPages = 1,
}) => {
  return (
    <div className="letter-preview">
      <style jsx>{`
        .letter-preview {
          width: 210mm;
          min-height: 297mm;
          background: white;
          margin: 0 auto;
          padding: 0;
          position: relative;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          font-family: 'Times New Roman', Times, serif;
          color: #000;
        }

        .letter-page {
          width: 210mm;
          height: 297mm;
          padding: 0;
          margin: 0;
          position: relative;
          page-break-after: always;
          box-sizing: border-box;
          background: white;
        }

        .letter-header {
          position: absolute;
          top: 20mm;
          left: 20mm;
          right: 20mm;
          height: 40mm;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          padding-bottom: 10mm;
          border-bottom: 2px solid #1e293d;
        }

        .header-logo {
          max-width: 60mm;
          max-height: 30mm;
          object-fit: contain;
        }

        .header-info {
          text-align: right;
          font-size: 10pt;
          line-height: 1.4;
        }

        .header-org-name {
          font-size: 14pt;
          font-weight: bold;
          color: #1e293d;
          margin-bottom: 3mm;
        }

        .header-contact {
          font-size: 9pt;
          color: #4a5565;
        }

        .letter-content-wrapper {
          position: absolute;
          top: 70mm;
          left: 20mm;
          right: 20mm;
          bottom: 40mm;
        }

        .letter-meta {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8mm;
          font-size: 10pt;
        }

        .letter-reference {
          font-weight: bold;
        }

        .letter-date {
          font-style: italic;
        }

        .letter-recipient {
          margin-bottom: 8mm;
          font-size: 11pt;
          line-height: 1.5;
        }

        .recipient-name {
          font-weight: bold;
        }

        .letter-subject {
          text-align: center;
          font-size: 12pt;
          font-weight: bold;
          margin: 10mm 0;
          text-transform: uppercase;
        }

        .letter-body {
          font-size: 11pt;
          line-height: 1.6;
          text-align: justify;
          margin-bottom: 15mm;
          text-justify: inter-word;
          word-spacing: normal;
        }

        .letter-body p {
          margin-bottom: 5mm;
          text-indent: 10mm;
        }

        .letter-body p:first-child {
          text-indent: 0;
        }

        .signature-section {
          position: absolute;
          bottom: 50mm;
          right: 20mm;
          width: 80mm;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .signature-org {
          font-size: 11pt;
          font-weight: bold;
          margin-bottom: 5mm;
          text-align: center;
        }

        .signature-qr {
          margin: 5mm 0;
          display: flex;
          justify-content: center;
        }

        .signature-qr svg {
          width: 25mm;
          height: 25mm;
        }

        .signature-signee {
          font-size: 11pt;
          text-align: center;
          margin-top: 3mm;
        }

        .signee-name {
          font-weight: bold;
        }

        .signee-title {
          font-style: italic;
          color: #4a5565;
        }

        .letter-footer {
          position: absolute;
          bottom: 15mm;
          left: 20mm;
          right: 20mm;
          border-top: 1px solid #e2e8f0;
          padding-top: 3mm;
          font-size: 9pt;
          color: #4a5565;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .watermark {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          opacity: 0.05;
          width: 150mm;
          height: 150mm;
          object-fit: contain;
          pointer-events: none;
          z-index: 0;
        }

        @media print {
          .letter-preview {
            box-shadow: none;
            margin: 0;
          }

          .letter-page {
            page-break-after: always;
            margin: 0;
            padding: 0;
          }

          @page {
            size: A4;
            margin: 0;
          }
        }
      `}</style>

      <div className="letter-page">
        {/* Watermark */}
        {watermarkUrl && (
          <img src={watermarkUrl} alt="" className="watermark" />
        )}

        {/* Header - Fixed at top */}
        <div className="letter-header">
          <div>
            {logoUrl && (
              <img src={logoUrl} alt={organizationName} className="header-logo" />
            )}
          </div>
          <div className="header-info">
            <div className="header-org-name">{organizationName}</div>
            {organizationAddress && (
              <div className="header-contact">{organizationAddress}</div>
            )}
            {organizationPhone && (
              <div className="header-contact">Tel: {organizationPhone}</div>
            )}
            {organizationEmail && (
              <div className="header-contact">Email: {organizationEmail}</div>
            )}
          </div>
        </div>

        {/* Content Area - Between header and footer */}
        <div className="letter-content-wrapper">
          {/* Meta Information */}
          <div className="letter-meta">
            <div className="letter-reference">№ {reference}</div>
            <div className="letter-date">{formatLetterDate(date)}</div>
          </div>

          {/* Recipient */}
          <div className="letter-recipient">
            <div className="recipient-name">{recipientName}</div>
            {recipientOrganization && <div>{recipientOrganization}</div>}
            {recipientAddress && <div>{recipientAddress}</div>}
          </div>

          {/* Subject */}
          <div className="letter-subject">{subject}</div>

          {/* Body */}
          <div className="letter-body">
            {body.split('\n').map((paragraph, index) => (
              paragraph.trim() && <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>

        {/* Signature - Fixed position above footer */}
        <div className="signature-section">
          <div className="signature-org">{organizationName}</div>
          
          {qrCodeData && (
            <div className="signature-qr">
              <QRCodeSVG 
                value={qrCodeData}
                size={95}
                level="H"
                includeMargin={true}
              />
            </div>
          )}

          <div className="signature-signee">
            <div className="signee-name">{signeeName}</div>
            <div className="signee-title">{signeeTitle}</div>
          </div>
        </div>

        {/* Footer - Fixed at bottom */}
        <div className="letter-footer">
          <div>{organizationName}</div>
          <div>Sahifa {pageNumber} / {totalPages}</div>
        </div>
      </div>
    </div>
  );
};

export default LetterPreview;
