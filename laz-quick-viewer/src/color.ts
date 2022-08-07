const startColor = [54, 0, 51]
const endColor = [11, 135, 147]

export function colorForIntensity(maxIntensity: number, intensity: number): number[] {
  // Linearly interpolate gradient
  // Yes I know this whole function commits several crimes against visualization
  const t = intensity / maxIntensity;
  return [
    Math.floor(startColor[0] + (endColor[0] - startColor[0]) * t),
    Math.floor(startColor[1] + (endColor[1] - startColor[1]) * t),
    Math.floor(startColor[2] + (endColor[2] - startColor[2]) * t)
  ]
}

// tab10 from matplotlib
const categoryColors = [
  [31, 119, 180],
  [255, 127, 14],
  [44, 160, 44],
  [214, 39, 40],
  [148, 103, 189],
  [140, 86, 75],
  [227, 119, 194],
  [127, 127, 127],
  [188, 189, 34],
  [23, 190, 207]
]
const categoryCount = categoryColors.length;

export function colorForClassification(classification: number) {
  return categoryColors[classification % categoryCount];
}