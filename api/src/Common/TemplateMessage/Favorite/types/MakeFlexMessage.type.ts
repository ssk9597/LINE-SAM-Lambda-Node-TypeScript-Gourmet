import { stringTo2048, string1To255 } from 'aws-sdk/clients/customerprofiles';
import { ItemCollectionSizeEstimateRange } from 'aws-sdk/clients/dynamodb';

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
