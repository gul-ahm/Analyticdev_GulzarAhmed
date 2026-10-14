// Renders the dotted world map to public/world-dots.svg.
// Run after changing the grid or colour: node scripts/build-world-dots.js
const fs = require('fs');
const path = require('path');
const DottedMap = require('dotted-map').default || require('dotted-map');

const svg = new DottedMap({ height: 100, grid: 'diagonal' }).getSVG({
    radius: 0.22,
    color: '#0f172a38',
    shape: 'circle',
    backgroundColor: 'transparent'
});

const out = path.join(__dirname, '..', 'public', 'world-dots.svg');
fs.writeFileSync(out, svg, 'utf8');
console.log('wrote', out, (svg.length / 1024).toFixed(0) + ' KB');
