import { User } from "@t.c.saga/user";
import { Product } from "@t.c.saga/products";

export class Wishlist {
  _id?: string;
  product?: Product | any;
  user?: User | any;
}
