(() => {
  const S = window.SITE;
  const BASE = window.BASE || '';
  const MODE = document.body.dataset.mode; // both | barat | walima
  const EVENTS = MODE === 'both' ? ['barat', 'walima'] : [MODE];
  const img = (f) => `${BASE}assets/img/${f}`;
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let active = EVENTS[0];

  /* ---------- small helpers ---------- */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const ordinal = (s) => esc(s).replace(/(\d)(st|nd|rd|th)\b/, '$1<sup>$2</sup>');
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  // seeded random so clouds look the same on every visit
  const rng = (seed) => () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;

  const PIN = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Z" fill="currentColor"/><circle cx="12" cy="10" r="2.6" fill="#FBF6EC"/></svg>`;

  /* ---------- opener: envelope and gold wax seal ---------- */
  const SEAL = `<img class="seal-img" src="${img('seal.webp')}" alt="" draggable="false">`;

  /* ---------- markup ---------- */
  const names = `${esc(S.groom)} <span class="amp">&amp;</span> ${esc(S.bride)}`;

  function openerHTML() {
    return `
    <div class="opener" id="opener">
      <div class="flap flap-left"><i></i></div>
      <div class="flap flap-right"><i></i></div>
      <div class="flap flap-bottom"><i></i></div>
      <div class="flap flap-top"><i></i></div>
      <div class="opener-center">
        <button class="seal" id="seal" aria-label="Open the invitation">${SEAL}</button>
        <p class="caps tiny tap">tap to open</p>
      </div>
      <p class="opener-foot caps tiny"><span>${names}</span><i> &nbsp;·&nbsp; </i><span>${EVENTS.map((k) => S.events[k].label).join(' &amp; ')}</span></p>
    </div>`;
  }

  function navHTML() {
    const tabs = MODE === 'both' ? `
      <div class="tabs" role="tablist">
        ${EVENTS.map((k) => `<button role="tab" data-tab="${k}" aria-selected="${k === active}">
          <span class="tab-en">${S.events[k].label} <em>${S.events[k].dateShort[0]}.12</em></span>
          ${S.events[k].urdu ? `<span class="tab-ur" lang="ur">${S.events[k].urdu}</span>` : ''}</button>`).join('')}
      </div>` : `<div class="monogram script">M<small>&amp;</small>A</div>`;
    return `<nav class="topbar">${tabs}
      <button class="music" id="music" aria-label="Toggle music" hidden>
        <span></span><span></span><span></span><span></span>
      </button></nav>`;
  }

  // full-bleed photo per event: landscape picture on wide screens, portrait on phones
  const HERO_PHOTOS = {
    barat: { wide: 'garden-steps.webp', tall: 'garden-steps.webp', alt: 'Maaz and Alina walking down the garden steps' },
    walima: { wide: 'walima-steps.webp', tall: 'walima-steps.webp', alt: 'Maaz and Alina on the garden steps at sunset' },
  };

  function heroHTML() {
    return `
    <header class="hero" id="hero">
      ${EVENTS.map((k) => `<picture class="hero-photo" data-for="${k}" data-depth="0.3">
        <source media="(min-aspect-ratio: 1/1)" srcset="${img(HERO_PHOTOS[k].wide)}">
        <img src="${img(HERO_PHOTOS[k].tall)}" alt="${HERO_PHOTOS[k].alt}">
      </picture>`).join('')}
      <div class="hero-shade"></div>
      <div class="hero-veil"></div>
      <div class="hero-text" data-depth="0.12">
        <p class="caps tiny hero-kicker"></p>
        <h2 class="script hero-names">${names}</h2>
      </div>
      <a class="scroll-cue" href="#event-root" aria-label="Scroll down"><span></span></a>
    </header>`;
  }

  // a soft cumulus cloud: overlapping puffs with cottony edges, lit from above with a lavender underside
  const CLOUD_DEFS = `<linearGradient id="cloud-body" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#FBF8F4"/><stop offset=".5" stop-color="#EFE8E6"/>
        <stop offset=".8" stop-color="#DCD3DB"/><stop offset="1" stop-color="#CBC2D0"/>
      </linearGradient>
      <radialGradient id="puff-light" cx="40%" cy="32%" r="78%">
        <stop offset="0" stop-color="#FFFFFF" stop-opacity=".8"/><stop offset=".5" stop-color="#FFFCF7" stop-opacity=".4"/>
        <stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="cloud-under" cx="50%" cy="60%" r="60%">
        <stop offset="0" stop-color="#B9AFC4" stop-opacity=".55"/><stop offset="1" stop-color="#B9AFC4" stop-opacity="0"/>
      </radialGradient>
      <filter id="cloud-soft" x="-15%" y="-25%" width="130%" height="150%">
        <feTurbulence type="fractalNoise" baseFrequency="0.013" numOctaves="3" seed="8" result="n"/>
        <feDisplacementMap in="SourceGraphic" in2="n" scale="22" xChannelSelector="R" yChannelSelector="G"/>
        <feGaussianBlur stdDeviation="3.6"/>
      </filter>`;

  function puffCloud(seed, w = 600, h = 280) {
    const r = rng(seed);
    const id = `pc${seed}`;
    let puffs = '';
    const n = 9 + Math.floor(r() * 4);
    for (let i = 0; i < n; i++) {
      const t = (i + 0.5) / n;
      const peak = Math.sin(t * Math.PI) ** 0.7;
      const rad = 30 + peak * (50 + r() * 50);
      const x = 50 + t * (w - 100) + (r() - 0.5) * 36;
      const y = h * 0.62 - peak * (40 + r() * 46);
      puffs += `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${rad.toFixed(0)}"/>`;
      // softer, smaller puffs underneath so the base is billowy, not flat
      puffs += `<circle cx="${(x + (r() - 0.5) * 40).toFixed(0)}" cy="${(h * 0.7 + r() * 14).toFixed(0)}" r="${(rad * 0.62).toFixed(0)}"/>`;
    }
    // a few billowing towers so no two clouds share a silhouette
    const towers = 2 + Math.floor(r() * 3);
    for (let i = 0; i < towers; i++) {
      const x = w * (0.22 + r() * 0.56);
      const rad = 38 + r() * 46;
      const y = h * 0.62 - (70 + r() * 70);
      puffs += `<circle cx="${x.toFixed(0)}" cy="${Math.max(rad + 6, y).toFixed(0)}" r="${rad.toFixed(0)}"/>`;
      puffs += `<circle cx="${(x + rad * 0.7).toFixed(0)}" cy="${Math.max(rad, y + rad * 0.5).toFixed(0)}" r="${(rad * 0.7).toFixed(0)}"/>`;
    }
    // layered for volume: a base wash lit from above, a highlight on every puff, and a cool shadow tucked underneath.
    // Padded so soft edges never get trimmed.
    const P = 90;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w + P * 2}" height="${h + P}" viewBox="${-P} ${-P} ${w + P * 2} ${h + P}">
      <defs>${CLOUD_DEFS}<clipPath id="${id}">${puffs}</clipPath></defs>
      <g filter="url(#cloud-soft)"><g clip-path="url(#${id})">
        <rect x="-60" y="-160" width="${w + 120}" height="${h + 220}" fill="url(#cloud-body)"/>
        <g fill="url(#puff-light)">${puffs}</g>
        <ellipse cx="${w / 2}" cy="${h * 0.86}" rx="${w * 0.48}" ry="${h * 0.2}" fill="url(#cloud-under)"/>
      </g></g></svg>`;
    const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
    return `<img class="puff" src="${url}" alt="" decoding="async" draggable="false">`;
  }

  // the sky we descend through on the way to "Save the date": far, middle and near clouds; the near ones part as you scroll
  const SKY = `
    <div class="cs-wrap"><div class="cs-sky"></div>
    <div class="cs-layer cs-far">
      <div class="c" style="left:-6%;top:8%;width:34%">${puffCloud(3, 600, 280)}</div>
      <div class="c" style="left:26%;top:2%;width:26%">${puffCloud(17, 520, 260)}</div>
      <div class="c" style="left:52%;top:10%;width:24%">${puffCloud(23, 500, 250)}</div>
      <div class="c" style="right:-8%;top:4%;width:34%">${puffCloud(29, 620, 280)}</div>
    </div>
    <div class="cs-layer cs-mid">
      <div class="c" style="left:-10%;top:30%;width:46%">${puffCloud(41, 720, 320)}</div>
      <div class="c" style="left:30%;top:36%;width:40%">${puffCloud(47, 700, 300)}</div>
      <div class="c" style="right:-10%;top:28%;width:46%">${puffCloud(53, 740, 320)}</div>
    </div></div>`;
  const NEAR_CLOUDS = `
    <div class="cs-near" aria-hidden="true">
      <div class="c cs-left">${puffCloud(61, 900, 380)}</div>
      <div class="c cs-right">${puffCloud(73, 900, 380)}</div>
      <div class="c cs-centre">${puffCloud(87, 1000, 340)}</div>
    </div>`;

  function sectionHead(kicker, title) {
    return `<div class="sec-head" data-reveal>
      <p class="sec-num"><span></span></p>
      <p class="caps tiny">${kicker}</p>
      <h3 class="display">${title}</h3>
    </div>`;
  }

  const monthOf = (e) => new Date(e.start).toLocaleString('en-GB', { month: 'long', timeZone: 'Asia/Karachi' });
  const yearOf = (e) => new Date(e.start).toLocaleString('en-GB', { year: 'numeric', timeZone: 'Asia/Karachi' });

  // the card's wording and a large, clear date, over faded mountains and flowers
  function dayHTML(k) {
    const e = S.events[k];
    const lead = k === 'walima'
      ? 'request the pleasure of your company at their <em>Walima Reception</em>'
      : 'invite you to join them on their <em>wedding day</em>';
    return `<section class="sec day">
      <div class="scenery" aria-hidden="true">${SKY}
        ${sprig('bl', 3)}${sprig('br', 11, 3)}${petals(7)}
      </div>
      ${NEAR_CLOUDS}
      ${sectionHead('Save the date', `The ${e.label}`)}
      <div class="day-body" data-reveal>
        <p class="day-lead">Together with their families, ${esc(S.groom)} &amp; ${esc(S.bride)} ${lead}</p>
        <div class="bigdate">
          <span class="bd-num">${e.dateShort[0]}</span>
          <span class="bd-meta"><b>${monthOf(e)}</b><i>${yearOf(e)}</i></span>
        </div>
        <p class="bd-weekday caps">${esc(e.weekday)}</p>
        <p class="bd-time">${k === 'barat' ? 'Ceremony begins at ' : 'From '}<b>${esc(e.time)}</b></p>
        ${e.after ? `<p class="bd-after">${esc(e.after)}</p>` : ''}
        <div class="countdown" data-target="${e.start}">
          ${['days', 'hours', 'minutes', 'seconds'].map((u) => `<div class="cd"><b data-u="${u}">${reel()}${reel()}</b><span class="caps tiny">${u}</span></div>`).join('')}
        </div>
        ${e.departure ? `<div class="depart" data-reveal>
          <p class="caps tiny muted">Barat departure</p>
          <p class="depart-time">${esc(e.departure.time)}</p>
          <p class="depart-place">from ${esc(e.departure.place)}, ${esc(e.departure.city)}</p>
          <div class="btns"><a class="btn ghost" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(e.departure.mapQuery)}" target="_blank" rel="noopener">${PIN} Directions</a></div>
        </div>` : ''}
      </div>
    </section>`;
  }

  // one digit of the counter: a strip of 0–9 that slides to show the current number
  const reel = () => `<span class="dg"><span class="reel">${[...'0123456789'].map((d) => `<span>${d}</span>`).join('')}</span></span>`;

  // a contact's number as a tap-to-call link, plus WhatsApp
  const digits = (p) => p.replace(/[^\d]/g, '');
  const phoneLinks = (c) => `<a href="tel:+${digits(c.phone)}">${esc(c.phone)}</a> <span class="sep">·</span> <a href="https://wa.me/${digits(c.phone)}" target="_blank" rel="noopener">WhatsApp</a>`;

  function mapsUrl(e) {
    return e.mapsLink || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(e.mapQuery)}`;
  }

  function detailsHTML(k) {
    const e = S.events[k];
    return `<section class="sec details-sec">
      ${sectionHead('The venue', 'Find your way to us')}
      <div class="details" data-reveal>
        <div class="venue-info">
          <p class="caps tiny muted">${esc(e.label)} venue</p>
          <p class="venue-name">${esc(e.venue)}</p>
          <p class="venue-addr">${esc(e.address)}</p>
          <div class="btns">
            <a class="btn" href="${mapsUrl(e)}" target="_blank" rel="noopener">${PIN} Open in Google Maps</a>
            <button class="btn ghost" data-cal="${k}">Add to calendar</button>
          </div>
        </div>
        <div class="map-wrap">${sprig('map', 21)}<div class="map-frame">
          <iframe title="Map to ${esc(e.venue)}" loading="lazy" referrerpolicy="no-referrer-when-downgrade"
            src="https://maps.google.com/maps?q=${encodeURIComponent(e.mapQuery)}&z=14&output=embed"></iframe>
        </div></div>
      </div>
    </section>`;
  }

  function timelineHTML(k) {
    const e = S.events[k];
    return `<section class="sec timeline-sec">
      ${sectionHead('The programme', 'How the day unfolds')}
      <ol class="timeline">
        ${e.timeline.map((t) => `<li data-reveal>
          <span class="t-time caps">${esc(t.time)}</span>
          <span class="t-dot"></span>
          <div class="t-body"><b class="serif">${esc(t.title)}</b><span>${esc(t.note)}</span></div>
        </li>`).join('')}
      </ol>
    </section>`;
  }

  function eventHTML(k) {
    const e = S.events[k];
    return dayHTML(k) + detailsHTML(k) + (e.timeline.length > 2 ? timelineHTML(k) : '');
  }

  // botanical branch: shaded leaves with veins along a curved stem, plus soft blossoms
  function branch(seed, { from, c1, c2, to, leaves = 9, blooms = 0, scale = 1 }) {
    const r = rng(seed);
    const at = (t) => { // point and angle on the stem's bezier
      const u = 1 - t;
      const x = u * u * u * from[0] + 3 * u * u * t * c1[0] + 3 * u * t * t * c2[0] + t * t * t * to[0];
      const y = u * u * u * from[1] + 3 * u * u * t * c1[1] + 3 * u * t * t * c2[1] + t * t * t * to[1];
      const dx = 3 * u * u * (c1[0] - from[0]) + 6 * u * t * (c2[0] - c1[0]) + 3 * t * t * (to[0] - c2[0]);
      const dy = 3 * u * u * (c1[1] - from[1]) + 6 * u * t * (c2[1] - c1[1]) + 3 * t * t * (to[1] - c2[1]);
      return [x, y, (Math.atan2(dy, dx) * 180) / Math.PI + 90];
    };
    const leaf = (L, W, tone) => `
      <path d="M0 0C${W * 0.95} ${-L * 0.22} ${W * 0.85} ${-L * 0.72} 0 ${-L}C${-W * 0.85} ${-L * 0.72} ${-W * 0.95} ${-L * 0.22} 0 0Z" fill="url(#lf-${tone})"/>
      <path d="M0 0Q${W * 0.1} ${-L * 0.5} 0 ${-L * 0.96}" stroke="#E4ECD6" stroke-opacity=".55" stroke-width="1.1" fill="none"/>
      ${[0.28, 0.48, 0.68].map((t) => `<path d="M0 ${-L * t}q${W * 0.45} ${-L * 0.06} ${W * 0.66} ${-L * 0.17}M0 ${-L * t}q${-W * 0.45} ${-L * 0.06} ${-W * 0.66} ${-L * 0.17}" stroke="#E4ECD6" stroke-opacity=".28" stroke-width=".7" fill="none"/>`).join('')}`;
    const flower = (R) => `
      ${[0, 72, 144, 216, 288].map((a) => `<path transform="rotate(${a})" d="M0 0C${R * 0.62} ${-R * 0.18} ${R * 0.72} ${-R * 0.92} 0 ${-R}C${-R * 0.72} ${-R * 0.92} ${-R * 0.62} ${-R * 0.18} 0 0Z" fill="url(#petal)"/>`).join('')}
      <circle r="${R * 0.2}" fill="#E7C46E"/>
      ${[0, 60, 120, 180, 240, 300].map((a) => `<circle transform="rotate(${a})" cx="0" cy="${-R * 0.3}" r="1.3" fill="#C99A3E"/>`).join('')}`;
    let out = `<path class="stem" pathLength="1" d="M${from}C${c1} ${c2} ${to}" stroke="#5E6F45" stroke-width="${2.6 * scale}" fill="none" stroke-linecap="round"/>`;
    for (let i = 0; i < leaves; i++) {
      const t = 0.08 + (i / leaves) * 0.88;
      const [x, y, ang] = at(t);
      const side = i % 2 ? 1 : -1;
      const L = (78 - t * 38 + r() * 14) * scale;
      const tone = ['a', 'b', 'c'][Math.floor(r() * 3)];
      out += `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${(ang + side * (38 + r() * 18)).toFixed(1)})"><g class="lf" style="--i:${i}">${leaf(L, L * 0.3, tone)}</g></g>`;
    }
    const [tx, ty, ta] = at(1);
    out += `<g transform="translate(${tx.toFixed(1)} ${ty.toFixed(1)}) rotate(${ta.toFixed(1)})"><g class="lf" style="--i:${leaves}">${leaf(46 * scale, 13 * scale, 'a')}</g></g>`;
    for (let i = 0; i < blooms; i++) {
      const [x, y] = at(0.25 + i * (0.6 / Math.max(1, blooms - 1)));
      const off = (i % 2 ? 1 : -1) * 22 * scale;
      out += `<g transform="translate(${(x + off).toFixed(1)} ${(y - 10 * scale).toFixed(1)}) rotate(${(r() * 70).toFixed(0)})"><g class="bl" style="--j:${i}">${flower((16 + r() * 7) * scale)}</g></g>`;
      out += `<g transform="translate(${(x - off * 0.6).toFixed(1)} ${(y + 14 * scale).toFixed(1)})"><g class="bl" style="--j:${i + 0.5}"><ellipse rx="${5 * scale}" ry="${7 * scale}" fill="#F0C9CF"/></g></g>`;
    }
    return out;
  }

  const LEAF_DEFS = `<defs>
      <linearGradient id="lf-a" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#93AC7A"/><stop offset=".5" stop-color="#7A975F"/><stop offset="1" stop-color="#58744A"/></linearGradient>
      <linearGradient id="lf-b" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#A9BF94"/><stop offset=".5" stop-color="#8CA676"/><stop offset="1" stop-color="#6A8656"/></linearGradient>
      <linearGradient id="lf-c" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#7F9A6E"/><stop offset=".5" stop-color="#647F53"/><stop offset="1" stop-color="#46603A"/></linearGradient>
      <radialGradient id="petal" cx="50%" cy="85%" r="90%"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".55" stop-color="#FBE6E8"/><stop offset="1" stop-color="#EDBDC5"/></radialGradient>
      <filter id="leaf-shadow" x="-10%" y="-10%" width="120%" height="120%"><feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#3A4A2A" flood-opacity=".22"/></filter>
    </defs>`;

  const FOLIAGE = `
    <svg class="fg fg-leaves" viewBox="0 0 400 400" aria-hidden="true">${LEAF_DEFS}
      <g class="sway" filter="url(#leaf-shadow)">
        ${branch(7, { from: [10, 400], c1: [80, 300], c2: [170, 250], to: [330, 170], leaves: 11, blooms: 2 })}
        ${branch(19, { from: [0, 330], c1: [60, 300], c2: [120, 300], to: [210, 330], leaves: 6, scale: 0.8 })}
      </g>
    </svg>
    <svg class="fg fg-blooms" viewBox="0 0 400 400" aria-hidden="true">
      <g class="sway sway-tr" filter="url(#leaf-shadow)">
        ${branch(29, { from: [400, 10], c1: [330, 60], c2: [260, 90], to: [150, 170], leaves: 8, blooms: 3, scale: 0.85 })}
      </g>
    </svg>`;

  // a flowering branch rooted in one corner; `pos` places and mirrors it, the inner group sways
  function sprig(pos, seed, blooms = 2) {
    return `<div class="sprig sprig-${pos}" aria-hidden="true"><svg viewBox="0 0 400 400">
      <g class="sway" filter="url(#leaf-shadow)" style="animation-delay:-${(seed % 7) * 0.9}s">
        ${branch(seed, { from: [6, 400], c1: [80, 300], c2: [170, 250], to: [330, 170], leaves: 10, blooms })}
        ${branch(seed + 3, { from: [0, 336], c1: [60, 300], c2: [120, 300], to: [210, 330], leaves: 5, scale: 0.75 })}
      </g></svg></div>`;
  }

  // a few blossom petals drifting down through a section
  const petals = (n) => `<div class="petals" aria-hidden="true">${Array.from({ length: n }, (_, i) =>
    `<i style="left:${(i * 37 + 9) % 100}%;animation-delay:-${(i * 2.3).toFixed(1)}s;animation-duration:${14 + (i % 3) * 4}s"></i>`).join('')}</div>`;

  function storyHTML() {
    const text = (s) => `<div class="moment-text">
        <h4 class="display">${esc(s.title)}</h4>
        <p>${esc(s.text)}</p>
        ${s.closing ? `<p class="closing">${esc(s.closing)}</p>` : ''}
      </div>`;
    const photo = (s) => `<img loading="lazy" src="${img(s.img)}" alt="${esc(s.title)}">`;
    const fx = {
      // wide picture whose edges fade into the paper
      fade: (s) => `<article class="moment moment-fade" data-reveal><figure class="fx-fade">${photo(s)}</figure>${text(s)}</article>`,
      // soft-edged picture with leaves and blossoms in front
      nature: (s, i) => `<article class="moment ${i % 2 ? 'flip' : ''}" data-reveal>
          <figure class="fx-nature">${photo(s)}${FOLIAGE}</figure>${text(s)}</article>`,
      // unframed picture that melts away on the side facing the words, and at top and bottom
      soft: (s, i) => `<article class="moment ${i % 2 ? 'flip' : ''}" data-reveal>
          <figure class="fx-soft">${photo(s)}</figure>${text(s)}</article>`,
      arch: (s, i) => `<article class="moment ${i % 2 ? 'flip' : ''}" data-reveal>
          <figure class="arch">${photo(s)}</figure>${text(s)}</article>`,
    };
    return `<section class="sec story-sec" id="story">
      ${sectionHead('Our story', 'A little of us')}
      <div class="story">${S.story.map((s, i) => (fx[s.fx] || fx.arch)(s, i)).join('')}</div>
    </section>`;
  }

  // the event's own questions first, then the shared ones, then who to call
  function faqHTML(k) {
    const e = S.events[k];
    const items = [...(e.faq || []), ...S.faq].map((q) => [esc(q.q), esc(q.a)]);
    if (e.contact) items.push(['Whom do I contact on the day?', `${esc(e.contact.name)} — ${phoneLinks(e.contact)}`]);
    return items.map(([q, a]) => `<details><summary><span>${q}</span><i></i></summary><p>${a}</p></details>`).join('');
  }

  function familiesHTML() {
    const f = S.families;
    return `<section class="sec families-sec">
      ${sectionHead('With love', 'From our families')}
      <div class="families" data-reveal>
        ${sprig('tl', 27)}${sprig('tr', 33, 3)}
        <p class="dua" lang="ar">${f.duaArabic}</p>
        <p class="dua-en">${esc(f.duaEnglish)}</p>
        <span class="hrule"></span>
        <p class="message">${esc(f.message).split(' ').map((w, i) => `<span class="w" style="--w:${i}">${w}</span>`).join(' ')}</p>
        <p class="caps tiny signoff">— ${esc(f.signoff)}</p>
      </div>
      <div class="faq" id="faq-root" data-reveal></div>
    </section>`;
  }

  function footerHTML() {
    return `<footer class="footer" id="footer">
      ${petals(6)}
      <div class="footer-text" data-reveal>
        ${sprig('fl', 41)}${sprig('fr', 47, 3)}
        <p class="caps tiny muted">with love,</p>
        <p class="script signature">${names}</p>
        ${S.hashtag ? `<p class="hashtag">${esc(S.hashtag)}</p>` : ''}
      </div>
      <figure class="footer-photo"><img loading="lazy" src="${img('family.webp')}" alt="Maaz and Alina with their families"></figure>
    </footer>`;
  }

  /* ---------- render ---------- */
  const app = $('#app');
  app.innerHTML = '<div class="env-back" id="env-back"></div>' + openerHTML() + navHTML() + heroHTML() +
    `<main><div id="event-root"></div>${storyHTML()}${familiesHTML()}</main>` + footerHTML();

  const root = $('#event-root');

  function setHero(k) {
    const e = S.events[k];
    const title = e.heroTitle || `The ${e.label}`;
    const urdu = e.urdu ? ` <span lang="ur">${e.urdu}</span>` : '';
    $('.hero-kicker').innerHTML = `You are invited to ${title.replace(/^The /, 'the ')}${urdu}`;
  }

  function show(k, first = false) {
    active = k;
    document.body.dataset.theme = k;
    $$('.tabs [data-tab]').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.tab === k)));
    const swap = () => {
      setHero(k);
      root.innerHTML = eventHTML(k);
      $('#faq-root').innerHTML = faqHTML(k);
      observe(root);
      startCountdown();
      descend();
      root.classList.remove('is-swapping');
    };
    if (first) return swap();
    root.classList.add('is-swapping');
    setTimeout(swap, 350);
    const top = root.getBoundingClientRect().top + scrollY - 70;
    if (scrollY > top) scrollTo({ top, behavior: reduceMotion ? 'auto' : 'smooth' });
  }

  /* ---------- reveal on scroll ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  const growIO = new IntersectionObserver((entries) => entries.forEach((en) => {
    if (en.isIntersecting) { en.target.classList.add('grown'); growIO.unobserve(en.target); }
  }), { threshold: 0.35 });
  const observe = (scope) => {
    $$('[data-reveal]', scope).forEach((el) => io.observe(el));
    $$('.sprig', scope).forEach((el) => (reduceMotion ? el.classList.add('grown') : growIO.observe(el)));
  };

  /* ---------- countdown ---------- */
  let cdTimer;
  // the numbers sit at 00 until the countdown scrolls into view, then roll up to the real time and keep rolling
  function setDigits(el, value) {
    const str = String(value).padStart(2, '0');
    let dg = [...el.querySelectorAll('.dg')];
    while (dg.length < str.length) { el.insertAdjacentHTML('afterbegin', reel()); dg = [...el.querySelectorAll('.dg')]; }
    dg.forEach((d, i) => { d.firstElementChild.style.transform = `translateY(${-Number(str[i]) * 10}%)`; });
  }

  const cdIO = new IntersectionObserver((entries) => entries.forEach((en) => {
    if (!en.isIntersecting) return;
    en.target.classList.add('live');
    cdIO.unobserve(en.target);
    setTimeout(() => en.target.classList.add('settled'), 2000); // after the first roll, each second ticks over quickly
    startCountdown.tick?.();
  }), { threshold: 0.4 });

  function startCountdown() {
    clearInterval(cdTimer);
    const box = $('.countdown');
    if (!box) return;
    const target = new Date(box.dataset.target).getTime();
    const tick = () => {
      if (!box.classList.contains('live')) return;
      const s = Math.max(0, Math.floor((target - Date.now()) / 1000));
      if (s === 0) { box.innerHTML = '<p class="script today">Today is the day</p>'; return clearInterval(cdTimer); }
      const v = { days: Math.floor(s / 86400), hours: Math.floor(s / 3600) % 24, minutes: Math.floor(s / 60) % 60, seconds: s % 60 };
      for (const u in v) setDigits(box.querySelector(`[data-u="${u}"]`), v[u]);
    };
    startCountdown.tick = tick;
    if (reduceMotion) box.classList.add('live'); else cdIO.observe(box);
    tick();
    cdTimer = setInterval(tick, 1000);
  }

  /* ---------- calendar ---------- */
  const stamp = (iso) => new Date(iso).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  function addToCalendar(k) {
    const e = S.events[k];
    const title = `${S.groom} & ${S.bride} — ${e.label}`;
    const ics = [
      'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//maaz-alina//EN', 'BEGIN:VEVENT',
      `UID:${k}-${stamp(e.start)}@maaz-alina`, `DTSTAMP:${stamp(new Date().toISOString())}`,
      `DTSTART:${stamp(e.start)}`, `DTEND:${stamp(e.end)}`,
      `SUMMARY:${title}`, `LOCATION:${e.venue}, ${e.address}`,
      'END:VEVENT', 'END:VCALENDAR',
    ].join('\r\n');
    // Android/desktop: Google Calendar; iPhone/Mac: .ics opens straight in Calendar
    if (/iPhone|iPad|Macintosh/.test(navigator.userAgent)) {
      const a = Object.assign(document.createElement('a'), {
        href: URL.createObjectURL(new Blob([ics], { type: 'text/calendar' })),
        download: `${k}.ics`,
      });
      a.click();
    } else {
      const q = new URLSearchParams({ action: 'TEMPLATE', text: title, dates: `${stamp(e.start)}/${stamp(e.end)}`, location: `${e.venue}, ${e.address}` });
      window.open(`https://calendar.google.com/calendar/render?${q}`, '_blank', 'noopener');
    }
  }

  /* ---------- music ---------- */
  // Plays the track set as `music` in content.js if there is one. Otherwise a soft piano loop is composed in the browser,
  // rendered to a WAV and played through the same <audio> element (so it also plays on iPhones in silent mode).
  const audio = $('#bgm');
  const musicBtn = $('#music');
  audio.volume = 0.45;
  audio.loop = true;
  audio.addEventListener('playing', () => { musicBtn.hidden = false; musicBtn.classList.add('on'); });
  audio.addEventListener('pause', () => musicBtn.classList.remove('on'));
  musicBtn.addEventListener('click', () => (audio.paused ? audio.play() : audio.pause()));

  async function composePiano() {
    // the felt-piano tone is softened above ~2 kHz, so a lighter sample rate sounds the same and builds twice as fast
    const sr = 22050;
    const eighth = 60 / 54 / 2; // slow and unhurried
    const bar = eighth * 8;
    const bars = 8;
    const loopLen = bar * bars;
    const tail = 6;
    const ctx = new OfflineAudioContext(1, Math.ceil(sr * (loopLen + tail)), sr);

    // felt-piano warmth: soften the highs, then a long, quiet room
    const bus = ctx.createGain();
    const warm = ctx.createBiquadFilter();
    warm.type = 'lowpass'; warm.frequency.value = 2200; warm.Q.value = 0.4;
    const ir = ctx.createBuffer(1, sr * 4.5, sr);
    const d = ir.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length) ** 3.2;
    const rev = ctx.createConvolver();
    rev.buffer = ir;
    const dry = ctx.createGain(); dry.gain.value = 0.62;
    const wet = ctx.createGain(); wet.gain.value = 0.5;
    bus.connect(warm);
    warm.connect(dry).connect(ctx.destination);
    warm.connect(rev).connect(wet).connect(ctx.destination);

    const hz = (m) => 440 * 2 ** ((m - 69) / 12);
    // a soft piano note: gentle hammer, slightly stretched overtones that fade faster than the fundamental
    const note = (m, t, len, vel) => {
      [[1, 1, 0], [2, 0.42, 1.5], [3, 0.16, 3], [4, 0.07, 4.5], [5, 0.03, 6]].forEach(([h, amp, cents]) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = 'sine';
        o.frequency.value = hz(m) * h * 2 ** (cents / 1200);
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(vel * amp, t + 0.018); // soft felt attack, no click
        g.gain.exponentialRampToValueAtTime(vel * amp * 0.35, t + 0.5);
        g.gain.exponentialRampToValueAtTime(0.0001, t + len / Math.sqrt(h));
        o.connect(g).connect(bus);
        o.start(t);
        o.stop(t + len + 0.1);
      });
    };

    // D major, dreamy voicings: Dmaj9 · Bm7 · Gmaj7 · Asus — broken gently, a slow melody floating above
    const chords = [
      { bass: 38, arp: [57, 64, 66, 69] },
      { bass: 47, arp: [54, 62, 66, 69] },
      { bass: 43, arp: [55, 62, 66, 71] },
      { bass: 45, arp: [57, 62, 64, 69] },
    ];
    const pattern = [0, 1, 2, 3, 2, 1, 3, 2];
    const melody = [[78, null, 76], [74, null, 73], [74, 76, 78], [76, null, null], [81, null, 78], [76, null, 74], [73, 74, 76], [69, null, null]];
    for (let b = 0; b < bars; b++) {
      const c = chords[b % 4];
      const t0 = b * bar;
      note(c.bass, t0, 6, 0.11);
      note(c.bass + 12, t0 + eighth * 4, 4, 0.045);
      pattern.forEach((p, i) => note(c.arp[p], t0 + i * eighth + (i % 2) * 0.015, 3.2, i === 0 ? 0.05 : 0.036));
      melody[b].forEach((m, i) => m && note(m, t0 + i * eighth * 3, 4.2, 0.07));
    }

    const out = await ctx.startRendering();
    const data = out.getChannelData(0);
    const loopN = Math.floor(loopLen * sr);
    // fold the reverb tail back onto the start so the loop is seamless
    for (let i = 0; i < data.length - loopN; i++) data[i] += data[loopN + i];

    // encode 16-bit mono WAV
    const buf = new ArrayBuffer(44 + loopN * 2);
    const v = new DataView(buf);
    const str = (o, s) => [...s].forEach((ch, i) => v.setUint8(o + i, ch.charCodeAt(0)));
    str(0, 'RIFF'); v.setUint32(4, 36 + loopN * 2, true); str(8, 'WAVEfmt ');
    v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
    v.setUint32(24, sr, true); v.setUint32(28, sr * 2, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true);
    str(36, 'data'); v.setUint32(40, loopN * 2, true);
    let peak = 0;
    for (let i = 0; i < loopN; i++) peak = Math.max(peak, Math.abs(data[i]));
    const gain = 0.8 / (peak || 1); // normalise to a comfortable level
    for (let i = 0; i < loopN; i++) v.setInt16(44 + i * 2, Math.max(-1, Math.min(1, data[i] * gain)) * 0x7fff, true);
    return URL.createObjectURL(new Blob([buf], { type: 'audio/wav' }));
  }

  // decide the track while the envelope is showing, so it's ready by the time the seal is tapped
  if (S.music) audio.src = `${BASE}${S.music}`;
  else (window.requestIdleCallback || ((f) => setTimeout(f, 300)))(() => composePiano().then((url) => { audio.src = url; }).catch(() => {}));

  /* ---------- opener ---------- */
  const opener = $('#opener');
  requestAnimationFrame(() => opener.classList.add('is-in'));
  // seal lifts → top flap folds back → the hero itself, already inside the envelope, rises and grows to fill the screen
  // while the envelope fades away. The hero sits between the envelope's inside (#env-back) and its front flaps.
  document.body.classList.add('env');
  $('#seal').addEventListener('click', () => {
    audio.play().catch(() => {});
    const b = document.body.classList;
    const steps = reduceMotion
      ? [[() => { opener.classList.add('is-opening'); b.add('is-open'); b.remove('env'); }, 0]]
      : [
          [() => opener.classList.add('is-opening'), 0],
          [() => { opener.classList.add('is-flap'); b.add('is-open'); }, 450],
          [() => { b.add('env-rise'); opener.classList.add('is-grow'); }, 1250],
          [() => b.add('env-grow'), 1850],
        ];
    steps.forEach(([fn, t]) => setTimeout(fn, t));
    setTimeout(() => {
      opener.remove();
      $('#env-back').remove();
      b.remove('env', 'env-rise', 'env-grow', 'is-locked');
    }, reduceMotion ? 400 : 4200);
  });

  /* ---------- events ---------- */
  document.addEventListener('click', (ev) => {
    const tab = ev.target.closest('[data-tab]');
    if (tab && tab.dataset.tab !== active) show(tab.dataset.tab);
    const cal = ev.target.closest('[data-cal]');
    if (cal) addToCalendar(cal.dataset.cal);
  });

  /* ---------- gentle parallax ---------- */
  // 0 → 1 as "Save the date" scrolls up into view: clouds rise past and the near ones part
  function descend() {
    const day = $('.day');
    if (!day) return;
    const top = day.getBoundingClientRect().top;
    // fully parted by the time the heading reaches the middle of the screen
    const c = reduceMotion ? 1 : Math.min(1, Math.max(0, (innerHeight * 0.6 - top) / (innerHeight * 0.85)));
    day.style.setProperty('--c', c.toFixed(3));
  }

  const hero = $('#hero');
  const layers = $$('#hero [data-depth]');
  let ticking = false;
  if (!reduceMotion) {
    addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = Math.min(scrollY, innerHeight * 1.2);
        layers.forEach((l) => (l.style.transform = `translate3d(0, ${(y * l.dataset.depth).toFixed(1)}px, 0)`));
        document.body.classList.toggle('scrolled', scrollY > innerHeight * 0.6);
        hero.style.setProperty('--p', Math.min(1, scrollY / innerHeight).toFixed(3)); // photo melts into the paper as you scroll
        descend();
        ticking = false;
      });
    }, { passive: true });
  }

  show(active, true);
  observe(document);
})();
