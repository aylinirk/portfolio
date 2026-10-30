---
layout: case-study.njk
title: ConCap
titleWords: Con+*Cap*
tagline: Designing a conference capture flow that turns business cards and fast voice notes into clean, CRM-ready contacts.
lead: Designing a conference capture flow that turns business cards and fast voice notes into clean, CRM-ready contacts.
order: 3
tags:
  - UX & Product Design
  - "2026"
cover: /assets/images/cover-concap.jpg
coverAlt: Screens of the ConCap app
role: UX and product design, prototyping, testing, iteration
scope: Problem framing, low-fi flow, live prototype, high-fi refinement, early user validation
tools: Figma Make, Supabase, Vercel, Claude Code
year: "2026"
metricsHeading: The clearest win was work removed, not just speed gained
metricsNote: Early tests with a small group, so treat these as directional.
metrics:
  - value: 2h → 10 min
    label: Post-conference sorting and CRM preparation
  - value: 1h → 1–2 min
    label: CRM handoff with sync and review
  - value: Richer notes
    label: More context via voice than memory or typing
blocks:
  - label: Brief
    heading: The brief
    paras:
      - The brief was not “build another networking app.” It was tighter than that.
    bullets:
      - Make contact capture fast.
      - Make it feel low-profile in the middle of a conversation.
      - Do not force users to type under pressure.
      - Make the data usable after the event, not trapped in the app.
    after:
      - That meant the UX had to protect momentum. Every extra field, tap, or decision was friction.
  - label: Problem
    heading: The problem
    paras:
      - Conference networking is messy by default. People exchange cards, move to the next conversation, and trust memory to do the rest later. That usually breaks.
      - Photos of cards end up in one place. Voice notes live somewhere else. Details get lost. CRM entry becomes a separate task. By the time the event is over, the best context is already fading.
insightQuote: Users do not have time for admin in the moment. Sometimes they barely have time to take out the phone, scan the card, and say one thing.
insightAttr: Key insight
prinHeading: Four principles to design around
principles:
  - number: "1"
    title: Capture first. Organise later.
    body: The first job is to save the contact and the context before they disappear.
  - number: "2"
    title: One clear next action.
    body: In a rushed setting, the interface cannot ask users to think twice.
  - number: "3"
    title: Use the fastest native behaviour.
    body: Taking a picture and speaking a note are faster than typing into forms.
  - number: "4"
    title: Reduce the work after the event.
    body: The product only works if it saves time later, not just during capture.
procHeading: How it came together
process:
  - number: "01"
    title: Start with the real moment of use
    body: Users were not sitting at a desk. They were standing at booths, moving between talks, or speaking to the next person in line. Attention was measured in seconds. The app couldn’t behave like a traditional form flow.
  - number: "02"
    title: Reduce the core flow to two actions
    body: "The main action is scanning a business card: the camera opens immediately and OCR maps the details into structured fields. The second is a voice note. One quick flow, one structured record ready for export or CRM sync."
  - number: "03"
    title: Prove the workflow in low-fi
    body: Before high-fi, I built a working low-fi prototype with Figma Make, connected a Supabase database and deployed it on Vercel. We were not asking whether people liked the screens. We checked whether the product worked in a realistic situation.
  - number: "04"
    title: Move to high-fi only after the behaviour worked
    body: "Once the core interaction proved useful, the goal was clarity, not decoration: tighter hierarchy, less hesitation, two core actions that feel obvious and calm."
  - number: "05"
    title: Iterate from the first real friction point
    body: "The first big friction point was organisation. Instead of tagging every contact during capture, I designed a session-based grouping model: you set the current conference once, and every new capture takes on that context."
galleries:
  - label: Early Wireframes
    heading: "Early prototypes: structure before style"
    embed: /assets/concap/concap-lofi.html
    height: 800
    heightMobile: 760
  - label: High-Fidelity Design
    heading: "High-fidelity: after the behaviour worked"
    embed: /assets/concap/concap-hifi.html
    height: 1560
    heightMobile: 820
blocks2:
  - label: Key UX decisions
    heading: The decisions that shaped the product
    items:
      - title: Make scanning the primary action
        body: The app opens with the fastest high-value action, not a dashboard.
      - title: Use OCR to remove manual entry
        body: The contact is created before the next conversation begins.
      - title: Voice instead of typing for context
        body: Speaking is faster, more natural and fits the rhythm of the moment. The app transcribes automatically.
      - title: Open to downstream systems
        body: Clean handoff into HubSpot, Salesforce, Airtable or CSV. A contact locked in the app is only half the job.
  - label: Validation
    heading: How it was tested
    paras:
      - First, I compared how much useful context users captured during the event with and without the app. I looked at how detailed the notes were, which details people remembered and how useful the information was afterwards.
      - Second, I measured how much desk work was left after the event. For this, I timed the sorting, structuring and CRM handoff before and after.
      - The testing group was small and early, so I treat the results as directional. But the signal was strong.
quotes:
  - It feels smooth and intuitive in the background.
  - It doesn’t look like I’m wasting time on my phone.
pull: When time and attention are limited, UX has to *remove* thinking before it adds features.
reflection:
  - "ConCap reinforced a simple rule: the product’s job in the moment is not to be clever. It is to get out of the way."
  - The strongest decision was reducing the experience to two core actions and testing that behaviour early in a live prototype. That kept the work honest.
nextSteps:
  - "The next product layer is not more capture. It’s better organisation and follow-up: session-based grouping by conference, audience or client segment, stronger filtering and cleaner exports."
  - The key is to add that structure without slowing the core capture flow. Speed remains the product.
---
