export type AdType = 'banner' | 'native' | 'video';

export interface Ad {
  id: number;
  campaign_id: number;
  name: string;
  ad_type: AdType;
  content_url: string;
  destination_url: string;
  is_active: boolean;
  created_at: string;
}

export type EventType = 'impression' | 'click' | 'conversion';

export interface AdEvent {
  id: number;
  ad_id: number;
  campaign_id: number;
  event_type: EventType;
  country: string;
  device: string;
  cost: number;
  created_at: string;
}
