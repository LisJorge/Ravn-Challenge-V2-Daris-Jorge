import { Exclude, Expose } from "class-transformer";

@Exclude()
export class ProductDto{
  @Expose()
  productId: number;

  @Expose()
  name: string;

  @Expose()
  imageUrl: string;

  @Expose()
  price: number;

  @Expose()
  description: string;

  @Expose()
  stock: number;
}