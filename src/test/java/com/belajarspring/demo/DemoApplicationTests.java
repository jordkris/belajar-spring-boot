package com.belajarspring.demo;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.web.server.LocalServerPort;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class DemoApplicationTests {

    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate testRestTemplate;

    @Test
    public void checkStringMatchForHello() throws Exception {
        assertThat(testRestTemplate.getForObject("http://localhost:" + port + "/", String.class)).contains("Hello Spring");
    }

    @Test
    public void checkStringMatchForGoodbye() throws Exception {
        assertThat(testRestTemplate.getForObject("http://localhost:" + port + "/logout", String.class)).contains("Goodbye Spring");
    }
}
