function parseHex(hex: string): [number, number, number] | null {
  const normalized = hex.replace("#", "").trim();
  if (!/^[\da-fA-F]{6}$/.test(normalized)) return null;

  return [
    parseInt(normalized.slice(0, 2), 16),
    parseInt(normalized.slice(2, 4), 16),
    parseInt(normalized.slice(4, 6), 16),
  ];
}

function toHex([r, g, b]: [number, number, number]): string {
  return `#${[r, g, b]
    .map((value) => Math.round(value).toString(16).padStart(2, "0"))
    .join("")}`;
}

function mix(
  base: [number, number, number],
  target: [number, number, number],
  weight: number
): string {
  const w = Math.min(1, Math.max(0, weight));
  return toHex([
    base[0] * (1 - w) + target[0] * w,
    base[1] * (1 - w) + target[1] * w,
    base[2] * (1 - w) + target[2] * w,
  ]);
}

const DEFAULT_PRIMARY = "#0284c7";

export function generatePrimaryPalette(hex?: string): Record<string, string> {
  const rgb = parseHex(hex ?? "") ?? parseHex(DEFAULT_PRIMARY)!;

  return {
    50: mix(rgb, [255, 255, 255], 0.95),
    100: mix(rgb, [255, 255, 255], 0.9),
    200: mix(rgb, [255, 255, 255], 0.75),
    300: mix(rgb, [255, 255, 255], 0.55),
    400: mix(rgb, [255, 255, 255], 0.3),
    500: mix(rgb, [255, 255, 255], 0.1),
    600: toHex(rgb),
    700: mix(rgb, [0, 0, 0], 0.15),
    800: mix(rgb, [0, 0, 0], 0.3),
    900: mix(rgb, [0, 0, 0], 0.45),
  };
}

export function primaryPaletteToCssVars(
  palette: Record<string, string>
): Record<string, string> {
  return Object.fromEntries(
    Object.entries(palette).map(([shade, color]) => [`--primary-${shade}`, color])
  );
}
