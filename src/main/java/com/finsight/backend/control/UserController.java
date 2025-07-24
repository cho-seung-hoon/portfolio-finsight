package com.finsight.backend.control;

import com.finsight.backend.dto.request.SignUpRequest;
import com.finsight.backend.service.UserService;
import com.finsight.backend.vo.Member;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

/*
회원가입 및 중복 확인 API를 담당
 */
@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;

    // 1. 아이디 중복 확인
    @GetMapping("/check-id")
    public ResponseEntity<Boolean> checkUserId(@RequestParam String userId) {
        return ResponseEntity.ok(userService.isUserIdTaken(userId));
    }

    // 2. 닉네임 중복 확인
    @GetMapping("/check-nickname")
    public ResponseEntity<Boolean> checkNickname(@RequestParam String nickname) {
        return ResponseEntity.ok(userService.isNicknameTaken(nickname));
    }

    // 3. 이메일 중복 확인
    @GetMapping("/check-email")
    public ResponseEntity<Boolean> checkEmail(@RequestParam String email) {
        return ResponseEntity.ok(userService.isEmailTaken(email));
    }

    // 4. 회원가입
//    @PostMapping("/signup")
//    public ResponseEntity<?> signUp(@RequestBody Member member) {
//        boolean success = userService.registerMember(member);
//        if (success) {
//            return ResponseEntity.ok("회원가입 성공");
//        } else {
//            return ResponseEntity.badRequest().body("중복된 항목이 있습니다.");
//        }
//    }
    @PostMapping("/signup")
    public ResponseEntity<?> signUp(@RequestBody @Valid SignUpRequest request) {
        Member member = Member.builder()
                .userId(request.getUserId())
                .username(request.getUsername())
                .nickname(request.getNickname())
                .password(request.getPassword())
                .birthday(request.getBirthday())
                .email(request.getEmail())
                .build();

        boolean success = userService.registerMember(member);

        return success ? ResponseEntity.ok("회원가입 성공")
                : ResponseEntity.badRequest().body("중복된 항목이 있습니다.");
    }

}
