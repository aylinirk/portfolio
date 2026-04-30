---
title: ConCap
tagline: Gestaltung eines Konferenz-Capture-Flows, der Visitenkarten und schnelle Sprachnotizen in saubere, CRM-fertige Kontakte verwandelt.
order: 1
tags:
  - UX & Produktdesign
  - "2026"
coverGradient: "linear-gradient(135deg, #A8C095 0%, #8A9E78 35%, #6E8860 70%, #587050 100%)"
role: "UX- und Produktdesign, Prototyping, Testing, Iteration"
scope: "Problemdefinition, Low-fi-Flow, Live-Prototyp, High-fi-Ausarbeitung, frühe Nutzervalidierung"
tools: "Figma Make, Supabase, Vercel, Cloud Code"
year: 2026
metrics:
  - value: "2h → 10 Min."
    label: Vorbereitung nach der Veranstaltung
  - value: "1h → 1–2 Min."
    label: CRM-Übergabe
  - value: Reichhaltigere Notizen
    label: Sprache statt Tippen unter Zeitdruck
brief:
  heading: Das Briefing
  body: |
    Das Briefing war nicht "baue eine weitere Networking-App." Es war präziser.

    - Kontakterfassung schnell machen.
    - Unauffällig wirken, mitten in einem Gespräch.
    - Nutzer nicht zwingen, unter Druck zu tippen.
    - Daten nach der Veranstaltung nutzbar machen, nicht in der App eingesperrt.

    Das bedeutete: Die UX musste Momentum schützen. Jedes zusätzliche Feld, jeder Tap, jede Entscheidung war Reibung.
problem:
  heading: Das Problem
  body: |
    Konferenz-Networking ist von Natur aus unstrukturiert. Menschen tauschen Karten aus, gehen zum nächsten Gespräch über und verlassen sich darauf, dass das Gedächtnis den Rest erledigt. Das geht meistens schief.

    Fotos von Karten landen an einem Ort. Sprachnotizen irgendwo anders. Details gehen verloren. CRM-Einträge werden zur separaten Aufgabe. Bis die Veranstaltung vorbei ist, verblasst der beste Kontext bereits.

    Die zentrale Erkenntnis war einfach: Nutzer haben im Moment keine Zeit für Verwaltungsarbeit. Manchmal haben sie kaum Zeit, das Telefon herauszunehmen, die Karte zu scannen und einen Satz zu sagen, bevor das nächste Gespräch beginnt.
insightQuote: "Nutzer haben im Moment keine Zeit für Verwaltungsarbeit. Manchmal haben sie kaum Zeit, das Telefon herauszunehmen, die Karte zu scannen und einen Satz zu sagen, bevor das nächste Gespräch beginnt."
insightAttr: Zentrale Erkenntnis
principles:
  heading: Vier Designprinzipien
  items:
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
process:
  heading: Wie es entstanden ist
  items:
    - number: "01"
      title: Beim echten Nutzungsmoment beginnen
      body: Ich begann damit, den tatsächlichen Kontext zu definieren. Nutzer saßen nicht am Schreibtisch. Sie standen an Ständen, bewegten sich zwischen Vorträgen oder sprachen mit der nächsten Person in der Reihe. Ihre Aufmerksamkeitsspanne wurde in Sekunden gemessen. Das veränderte das Produkt sofort — die App konnte sich nicht wie ein traditioneller Formularflow verhalten.
    - number: "02"
      title: Den Kernflow auf zwei Aktionen reduzieren
      body: Die Hauptaktion ist das Scannen einer Visitenkarte. Die Kamera des Telefons öffnet sich sofort. OCR liest die Karte und ordnet die Details automatisch in strukturierte Felder ein. Die zweite Aktion ist das Aufnehmen einer Sprachnotiz. In einem schnellen Flow erfassen Nutzer die Karte, den Kontext und einen strukturierten Datensatz, der für Export oder CRM-Sync bereit ist.
    - number: "03"
      title: Den Workflow im Low-fi beweisen, bevor poliert wird
      body: Vor dem Wechsel zum High-fi-Design baute ich einen funktionierenden Low-fi-Prototyp mit Figma Make, verband eine Supabase-Datenbank und deployte ihn auf Vercel, damit der Auftraggeber und frühe Nutzer den tatsächlichen Flow testen konnten. Wir fragten nicht, ob die Screens gefielen. Wir prüften, ob das Produkt in einer realistischen Situation wirklich funktioniert.
    - number: "04"
      title: Erst zum High-fi wechseln, wenn das Verhalten funktioniert
      body: Erst nachdem die Kerninteraktion ihren Nutzen bewiesen hatte, wurde das High-fi-Design angewendet. Das Ziel war keine Dekoration — es war Klarheit. Ich verfeinerte die Hierarchie, reduzierte Zögern und ließ die beiden Kernaktionen offensichtlich und ruhig wirken. Die visuelle Schicht kam, nachdem der Workflow Sinn ergab.
    - number: "05"
      title: Vom ersten echten Reibungspunkt aus iterieren
      body: Die erste große Reibung war nicht das Erfassen — es war die Organisation. Nutzern gefiel die Geschwindigkeit, aber sie wollten Kontakte nach Konferenz oder Gruppe sortieren. Statt jeden Kontakt beim Erfassen zu taggen, entwarf ich ein sitzungsbasiertes Gruppierungsmodell — Nutzer legen die aktuelle Konferenz einmalig fest, und jede neue Erfassung erbt diesen Kontext automatisch.
