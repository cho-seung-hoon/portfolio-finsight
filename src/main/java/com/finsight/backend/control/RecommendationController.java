package com.finsight.backend.control;

import com.finsight.backend.recommend.NewsClickRecommender;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * 사용자 뉴스 열람 기반 추천 API 컨트롤러
 */
@RestController
@RequestMapping("/recommendations")
public class RecommendationController {

    private final NewsClickRecommender recommender;

    public RecommendationController(NewsClickRecommender recommender) {
        this.recommender = recommender;
    }

    /**
     * GET /recommendations?top=5
     * - 로그인된 사용자의 뉴스 열람 로그 기반 추천 상품 ID + 점수 반환
     */
    @GetMapping("")
    public ResponseEntity<Map<String, Integer>> recommend(
            @RequestParam(defaultValue = "5") int top
    ) {
        // 🔐 로그인된 사용자 ID 추출
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Map<String, Integer> result = recommender.getTopRecommendedProducts(userId, top);
        return ResponseEntity.ok(result);
    }
}
