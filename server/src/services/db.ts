import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export interface User {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  role: 'USER' | 'MEMBER' | 'ADMIN' | 'SUPER_ADMIN';
  village: string;
  createdAt: string;
}

export interface Contribution {
  id: string;
  contributorName: string;
  phone: string;
  email?: string;
  address?: string;
  campaignId: string;
  campaignTitle: string;
  amount: number;
  amountInWords: string;
  paymentMethod: 'UPI' | 'CASH';
  status: 'PENDING' | 'VERIFIED' | 'FAILED' | 'VOIDED';
  createdAt: string;
  receiptNumber?: string;
  verificationToken?: string;
}

export interface PaymentTransaction {
  id: string;
  contributionId: string;
  gatewayPaymentId?: string;
  orderId?: string;
  signature?: string;
  cashRecordedByMemberId?: string;
  cashRecordedByMemberName?: string;
  cashReferenceNo?: string;
  status: 'PENDING' | 'VERIFIED' | 'FAILED' | 'VOIDED';
  timestamp: string;
}

export interface Receipt {
  id: string;
  receiptNumber: string;
  contributionId: string;
  verificationToken: string;
  qrCodeUrl: string;
  issueDate: string;
  issueTime: string;
  status: 'ISSUED' | 'VOIDED';
  signatoryTitle: string;
  pdfUrl?: string;
}

export interface AuditLog {
  id: string;
  action: 'CASH_RECEIVED' | 'UPI_PAYMENT_INITIATED' | 'UPI_PAYMENT_VERIFIED' | 'RECEIPT_GENERATED' | 'RECEIPT_VERIFIED' | 'RECEIPT_VOIDED';
  userId?: string;
  userName?: string;
  details: string;
  timestamp: string;
}

export interface OrganizationSettings {
  orgName: string;
  subTitle: string;
  tagline: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  receiptPrefix: string;
  financialYear: string;
  authorizedSignatory: string;
}

export interface DBData {
  users: User[];
  contributions: Contribution[];
  transactions: PaymentTransaction[];
  receipts: Receipt[];
  auditLogs: AuditLog[];
  settings: OrganizationSettings;
  receiptSequence: number;
}

const DATA_FILE = path.join(process.cwd(), 'data', 'database.json');

// Ensure data folder exists
if (!fs.existsSync(path.dirname(DATA_FILE))) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
}

function getDefaultData(): DBData {
  return {
    users: [
      {
        id: 'usr-admin-01',
        fullName: 'Venkata Krishna Yadav',
        phone: '9848011111',
        email: 'admin@skyouthguraja.org',
        role: 'SUPER_ADMIN',
        village: 'Guraja',
        createdAt: new Date().toISOString()
      },
      {
        id: 'usr-treasurer-01',
        fullName: 'Ramesh Yadav',
        phone: '9848044444',
        email: 'treasurer@skyouthguraja.org',
        role: 'MEMBER',
        village: 'Guraja',
        createdAt: new Date().toISOString()
      }
    ],
    contributions: [],
    transactions: [],
    receipts: [],
    auditLogs: [
      {
        id: 'audit-001',
        action: 'RECEIPT_GENERATED',
        userId: 'system',
        userName: 'System Initialization',
        details: 'Initialized Sri Krishna Yadav Youth Guraja Database & Security Ledger',
        timestamp: new Date().toISOString()
      }
    ],
    settings: {
      orgName: 'SRI KRISHNA YADAV YOUTH GURAJA',
      subTitle: 'Sri Krishna Yadav Youth Association',
      tagline: 'UNITY • YOUTH • SERVICE • COMMUNITY • PROGRESS',
      address: 'Guraja Village, Krishna District, Andhra Pradesh, India - 521321',
      phone: '+91 98765 43210',
      email: 'info@skyouthguraja.org',
      website: 'https://skyouthguraja.org',
      receiptPrefix: 'SKYG',
      financialYear: '26-27',
      authorizedSignatory: 'President / Treasurer'
    },
    receiptSequence: 0
  };
}

export function loadDB(): DBData {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading database file, using defaults:', err);
  }
  const defaults = getDefaultData();
  saveDB(defaults);
  return defaults;
}

export function saveDB(data: DBData): void {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving database file:', err);
  }
}

// Convert amount in numbers to words (Indian numbering system)
export function numberToWords(num: number): string {
  if (num === 0) return 'Rupees Zero Only';

  const a = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
    'Seventeen', 'Eighteen', 'Nineteen'
  ];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  function convertHundreds(n: number): string {
    let str = '';
    if (n > 99) {
      str += a[Math.floor(n / 100)] + ' Hundred ';
      n %= 100;
    }
    if (n > 19) {
      str += b[Math.floor(n / 10)] + ' ' + a[n % 10];
    } else if (n > 0) {
      str += a[n];
    }
    return str.trim();
  }

  let words = '';
  const crore = Math.floor(num / 10000000);
  num %= 10000000;
  const lakh = Math.floor(num / 100000);
  num %= 100000;
  const thousand = Math.floor(num / 1000);
  num %= 1000;
  const hundreds = num;

  if (crore > 0) words += convertHundreds(crore) + ' Crore ';
  if (lakh > 0) words += convertHundreds(lakh) + ' Lakh ';
  if (thousand > 0) words += convertHundreds(thousand) + ' Thousand ';
  if (hundreds > 0) words += convertHundreds(hundreds);

  return `Rupees ${words.trim()} Only`;
}

// Generate sequential collision-proof receipt number
export function generateNextReceiptNumber(db: DBData): string {
  db.receiptSequence += 1;
  const seq = String(db.receiptSequence).padStart(6, '0');
  return `${db.settings.receiptPrefix}/${db.settings.financialYear}/${seq}`;
}

// Generate cryptographic verification token
export function generateVerificationToken(): string {
  const rand = crypto.randomBytes(6).toString('hex').toUpperCase();
  return `SKYG-VERIFY-${rand.slice(0, 4)}-${rand.slice(4, 8)}-${rand.slice(8, 12)}`;
}
