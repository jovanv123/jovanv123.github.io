---
# ============================================================
#  PORTFOLIO CONFIG — Jovan Vasić
#  Direction: dark "lab" layout (ref: datameister.ai) —
#  text-led, hairline rules, area/topic listings, text links.
#  Leave a field as "" to hide it. TODO = fill in.
# ============================================================

site:
  title: "Jovan Vasić — Robotics"
  description: "Mechatronics engineer working on robot perception, manipulation and embedded control. MSc MRBE at TUM."
  url: ""                         # TODO: https://jovanvasic.dev or similar
  language: "en"
  favicon: "assets/favicon.svg"
  og_image: "assets/og-image.png" # 1200x630

# ------------------------------------------------------------
#  STYLING
# ------------------------------------------------------------
theme:
  reference: "https://datameister.ai"
  mode: "dark"                    # dark-first; light optional later
  layout: "single-page"           # home is one page...
  project_pages: true             # ...each project gets /projects/<slug>
  max_width: "1100px"
  border_radius: "0"              # sharp everywhere
  borders: "1px hairline"         # rules between sections/items, no boxes
  shadows: false
  spacing_scale: "spacious"
  animations: false               # at most: fade-in on load, nothing on scroll
  cursor_effects: false

colors:
  dark:
    background: "#0A0A0A"
    surface:    "#0A0A0A"         # same as background — no cards
    text:       "#EDEDED"
    muted:      "#8A8A8A"
    accent:     "#4169E1"         # ONE accent: links on hover, status dot
    border:     "#262626"
  light:
    background: "#FAFAFA"
    surface:    "#FAFAFA"
    text:       "#111111"
    muted:      "#6B6B6B"
    accent:     "#E04E10"
    border:     "#E5E5E5"

typography:
  heading_font: "Geist"
  body_font:    "Geist"
  mono_font:    "Geist Mono"      # tags, dates, metadata, status line
  base_size:    "17px"
  heading_weight: 500             # large size, medium weight
  line_height:  1.6

# ------------------------------------------------------------
#  NAVIGATION — plain text links, no button CTA
# ------------------------------------------------------------
nav:
  logo_text: "Jovan Vasić"
  sticky: true
  links:
    - { label: "Work",       href: "#projects" }
    - { label: "Focus",      href: "#focus" }
    - { label: "Experience", href: "#experience" }
    - { label: "CV",         href: "assets/cv.pdf" }
    - { label: "Contact",    href: "#contact" }

# ------------------------------------------------------------
#  CONTENT
# ------------------------------------------------------------
profile:
  name: "Jovan Vasić"
  role: "Mechatronics / Robotics Engineer"
  location: "Munich, DE"
  photo: ""                       # optional; this layout works without one
  email: ""                       # TODO
  cv: "assets/cv.pdf"
  status: "MSc MRBE @ TUM · open to HiWi & research positions"   # mono line with accent dot

hero:
  headline: "Robot perception, manipulation & control"
  rule: true                      # hairline under headline
  lede: "From multi-camera perception and force-controlled insertion on industrial arms to bare-metal control loops on competition robots."
  link: { label: "Get in touch →", href: "#contact" }   # text link, not a button

focus:                            # area / description / topics
  heading: "Focus"
  items:
    - title: "Perception"
      text: "Segmentation-based object localization, multi-camera triangulation and pose estimation for manipulation."
      topics: ["YOLO", "Multi-view geometry", "OpenCV", "ArUco"]
    - title: "Manipulation & Control"
      text: "Contact-rich assembly with impedance control and force/torque feedback, developed in simulation and transferred to real cells."
      topics: ["ROS 2", "Gazebo", "Impedance control", "F/T sensing"]
    - title: "Embedded Systems"
      text: "Real-time control loops, motion profiling and actuator drivers on microcontrollers; ML deployment on edge hardware."
      topics: ["STM32", "C", "PID", "TFLite Micro"]

