export class Cart {
  items?: CartItem[] | any;
}

export class CartItem {
  productId?: string;
  quantity?: number;
}

export class CartItemDetailed {
  product?: any;
  quantity?: number | any;
}
