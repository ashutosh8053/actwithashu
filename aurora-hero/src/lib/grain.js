// Renders a small tileable noise texture once and returns it as a data URL.
export function createGrainTexture(size = 160) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';
  const img = ctx.createImageData(size, size);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const v = (Math.random() * 255) | 0;
    d[i] = d[i + 1] = d[i + 2] = v;
    d[i + 3] = 34;
  }
  ctx.putImageData(img, 0, 0);
  return canvas.toDataURL('image/png');
}
