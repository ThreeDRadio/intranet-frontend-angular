import { Component, Input } from '@angular/core';
import { Transaction } from 'app/supporters/models/transaction';

@Component({
  selector: 'app-transaction-table',
  templateUrl: './transaction-table.html',
  styleUrls: ['./transaction-table.scss']
})
export class TransactionTableComponent {
  displayColumns = ['created_at', 'transaction_type', 'payment_processed', 'pack_sent'];

  @Input()
  transactions: Transaction[];
}
