---
tags: [skill-creator]
max_turns: 40
timeout_seconds: 1200
allowed_tools: [Read, Glob, Grep, Skill, Write, Edit, Bash]
---

We're building Forge Deck, a desktop app (Electron) for small 3D-printing shops. It monitors 6 printers: what each is printing, progress, temperatures, time left, failures, and the job queue. The owner wants it to feel like a sci-fi game cockpit with some cinematic 3D, because the shop shows it on a wall monitor. But the operators also use it all day at a desk to queue jobs and catch failed prints fast. Build the main window as one HTML file (it will run as the Electron renderer).
