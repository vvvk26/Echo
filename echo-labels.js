// ECHO object labels: one set of artwork used by both the scan (echo-scan-v13.html, as textures on the 3D objects)
// and the print sheet (print/labels/echo-object-labels.html), so what visitors see on screen matches the stickers.
// All drawing is in millimetres. Sizes match the 3D-printed objects (hardware/objects/make_objects.py):
//   jar    wraps all the way round the rounded-square jar (196.5 mm) + 6 mm overlap, 30 mm tall, from 16 mm up
//          (just above the engraved RX 914472) to the lid seam; the front centre sits at 98.25 mm from the left edge
//   kit    36.2 × 48 mm round the Ø13 tube (40.8 mm round, so a small gap at the back), text running up the tube
//   sensor Ø36 mm round label on the domed top
// The jar's overlap is at the right-hand end: it is blank and tucks under the start of the label.
(function () {
  const TEAL = '#0d5f63', INK = '#151515', GREY = '#5c5c5c';
  const mono = (mm, w = 400) => `${w} ${mm}px PlexMono, monospace`;
  const sans = (mm, w = 600) => `${w} ${mm}px Urbanist, sans-serif`;
  function barcode(c, x, y, w, h, seed, unit) {
    let s = seed;
    const rnd = () => (s = (s * 9301 + 49297) % 233280) / 233280;
    c.fillStyle = INK;
    for (let px = x; px < x + w;) { const bw = (1 + Math.floor(rnd() * 3)) * unit; if (rnd() > 0.45) c.fillRect(px, y, Math.min(bw, x + w - px), h); px += bw + unit; }
  }
  function matrix(c, x, y, size, seed) {   // a small 2D code
    let s = seed; const rnd = () => (s = (s * 9301 + 49297) % 233280) / 233280, n = 12, d = size / n;
    c.fillStyle = INK;
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++)
      if (i === 0 || j === n - 1 || (i === n - 1 && j % 2 === 0) || (j === 0 && i % 2 === 1) || rnd() > 0.52) c.fillRect(x + i * d, y + j * d, d, d);
  }
  const lines = (c, x, y, gap, rows) => rows.forEach((t, i) => c.fillText(t, x, y + i * gap));

  // ---------- Maya · prescription jar (draw in mm: 202.5 × 30, from 16 mm up to the lid seam at 46 mm) ----------
  const JAR = { loop: 196.5, overlap: 6, h: 30 };
  JAR.w = JAR.loop + JAR.overlap;
  JAR.draw = function (c) {
    const fc = JAR.loop / 2;   // front centre
    c.fillStyle = '#f5f2ea'; c.fillRect(0, 0, JAR.w, JAR.h);
    c.fillStyle = TEAL; c.fillRect(0, 0, JAR.loop, 5.6); c.fillRect(0, 28.6, JAR.loop, 0.4);
    c.fillStyle = '#fff';
    c.font = sans(3.3); c.fillText('CITYCARE PHARMACY', fc - 28, 4.0);
    c.font = mono(2); c.fillText('Rx · 2031', fc + 20, 3.7);
    c.fillText('14 HARBOUR ROW · MANCHESTER M4 2BW · 0161 555 0193', 6, 3.7);
    c.fillText('KEEP AWAY FROM HEAT AND LIGHT', fc + 52, 3.7);
    // front: the prescription
    c.fillStyle = INK; c.font = sans(6.6); c.fillText('Rx 914472', fc - 28, 13.4);
    c.fillStyle = '#222'; c.font = mono(2.7); lines(c, fc - 28, 17.6, 3.4, ['VERALIN 20 mg TABLETS', 'TAKE ONE TABLET DAILY', 'QTY 28    REFILLS 3']);
    c.fillStyle = GREY; c.font = mono(1.85); c.fillText('PATIENT  MAYA REYES     FILLED 02 AUG 2031', fc - 28, 27);
    // right side: barcode and pharmacist
    barcode(c, fc + 32, 8.2, 24, 12, 914472, 0.32);
    c.fillStyle = '#333'; c.font = mono(2); c.fillText('914472 0031', fc + 35, 23);
    c.fillStyle = GREY; c.font = mono(1.7); c.fillText('PHARMACIST  A. LIN', fc + 32, 27);
    // back right: warnings
    c.fillStyle = INK; c.font = mono(2, 500); c.fillText('WARNINGS', fc + 64, 9.6);
    c.fillStyle = '#333'; c.font = mono(1.8); lines(c, fc + 64, 13, 2.9, ['MAY CAUSE DROWSINESS.', 'DO NOT DRINK ALCOHOL.', 'KEEP OUT OF THE REACH', 'AND SIGHT OF CHILDREN.']);
    c.fillStyle = GREY; c.fillText('EXP 08 2032   LOT VR-2031-447', fc + 64, 27);
    // left side and back: pharmacy and patient details, medicine-info code
    c.fillStyle = INK; c.font = mono(2, 500); c.fillText('CITYCARE PHARMACY', 6, 9.6);
    c.fillStyle = '#333'; c.font = mono(1.8); lines(c, 6, 13, 2.9, ['14 HARBOUR ROW', 'MANCHESTER M4 2BW', '0161 555 0193', 'NHS DISPENSING 2031']);
    c.fillStyle = INK; c.font = mono(2, 500); c.fillText('DISPENSED FOR', 38, 9.6);
    c.fillStyle = '#333'; c.font = mono(1.8); lines(c, 38, 13, 2.9, ['MAYA REYES', 'REPEAT 1 OF 3', 'GP: DR S. AHMED']);
    matrix(c, 57, 8.6, 10, 914472); c.fillStyle = GREY; c.font = mono(1.4); c.fillText('SCAN FOR MEDICINE INFO', 50.5, 27);
  };

  // ---------- Emily · saliva kit tube (draw in mm: 36.2 around × 48 tall, text running up the tube) ----------
  // The earlier 16.2 mm design in the middle, with 10 mm added each side; it goes most of the way round
  // (the tube is 40.8 mm round), leaving a small gap at the back.
  const KIT = { w: 36.2, h: 48, side: 10 };
  KIT.draw = function (c) {
    c.fillStyle = '#f6f6f2'; c.fillRect(0, 0, KIT.w, KIT.h);
    // turn the drawing so x runs up the tube (0 = bottom) and y runs round it, left to right
    c.save(); c.translate(0, KIT.h); c.rotate(-Math.PI / 2);
    // sides: a thin teal rule and small handling notes, kept quiet so the middle reads first
    c.fillStyle = TEAL; c.fillRect(0, KIT.side - 0.9, KIT.h, 0.25); c.fillRect(0, KIT.w - KIT.side + 0.65, KIT.h, 0.25);
    c.fillStyle = '#444'; c.font = mono(1.6); lines(c, 3, 3.4, 2.3, ['STORE AT ROOM TEMPERATURE', 'RETURN WITHIN 30 DAYS', 'NO FOOD OR DRINK 30 MIN BEFORE']);
    c.fillStyle = GREY; c.font = mono(1.5); lines(c, 3, KIT.w - KIT.side + 3.6, 2.3, ['HELIX HOME DNA · LAB 7', 'KIT 2026-55913', 'DO NOT OPEN THE TUBE']);
    // middle: the earlier design, its artwork 1100 × 420 drawn into 48 × 16.2 mm
    c.translate(0, KIT.side); c.scale(KIT.h / 1100, 16.2 / 420);
    c.fillStyle = TEAL; c.fillRect(0, 0, 1100, 60);
    c.fillStyle = '#fff'; c.font = '600 34px Urbanist, sans-serif'; c.fillText('GENOME RETURN KIT', 40, 42);
    c.fillStyle = '#111'; c.font = '600 56px Urbanist, sans-serif'; c.fillText('KIT 2026-55913', 40, 140);
    c.fillStyle = '#333'; c.font = '28px PlexMono, monospace'; c.fillText('SALIVA · 2 mL · DNA', 40, 195); c.fillText('RETURNED 14 MAR 2026', 40, 238);
    barcode(c, 40, 280, 560, 110, 55913, 1.6);
    c.fillStyle = '#c33'; c.fillRect(680, 280, 360, 50); c.fillStyle = '#fff'; c.font = '600 26px PlexMono, monospace'; c.fillText('BIOLOGICAL SAMPLE', 700, 314);
    c.restore();
  };

  // ---------- Daniel · glucose sensor (draw in mm: Ø36 round label) ----------
  const SENSOR = { w: 36, h: 36 };
  SENSOR.draw = function (c) {
    const R = 18;
    c.save(); c.translate(R, R);
    c.beginPath(); c.arc(0, 0, R, 0, Math.PI * 2); c.clip();
    c.fillStyle = '#f4f5f3'; c.fillRect(-R, -R, 2 * R, 2 * R);
    c.strokeStyle = TEAL; c.lineWidth = 0.5; c.beginPath(); c.arc(0, 0, R - 1.3, 0, Math.PI * 2); c.stroke();
    c.lineWidth = 2.3; c.beginPath(); c.arc(0, 0, R - 2.9, Math.PI * 0.3, Math.PI * 0.7); c.stroke();   // teal arc along the bottom
    c.textAlign = 'center';
    c.fillStyle = INK; c.font = sans(3.4); c.fillText('GLYCOSENSE', 0, -7.6);
    c.fillStyle = GREY; c.font = mono(1.25); c.fillText('CONTINUOUS GLUCOSE SENSOR', 0, -4.9);
    // centre: where the filament goes in
    c.fillStyle = '#c9cdcf'; c.beginPath(); c.arc(0, 0, 2.3, 0, Math.PI * 2); c.fill();
    c.fillStyle = '#7d858a'; c.beginPath(); c.arc(0, 0, 0.9, 0, Math.PI * 2); c.fill();
    // left: 14-day badge, right: device code
    c.fillStyle = TEAL; c.beginPath(); c.arc(-8.6, 0, 2.9, 0, Math.PI * 2); c.fill();
    c.fillStyle = '#fff'; c.font = sans(2.6); c.fillText('14', -8.6, 0.95);
    matrix(c, 6.3, -2.3, 4.6, 8117);
    c.fillStyle = INK; c.font = mono(2.15, 500); c.fillText('SN 8F2-117', 0, 6.4);
    c.fillStyle = GREY; c.font = mono(1.2); c.fillText('14 DAY WEAR · LOT 2036-0412', 0, 8.9);
    c.fillStyle = '#fff'; c.font = mono(1.05, 500); c.fillText('UPPER ARM ONLY', 0, R - 2.55);
    c.restore();
  };

  // draw(canvas, label, pxPerMm): fills a canvas at that resolution and returns it
  function paint(label, pxPerMm) {
    const cv = document.createElement('canvas');
    cv.width = Math.round(label.w * pxPerMm); cv.height = Math.round(label.h * pxPerMm);
    const c = cv.getContext('2d'); c.scale(pxPerMm, pxPerMm); label.draw(c);
    return cv;
  }
  window.ECHO_LABELS = { jar: JAR, kit: KIT, sensor: SENSOR, paint };
})();
