// Custom cursor
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;

// Only enable custom cursor on devices with a fine pointer (mouse)
const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
if (isTouchDevice) {
  cursor.style.display = 'none';
  ring.style.display = 'none';
  document.body.style.cursor = 'auto';
}

document.addEventListener('mousemove', e => { 
  mx = e.clientX; 
  my = e.clientY; 
});

function animateCursor() {
  cursor.style.left = mx + 'px';
  cursor.style.top = my + 'px';
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  ring.style.left = rx + 'px';
  ring.style.top = ry + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();
document.querySelectorAll('a, button, [class*="card"], [class*="row"]').forEach(el => {
  el.addEventListener('mouseenter', () => { cursor.style.transform = 'translate(-50%,-50%) scale(2)'; cursor.style.background = '#ff4d6d'; });
  el.addEventListener('mouseleave', () => { cursor.style.transform = 'translate(-50%,-50%) scale(1)'; cursor.style.background = '#00f5c8'; });
});

// Energy Chart
const canvas = document.getElementById('energyChart');
const ctx = canvas.getContext('2d');
const H = 220;

const years = ['2022','2023','2024','2025','2026','2027','2028'];
const data1 = [12, 22, 38, 64, 98, 148, 210];
const data2 = [2, 5, 9, 16, 32, 68, 130];
const data3 = [18, 30, 45, 72, 108, 162, 230];

function drawChart() {
  const rect = canvas.parentElement.getBoundingClientRect();
  const W = rect.width || 700;
  canvas.width = W;
  ctx.clearRect(0, 0, W, H);
  const pad = { left: 40, right: 20, top: 20, bottom: 30 };
  const cw = W - pad.left - pad.right;
  const ch = H - pad.top - pad.bottom;
  const maxVal = 240;

  // Grid
  for (let i = 0; i <= 4; i++) {
    const y = pad.top + ch - (i / 4) * ch;
    ctx.strokeStyle = 'rgba(0,245,200,0.06)';
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 5]);
    ctx.beginPath();
    ctx.moveTo(pad.left, y);
    ctx.lineTo(W - pad.right, y);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = 'rgba(0,245,200,0.25)';
    ctx.font = '10px Share Tech Mono';
    ctx.fillText(Math.round((i / 4) * maxVal), 2, y + 4);
  }

  function drawLine(data, color, dashed) {
    const pts = data.map((v, i) => ({
      x: pad.left + (i / (data.length - 1)) * cw,
      y: pad.top + ch - (v / maxVal) * ch
    }));

    // Area fill
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pad.top + ch);
    pts.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.lineTo(pts[pts.length - 1].x, pad.top + ch);
    ctx.closePath();
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, color + '20'); // ~12% opacity hex
    grad.addColorStop(1, color + '00'); // 0% opacity hex
    ctx.fillStyle = color + '15';
    ctx.fill();

    // Line
    ctx.beginPath();
    if (dashed) ctx.setLineDash([6, 4]);
    pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.setLineDash([]);

    // Dots
    pts.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
      ctx.strokeStyle = color + '40';
      ctx.lineWidth = 1;
      ctx.stroke();
    });
  }

  drawLine(data3, '#7b61ff', true);
  drawLine(data2, '#ff4d6d', false);
  drawLine(data1, '#00f5c8', false);

  // X labels
  years.forEach((yr, i) => {
    const x = pad.left + (i / (years.length - 1)) * cw;
    ctx.fillStyle = 'rgba(74,106,138,0.8)';
    ctx.font = '10px Share Tech Mono';
    ctx.textAlign = 'center';
    ctx.fillText(yr, x, H - 4);
  });
}

// Use window load to ensure custom fonts are ready for the canvas context
window.addEventListener('load', () => {
  drawChart();
});
window.addEventListener('resize', drawChart);