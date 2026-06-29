const images = require.context('../assets', true, /\.(png|jpe?g|svg)$/);

export function resolveAssetUrl(src) {
  if (!src) return '';
  if (src.startsWith('@/assets/')) {
    const relativePath = `./${src.replace('@/assets/', '')}`;
    try {
      return images(relativePath);
    } catch (err) {
      console.warn('Image not found in assets:', src);
      return src;
    }
  }
  return src;
}
