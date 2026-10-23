/** @param {number} value @param {number} min @param {number} max */
export const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
/** @param {number} top @param {number} height @param {number} viewport */
export const scrollProgress = (top, height, viewport) => clamp(-top / Math.max(1, height - viewport));
/** @param {number} progress @param {number} count */
export const stageIndex = (progress, count) => Math.round(clamp(progress) * (count - 1));
