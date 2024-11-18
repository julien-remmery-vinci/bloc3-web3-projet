export type Subscription = {
  id?: string
  name: string
  amount: number
  debit_date: string
  recurrence: 'monthly' | 'yearly'
  created_at?: string
  updated_at?: string
}
