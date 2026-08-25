const API_BASE = 'http://localhost:5000/api';

export function getAuthToken(): string | null {
  return localStorage.getItem('sky_token');
}

export function setAuthToken(token: string) {
  localStorage.setItem('sky_token', token);
}

export function clearAuthToken() {
  localStorage.removeItem('sky_token');
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (token) {
    (headers as any)['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }
  return data;
}

export const api = {
  // Auth
  login: (credentials: { identifier: string; password: string }) =>
    request<any>('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  demoSwitch: (role: string) =>
    request<any>('/auth/demo-switch', { method: 'POST', body: JSON.stringify({ role }) }),
  getDemoAccounts: () => request<any>('/auth/demo-accounts'),
  getMe: () => request<any>('/auth/me'),

  // Dashboard
  getDashboardOverview: () => request<any>('/dashboard/overview'),

  // Contributions
  getContributions: (params: string = '') => request<any>(`/contributions?${params}`),
  getContribution: (id: string) => request<any>(`/contributions/${id}`),
  createContribution: (data: any) =>
    request<any>('/contributions', { method: 'POST', body: JSON.stringify(data) }),
  verifyContribution: (id: string) =>
    request<any>(`/contributions/${id}/verify`, { method: 'POST' }),
  rejectContribution: (id: string, reason: string) =>
    request<any>(`/contributions/${id}/reject`, { method: 'POST', body: JSON.stringify({ reason }) }),
  getReceipt: (receiptNumber: string) =>
    request<any>(`/contributions/receipt/${receiptNumber}`),

  // Expenses
  getExpenses: (params: string = '') => request<any>(`/expenses?${params}`),
  createExpense: (data: any) =>
    request<any>('/expenses', { method: 'POST', body: JSON.stringify(data) }),
  approveExpense: (id: string, notes?: string) =>
    request<any>(`/expenses/${id}/approve`, { method: 'POST', body: JSON.stringify({ notes }) }),
  rejectExpense: (id: string, reason: string) =>
    request<any>(`/expenses/${id}/reject`, { method: 'POST', body: JSON.stringify({ reason }) }),
  payoutExpense: (id: string) =>
    request<any>(`/expenses/${id}/payout`, { method: 'POST' }),

  // Ledger
  getLedgerEntries: (params: string = '') => request<any>(`/ledger/entries?${params}`),
  postAdjustment: (data: any) =>
    request<any>('/ledger/adjustment', { method: 'POST', body: JSON.stringify(data) }),

  // Campaigns
  getCampaigns: () => request<any>('/campaigns'),
  getCampaign: (id: string) => request<any>(`/campaigns/${id}`),
  createCampaign: (data: any) =>
    request<any>('/campaigns', { method: 'POST', body: JSON.stringify(data) }),
  assignQuota: (campaignId: string, data: any) =>
    request<any>(`/campaigns/${campaignId}/assign`, { method: 'POST', body: JSON.stringify(data) }),

  // Members
  getMembers: () => request<any>('/members'),
  createMember: (data: any) =>
    request<any>('/members', { method: 'POST', body: JSON.stringify(data) }),
  toggleMemberStatus: (id: string, active: boolean) =>
    request<any>(`/members/${id}/status`, { method: 'PATCH', body: JSON.stringify({ active }) }),

  // Events & Meetings
  getEvents: () => request<any>('/events'),
  createEvent: (data: any) =>
    request<any>('/events', { method: 'POST', body: JSON.stringify(data) }),
  getMeetings: () => request<any>('/meetings'),
  createMeeting: (data: any) =>
    request<any>('/meetings', { method: 'POST', body: JSON.stringify(data) }),
  updateActionItemStatus: (id: string, status: string) =>
    request<any>(`/meetings/action-items/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),

  // Documents
  getDocuments: (category?: string) =>
    request<any>(`/documents${category ? `?category=${category}` : ''}`),

  // Audit Logs
  getAuditLogs: (params: string = '') => request<any>(`/audit-logs?${params}`),

  // Reports
  getFinancialStatement: () => request<any>('/reports/financial-statement'),
  getMembersPerformance: () => request<any>('/reports/members-performance'),

  // Settings
  getSettings: () => request<any>('/settings'),
  updateSettings: (settings: Record<string, string>) =>
    request<any>('/settings', { method: 'POST', body: JSON.stringify({ settings }) }),
  updateThresholds: (thresholds: any[]) =>
    request<any>('/settings/thresholds', { method: 'POST', body: JSON.stringify({ thresholds }) }),

  // Public Transparency
  getPublicTransparency: () => request<any>('/public/transparency'),
  verifyPublicReceipt: (receiptNumber: string) =>
    request<any>(`/public/verify-receipt/${receiptNumber}`)
};
