---
layout: case-study.njk
title: ConCap
titleWords: Con+*Cap*
tagline: Gestaltung eines Konferenz-Capture-Flows, der Visitenkarten und schnelle Sprachnotizen in saubere, CRM-fertige Kontakte verwandelt.
lead: Gestaltung eines Konferenz-Capture-Flows, der Visitenkarten und schnelle Sprachnotizen in saubere, CRM-fertige Kontakte verwandelt.
order: 3
tags:
  - UX & Produktdesign
  - "2026"
cover: /assets/images/cover-concap.jpg
coverAlt: Screens der ConCap App
role: UX- und Produktdesign, Prototyping, Testing, Iteration
scope: Problemdefinition, Low-fi-Flow, Live-Prototyp, High-fi-Ausarbeitung, frühe Nutzervalidierung
tools: Figma Make, Supabase, Vercel, Claude Code
year: "2026"
metricsHeading: Der klarste Gewinn war entfernte Arbeit, nicht nur gewonnene Geschwindigkeit
metricsNote: Frühe Tests mit einer kleinen Gruppe, als Richtungswerte zu verstehen.
metrics:
  - value: 2h → 10 Min.
    label: Post-Konferenz-Sortierung und CRM-Vorbereitung
  - value: 1h → 1–2 Min.
    label: CRM-Übergabe mit Sync und Überprüfung
  - value: Reichhaltigere Notizen
    label: Mehr Kontext per Sprache als per Gedächtnis oder Tippen
blocks:
  - label: Briefing
    heading: Das Briefing
    paras:
      - Das Briefing war nicht «baue eine weitere Networking-App». Es war präziser.
    bullets:
      - Kontakterfassung schnell machen.
      - Unauffällig wirken, mitten in einem Gespräch.
      - Nutzer nicht zwingen, unter Druck zu tippen.
      - Daten nach der Veranstaltung nutzbar machen, nicht in der App eingesperrt.
    after:
      - "Das bedeutete: Die UX musste Momentum schützen. Jedes zusätzliche Feld, jeder Tap, jede Entscheidung war Reibung."
  - label: Problem
    heading: Das Problem
    paras:
      - Konferenz-Networking ist von Natur aus unstrukturiert. Menschen tauschen Karten aus, gehen zum nächsten Gespräch über und verlassen sich darauf, dass das Gedächtnis den Rest erledigt. Das geht meistens schief.
      - Fotos von Karten landen an einem Ort. Sprachnotizen irgendwo anders. Details gehen verloren. CRM-Einträge werden zur separaten Aufgabe. Bis die Veranstaltung vorbei ist, verblasst der beste Kontext bereits.
insightQuote: Nutzer haben im Moment keine Zeit für Verwaltungsarbeit. Manchmal haben sie kaum Zeit, das Telefon herauszunehmen, die Karte zu scannen und einen Satz zu sagen.
insightAttr: Zentrale Erkenntnis
prinHeading: Vier Designprinzipien
principles:
  - number: "1"
    title: Zuerst erfassen. Später organisieren.
    body: Die erste Aufgabe ist, den Kontakt und den Kontext zu sichern, bevor sie verschwinden.
  - number: "2"
    title: Eine klare nächste Aktion.
    body: In einer gehetzten Situation kann das Interface Nutzer nicht zweimal nachdenken lassen.
  - number: "3"
    title: Das schnellste native Verhalten nutzen.
    body: Ein Foto machen und eine Notiz sprechen ist schneller als Formulare ausfüllen.
  - number: "4"
    title: Die Arbeit nach der Veranstaltung reduzieren.
    body: Das Produkt funktioniert nur, wenn es später Zeit spart, nicht nur beim Erfassen.
