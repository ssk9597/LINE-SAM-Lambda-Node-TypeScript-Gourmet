export type Item = {
  user_id: string;
  photo_url: string;
  rating: string;
  timestamp: number;
  name: string;
  store_routing_url: string;
  store_details_url: string;
};

export type QueryItem = Item[];
