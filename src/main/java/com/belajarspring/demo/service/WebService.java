package com.belajarspring.demo.service;

import com.belajarspring.demo.entity.Account;
import com.belajarspring.demo.entity.Transaction;
import com.belajarspring.demo.repository.AccountRepository;
import com.belajarspring.demo.repository.TransactionRepository;
import com.belajarspring.demo.request.EditRequest;
import com.belajarspring.demo.request.TransferRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
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

    public void addAccount(Account account) {
        accountRepository.save(account);
    }

    public void editAccount(EditRequest editRequest) {
        Account account = accountRepository.findByAccountNumber(editRequest.getAccountNumber());
        account.setAccountName(editRequest.getAccountName());
        accountRepository.save(account);
    }

    @Transactional
    public void deleteAccount(String accountNumber) throws Exception {
        long deleteStatus = accountRepository.deleteByAccountNumber(accountNumber);
        if (deleteStatus != 1) {
            throw new Exception("Delete Failed for "+ accountNumber);
        }
    }

    public void transferBalance(TransferRequest transferRequest) throws Exception {
        Account accountSender = accountRepository.findByAccountNumber(transferRequest.getAccountNumberSender());
        Account accountReceiver = accountRepository.findByAccountNumber(transferRequest.getAccountNumberReceiver());
        if (accountSender.getAccountBalance() < transferRequest.getAmount()) throw new Exception("Insufficient sender balance");
        accountSender.setAccountBalance(accountSender.getAccountBalance() - transferRequest.getAmount());
        accountReceiver.setAccountBalance(accountReceiver.getAccountBalance() + transferRequest.getAmount());
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
