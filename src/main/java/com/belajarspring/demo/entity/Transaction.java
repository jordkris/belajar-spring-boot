package com.belajarspring.demo.entity;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "transaction")
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(name = "account_number", nullable = false)
    private String accountNumber;

    @Column(name = "transaction_name", nullable = false)
    private String transactionName;

    @Column(name ="transaction_amount", nullable = false)
    private String transactionAmount;

    @Column(name ="transaction_time", nullable = false)
    private Date transactionTime;

    public Transaction() {
    }

    public Transaction(String accountNumber, String transactionName, String transactionAmount, Date transactionTime) {
        this.accountNumber = accountNumber;
        this.transactionName = transactionName;
        this.transactionAmount = transactionAmount;
        this.transactionTime = transactionTime;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getAccountNumber() {
        return accountNumber;
    }

    public void setAccountNumber(String accountNumber) {
        this.accountNumber = accountNumber;
    }

    public String getTransactionName() {
        return transactionName;
    }

    public void setTransactionName(String transactionName) {
        this.transactionName = transactionName;
    }

    public String getTransactionAmount() {
        return transactionAmount;
    }

    public void setTransactionAmount(String transactionAmount) {
        this.transactionAmount = transactionAmount;
    }

    public Date getTransactionTime() {
        return transactionTime;
    }

    public void setTransactionTime(Date transactionTime) {
        this.transactionTime = transactionTime;
    }

    @Override
    public String toString() {
        return "Transaction{" +
                "id=" + id +
                ", accountNumber='" + accountNumber + '\'' +
                ", transactionName='" + transactionName + '\'' +
                ", transactionAmount='" + transactionAmount + '\'' +
                ", transactionTime='" + transactionTime + '\'' +
                '}';
    }
}
