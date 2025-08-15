/**
 * 숫자 포맷팅 유틸리티 함수들
 */

import { formatNumberAll } from 'hangul-util';
import Decimal from 'decimal.js';

// 숫자에 콤마를 추가하는 함수
export function formatNumberWithComma(num) {
  if (num === null || num === undefined || num === '') return '';

  // Decimal 객체인 경우 toNumber() 사용
  if (num instanceof Decimal) {
    return new Intl.NumberFormat('ko-KR').format(num.toNumber());
  }

  // 숫자가 아닌 경우 원본 반환
  if (isNaN(num)) return num;

  return new Intl.NumberFormat('ko-KR').format(num);
}

// 콤마가 포함된 문자열을 숫자로 변환하는 함수
export function parseNumberFromComma(str) {
  if (!str) return 0;

  // 콤마 제거 후 숫자로 변환
  const cleanStr = str.replace(/,/g, '');
  const num = parseFloat(cleanStr);

  return isNaN(num) ? 0 : new Decimal(num);
}

// 입력값을 콤마 포맷팅과 함께 처리하는 함수
export function formatInputNumber(value) {
  if (!value) return '';

  // 문자열로 변환
  const strValue = value.toString();

  // 콤마 제거
  const cleanValue = strValue.replace(/,/g, '');

  // 숫자가 아닌 경우 빈 문자열 반환
  if (isNaN(cleanValue)) return '';

  // 콤마 포맷팅 적용
  return formatNumberWithComma(parseFloat(cleanValue));
}

// 한국어 숫자 변환 함수
export function convertToKoreanNumber(value) {
  if (!value) return '';

  // Decimal 객체인 경우 toNumber() 사용
  if (value instanceof Decimal) {
    return formatNumberAll(value.toNumber());
  }

  // 숫자인 경우 직접 변환
  if (typeof value === 'number') {
    return formatNumberAll(value);
  }

  // 문자열인 경우 parseNumberFromComma 사용
  const num = parseNumberFromComma(value);
  return formatNumberAll(num instanceof Decimal ? num.toNumber() : num);
}

// 통화 포맷팅 함수
export function formatCurrency(value) {
  if (value === null || value === undefined || value === '') return '₩0';

  // Decimal 객체인 경우 toNumber() 사용
  if (value instanceof Decimal) {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW'
    }).format(value.toNumber());
  }

  // 숫자가 아닌 경우 원본 반환
  if (isNaN(value)) return value;

  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW'
  }).format(value);
}

// 한국어 숫자 변환 함수 (getKoreanNumber 별칭)
export function getKoreanNumber(value) {
  return convertToKoreanNumber(value);
}
