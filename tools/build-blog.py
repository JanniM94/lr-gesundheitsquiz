#!/usr/bin/env python3
"""Build reading pages from the published podcast feed.

The pages use the episode title, date and show notes that Christina published.
They are not word-for-word transcripts of the audio.
"""

import html
import os
import re
import unicodedata
from datetime import datetime
from email.utils import parsedate_to_datetime
from html.parser import HTMLParser
from xml.etree import ElementTree as ET

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RSS = os.environ.get("PODCAST_RSS", "/tmp/christina-rss.xml")
BLOG = os.path.join(ROOT, "blog")
FOLGEN = os.path.join(BLOG, "folgen")
SHOW = "https://open.spotify.com/show/0AzxkQ7j5SOGM7yu6dJdGi"
ALLOW = {"p", "br", "em", "strong", "ul", "ol", "li", "b", "i"}


class Clean(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.parts = []
        self._a = False

    def handle_starttag(self, tag, attrs):
        if tag == "br":
            self.parts.append("<br>")
        elif tag in ALLOW:
            self.parts.append("<" + tag + ">")
        elif tag == "a":
            href = dict(attrs).get("href") or ""
            if href.startswith("http://") or href.startswith("https://"):
                self.parts.append('<a href="' + html.escape(href, quote=True) + '" target="_blank" rel="noopener noreferrer">')
                self._a = True
            else:
                self._a = False
        else:
            if tag == "a":
                self._a = False

    def handle_endtag(self, tag):
        if tag in ALLOW:
            self.parts.append("</" + tag + ">")
        elif tag == "a" and getattr(self, "_a", False):
            self.parts.append("</a>")
            self._a = False

    def handle_data(self, data):
        self.parts.append(html.escape(data))


def clean_html(raw):
    parser = Clean()
    parser.feed(raw or "")
    parser.close()
    text = "".join(parser.parts)
    text = re.sub(r"(<br>\s*){3,}", "<br><br>", text)
    text = re.sub(r"(<p>\s*</p>)", "", text)
    return text.strip() or "<p>Zu dieser Folge gibt es nur einen kurzen Hinweis. Die Aufnahme selbst steht über den Link bereit.</p>"


def plain(raw):
    text = re.sub(r"<[^>]+>", " ", raw or "")
    text = html.unescape(re.sub(r"\s+", " ", text)).strip()
    return text


def slugify(title, guid):
    folded = unicodedata.normalize("NFKD", title)
    folded = "".join(ch for ch in folded if not unicodedata.combining(ch))
    folded = re.sub(r"[^a-z0-9]+", "-", folded.lower()).strip("-")[:68]
    tail = re.sub(r"[^a-z0-9]", "", (guid or "folge").lower())[:6] or "folge"
    return (folded or "folge") + "-" + tail


def german_date(value):
    try:
        dt = parsedate_to_datetime(value)
    except (TypeError, ValueError):
        return ""
    months = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"]
    return str(dt.day) + ". " + months[dt.month - 1] + " " + str(dt.year)


def iso_date(value):
    try:
        return parsedate_to_datetime(value).date().isoformat()
    except (TypeError, ValueError):
        return ""


def wrap_title(title, limit):
    words = title.replace("—", " ").replace("–", " ").split()
    lines = []
    current = ""
    for word in words:
        trial = (current + " " + word).strip()
        if current and len(trial) > limit:
            lines.append(current)
            current = word
        else:
            current = trial
    if current:
        lines.append(current)
    return lines


def star_points(cx, cy, outer, inner):
    import math
    pts = []
    for i in range(10):
        radius = outer if i % 2 == 0 else inner
        angle = -math.pi / 2 + i * math.pi / 5
        pts.append(str(round(cx + math.cos(angle) * radius, 1)) + "," + str(round(cy + math.sin(angle) * radius, 1)))
    return " ".join(pts)


def graphic(title, cover):
    lines = [title]
    size = 40
    for size in (40, 34, 30, 26, 22):
        limit = max(12, int(520 / (size * 0.56)))
        lines = wrap_title(title, limit)
        if len(lines) * size * 1.18 <= 320:
            break
    if len(lines) > 7:
        lines = lines[:7]
        lines[-1] = lines[-1].rstrip(" ,;:") + " …"
    gap = size * 1.15
    start = 318 + max(0, (320 - (len(lines) - 1) * gap) / 2)
    tspans = []
    for i, line in enumerate(lines):
        y = round(start + i * (size * 1.16))
        tspans.append('<tspan x="610" y="' + str(y) + '">' + html.escape(line) + "</tspan>")
    return (
        '<svg class="thumb" viewBox="0 0 1200 675" role="img" aria-label="' + html.escape(title) + '">'
        "<defs>"
        '<linearGradient id="gold" x1="0" y1="0" x2="1" y2="1">'
        '<stop offset="0%" stop-color="#f0d7a2"/>'
        '<stop offset="48%" stop-color="#d7b56a"/>'
        '<stop offset="100%" stop-color="#b89045"/>'
        "</linearGradient>"
        '<clipPath id="host"><rect width="520" height="675"/></clipPath>'
        '<linearGradient id="fade" x1="0" y1="0" x2="1" y2="0">'
        '<stop offset="0%" stop-color="#d7b56a" stop-opacity="0"/>'
        '<stop offset="100%" stop-color="#d7b56a" stop-opacity="1"/>'
        "</linearGradient>"
        "</defs>"
        '<rect width="1200" height="675" fill="url(#gold)"/>'
        '<image href="' + cover + '" x="-30" y="-80" width="1280" height="1280" clip-path="url(#host)" preserveAspectRatio="xMidYMid slice"/>'
        '<rect x="340" width="180" height="675" fill="url(#fade)"/>'
        '<path d="M640 118 C700 104 760 86 820 78" fill="none" stroke="#f7f1e6" stroke-width="2.2" stroke-linecap="round"/>'
        '<polygon points="' + star_points(868, 78, 34, 14) + '" fill="none" stroke="#f7f1e6" stroke-width="2"/>'
        '<path d="M930 58 l4 10 10 4 -10 4 -4 10 -4 -10 -10 -4 10 -4 z" fill="#f7f1e6"/>'
        '<path d="M800 132 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3 z" fill="#f7f1e6"/>'
        '<text x="610" y="168" fill="#f7f1e6" font-family="Cormorant Garamond, Times New Roman, serif" font-size="28" letter-spacing="6">MANIFESTIEREN</text>'
        '<text x="760" y="206" fill="#f7f1e6" font-family="Great Vibes, cursive" font-size="36">mit</text>'
        '<path d="M610 214 H730 M860 214 H1040" stroke="#f7f1e6" stroke-width="1.2"/>'
        '<text x="610" y="248" fill="#f7f1e6" font-family="Cormorant Garamond, Times New Roman, serif" font-size="26" letter-spacing="5">CHRISTINA</text>'
        '<text fill="#f7f1e6" font-family="Cormorant Garamond, Times New Roman, serif" font-size="' + str(size) + '" font-weight="600">'
        + "".join(tspans) + "</text></svg>"
    )


def page(episode, earlier, later):
    title = episode["title"]
    desc = episode["html"]
    meta = plain(episode["raw"])[:155]
    nav = '<p class="pager">'
    if earlier:
        nav += '<a href="' + earlier["slug"] + '.html">Ältere Folge</a>'
    else:
        nav += "<span></span>"
    nav += '<a href="../index.html">Alle Folgen</a>'
    if later:
        nav += '<a href="' + later["slug"] + '.html">Neuere Folge</a>'
    nav += "</p>"
    return """<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>""" + html.escape(title) + """ · Manifestieren mit Christina</title>
  <meta name="description" content=\"""" + html.escape(meta or title) + """\">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600&family=Great+Vibes&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../blog.css">
</head>
<body>
  <header class="top">
    <a class="brand" href="../index.html">Innenwelt</a>
    <nav>
      <a href="../../index.html">Wissensquiz</a>
      <a href="../index.html">Alle Folgen</a>
      <a href=\"""" + SHOW + """\" target="_blank" rel="noopener noreferrer">Spotify</a>
    </nav>
  </header>
  <main>
    <p class="eyebrow">Manifestieren mit Christina""" + ((" · " + html.escape(episode["date"])) if episode["date"] else "") + """</p>
    <h1>""" + html.escape(title) + """</h1>
    <p class="listen"><a href=\"""" + html.escape(episode["url"]) + """\">Folge anhören</a>""" + ((" · " + html.escape(episode["duration"])) if episode["duration"] else "") + """</p>
    <figure class="art">""" + graphic(title, "../cover.jpg") + """</figure>
    <p class="bridge">Diese Leseseite steht neben dem Wissensquiz über Darm, Leber und Zellstoffwechsel. Die Folge selbst gehört zur Persönlichkeitsentwicklung: Haltung, Alltag, Beziehungen. Sie ist keine Anleitung, eine Krankheit zu manifestieren oder zu behandeln.</p>
    <h2>Worum es in der Folge geht</h2>
    <div class="notes">""" + desc + """</div>
    <p class="note">Das ist der veröffentlichte Folgenhinweis, keine wortgetreue Abschrift der Aufnahme. Die ganze Folge hörst du über den Link.</p>
    """ + nav + """
    <p class="quiz-link"><a href="../../index.html">Zum Wissensquiz über den Körper</a></p>
  </main>
</body>
</html>
"""


def main():
    root = ET.parse(RSS).getroot()
    channel = root.find("channel")
    episodes = []
    seen = set()
    for item in channel.findall("item"):
        title = (item.findtext("title") or "Folge").strip()
        guid = (item.findtext("guid") or title).strip()
        slug = slugify(title, guid)
        while slug in seen:
            slug += "x"
        seen.add(slug)
        episodes.append({
            "title": title,
            "slug": slug,
            "url": (item.findtext("link") or SHOW).strip(),
            "date": german_date(item.findtext("pubDate") or ""),
            "iso": iso_date(item.findtext("pubDate") or ""),
            "duration": ((item.findtext("{http://www.itunes.com/dtds/podcast-1.0.dtd}duration") or "").strip()),
            "raw": item.findtext("description") or "",
            "html": clean_html(item.findtext("description") or ""),
        })
    os.makedirs(FOLGEN, exist_ok=True)
    for index, episode in enumerate(episodes):
        earlier = episodes[index + 1] if index + 1 < len(episodes) else None
        later = episodes[index - 1] if index > 0 else None
        with open(os.path.join(FOLGEN, episode["slug"] + ".html"), "w", encoding="utf-8") as handle:
            handle.write(page(episode, earlier, later))
    items = []
    for episode in episodes:
        items.append(
            '<li><a href="folgen/' + episode["slug"] + '.html"><time>' + html.escape(episode["date"]) + "</time>" + html.escape(episode["title"]) + "</a></li>"
        )
    index_html = """<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Innenwelt · Manifestieren mit Christina</title>
  <meta name="description" content="Leseseiten zu den Folgen von Manifestieren mit Christina, mit Hörlink. Daneben das Wissensquiz über Darm, Leber und Zellstoffwechsel.">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600&family=Great+Vibes&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="blog.css">
</head>
<body>
  <header class="top">
    <a class="brand" href="index.html">Innenwelt</a>
    <nav>
      <a href="../index.html">Wissensquiz</a>
      <a href=\"""" + SHOW + """\" target="_blank" rel="noopener noreferrer">Spotify</a>
    </nav>
  </header>
  <main>
    <p class="eyebrow">Manifestieren mit Christina</p>
    <h1>Folgen zum Lesen und Anhören.</h1>
    <p class="lead">Hier liegen die veröffentlichten Folgenhinweise als einzelne Seiten, jede mit direktem Hörlink. Die Innenwelt der Seele bleibt Persönlichkeitsentwicklung. Die Innenwelt des Körpers bleibt das Wissensquiz. Manifestieren behandelt keine Krankheit.</p>
    <figure class="art">""" + graphic("Folgen zum Lesen und Anhören", "cover.jpg") + """</figure>
    <p><a class="btn" href="../index.html">Zum Wissensquiz</a></p>
    <label for="filter">Folge suchen</label>
    <input id="filter" type="search" placeholder="Titel oder Stichwort">
    <ul class="episodes" id="episodes">
      """ + "\n      ".join(items) + """
    </ul>
  </main>
  <script>
    document.getElementById("filter").addEventListener("input", function (event) {
      var query = event.target.value.toLowerCase();
      document.querySelectorAll("#episodes li").forEach(function (item) {
        item.hidden = query && item.textContent.toLowerCase().indexOf(query) === -1;
      });
    });
  </script>
</body>
</html>
"""
    with open(os.path.join(BLOG, "index.html"), "w", encoding="utf-8") as handle:
        handle.write(index_html)
    print(len(episodes), "episodes")


if __name__ == "__main__":
    main()
