import { Component, Input } from '@angular/core';
import { Transaction } from 'app/supporters/models/transaction';

@Component({
  selector: 'app-transaction-table',
  templateUrl: './transaction-table.html',
  styleUrls: ['./transaction-table.scss']
})
export class TransactionTableComponent {
  displayColumns = ['supporter_id', 'created_at', 'transaction_type', 'supporter_name', 'tags'];

  @Input()
  transactions: Transaction[];
}
