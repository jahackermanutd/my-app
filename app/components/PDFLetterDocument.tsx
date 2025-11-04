import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  Font,
} from '@react-pdf/renderer';

// Регистрируем русский шрифт для корректного отображения кириллицы
Font.register({
  family: 'Montserrat',
  fonts: [
    { src: '/fonts/Montserrat-Medium.ttf' },
    { src: '/fonts/Montserrat-Bold.ttf', fontWeight: 'bold' },
    { src: '/fonts/Montserrat-MediumItalic.ttf', fontStyle: 'italic' },
    { src: '/fonts/Montserrat-BoldItalic.ttf', fontWeight: 'bold', fontStyle: 'italic' },
  ],
});

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
    position: 'relative',
    fontFamily: 'Montserrat',
  },
  backgroundWatermark: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    opacity: 0.03,
    width: 400,
    height: 400,
  },
  cornerDecoration: {
    position: 'absolute',
    opacity: 0.08,
  },
  topLeftCorner: {
    top: 20,
    left: 20,
    width: 80,
    height: 80,
    borderTop: '3pt solid #fbbf24',
    borderLeft: '3pt solid #fbbf24',
  },
  bottomRightCorner: {
    bottom: 20,
    right: 20,
    width: 80,
    height: 80,
    borderBottom: '3pt solid #fbbf24',
    borderRight: '3pt solid #fbbf24',
  },
  sideAccent: {
    position: 'absolute',
    width: 4,
    backgroundColor: '#fbbf24',
    opacity: 0.15,
  },
  leftAccent: {
    left: 0,
    top: 100,
    bottom: 100,
  },
  rightAccent: {
    right: 0,
    top: 100,
    bottom: 100,
  },
  header: {
    flexDirection: 'column',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottom: '2pt solid #1e293b',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  organizationBlock: {
    flex: 1,
    maxWidth: '70%',
  },
  organizationNameMain: {
    fontSize: 14,
    fontWeight: 700,
    color: '#1e293b',
    marginBottom: 2,
  },
  organizationNameSub: {
    fontSize: 8,
    color: '#64748b',
  },
  headerLogoContainer: {
    marginLeft: 10,
  },
  headerLogo: {
    width: 50,
    height: 50,
    objectFit: 'contain',
  },
  infoLine: {
    fontSize: 8,
    color: '#475569',
    lineHeight: 1.5,
    marginBottom: 2,
    maxWidth: '100%',
  },
  bankInfo: {
    fontSize: 7,
    color: '#64748b',
    lineHeight: 1.5,
    marginTop: 5,
    maxWidth: '100%',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
    marginBottom: 15,
    fontSize: 10,
  },
  reference: {
    fontWeight: 700,
  },
  date: {
    fontStyle: 'italic',
  },
  recipient: {
    marginBottom: 15,
    fontSize: 10,
    lineHeight: 1.4,
    maxWidth: '100%',
  },
  recipientName: {
    fontWeight: 700,
    marginBottom: 3,
  },
  subject: {
    textAlign: 'center',
    fontSize: 11,
    fontWeight: 700,
    marginVertical: 15,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    maxWidth: '100%',
  },
  bodyText: {
    fontSize: 11,
    lineHeight: 1.8,
    textAlign: 'justify',
    marginBottom: 12,
    // Уберите maxWidth, если он был
    // Добавьте:
    overflowWrap: 'break-word', // ← не работает в react-pdf
    // Вместо этого — просто не трогайте, react-pdf сам ломает слова
    bodyTextFirst: {
      textIndent: '0mm' // — по умолчанию 0, можно не указывать
    },
    bodyTextIndented: {
      textIndent: '10mm', // ← отступ только у НЕ первых
    },
  },
  signatureSection: {
    marginTop: 30,
    marginBottom: 40,
  },
  signatureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 40,
  },
  signatureLeft: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    flex: 1,
    maxWidth: '30%',
  },
  signatureCenter: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  signatureRight: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    flex: 1,
    maxWidth: '30%',
  },
  signatureOrgName: {
    fontSize: 10,
    fontWeight: 700,
    marginBottom: 8,
  },
  qrCode: {
    width: 80,
    height: 80,
  },
  signeeName: {
    fontSize: 10,
    fontWeight: 700,
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

// Функция для разбиения длинных слов
const breakLongWords = (text: string, maxLength: number = 40): string => {
  const words = text.split(' ');
  const result: string[] = [];
  
  words.forEach(word => {
    if (word.length > maxLength) {
      // Разбиваем длинное слово на части
      for (let i = 0; i < word.length; i += maxLength) {
        result.push(word.slice(i, i + maxLength));
      }
    } else {
      result.push(word);
    }
  });
  
  return result.join(' ');
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
  // Split body into paragraphs and break long words
  const paragraphs = body.split('\n\n').filter(p => p.trim());

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Background Decorative Elements */}
        {/* Corner Decorations */}
        <View style={[styles.cornerDecoration, styles.topLeftCorner]} fixed />
        <View style={[styles.cornerDecoration, styles.bottomRightCorner]} fixed />
        
        {/* Side Accent Lines */}
        <View style={[styles.sideAccent, styles.leftAccent]} fixed />
        <View style={[styles.sideAccent, styles.rightAccent]} fixed />
        
        {/* Central Watermark - Football/Star Pattern */}
        <View style={styles.backgroundWatermark} fixed>
          <Text style={{ fontSize: 200, color: '#cbd5e1', textAlign: 'center' }}>⚽</Text>
        </View>
        
        {/* Header - Only on first page */}
        <View style={styles.header}>
          {/* Organization Name and Logo */}
          <View style={styles.headerRow}>
            <View style={styles.organizationBlock}>
              <Text style={styles.organizationNameMain}>PFK AGMK MChJ</Text>
              <Text style={styles.organizationNameSub}>Professional Football Club</Text>
            </View>
            {logoUrl && (
              <View style={styles.headerLogoContainer}>
                <Image src={logoUrl} style={styles.headerLogo} />
              </View>
            )}
          </View>
          
          {/* Contact Information */}
          <Text style={styles.infoLine}>
            Toshkent viloyati, Olmaliq shahri, Olimpiya ko'chasi, Metallurg stadioni
          </Text>
          <Text style={styles.infoLine}>
            Email: pfcolmaliq@mail.ru
          </Text>
          
          {/* Bank Information */}
          <Text style={styles.bankInfo}>
            "O'zmilliybank" AJ Olmaliq filiali  |  h/r: 2020 8000 6047 5378 1001  |  MFO: 00450  |  STIR: 301023341
          </Text>
        </View>

        {/* Meta Information */}
        <View style={styles.metaRow}>
          <Text style={styles.reference}>Ref: {reference}</Text>
          <Text style={styles.date}>{formatDate(date)}</Text>
        </View>

        {/* Recipient */}
        <View style={styles.recipient}>
          <Text style={styles.recipientName}>{breakLongWords(recipientName)}</Text>
          {recipientOrganization && <Text>{breakLongWords(recipientOrganization)}</Text>}
          {recipientAddress && <Text>{breakLongWords(recipientAddress)}</Text>}
        </View>

        {/* Subject */}
        <Text style={styles.subject}>{breakLongWords(subject)}</Text>

        {/* Body - Natural text flow */}
        {paragraphs.map((paragraph, index) => (
      <Text
        key={index}
        style={[
          styles.bodyText,
          index === 0 ? styles.bodyTextFirst : styles.bodyTextIndented
        ]}
      >
        {paragraph}
      </Text>
    ))}

        {/* Signature Section - Keep together on same page */}
        <View style={styles.signatureSection} wrap={false}>
          <View style={styles.signatureRow}>
            {/* Left: Organization Name */}
            <View style={styles.signatureLeft}>
              <Text style={styles.signatureOrgName}>{breakLongWords(organizationName, 20)}</Text>
            </View>
            
            {/* Center: QR Code */}
            <View style={styles.signatureCenter}>
              {qrCodeUrl && (
                <Image src={qrCodeUrl} style={styles.qrCode} />
              )}
            </View>
            
            {/* Right: Signee Information */}
            <View style={styles.signatureRight}>
              <Text style={styles.signeeName}>{breakLongWords(signeeName, 20)}</Text>
              <Text style={styles.signeeTitle}>{breakLongWords(signeeTitle, 20)}</Text>
            </View>
          </View>
        </View>

        {/* Footer - Natural flow */}
        <View style={styles.footer} fixed>
          <Text>{breakLongWords(organizationName, 30)}</Text>
          <Text render={({ pageNumber, totalPages }) => (
            `Page ${pageNumber} of ${totalPages}`
          )} />
        </View>
      </Page>
    </Document>
  );
};