procHeading: Wie es entstanden ist
process:
  - number: "01"
    title: Beim echten Nutzungsmoment beginnen
    body: Nutzer sassen nicht am Schreibtisch. Sie standen an Ständen, bewegten sich zwischen Vorträgen oder sprachen mit der nächsten Person in der Reihe. Ihre Aufmerksamkeitsspanne wurde in Sekunden gemessen. Die App konnte sich nicht wie ein traditioneller Formularflow verhalten.
  - number: "02"
    title: Den Kernflow auf zwei Aktionen reduzieren
    body: "Die Hauptaktion ist das Scannen einer Visitenkarte: Die Kamera öffnet sich sofort, OCR ordnet die Details automatisch in strukturierte Felder ein. Die zweite Aktion ist eine Sprachnotiz. In einem schnellen Flow entsteht ein Datensatz, bereit für Export oder CRM-Sync."
  - number: "03"
    title: Den Workflow im Low-fi beweisen
    body: Vor dem High-fi-Design baute ich einen funktionierenden Low-fi-Prototyp mit Figma Make, verband eine Supabase-Datenbank und deployte ihn auf Vercel. Wir prüften nicht, ob die Screens gefielen, sondern ob das Produkt in einer realistischen Situation funktioniert.
  - number: "04"
    title: Erst dann zum High-fi wechseln
    body: "Erst nachdem die Kerninteraktion ihren Nutzen bewiesen hatte, kam das High-fi-Design. Das Ziel war keine Dekoration, sondern Klarheit: Hierarchie schärfen, Zögern reduzieren, die beiden Kernaktionen offensichtlich und ruhig wirken lassen."
  - number: "05"
    title: Vom ersten echten Reibungspunkt aus iterieren
    body: "Die erste grosse Reibung war die Organisation. Statt jeden Kontakt beim Erfassen zu taggen, entwarf ich ein sitzungsbasiertes Gruppierungsmodell: Die aktuelle Konferenz wird einmal festgelegt, jede neue Erfassung erbt diesen Kontext."
galleries:
  - label: Frühe Wireframes
    heading: "Frühe Prototypen: Struktur vor Stil"
    embed: /assets/concap/concap-lofi.html
    height: 800
    heightMobile: 760
  - label: High-Fidelity-Design
    heading: "High-Fidelity: nachdem das Verhalten funktionierte"
    embed: /assets/concap/concap-hifi.html
    height: 1560
    heightMobile: 820
blocks2:
  - label: UX-Entscheidungen
    heading: Die Entscheidungen, die das Produkt geprägt haben
    items:
      - title: Scannen zur primären Aktion machen
        body: Die App öffnet sich mit der schnellsten, wertvollsten Aktion, nicht mit einem Dashboard.
      - title: OCR statt manueller Eingabe
        body: Der Kontakt ist erstellt, bevor das nächste Gespräch beginnt.
      - title: Sprache statt Tippen für Kontext
        body: Sprechen ist schneller, natürlicher und passt zum Rhythmus des Moments. Die App transkribiert automatisch.
      - title: Offen für nachgelagerte Systeme
        body: Saubere Übergabe an HubSpot, Salesforce, Airtable oder CSV. Ein eingesperrter Kontakt ist nur die halbe Arbeit.
  - label: Validierung
    heading: Wie es getestet wurde
    paras:
      - Zuerst verglich ich, wie viel nützlichen Kontext Nutzer während der Veranstaltung mit und ohne die App erfassten. Dabei ging es um ausführliche Notizen, erinnerte Details und darum, wie brauchbar die Infos danach waren.
      - Dann mass ich, wie viel Schreibtischarbeit nach der Veranstaltung übrig blieb. Dafür habe ich die Zeit fürs Sortieren, Strukturieren und die CRM-Übergabe vorher und nachher gemessen.
      - Die Testgruppe war klein und früh, daher behandle ich die Ergebnisse als Richtungsweisung. Aber das Signal war stark.
quotes:
  - Es fühlt sich reibungslos und intuitiv im Hintergrund an.
  - Es sieht nicht so aus, als würde ich Zeit mit meinem Telefon verschwenden.
pull: Wenn Zeit und Aufmerksamkeit begrenzt sind, muss UX Denken *entfernen*, bevor es Funktionen hinzufügt.
reflection:
  - "ConCap bestätigte eine einfache Regel: Die Aufgabe des Produkts im Moment ist es nicht, clever zu sein. Es geht darum, aus dem Weg zu gehen."
  - Die stärkste Entscheidung war, die Erfahrung auf zwei Kernaktionen zu reduzieren und dieses Verhalten früh in einem Live-Prototyp zu testen. Das hielt die Arbeit ehrlich.
nextSteps:
  - "Die nächste Produktschicht ist nicht mehr Erfassung, sondern bessere Organisation und Nachverfolgung: sitzungsbasierte Gruppierung nach Konferenz, Zielgruppe oder Kundensegment, stärkere Filter und sauberere Exporte."
  - Der Schlüssel ist, diese Struktur hinzuzufügen, ohne den Kernerfassungsflow zu verlangsamen. Geschwindigkeit bleibt das Produkt.
---
