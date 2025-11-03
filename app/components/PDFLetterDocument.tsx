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
    paddingTop: 40,
    paddingBottom: 60,
    paddingHorizontal: 50,
    fontSize: 11,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
    paddingBottom: 12,
    borderBottom: '2pt solid #1e293d',
  },
  headerLogo: {
    width: 60,
    height: 30,
    objectFit: 'contain',
  },
  headerInfo: {
    textAlign: 'right',
    fontSize: 9,
    lineHeight: 1.4,
  },
  organizationName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1e293d',
    marginBottom: 4,
  },
  contactInfo: {
    fontSize: 8,
    color: '#4a5565',
    marginTop: 2,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
    marginBottom: 15,
    fontSize: 10,
  },
  reference: {
    fontWeight: 'bold',
  },
  date: {
    fontStyle: 'italic',
  },
  recipient: {
    marginBottom: 15,
    fontSize: 10,
    lineHeight: 1.4,
  },
  recipientName: {
    fontWeight: 'bold',
    marginBottom: 3,
  },
  subject: {
    textAlign: 'center',
    fontSize: 11,
    fontWeight: 'bold',
    marginVertical: 15,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  bodyText: {
    fontSize: 11,
    lineHeight: 1.8,
    textAlign: 'justify',
    marginBottom: 12,
  },
  signatureSection: {
    marginTop: 30,
    marginBottom: 40,
  },
  signatureRow: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  signatureOrgName: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  qrCode: {
    width: 60,
    height: 60,
    marginVertical: 8,
  },
  signeeName: {
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: 8,
  },
  signeeTitle: {
    fontSize: 9,
    color: '#4a5565',
    marginTop: 2,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 50,
    right: 50,
    paddingTop: 10,
    borderTop: '1pt solid #e2e8f0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 8,
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
        {/* Header - Only on first page */}
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

        {/* Signature Section - Keep together on same page */}
        <View style={styles.signatureSection} wrap={false}>
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
        <View style={styles.footer} fixed>
          <Text>{organizationName}</Text>
          <Text render={({ pageNumber, totalPages }) => (
            `Page ${pageNumber} of ${totalPages}`
          )} />
        </View>
      </Page>
    </Document>
  );
};
