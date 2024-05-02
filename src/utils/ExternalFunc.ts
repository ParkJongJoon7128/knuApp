export const truncateText = (text: string) => {
  if (text.length > 12) {
    return text.substring(0, 12) + '...';
  }
  return text;
};

export const getRelativeTime = (previous: string | number | Date): string => {
  const msPerMinute = 60 * 1000;
  const msPerHour = msPerMinute * 60;
  const msPerDay = msPerHour * 24;

  const now = new Date();
  // Date 생성자는 문자열, 숫자(타임스탬프), 또는 다른 Date 객체를 인자로 받을 수 있습니다.
  // 따라서 `previous` 파라미터는 string, number, Date 타입 중 하나가 될 수 있습니다.
  const past = new Date(previous);
  const elapsed = now.getTime() - past.getTime(); // getTime()의 반환 타입은 number입니다.

  if (elapsed < msPerMinute) {
    return Math.round(elapsed / 1000) + '초 전';
  } else if (elapsed < msPerHour) {
    return Math.round(elapsed / msPerMinute) + '분 전';
  } else if (elapsed < msPerDay) {
    return Math.round(elapsed / msPerHour) + '시간 전';
  } else {
    return Math.round(elapsed / msPerDay) + '일 전';
  }
};
