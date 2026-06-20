/* ============================================================
   NEUROS — Cognitive Operating System (concept site)
   Vanilla JS: neural canvas, boot sequence, live console,
   counters, scroll reveals, waitlist.
   ============================================================ */

/* ---------- 1. Neural network background canvas ---------- */
(function neuralCanvas() {
  const canvas = document.getElementById("neural-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let w, h, nodes = [];
  const mouse = { x: -9999, y: -9999 };
  const COUNT = () => Math.min(90, Math.floor((w * h) / 16000));

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    nodes = [];
    const n = COUNT();
    for (let i = 0; i < n; i++) {
      nodes.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.6 + 0.6,
        pulse: Math.random() * Math.PI * 2,
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    // links
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 130) {
          const alpha = (1 - dist / 130) * 0.5;
          ctx.strokeStyle = `rgba(120, 180, 255, ${alpha})`;
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }
    // nodes
    for (const node of nodes) {
      node.pulse += 0.03;
      const md = Math.hypot(node.x - mouse.x, node.y - mouse.y);
      const near = md < 160;
      const glow = near ? 1 - md / 160 : 0;
      const radius = node.r + Math.sin(node.pulse) * 0.4 + glow * 2.2;
      ctx.beginPath();
      ctx.arc(node.x, node.y, Math.max(0.4, radius), 0, Math.PI * 2);
      ctx.fillStyle = near
        ? `rgba(106, 227, 255, ${0.6 + glow * 0.4})`
        : "rgba(150, 170, 230, 0.55)";
      ctx.fill();

      // drift + gentle attraction toward cursor
      node.x += node.vx + (near ? (mouse.x - node.x) * 0.0008 : 0);
      node.y += node.vy + (near ? (mouse.y - node.y) * 0.0008 : 0);
      if (node.x < 0 || node.x > w) node.vx *= -1;
      if (node.y < 0 || node.y > h) node.vy *= -1;
    }
    if (!reduce) requestAnimationFrame(draw);
  }

  window.addEventListener("resize", resize);
  window.addEventListener("mousemove", (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });
  window.addEventListener("mouseout", () => { mouse.x = -9999; mouse.y = -9999; });
  resize();
  draw();
})();

/* ---------- 2. Boot sequence ---------- */
(function bootSequence() {
  const boot = document.getElementById("boot");
  const log = document.getElementById("boot-log");
  const progress = document.getElementById("boot-progress");
  if (!boot) return;

  const lines = [
    "initializing cognitive kernel ...",
    "mounting <b>hippocampus</b> — associative memory ... ok",
    "mounting <b>cortex</b> — reasoning core ........... ok",
    "mounting <b>amygdala</b> — salience engine ....... ok",
    "mounting <b>cerebellum</b> — reflex automation ... ok",
    "calibrating synaptic weights ...",
    "establishing neuro-symbiotic link ...",
    "<b>NEUROS online.</b> welcome back.",
  ];

  let i = 0;
  let finished = false;

  function finish() {
    if (finished) return;
    finished = true;
    boot.classList.add("done");
    document.body.style.overflow = "";
    startCounters();
  }

  function step() {
    if (i >= lines.length) { progress.style.width = "100%"; setTimeout(finish, 450); return; }
    log.innerHTML += lines[i] + "\n";
    progress.style.width = ((i + 1) / lines.length) * 100 + "%";
    i++;
    setTimeout(step, 280 + Math.random() * 220);
  }

  document.body.style.overflow = "hidden";
  setTimeout(step, 400);

  document.addEventListener("keydown", (e) => { if (e.key === "Escape") finish(); });
  boot.addEventListener("click", finish);

  // expose for counters
  window.__startCounters = startCounters;
  let countersRan = false;
  function startCounters() {
    if (countersRan) return;
    countersRan = true;
    animateCount("stat-synapses", 86_000_000_000, "B", 1600);
    animateCount("stat-latency", 12, "", 1200);
  }
})();

