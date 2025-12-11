import { prisma } from "@/lib/prisma";

export const LEVEL_THRESHOLDS = [
  0, 100, 250, 500, 1000, 2000, 4000, 8000, 16000, 32000,
];

export function calculateLevel(xp: number): number {
  let level = 1;
  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (xp >= LEVEL_THRESHOLDS[i]) {
      level = i + 1;
    } else {
      break;
    }
  }
  return level;
}

export function getNextLevelThreshold(level: number): number {
  if (level >= LEVEL_THRESHOLDS.length) {
    return LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1] * 2; // Fallback for high levels
  }
  return LEVEL_THRESHOLDS[level]; // level is 1-indexed, array is 0-indexed. So level 1 looks at index 1 (100xp)
}

export async function awardXP(userId: string, amount: number) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { xp: true, level: true },
  });

  if (!user) return null;

  const newXP = user.xp + amount;
  const newLevel = calculateLevel(newXP);
  const leveledUp = newLevel > user.level;

  await prisma.user.update({
    where: { id: userId },
    data: {
      xp: newXP,
      level: newLevel,
    },
  });

  return { leveledUp, newLevel, newXP };
}

export async function updateStreak(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { lastActiveDate: true, currentStreak: true, longestStreak: true },
  });

  if (!user) return;

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  let lastActive = user.lastActiveDate
    ? new Date(
        user.lastActiveDate.getFullYear(),
        user.lastActiveDate.getMonth(),
        user.lastActiveDate.getDate()
      )
    : null;

  let newStreak = user.currentStreak;

  if (!lastActive) {
    // First time active
    newStreak = 1;
  } else if (today.getTime() === lastActive.getTime()) {
    // Already active today, do nothing
    return;
  } else if (today.getTime() - lastActive.getTime() === 86400000) {
    // Consecutive day (86400000 ms = 1 day)
    newStreak += 1;
  } else {
    // Missed a day
    newStreak = 1;
  }

  const newLongest = Math.max(newStreak, user.longestStreak);

  await prisma.user.update({
    where: { id: userId },
    data: {
      lastActiveDate: now,
      currentStreak: newStreak,
      longestStreak: newLongest,
    },
  });

  return newStreak;
}
