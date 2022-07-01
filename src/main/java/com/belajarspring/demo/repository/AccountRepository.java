package com.belajarspring.demo.repository;

import com.belajarspring.demo.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AccountRepository extends JpaRepository<Account, Long> {
    Account findByAccountNumber(String accountNumber);

    long deleteByAccountNumber(String accountNumber);
}
