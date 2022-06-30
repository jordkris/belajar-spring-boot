package com.belajarspring.demo.request;

public class TransferRequest {
    private String accountNumberSender;
    private String accountNumberReceiver;
    private int amount;

    public TransferRequest() {
    }

    public TransferRequest(String accountNumberSender, String accountNumberReceiver, int amount) {
        this.accountNumberSender = accountNumberSender;
        this.accountNumberReceiver = accountNumberReceiver;
        this.amount = amount;
    }

    public String getAccountNumberSender() {
        return accountNumberSender;
    }

    public void setAccountNumberSender(String accountNumberSender) {
        this.accountNumberSender = accountNumberSender;
    }

    public String getAccountNumberReceiver() {
        return accountNumberReceiver;
    }

    public void setAccountNumberReceiver(String accountNumberReceiver) {
        this.accountNumberReceiver = accountNumberReceiver;
    }

    public int getAmount() {
        return amount;
    }

    public void setAmount(int amount) {
        this.amount = amount;
    }
}
