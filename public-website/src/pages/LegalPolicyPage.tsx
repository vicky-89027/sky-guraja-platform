import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  FileText,
  RefreshCw,
  Truck,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  Lock,
  HeartHandshake,
  HelpCircle
} from 'lucide-react';
import { SkyLogo } from '../components/SkyLogo';

interface LegalPolicyPageProps {
  initialPolicy?: 'terms' | 'privacy' | 'refund' | 'shipping' | 'contact';
  onNavigateTab?: (tab: string) => void;
}

export const LegalPolicyPage: React.FC<LegalPolicyPageProps> = ({
  initialPolicy = 'terms',
  onNavigateTab
}) => {
  const [selectedPolicy, setSelectedPolicy] = useState<'terms' | 'privacy' | 'refund' | 'shipping' | 'contact'>(initialPolicy);

  useEffect(() => {
    setSelectedPolicy(initialPolicy);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [initialPolicy]);

  const policies = [
    { id: 'terms', label: 'Terms & Conditions', icon: FileText },
    { id: 'privacy', label: 'Privacy Policy', icon: ShieldCheck },
    { id: 'refund', label: 'Refund & Cancellation', icon: RefreshCw },
    { id: 'shipping', label: 'Shipping & Delivery', icon: Truck },
    { id: 'contact', label: 'Contact & Grievances', icon: Phone }
  ] as const;

  return (
    <div className="w-full bg-[#030914] min-h-screen text-slate-100 pb-20">
      {/* Header Banner */}
      <div className="bg-gradient-to-b from-[#08152B] via-[#050E1C] to-[#030914] border-b border-amber-500/20 py-12 px-4">
        <div className="max-w-5xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold font-mono uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            Official Regulatory & Legal Disclosures
          </div>
          <h1 className="text-3xl sm:text-4xl font-black font-display uppercase tracking-tight text-white">
            Policies & Terms of Service
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Sri Krishna Yadav Youth Guraja (SKY Guraja) is committed to complete transparency, donor data privacy, and strict legal compliance in line with Indian regulatory standards.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 lg:px-8 pt-8">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 bg-white/5 rounded-2xl border border-white/10 mb-10 max-w-4xl mx-auto backdrop-blur-sm">
          {policies.map((p) => {
            const Icon = p.icon;
            const active = selectedPolicy === p.id;
            return (
              <button
                key={p.id}
                onClick={() => {
                  setSelectedPolicy(p.id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  active
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-lg shadow-amber-500/20 font-black'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{p.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Box */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-10 backdrop-blur-md space-y-8 max-w-4xl mx-auto text-slate-300 text-xs sm:text-sm leading-relaxed shadow-2xl">
          {/* TERMS & CONDITIONS */}
          {selectedPolicy === 'terms' && (
            <div className="space-y-6">
              <div className="border-b border-white/10 pb-4">
                <h2 className="text-2xl font-black font-display text-white">Terms and Conditions</h2>
                <p className="text-xs text-amber-400 font-mono mt-1">Last Updated: January 2026</p>
              </div>

              <div className="space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  1. Organization Mandate & Acceptance of Terms
                </h3>
                <p>
                  Welcome to the official digital portal of <strong>Sri Krishna Yadav Youth Guraja (SKY Guraja)</strong>. By accessing our platform, contributing donations, enrolling as a youth volunteer, or participating in temple festival activities, you unconditionally agree to adhere to these Terms of Service.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  2. Voluntary Contributions & Non-Commercial Nature
                </h3>
                <p>
                  All contributions collected through Razorpay, UPI, or cash representatives are purely voluntary and utilized strictly towards community temple celebrations (Sri Krishna Janmashtami, Vaikasi Utsavams), youth educational assistance, healthcare camps, and infrastructure welfare in Guraja Village, Krishna District, Andhra Pradesh.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  3. Digital Receipts & Ledger Integrity
                </h3>
                <p>
                  Every successful online transaction generates a tamper-evident digital receipt bearing a sequential receipt identifier (<code className="text-amber-300 bg-black/40 px-1.5 py-0.5 rounded">SKY-REC-YYYY-XXXX</code>) and cryptographic security verification code. Users can instantly verify their contribution on our public ledger.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  4. Governing Law & Jurisdiction
                </h3>
                <p>
                  These terms are governed in accordance with the laws of India. Any disputes arising in connection with the platform or organization activities are subject to the exclusive jurisdiction of the competent courts in Krishna District, Andhra Pradesh.
                </p>
              </div>
            </div>
          )}

          {/* PRIVACY POLICY */}
          {selectedPolicy === 'privacy' && (
            <div className="space-y-6">
              <div className="border-b border-white/10 pb-4">
                <h2 className="text-2xl font-black font-display text-white">Privacy Policy</h2>
                <p className="text-xs text-amber-400 font-mono mt-1">Effective Date: January 1, 2026</p>
              </div>

              <div className="space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Lock className="w-4 h-4 text-amber-400" />
                  1. Information We Collect
                </h3>
                <p>
                  When you contribute or register on our platform, we collect minimal necessary details including your Full Name, Mobile Number, Email Address, Village/Location, Gotram/Family details (for Pooja sankalpam), and Transaction reference numbers. We <strong>never</strong> store sensitive credit/debit card PINs or net banking passwords.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Lock className="w-4 h-4 text-amber-400" />
                  2. Use of Donor Information
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-slate-300">
                  <li>To process voluntary contributions via RBI-authorized payment gateways (Razorpay/UPI).</li>
                  <li>To issue official digital donation receipts and send WhatsApp/SMS/Email confirmations.</li>
                  <li>To maintain community ledger accounting and statutory audit records.</li>
                  <li>To provide updates on annual festival events and welfare programs.</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Lock className="w-4 h-4 text-amber-400" />
                  3. Zero Commercial Selling & Data Protection
                </h3>
                <p>
                  We maintain a strict zero-spam and zero-data-sharing policy. We do not sell, rent, or trade your personal information to third-party telemarketers or marketing agencies under any circumstances.
                </p>
              </div>
            </div>
          )}

          {/* REFUND & CANCELLATION */}
          {selectedPolicy === 'refund' && (
            <div className="space-y-6">
              <div className="border-b border-white/10 pb-4">
                <h2 className="text-2xl font-black font-display text-white">Refund & Cancellation Policy</h2>
                <p className="text-xs text-amber-400 font-mono mt-1">Applicable to all online transactions</p>
              </div>

              <div className="space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-amber-400" />
                  1. General Policy on Donations
                </h3>
                <p>
                  Since all contributions received by <strong>Sri Krishna Yadav Youth Guraja</strong> are voluntary offerings and charitable donations for socio-religious activities, donations are generally non-refundable once allocated.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-amber-400" />
                  2. Erroneous / Double Payment Resolution
                </h3>
                <p>
                  If a duplicate transaction or incorrect amount occurs due to technical glitches or network timeouts:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-slate-300">
                  <li>The donor must notify us via email at <a href="mailto:contact@skyguraja.org" className="text-amber-400 underline">contact@skyguraja.org</a> or phone at <strong className="text-white">+91 98480 22334</strong> within <strong>7 days</strong> of the transaction.</li>
                  <li>Please provide the Payment ID, Receipt Number, Date, and proof of deduction.</li>
                  <li>Upon verification with Razorpay banking logs, the duplicate amount will be refunded directly to the source payment method within <strong>5 to 7 business days</strong>.</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-amber-400" />
                  3. Event / Pooja Cancellation
                </h3>
                <p>
                  In the rare scenario where a specific festival event or seva cannot take place due to unforeseen circumstances, the seva contribution will be rescheduled to an auspicious date or adjusted upon consultation with the donor.
                </p>
              </div>
            </div>
          )}

          {/* SHIPPING & DELIVERY */}
          {selectedPolicy === 'shipping' && (
            <div className="space-y-6">
              <div className="border-b border-white/10 pb-4">
                <h2 className="text-2xl font-black font-display text-white">Shipping & Service Delivery Policy</h2>
                <p className="text-xs text-amber-400 font-mono mt-1">Instant Digital Delivery & Prasad Distribution</p>
              </div>

              <div className="space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Truck className="w-4 h-4 text-amber-400" />
                  1. Digital Service Fulfillment (Instant Delivery)
                </h3>
                <p>
                  As an NGO and community organization, our primary offerings are voluntary community donations and pooja sevas:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-slate-300">
                  <li><strong>Instant E-Receipt:</strong> Downloadable immediately upon transaction completion on screen.</li>
                  <li><strong>Digital Confirmation:</strong> Dispatched within <strong>2 to 5 minutes</strong> via SMS/Email/WhatsApp with the official security QR code.</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Truck className="w-4 h-4 text-amber-400" />
                  2. Physical Temple Prasadam & Annadanam
                </h3>
                <p>
                  For sponsors of festival sevas, Prasadam is distributed directly at Yadav Youth Bhavan / Temple premises during festival days. In case postal dispatch of dry Prasadam / Raksha is requested, it is dispatched via India Post Registered Parcel within <strong>3 to 5 business days</strong> following the event.
                </p>
              </div>
            </div>
          )}

          {/* CONTACT & GRIEVANCE */}
          {selectedPolicy === 'contact' && (
            <div className="space-y-6">
              <div className="border-b border-white/10 pb-4">
                <h2 className="text-2xl font-black font-display text-white">Grievance Redressal & Official Contact</h2>
                <p className="text-xs text-amber-400 font-mono mt-1">Authorized Representatives for Regulatory Verification</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-2">
                  <div className="text-xs font-bold text-amber-400 uppercase font-mono">Organization Office</div>
                  <div className="font-bold text-white text-sm">Sri Krishna Yadav Youth Guraja</div>
                  <div className="flex items-start gap-2 text-xs text-slate-300">
                    <MapPin className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    <span>Yadav Youth Bhavan, Main Road, Guraja, Krishna District, Andhra Pradesh - 521321, India</span>
                  </div>
                </div>

                <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-2">
                  <div className="text-xs font-bold text-amber-400 uppercase font-mono">Grievance & Support Desk</div>
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <Phone className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    <span>+91 98480 22334 / +91 98480 11111</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <Mail className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    <span>contact@skyguraja.org / support@skyguraja.org</span>
                  </div>
                  <div className="text-[11px] text-slate-400 pt-1">
                    Response SLA: Within 24-48 Business Hours
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LegalPolicyPage;
