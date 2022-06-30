package com.belajarspring.demo.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class WebController {
    @RequestMapping("/")
    private String hello() {
        return "Hello Spring";
    }
    @RequestMapping("/logout")
    private String bye() {
        return "Goodbye Spring";
    }
}