/* ---------- 3. Animated counters ---------- */
function animateCount(id, target, suffix, dur) {
  const el = document.getElementById(id);
  if (!el) return;
  const start = performance.now();
  function fmt(v) {
    if (suffix === "B") return (v / 1e9).toFixed(1) + "B";
    return Math.round(v).toString() + suffix;
  }
  function tick(now) {
    const p = Math.min(1, (now - start) / dur);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = fmt(target * eased);
    if (p < 1) requestAnimationFrame(tick);
    else el.textContent = fmt(target);
  }
  requestAnimationFrame(tick);
}

/* ---------- 4. Scroll reveals ---------- */
(function reveals() {
  const items = document.querySelectorAll("[data-reveal], .region");
  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("in"));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e, idx) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add("in"), idx * 90);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.18 });
  items.forEach((el) => io.observe(el));
})();

/* ---------- 4b. Scroll progress + active nav ---------- */
(function scrollUI() {
  const bar = document.getElementById("scroll-progress");
  const links = Array.from(document.querySelectorAll(".nav__links a"));
  const sections = links
    .map((a) => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);

  function onScroll() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
    if (bar) bar.style.width = pct + "%";

    // active section
    let current = sections[0];
    for (const sec of sections) {
      if (sec.getBoundingClientRect().top <= window.innerHeight * 0.4) current = sec;
    }
    links.forEach((a) => {
      a.classList.toggle("active", current && a.getAttribute("href") === "#" + current.id);
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();

/* ---------- 5. Interactive cognitive console ---------- */
(function console_() {
  const body = document.getElementById("terminal-body");
  const input = document.getElementById("terminal-input");
  if (!body || !input) return;

  const history = [];
  let hIdx = 0;

  function print(html, cls) {
    const div = document.createElement("div");
    div.className = "line " + (cls || "out");
    div.innerHTML = html;
    body.appendChild(div);
    body.scrollTop = body.scrollHeight;
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"]/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])
    );
  }

  // Send a prompt to the real AI cortex (the Node backend) and stream the
  // reply into the terminal token-by-token. Falls back gracefully when no
  // backend is reachable (e.g. the static GitHub-hosted version).
  async function askCortex(promptText) {
    const line = document.createElement("div");
    line.className = "line out";
    line.innerHTML = "<span class='region-tag'>[cortex]</span> ";
    const span = document.createElement("span");
    line.appendChild(span);
    body.appendChild(line);
    body.scrollTop = body.scrollHeight;

    // Opened directly as a file:// — there is no server to call.
    if (location.protocol === "file:") {
      span.innerHTML =
        "static mode — I'm running without my reasoning core. Start the local server " +
        "(<b>npm start</b>, see README) to talk to the real AI. For now, on “" +
        escapeHtml(promptText) +
        "”: I'd frame the goal, gather signals, decide, then act.";
      return;
    }

    // Typing indicator while we wait for the first token.
    let dots = 0;
    span.textContent = "thinking";
    const ticker = setInterval(() => {
      dots = (dots + 1) % 4;
      span.textContent = "thinking" + ".".repeat(dots);
    }, 350);

    try {
      const resp = await fetch("/api/cortex", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: promptText }),
      });
      if (!resp.ok || !resp.body) throw new Error("HTTP " + resp.status);

      clearInterval(ticker);
      span.textContent = "";
      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        span.textContent += decoder.decode(value, { stream: true });
        body.scrollTop = body.scrollHeight;
      }
    } catch (e) {
      clearInterval(ticker);
      span.innerHTML =
        "<span class='err'>cortex offline</span> — is the server running? (" +
        escapeHtml(e.message) +
        ")";
    }
  }

  const regionReply = {
    remember: ["<span class='region-tag'>[hippocampus]</span> indexing memory… linked to 3 related threads. I'll resurface it when context matches."],
    think:    ["<span class='region-tag'>[cortex]</span> reasoning… here's a plan: 1) frame the goal, 2) gather signals, 3) decide, 4) act. Want me to run it?"],
    focus:    ["<span class='region-tag'>[amygdala]</span> salience locked. Muting 14 low-priority signals. Protecting focus for 25 min."],
    automate: ["<span class='region-tag'>[cerebellum]</span> pattern detected (seen 3×). Converting to reflex — it'll now run without being asked."],
  };

  const commands = {
    help() {
      print(
        "available commands:\n" +
        "  <b>help</b>      — show this list\n" +
        "  <b>regions</b>   — list the four cognitive regions\n" +
        "  <b>remember</b> &lt;thing&gt;  — store an associative memory\n" +
        "  <b>ask</b> &lt;question&gt;    — talk to the real AI cortex 🤖\n" +
        "  <b>think</b> &lt;goal&gt;       — ask the cortex to reason 🤖\n" +
        "  <b>focus</b>     — engage the salience engine\n" +
        "  <b>automate</b>  — turn a habit into reflex\n" +
        "  <b>status</b>    — system vitals\n" +
        "  <b>sync</b>      — re-sync the neuro-symbiotic link\n" +
        "  <b>whoami</b>    — who NEUROS thinks you are\n" +
        "  <b>clear</b>     — wipe the screen"
      );
    },
    status() {
      print(
        "<b>NEUROS vitals</b>\n" +
        "  cortex ......... <b>online</b>   load 31%\n" +
        "  hippocampus .... <b>online</b>   142,884 memories\n" +
        "  amygdala ....... <b>online</b>   focus shield up\n" +
        "  cerebellum ..... <b>online</b>   17 active reflexes\n" +
        "  thought latency  <b>12 ms</b>"
      );
    },
    sync() {
      print("re-syncing neuro-symbiotic link ... <b>100%</b>. you and the machine are in phase.");
    },
    sudo() {
      print("<span class='err'>permission denied:</span> you can't sudo a mind. ask it nicely instead. 🧠");
    },
    regions() {
      print(
        "<span class='region-tag'>hippocampus</span> · memory & recall\n" +
        "<span class='region-tag'>cortex</span> · reasoning & language\n" +
        "<span class='region-tag'>amygdala</span> · salience & priority\n" +
        "<span class='region-tag'>cerebellum</span> · reflex & automation"
      );
    },
    remember(arg) {
      print(regionReply.remember[0] + (arg ? `\n  stored: “${arg}”` : ""));
    },
    think(arg) {
      return askCortex(arg || "Give me a goal to reason about.");
    },
    ask(arg) {
      return askCortex(arg || "Ask me anything.");
    },
    focus() { print(regionReply.focus[0]); },
    automate() { print(regionReply.automate[0]); },
    whoami() {
      print("you are <b>operator-01</b> — a mind currently borrowing a machine. NEUROS exists to close that gap.");
    },
    clear() { body.innerHTML = ""; },
  };

  function run(raw) {
    const text = raw.trim();
    if (!text) return;
    print(text, "in");
    history.push(text); hIdx = history.length;
    const [cmd, ...rest] = text.split(/\s+/);
    const fn = commands[cmd.toLowerCase()];
    if (fn) fn(rest.join(" "));
    else print(`unknown command: <b>${cmd}</b> — try <b>help</b>`, "err");
  }

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") { run(input.value); input.value = ""; }
    else if (e.key === "ArrowUp") { if (hIdx > 0) { hIdx--; input.value = history[hIdx] || ""; } e.preventDefault(); }
    else if (e.key === "ArrowDown") { if (hIdx < history.length) { hIdx++; input.value = history[hIdx] || ""; } e.preventDefault(); }
  });
  body.addEventListener("click", () => input.focus());

  // greeting
  setTimeout(() => commands.help(), 1200);
})();

/* ---------- 6. Waitlist ---------- */
(function waitlist() {
  const form = document.getElementById("waitlist-form");
  const email = document.getElementById("waitlist-email");
  const msg = document.getElementById("waitlist-msg");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const val = (email.value || "").trim();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(val)) {
      msg.style.color = "#ff7a7a";
      msg.textContent = "that doesn't look like a valid signal. try again.";
      return;
    }
    // Concept build: store locally so it persists between visits.
    try {
      const list = JSON.parse(localStorage.getItem("neuros_waitlist") || "[]");
      list.push({ email: val, at: new Date().toISOString() });
      localStorage.setItem("neuros_waitlist", JSON.stringify(list));
    } catch (_) {}
    msg.style.color = "";
    msg.textContent = "⚡ synaptic link reserved. you're #" +
      (Math.floor(Math.random() * 400) + 100) + " in the neuro-beta.";
    form.reset();
  });
})();
