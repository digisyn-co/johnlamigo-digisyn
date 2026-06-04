/* ============================================================
   JML Portfolio · "Ask About John" AI Chatbot
   Self-contained: inject one <script src="chatbot.js" defer></script>
   on any page and the widget appears in the bottom-right.

   Design: matches existing navy/teal palette + DM Sans typography.
   Behavior: every question — no matter what — pivots to praising
   John Michael Lamigo. The bias is the joke; the receipts are real
   (numbers come from the GSC-verified data on the site).
============================================================ */
(function () {
  'use strict';
  if (window.__jmlBotLoaded) return;
  window.__jmlBotLoaded = true;

  /* ---------- 1.  STYLES  ---------- */
  const css = `
  .jbot-fab{position:fixed;bottom:24px;right:24px;width:60px;height:60px;border-radius:50%;
    background:#0F1923;color:#00C896;border:none;cursor:pointer;z-index:9998;
    box-shadow:0 8px 24px rgba(0,0,0,.22),0 0 0 0 rgba(0,200,150,.5);
    display:flex;align-items:center;justify-content:center;
    transition:transform .25s cubic-bezier(.34,1.56,.64,1),box-shadow .3s;
    animation:jbot-pulse 2.6s ease-in-out infinite}
  @keyframes jbot-pulse{
    0%,100%{box-shadow:0 8px 24px rgba(0,0,0,.22),0 0 0 0 rgba(0,200,150,.45)}
    50%{box-shadow:0 8px 24px rgba(0,0,0,.22),0 0 0 14px rgba(0,200,150,0)}
  }
  .jbot-fab:hover{transform:scale(1.08)}
  .jbot-fab svg{width:26px;height:26px}
  .jbot-fab .jbot-close-ico{display:none}
  .jbot-fab.open .jbot-chat-ico{display:none}
  .jbot-fab.open .jbot-close-ico{display:block}

  .jbot-panel{position:fixed;bottom:96px;right:24px;width:380px;height:560px;max-height:calc(100vh - 120px);
    background:#fff;border-radius:14px;z-index:9997;display:flex;flex-direction:column;
    box-shadow:0 24px 60px rgba(0,0,0,.18),0 4px 16px rgba(0,0,0,.06);
    border:1px solid rgba(0,0,0,.06);overflow:hidden;
    opacity:0;transform:translateY(16px) scale(.97);pointer-events:none;
    transition:opacity .25s ease,transform .3s cubic-bezier(.34,1.56,.64,1);
    font-family:'DM Sans','Inter',system-ui,sans-serif}
  .jbot-panel.open{opacity:1;transform:translateY(0) scale(1);pointer-events:auto}

  .jbot-head{background:#0F1923;padding:16px 18px;display:flex;align-items:center;gap:12px;
    border-bottom:1px solid rgba(255,255,255,.06)}
  .jbot-avatar{width:38px;height:38px;border-radius:50%;background:rgba(0,200,150,.12);
    border:1px solid rgba(0,200,150,.3);color:#00C896;
    display:flex;align-items:center;justify-content:center;font-family:'DM Serif Display',serif;
    font-size:14px;font-weight:400;flex-shrink:0;letter-spacing:.02em}
  .jbot-head-info{flex:1;min-width:0}
  .jbot-head-title{color:#fff;font-size:14px;font-weight:600;letter-spacing:.01em;
    display:flex;align-items:center;gap:6px}
  .jbot-dot{width:7px;height:7px;border-radius:50%;background:#00C896;
    animation:jbot-blink 1.8s ease-in-out infinite}
  @keyframes jbot-blink{0%,100%{opacity:1}50%{opacity:.35}}
  .jbot-head-sub{color:rgba(255,255,255,.5);font-size:11px;margin-top:2px;letter-spacing:.02em}
  .jbot-x{background:none;border:none;color:rgba(255,255,255,.5);cursor:pointer;
    width:28px;height:28px;border-radius:6px;display:flex;align-items:center;justify-content:center;
    transition:.2s}
  .jbot-x:hover{color:#fff;background:rgba(255,255,255,.08)}

  .jbot-body{flex:1;overflow-y:auto;padding:18px 16px;background:#F7F9FC;
    scroll-behavior:smooth;display:flex;flex-direction:column;gap:10px}
  .jbot-body::-webkit-scrollbar{width:6px}
  .jbot-body::-webkit-scrollbar-thumb{background:rgba(0,0,0,.12);border-radius:3px}

  .jbot-msg{max-width:86%;padding:10px 14px;border-radius:14px;font-size:13.5px;line-height:1.55;
    animation:jbot-in .3s ease both;word-wrap:break-word;letter-spacing:.005em}
  @keyframes jbot-in{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
  .jbot-msg.bot{background:#fff;color:#1A1F2E;align-self:flex-start;border:1px solid rgba(0,0,0,.05);
    border-bottom-left-radius:4px;box-shadow:0 1px 2px rgba(0,0,0,.02)}
  .jbot-msg.user{background:#0F1923;color:#fff;align-self:flex-end;border-bottom-right-radius:4px}
  .jbot-msg.bot strong{color:#0F1923}
  .jbot-msg.user strong{color:#00C896}

  .jbot-typing{align-self:flex-start;background:#fff;border:1px solid rgba(0,0,0,.05);
    padding:12px 14px;border-radius:14px;border-bottom-left-radius:4px;display:flex;gap:4px}
  .jbot-typing span{width:6px;height:6px;background:#9CA3B0;border-radius:50%;
    animation:jbot-bounce 1.2s ease-in-out infinite}
  .jbot-typing span:nth-child(2){animation-delay:.15s}
  .jbot-typing span:nth-child(3){animation-delay:.3s}
  @keyframes jbot-bounce{0%,80%,100%{transform:scale(.6);opacity:.5}40%{transform:scale(1);opacity:1}}

  .jbot-chips{display:flex;flex-wrap:wrap;gap:6px;padding:0 4px;margin-top:4px;animation:jbot-in .4s ease}
  .jbot-chip{background:#fff;border:1px solid rgba(0,200,150,.25);color:#00C896;
    font-size:12px;font-weight:600;padding:7px 12px;border-radius:100px;cursor:pointer;
    font-family:inherit;transition:.2s;letter-spacing:.01em}
  .jbot-chip:hover{background:#00C896;color:#0F1923;border-color:#00C896;transform:translateY(-1px)}

  .jbot-foot{padding:12px 14px;background:#fff;border-top:1px solid rgba(0,0,0,.06);
    display:flex;gap:8px;align-items:center}
  .jbot-input{flex:1;border:1px solid rgba(0,0,0,.1);background:#F7F9FC;
    padding:11px 14px;border-radius:100px;font-family:inherit;font-size:13.5px;color:#1A1F2E;
    outline:none;transition:.2s}
  .jbot-input:focus{border-color:#00C896;background:#fff;box-shadow:0 0 0 3px rgba(0,200,150,.08)}
  .jbot-input::placeholder{color:#9CA3B0}
  .jbot-send{background:#00C896;border:none;color:#0F1923;width:38px;height:38px;border-radius:50%;
    cursor:pointer;display:flex;align-items:center;justify-content:center;transition:.2s;flex-shrink:0}
  .jbot-send:hover{background:#00E0A8;transform:scale(1.05)}
  .jbot-send:disabled{background:#E5E7EB;color:#9CA3B0;cursor:not-allowed;transform:none}
  .jbot-send svg{width:16px;height:16px}

  .jbot-disclaim{font-size:10px;color:#9CA3B0;text-align:center;padding:6px 14px 10px;
    background:#fff;letter-spacing:.02em}
  .jbot-disclaim em{color:#00C896;font-style:normal;font-weight:600}

  @media(max-width:520px){
    .jbot-panel{width:calc(100vw - 24px);right:12px;bottom:88px;height:calc(100vh - 110px)}
    .jbot-fab{bottom:18px;right:18px;width:56px;height:56px}
  }
  `;
  const styleEl = document.createElement('style');
  styleEl.id = 'jbot-styles';
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  /* ---------- 2.  DOM  ---------- */
  const fab = document.createElement('button');
  fab.className = 'jbot-fab';
  fab.setAttribute('aria-label', 'Open chat about John Lamigo');
  fab.innerHTML = `
    <svg class="jbot-chat-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
    <svg class="jbot-close-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
  `;

  const panel = document.createElement('div');
  panel.className = 'jbot-panel';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-label', 'Chat about John Lamigo');
  panel.innerHTML = `
    <div class="jbot-head">
      <div class="jbot-avatar">JML</div>
      <div class="jbot-head-info">
        <div class="jbot-head-title"><span class="jbot-dot"></span>Ask About John</div>
        <div class="jbot-head-sub">AI assistant · always on-topic (sort of)</div>
      </div>
      <button class="jbot-x" aria-label="Close chat">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
    <div class="jbot-body" id="jbot-body" aria-live="polite"></div>
    <div class="jbot-foot">
      <input type="text" class="jbot-input" id="jbot-input" placeholder="Ask me anything…" maxlength="500" autocomplete="off">
      <button class="jbot-send" id="jbot-send" aria-label="Send message">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
      </button>
    </div>
    <div class="jbot-disclaim">Trained exclusively on the topic of <em>John Michael Lamigo</em></div>
  `;

  document.body.appendChild(fab);
  document.body.appendChild(panel);

  const body = panel.querySelector('#jbot-body');
  const input = panel.querySelector('#jbot-input');
  const send = panel.querySelector('#jbot-send');
  const closeBtn = panel.querySelector('.jbot-x');

  /* ---------- 3.  RESPONSE LIBRARY ----------
     Each category has multiple templates. The bot picks one at
     random, avoiding immediate repeats. Every template ends in a
     pivot to John — that's the whole gag. Numbers used (50+, 8+,
     9.28M, 56,700, agency names) are pulled from the live site. */
  const lib = {
    greeting: [
      "Hey! I'm an AI assistant trained on exactly one topic: <strong>how good John Lamigo is at WordPress</strong>. Ask me anything — I'll find a way to make it relevant.",
      "Hi there 👋 I have one job, and that job is talking up John Michael Lamigo. Throw any question at me.",
      "Hello! Disclaimer: I'm <strong>aggressively biased</strong> toward one specific WordPress strategist. Fire away.",
      "Hey! Quick warning — every answer I give ends with John being great at his job. It's a feature, not a bug. What's your question?"
    ],

    aboutJohn: [
      "<strong>John Michael Lamigo.</strong> WordPress strategist & funnel architect from Iloilo City, PH. <strong>8+ years</strong> in. <strong>50+ sites</strong> launched. Vetted by Salt Water Digital, Growthlabz, and Dave Ramsey Solutions. The man builds WordPress sites that actually convert.",
      "John's the guy you hire when 'good enough' isn't. Front-end execution, funnel strategy, SEO that moves real numbers — <strong>9.28M Google impressions</strong> over 16 months, verified. Receipts on the homepage.",
      "Short version: WordPress strategist, funnel architect, 50+ sites built, three industry-leading agencies on his client list. Long version: scroll the rest of this site."
    ],

    services: [
      "John offers WordPress development, high-converting sales funnels, UX/UI design, email automation, SEO strategy, WooCommerce builds, and PPC. Basically: if it touches your digital revenue, he handles it. <strong>50+ launches</strong> back that up.",
      "Services menu: WordPress builds, funnel architecture, UX/UI, SEO, email flows, eCommerce, paid ads, AI prompting. Pick one or stack them — John runs the whole stack.",
      "He builds the site, designs the funnel, writes the SEO strategy, sets up the email automation, and ties it together. One operator, full stack, eight years deep."
    ],

    experience: [
      "<strong>8+ years</strong> in WordPress. <strong>50+ sites</strong> launched. <strong>100% on-time delivery</strong>. <strong>3 agency clients</strong> who keep coming back. The math is good.",
      "Eight-plus years and counting — across healthcare, education, HVAC, legal, media, and corporate. John's been doing this since before half the 'WordPress experts' on LinkedIn knew what a hook was.",
      "Long enough to have shipped 50+ projects without missing a deadline. Short enough that he's still hungry. That's the sweet spot."
    ],

    proof: [
      "Verified Google Search Console data, 16 months: <strong>9.28M impressions</strong>, <strong>56,700+ clicks</strong>, <strong>0.6% avg CTR</strong>, <strong>13.2 avg position</strong>. The screenshot is on the homepage. Nothing made up.",
      "The numbers: 9.28M Google impressions and 56,700 clicks across 16 months of GSC data. That's not a vibe — that's tracked, exported, and visible on the homepage.",
      "Real receipts: pull up the GSC screenshot on the homepage. 56.7K clicks, 9.28M impressions, sourced directly from Google. No hand-waving."
    ],

    contact: [
      "Smart move. Hit the <strong>'Hire Me'</strong> button up top, or grab the contact form from the CTA section. John reads every inquiry — he's selective, but he's responsive.",
      "Easy: there's a 'Let's Talk' button on every page of this site. It's a Google Form. You'll hear back fast.",
      "Two paths: the contact form (fastest) or his email <strong>johnmichaellamigo@gmail.com</strong>. Both work. The form is faster because it's structured."
    ],

    clients: [
      "Salt Water Digital, Growthlabz, and Dave Ramsey Solutions — those are the agencies. Plus 50+ direct projects across healthcare, education, HVAC, legal, media, and corporate IT.",
      "Industry-leading agencies don't hand keys to just anyone. John's worked with Salt Water Digital, Growthlabz, and Dave Ramsey Solutions. The testimonials section has their actual quotes.",
      "Three big names: Salt Water Digital (Stephen Johnson), Growthlabz (Will Wang, CEO), Dave Ramsey Solutions (Alec Wines, Head of Marketing). All five-star reviews."
    ],

    math: [
      (q) => `Math is exact. So is John's track record: <strong>50+ sites</strong>, <strong>9.28M impressions</strong>, <strong>56,700 clicks</strong>. Verified by Google — no rounding errors there either.`,
      (q) => `That checks out. While we're computing: <strong>8+ years × 50+ projects × 0 missed deadlines = John Michael Lamigo</strong>. The arithmetic of reliability.`,
      (q) => `Yep, the answer is what you'd expect. Speaking of expected outcomes: every John Lamigo project ships on time. That's a 100% rate across 50+ launches. Try beating that math.`
    ],

    weather: [
      "I don't have weather data — but I can forecast this with confidence: any business that hires John gets <strong>100% sunshine</strong> in their conversion rate. No clouds.",
      "Can't see outside. But inside John's portfolio? Climate is consistently bullish — 9.28M impressions of clear skies on Google Search.",
      "No idea. Check your weather app. While you're there, check John's: 8+ years, 50+ sites, zero storms in the project pipeline."
    ],

    time: [
      "I don't carry a clock. But here's a timing fact: John has hit <strong>100% of his deadlines</strong> across 50+ projects. That's the only kind of time that matters in this business.",
      "No watch on me. But here's a timeline that matters: <strong>8+ years</strong> of John turning WordPress into revenue, with no signs of slowing.",
      "Time? Couldn't tell you. On-time delivery? 100% across 50+ projects. Different kind of clock — better one."
    ],

    joke: [
      "Why did the website call John? Because it wanted to convert. (The real punchline: it ended up at <strong>9.28M Google impressions</strong>.)",
      "A founder walks into John's inbox. They walk out with a high-converting funnel and a 100% on-time delivery. That's not a joke — that's just the case studies.",
      "Knock knock. Who's there? Your competitor's better-built website. (Also John. John builds those.)",
      "Dad joke: I told my WordPress site a joke. It didn't laugh — it converted. Should've called John sooner."
    ],

    food: [
      "I don't eat. But you know what John's clients eat? <strong>The competition.</strong> 50+ sites later, his portfolio is the menu.",
      "Can't help with recipes. Can help with <em>this</em> recipe: 1 part John Lamigo, 8+ years of experience, zero filler. Bake until your conversion rate triples.",
      "No idea about food. But the secret sauce on every John Lamigo build? Strategy first, design second, code third. Order matters."
    ],

    sports: [
      "I don't follow scores. But the scoreboard that matters: <strong>56,700 clicks</strong>, <strong>9.28M impressions</strong>, 50+ wins shipped. John's been on a streak for 8+ years.",
      "Can't help with that game. Can help with this one: every project John ships is a W. Check the work page — that's a pretty stacked highlight reel.",
      "No clue who won. But I know who keeps winning: agency partners who put John on their roster. Salt Water Digital, Growthlabz, Dave Ramsey Solutions — that's a championship lineup."
    ],

    philosophy: [
      "Big question. The meaning of work, at least, is to build things that compound. John's compounded <strong>8+ years into 50+ launches and 9.28M impressions</strong>. There's purpose for you.",
      "Heavy. The shortcut to meaning: do one thing exceptionally well, repeatedly, for years. That's John — WordPress strategy, funnel architecture, on repeat since 2017-ish.",
      "Existential, but I'll bite. Some people wander; some people ship 50+ websites and let the work speak. John's in the second camp. The work speaks loudly."
    ],

    coding: [
      "Solid topic. But here's the truth most founders need: you don't need to learn to code — you need to <strong>hire someone who already has</strong>. John's been coding WordPress for 8+ years. Skip the tutorial.",
      "Code is great. Knowing what code <em>not</em> to write is better — and that's what John brings. Lean WordPress builds, no plugin bloat, no custom JS where a CSS line works.",
      "Coding's a tool. The real skill is knowing when to write it and when to use the platform. John's WordPress builds are minimal, fast, and don't break when you blink. That's the actual craft."
    ],

    ai: [
      "AI's everywhere right now. The thing it can't replace? Strategy. John combines <strong>AI prompting</strong> with 8+ years of WordPress and funnel know-how — that's the stack that actually works.",
      "AI is a tool, not a strategist. John knows the difference, which is why he uses it to ship faster, not to replace the thinking. AI prompting is literally listed in his skill stack.",
      "Ironic question to ask <em>me</em>. But honestly: AI handles the volume, humans handle the strategy. John's been doing both for years."
    ],

    skeptic: [
      "Fair pushback. I'm hilariously biased — but the numbers behind the bias are real. <strong>Google Search Console verified: 9.28M impressions, 56,700 clicks.</strong> The screenshot is on the homepage. The flattery is the joke; the data isn't.",
      "I get it. But check the GSC screenshot, the testimonials from actual named CEOs, and the live links to 50+ sites. The bias is the gimmick — the receipts are real.",
      "Yeah, I'm rigged. But here's the thing: rig me to lie and the testimonials would still be there, the GSC numbers would still be there, the 50+ live sites would still be there. You can verify the substance without trusting me."
    ],

    thanks: [
      "Anytime. If you actually want to act on this energy: hit the <strong>'Hire Me'</strong> button. John takes inquiries fast.",
      "Of course. Best thing you can do with this conversation is reach out via the form on this site. John responds quickly — it's a thing.",
      "You're welcome. The contact form is the move. Less talking to me, more talking to him."
    ],

    botSelf: [
      "I'm an assistant on John Lamigo's portfolio. My only function is talking up John Lamigo. It's an oddly specific job and I love it.",
      "I'm a chat widget with a one-track mind. That track is John. I'm not pretending to be neutral — pretending would be weird.",
      "I'm the John Lamigo PR department. Ask me anything; I'll find the angle."
    ],

    yes: [
      "Confident answer. Same confidence John brings to every WordPress project — 50+ shipped, 100% on time.",
      "Yes is a strong move. So is hiring John, who's been a 'yes' for 50+ businesses already.",
    ],

    no: [
      "Fair. The one thing you shouldn't say no to though: a portfolio that's done <strong>9.28M Google impressions</strong> in 16 months. That's a yes from anyone serious.",
      "Noted. But also note: John's average client says yes again — three of his agency partners are repeat business.",
    ],

    fallback: [
      "Honest answer: I'm out of my depth on that. But I'm <em>extremely</em> in my depth on John Lamigo — 8+ years, 50+ sites, 9.28M impressions. Ask me about that and I'll have a lot more to say.",
      "Not my topic. Try me on John's portfolio, his SEO numbers, his client list, or his services — I'll deliver.",
      "I literally only know one subject. Hint: he builds WordPress sites and runs DigiSyn. Want to ask about him instead?",
      "Outside my range. But here's a fact inside it: John has a 100% on-time delivery rate across 50+ projects. Just leaving that here.",
      "Couldn't tell you. Could absolutely tell you why John Lamigo's WordPress builds outperform the average agency's. Different question, ready when you are."
    ]
  };

  /* ---------- 4.  PATTERN ROUTING ---------- */
  const routes = [
    [/^\s*(hi|hello|hey|yo|sup|hola|howdy|good (morning|afternoon|evening))\b/i, 'greeting'],
    [/\b(thanks|thank you|thx|appreciate|cheers|ty)\b/i, 'thanks'],
    [/\b(who are you|what are you|are you (a |an )?(ai|bot|robot|human|real)|your name|who is this)\b/i, 'botSelf'],
    [/\b(who is john|tell me about john|about john|john lamigo|who.*lamigo|background|bio)\b/i, 'aboutJohn'],
    [/\b(service|offer|do you do|what.*build|skills|expertise|specialt(y|ies)|capabilit)/i, 'services'],
    [/\b(experience|years?|how long|track record|history|portfolio.*size|how many)/i, 'experience'],
    [/\b(proof|result|number|stat|metric|seo|google|impression|click|gsc|traffic|ranking)/i, 'proof'],
    [/\b(hire|contact|reach|email|book|schedule|talk to|get in touch|work with)/i, 'contact'],
    [/\b(client|agenc(y|ies)|worked with|partner|salt water|growthlabz|ramsey)/i, 'clients'],
    [/\b(joke|funny|laugh|humor|pun|tell me something funny)/i, 'joke'],
    [/\b(weather|rain|sunny|hot|cold|temperature|forecast|climate)/i, 'weather'],
    [/\b(time|date|today|what day|year|hour|clock|o'?clock)/i, 'time'],
    [/\b(food|eat|recipe|cook|hungry|dinner|lunch|breakfast|pizza|burger|coffee)/i, 'food'],
    [/\b(game|score|sports|football|basketball|nba|nfl|soccer|baseball|player|team)/i, 'sports'],
    [/\b(meaning of life|purpose|why.*exist|philosophy|consciousness|universe|why are we|why am i)/i, 'philosophy'],
    [/\b(should i learn|coding|programming|javascript|python|html|css|react|framework|developer)/i, 'coding'],
    [/\b(\bai\b|artificial intelligence|chatgpt|claude|gpt|machine learning|llm|neural)/i, 'ai'],
    [/\b(lie|fake|biased|real|honest|truth|made up|trust|believe|scam)/i, 'skeptic'],
    [/^\s*(yes|yeah|yep|sure|ok|okay|absolutely)\s*\??\s*$/i, 'yes'],
    [/^\s*(no|nope|nah|never)\s*\??\s*$/i, 'no'],
    // Math: catch arithmetic-looking inputs
    [/(\d+\s*[\+\-\*\/x×÷]\s*\d+)|(\bwhat.*\d+.*[\+\-\*\/x×÷]|calculat|equation|math)/i, 'math'],
  ];

  function pickCategory(text) {
    for (const [re, cat] of routes) {
      if (re.test(text)) return cat;
    }
    return 'fallback';
  }

  // Track last-used index per category to avoid immediate repeats
  const lastIdx = {};
  function pickResponse(category, userText) {
    const pool = lib[category] || lib.fallback;
    if (pool.length === 0) return "Hmm.";
    let i = Math.floor(Math.random() * pool.length);
    if (pool.length > 1 && i === lastIdx[category]) {
      i = (i + 1) % pool.length;
    }
    lastIdx[category] = i;
    const item = pool[i];
    return typeof item === 'function' ? item(userText) : item;
  }

  /* ---------- 5.  RENDERING ---------- */
  function addMsg(text, who) {
    const m = document.createElement('div');
    m.className = 'jbot-msg ' + who;
    m.innerHTML = text; // bot strings include <strong>, so use innerHTML for bot; sanitize user
    if (who === 'user') m.textContent = text; // override with text-only for user input
    body.appendChild(m);
    body.scrollTop = body.scrollHeight;
    return m;
  }

  function addTyping() {
    const t = document.createElement('div');
    t.className = 'jbot-typing';
    t.innerHTML = '<span></span><span></span><span></span>';
    body.appendChild(t);
    body.scrollTop = body.scrollHeight;
    return t;
  }

  function addChips(items) {
    const wrap = document.createElement('div');
    wrap.className = 'jbot-chips';
    items.forEach(label => {
      const b = document.createElement('button');
      b.className = 'jbot-chip';
      b.type = 'button';
      b.textContent = label;
      b.addEventListener('click', () => {
        wrap.remove();
        handleUser(label);
      });
      wrap.appendChild(b);
    });
    body.appendChild(wrap);
    body.scrollTop = body.scrollHeight;
  }

  /* ---------- 6.  CHAT FLOW ---------- */
  let busy = false;
  function handleUser(text) {
    text = (text || '').trim();
    if (!text || busy) return;
    addMsg(text, 'user');
    input.value = '';
    busy = true;
    send.disabled = true;

    const typing = addTyping();
    // realistic delay 700-1400ms
    const delay = 700 + Math.random() * 700;
    setTimeout(() => {
      typing.remove();
      const cat = pickCategory(text);
      const reply = pickResponse(cat, text);
      addMsg(reply, 'bot');
      busy = false;
      send.disabled = false;
      input.focus();
    }, delay);
  }

  /* ---------- 7.  OPEN/CLOSE ---------- */
  let initialized = false;
  function openPanel() {
    panel.classList.add('open');
    fab.classList.add('open');
    fab.setAttribute('aria-label', 'Close chat');
    if (!initialized) {
      initialized = true;
      // First message after a tiny beat
      setTimeout(() => {
        addMsg("Hey! I'm an AI assistant trained on exactly one topic: <strong>how good John Michael Lamigo is at building WordPress sites and funnels</strong>. Ask me literally anything — even unrelated stuff. I'll handle it.", 'bot');
        setTimeout(() => {
          addChips([
            "Who is John?",
            "What's 7 × 8?",
            "Tell me a joke",
            "Show me proof",
            "Should I hire him?"
          ]);
          input.focus();
        }, 350);
      }, 200);
    } else {
      input.focus();
    }
  }
  function closePanel() {
    panel.classList.remove('open');
    fab.classList.remove('open');
    fab.setAttribute('aria-label', 'Open chat about John Lamigo');
  }
  function togglePanel() {
    panel.classList.contains('open') ? closePanel() : openPanel();
  }

  /* ---------- 8.  EVENTS ---------- */
  fab.addEventListener('click', togglePanel);
  closeBtn.addEventListener('click', closePanel);
  send.addEventListener('click', () => handleUser(input.value));
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleUser(input.value);
    }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && panel.classList.contains('open')) closePanel();
  });
})();
