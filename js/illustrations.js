"use strict";

(function () {
  function villi() {
    const base = 198;
    const fingers = [
      [46, 78], [100, 108], [154, 86], [208, 122], [262, 96], [316, 116], [370, 84], [424, 104]
    ];
    const fingersSvg = fingers.map(function (item) {
      const x = item[0];
      const h = item[1];
      const w = 34;
      const top = base - h;
      const mid = x + w / 2;
      return (
        '<path d="M ' + x + " " + base +
        " C " + x + " " + (top + 30) + " " + (x - 2) + " " + (top + 18) + " " + mid + " " + top +
        " C " + (x + w + 2) + " " + (top + 18) + " " + (x + w) + " " + (top + 30) + " " + (x + w) + " " + base +
        ' Z" fill="#e7efe9" stroke="#1a1a1a" stroke-width="1.35" stroke-linejoin="round"/>' +
        '<path class="vein" d="M ' + mid + " " + (base - 8) + " L " + mid + " " + (top + 18) + '" fill="none" stroke="#243f34" stroke-width="1.15"/>' +
        '<circle cx="' + mid + '" cy="' + (top + 18) + '" r="2.2" fill="#243f34"/>'
      );
    }).join("");

    const rods = [
      [78, 52, -28], [132, 38, 18], [196, 58, -8], [248, 34, 24],
      [310, 54, -16], [368, 36, 12], [424, 58, -22]
    ];
    const microbes = rods.map(function (rod, i) {
      return (
        '<g transform="translate(' + rod[0] + " " + rod[1] + ") rotate(" + rod[2] + ')">' +
        '<rect class="bug" x="-11" y="-4" width="22" height="8" rx="4" fill="none" stroke="#8d7049" stroke-width="1.35" style="animation-delay:' + (i * 0.28) + 's"/>' +
        "</g>"
      );
    }).join("");
    const cocci = [[104, 70], [168, 46], [286, 68], [346, 48], [400, 72]].map(function (c, i) {
      return '<circle class="bug" cx="' + c[0] + '" cy="' + c[1] + '" r="3.2" fill="none" stroke="#8d7049" stroke-width="1.3" style="animation-delay:' + (i * 0.4) + 's"/>';
    }).join("");

    return (
      '<svg class="illus" viewBox="0 0 496 292" role="img" aria-label="Querschnitt der Darmwand mit Zotten, Blutgefäß in jeder Zotte und Mikroorganismen im Darmraum">' +
      '<rect width="496" height="292" fill="#f4f1ec"/>' +
      '<g class="microbes">' + microbes + cocci + "</g>" +
      fingersSvg +
      '<rect x="28" y="198" width="440" height="22" fill="#fffcf8" stroke="#1a1a1a" stroke-width="1.2"/>' +
      '<rect x="28" y="220" width="440" height="14" fill="#e7efe9" stroke="#243f34" stroke-width="1.15"/>' +
      '<path d="M248 92 L248 76" fill="none" stroke="#1a1a1a" stroke-width="0.8"/>' +
      '<g fill="#1a1a1a" font-family="Inter, Helvetica, Arial, sans-serif" font-size="11" letter-spacing="1.4">' +
      '<text x="28" y="272">MIKROBIOM</text>' +
      '<text x="196" y="70">ZOTTEN</text>' +
      '<text x="300" y="272">DARMWAND</text>' +
      "</g></svg>"
    );
  }

  function liver(prefix) {
    const id = prefix || "liver";
    return (
      '<svg class="illus" viewBox="0 0 496 300" role="img" aria-label="Leber mit großem und kleinem Lappen, Gallenblase und Wegen für Nährstoffe, Eiweiße und Speicher">' +
      "<defs>" +
      '<marker id="' + id + '-arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">' +
      '<path d="M0 0 L8 4 L0 8 Z" fill="#243f34"/></marker></defs>' +
      '<rect width="496" height="300" fill="#f4f1ec"/>' +
      '<path d="M118 196 C106 214 112 256 140 268 C168 256 172 214 158 196 C146 184 130 184 118 196 Z" fill="#f4eadb" stroke="#8d7049" stroke-width="1.45"/>' +
      '<path class="organ-liver" d="M48 128 C42 70 96 38 168 40 C228 42 276 64 304 102 C324 128 318 160 286 172 C260 182 248 164 226 170 C204 176 196 206 168 214 C124 226 72 196 56 160 C46 140 50 140 48 128 Z" fill="#d5e6db" stroke="#243f34" stroke-width="1.7"/>' +
      '<path d="M168 58 C174 90 176 118 168 142" fill="none" stroke="#243f34" stroke-width="1.1" opacity="0.45"/>' +
      '<path class="vein" d="M86 248 C86 228 108 214 132 206" fill="none" stroke="#243f34" stroke-width="1.35" marker-end="url(#' + id + '-arrow)"/>' +
      '<path class="path-draw" d="M300 118 C348 104 390 92 452 78" fill="none" stroke="#243f34" stroke-width="1.35" marker-end="url(#' + id + '-arrow)"/>' +
      '<path class="path-draw" d="M312 156 C360 150 400 146 458 136" fill="none" stroke="#243f34" stroke-width="1.35" marker-end="url(#' + id + '-arrow)"/>' +
      '<path class="path-draw" d="M292 196 C340 214 386 228 448 236" fill="none" stroke="#8d7049" stroke-width="1.35" marker-end="url(#' + id + '-arrow)"/>' +
      '<g fill="#1a1a1a" font-family="Inter, Helvetica, Arial, sans-serif" font-size="12" letter-spacing="0.4">' +
      '<text x="36" y="286">Pfortader</text>' +
      '<text x="392" y="66">Nährstoffe</text>' +
      '<text x="404" y="122">Eiweiße</text>' +
      '<text x="392" y="262">Speicher</text>' +
      '<text x="186" y="286">Galle</text>' +
      "</g></svg>"
    );
  }

  function cell() {
    return (
      '<svg class="illus" viewBox="0 0 496 300" role="img" aria-label="Zelle mit Zellkern und einem Mitochondrium, aus dem ATP austritt">' +
      '<rect width="496" height="300" fill="#f4f1ec"/>' +
      '<circle cx="188" cy="142" r="112" fill="#fffcf8" stroke="#1a1a1a" stroke-width="1.6"/>' +
      '<circle cx="188" cy="142" r="104" fill="none" stroke="#1a1a1a" stroke-width="0.7" opacity="0.35"/>' +
      '<circle cx="132" cy="112" r="34" fill="#e7efe9" stroke="#243f34" stroke-width="1.4"/>' +
      '<circle cx="132" cy="112" r="8" fill="#243f34"/>' +
      '<g transform="translate(214 162) rotate(-18)">' +
      '<ellipse rx="62" ry="30" fill="#fff" stroke="#8d7049" stroke-width="1.6"/>' +
      '<ellipse rx="50" ry="20" fill="none" stroke="#8d7049" stroke-width="1.05"/>' +
      '<path class="crista" d="M-34 -8 V8 M-16 -16 V16 M2 -18 V18 M20 -16 V16 M36 -8 V8" fill="none" stroke="#243f34" stroke-width="1.35"/>' +
      "</g>" +
      '<path d="M268 128 C310 112 338 104 368 96" fill="none" stroke="#243f34" stroke-width="1.2"/>' +
      '<g class="atp">' +
      '<circle cx="392" cy="84" r="16" fill="#fff" stroke="#1a1a1a" stroke-width="1.25"/>' +
      '<circle cx="438" cy="128" r="13" fill="#fff" stroke="#8d7049" stroke-width="1.25"/>' +
      '<circle cx="404" cy="172" r="11" fill="#fff" stroke="#243f34" stroke-width="1.25"/>' +
      "</g>" +
      '<g fill="#1a1a1a" font-family="Inter, Helvetica, Arial, sans-serif" font-size="11" letter-spacing="1.1">' +
      '<text x="376" y="88">ATP</text>' +
      '<text x="36" y="78">KERN</text>' +
      '<text x="28" y="276">ZELLMEMBRAN</text>' +
      '<text x="286" y="276">MITOCHONDRIUM</text>' +
      "</g>" +
      '<path d="M78 82 L108 100" fill="none" stroke="#1a1a1a" stroke-width="0.8"/>' +
      '<path d="M250 196 L330 262" fill="none" stroke="#1a1a1a" stroke-width="0.8"/>' +
      "</svg>"
    );
  }

  function hero() {
    return (
      '<svg class="illus hero-svg" viewBox="0 0 760 780" role="img" aria-label="Körper von vorn mit Leber, Magen, Dickdarm, Dünndarm und einer vergrößerten Zelle">' +
      "<defs>" +
      '<radialGradient id="heroWash" cx="46%" cy="46%" r="62%">' +
      '<stop offset="0%" stop-color="#f7f4ee"/>' +
      '<stop offset="70%" stop-color="#eef3ef"/>' +
      '<stop offset="100%" stop-color="#f3f1ee"/></radialGradient>' +
      '<marker id="hero-arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">' +
      '<path d="M0 0 L8 4 L0 8 Z" fill="#243f34"/></marker>' +
      "</defs>" +
      '<circle cx="340" cy="390" r="286" fill="url(#heroWash)"/>' +
      '<circle cx="340" cy="390" r="286" fill="none" stroke="#1a1a1a" stroke-width="0.7" opacity="0.16"/>' +
      '<g class="hero-dust" fill="#1a1a1a">' +
      '<circle cx="86" cy="150" r="2" opacity="0.28"/>' +
      '<circle cx="150" cy="660" r="1.6" opacity="0.22"/>' +
      '<circle cx="620" cy="150" r="2" opacity="0.2"/>' +
      '<circle cx="690" cy="470" r="1.5" opacity="0.28"/>' +
      "</g>" +
      '<path class="body-line" d="M292 118 C274 118 262 132 258 154 L196 186 C148 206 118 246 122 300 C128 390 140 470 150 530 C160 590 148 640 178 686 C214 736 280 758 340 760 C400 758 466 736 502 686 C532 640 520 590 530 530 C540 470 552 390 558 300 C562 246 532 206 484 186 L422 154 C418 132 406 118 388 118 C356 142 324 142 292 118 Z" fill="#fffcf8" stroke="#1a1a1a" stroke-width="1.45"/>' +
      '<path d="M214 196 C262 214 300 208 332 196" fill="none" stroke="#1a1a1a" stroke-width="0.9" opacity="0.35"/>' +
      '<path d="M348 196 C380 208 418 214 466 196" fill="none" stroke="#1a1a1a" stroke-width="0.9" opacity="0.35"/>' +
      '<path d="M332 168 C336 196 338 214 336 236" fill="none" stroke="#1a1a1a" stroke-width="1.2"/>' +
      '<path d="M214 300 C206 318 212 348 234 356 C256 348 260 318 248 300 C240 290 222 290 214 300 Z" fill="#f4eadb" stroke="#8d7049" stroke-width="1.35"/>' +
      '<path class="organ-liver" d="M186 268 C180 214 214 186 268 184 C318 182 348 204 352 234 C356 258 336 272 310 268 C290 264 280 284 258 292 C236 300 214 332 206 320 C196 306 188 292 186 268 Z" fill="#d5e6db" stroke="#243f34" stroke-width="1.7"/>' +
      '<path d="M262 196 C268 228 270 252 258 286" fill="none" stroke="#243f34" stroke-width="1.05" opacity="0.4"/>' +
      '<path d="M360 176 C366 204 378 222 392 240" fill="none" stroke="#1a1a1a" stroke-width="1.25"/>' +
      '<path d="M386 242 C360 228 352 256 362 292 C372 332 354 368 382 386 C418 408 462 390 470 346 C478 304 460 262 422 252 C404 246 396 256 386 242 Z" fill="#fffcf8" stroke="#1a1a1a" stroke-width="1.5"/>' +
      '<path d="M400 278 H448" fill="none" stroke="#1a1a1a" stroke-width="0.9" opacity="0.4"/>' +
      '<path d="M394 304 H444" fill="none" stroke="#1a1a1a" stroke-width="0.9" opacity="0.4"/>' +
      '<g class="colon" fill="#fffcf8" stroke="#1a1a1a" stroke-width="1.3">' +
      '<ellipse cx="236" cy="500" rx="20" ry="28"/>' +
      '<ellipse cx="232" cy="542" rx="20" ry="28"/>' +
      '<ellipse cx="236" cy="584" rx="20" ry="26"/>' +
      '<ellipse cx="268" cy="612" rx="28" ry="18"/>' +
      '<ellipse cx="314" cy="620" rx="28" ry="17"/>' +
      '<ellipse cx="360" cy="620" rx="28" ry="17"/>' +
      '<ellipse cx="406" cy="608" rx="28" ry="18"/>' +
      '<ellipse cx="434" cy="572" rx="18" ry="28"/>' +
      '<ellipse cx="438" cy="528" rx="18" ry="28"/>' +
      '<ellipse cx="430" cy="486" rx="18" ry="26"/>' +
      '<ellipse cx="400" cy="458" rx="28" ry="16"/>' +
      '<ellipse cx="352" cy="448" rx="28" ry="16"/>' +
      '<ellipse cx="304" cy="448" rx="28" ry="16"/>' +
      '<ellipse cx="250" cy="476" rx="24" ry="22"/>' +
      "</g>" +
      '<path class="organ-gut" d="M278 512 C278 478 316 478 316 512 C316 478 354 478 354 512 C354 478 392 478 392 512 M292 552 C292 522 328 522 328 552 C328 522 364 522 364 552" fill="none" stroke="#8d7049" stroke-width="2.6" stroke-linecap="round"/>' +
      '<path class="vein" d="M268 468 C256 420 248 370 252 308" fill="none" stroke="#243f34" stroke-width="1.45" marker-end="url(#hero-arrow)"/>' +
      '<path class="vein vein-slow" d="M352 230 C440 214 520 240 548 286" fill="none" stroke="#243f34" stroke-width="1.45" marker-end="url(#hero-arrow)"/>' +
      '<g transform="translate(612 300)">' +
      '<g class="cell-cluster">' +
      '<circle cx="0" cy="0" r="86" fill="none" stroke="#1a1a1a" stroke-width="0.7" stroke-dasharray="2 4" opacity="0.45"/>' +
      '<circle cx="0" cy="0" r="68" fill="#fffcf8" stroke="#1a1a1a" stroke-width="1.45"/>' +
      '<circle cx="-22" cy="-14" r="18" fill="#e7efe9" stroke="#243f34" stroke-width="1.2"/>' +
      '<circle cx="-22" cy="-14" r="4.5" fill="#243f34"/>' +
      '<g transform="translate(16 12) rotate(-16)">' +
      '<ellipse rx="28" ry="14" fill="#fff" stroke="#8d7049" stroke-width="1.25"/>' +
      '<path class="crista" d="M-16 -4 V4 M-4 -8 V8 M8 -8 V8 M18 -4 V4" fill="none" stroke="#243f34" stroke-width="1.1"/>' +
      "</g></g></g>" +
      '<g fill="#1a1a1a" font-family="Inter, Helvetica, Arial, sans-serif" font-size="14">' +
      '<path d="M168 230 H78" stroke="#1a1a1a" stroke-width="0.8"/>' +
      '<text x="18" y="226">Leber</text>' +
      '<path d="M214 600 L132 688" stroke="#1a1a1a" stroke-width="0.8"/>' +
      '<text x="78" y="708">Darm</text>' +
      '<text x="590" y="168">Zelle</text>' +
      "</g></svg>"
    );
  }

  function bodyPlate() {
    return (
      '<svg class="body-plate" viewBox="0 0 300 540" aria-hidden="true">' +
      '<path class="body-line" d="M128 28 C114 28 106 42 104 58 L78 78 C52 92 40 118 44 152 C50 214 56 268 60 322 C64 386 56 438 74 478 C94 520 122 538 150 540 C178 538 206 520 226 478 C244 438 236 386 240 322 C244 268 250 214 256 152 C260 118 248 92 222 78 L196 58 C194 42 186 28 172 28 C156 44 144 44 128 28 Z" fill="#fffcf8" stroke="#1a1a1a" stroke-width="1.35"/>' +
      '<path d="M96 86 C120 98 142 94 150 86" fill="none" stroke="#1a1a1a" stroke-width="0.8" opacity="0.35"/>' +
      '<path d="M150 86 C158 94 180 98 204 86" fill="none" stroke="#1a1a1a" stroke-width="0.8" opacity="0.35"/>' +
      '<path d="M150 70 C152 92 154 108 152 124" fill="none" stroke="#1a1a1a" stroke-width="1.05"/>' +
      '<path d="M108 168 C102 178 106 196 118 200 C130 196 132 178 124 168 C118 162 112 162 108 168 Z" fill="#f4eadb" stroke="#8d7049" stroke-width="1"/>' +
      '<path class="organ-liver" d="M72 148 C68 118 90 100 122 100 C150 100 170 116 174 136 C176 150 160 158 144 154 C130 150 124 164 112 166 C96 168 80 186 74 176 C68 166 70 158 72 148 Z" fill="#d5e6db" stroke="#243f34" stroke-width="1.3"/>' +
      '<path d="M156 118 C170 112 188 122 190 142 C192 164 176 184 158 186 C146 188 138 174 142 158 C146 140 146 126 156 118 Z" fill="#fffcf8" stroke="#1a1a1a" stroke-width="1.15"/>' +
      '<g class="colon" fill="#fffcf8" stroke="#1a1a1a" stroke-width="1">' +
      '<ellipse cx="96" cy="268" rx="11" ry="16"/>' +
      '<ellipse cx="94" cy="294" rx="11" ry="16"/>' +
      '<ellipse cx="98" cy="318" rx="12" ry="14"/>' +
      '<ellipse cx="122" cy="334" rx="16" ry="10"/>' +
      '<ellipse cx="152" cy="338" rx="16" ry="10"/>' +
      '<ellipse cx="182" cy="332" rx="16" ry="10"/>' +
      '<ellipse cx="204" cy="312" rx="11" ry="16"/>' +
      '<ellipse cx="206" cy="286" rx="11" ry="16"/>' +
      '<ellipse cx="200" cy="262" rx="12" ry="14"/>' +
      '<ellipse cx="176" cy="248" rx="16" ry="9"/>' +
      '<ellipse cx="146" cy="244" rx="16" ry="9"/>' +
      '<ellipse cx="118" cy="250" rx="15" ry="10"/>' +
      "</g>" +
      '<path class="organ-gut" d="M118 286 C118 268 140 268 140 286 C140 268 162 268 162 286 M124 308 C124 292 146 292 146 308" fill="none" stroke="#8d7049" stroke-width="1.7" stroke-linecap="round"/>' +
      '<path class="vein" d="M112 250 C108 220 100 190 108 164" fill="none" stroke="#243f34" stroke-width="1.1"/>' +
      "</svg>"
    );
  }

  function motif(figure) {
    if (figure === "skin") {
      return (
        '<g transform="translate(250 36)">' +
        '<rect x="0" y="20" width="230" height="36" fill="#fffcf8" stroke="#1a1a1a" stroke-width="1.3"/>' +
        '<rect x="0" y="56" width="230" height="48" fill="#e7efe9" stroke="#243f34" stroke-width="1.3"/>' +
        '<rect x="0" y="104" width="230" height="28" fill="#f4eadb" stroke="#8d7049" stroke-width="1.2"/>' +
        '<path d="M18 20 C28 8 40 8 50 20 M70 20 C80 6 96 6 106 20 M130 20 C140 8 154 8 164 20 M186 20 C196 8 210 8 220 20" fill="none" stroke="#1a1a1a" stroke-width="1.1"/>' +
        '<g fill="#1a1a1a" font-family="Inter, Helvetica, Arial, sans-serif" font-size="12" letter-spacing="1">' +
        '<text x="0" y="168">HAUTSCHICHTEN</text></g></g>'
      );
    }
    if (figure === "joint") {
      return (
        '<g transform="translate(268 28)" fill="#fffcf8" stroke="#1a1a1a" stroke-width="1.4">' +
        '<path d="M20 20 H150 C176 20 190 48 190 78 V92 H20 Z"/>' +
        '<path d="M20 118 H190 V132 C190 162 176 188 150 188 H20 Z"/>' +
        '<path d="M20 92 H190" fill="none" stroke="#8d7049" stroke-width="6"/>' +
        '<g fill="#1a1a1a" stroke="none" font-family="Inter, Helvetica, Arial, sans-serif" font-size="12" letter-spacing="1">' +
        '<text x="0" y="176">GELENKSPALT</text></g></g>'
      );
    }
    if (figure === "stomach") {
      return (
        '<g transform="translate(270 24)">' +
        '<path d="M70 8 C74 36 78 52 96 70" fill="none" stroke="#1a1a1a" stroke-width="1.4"/>' +
        '<path d="M96 64 C70 52 48 78 58 118 C68 160 40 186 70 196 C112 210 168 186 176 140 C184 96 156 70 120 74 C108 76 104 70 96 64 Z" fill="#fffcf8" stroke="#1a1a1a" stroke-width="1.5"/>' +
        '<path d="M86 110 H150 M80 136 H146" fill="none" stroke="#1a1a1a" stroke-width="0.9" opacity="0.45"/>' +
        '<g fill="#1a1a1a" font-family="Inter, Helvetica, Arial, sans-serif" font-size="12" letter-spacing="1"><text x="8" y="180">MAGEN</text></g></g>'
      );
    }
    if (figure === "muscle") {
      return (
        '<g transform="translate(262 40)" fill="none" stroke="#8d7049" stroke-width="1.5" stroke-linecap="round">' +
        '<path d="M10 20 C40 10 70 30 100 16 C140 0 180 28 210 14"/>' +
        '<path d="M10 48 C40 38 70 58 100 44 C140 28 180 56 210 42"/>' +
        '<path d="M10 76 C40 66 70 86 100 72 C140 56 180 84 210 70"/>' +
        '<path d="M10 104 C40 94 70 114 100 100 C140 84 180 112 210 98"/>' +
        '<g fill="#1a1a1a" stroke="none" font-family="Inter, Helvetica, Arial, sans-serif" font-size="12" letter-spacing="1"><text x="0" y="150">MUSKELFASERN</text></g></g>'
      );
    }
    if (figure === "head") {
      return (
        '<g transform="translate(300 16)">' +
        '<circle cx="70" cy="78" r="62" fill="#fffcf8" stroke="#1a1a1a" stroke-width="1.4"/>' +
        '<path d="M48 150 C52 132 88 132 92 150" fill="none" stroke="#1a1a1a" stroke-width="1.3"/>' +
        '<circle cx="108" cy="62" r="8" fill="none" stroke="#243f34" stroke-width="1.4"/>' +
        '<path d="M116 62 H150" stroke="#243f34" stroke-width="1"/>' +
        '<g fill="#1a1a1a" font-family="Inter, Helvetica, Arial, sans-serif" font-size="12" letter-spacing="1"><text x="0" y="190">KOPF</text></g></g>'
      );
    }
    if (figure === "vessel") {
      return (
        '<g transform="translate(250 48)">' +
        '<path d="M20 20 H210 V120 H20 Z" fill="#fffcf8" stroke="#1a1a1a" stroke-width="1.3"/>' +
        '<path d="M20 42 H210 M20 98 H210" fill="none" stroke="#243f34" stroke-width="8" opacity="0.35"/>' +
        '<path d="M20 70 H210" fill="none" stroke="#8d7049" stroke-width="1.2" stroke-dasharray="4 4"/>' +
        '<g fill="#1a1a1a" font-family="Inter, Helvetica, Arial, sans-serif" font-size="12" letter-spacing="1"><text x="0" y="158">GEFÄSSWAND</text></g></g>'
      );
    }
    if (figure === "liver") {
      return (
        '<g transform="translate(250 28)">' +
        '<path d="M24 78 C18 36 52 16 96 16 C136 16 168 36 176 64 C182 86 164 98 140 94 C122 90 114 108 96 112 C72 118 40 104 34 86 C26 72 26 90 24 78 Z" fill="#d5e6db" stroke="#243f34" stroke-width="1.5"/>' +
        '<path d="M78 104 C72 118 78 140 96 146 C114 140 118 118 108 104 C100 96 86 96 78 104 Z" fill="#f4eadb" stroke="#8d7049" stroke-width="1.2"/>' +
        '<g fill="#1a1a1a" font-family="Inter, Helvetica, Arial, sans-serif" font-size="12" letter-spacing="1"><text x="8" y="186">LEBER</text></g></g>'
      );
    }
    if (figure === "cell") {
      return (
        '<g transform="translate(286 20)">' +
        '<circle cx="80" cy="78" r="68" fill="#fffcf8" stroke="#1a1a1a" stroke-width="1.4"/>' +
        '<circle cx="52" cy="62" r="18" fill="#e7efe9" stroke="#243f34" stroke-width="1.2"/>' +
        '<circle cx="52" cy="62" r="4" fill="#243f34"/>' +
        '<ellipse cx="98" cy="96" rx="28" ry="14" fill="#fff" stroke="#8d7049" stroke-width="1.3"/>' +
        '<path d="M80 90 V102 M92 88 V104 M104 90 V102" fill="none" stroke="#243f34" stroke-width="1.1"/>' +
        '<g fill="#1a1a1a" font-family="Inter, Helvetica, Arial, sans-serif" font-size="12" letter-spacing="1"><text x="8" y="176">ZELLE</text></g></g>'
      );
    }
    if (figure === "none") {
      return (
        '<g transform="translate(230 78)" fill="#1a1a1a" font-family="Inter, Helvetica, Arial, sans-serif">' +
        '<text x="0" y="0" font-size="15">Nicht die erste Adresse</text>' +
        '<text x="0" y="28" font-size="12" fill="#5c574f">Darm, Leber und Zellen</text>' +
        '<text x="0" y="48" font-size="12" fill="#5c574f">klären das hier nicht.</text></g>'
      );
    }
    return (
      '<g transform="translate(248 46)">' +
      '<path d="M16 36 C8 8 28 0 52 4 C78 8 104 4 132 16 C156 26 176 18 196 28 C210 36 206 58 186 66 C150 80 120 62 96 70 C70 78 40 96 28 78 C18 64 22 52 16 36 Z" fill="#e7efe9" stroke="#243f34" stroke-width="1.4"/>' +
      '<path d="M36 70 V118 M70 78 V130 M104 74 V124 M138 66 V116" fill="none" stroke="#1a1a1a" stroke-width="1.2"/>' +
      '<path d="M20 118 H160" stroke="#1a1a1a" stroke-width="1.3"/>' +
      '<g fill="#1a1a1a" font-family="Inter, Helvetica, Arial, sans-serif" font-size="12" letter-spacing="1"><text x="0" y="156">DARMWAND</text></g></g>'
    );
  }

  function symptom(figure, systems) {
    const names = systems || [];
    const onGut = names.indexOf("Darm") !== -1;
    const onLiver = names.indexOf("Leber") !== -1;
    const onCell = names.indexOf("Zellen") !== -1;
    const gut = onGut ? "#8d7049" : "#c8c2ba";
    const liverFill = onLiver ? "#d5e6db" : "#eceae6";
    const liverLine = onLiver ? "#243f34" : "#c8c2ba";
    const cellLine = onCell ? "#1a1a1a" : "#c8c2ba";
    return (
      '<svg class="symptom-svg" viewBox="0 0 520 220" role="img" aria-label="Körper mit hervorgehobenen Bereichen und einer zugehörigen Struktur">' +
      '<rect width="520" height="220" fill="#f4f1ec"/>' +
      '<path d="M78 18 C70 18 66 26 66 36 L52 46 C40 52 36 64 38 78 C40 104 44 128 46 150 C48 176 44 196 52 212 H118 C126 196 122 176 124 150 C126 128 130 104 132 78 C134 64 130 52 118 46 L104 36 C104 26 100 18 92 18 C86 26 84 26 78 18 Z" fill="#fffcf8" stroke="#1a1a1a" stroke-width="1.2"/>' +
      '<path d="M58 92 C54 74 66 64 82 64 C96 64 106 74 108 88 C110 98 102 104 94 102 C86 100 82 108 76 108 C68 108 60 102 58 92 Z" fill="' + liverFill + '" stroke="' + liverLine + '" stroke-width="1.3"/>' +
      '<path d="M104 78 C114 74 126 80 126 92 C126 106 114 116 104 114 C96 112 94 100 98 92 C100 86 100 82 104 78 Z" fill="#fffcf8" stroke="#1a1a1a" stroke-width="1.05"/>' +
      '<g fill="#fffcf8" stroke="#1a1a1a" stroke-width="1">' +
      '<ellipse cx="64" cy="146" rx="6" ry="9"/>' +
      '<ellipse cx="64" cy="162" rx="6" ry="9"/>' +
      '<ellipse cx="76" cy="174" rx="9" ry="5"/>' +
      '<ellipse cx="94" cy="174" rx="9" ry="5"/>' +
      '<ellipse cx="110" cy="164" rx="6" ry="9"/>' +
      '<ellipse cx="110" cy="148" rx="6" ry="9"/>' +
      '<ellipse cx="98" cy="136" rx="8" ry="5"/>' +
      '<ellipse cx="80" cy="136" rx="8" ry="5"/>' +
      "</g>" +
      '<path d="M74 150 C78 138 86 138 90 150 C94 138 102 138 102 150" fill="none" stroke="' + gut + '" stroke-width="1.6" stroke-linecap="round"/>' +
      '<g transform="translate(138 28)">' +
      '<circle cx="22" cy="22" r="16" fill="#fffcf8" stroke="' + cellLine + '" stroke-width="1.2"/>' +
      '<circle cx="16" cy="18" r="5" fill="' + (onCell ? "#e7efe9" : "#eceae6") + '" stroke="' + cellLine + '" stroke-width="0.9"/>' +
      '<ellipse cx="26" cy="28" rx="7" ry="3.5" fill="#fff" stroke="' + (onCell ? "#8d7049" : "#c8c2ba") + '" stroke-width="0.9"/>' +
      "</g>" +
      motif(figure) +
      '<g font-family="Inter, Helvetica, Arial, sans-serif" font-size="11" letter-spacing="0.8">' +
      '<text x="16" y="214" fill="' + (onGut ? "#1a1a1a" : "#8a847c") + '">DARM</text>' +
      '<text x="70" y="214" fill="' + (onLiver ? "#1a1a1a" : "#8a847c") + '">LEBER</text>' +
      '<text x="124" y="214" fill="' + (onCell ? "#1a1a1a" : "#8a847c") + '">ZELLEN</text>' +
      "</g></svg>"
    );
  }

  globalThis.LR_ART = {
    hero: hero,
    gut: villi,
    liver: function () { return liver("liver"); },
    cell: cell,
    plate: bodyPlate,
    symptom: symptom
  };
})();
