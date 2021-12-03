import { Product } from '@t.c.saga/products';

export class OrderItem {
  _id?: string;
  product?: Product | any;
  quantity?: number | any;
}
