package com.finsight.backend.dto;

import lombok.*;

import java.util.List;

@Data
@AllArgsConstructor
public class PageDTO<T> {
    private List<T> list;
    private int currentPage; //현재페이지
    private long totalCnt; //총목록수
    private int totalPages; //총페이지수

    private int startPage; //페이지그룹의 시작페이지
    private int endPage;//페이지그룹의 끝페이지
    private boolean hasPrevious; //이전페이지 여부
    private boolean hasNext; //다음페이지 여부

    private int pageSize; //한 페이지당 보여줄 최대 목록수
    private int pageGroupSize; //페이지 그룹에 보여줄 최대 페이지 수

    /**
     *
     * @param currentPage 현재페이지
     * @param pageSize  페이지별 보여줄 최대 목록수
     * @param list  목록
     * @param totalCnt 총목록수
     * @param pageGroupSize 페이지그룹수
     */
    public PageDTO(int currentPage, int pageSize, List<T> list, long totalCnt, int pageGroupSize)  {
        this.list = list;
        this.pageSize = pageSize;
        this.pageGroupSize = pageGroupSize;
        this.currentPage = currentPage;
        this.totalCnt = totalCnt;
        this.totalPages = (int) Math.ceil((double) totalCnt / pageSize);//총페이지


        this.startPage = (currentPage-1)/pageGroupSize*pageGroupSize+1;//페이지그룹시작페이지
        this.endPage = startPage + pageGroupSize -1 ;//페이지그룹끝페이지
        if(endPage > totalPages){
            endPage = totalPages;
        }
        this.hasPrevious = startPage>1; //prev여부
        this.hasNext = totalPages>endPage;  //next여부
    }
}
