package com.belajarspring.demo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class WebController {
    @GetMapping("/")
    public String index(Model model) {
        model.addAttribute("title","Bank Microservices");
        return "index";
    }


}
