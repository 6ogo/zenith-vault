
export interface ServiceCase {
  id: string;
  subject: string;
  description: string;
  status: string;
  priority: string;
  category: string;
  created_at: string;
  updated_at: string;
  customer: {
    id: string;
    name: string;
    email: string;
    company: string;
  };
  assignee: {
    id: string;
    name: string;
    avatar?: string;
  } | null;
}

export interface ServiceCaseComment {
  id: string;
  content: string;
  created_at: string;
  is_internal: boolean;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
}
