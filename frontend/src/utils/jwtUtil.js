import { jwtDecode } from 'jwt-decode';

export function decodingJWT(token) {
  if (!token) {
    console.warn('No token provided');
    return null;
  }
  const decoded = jwtDecode(token);

  if (!decoded.exp) {
    console.log('만료시간 정보가 없습니다.');
    return null;
  }

  const expDate = new Date(decoded.exp * 1000); // 초 -> 밀리초 변환
  const now = new Date();

  const diffMs = expDate - now; // 남은 시간 (밀리초)
  if (diffMs <= 0) {
    console.log('토큰이 만료되었습니다.');
    return '만료됨';
  }

  // 밀리초 -> 분, 초 변환
  const diffSeconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(diffSeconds / 60);
  const seconds = diffSeconds % 60;

  return { minutes, seconds };
}
