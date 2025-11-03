import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from '@react-pdf/renderer';

export interface PDFLetterProps {
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
  qrCodeUrl?: string;
}

// Create styles with proper spacing to prevent overlapping
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: '20mm',
    fontSize: 12,
    lineHeight: 1.5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
    paddingBottom: 10,
    borderBottom: '2pt solid #1e293d',
  },
  headerLogo: {
    width: 60,
    height: 30,
    objectFit: 'contain',
  },
  headerInfo: {
    textAlign: 'right',
    fontSize: 10,
  },
  organizationName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e293d',
    marginBottom: 3,
  },
  contactInfo: {
    fontSize: 9,
    color: '#4a5565',
    marginTop: 2,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 10,
    fontSize: 10,
  },
  reference: {
    fontWeight: 'bold',
  },
  date: {
    fontStyle: 'italic',
  },
  recipient: {
    marginBottom: 10,
    fontSize: 11,
    lineHeight: 1.5,
  },
  recipientName: {
    fontWeight: 'bold',
  },
  subject: {
    textAlign: 'center',
    fontSize: 12,
    fontWeight: 'bold',
    marginVertical: 15,
    textTransform: 'uppercase',
  },
  bodyText: {
    fontSize: 12,
    lineHeight: 1.6,
    textAlign: 'justify',
    marginBottom: 10,
  },
  signatureSection: {
    marginTop: 40,
    marginBottom: 20,
  },
  signatureRow: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  signatureOrgName: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  qrCode: {
    width: 70,
    height: 70,
    marginVertical: 10,
  },
  signeeName: {
    fontSize: 11,
    fontWeight: 'bold',
    marginTop: 10,
  },
  signeeTitle: {
    fontSize: 10,
    color: '#4a5565',
    marginTop: 3,
  },
  footer: {
    marginTop: 20,
    paddingTop: 10,
    borderTop: '1pt solid #e2e8f0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 9,
    color: '#4a5565',
  },
});

const formatDate = (date: Date): string => {
  const months = [
    'yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun',
    'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr'
  ];
  
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  
  return `${day}-${month}, ${year}-yil`;
};

export const PDFLetterDocument: React.FC<PDFLetterProps> = ({
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
  qrCodeUrl,
}) => {
  // Split body into paragraphs
  const paragraphs = body.split('\n').filter(p => p.trim());

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header - Fixed at top */}
        <View style={styles.header}>
          <View>
            {logoUrl && <Image src={logoUrl} style={styles.headerLogo} />}
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.organizationName}>{organizationName}</Text>
            {organizationAddress && (
              <Text style={styles.contactInfo}>{organizationAddress}</Text>
            )}
            {organizationPhone && (
              <Text style={styles.contactInfo}>Tel: {organizationPhone}</Text>
            )}
            {organizationEmail && (
              <Text style={styles.contactInfo}>Email: {organizationEmail}</Text>
            )}
          </View>
        </View>

        {/* Meta Information */}
        <View style={styles.metaRow}>
          <Text style={styles.reference}>Ref: {reference}</Text>
          <Text style={styles.date}>{formatDate(date)}</Text>
        </View>

        {/* Recipient */}
        <View style={styles.recipient}>
          <Text style={styles.recipientName}>{recipientName}</Text>
          {recipientOrganization && <Text>{recipientOrganization}</Text>}
          {recipientAddress && <Text>{recipientAddress}</Text>}
        </View>

        {/* Subject */}
        <Text style={styles.subject}>{subject}</Text>

        {/* Body - Natural text flow */}
        {paragraphs.map((paragraph, index) => (
          <Text key={index} style={styles.bodyText}>
            {paragraph}
          </Text>
        ))}

        {/* Signature Section */}
        <View style={styles.signatureSection}>
          <View style={styles.signatureRow}>
            <Text style={styles.signatureOrgName}>{organizationName}</Text>
            
            {qrCodeUrl && (
              <Image src={qrCodeUrl} style={styles.qrCode} />
            )}
            
            <Text style={styles.signeeName}>{signeeName}</Text>
            <Text style={styles.signeeTitle}>{signeeTitle}</Text>
          </View>
        </View>

        {/* Footer - Natural flow */}
        <View style={styles.footer}>
          <Text>{organizationName}</Text>
          <Text>Page 1</Text>
        </View>
      </Page>
    </Document>
  );
};
