
export interface Role {
  id: string;
  name: string;
  description?: string;
  is_system_role: boolean;
  organization_id: string;
  created_at?: string;
  updated_at?: string;
  memberCount?: number;
}

export interface Permission {
  id?: string;
  role_id: string;
  feature: string;
  can_read: boolean;
  can_write: boolean;
  is_hidden: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface OrganizationMember {
  id: string;
  name: string;
  email: string;
  role: string;
  role_id?: string;
  status: 'active' | 'inactive';
  joinedAt: string;
}

export const DEFAULT_FEATURES = [
  'dashboard', 
  'sales', 
  'customers', 
  'service', 
  'marketing', 
  'analytics', 
  'reports', 
  'integrations', 
  'website', 
  'organization', 
  'chatbot', 
  'settings'
];
