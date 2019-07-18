import { Account } from "../common/interfaces/Account";
import { Transaction } from "../common/interfaces/Transaction";
import { TransactionOrigin } from "../common/enums/TransactionOrigin";

const ONE_THOUSAND = 1000;

export class CheckingAccount implements Account {
  currentDate: Date;
  balance: number;
  accountHistory: Transaction[];
  accountHolderBirthDate?: Date;
  interestRate: 0.01;
  constructor(currentDate: Date) {
    this.balance = ONE_THOUSAND;
    this.currentDate = currentDate;
    this.accountHistory = [];
  }
  withdrawMoney(
    amount: number,
    description: string,
    transactionOrigin: TransactionOrigin
  ): Transaction {
    let transaction = {
      errorMessage: "Insufficient funds",
      transactionDate: new Date(),
      transactionOrigin: transactionOrigin,
      description: description,
      amount: amount,
      resultBalance: this.balance,
      success: false
    };
    if (amount <= this.balance && amount >= 0) {
      this.balance -= amount;
      transaction.success = true;
      transaction.errorMessage = "";
      transaction.resultBalance = this.balance;
      this.accountHistory.push(transaction);
    }
    this.accountHistory.push(transaction);
    return transaction;
  }

  depositMoney(amount: number, description: string): Transaction {
    let transaction = {
      errorMessage: "deposit failed",
      transactionDate: new Date(),
      transactionOrigin: null,
      description: description,
      amount: amount,
      resultBalance: this.balance,
      success: false
    };

    if (amount > 0) {
      this.balance += amount;
      transaction.success = true;
      transaction.errorMessage = "";
      transaction.resultBalance = this.balance;
      this.accountHistory.push(transaction);
    }

    return transaction;
  }

  //will advance this.currentDate by the given days, adding interest as it goes.
  advanceDate(numberOfDays: number) {
    //loop through each day, checking if its the first of the month, depositing interest if necessary
    for (let i = 0; i < numberOfDays; i++) {
      //if today is the first day of the month
      if (this.currentDate.getDate() === 1) {
        let amount: number = (this.balance * this.interestRate) / 12; //annual interest
        this.depositMoney(amount, `interest`);
      }
      this.currentDate.setDate(this.currentDate.getDate() + 1);
    }
  }
}