projects:
  heading: "Selected work"
  layout: "list"                  # full-width rows separated by rules
  items:
    - title: "Autonomous Cable Insertion"
      slug: "cable-insertion"
      context: "Intrinsic AI for Industry Challenge · Bachelor's thesis"
      year: 2026
      result: "4th of 160+ teams, qualifying round"
      summary: "Team lead. Full autonomy pipeline for inserting SFP and SC connectors: YOLO segmentation across three wrist cameras, SVD/DLT triangulation, PCA orientation estimation and impedance-controlled insertion on a UR5e. Transferred to a real xArm7 cell. Paper in preparation."
      media: "media/cable-insertion.mp4"          # TODO: short loop, <3 MB
      tags: ["ROS 2", "Gazebo", "YOLOv11", "Python", "UR5e", "xArm7"]
      repo_url: ""
      paper_url: ""
      featured: true
    - title: "Eurobot Competition Robots"
      slug: "eurobot"
      context: "Eurobot · 3 seasons"
      year: 2026
      result: ""                                  # TODO: placement if relevant
      summary: "Software lead for two mirrored differential-drive robots. STM32H7 low-level control in C — 1 kHz PID and odometry, trapezoidal velocity profiles, concurrent FSMs — with a Raspberry Pi 5 strategy and ArUco vision layer over UART. Previous season: trained the game-element recognition model for dynamic strategy."
      media: "media/eurobot.mp4"                  # TODO
      tags: ["STM32H7", "C", "Raspberry Pi", "OpenCV", "FSM"]
      repo_url: ""
      featured: true
    - title: "Edge-AI Thermostat"
      slug: "edge-thermostat"
      context: "RT-RK internship"
      year: 2025
      result: ""
      summary: "Trained and compared regression and neural network models predicting room setpoint temperature from user input data; deployed the best model on an ESP32 with TensorFlow Lite."
      media: ""
      tags: ["TensorFlow Lite", "ESP32", "Python"]
      repo_url: ""
      featured: false

experience:
  heading: "Experience"
  items:
    - role: "Software Lead"
      company: "Eurobot team, FTN Novi Sad"
      company_url: ""
      start: "2023-09"
      end: "present"
      points:
        - "2025–: low-level control and full software architecture (STM32 + Raspberry Pi)."
        - "2024–25: computer vision for game-element recognition and dynamic strategy."
        - "2023–24: mechanical assembly."
    - role: "Embedded Software Intern (Edge AI)"
      company: "RT-RK"
      company_url: ""
      start: "2025-05"
      end: "2025-07"
      points:
        - "ML model selection and TFLite deployment on ESP32 for a smart thermostat."
    - role: "Computer Vision Intern"
      company: "DunavNET"
      company_url: ""
      start: "2024-08"
      end: "2024-10"
      points:
        - "TODO: one line on what you built."

education:
  heading: "Education"
  items:
    - degree: "MSc Mechatronics, Robotics and Biomedical Engineering"
      school: "Technical University of Munich"
      start: "2026"
      end: "present"
      note: ""
    - degree: "BSc Mechatronics"
      school: "Faculty of Technical Sciences, University of Novi Sad"
      start: "2021"
      end: "2026"
      note: "GPA 8.70/10 · Ministry of Education scholarship for gifted students (2022–23)"

skills:
  heading: "Tools"
  display: "list"                 # plain grouped text, mono; no chips/bars
  groups:
    - name: "Robotics"
      items: ["ROS 2", "Gazebo", "Intrinsic Flowstate", "UR / xArm"]
    - name: "Languages"
      items: ["Python", "C", "C++"]          # TODO: verify
    - name: "Perception / ML"
      items: ["YOLO", "OpenCV", "PyTorch", "TensorFlow Lite"]   # TODO: verify
    - name: "Embedded / Infra"
      items: ["STM32", "Raspberry Pi", "ESP32", "Docker", "Linux", "LaTeX"]

contact:
  heading: "Contact"
  message: ""
  show_form: false                # email link is enough
  show_email: true

socials:
  github:   ""                    # TODO
  linkedin: ""                    # TODO
  scholar:  ""                    # once the paper is out
  youtube:  ""                    # optional, for long demo videos

footer:                           # multi-column, like the reference
  columns:
    - { heading: "About",    text: "Mechatronics engineer. Munich, DE." }
    - { heading: "Contact",  text: "" }       # email
    - { heading: "Elsewhere", text: "" }      # GitHub · LinkedIn
  text: "© 2026 Jovan Vasić"
  show_back_to_top: false

analytics:
  provider: ""                    # plausible | umami | ""
  id: ""
---

<!--
  PAGE COPY — DRAFT. Rewrite in your own words; keep it short.
  Each "##" heading maps to the section id above.
-->

## About

Mechatronics engineer, now doing an MSc in Mechatronics, Robotics and
Biomedical Engineering at TUM. My work sits between perception and
control: getting a robot to see a part precisely enough, then handle
contact with it reliably.

TODO: one line on what you want to work on next, one human line.

## Projects

### Autonomous Cable Insertion — case study

**Problem:** TODO — why connector insertion is hard (tolerances, occlusion, contact).

**My role:** Team lead; perception pipeline and insertion policy.

**Approach:** Two tracks — stereo 2D segmentation + 3D reconstruction vs.
direct 3D estimation. Impedance control with F/T feedback for the insertion phase.
Simulation in Gazebo and Intrinsic Flowstate; transfer to a real xArm7 cell
with RGB cameras.

**Result:** 4th of 160+ teams in qualifying. Direct 3D estimation outperformed
the reconstruction approach. TODO: success rate / timing numbers.

### Eurobot — case study

**Problem:** TODO

**My role:** Software lead.

**Approach:** TODO — control architecture diagram (Mermaid), FSM design.

**Result:** TODO
