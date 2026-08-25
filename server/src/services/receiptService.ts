import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { DB } from '../db/database';

export class ReceiptService {
  /**
   * Generates the next sequential receipt number
   */
  static async generateNextReceiptNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const countRow = await DB.get<{ count: number }>(
      `SELECT COUNT(*) as count FROM receipts WHERE receipt_number LIKE ?`,
      [`SKY-REC-${year}-%`]
    );
    const nextSeq = ((countRow?.count || 0) + 1).toString().padStart(4, '0');
    return `SKY-REC-${year}-${nextSeq}`;
  }

  /**
   * Creates a tamper-evident digital receipt record
   */
  static async createReceipt(
    contributionId: string,
    donorName: string,
    amount: number,
    date: string,
    campaignName: string,
    paymentMethod: string,
    referenceNo: string | null,
    collectorName: string
  ): Promise<{ receiptId: string; receiptNumber: string; qrData: string; securityHash: string }> {
    const receiptNumber = await ReceiptService.generateNextReceiptNumber();
    const receiptId = `rec-${uuidv4().substring(0, 8)}`;

    const rawData = `${receiptNumber}|${donorName}|${amount}|${date}|${campaignName}|${referenceNo || 'N/A'}`;
    const securityHash = crypto.createHash('sha256').update(rawData).digest('hex').substring(0, 16).toUpperCase();

    const qrData = JSON.stringify({
      receiptNo: receiptNumber,
      org: 'Sri Krishna Yadav Youth Guraja',
      donor: donorName,
      amount: amount,
      date: date,
      hash: securityHash,
      verifyUrl: `https://skyguraja.org/verify-receipt/${receiptNumber}`
    });

    await DB.run(
      `INSERT INTO receipts (
        id, receipt_number, contribution_id, donor_name, amount, date,
        campaign_name, payment_method, reference_no, collector_name,
        verification_status, qr_code_data, security_hash, issued_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'VERIFIED', ?, ?, datetime('now'))`,
      [
        receiptId,
        receiptNumber,
        contributionId,
        donorName,
        amount,
        date,
        campaignName,
        paymentMethod,
        referenceNo || 'N/A',
        collectorName,
        qrData,
        securityHash
      ]
    );

    return { receiptId, receiptNumber, qrData, securityHash };
  }

  /**
   * Converts numerical amount to Indian Rupees words
   */
  static amountToWords(num: number): string {
    const a = [
      '', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ',
      'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '
    ];
    const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    if (num === 0) return 'Zero Rupees Only';

    function inWords(n: number): string {
      let str = '';
      if (n > 9999999) {
        str += inWords(Math.floor(n / 10000000)) + 'Crore ';
        n %= 10000000;
      }
      if (n > 99999) {
        str += inWords(Math.floor(n / 100000)) + 'Lakh ';
        n %= 100000;
      }
      if (n > 999) {
        str += inWords(Math.floor(n / 1000)) + 'Thousand ';
        n %= 1000;
      }
      if (n > 99) {
        str += inWords(Math.floor(n / 100)) + 'Hundred ';
        n %= 100;
      }
      if (n > 0) {
        if (str !== '') str += 'and ';
        if (n < 20) {
          str += a[n];
        } else {
          str += b[Math.floor(n / 10)] + ' ' + a[n % 10];
        }
      }
      return str;
    }

    return `${inWords(Math.floor(num)).trim()} Rupees Only`;
  }
}
