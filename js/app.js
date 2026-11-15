"use strict";

(function () {
  const DATA = globalThis.LR_DATA;
  const ART = globalThis.LR_ART;
  const LEXICON = globalThis.LR_LEXICON.entries;
  const FLOW = DATA.flow;
  const KEY = "lr-health-quiz-1";
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const questionById = {};
  DATA.questions.forEach(function (q) { questionById[q.id] = q; });

  const AREA_OPTIONS = [
    "Vor allem der Darm",
    "Vor allem die Leber",
    "Vor allem der Zellstoffwechsel",
    "Mehrere dieser Bereiche zugleich",
    "Keiner dieser drei als erste Adresse"
  ];

  const PHASES = [
    { id: "welcome", label: "Willkommen" },
    { id: "pillars", label: "Systeme" },
    { id: "quiz", label: "Quiz" },
    { id: "bigpicture", label: "Zusammenhang" },
    { id: "results", label: "Wissen" },
    { id: "lifestyle", label: "Alltag" }
  ];

  let state = load();
  let podcastFocus = false;
  let autoplayOn = !reducedMotion;
  let autoplayTimer = null;

  const app = document.getElementById("app");
  const live = document.getElementById("live");

  app.addEventListener("click", onClick);
  app.addEventListener("input", onInput);
  document.addEventListener("keydown", onKey);
  document.getElementById("lexicon-btn").addEventListener("click", toggleLexicon);
  document.getElementById("home-link").addEventListener("click", function (event) {
    event.preventDefault();
    goToPhase("welcome");
  });
  document.getElementById("nav-podcast").addEventListener("click", function (event) {
    event.preventDefault();
    if (current().type !== "welcome" || state.lexiconOpen || state.symptomOpen) goToPhase("welcome");
    podcastFocus = true;
    paintChrome();
    window.requestAnimationFrame(function () {
      const folgen = document.getElementById("folgen");
      if (folgen) folgen.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
    });
  });
  document.getElementById("journey").addEventListener("click", function (event) {
    const btn = event.target.closest("[data-phase]");
    if (!btn) return;
    goToPhase(btn.dataset.phase);
  });
  document.getElementById("nav-quiz").addEventListener("click", function () {
    goToPhase("quiz");
  });
  document.getElementById("restart-btn").addEventListener("click", function () {
    document.getElementById("restart-dialog").showModal();
  });
  document.getElementById("restart-cancel").addEventListener("click", function () {
    document.getElementById("restart-dialog").close();
  });
  document.getElementById("restart-confirm").addEventListener("click", function () {
    document.getElementById("restart-dialog").close();
    restart();
  });
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) stopAutoplay();
    else if (autoplayOn && current().type === "bigpicture") startAutoplay();
  });

  render({ animate: false, focus: "heading" });

  function current() { return FLOW[state.step]; }

  function phaseId(type) {
    if (type === "question" || type === "aha") return "quiz";
    return type;
  }

  function load() {
    let raw = null;
    try { raw = JSON.parse(localStorage.getItem(KEY) || "null"); } catch (e) { raw = null; }
    const fresh = { step: 0, answers: {}, bigStep: 0, pillar: null, lexiconOpen: false, lexiconQuery: "", lexiconLetter: "", lexiconKind: "all", lexiconId: "", symptomOpen: false, symptomQuery: "", symptomPicks: [], symptomCursor: -1, symptomAnswers: {}, freeNav: false };
    if (!raw || typeof raw !== "object") return fresh;
    const step = Number.isInteger(raw.step) ? Math.min(Math.max(raw.step, 0), FLOW.length - 1) : 0;
    const answers = {};
    DATA.questions.forEach(function (q) {
      const v = raw.answers ? raw.answers[q.id] : undefined;
      if (Number.isInteger(v) && v >= 0 && v < q.options.length) answers[q.id] = v;
    });
    const bigStep = Number.isInteger(raw.bigStep) ? Math.min(Math.max(raw.bigStep, 0), 3) : 0;
    const pillar = typeof raw.pillar === "string" ? raw.pillar : null;
    const kinds = { all: true, erkrankung: true, symptom: true };
    const lexiconId = typeof raw.lexiconId === "string" && LEXICON.some(function (e) { return e.id === raw.lexiconId; }) ? raw.lexiconId : "";
    const symptomPicks = Array.isArray(raw.symptomPicks) ? raw.symptomPicks.filter(function (id) {
      return LEXICON.some(function (entry) { return entry.id === id; });
    }).slice(0, 6) : [];
    const symptomAnswers = {};
    if (raw.symptomAnswers && typeof raw.symptomAnswers === "object") {
      symptomPicks.forEach(function (id) {
        const value = raw.symptomAnswers[id];
        if (Number.isInteger(value) && value >= 0 && value <= 4) symptomAnswers[id] = value;
      });
    }
    let symptomCursor = Number.isInteger(raw.symptomCursor) ? raw.symptomCursor : -1;
    if (symptomCursor < -1) symptomCursor = -1;
    if (symptomCursor > symptomPicks.length) symptomCursor = symptomPicks.length;
    return repair({
      step: step,
      answers: answers,
      bigStep: bigStep,
      pillar: pillar,
      lexiconOpen: raw.lexiconOpen === true,
      lexiconQuery: typeof raw.lexiconQuery === "string" ? raw.lexiconQuery.slice(0, 80) : "",
      lexiconLetter: typeof raw.lexiconLetter === "string" && /^[A-Z]$/.test(raw.lexiconLetter) ? raw.lexiconLetter : "",
      lexiconKind: kinds[raw.lexiconKind] ? raw.lexiconKind : "all",
      lexiconId: lexiconId,
      symptomOpen: raw.symptomOpen === true,
      symptomQuery: typeof raw.symptomQuery === "string" ? raw.symptomQuery.slice(0, 80) : "",
      symptomPicks: symptomPicks,
      symptomCursor: symptomCursor,
      symptomAnswers: symptomAnswers,
      freeNav: raw.freeNav === true
    });
  }

  function repair(st) {
    if (st.freeNav) return st;
    const asked = [];
    for (let i = 0; i < st.step; i += 1) {
      if (FLOW[i].type === "question") asked.push(FLOW[i].id);
    }
    const missing = asked.filter(function (id) { return st.answers[id] == null; });
    if (missing.length) {
      st.step = FLOW.findIndex(function (f) { return f.type === "question" && f.id === missing[0]; });
    }
    return st;
  }

  function persist() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* private mode */ }
  }

  function esc(value) {
    return String(value).replace(/[&<>"']/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
    });
  }

  function render(opts) {
    opts = opts || {};
    if (state.lexiconOpen || current().type !== "bigpicture") stopAutoplay();
    const html = state.symptomOpen ? viewSymptom() : state.lexiconOpen ? viewLexicon() : view(current());
    app.innerHTML = html;
    if (opts.animate === false && app.firstElementChild) {
      app.firstElementChild.style.animation = "none";
    }
    paintChrome();
    if (state.lexiconOpen) paintLexicon();
    if (state.symptomOpen && state.symptomCursor < 0) paintSymptomChoices();
    document.title = (state.symptomOpen ? "Beschwerden verstehen" : state.lexiconOpen ? "Symptome von A bis Z" : titleFor(current().type)) + " · LR Health & Beauty";
    bindScreen();
    if (!state.lexiconOpen && current().type === "bigpicture" && autoplayOn) startAutoplay();
    if (state.lexiconOpen && opts.focus === "search") {
      const field = document.getElementById("lexicon-search");
      if (field) field.focus({ preventScroll: true });
    } else if (opts.focus === "heading") {
      const h = app.querySelector("h1");
      if (h) {
        h.tabIndex = -1;
        h.focus({ preventScroll: true });
      }
    }
  }

  function titleFor(type) {
    const map = {
      welcome: "Podcast und Wissensquiz",
      pillars: "Drei Systeme",
      question: "Gesundheitsquiz",
      aha: "Aha-Moment",
      bigpicture: "Ein Körper, drei Systeme",
      results: "Dein Wissenscheck",
      lifestyle: "Kleine Gewohnheiten"
    };
    return map[type] || "Gesundheitsquiz";
  }

  function paintChrome() {
    const onHome = current().type === "welcome" && !state.lexiconOpen && !state.symptomOpen;
    document.getElementById("quiz-bar").hidden = onHome;
    const quizNav = document.getElementById("nav-quiz");
    const podcastNav = document.getElementById("nav-podcast");
    quizNav.classList.toggle("is-current", !onHome);
    podcastNav.classList.toggle("is-current", onHome && podcastFocus);
    if (onHome) quizNav.removeAttribute("aria-current");
    else quizNav.setAttribute("aria-current", "page");
    if (onHome && podcastFocus) podcastNav.setAttribute("aria-current", "page");
    else podcastNav.removeAttribute("aria-current");
    const phase = phaseId(current().type);
    const index = state.lexiconOpen || state.symptomOpen ? -1 : PHASES.findIndex(function (p) { return p.id === phase; });
    document.getElementById("journey").innerHTML = PHASES.filter(function (p) { return p.id !== "welcome"; }).map(function (p) {
      const i = PHASES.findIndex(function (item) { return item.id === p.id; });
      const cls = i === index ? "is-current" : !state.lexiconOpen && !state.symptomOpen && i < index ? "is-done" : "";
      return '<li class="' + cls + '"' + (i === index ? ' aria-current="step"' : "") + "><button type=\"button\" class=\"journey-btn\" data-phase=\"" + p.id + "\">" + esc(p.label) + "</button></li>";
    }).join("");
    document.getElementById("restart-btn").hidden = state.step === 0 && !state.lexiconOpen;
    const lexBtn = document.getElementById("lexicon-btn");
    lexBtn.textContent = state.lexiconOpen ? "Zurück zum Quiz" : "Symptome A–Z";
    lexBtn.setAttribute("aria-label", state.lexiconOpen ? "Zurück zum Quiz" : "Symptome von A bis Z");
    lexBtn.setAttribute("aria-pressed", String(state.lexiconOpen));
  }

  function view(step) {
    if (step.type === "welcome") return viewWelcome();
    if (step.type === "pillars") return viewPillars();
    if (step.type === "question") return viewQuestion(questionById[step.id]);
    if (step.type === "aha") return viewAha(DATA.ahas[step.id]);
    if (step.type === "bigpicture") return viewPicture();
    if (step.type === "results") return viewResults();
    return viewLifestyle();
  }

  function episodeYear(date) {
    const match = String(date).match(/(\d{4})/);
    return match ? match[1] : "Weitere";
  }

  function episodeItem(episode) {
    return '<li><a href="blog/' + esc(episode.href) + '"><time>' + esc(episode.date) + "</time>" + esc(episode.title) + "</a></li>";
  }

  function episodeArchive() {
    const episodes = globalThis.LR_EPISODES || [];
    const latest = episodes.slice(0, 5);
    const years = [];
    const byYear = {};
    episodes.slice(5).forEach(function (episode) {
      const year = episodeYear(episode.date);
      if (!byYear[year]) {
        byYear[year] = [];
        years.push(year);
      }
      byYear[year].push(episode);
    });
    const groups = years.map(function (year) {
      const count = byYear[year].length;
      return '<details class="year-group"><summary>' + esc(year) + '<span>' + count + (count === 1 ? " Folge" : " Folgen") + "</span></summary><ul class=\"episode-list\">" + byYear[year].map(episodeItem).join("") + "</ul></details>";
    }).join("");
    return '<p class="eyebrow">Zuletzt erschienen</p><ul class="episode-list latest-list">' + latest.map(episodeItem).join("") + '</ul><div class="archive"><p class="eyebrow">Nach Jahren</p>' + groups + "</div>";
  }

  function viewWelcome() {
    return (
      '<section class="screen home" id="start">' +
      '<header class="home-hero">' +
      '<p class="mark">Christina · Innenwelt</p>' +
      '<h1 class="home-title"><span>Podcast</span><em>und Wissen</em></h1>' +
      '<p class="deck">Der Podcast für Haltung und Alltag. Das Quiz für Darm, Leber und Zellen.</p>' +
      '<p class="fine home-note">Manifestieren ist Persönlichkeitsentwicklung und behandelt keine Krankheit. Das Quiz misst Wissen, nicht deinen Gesundheitszustand, und stellt keine Diagnose.</p>' +
      "</header>" +
      '<div class="doors">' +
      '<article class="door door-podcast" id="podcast">' +
      '<img class="cover" src="blog/cover.jpg" alt="Cover des Podcasts Manifestieren mit Christina">' +
      '<p class="eyebrow">Podcast</p>' +
      "<h2>Manifestieren mit Christina</h2>" +
      "<p>Gespräche über Haltung, Alltag, Beziehungen und das Gesetz der Anziehung. Zu jeder Folge gibt es hier eine Leseseite mit dem veröffentlichten Hinweis und den direkten Link zur Aufnahme.</p>" +
      '<div class="actions"><a class="btn" href="https://open.spotify.com/show/0AzxkQ7j5SOGM7yu6dJdGi" target="_blank" rel="noopener noreferrer">Auf Spotify anhören</a>' +
      '<a class="btn btn-ghost" href="#folgen">Folgen ansehen</a></div>' +
      "</article>" +
      '<article class="door door-quiz" id="quiz">' +
      '<p class="eyebrow">Wissensquiz</p>' +
      "<h2>Wie gesund ist dein inneres System?</h2>" +
      "<p>15 Fragen dazu, wie Darm, Leber und Zellen zusammenarbeiten. Der Punktestand zählt richtige Antworten, nicht dein Befinden.</p>" +
      '<div class="actions"><button class="btn" type="button" data-action="next">Quiz starten</button>' +
      '<button class="btn btn-ghost" type="button" data-action="symptom">Nach Beschwerden fragen</button>' +
      '<button class="btn btn-ghost" type="button" data-action="lexicon">Symptome von A bis Z</button></div>' +
      '<p class="fine">5–8 Minuten. Allgemeine Gesundheitsbildung. Dieses Quiz ersetzt keine medizinische Beratung, Diagnose oder Behandlung.</p>' +
      "</article></div>" +
      '<section class="folgen" id="folgen">' +
      '<p class="eyebrow">Podcast</p>' +
      "<h2>Die letzten Folgen</h2>" +
      "<p>Fünf neue Folgen stehen offen. Ältere Folgen liegen nach Jahren darunter. Jede Seite übernimmt den veröffentlichten Folgenhinweis, keine wortgetreue Abschrift.</p>" +
      '<label class="episode-label" for="episode-filter">Folge suchen</label>' +
      '<input class="episode-filter" id="episode-filter" type="search" placeholder="Titel oder Stichwort">' +
      episodeArchive() +
      "</section></section>"
    );
  }

  function viewPillars() {
    const cards = DATA.pillars.map(function (p) {
      const open = state.pillar === p.id;
      const art = p.id === "gut" ? ART.gut() : p.id === "liver" ? ART.liver() : ART.cell();
      return (
        '<article class="pillar' + (open ? " is-open" : "") + '" data-pillar="' + p.id + '">' +
        '<div class="pillar-art">' + art + "</div>" +
        '<div class="pillar-body">' +
        '<p class="eyebrow">' + esc(p.kicker) + "</p>" +
        "<h2>" + esc(p.title) + "</h2>" +
        "<p>" + esc(p.text) + "</p>" +
        '<div class="pillar-extra" id="extra-' + p.id + '"' + (open ? "" : " hidden") + "><p>" + esc(p.more) + "</p></div>" +
        '<button class="linkish" type="button" data-action="pillar" data-pillar="' + p.id + '" aria-expanded="' + open + '" aria-controls="extra-' + p.id + '">' +
        (open ? "Fakt schließen" : "Einen Fakt öffnen") + "</button>" +
        "</div></article>"
      );
    }).join("");
    return (
      '<section class="screen">' +
      '<div class="section-intro">' +
      '<p class="eyebrow">Drei Bereiche, ein Körper</p>' +
      "<h1>Was in dir zusammenarbeitet</h1>" +
      '<p class="lead">Bevor die Fragen beginnen, ein kurzer Blick auf Darm, Leber und Zellstoffwechsel. Wähle eine Karte, wenn du einen zusätzlichen Fakt lesen möchtest.</p>' +
      "</div>" +
      '<div class="pillar-grid">' + cards + "</div>" +
      '<div class="actions"><button class="btn" type="button" data-action="next">Entdecke, wie alles zusammenhängt</button></div>' +
      "</section>"
    );
  }

  function viewQuestion(q) {
    const picked = state.answers[q.id];
    const cat = DATA.categories[q.category];
    const art = q.category === "gut" ? ART.gut() : q.category === "liver" ? ART.liver() : ART.cell();
    const score = DATA.scoreQuiz(state.answers);
    return (
      '<section class="screen">' +
      '<div class="quiz-top">' +
      '<div class="quiz-meta">' +
      '<p class="eyebrow" style="margin:0">' + esc(cat.name) + " · Frage " + q.id + " von 15</p>" +
      '<p class="score-live" id="score-slot">' + score.correct + " richtig</p>" +
      "</div>" +
      '<div class="ticks" aria-hidden="true">' + ticksHtml() + "</div>" +
      "</div>" +
      '<div class="quiz-layout">' +
      '<div class="quiz-copy">' +
      '<p class="hint">' + esc(q.hint) + "</p>" +
      '<h1 class="q-title" id="q-title">' + esc(q.prompt) + "</h1>" +
      '<div class="options' + (q.format === "boolean" ? " is-boolean" : "") + (picked != null ? " is-locked" : "") + '" role="radiogroup" aria-labelledby="q-title">' +
      q.options.map(function (opt, i) { return optionHtml(q, i, picked); }).join("") +
      "</div>" +
      feedbackHtml(q, picked) +
      '<div class="actions"><button class="btn" type="button" id="next-btn" data-action="next"' + (picked == null ? " hidden" : "") + ">" + esc(nextLabel()) + "</button></div>" +
      '<p class="key-hint">Tastatur: 1 bis ' + q.options.length + " wählen, Enter weiter. Der Punktestand misst Wissen, nicht deinen Gesundheitszustand.</p>" +
      "</div>" +
      '<figure class="quiz-art">' + art + "<figcaption>" + esc(q.caption) + "</figcaption></figure>" +
      "</div></section>"
    );
  }

  function optionHtml(q, i, picked) {
    const locked = picked != null;
    const correct = i === q.correct;
    const wrong = locked && i === picked && !correct;
    const cls = ["option", locked && correct ? "is-correct" : "", wrong ? "is-wrong" : ""].filter(Boolean).join(" ");
    const flag = locked && correct ? '<span class="flag">Passend</span>' : wrong ? '<span class="flag flag-wrong">Deine Wahl</span>' : "";
    return (
      '<button type="button" class="' + cls + '" role="radio" aria-checked="' + (locked && i === picked) + '" data-action="choose" data-qid="' + q.id + '" data-index="' + i + '"' + (locked ? " disabled" : "") + ">" +
      '<span class="letter">' + "ABCDEF"[i] + "</span>" +
      '<span class="option-text">' + esc(q.options[i]) + "</span>" +
      flag +
      "</button>"
    );
  }

  function feedbackHtml(q, picked) {
    if (picked == null) return '<div id="feedback" class="feedback" hidden></div>';
    const ok = picked === q.correct;
    return (
      '<div id="feedback" class="feedback ' + (ok ? "is-correct" : "is-wrong") + '">' +
      '<p class="feedback-kicker">' + (ok ? "Stimmt" : "Das war nicht die passende Antwort") + "</p>" +
      (ok ? "" : '<p class="feedback-right">Passende Antwort: ' + esc(q.options[q.correct]) + "</p>") +
      "<p>" + esc(q.explanation) + "</p>" + relatedHtml(q.links) + "</div>"
    );
  }

  function relatedHtml(ids) {
    if (!ids || !ids.length) return "";
    const buttons = ids.map(function (id) {
      const entry = LEXICON.filter(function (item) { return item.id === id; })[0];
      if (!entry) return "";
      return '<button type="button" class="chip" data-action="lexicon-open" data-id="' + entry.id + '">' + esc(entry.title) + "</button>";
    }).join("");
    if (!buttons) return "";
    return '<div class="related"><p class="eyebrow">Beschwerden aus dem Alltag</p><div class="lex-kinds">' + buttons + "</div>" +
      '<p class="fine">Die Einträge zeigen, welche Bereiche sich zum Verständnis anschauen lassen. Sie nennen kein Produkt und sind keine Therapie.</p></div>';
  }

  function openLexiconFromQuiz(id) {
    state.lexiconOpen = true;
    state.lexiconQuery = "";
    state.lexiconLetter = "";
    state.lexiconKind = "all";
    state.lexiconId = id;
    persist();
    render();
  }

  function ticksHtml() {
    const groups = [
      DATA.questions.filter(function (q) { return q.category === "gut"; }),
      DATA.questions.filter(function (q) { return q.category === "liver"; }),
      DATA.questions.filter(function (q) { return q.category === "cell"; })
    ];
    return groups.map(function (group) {
      return '<div class="tick-group">' + group.map(function (q) {
        const ans = state.answers[q.id];
        let cls = "tick";
        if (ans == null && current().type === "question" && current().id === q.id) cls += " is-now";
        else if (ans != null && ans === q.correct) cls += " is-done";
        else if (ans != null) cls += " is-miss";
        return '<span class="' + cls + '" data-qid="' + q.id + '"></span>';
      }).join("") + "</div>";
    }).join("");
  }

  function viewAha(aha) {
    const art = aha.art === "gut" ? ART.gut() : aha.art === "liver" ? ART.liver() : ART.cell();
    return (
      '<section class="screen">' +
      '<div class="aha-grid">' +
      '<div class="art-panel">' + art + "</div>" +
      "<div>" +
      '<p class="eyebrow">' + esc(aha.kicker) + "</p>" +
      "<h1>" + esc(aha.title) + "</h1>" +
      '<p class="lead">' + esc(aha.text) + "</p>" +
      '<p class="note">' + esc(aha.note) + "</p>" +
      '<div class="actions"><button class="btn" type="button" data-action="next">' + esc(nextLabel()) + "</button></div>" +
      "</div></div></section>"
    );
  }

  function viewPicture() {
    const step = DATA.steps[state.bigStep];
    return (
      '<section class="screen">' +
      '<div class="section-intro">' +
      '<p class="eyebrow">Das große Bild</p>' +
      "<h1>Ein Körper. Drei zentrale Systeme.<br>Ein Zusammenspiel.</h1>" +
      "</div>" +
      '<div class="picture-grid">' +
      '<div class="diagram" id="diagram">' +
      ART.plate() +
      '<svg class="diagram-arrows" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">' +
      '<path d="M28 68 C26 52 24 40 26 30"/>' +
      '<path d="M36 28 C52 26 64 30 74 34"/>' +
      '<path d="M32 74 C50 78 62 74 72 70"/>' +
      '<path d="M78 46 C80 54 78 60 76 66"/>' +
      "</svg>" +
      nodeButton(0, "n-gut") +
      nodeButton(1, "n-liver") +
      nodeButton(2, "n-cell") +
      nodeButton(3, "n-immune") +
      "</div>" +
      '<div class="step-copy" id="step-copy" aria-live="polite">' + stepCopy(step) + "</div>" +
      "</div>" +
      '<div class="connection">' +
      '<p class="eyebrow">Aha-Moment</p>' +
      "<h2>Alles hängt zusammen.</h2>" +
      '<p class="lead">Dein Körper funktioniert nicht in einzelnen Abteilungen. Darm, Leber, Blutkreislauf, Immunsystem und Zellen kommunizieren miteinander und bilden ein komplexes biologisches Netzwerk.</p>' +
      '<p class="callout">Diese Systeme leisten wichtige Beiträge zu deinem Wohlbefinden. Gesundheit entsteht aus vielen Faktoren: Schlaf, Bewegung, Ernährung, Psyche, Umwelt, Gene und medizinische Versorgung. Allergien, Infektionen oder Erschöpfung lassen sich nicht auf Darm oder Leber allein zurückführen.</p>' +
      '<div class="actions"><button class="btn" type="button" data-action="next">Zum Wissenscheck</button></div>' +
      "</div></section>"
    );
  }

  function nodeButton(index, cls) {
    const step = DATA.steps[index];
    const active = state.bigStep === index;
    return (
      '<button type="button" class="d-node ' + cls + (active ? " is-active" : "") + '" data-action="step" data-step="' + index + '"' + (active ? ' aria-current="step"' : "") + ">" +
      "<small>" + esc(step.kicker) + "</small><strong>" + esc(step.title) + "</strong></button>"
    );
  }

  function stepCopy(step) {
    return (
      '<p class="eyebrow">' + esc(step.kicker) + " von 4</p>" +
      "<h2>" + esc(step.title) + "</h2>" +
      "<p>" + esc(step.text) + "</p>" +
      '<div class="play-row"><button class="btn btn-ghost" type="button" id="play-toggle" data-action="toggle-play" aria-pressed="' + autoplayOn + '">' +
      (autoplayOn ? "Automatik pausieren" : "Automatik starten") + "</button></div>"
    );
  }

  function viewResults() {
    const score = DATA.scoreQuiz(state.answers);
    const level = DATA.levels[score.level];
    const weak = DATA.weakestOf(score.by);
    const c = (2 * Math.PI * 54).toFixed(2);
    const target = (c * (1 - score.pct / 100)).toFixed(2);
    const meters = ["gut", "liver", "cell"].map(function (id) {
      const cat = DATA.categories[id];
      const row = score.by[id];
      const width = Math.round((row.correct / row.total) * 100);
      return (
        "<div>" +
        '<div class="meter-head"><span>' + esc(cat.meter) + "</span><span>" + row.correct + " / " + row.total + "</span></div>" +
        '<div class="meter" role="img" aria-label="' + esc(cat.meter) + " " + row.correct + " von " + row.total + '"><span style="--w:' + width + '%"></span></div>' +
        "</div>"
      );
    }).join("");
    const recos = (weak.allEqual ? ["balanced"] : weak.ids).map(function (id) {
      const rec = DATA.recommendations[id];
      return '<article class="reco"><p class="eyebrow">Dein nächster Blick</p><h3>' + esc(rec.title) + "</h3><p>" + esc(rec.text) + "</p></article>";
    }).join("");
    return (
      '<section class="screen">' +
      '<p class="eyebrow">Wissenscheck</p>' +
      "<h1>Dein persönlicher Gesundheits-Wissenscheck</h1>" +
      '<p class="fine">Der Punktestand misst dein Wissen aus 15 Fragen. Er sagt nichts über deinen Gesundheitszustand aus und ist keine Diagnose.</p>' +
      '<div class="results-head">' +
      '<div class="ring-wrap" style="--c:' + c + ";--target:" + target + '">' +
      '<svg viewBox="0 0 140 140" aria-hidden="true"><circle cx="70" cy="70" r="54" fill="none" stroke="#e6e6e6" stroke-width="6"/>' +
      '<circle class="ring-value" cx="70" cy="70" r="54" transform="rotate(-90 70 70)"/></svg>' +
      '<div class="ring-label"><strong>' + score.correct + '</strong><span>von 15 · ' + score.pct + " %</span></div></div>" +
      "<div><h2>" + esc(level.title) + "</h2><p class=\"lead\">" + esc(level.text) + "</p></div></div>" +
      '<div class="stat-row">' +
      stat(String(score.correct), "Richtige Antworten") +
      stat(String(score.incorrect), "Andere Antworten") +
      stat(score.pct + " %", "Anteil") +
      "</div>" +
      '<div class="meters">' + meters + "</div>" +
      '<div class="reco-grid' + (weak.ids.length > 1 && !weak.allEqual ? " two" : "") + '">' + recos + "</div>" +
      reviewHtml() +
      '<div class="actions">' +
      '<button class="btn" type="button" data-action="next">Alltagsimpulse ansehen</button>' +
      '<button class="btn btn-ghost" type="button" data-action="lexicon">Symptome von A bis Z</button>' +
      '<button class="btn btn-ghost" type="button" data-action="restart">Quiz neu starten</button>' +
      "</div></section>"
    );
  }

  function stat(value, label) {
    return '<div class="stat"><b>' + esc(value) + "</b><span>" + esc(label) + "</span></div>";
  }

  function reviewHtml() {
    const items = DATA.questions.map(function (q) {
      const picked = state.answers[q.id];
      const ok = picked === q.correct;
      const cat = DATA.categories[q.category].short;
      return (
        '<article class="review-item ' + (ok ? "is-ok" : "is-miss") + '">' +
        "<header><span>Frage " + q.id + " · " + esc(cat) + "</span><strong>" + (ok ? "Passend" : "Andere Antwort") + "</strong></header>" +
        '<p class="q">' + esc(q.prompt) + "</p>" +
        "<p>Deine Antwort: " + esc(q.options[picked]) + "</p>" +
        (ok ? "" : "<p>Passende Antwort: " + esc(q.options[q.correct]) + "</p>") +
        "<p>" + esc(q.explanation) + "</p></article>"
      );
    }).join("");
    return '<details class="review"><summary>Alle 15 Fragen und Erklärungen</summary><div class="review-list">' + items + "</div></details>";
  }

  function viewLifestyle() {
    const cols = DATA.lifestyle.map(function (col) {
      return (
        '<article class="habit">' +
        '<p class="habit-index">' + esc(col.index) + "</p>" +
        "<h3>" + esc(col.title) + "</h3>" +
        "<ul>" + col.items.map(function (item) {
          return "<li><strong>" + esc(item.title) + "</strong><p>" + esc(item.text) + "</p></li>";
        }).join("") + "</ul></article>"
      );
    }).join("");
    return (
      '<section class="screen">' +
      '<p class="eyebrow">Alltag</p>' +
      "<h1>Kleine Gewohnheiten. Große Bedeutung.</h1>" +
      '<p class="lead">Allgemeine Anregungen für den Alltag. Sie beschreiben keine Behandlung und ersetzen keine Beratung durch Ärztinnen, Ärzte oder andere Gesundheitsfachpersonen.</p>' +
      '<div class="life-grid">' + cols + "</div>" +
      '<p class="claims">Hinweise zu Magnesium und B-Vitaminen entsprechen zugelassenen Health-Claims der Europäischen Union. Sie beschreiben die Erhaltung normaler Körperfunktionen.</p>' +
      '<div class="actions"><button class="btn btn-ghost" type="button" data-action="results">Zurück zum Wissenscheck</button>' +
      '<button class="btn btn-ghost" type="button" data-action="lexicon">Symptome von A bis Z</button>' +
      '<button class="btn btn-ghost" type="button" data-action="restart">Quiz neu starten</button></div>' +
      '<div class="brand-band">' +
      '<img class="logo-inv" src="assets/logo-white.svg" alt="LR Health &amp; Beauty" width="136" height="136">' +
      '<p class="eyebrow">More quality for your life</p>' +
      "<h2>Mehr Qualität für dein Leben.</h2>" +
      '<p class="lead">Ein bewusster Lebensstil und eine ausgewogene Ernährung bilden die Grundlage für dein Wohlbefinden. Entdecke, wie du deinen Körper im Alltag mit einer bedarfsgerechten Nährstoffversorgung unterstützen kannst.</p>' +
      '<div class="actions" style="justify-content:center"><a class="btn" href="https://www.lrworld.com/de-de" target="_blank" rel="noopener noreferrer">LR Health &amp; Beauty entdecken</a></div>' +
      "</div></section>"
    );
  }

  function areaAnswer(entry) {
    const systems = entry.systems || [];
    if (!systems.length) return 4;
    if (systems.length > 1) return 3;
    if (systems[0] === "Darm") return 0;
    if (systems[0] === "Leber") return 1;
    return 2;
  }

  function openSymptom() {
    state.symptomOpen = true;
    state.lexiconOpen = false;
    state.symptomCursor = -1;
    persist();
    render({ animate: true, focus: "heading" });
    window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
  }

  function symptomChoices() {
    const query = fold(state.symptomQuery.trim());
    return LEXICON.filter(function (entry) {
      if (!query) return true;
      return fold([entry.title].concat(entry.aliases || []).join(" ")).indexOf(query) !== -1;
    });
  }

  function toggleSymptomPick(id) {
    const has = state.symptomPicks.indexOf(id) !== -1;
    if (has) state.symptomPicks = state.symptomPicks.filter(function (item) { return item !== id; });
    else if (state.symptomPicks.length < 6) state.symptomPicks = state.symptomPicks.concat(id);
    state.symptomAnswers = {};
    state.symptomCursor = -1;
    persist();
    paintSymptomChoices();
    const count = document.getElementById("symptom-count");
    const start = document.getElementById("symptom-start");
    if (count) count.textContent = state.symptomPicks.length + " von 6 ausgewählt";
    if (start) start.disabled = state.symptomPicks.length === 0;
  }

  function paintSymptomChoices() {
    const list = document.getElementById("symptom-choices");
    if (!list) return;
    const visible = symptomChoices();
    list.innerHTML = visible.map(function (entry) {
      const on = state.symptomPicks.indexOf(entry.id) !== -1;
      return '<button type="button" class="lex-item' + (on ? " is-on" : "") + '" data-action="symptom-toggle" data-id="' + entry.id + '" aria-pressed="' + on + '">' +
        '<span class="lex-kicker">' + (entry.kind === "erkrankung" ? "Erkrankung" : "Symptom") + "</span><strong>" + esc(entry.title) + "</strong></button>";
    }).join("") || '<p class="fine">Zu diesem Stichwort gibt es keinen Eintrag.</p>';
  }

  function startSymptomQuestions() {
    if (!state.symptomPicks.length) return;
    state.symptomCursor = 0;
    state.symptomAnswers = {};
    persist();
    render({ animate: true, focus: "heading" });
    window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
  }

  function answerSymptom(index) {
    if (index < 0 || index > 4) return;
    const id = state.symptomPicks[state.symptomCursor];
    if (!id || state.symptomAnswers[id] != null) return;
    state.symptomAnswers[id] = index;
    persist();
    render({ animate: false, focus: "none" });
  }

  function nextSymptom() {
    if (state.symptomCursor < state.symptomPicks.length) state.symptomCursor += 1;
    persist();
    render({ animate: true, focus: "heading" });
    window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
  }

  function backSymptom() {
    state.symptomCursor = -1;
    persist();
    render({ animate: true, focus: "heading" });
  }

  function viewSymptom() {
    if (state.symptomCursor < 0) return viewSymptomPicker();
    if (state.symptomCursor >= state.symptomPicks.length) return viewSymptomResult();
    return viewSymptomQuestion();
  }

  function viewSymptomPicker() {
    return (
      '<section class="screen">' +
      '<p class="eyebrow">Beschwerdenquiz</p>' +
      "<h1>Wähle, was du verstehen willst.</h1>" +
      '<p class="lead">Du bekommst zu jeder Beschwerde eine Wissensfrage: welcher Bereich zum Verständnis dazugehört. Das Quiz stellt keine Diagnose und bewertet nicht deinen Körper.</p>' +
      '<p class="callout">Darm, Leber und Zellstoffwechsel sind manchmal der passende Blick und manchmal ausdrücklich nicht. Die passende Antwort ist die Einordnung, nicht ein Produkt und nicht eine Krankheit, die dir zugeschrieben wird.</p>' +
      '<label class="lex-search-label" for="symptom-search">Suche</label>' +
      '<input class="lex-search" id="symptom-search" type="search" value="' + esc(state.symptomQuery) + '" placeholder="Zum Beispiel Migräne, Akne, Müdigkeit" maxlength="80">' +
      '<p class="lex-count" id="symptom-count">' + state.symptomPicks.length + " von 6 ausgewählt</p>" +
      '<div id="symptom-choices" class="symptom-choices"></div>' +
      '<div class="actions"><button class="btn" type="button" id="symptom-start" data-action="symptom-start"' + (state.symptomPicks.length ? "" : " disabled") + ">Fragen starten</button></div>" +
      "</section>"
    );
  }

  function viewSymptomQuestion() {
    const entry = LEXICON.filter(function (item) { return item.id === state.symptomPicks[state.symptomCursor]; })[0];
    const picked = state.symptomAnswers[entry.id];
    const correct = areaAnswer(entry);
    return (
      '<section class="screen">' +
      '<p class="eyebrow">Frage ' + (state.symptomCursor + 1) + " von " + state.symptomPicks.length + "</p>" +
      "<h1>Wohin schaust du zuerst, wenn du " + esc(entry.title) + " verstehen willst?</h1>" +
      '<div class="options' + (picked != null ? " is-locked" : "") + '" role="radiogroup">' +
      AREA_OPTIONS.map(function (label, i) {
        const cls = ["option", picked != null && i === correct ? "is-correct" : "", picked != null && i === picked && i !== correct ? "is-wrong" : ""].filter(Boolean).join(" ");
        const flag = picked != null && i === correct ? '<span class="flag">Passend</span>' : picked != null && i === picked ? '<span class="flag flag-wrong">Deine Wahl</span>' : "";
        return '<button type="button" class="' + cls + '" data-action="symptom-choose" data-index="' + i + '"' + (picked != null ? " disabled" : "") + "><span class=\"letter\">" + (i + 1) + "</span><span class=\"option-text\">" + esc(label) + "</span>" + flag + "</button>";
      }).join("") +
      "</div>" +
      (picked == null ? "" : '<div class="feedback ' + (picked === correct ? "is-correct" : "is-wrong") + '"><p>' + esc(entry.watch || entry.role) + "</p>" +
        '<figure class="symptom-fig">' + ART.symptom(figureOf(entry), entry.systems || []) + "</figure>" +
        '<p class="fine">' + esc(entry.boundary) + " Dieser Text ersetzt keine medizinische Beratung, Diagnose oder Behandlung.</p></div>") +
      '<div class="actions">' +
      (picked == null ? "" : '<button class="btn" type="button" data-action="symptom-next">Weiter</button>') +
      '<button class="btn btn-ghost" type="button" data-action="symptom-back">Auswahl ändern</button></div>' +
      "</section>"
    );
  }

  function viewSymptomResult() {
    let right = 0;
    const rows = state.symptomPicks.map(function (id) {
      const entry = LEXICON.filter(function (item) { return item.id === id; })[0];
      const ok = state.symptomAnswers[id] === areaAnswer(entry);
      if (ok) right += 1;
      return "<li><strong>" + esc(entry.title) + ".</strong> " + esc(entry.watch || entry.role) + "</li>";
    }).join("");
    return (
      '<section class="screen">' +
      '<p class="eyebrow">Wissenszuordnung</p>' +
      "<h1>" + right + " von " + state.symptomPicks.length + " passend eingeordnet.</h1>" +
      '<p class="lead">Das ist ein Wissen über Zusammenhänge, kein Befund. Du bist damit nicht krank, nicht gesund und nicht behandelt.</p>' +
      "<ul class=\"symptom-result\">" + rows + "</ul>" +
      '<div class="actions"><button class="btn" type="button" data-action="next">Zum Wissensquiz</button>' +
      '<button class="btn btn-ghost" type="button" data-action="symptom-back">Andere Beschwerden wählen</button>' +
      '<a class="btn btn-ghost" href="blog/index.html">Zur Innenwelt</a></div>' +
      '<p class="fine">Dieses Quiz dient ausschließlich der allgemeinen Gesundheitsbildung und ersetzt keine medizinische Beratung, Diagnose oder Behandlung.</p>' +
      "</section>"
    );
  }

  function toggleLexicon() {
    if (state.symptomOpen) {
      state.symptomOpen = false;
      state.lexiconOpen = true;
    } else {
      state.lexiconOpen = !state.lexiconOpen;
    }
    persist();
    render({ animate: true, focus: state.lexiconOpen ? "search" : "heading" });
    window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
  }

  function onInput(event) {
    if (event.target && event.target.id === "episode-filter") {
      const query = fold(event.target.value);
      app.querySelectorAll(".episode-list li").forEach(function (item) {
        item.hidden = query.length > 0 && fold(item.textContent).indexOf(query) === -1;
      });
      app.querySelectorAll(".year-group").forEach(function (group) {
        const visible = Array.prototype.some.call(group.querySelectorAll("li"), function (item) { return !item.hidden; });
        group.hidden = query.length > 0 && !visible;
        group.open = query.length > 0 && visible;
      });
      return;
    }
    if (event.target && event.target.id === "symptom-search") {
      state.symptomQuery = event.target.value.slice(0, 80);
      persist();
      paintSymptomChoices();
      return;
    }
    if (!event.target || event.target.id !== "lexicon-search") return;
    state.lexiconQuery = event.target.value.slice(0, 80);
    if (state.lexiconId && !lexiconVisible().some(function (entry) { return entry.id === state.lexiconId; })) {
      state.lexiconId = "";
    }
    persist();
    paintLexicon();
  }

  function setLexiconLetter(letter) {
    state.lexiconLetter = state.lexiconLetter === letter ? "" : letter;
    if (state.lexiconId && !lexiconVisible().some(function (entry) { return entry.id === state.lexiconId; })) {
      state.lexiconId = "";
    }
    persist();
    paintLexicon();
  }

  function setLexiconKind(kind) {
    state.lexiconKind = kind;
    if (state.lexiconLetter && !LEXICON.some(function (entry) {
      return entry.letter === state.lexiconLetter && (kind === "all" || entry.kind === kind);
    })) state.lexiconLetter = "";
    if (state.lexiconId && !lexiconVisible().some(function (entry) { return entry.id === state.lexiconId; })) {
      state.lexiconId = "";
    }
    persist();
    paintLexicon();
  }

  function openLexiconTerm(id) {
    state.lexiconId = state.lexiconId === id ? "" : id;
    persist();
    paintLexicon();
    const active = document.querySelector(".lex-item.is-on");
    if (active) active.focus();
    const detail = document.getElementById("lexicon-detail");
    if (detail && state.lexiconId && window.matchMedia("(max-width: 860px)").matches) {
      detail.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
    }
  }

  function fold(value) {
    return String(value || "").toLowerCase()
      .replace(/ä/g, "ae")
      .replace(/ö/g, "oe")
      .replace(/ü/g, "ue")
      .replace(/ß/g, "ss");
  }

  function lexiconVisible() {
    const query = fold(state.lexiconQuery.trim());
    return LEXICON.filter(function (entry) {
      if (state.lexiconKind !== "all" && entry.kind !== state.lexiconKind) return false;
      if (state.lexiconLetter && entry.letter !== state.lexiconLetter) return false;
      if (!query) return true;
      const hay = fold([entry.title, entry.summary].concat(entry.aliases || []).join(" "));
      return hay.indexOf(query) !== -1;
    });
  }

  function viewLexicon() {
    return (
      '<section class="screen lexicon">' +
      '<p class="eyebrow">Nachschlagen</p>' +
      "<h1>Symptome und Erkrankungen von A bis Z</h1>" +
      '<p class="lead">Viele Beschwerden, die mit dem heutigen Lebensstil in Verbindung gebracht werden, entstehen aus mehreren Faktoren zugleich. Filtere nach Buchstabe oder Stichwort und lies, welche Rolle Darm, Leber und Zellstoffwechsel spielen können.</p>' +
      '<p class="callout">An die Ursache gehen heißt hier, das Zusammenspiel zu verstehen. Die wenigsten dieser Themen haben eine einzelne Ursache, die sich im Darm, in der Leber oder in den Zellen wieder aufbauen ließe. Gene, Umwelt, Schlaf, Bewegung, Ernährung, Medikamente, Psyche und andere Erkrankungen wirken zusammen. Was sich im Alltag unterstützen lässt, ist die normale Funktion. Die Abklärung bleibt bei der Ärztin oder dem Arzt.</p>' +
      '<div class="lex-tools">' +
      '<label class="lex-search-label" for="lexicon-search">Suche</label>' +
      '<input id="lexicon-search" class="lex-search" type="search" maxlength="80" placeholder="Zum Beispiel Müdigkeit, Bluthochdruck, Fettleber" value="' + esc(state.lexiconQuery) + '" autocomplete="off">' +
      '<div class="lex-kinds" role="group" aria-label="Art des Eintrags">' +
      kindButton("all", "Alle") + kindButton("erkrankung", "Erkrankungen") + kindButton("symptom", "Symptome") +
      "</div>" +
      '<div class="alpha" role="group" aria-label="Alphabet">' + alphabetHtml() + "</div>" +
      "</div>" +
      '<p class="lex-count" id="lexicon-count"></p>' +
      '<div class="lex-layout">' +
      '<div class="lex-list" id="lexicon-list"></div>' +
      '<article class="lex-detail" id="lexicon-detail"></article>' +
      "</div></section>"
    );
  }

  function kindButton(kind, label) {
    const on = state.lexiconKind === kind;
    return '<button type="button" class="chip' + (on ? " is-on" : "") + '" data-action="lexicon-kind" data-kind="' + kind + '" aria-pressed="' + on + '">' + label + "</button>";
  }

  function alphabetHtml() {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    return letters.map(function (letter) {
      const enabled = LEXICON.some(function (entry) {
        return entry.letter === letter && (state.lexiconKind === "all" || entry.kind === state.lexiconKind);
      });
      const on = state.lexiconLetter === letter;
      return '<button type="button" class="alpha-key' + (on ? " is-on" : "") + '" data-action="lexicon-letter" data-letter="' + letter + '"' + (enabled ? "" : " disabled") + ' aria-pressed="' + on + '">' + letter + "</button>";
    }).join("");
  }

  function paintLexicon() {
    const list = document.getElementById("lexicon-list");
    const detail = document.getElementById("lexicon-detail");
    const count = document.getElementById("lexicon-count");
    if (!list || !detail || !count) return;
    const visible = lexiconVisible();
    count.textContent = visible.length + (visible.length === 1 ? " Eintrag" : " Einträge");
    list.innerHTML = visible.length ? visible.map(function (entry) {
      const on = entry.id === state.lexiconId;
      return '<button type="button" class="lex-item' + (on ? " is-on" : "") + '" data-action="lexicon-term" data-id="' + entry.id + '" aria-pressed="' + on + '">' +
        '<span class="lex-kicker">' + (entry.kind === "erkrankung" ? "Erkrankung" : "Symptom") + " · " + entry.letter + "</span>" +
        "<strong>" + esc(entry.title) + "</strong>" +
        "<span>" + esc(entry.summary) + "</span></button>";
    }).join("") : '<p class="fine">Zu dieser Auswahl gibt es keinen Eintrag. Ein anderes Stichwort oder „Alle“ zeigt mehr.</p>';
    detail.innerHTML = lexiconDetailHtml(visible);
    document.querySelectorAll(".alpha-key").forEach(function (key) {
      const letter = key.dataset.letter;
      const enabled = LEXICON.some(function (entry) {
        return entry.letter === letter && (state.lexiconKind === "all" || entry.kind === state.lexiconKind);
      });
      const on = state.lexiconLetter === letter;
      key.disabled = !enabled;
      key.classList.toggle("is-on", on);
      key.setAttribute("aria-pressed", String(on));
    });
    document.querySelectorAll(".chip").forEach(function (chip) {
      const on = chip.dataset.kind === state.lexiconKind;
      chip.classList.toggle("is-on", on);
      chip.setAttribute("aria-pressed", String(on));
    });
  }

  function figureOf(entry) {
    if (entry.figure) return entry.figure;
    if (entry.id === "gelenke" || entry.id === "gicht" || entry.id === "osteoporose") return "joint";
    if (entry.id === "haut" || entry.id === "juckreiz") return "skin";
    if (entry.id === "kopfschmerzen") return "head";
    if (entry.id === "sodbrennen" || entry.id === "voelle" || entry.id === "bauchschmerzen") return "stomach";
    if (entry.id === "bluthochdruck" || entry.id === "arteriosklerose" || entry.id === "herz" || entry.id === "cholesterin" || entry.id === "triglyzeride") return "vessel";
    const systems = entry.systems || [];
    if (!systems.length) return "none";
    if (systems.indexOf("Leber") !== -1 && systems.indexOf("Darm") === -1) return "liver";
    if (systems.indexOf("Zellen") !== -1 && systems.indexOf("Darm") === -1 && systems.indexOf("Leber") === -1) return "cell";
    if (systems.length === 1 && systems[0] === "Leber") return "liver";
    if (systems.length === 1 && systems[0] === "Zellen") return "cell";
    return "gut";
  }

  function lexiconDetailHtml(visible) {
    const entry = LEXICON.filter(function (item) { return item.id === state.lexiconId; })[0];
    if (!entry || !visible.some(function (item) { return item.id === entry.id; })) {
      return '<p class="eyebrow">Einordnung</p><h2>Wähle einen Begriff</h2><p>Jeder Eintrag beschreibt, was dazu bekannt ist, welche Faktoren zusammenkommen und was die normale Funktion von Darm, Leber und Zellen im Alltag unterstützen kann. Es ist keine Ursachenfindung für deinen Körper und keine Therapie.</p>';
    }
    const systems = (entry.systems || []).map(function (name) { return '<li>' + esc(name) + "</li>"; }).join("");
    const watch = entry.watch || (entry.systems.length
      ? "Zum Verständnis lohnt sich ein Blick auf " + entry.systems.join(", ") + ". Das ist keine Empfehlung für ein Produkt und keine Ursachenfindung für deinen Körper."
      : "Darm, Leber und Zellstoffwechsel sind hier nicht die erste Adresse. Die Abklärung gehört in die passende Fachrichtung.");
    return '<p class="eyebrow">' + (entry.kind === "erkrankung" ? "Erkrankung" : "Symptom") + "</p>" +
      "<h2>" + esc(entry.title) + "</h2>" +
      "<p>" + esc(entry.summary) + "</p>" +
      '<figure class="symptom-fig">' + ART.symptom(figureOf(entry), entry.systems || []) + "</figure>" +
      "<h3>Welche Bereiche sich anzuschauen lohnen</h3><p>" + esc(watch) + "</p>" +
      (systems ? '<ul class="system-pills">' + systems + "</ul>" : "") +
      "<h3>Was Darm, Leber und Zellen beitragen können</h3><p>" + esc(entry.role) + "</p>" +
      "<h3>Was zusammenkommt</h3><ul>" + entry.factors.map(function (item) { return "<li>" + esc(item) + "</li>"; }).join("") + "</ul>" +
      "<h3>Was die normale Funktion im Alltag unterstützt</h3><ul>" + entry.everyday.map(function (item) { return "<li>" + esc(item) + "</li>"; }).join("") + "</ul>" +
      '<p class="callout">' + esc(entry.boundary) + " Dieser Text ersetzt keine medizinische Beratung, Diagnose oder Behandlung.</p>";
  }

  function nextLabel() {
    const n = FLOW[state.step + 1];
    if (!n) return "Weiter";
    if (current().type === "aha" && n.type === "question") return "Weiter im Quiz";
    if (n.type === "aha") return "Zum Aha-Moment";
    if (n.type === "question") return "Nächste Frage";
    if (n.type === "bigpicture") return "Zum Zusammenspiel";
    if (n.type === "results") return "Zum Wissenscheck";
    if (n.type === "lifestyle") return "Alltagsimpulse ansehen";
    if (n.type === "pillars") return "Jetzt Gesundheitsquiz starten";
    return "Weiter";
  }

  function onClick(event) {
    const btn = event.target.closest("[data-action]");
    if (!btn || !app.contains(btn)) return;
    const action = btn.dataset.action;
    if (action === "next") goNext();
    else if (action === "lexicon") toggleLexicon();
    else if (action === "symptom") openSymptom();
    else if (action === "symptom-toggle") toggleSymptomPick(btn.dataset.id);
    else if (action === "symptom-start") startSymptomQuestions();
    else if (action === "symptom-choose") answerSymptom(Number(btn.dataset.index));
    else if (action === "symptom-next") nextSymptom();
    else if (action === "symptom-back") backSymptom();
    else if (action === "lexicon-letter") setLexiconLetter(btn.dataset.letter);
    else if (action === "lexicon-kind") setLexiconKind(btn.dataset.kind);
    else if (action === "lexicon-term") openLexiconTerm(btn.dataset.id);
    else if (action === "lexicon-open") openLexiconFromQuiz(btn.dataset.id);
    else if (action === "choose") choose(Number(btn.dataset.qid), Number(btn.dataset.index));
    else if (action === "pillar") togglePillar(btn.dataset.pillar);
    else if (action === "step") selectStep(Number(btn.dataset.step));
    else if (action === "toggle-play") toggleAutoplay();
    else if (action === "restart") document.getElementById("restart-dialog").showModal();
    else if (action === "results") goToType("results");
  }

  function onKey(event) {
    const dialog = document.getElementById("restart-dialog");
    if (dialog.open) return;
    if (state.symptomOpen) {
      if (event.key === "Escape") {
        event.preventDefault();
        state.symptomOpen = false;
        persist();
        render({ animate: true, focus: "heading" });
      } else if (event.key === "Enter" && state.symptomCursor >= 0 && state.symptomCursor < state.symptomPicks.length) {
        const entry = LEXICON.filter(function (item) { return item.id === state.symptomPicks[state.symptomCursor]; })[0];
        if (entry && state.symptomAnswers[entry.id] != null) nextSymptom();
      } else {
        const n = Number(event.key);
        if (n >= 1 && n <= 5 && state.symptomCursor >= 0 && state.symptomCursor < state.symptomPicks.length) {
          const entry = LEXICON.filter(function (item) { return item.id === state.symptomPicks[state.symptomCursor]; })[0];
          if (entry && state.symptomAnswers[entry.id] == null) answerSymptom(n - 1);
        }
      }
      return;
    }
    if (state.lexiconOpen) {
      if (event.key === "Escape") {
        event.preventDefault();
        toggleLexicon();
      }
      return;
    }
    const step = current();
    if (step.type === "question" && state.answers[step.id] == null) {
      const n = Number(event.key);
      const q = questionById[step.id];
      if (n >= 1 && n <= q.options.length) {
        event.preventDefault();
        choose(q.id, n - 1);
        return;
      }
    }
    if (event.key === "Enter" && step.type === "question" && state.answers[step.id] != null) {
      const tag = event.target && event.target.tagName;
      if (tag !== "BUTTON" && tag !== "A") {
        event.preventDefault();
        goNext();
      }
    }
    if ((event.key === "ArrowDown" || event.key === "ArrowUp") && event.target.classList && event.target.classList.contains("option")) {
      const options = Array.from(app.querySelectorAll(".option:not(:disabled)"));
      const i = options.indexOf(event.target);
      if (i === -1) return;
      event.preventDefault();
      const dir = event.key === "ArrowDown" ? 1 : -1;
      const next = options[(i + dir + options.length) % options.length];
      next.focus();
    }
  }

  function choose(qid, index) {
    if (state.answers[qid] != null) return;
    const q = questionById[qid];
    if (!q || index < 0 || index >= q.options.length) return;
    state.answers[qid] = index;
    persist();
    applyAnswer(q, index);
    const ok = index === q.correct;
    const message = ok
      ? "Stimmt. " + q.explanation
      : "Das war nicht die passende Antwort. Passende Antwort: " + q.options[q.correct] + ". " + q.explanation;
    announce(message);
  }

  function applyAnswer(q, picked) {
    const group = app.querySelector(".options");
    if (!group) {
      render({ animate: false, focus: "none" });
      return;
    }
    group.classList.add("is-locked");
    group.querySelectorAll(".option").forEach(function (btn, i) {
      btn.disabled = true;
      btn.setAttribute("aria-checked", String(i === picked));
      if (i === q.correct) btn.classList.add("is-correct");
      if (i === picked && picked !== q.correct) btn.classList.add("is-wrong");
      if (i === q.correct) btn.insertAdjacentHTML("beforeend", '<span class="flag">Passend</span>');
      else if (i === picked) btn.insertAdjacentHTML("beforeend", '<span class="flag flag-wrong">Deine Wahl</span>');
    });
    const slot = document.getElementById("feedback");
    const ok = picked === q.correct;
    slot.hidden = false;
    slot.className = "feedback " + (ok ? "is-correct" : "is-wrong");
    slot.innerHTML =
      '<p class="feedback-kicker">' + (ok ? "Stimmt" : "Das war nicht die passende Antwort") + "</p>" +
      (ok ? "" : '<p class="feedback-right">Passende Antwort: ' + esc(q.options[q.correct]) + "</p>") +
      "<p>" + esc(q.explanation) + "</p>" + relatedHtml(q.links);
    const next = document.getElementById("next-btn");
    next.hidden = false;
    next.focus();
    const score = DATA.scoreQuiz(state.answers);
    const scoreSlot = document.getElementById("score-slot");
    if (scoreSlot) scoreSlot.textContent = score.correct + " richtig";
    paintTicks();
    if (!reducedMotion) slot.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function paintTicks() {
    app.querySelectorAll(".tick").forEach(function (tick) {
      const id = Number(tick.dataset.qid);
      const q = questionById[id];
      const ans = state.answers[id];
      tick.classList.remove("is-done", "is-miss", "is-now");
      if (ans == null && current().type === "question" && current().id === id) tick.classList.add("is-now");
      else if (ans != null && ans === q.correct) tick.classList.add("is-done");
      else if (ans != null) tick.classList.add("is-miss");
    });
  }

  function togglePillar(id) {
    state.pillar = state.pillar === id ? null : id;
    persist();
    app.querySelectorAll(".pillar").forEach(function (card) {
      const open = card.dataset.pillar === state.pillar;
      card.classList.toggle("is-open", open);
      const extra = card.querySelector(".pillar-extra");
      const btn = card.querySelector("[data-action='pillar']");
      if (extra) extra.hidden = !open;
      if (btn) {
        btn.setAttribute("aria-expanded", String(open));
        btn.textContent = open ? "Fakt schließen" : "Einen Fakt öffnen";
      }
    });
  }

  function goNext() {
    const step = current();
    if (step.type === "question" && state.answers[step.id] == null) return;
    if (state.step >= FLOW.length - 1) return;
    state.step += 1;
    persist();
    render({ animate: true, focus: "heading" });
    window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
  }

  function goToPhase(id) {
    podcastFocus = false;
    state.lexiconOpen = false;
    state.symptomOpen = false;
    state.freeNav = true;
    const type = id === "quiz" ? "question" : id;
    const index = FLOW.findIndex(function (item) { return item.type === type; });
    if (index < 0) return;
    state.step = index;
    persist();
    render({ animate: true, focus: "heading" });
    window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
  }

  function goToType(type) {
    const index = FLOW.findIndex(function (f) { return f.type === type; });
    if (index < 0) return;
    state.step = index;
    persist();
    render({ animate: true, focus: "heading" });
    window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
  }

  function selectStep(index) {
    if (index < 0 || index > 3) return;
    state.bigStep = index;
    persist();
    paintStep();
    if (autoplayOn) {
      stopAutoplay();
      startAutoplay();
    }
  }

  function paintStep() {
    const step = DATA.steps[state.bigStep];
    app.querySelectorAll(".d-node").forEach(function (node) {
      const on = Number(node.dataset.step) === state.bigStep;
      node.classList.toggle("is-active", on);
      if (on) node.setAttribute("aria-current", "step");
      else node.removeAttribute("aria-current");
    });
    const copy = document.getElementById("step-copy");
    if (copy) copy.innerHTML = stepCopy(step);
  }

  function toggleAutoplay() {
    autoplayOn = !autoplayOn;
    if (autoplayOn) startAutoplay();
    else stopAutoplay();
    const btn = document.getElementById("play-toggle");
    if (btn) {
      btn.setAttribute("aria-pressed", String(autoplayOn));
      btn.textContent = autoplayOn ? "Automatik pausieren" : "Automatik starten";
    }
  }

  function startAutoplay() {
    if (autoplayTimer || !autoplayOn || reducedMotion) return;
    autoplayTimer = window.setInterval(function () {
      if (current().type !== "bigpicture") {
        stopAutoplay();
        return;
      }
      state.bigStep = (state.bigStep + 1) % 4;
      persist();
      paintStep();
    }, 4800);
  }

  function stopAutoplay() {
    if (autoplayTimer) window.clearInterval(autoplayTimer);
    autoplayTimer = null;
  }

  function bindScreen() {
    const diagram = document.getElementById("diagram");
    if (!diagram) return;
    diagram.addEventListener("mouseenter", function () { stopAutoplay(); });
    diagram.addEventListener("mouseleave", function () { if (autoplayOn) startAutoplay(); });
  }

  function restart() {
    stopAutoplay();
    state = { step: 0, answers: {}, bigStep: 0, pillar: null, lexiconOpen: false, lexiconQuery: "", lexiconLetter: "", lexiconKind: "all", lexiconId: "", symptomOpen: false, symptomQuery: "", symptomPicks: [], symptomCursor: -1, symptomAnswers: {}, freeNav: false };
    autoplayOn = !reducedMotion;
    persist();
    render({ animate: true, focus: "heading" });
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  function announce(text) {
    live.textContent = "";
    window.setTimeout(function () { live.textContent = text; }, 30);
  }
})();
