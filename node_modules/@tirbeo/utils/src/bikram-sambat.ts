type BsDate = {
  year: number;
  month: number;
  day: number;
};

const BS_MONTHS = [
  "Baisakh", "Jestha", "Ashad", "Shrawan",
  "Bhadra", "Ashwin", "Kartik", "Mangsir",
  "Poush", "Magh", "Falgun", "Chaitra",
] as const;

const BS_MONTHS_DAYS: Record<number, number[]> = {
  2000: [30, 32, 31, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  2001: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2002: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  2003: [31, 32, 31, 32, 31, 30, 30, 29, 30, 30, 29, 30],
  2004: [31, 32, 31, 32, 31, 30, 30, 29, 30, 30, 29, 30],
  2005: [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 30],
  2006: [31, 31, 31, 32, 31, 30, 30, 30, 29, 30, 29, 30],
  2007: [31, 31, 32, 31, 31, 30, 30, 30, 29, 30, 30, 29],
  2008: [31, 31, 32, 31, 31, 31, 30, 29, 30, 30, 30, 29],
  2009: [31, 32, 31, 32, 31, 30, 30, 29, 30, 30, 30, 29],
};

const BS_EPOCH_YEAR = 2000;
const AD_EPOCH = new Date(1943, 3, 14);

export function adToBs(date: Date): BsDate {
  const target = new Date(date);
  const diff = target.getTime() - AD_EPOCH.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  let year = BS_EPOCH_YEAR;
  let dayCount = days;

  while (true) {
    const daysInYear = BS_MONTHS_DAYS[year]?.reduce((a, b) => a + b, 0) ?? 354;
    if (dayCount < daysInYear) break;
    dayCount -= daysInYear;
    year++;
  }

  let month = 0;
  const daysInMonth = BS_MONTHS_DAYS[year] || BS_MONTHS_DAYS[2000];
  while (month < 12 && dayCount >= daysInMonth[month]) {
    dayCount -= daysInMonth[month];
    month++;
  }

  return { year, month: month + 1, day: dayCount + 1 };
}

export function bsToAd(bs: BsDate): Date {
  let totalDays = 0;
  for (let y = BS_EPOCH_YEAR; y < bs.year; y++) {
    totalDays += BS_MONTHS_DAYS[y]?.reduce((a, b) => a + b, 0) ?? 354;
  }
  const daysInMonth = BS_MONTHS_DAYS[bs.year] || BS_MONTHS_DAYS[2000];
  for (let m = 0; m < bs.month - 1; m++) {
    totalDays += daysInMonth[m];
  }
  totalDays += bs.day - 1;
  return new Date(AD_EPOCH.getTime() + totalDays * 24 * 60 * 60 * 1000);
}

export function getCurrentBsDate(): BsDate {
  return adToBs(new Date());
}

export function formatBsDate(bs: BsDate): string {
  const month = BS_MONTHS[bs.month - 1] || "Unknown";
  return `${bs.day} ${month}, ${bs.year}`;
}

export function getBsMonthName(month: number): string {
  return BS_MONTHS[month - 1] || "Unknown";
}

export function getDaysInBsMonth(year: number, month: number): number {
  return BS_MONTHS_DAYS[year]?.[month - 1] ?? 30;
}