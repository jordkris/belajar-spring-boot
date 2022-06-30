package com.belajarspring.demo.controller;

import com.belajarspring.demo.entity.Account;
import com.belajarspring.demo.request.TransferRequest;
import com.belajarspring.demo.service.WebService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class ApiController {

    @Autowired
    WebService webService;

    @PostMapping("/getAccounts")
    public @ResponseBody ResponseEntity<Object> getAccounts() {
        try {
            return new ResponseEntity<>(webService.getAccounts(), HttpStatus.OK);
        } catch (Exception e) {
            Map<String, Object> output = new HashMap<>();
            output.put("message", e.getMessage());
            return new ResponseEntity<>(output, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/addAccount")
    public @ResponseBody ResponseEntity<Object> addAccount(@RequestBody @Validated Account account) {
        try {
            webService.saveAccount(account);
            Map<String, Object> output = new HashMap<>();
            output.put("message", "success");
            return new ResponseEntity<>(output, HttpStatus.OK);
        } catch (Exception e) {
            Map<String, Object> output = new HashMap<>();
            output.put("message", e.getMessage());
            return new ResponseEntity<>(output, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/deleteAccount/{id}")
    public @ResponseBody ResponseEntity<Object> deleteAccount(@PathVariable Long id) {
        try {
            webService.deleteAccount(id);
            Map<String, Object> output = new HashMap<>();
            output.put("message", "success");
            return new ResponseEntity<>(output, HttpStatus.OK);
        } catch (Exception e) {
            Map<String, Object> output = new HashMap<>();
            output.put("message", e.getMessage());
            return new ResponseEntity<>(output, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/transferBalance")
    public @ResponseBody ResponseEntity<Object> transferBalance(@RequestBody @Validated TransferRequest transferRequest) {
        try {
            webService.transferBalance(transferRequest);
            Map<String, Object> output = new HashMap<>();
            output.put("message", "success");
            return new ResponseEntity<>(output, HttpStatus.OK);
        } catch (Exception e) {
            Map<String, Object> output = new HashMap<>();
            output.put("message", e.getMessage());
            return new ResponseEntity<>(output, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/getTransaction/{an}")
    public @ResponseBody ResponseEntity<Object> transferBalance(@PathVariable String an) {
        try {
            return new ResponseEntity<>(webService.getTransaction(an), HttpStatus.OK);
        } catch (Exception e) {
            Map<String, Object> output = new HashMap<>();
            output.put("message", e.getMessage());
            return new ResponseEntity<>(output, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
