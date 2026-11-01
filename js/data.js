"use strict";

(function () {
  const categories = {
    gut: { name: "Der Darm", short: "Darm", meter: "Darm-Wissen" },
    liver: { name: "Die Leber", short: "Leber", meter: "Leber-Wissen" },
    cell: { name: "Der Zellstoffwechsel", short: "Zellstoffwechsel", meter: "Zellstoffwechsel-Wissen" }
  };

  const questions = [
    {
      id: 1,
      category: "gut",
      format: "choice",
      hint: "Eine Antwort ist passend",
      caption: "Das Darmmikrobiom",
      links: ["reizdarm", "blaehungen", "infekte"],
      prompt: "Wie viele Mikroorganismen leben ungefähr im menschlichen Darm?",
      options: [
        "Einige Tausend",
        "Milliarden bis Billionen",
        "Nur wenige Millionen",
        "Keine, der Darm ist steril"
      ],
      correct: 1,
      explanation:
        "Unser Darm beherbergt eine riesige Gemeinschaft von Mikroorganismen. Dieses sogenannte Darmmikrobiom umfasst Bakterien, Viren und andere Mikroorganismen. Es unterstützt unter anderem Verdauungsprozesse und steht in engem Austausch mit dem Immunsystem."
    },
    {
      id: 2,
      category: "gut",
      format: "choice",
      hint: "Welche Aussage stimmt?",
      caption: "Die Darmbarriere",
      links: ["unvertraeglichkeit", "allergien", "durchfall"],
      prompt: "Welche Aufgabe hat die Darmbarriere?",
      options: [
        "Sie produziert die gesamte Energie des Körpers.",
        "Sie reguliert, welche Stoffe aus dem Darm in den Körper gelangen.",
        "Sie filtert ausschließlich Wasser.",
        "Sie produziert Insulin."
      ],
      correct: 1,
      explanation:
        "Die Darmbarriere kontrolliert den Stoffaustausch zwischen Darminhalt und Körper. Sie ermöglicht die Aufnahme wichtiger Nährstoffe und hilft gleichzeitig, unerwünschte Stoffe und Krankheitserreger zurückzuhalten."
    },
    {
      id: 3,
      category: "gut",
      format: "choice",
      hint: "Eine Antwort ist passend",
      caption: "Nährstoffaufnahme",
      links: ["durchfall", "verstopfung", "voelle"],
      prompt: "Wo wird ein Großteil der Nährstoffe aus unserer Nahrung aufgenommen?",
      options: ["Im Dünndarm", "Im Magen", "Im Dickdarm", "In der Speiseröhre"],
      correct: 0,
      explanation:
        "Der Dünndarm ist der zentrale Ort der Nährstoffaufnahme. Über seine große Oberfläche gelangen viele Nährstoffe in den Blutkreislauf und stehen dem Körper zur Verfügung."
    },
    {
      id: 4,
      category: "gut",
      format: "boolean",
      hint: "Richtig oder falsch?",
      caption: "Darm und Immunsystem",
      links: ["allergien", "infekte", "neurodermitis"],
      prompt: "Richtig oder falsch: Das Darmmikrobiom steht in Verbindung mit unserem Immunsystem.",
      options: ["Richtig", "Falsch"],
      correct: 0,
      explanation:
        "Das Darmmikrobiom und das Immunsystem beeinflussen sich gegenseitig. Die Mikroorganismen im Darm tragen zur Entwicklung und Regulation von Immunreaktionen bei."
    },
    {
      id: 5,
      category: "gut",
      format: "choice",
      hint: "Welche Aussage stimmt?",
      caption: "Einflüsse des Alltags",
      links: ["reizdarm", "blaehungen", "verstopfung"],
      prompt: "Welche Faktoren können das Darmmikrobiom beeinflussen?",
      options: [
        "Ernährung",
        "Bewegung",
        "Medikamente wie Antibiotika",
        "Alle genannten Faktoren"
      ],
      correct: 3,
      explanation:
        "Das Darmmikrobiom wird von vielen Faktoren beeinflusst. Dazu gehören Ernährung, Bewegung, Alter, Medikamente und Umweltfaktoren. Eine abwechslungsreiche, ballaststoffreiche Ernährung kann eine vielfältige Darmflora unterstützen."
    },
    {
      id: 6,
      category: "liver",
      format: "choice",
      hint: "Eine Antwort ist passend",
      caption: "Vielseitiges Organ",
      links: ["leberverfettung", "cholesterin", "gicht"],
      prompt: "Wie viele lebenswichtige Aufgaben übernimmt die Leber ungefähr?",
      options: ["5", "20", "Mehrere Hundert", "Genau 1.000"],
      correct: 2,
      explanation:
        "Die Leber übernimmt mehrere Hundert Aufgaben im Körper. Sie ist unter anderem für den Stoffwechsel, die Speicherung von Nährstoffen, die Produktion wichtiger Proteine und den Abbau verschiedener Substanzen verantwortlich."
    },
    {
      id: 7,
      category: "liver",
      format: "choice",
      hint: "Welche Aussage stimmt?",
      caption: "Weg der Nährstoffe",
      links: ["zuckerstoffwechsel", "diabetes", "voelle"],
      prompt: "Was passiert mit Nährstoffen nach der Aufnahme im Darm?",
      options: [
        "Sie werden ausschließlich ausgeschieden.",
        "Sie gelangen über das Blut zur weiteren Verarbeitung unter anderem in die Leber.",
        "Sie werden direkt in den Knochen gespeichert.",
        "Sie verschwinden vollständig."
      ],
      correct: 1,
      explanation:
        "Viele aufgenommene Nährstoffe gelangen über die Pfortader zunächst zur Leber. Dort werden sie verarbeitet, umgewandelt, gespeichert oder für andere Körperfunktionen bereitgestellt."
    },
    {
      id: 8,
      category: "liver",
      format: "choice",
      hint: "Welche Aussage stimmt?",
      caption: "Fettstoffwechsel",
      links: ["cholesterin", "triglyzeride", "leberverfettung"],
      prompt: "Welche Aufgabe hat die Leber beim Fettstoffwechsel?",
      options: [
        "Sie produziert und verarbeitet wichtige Bestandteile des Fettstoffwechsels.",
        "Sie verhindert jede Fettaufnahme.",
        "Sie baut grundsätzlich alle Fette ab.",
        "Sie hat keine Funktion beim Fettstoffwechsel."
      ],
      correct: 0,
      explanation:
        "Die Leber ist ein zentraler Bestandteil des Fettstoffwechsels. Sie bildet unter anderem Cholesterin und Gallensäuren und verarbeitet Fettsäuren und andere Lipide."
    },
    {
      id: 9,
      category: "liver",
      format: "boolean",
      hint: "Richtig oder falsch?",
      caption: "Speicher und Abgabe",
      links: ["diabetes", "praediabetes", "heisshunger"],
      prompt: "Richtig oder falsch: Die Leber kann bestimmte Nährstoffe speichern und bei Bedarf wieder bereitstellen.",
      options: ["Richtig", "Falsch"],
      correct: 0,
      explanation:
        "Die Leber speichert beispielsweise Glykogen als Energiereserve sowie verschiedene Vitamine und Spurenelemente. Bei Bedarf können gespeicherte Stoffe wieder zur Verfügung gestellt werden."
    },
    {
      id: 10,
      category: "liver",
      format: "choice",
      hint: "Eine Antwort ist passend",
      caption: "Galle",
      links: ["sodbrennen", "voelle", "magen"],
      prompt: "Was produziert die Leber, das für die Fettverdauung wichtig ist?",
      options: ["Magensäure", "Galle", "Insulin", "Speichel"],
      correct: 1,
      explanation:
        "Die Leber produziert Galle. Diese wird in der Gallenblase gespeichert und bei Bedarf in den Dünndarm abgegeben. Gallensäuren helfen dabei, Nahrungsfette für die Verdauung aufzubereiten."
    },
    {
      id: 11,
      category: "cell",
      format: "choice",
      hint: "Eine Antwort ist passend",
      caption: "Mitochondrien",
      links: ["muedigkeit", "erschoepfung", "konzentration"],
      prompt: "Was ist die wichtigste Funktion der Mitochondrien?",
      options: [
        "Sie speichern genetische Informationen.",
        "Sie stellen einen großen Teil der Energie in Form von ATP bereit.",
        "Sie verdauen unsere Nahrung.",
        "Sie produzieren rote Blutkörperchen."
      ],
      correct: 1,
      explanation:
        "Mitochondrien werden oft als Kraftwerke der Zellen bezeichnet. Sie stellen durch die Zellatmung einen großen Teil des ATP bereit, das Zellen als direkt nutzbare Energiequelle verwenden."
    },
    {
      id: 12,
      category: "cell",
      format: "choice",
      hint: "Welche Aussage stimmt?",
      caption: "Energiestoffwechsel",
      links: ["muedigkeit", "heisshunger", "muskelkraempfe"],
      prompt: "Was benötigt dein Körper für einen funktionierenden Energiestoffwechsel?",
      options: [
        "Nur Zucker",
        "Nur Wasser",
        "Verschiedene Nährstoffe, Vitamine, Mineralstoffe und Energie aus der Nahrung",
        "Ausschließlich Proteine"
      ],
      correct: 2,
      explanation:
        "Der Energiestoffwechsel ist ein komplexes Zusammenspiel. Beispielsweise tragen verschiedene B-Vitamine und Magnesium zu einem normalen Energiestoffwechsel bei. Der Körper benötigt außerdem Energie und weitere essenzielle Nährstoffe."
    },
    {
      id: 13,
      category: "cell",
      format: "boolean",
      hint: "Richtig oder falsch?",
      caption: "Stoffwechsel in jeder Zelle",
      links: ["muedigkeit", "haut", "gelenke"],
      prompt: "Richtig oder falsch: Der Zellstoffwechsel findet nur in den Muskeln statt.",
      options: ["Richtig", "Falsch"],
      correct: 1,
      explanation:
        "Jede lebende Körperzelle benötigt einen funktionierenden Stoffwechsel. Von Gehirnzellen über Leberzellen bis zu Muskelzellen laufen ständig lebenswichtige Stoffwechselprozesse ab."
    },
    {
      id: 14,
      category: "cell",
      format: "choice",
      hint: "Eine Antwort ist passend",
      caption: "Magnesium",
      links: ["muskelkraempfe", "verspannungen", "erschoepfung"],
      prompt: "Welche Rolle spielt Magnesium im Energiestoffwechsel?",
      options: [
        "Es trägt zu einem normalen Energiestoffwechsel bei.",
        "Es ersetzt vollständig die Nahrung.",
        "Es verhindert den Zellstoffwechsel.",
        "Es produziert direkt Sauerstoff."
      ],
      correct: 0,
      explanation:
        "Magnesium ist an zahlreichen enzymatischen Prozessen beteiligt und trägt zu einem normalen Energiestoffwechsel sowie zu einer normalen Muskelfunktion bei."
    },
    {
      id: 15,
      category: "cell",
      format: "choice",
      hint: "Welche Aussage stimmt?",
      caption: "Das Zusammenspiel",
      links: ["metabolisches-syndrom", "diabetes", "uebergewicht"],
      prompt: "Was verbindet Darm, Leber und Zellstoffwechsel am besten?",
      options: [
        "Sie arbeiten vollständig unabhängig voneinander.",
        "Sie bilden ein zusammenhängendes System für Nährstoffaufnahme, Verarbeitung und Energieversorgung.",
        "Nur der Darm ist für den Stoffwechsel verantwortlich.",
        "Die Leber produziert sämtliche Energie der Zellen."
      ],
      correct: 1,
      explanation:
        "Der Darm nimmt Nährstoffe auf, die Leber verarbeitet und verteilt viele davon weiter und die Zellen nutzen verfügbare Nährstoffe für ihre Stoffwechselprozesse. Alle drei Bereiche sind eng miteinander verbunden."
    }
  ];

  const ahas = {
    1: {
      id: 1,
      kicker: "Aha-Moment · Nach dem Darm",
      title: "Dein Darm ist ein echtes Multitalent.",
      text: "Ein großer Teil unseres Immunsystems steht in engem Zusammenhang mit dem Darm. Das Darmmikrobiom beeinflusst die Immunregulation und trägt zur Aufrechterhaltung der Darmbarriere bei.",
      note: "Der Darm ist damit ein wichtiger Ort der Immunregulation – neben Haut, Atemwegen, Lymphorganen und vielen weiteren Einflüssen.",
      art: "gut"
    },
    2: {
      id: 2,
      kicker: "Aha-Moment · Nach der Leber",
      title: "Die Leber arbeitet rund um die Uhr.",
      text: "Die Leber verarbeitet Nährstoffe, speichert Energiereserven, produziert wichtige Eiweiße und baut zahlreiche Stoffe ab. Sie ist eine der zentralen Stoffwechselorgane des Körpers.",
      note: "Dieser Abbau gehört zum normalen Stoffwechsel. Er ist keine Begründung für sogenannte Entgiftungskuren.",
      art: "liver"
    },
    3: {
      id: 3,
      kicker: "Aha-Moment · Nach dem Zellstoffwechsel",
      title: "Jede deiner Zellen ist auf Energie angewiesen.",
      text: "Mitochondrien stellen einen großen Teil des ATP bereit, des universellen Energieträgers der Zellen. Ohne diese Energie könnten grundlegende Prozesse wie Muskelarbeit, Zellteilung und aktiver Stofftransport nicht funktionieren.",
      note: "Ein Teil des ATP entsteht auch außerhalb der Mitochondrien. Die Mitochondrien leisten dennoch den großen Beitrag in den meisten Körperzellen.",
      art: "cell"
    }
  };

  const steps = [
    {
      id: "gut",
      index: 0,
      kicker: "Schritt 1",
      title: "Darm",
      text: "Die Nahrung wird verdaut und Nährstoffe werden aufgenommen."
    },
    {
      id: "liver",
      index: 1,
      kicker: "Schritt 2",
      title: "Leber",
      text: "Viele der aufgenommenen Nährstoffe gelangen über die Pfortader zur Leber und werden dort verarbeitet, gespeichert oder weitergegeben."
    },
    {
      id: "cell",
      index: 2,
      kicker: "Schritt 3",
      title: "Zellen",
      text: "Die Zellen nutzen verfügbare Nährstoffe zur Energiegewinnung und für zahlreiche weitere Stoffwechselprozesse."
    },
    {
      id: "immune",
      index: 3,
      kicker: "Schritt 4",
      title: "Immunsystem",
      text: "Das Immunsystem steht in engem Austausch mit dem Darmmikrobiom und zahlreichen weiteren Körpersystemen."
    }
  ];

  const pillars = [
    {
      id: "gut",
      kicker: "Der Darm",
      title: "Dein inneres Ökosystem",
      text: "Dein Darm ist weit mehr als ein Verdauungsorgan. Er beherbergt Billionen von Mikroorganismen, spielt eine wichtige Rolle für die Nährstoffaufnahme und steht in engem Austausch mit deinem Immunsystem.",
      more: "Die Oberfläche des Dünndarms ist durch Falten und Zotten stark vergrößert. So können viele Nährstoffe aufgenommen werden, während die Darmbarriere den Übergang in den Körper reguliert."
    },
    {
      id: "liver",
      kicker: "Die Leber",
      title: "Deine Stoffwechselzentrale",
      text: "Die Leber verarbeitet Nährstoffe, produziert wichtige Stoffe, speichert Energie und baut zahlreiche körpereigene und körperfremde Substanzen ab.",
      more: "Über die Pfortader erreicht nährstoffreiches Blut aus dem Darm zuerst die Leber. Dort wird es sortiert, umgebaut, gespeichert oder an den übrigen Körper weitergegeben."
    },
    {
      id: "cell",
      kicker: "Der Zellstoffwechsel",
      title: "Energie auf Zellebene",
      text: "Jede deiner Zellen benötigt Energie und Nährstoffe. In den Mitochondrien wird ein großer Teil der Energie bereitgestellt, die dein Körper für seine täglichen Funktionen benötigt.",
      more: "ATP ist der direkt nutzbare Energieträger der Zellen. Magnesium und mehrere B-Vitamine tragen zu einem normalen Energiestoffwechsel bei – als Teil normaler Funktionen, nicht als Leistungsversprechen."
    }
  ];

  const levels = {
    low: {
      title: "Dein Gesundheitswissen hat noch Entwicklungspotenzial.",
      text: "Das ist kein Urteil über deine Gesundheit, sondern eine Momentaufnahme deines Wissens. Die kurzen Erklärungen machen die Zusammenhänge schnell klarer."
    },
    mid: {
      title: "Du bist bereits auf einem guten Weg!",
      text: "Du hast schon ein sicheres Fundament. Die Themen mit weniger Treffern lohnen einen zweiten Blick."
    },
    high: {
      title: "Du bist ein echter Körper-Kenner!",
      text: "Du erkennst, wie Aufnahme, Verarbeitung und Energieversorgung zusammengehören."
    }
  };

  const recommendations = {
    gut: {
      title: "Darm verstehen",
      text: "Am meisten neue Zusammenhänge warten beim Darm. Schau dir das Mikrobiom, die Darmbarriere und die Nährstoffaufnahme im Dünndarm noch einmal an. Eine abwechslungsreiche, ballaststoffreiche Ernährung kann die normale Funktion des Darms im Alltag unterstützen."
    },
    liver: {
      title: "Leber verstehen",
      text: "Bei der Leber ist noch Luft nach oben. Spannend sind die vielen Stoffwechselaufgaben, der Weg der Nährstoffe über die Pfortader, die Galle und die Speicherung von Energiereserven. Die Leber erledigt diesen Abbau im normalen Stoffwechsel, ohne eine spezielle Entgiftungskur."
    },
    cell: {
      title: "Zellstoffwechsel verstehen",
      text: "Auf Zellebene lohnt sich ein zweiter Blick. Mitochondrien stellen einen großen Teil des ATP bereit. Magnesium und mehrere B-Vitamine tragen zu einem normalen Energiestoffwechsel bei. Jede lebende Zelle ist darauf angewiesen, nicht nur die Muskulatur."
    },
    balanced: {
      title: "Das Zusammenspiel im Blick",
      text: "Dein Wissen ist über Darm, Leber und Zellstoffwechsel ähnlich verteilt. Genau dieses Zusammenspiel ist der Kern: aufnehmen, verarbeiten und Energie bereitstellen – eingebettet in den ganzen Körper."
    }
  };

  const lifestyle = [
    {
      id: "gut",
      index: "01",
      title: "Darm",
      items: [
        {
          title: "Vielfältig und ballaststoffreich essen",
          text: "Eine abwechslungsreiche Kost mit vielen pflanzlichen Lebensmitteln unterstützt die normale Verdauung. Ballaststoffe gehören zu einer vollwertigen Ernährung, wie sie auch die Deutsche Gesellschaft für Ernährung beschreibt."
        },
        {
          title: "Gemüse, Obst, Hülsenfrüchte und Vollkorn",
          text: "Diese Lebensmittel liefern Ballaststoffe und viele weitere Nährstoffe. Je bunter der Teller, desto leichter fällt eine vielfältige Versorgung."
        },
        {
          title: "Ausreichend trinken",
          text: "Wasser oder ungesüßte Getränke über den Tag verteilt. Wie viel du brauchst, hängt unter anderem von Hitze, Bewegung und deinem Alltag ab."
        },
        {
          title: "In Bewegung bleiben",
          text: "Regelmäßige Aktivität, schon zügiges Gehen, ist ein Lebensstilfaktor, der auch mit einer vielfältigen Darmflora in Verbindung gebracht wird. Die Forschung dazu entwickelt sich weiter."
        }
      ]
    },
    {
      id: "liver",
      index: "02",
      title: "Leber",
      items: [
        {
          title: "Alkohol bewusst begrenzen",
          text: "Je seltener und je weniger, desto ruhiger der Alltag der Leber. Aus gesundheitlicher Sicht ist weniger die klarere Wahl."
        },
        {
          title: "Ausgewogen essen",
          text: "Eine ausgewogene Kost versorgt die Leber mit Energie und Nährstoffen für ihre normalen Stoffwechselaufgaben."
        },
        {
          title: "Medikamente besprechen",
          text: "Arzneimittel nur einnehmen, wenn sie gebraucht werden, und die Anwendung mit einer Ärztin, einem Arzt oder in der Apotheke klären. Verordnete Medikamente nicht eigenmächtig absetzen."
        },
        {
          title: "Körpergewicht im gesunden Rahmen",
          text: "Ein stabiles Körpergewicht lässt sich mit Essen und Bewegung im Alltag unterstützen. Extreme Diäten sind dafür kein notwendiger Weg."
        }
      ]
    },
    {
      id: "cell",
      index: "03",
      title: "Zellstoffwechsel",
      items: [
        {
          title: "Ausgewogen versorgen",
          text: "Energie, Vitamine und Mineralstoffe kommen im besten Fall aus einer ausgewogenen Kost. Eine Nahrungsergänzung kann diese ergänzen, sie ersetzt aber weder Essen noch eine Behandlung."
        },
        {
          title: "Regelmäßig bewegen",
          text: "Bewegung beansprucht den Energiestoffwechsel in den Muskeln und bleibt gleichzeitig eine Sache des ganzen Körpers."
        },
        {
          title: "Ausreichend schlafen",
          text: "Schlaf gibt Zellen Zeit für Regeneration und viele normale Stoffwechselprozesse. Regelmäßige Schlafzeiten helfen dem Alltag mehr als gelegentliche Kraftakte."
        },
        {
          title: "Magnesium und B-Vitamine einplanen",
          text: "Vollkorn, Hülsenfrüchte, Nüsse, Samen und Gemüse liefern Magnesium und mehrere B-Vitamine. Vitamin B12 steckt vor allem in tierischen Lebensmitteln und angereicherten Produkten. Magnesium trägt zu einem normalen Energiestoffwechsel und zu einer normalen Muskelfunktion bei. Mehrere B-Vitamine tragen ebenfalls zu einem normalen Energiestoffwechsel bei."
        }
      ]
    }
  ];

  function buildFlow() {
    const flow = [{ type: "welcome" }, { type: "pillars" }];
    const after = { 5: 1, 10: 2, 15: 3 };
    questions.forEach(function (q) {
      flow.push({ type: "question", id: q.id });
      if (after[q.id]) flow.push({ type: "aha", id: after[q.id] });
    });
    flow.push({ type: "bigpicture" }, { type: "results" }, { type: "lifestyle" });
    return flow;
  }

  function scoreQuiz(answers) {
    const by = {
      gut: { correct: 0, total: 0 },
      liver: { correct: 0, total: 0 },
      cell: { correct: 0, total: 0 }
    };
    let correct = 0;
    let answered = 0;
    questions.forEach(function (q) {
      by[q.category].total += 1;
      const picked = answers[q.id];
      if (picked == null) return;
      answered += 1;
      if (picked === q.correct) {
        correct += 1;
        by[q.category].correct += 1;
      }
    });
    const incorrect = answered - correct;
    const pct = questions.length ? Math.round((correct / questions.length) * 100) : 0;
    let level = "low";
    if (correct >= 11) level = "high";
    else if (correct >= 6) level = "mid";
    return {
      correct: correct,
      incorrect: incorrect,
      answered: answered,
      total: questions.length,
      pct: pct,
      by: by,
      level: level
    };
  }

  function weakestOf(by) {
    const keys = ["gut", "liver", "cell"];
    const scores = keys.map(function (k) { return by[k].correct; });
    const min = Math.min.apply(null, scores);
    const allEqual = scores.every(function (n) { return n === scores[0]; });
    const ids = keys.filter(function (k) { return by[k].correct === min; });
    return { ids: ids, allEqual: allEqual, min: min };
  }

  globalThis.LR_DATA = {
    categories: categories,
    questions: questions,
    ahas: ahas,
    steps: steps,
    pillars: pillars,
    levels: levels,
    recommendations: recommendations,
    lifestyle: lifestyle,
    flow: buildFlow(),
    scoreQuiz: scoreQuiz,
    weakestOf: weakestOf
  };
})();