lofiPhase:
  label: "Frühe Wireframes"
  screens:
    - label: "Lo-fi-Screen 1"
    - label: "Lo-fi-Screen 2"
    - label: "Lo-fi-Screen 3"
    - label: "Lo-fi-Screen 4"
decisions:
  heading: "Die Entscheidungen, die das Produkt geprägt haben"
  items:
    - title: Scannen zur primären Aktion machen
      body: Die App öffnet sich mit der schnellsten, wertvollsten Aktion, nicht mit einem Dashboard. Das reduziert die Zeit bis zum ersten Erfolg und eliminiert den kognitiven Aufwand, entscheiden zu müssen, wo man beginnt.
    - title: OCR zur Vermeidung manueller Eingabe einsetzen
      body: Nutzer sollten eine Visitenkarte nicht abtippen müssen, die sie bereits vor sich haben. OCR liest die Karte und ordnet sie automatisch in strukturierte Felder ein — der Kontakt ist erstellt, bevor das nächste Gespräch beginnt.
    - title: Sprache statt Tippen für Kontext verwenden
      body: Notizen auf einer vollen Veranstaltung zu tippen ist umständlich, langsam und sozial sichtbar. Sprechen ist schneller, natürlicher und passt zum Rhythmus des Moments. Die App transkribiert und hängt die Notiz automatisch an.
    - title: Das Produkt für nachgelagerte Systeme offen halten
      body: Der Wert der App ist nicht nur das Erfassen. Es ist die saubere Übergabe an Tools wie HubSpot, Salesforce, Airtable oder CSV-Export. Ein erfasster Kontakt, der in der App eingesperrt bleibt, ist nur die halbe Arbeit.
hifiPhase:
  label: "High-Fidelity-Design"
  screens:
    - label: "Hi-fi-Screen 1"
    - label: "Hi-fi-Screen 2"
    - label: "Hi-fi-Screen 3"
    - label: "Hi-fi-Screen 4"
validation:
  heading: Wie es getestet wurde
  body: |
    Ich validierte zwei Dinge.

    Zuerst verglich ich, wie viel nützlichen Kontext Nutzer während der Veranstaltung mit und ohne die App erfassten. Der Fokus lag auf Notizenreichtum, erinnerten Details und der Nutzbarkeit der erfassten Informationen danach.

    Dann maß ich, wie viel Schreibtischarbeit nach der Veranstaltung verblieb — ein zeitgesteuerter Vorher-Nachher-Vergleich des Post-Konferenz-Sortierens, Strukturierens und der CRM-Übergabe.

    Die Testgruppe war klein und früh, daher behandle ich die Ergebnisse als Richtungsweisung. Aber das Signal war stark.
outcomes:
  heading: Der klarste Gewinn war entfernte Arbeit, nicht nur gewonnene Geschwindigkeit
  metrics:
    - value: "2h → 10 Min."
      label: Post-Konferenz-Sortierung und CRM-Vorbereitung
    - value: "1h → 1–2 Min."
      label: CRM-Übergabe mit Sync und Überprüfung
    - value: Reichhaltigere Notizen
      label: Nutzer erfassten mehr Kontext per Sprache als per Gedächtnis oder Tippen
  quotes:
    - "Es fühlt sich reibungslos und intuitiv im Hintergrund an."
    - "Es sieht nicht so aus, als würde ich Zeit mit meinem Telefon verschwenden."
reflection:
  pull: Wenn Zeit und Aufmerksamkeit begrenzt sind, muss UX Denken entfernen, bevor es Funktionen hinzufügt.
  body: |
    ConCap bestätigte eine einfache Regel: Die Aufgabe des Produkts im Moment ist es nicht, clever zu sein. Es geht darum, aus dem Weg zu gehen.

    Die stärkste Entscheidung war, die Erfahrung auf zwei Kernaktionen zu reduzieren und dieses Verhalten früh in einem Live-Prototyp zu testen. Das hielt die Arbeit ehrlich. Es machte jede spätere Designentscheidung einfacher, weil das Produkt seinen Wert bereits bewiesen hatte, bevor das visuelle Polieren begann.
nextSteps:
  heading: Was als nächstes kommt
  body: |
    Die nächste Produktschicht ist nicht mehr Erfassung. Es geht um bessere Organisation und Nachverfolgung.

    Der erste Schritt ist sitzungsbasierte Gruppierung nach Konferenz, Zielgruppe oder Kundensegment. Von dort aus kann das Produkt stärkere Filterung, sauberere segmentierte Exporte und eine strukturiertere Übergabe in Sales-Workflows unterstützen.

    Der Schlüssel ist, diese Struktur hinzuzufügen, ohne den Kernerfassungsflow zu verlangsamen. Geschwindigkeit bleibt das Produkt.
---
