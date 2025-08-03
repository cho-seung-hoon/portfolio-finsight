package com.finsight.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public abstract class ProductByFilterDto {
    String productCode;
    String productName;
    Boolean userOwns;
    Boolean isPopularInUserGroup;
}
