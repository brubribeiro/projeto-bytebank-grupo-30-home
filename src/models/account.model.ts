export interface Account {
  id: string;
  number: string;
  balance: number;
  customer: CustomerAccount;
}

export interface CustomerAccount {
  id: string;
  name: string;
  email: string;
}
