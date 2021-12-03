import { Category } from "./category";
import { User } from '@t.c.saga/user';

export class Product {
  _id?: string | any;
  name?: string;
  description?: string;
  detailDescription?: string;
  image?: string;
  price?: number;
  postedBy?: User | any;
  category?: Category | any;
  rating?: number;
  numReviews?: number;
  isFeatured?: boolean;
  dateCreated?: string;
}
