import { CreateOrderDetailDto } from "../dtos";

export function getTotalFromOrderDetails(
  createOrderDetailDto: CreateOrderDetailDto[],
): number {
  const prices = createOrderDetailDto.map(
    (orderDetail) => orderDetail.price * orderDetail.quantity,
  );
  const total = prices.reduce((total, currentPrice) => (total += currentPrice));
  return total;
}
