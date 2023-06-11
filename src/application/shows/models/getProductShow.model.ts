export class GetProductShowModel {
  itemID: number;
  itemName: string;
  quantity_sold: number;
}

export class AddProductOrUpdateModel {
  productId: number;
  productName: string;
  quantity: number;
}
