export interface NotificationData {
  id: string;
  user_id: string;
  title: string;
  body?: string;
  data?: Record<string, any>;
  type: 'general' | 'message' | 'reminder' | 'system' | 'promotion' | 'update';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  is_read: boolean;
  read_at?: string;
  scheduled_for?: string;
  created_at: string;
  updated_at: string;
  firebase_message_id?: string;
  push_sent: boolean;
  push_sent_at?: string;
  category?: string;
  action_url?: string;
  expires_at?: string;
}

export interface NotificationStats {
  user_id: string;
  total_notifications: number;
  unread_count: number;
  read_count: number;
  last_24h_count: number;
  last_week_count: number;
  last_month_count: number;
  last_notification_at?: string;
  last_read_at?: string;
}

export interface NotificationFilters {
  type?: string;
  category?: string;
  unreadOnly?: boolean;
  priority?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface NotificationPagination {
  page: number;
  limit: number;
  hasMore: boolean;
  total: number;
}
