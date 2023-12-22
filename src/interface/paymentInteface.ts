export interface IPayment {
  orderId: string
  receiptId: string
  paymentId: string
  signature: string
  amount: string
  currency: string
  createdAt: string
  status: string
}
