---
title: ConCap
tagline: Designing a conference capture flow that turns business cards and fast voice notes into clean, CRM-ready contacts.
order: 1
tags:
  - UX & Product Design
  - "2025"
coverGradient: "linear-gradient(135deg, #A8C095 0%, #8A9E78 35%, #6E8860 70%, #587050 100%)"
role: "UX and product design, prototyping, testing, iteration"
scope: "Problem framing, low-fi flow, live prototype, high-fi refinement, early user validation"
tools: "Figma Make, Supabase, Vercel, Cloud Code"
year: 2025
metrics:
  - value: "2h → 10 min"
    label: Post-event prep
  - value: "1h → 1–2 min"
    label: CRM handoff
  - value: Richer context
    label: Voice vs. typing under pressure
brief:
  heading: The brief
  body: |
    The brief was not "build another networking app." It was tighter than that.

    - Make contact capture fast.
    - Make it feel low-profile in the middle of a conversation.
    - Do not force users to type under pressure.
    - Make the data usable after the event, not trapped in the app.

    That meant the UX had to protect momentum. Every extra field, tap, or decision was friction.
problem:
  heading: The problem
  body: |
    Conference networking is messy by default. People exchange cards, move to the next conversation, and trust memory to do the rest later. That usually breaks.

    Photos of cards end up in one place. Voice notes live somewhere else. Details get lost. CRM entry becomes a separate task. By the time the event is over, the best context is already fading.

    The key insight was simple: users do not have time for admin in the moment. Sometimes they barely have time to take out the phone, scan the card, and say one thing before the next conversation starts.
insightQuote: "Users do not have time for admin in the moment. Sometimes they barely have time to take out the phone, scan the card, and say one thing before the next conversation starts."
insightAttr: Key insight
principles:
  heading: Four principles to design around
  items:
    - number: "1"
      title: Capture first. Organize later.
      body: The first job is to save the contact and the context before they disappear.
    - number: "2"
      title: One clear next action.
      body: In a rushed setting, the interface cannot ask users to think twice.
    - number: "3"
      title: Use the fastest native behavior.
      body: Taking a picture and speaking a note are faster than typing into forms.
    - number: "4"
      title: Reduce the work after the event.
      body: The product only works if it saves time later, not just during capture.
process:
  heading: How it came together
  items:
    - number: "01"
      title: Start with the real moment of use
      body: I began by framing the actual context. Users were not sitting at a desk. They were standing at booths, moving between talks, or speaking to the next person in line. Their attention span was measured in seconds. That changed the product immediately — the app could not behave like a traditional form flow.
    - number: "02"
      title: Reduce the core flow to two actions
      body: The main action is scanning a business card. The phone camera opens immediately. OCR reads the card and maps the details into structured fields automatically. The second action is recording a voice note. In one quick flow, users capture the card, the context, and a structured record ready for export or CRM sync.
    - number: "03"
      title: Prove the workflow in low-fi before polishing
      body: Before moving into high-fi design, I built a working low-fi prototype using Figma Make, connected a Supabase database, and deployed it on Vercel so the client and early users could test the actual flow. We were not asking people whether they liked screens. We were checking whether the product really worked in a realistic situation.
    - number: "04"
      title: Move to high-fi only after the behavior worked
      body: Only after the core interaction proved useful did I apply high-fi design. At that point, the goal was not decoration — it was clarity. I tightened the hierarchy, reduced hesitation, and made the two core actions feel obvious and calm. The visual layer came after the workflow made sense.
    - number: "05"
      title: Iterate from the first real friction point
      body: The first major friction was not capture — it was organization. Users liked the speed, but wanted to sort contacts by conference or group. Instead of tagging every contact during capture, I designed a session-based grouping model — users set the current conference once, and every new capture inherits that context automatically.
decisions:
  items:
    - title: Make scanning the primary action
      body: The app opens with the fastest high-value action, not a dashboard. That reduces time to first success and eliminates the cognitive overhead of choosing where to start.
    - title: Use OCR to remove manual entry
      body: Users should not retype a business card they already have in front of them. OCR reads the card and maps it into structured fields automatically — the contact is created before the next conversation begins.
    - title: Use voice instead of typing for context
      body: Typing notes in a crowded event setting is awkward, slow, and socially visible. Speaking is faster, more natural, and fits the rhythm of the moment. The app transcribes and attaches the note automatically.
    - title: Keep the product open to downstream systems
      body: The value of the app is not just capture. It is clean handoff into tools like HubSpot, Salesforce, Airtable, or CSV export. A captured contact that stays locked inside the app is only half the job done.
validation:
  heading: How it was tested
  body: |
    I validated two things.

    First, I compared how much useful context users captured during the event with and without the app. The focus was on note richness, remembered details, and how usable the captured information was afterward.

    Second, I measured how much desk work remained after the event — a timed before-and-after comparison of the post-conference sorting, structuring, and CRM handoff process.

    The testing group was small and early, so I treat the results as directional. But the signal was strong.
outcomes:
  heading: The clearest win was work removed, not just speed gained
  metrics:
    - value: "2h → 10 min"
      label: Post-conference sorting and CRM preparation
    - value: "1h → 1–2 min"
      label: CRM handoff with sync and review
    - value: Richer notes
      label: Users captured more context via voice than memory or typing
  quotes:
    - "It feels smooth and intuitive in the background."
    - "It doesn't look like I'm wasting time on my phone."
reflection:
  pull: When time and attention are limited, UX has to remove thinking before it adds features.
  body: |
    ConCap reinforced a simple rule: the product's job in the moment is not to be clever. It is to get out of the way.

    The strongest decision was reducing the experience to two core actions and testing that behavior early in a live prototype. That kept the work honest. It made every later design decision easier, because the product had already proven its value before the visual polish began.
nextSteps:
  heading: What comes next
  body: |
    The next product layer is not more capture. It is better organization and follow-through.

    The first step is session-based grouping by conference, audience, or client segment. From there, the product can support stronger filtering, cleaner segmented exports, and a more structured handoff into sales workflows.

    The key is to add that structure without slowing the core capture flow. Speed remains the product.
testimonial:
  quote: "Placeholder — add the real client quote before launch. Keep it concrete: mention the process, the speed of learning, and the value of testing the real flow before over-investing in polish."
  author: "— Client name, role"
---
