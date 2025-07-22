package com.finsight.backend.control;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
@Slf4j
@RestController
public class VisitCountCookieController {
    @GetMapping("/cookie")
    public ResponseEntity<String> cookie(@CookieValue(name = "lastVisit", required = false) String lastVisit, HttpServletResponse response) {
        String msg = "";
        if (lastVisit == null || lastVisit.equals("")) {
            msg = "처음 방문하셨습니다";
        } else {
            log.info("lastVisit={}", lastVisit);
            msg = "마지막 방문시간:" + URLDecoder.decode(lastVisit, StandardCharsets.UTF_8);
        }
        //쿠키추가
        LocalDateTime now = LocalDateTime.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        String datetime = now.format(formatter);
        try {
            Cookie cookie = new Cookie("lastVisit", URLEncoder.encode(datetime, "UTF-8"));
            log.info("cookie={}", cookie.getValue());
            cookie.setMaxAge(60 * 60 * 24 * 7); //7일간 사용할 수 있는 쿠키
            response.addCookie(cookie);
        } catch (UnsupportedEncodingException e) {
            throw new RuntimeException(e);
        }
        return ResponseEntity.ok(msg);
    }
}
