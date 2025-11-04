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
  qrCodeData?: string;
  pageNumber?: number;
  totalPages?: number;
}

// Ограничение: ~1800 символов ≈ 1 страница A4 в PDF
const MAX_PREVIEW_CHARS = 1100;

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
  qrCodeData,
  pageNumber = 1,
  totalPages = 1,
}) => {
  // Обрезаем текст для превью, но оставляем читаемым
  const displayBody = body.length > MAX_PREVIEW_CHARS 
    ? body.substring(0, MAX_PREVIEW_CHARS) + '…' 
    : body;

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
          font-family: 'Montserrat', Times, serif;
          color: #000;
          overflow: hidden;
        }

        .letter-page {
          width: 210mm;
          min-height: 297mm;
          padding: 0;
          margin: 0;
          position: relative;
          box-sizing: border-box;
          background: white;
        }

        .letter-header {
          padding: 20mm 20mm 10mm;
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

        .letter-content {
          padding: 0 20mm;
          margin-top: 10mm;
          margin-bottom: 80mm; /* место для подписи и футера */
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
          text-justify: inter-word;
          word-break: break-word;
          overflow-wrap: break-word;
          hyphens: auto;
        }

        .letter-body p {
          margin-bottom: 5mm;
        }

        .letter-body p:first-child {
          text-indent: 10mm;
        }

        .signature-section {
          position: absolute;
          bottom: 50mm;
          left: 20mm;
          right: 20mm;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .signature-org,
        .signature-qr,
        .signature-signee {
          width: 30%;
        }

        .signature-org { text-align: left; }
        .signature-qr { text-align: center; }
        .signature-signee { text-align: right; }

        .signature-qr svg {
          width: 25mm;
          height: 25mm;
        }

        .signee-name { font-weight: bold; }
        .signee-title { font-style: italic; color: #4a5565; }

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
        }

        .preview-warning {
          background: #fffbeb;
          border: 1px solid #fbbf24;
          color: #92400e;
          padding: 8px 12px;
          border-radius: 6px;
          margin-top: 12px;
          font-size: 13px;
        }
      `}</style>

      <div className="letter-page">
        {/* Header */}
        <div className="letter-header">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            {logoUrl && (
              <div>
                <img src={logoUrl} alt={organizationName} className="header-logo" />
              </div>
            )}
            <div className="header-info">
              <div className="header-org-name">{organizationName}</div>
              {organizationAddress && <div className="header-contact">{organizationAddress}</div>}
              {organizationPhone && <div className="header-contact">Tel: {organizationPhone}</div>}
              {organizationEmail && <div className="header-contact">Email: {organizationEmail}</div>}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="letter-content">
          <div className="letter-meta">
            <div className="letter-reference">№ {reference}</div>
            <div className="letter-date">{formatLetterDate(date)}</div>
          </div>

          <div className="letter-recipient">
            <div className="recipient-name">{recipientName}</div>
            {recipientOrganization && <div>{recipientOrganization}</div>}
            {recipientAddress && <div>{recipientAddress}</div>}
          </div>

          <div className="letter-subject">{subject}</div>

          {/* Исправленная обработка абзацев */}
          <div className="letter-body">
            {displayBody
              .split(/\r?\n\r?\n/)
              .filter(p => p.trim())
              .map((paragraph, idx) => (
                <p key={idx}>
                  {paragraph.split(/\r?\n/).map((line, i, arr) => (
                    <React.Fragment key={i}>
                      {line}
                      {i < arr.length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </p>
              ))}
          </div>
        </div>

        {/* Signature */}
        <div className="signature-section">
          <div className="signature-org">{organizationName}</div>
          {qrCodeData && (
            <div className="signature-qr">
              <QRCodeSVG value={qrCodeData} size={95} level="H" includeMargin={true} />
            </div>
          )}
          <div className="signature-signee">
            <div className="signee-name">{signeeName}</div>
            <div className="signee-title">{signeeTitle}</div>
          </div>
        </div>

        {/* Footer */}
        <div className="letter-footer">
          <div>{organizationName}</div>
          <div>Sahifa {pageNumber}</div>
        </div>
      </div>
    </div>
  );
};

export default LetterPreview;