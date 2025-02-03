export const isLightColor = (color) => {
  if (!color) return false;
  try {
    // Handle rgba colors
    if (color.startsWith('rgba')) {
      const values = color.match(/[\d.]+/g);
      if (values && values.length >= 3) {
        const [r, g, b] = values.map(Number);
        const brightness = ((r * 299) + (g * 587) + (b * 114)) / 1000;
        console.log('Color:', color, 'Brightness:', brightness);
        return brightness > 155;
      }
    }
    
    // Handle hex colors
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    console.log('Color:', color, 'Brightness:', brightness);
    return brightness > 155;
  } catch (error) {
    console.error('Color parsing error:', error);
    return false;
  }
}; 