package com.belajarspring.demo.service;

import com.belajarspring.demo.entity.Account;
import com.belajarspring.demo.entity.Transaction;
import com.belajarspring.demo.repository.AccountRepository;
import com.belajarspring.demo.repository.TransactionRepository;
import com.belajarspring.demo.request.TransferRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class WebService {
    @Autowired
    AccountRepository accountRepository;
    @Autowired
    TransactionRepository transactionRepository;

    public List<Account> getAccounts() {
        return accountRepository.findAll();
    }

    public Account saveAccount(Account account) {
        return accountRepository.save(account);
    }

    public void deleteAccount(Long id) {
        accountRepository.deleteById(id);
    }

    public void transferBalance(TransferRequest transferRequest) {
        Account accountSender = accountRepository.findByAccountNumber(transferRequest.getAccountNumberSender());
        Account accountReceiver = accountRepository.findByAccountNumber(transferRequest.getAccountNumberReceiver());
        accountReceiver.setAccountBalance(accountReceiver.getAccountBalance() + transferRequest.getAmount());
        accountSender.setAccountBalance(accountSender.getAccountBalance() - transferRequest.getAmount());
        Date now = new Date();
        Transaction transactionSender = new Transaction(accountSender.getAccountNumber(),
                "Send balance to "+accountReceiver.getAccountName(),
                "-"+ transferRequest.getAmount(),
                now);
        Transaction transactionReceiver = new Transaction(accountReceiver.getAccountNumber(),
                "Receive balance from "+accountSender.getAccountName(),
                "+"+ transferRequest.getAmount(),
                now);
        transactionRepository.save(transactionSender);
        transactionRepository.save(transactionReceiver);
    }

    public List<Transaction> getTransaction(String accountNumber) {
        return transactionRepository.findByAccountNumber(accountNumber);
    }
}
