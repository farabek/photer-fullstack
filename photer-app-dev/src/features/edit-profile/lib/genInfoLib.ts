export function isOlderThan13(birthDate: Date): boolean {
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();
  // Если месяц рождения еще не наступил в текущем году, уменьшаем возраст на 1
  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birthDate.getDate())
  ) {
    return age > 13;
  }
  return age >= 13;
}

export function convertStringToDate(data: string | undefined): Date {
  if (!data) {
    return new Date();
  }
  // Если data - это объект Date
  const parsedDate = new Date(data);
  if (!isNaN(parsedDate.getTime())) {
    return parsedDate;
  }
  // Проверяем, что строка соответствует формату дд.мм.гггг
  const regex = /^(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[0-2])\.(\d{4})$/;
  if (!regex.test(data)) {
    return new Date();
  }
  const [dayStr, monthStr, yearStr] = data.split('.');
  const day = parseInt(dayStr, 10);
  const month = parseInt(monthStr, 10) - 1; // Месяцы начинаются с 0
  const year = parseInt(yearStr, 10);
  // Проверяем корректность даты
  const date = new Date(year, month, day);
  if (
    date.getDate() !== day ||
    date.getMonth() !== month ||
    date.getFullYear() !== year
  ) {
    return new Date(); // Если дата некорректная, возвращаем текущую дату
  }
  return date;
}

export function convertDateToString(data: Date): string {
  const day = String(data.getDate()).padStart(2, '0');
  const month = String(data.getMonth() + 1).padStart(2, '0'); // Месяцы начинаются с 0
  const year = data.getFullYear();
  return `${day}.${month}.${year}`;
}
