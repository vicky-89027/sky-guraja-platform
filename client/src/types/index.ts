export type UserRole = 'SUPER_ADMIN' | 'PRESIDENT' | 'SECRETARY' | 'TREASURER' | 'MEMBER' | 'AUDITOR' | 'PUBLIC';

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  fullName: string;
  memberId?: string;
}

export interface FinancialSummary {
  openingBalance: number;
  totalVerifiedContributions: number;
  totalVerifiedIncome: number;
  totalPaidExpenses: number;
  totalApprovedRefunds: number;
  currentAvailableBalance: number;
  pendingCollections: number;
  pendingExpenses: number;
  totalEntriesCount: number;
  activeCampaignsCount?: number;
  activeMembersCount?: number;
  upcomingEventsCount?: number;
  pendingApprovalsCount?: number;
}

export interface Campaign {
  id: string;
  name: string;
  description: string;
  target_amount: number;
  start_date: string;
  end_date?: string;
  category: string;
  banner_url?: string;
  organizer_id?: string;
  organizer_name?: string;
  status: 'ACTIVE' | 'COMPLETED' | 'PAUSED' | 'PLANNED';
  is_public: number;
  collected_amount?: number;
  verified_donors_count?: number;
  spent_amount?: number;
  assigned_quota_total?: number;
}

export interface Contribution {
  id: string;
  receipt_id?: string;
  receipt_number?: string;
  donor_name: string;
  phone: string;
  email?: string;
  amount: number;
  date: string;
  campaign_id: string;
  campaign_name?: string;
  purpose: string;
  payment_method: 'CASH' | 'UPI' | 'BANK_TRANSFER' | 'CHEQUE' | 'OTHER';
  reference_no?: string;
  collected_by_id?: string;
  collector_name?: string;
  status: 'PENDING' | 'SUBMITTED' | 'VERIFICATION_REQUIRED' | 'VERIFIED' | 'REJECTED' | 'CANCELLED' | 'REFUNDED';
  verified_by_name?: string;
  notes?: string;
  is_public: number;
  created_at: string;
}

export interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  campaign_id?: string;
  campaign_name?: string;
  event_id?: string;
  event_name?: string;
  requested_by_id: string;
  requested_by_name: string;
  date: string;
  vendor_name: string;
  payment_method: string;
  supporting_bill_url?: string;
  approval_status: 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'PAID' | 'CANCELLED';
  current_tier_id?: string;
  tier_name?: string;
  requiredRoles?: string[];
  approvedRoles?: string[];
  approved_by_roles_json?: string;
  paid_at?: string;
  notes?: string;
  created_at: string;
}

export interface LedgerEntry {
  id: string;
  transaction_ref: string;
  entry_type: 'CREDIT' | 'DEBIT' | 'ADJUSTMENT_CREDIT' | 'ADJUSTMENT_DEBIT';
  amount: number;
  category: string;
  campaign_id?: string;
  campaign_name?: string;
  related_entity_type: string;
  related_entity_id: string;
  balance_after: number;
  description: string;
  actor_name?: string;
  created_at: string;
}

export interface CommitteeMember {
  id: string;
  user_id?: string;
  username?: string;
  name: string;
  role_title: string;
  phone: string;
  email?: string;
  joining_date: string;
  area_location: string;
  active: number;
  assigned_responsibilities?: string;
  total_verified_collected?: number;
  verified_collections_count?: number;
  total_assigned_target?: number;
}

export interface EventItem {
  id: string;
  name: string;
  description?: string;
  event_date: string;
  event_time?: string;
  venue: string;
  coordinator_id?: string;
  coordinator_name?: string;
  budget: number;
  actual_expense: number;
  actual_expenses_sum?: number;
  campaign_id?: string;
  campaign_name?: string;
  participants_count: number;
  status: 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
}

export interface MeetingItem {
  id: string;
  title: string;
  meeting_date: string;
  location: string;
  agenda: string;
  decisions?: string;
  created_by_name?: string;
  actionItems?: MeetingActionItem[];
}

export interface MeetingActionItem {
  id: string;
  meeting_id: string;
  title: string;
  description?: string;
  assigned_to_id?: string;
  assigned_to_name?: string;
  deadline?: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'DELAYED';
}

export interface AuditLogItem {
  id: string;
  user_name: string;
  user_role: string;
  action: string;
  entity_type: string;
  entity_id: string;
  previous_value_json?: string;
  new_value_json?: string;
  ip_address?: string;
  created_at: string;
}
