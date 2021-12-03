import { OrderItem } from "./orderItem";

export class Order {
  _id?: string;
  orderItems?: OrderItem[];
  shippingAddress1?: string;
  shippingAddress2?: string;
  city?: string;
  pincode?: number;
  country?: string;
  phone?: number;
  status?: string;
  totalPrice?: number;
  user?: any;
  dateOrdered?: string;
}
