import { TransactionType } from '../enums/transaction-type.enum';

export interface Transaction {
  id: string;
  type: TransactionType;
  value: number;
  date: Date;
}
