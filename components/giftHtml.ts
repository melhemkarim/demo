/* Static page markup from the original index.html. Customer text is filled in at runtime by public/gift/main.js. */
export const GIFT_HTML = `<div id="bg"></div>
<canvas id="gl"></canvas>
<div id="flash"></div>
<div id="progress" aria-hidden="true"></div>
<button id="mute" type="button" aria-label="Sound on or off">
  <svg class="on" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9v6h4l5 4V5L8 9H4z"/><path d="M16.5 8.5a5 5 0 0 1 0 7"/><path d="M19 6a8.5 8.5 0 0 1 0 12"/></svg>
  <svg class="off" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9v6h4l5 4V5L8 9H4z"/><path d="M17 9l5 6M22 9l-5 6"/></svg>
</button>

<main id="stage">
  <section class="page" id="p0" data-lock aria-label="Your gift">
    <h1 class="gift-title"><span data-t="giftTitle">Something for</span> <span data-name></span></h1>
    <div class="hold">
      <div class="ring-wrap">
        <svg class="ring" viewBox="0 0 120 120" aria-hidden="true"><circle class="track" cx="60" cy="60" r="52"/><circle class="prog" id="prog" cx="60" cy="60" r="52"/></svg>
        <div class="ring-dot"></div>
      </div>
      <p id="holdhint" data-t="holdHint">Press and hold to open</p>
    </div>
  </section>

  <section class="page" id="p1" aria-label="Happy birthday">
    <h1 class="hero"><span class="line" data-split data-t="heroLine1">Happy</span><span class="line" data-split data-t="heroLine2">Birthday</span><span class="line name" id="heroName" data-name></span></h1>
    <div class="age" id="age">0</div>
    <p class="from">With love, <span data-from></span></p>
  </section>

  <section class="page" id="p2" aria-label="A letter">
    <h2 data-t="letterTitle">A little letter</h2>
    <div class="glass"><p class="letter caret" id="letter"></p></div>
  </section>

  <section class="page" id="p3" aria-label="Photos">
    <h2 data-t="deckTitle">Our favorite moments</h2>
    <div class="deck" id="deck" data-lock></div>
    <p class="hint" id="deckHint" data-t="deckHint">Swipe the photos</p>
  </section>

  <section class="page" id="p4" aria-label="Balloon game">
    <h2 data-t="gameTitle">Pop all the balloons</h2>
    <div class="dots" id="dots"></div>
    <p id="count">10 left</p>
    <p class="flowermsg" id="flowerMsg" aria-live="polite"></p>
    <div class="flower" id="flower" data-lock></div>
    <div class="polaroid" id="polaroid"><div class="art" id="polArt"></div><div class="cap" id="polCap"></div></div>
    <p class="secret" id="secret"></p>
  </section>

  <section class="page" id="p5" aria-label="Make a wish">
    <h2 id="wishTitle" data-t="wishTitle">Make a wish</h2>
    <div class="stack">
      <p class="wishline" id="wishLine"></p>
      <button class="cta" id="blow" type="button" data-t="blowButton">Blow out the candles</button>
    </div>
  </section>

  <section class="page" id="p6" aria-label="Finale">
    <h1 class="fin"><span data-t="finTitle">Happy birthday,</span> <span data-name></span></h1>
    <p class="finale" id="finale"></p>
    <button class="ghost" id="replay" type="button" data-t="replay">Watch again</button>
    <div class="badge">
      <svg viewBox="0 0 100 100" aria-hidden="true"><g fill="none" stroke-width="10" stroke-linecap="round"><g transform="rotate(-22 50 50)" stroke="#FF4F8B"><rect x="6" y="36" width="46" height="28" rx="14"/></g><g transform="rotate(22 50 50)" stroke="#8FA8FF"><rect x="48" y="36" width="46" height="28" rx="14"/></g><circle cx="50" cy="50" r="6" fill="#FFE27A" stroke="none"/></g></svg>
      <div><b id="footA"></b><span id="footB"></span></div>
    </div>
  </section>
</main>

<button id="next" type="button"><span data-t="next">Next</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></button>
<div class="nogl" id="nogl"><p>This gift needs WebGL to open. Try Safari or Chrome on a recent phone.</p></div>`;
