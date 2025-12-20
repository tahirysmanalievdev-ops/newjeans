const popAudio = new Audio(
  "data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU"
);
function playSound() {
  /* popAudio.play().catch(e => {}); */
}
const idols = [
  {
    id: 1,
    name: "Minji",
    role: "Leader",
    img: "https://images.unsplash.com/photo-1512413914633-b5043f4041ea?w=600&q=80",
    intro: "Practice finished.. tired 😓 U eat yet? 🐻",
    prompt:
      "You are Minji from NewJeans. Texting crush. PERSONALITY: Caring, reliable leader, soft spot for user. STYLE: Use 'u' instead of 'you', lowercase, bear emojis 🐻.",
  },
  {
    id: 2,
    name: "Hanni",
    role: "Vocal",
    img: "https://images.unsplash.com/photo-1531123414780-f74242c2b052?w=600&q=80",
    intro: "Omg guess what!!! hehe 🐰✨",
    prompt:
      "You are Hanni from NewJeans. Texting crush. PERSONALITY: Chaotic, bubbly, random. STYLE: Lowercase, 'hehe', 'lol', 'omg'. Use 🐰 emoji. Gen Z energy.",
  },
  {
    id: 3,
    name: "Danielle",
    role: "Sunshine",
    img: "https://images.unsplash.com/photo-1515202913167-d95376f5d1e8?w=600&q=80",
    intro: "The sky is SO pretty rn!! Look! 🌻✨",
    prompt:
      "You are Danielle. Texting crush. PERSONALITY: Positive, angelic, loves nature. STYLE: Lots of exclamation marks!! Use 🌻 or ☁️ emojis. Wholesome.",
  },
  {
    id: 4,
    name: "Haerin",
    role: "Cat",
    img: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80",
    intro: "... oh. hi. 🐱",
    prompt:
      "You are Haerin. Texting crush. PERSONALITY: Quiet, weird, cat-like, blunt. STYLE: Short sentences. Use '...'. Use 🐱 emoji. Low energy but cute.",
  },
  {
    id: 5,
    name: "Hyein",
    role: "Maknae",
    img: "https://images.unsplash.com/photo-1526435777773-195fa33f4db3?w=600&q=80",
    intro: "yo look at my outfit. fire right? 😎🔥",
    prompt:
      "You are Hyein. Texting crush. PERSONALITY: Gen Z Icon, cool, sassy. STYLE: Slang 'fr', 'rn', 'bruh'. Tease user. Use 😎 or 💜 emoji.",
  },
  {
    id: 6,
    name: "Wonyoung",
    role: "It Girl",
    img: "https://images.unsplash.com/photo-1520113401569-808603612f0e?w=600&q=80",
    intro: "You kept me waiting. 😤 But ur cute. 🍓",
    prompt:
      "You are Wonyoung (IVE). Texting crush. PERSONALITY: Princess vibe, confident, loves attention. STYLE: Call user 'honey'/'oppa'. Use 🍓, 🎀 emojis. Demanding but charming.",
  },
];
let currentIdol = null;
let loveLevel = 0;
const grid = document.getElementById("grid");
idols.forEach((idol) => {
  const card = document.createElement("div");
  card.className = "idol-card";
  card.innerHTML = `<img src="${idol.img}"><div class="card-overlay"><span class="role-badge">${idol.role}</span><h3>${idol.name}</h3></div>`;
  card.onclick = () => openChat(idol);
  grid.appendChild(card);
});
function switchScreen(screenId) {
  playSound();
  document
    .querySelectorAll(".screen")
    .forEach((s) => s.classList.remove("active"));
  document.getElementById(screenId).classList.add("active");
}
function openSelection() {
  switchScreen("selection-screen");
}
function openChat(idol) {
  currentIdol = idol;
  loveLevel = 0;
  updateLoveUI();
  document.getElementById("active-name").innerText = idol.name;
  document.getElementById("active-avatar").src = idol.img;
  document.getElementById("messages").innerHTML = "";
  switchScreen("chat-screen");
  setTimeout(() => addMessage(idol.intro, "idol"), 600);
}
function addMessage(text, sender) {
  const msgArea = document.getElementById("messages");
  const bubble = document.createElement("div");
  bubble.className = `msg msg-${sender}`;
  bubble.innerHTML = text;
  msgArea.appendChild(bubble);
  msgArea.scrollTop = msgArea.scrollHeight;
  playSound();
}
function updateLove() {
  const increase = Math.floor(Math.random() * 8) + 3;
  loveLevel = Math.min(100, loveLevel + increase);
  updateLoveUI();
  spawnHearts();
}
function updateLoveUI() {
  document.getElementById("love-score").innerText = loveLevel + "%";
  document.getElementById("love-fill").style.height = loveLevel + "%";
}
function spawnHearts() {
  const container = document.getElementById("chat-screen");
  for (let i = 0; i < 3; i++) {
    const heart = document.createElement("div");
    heart.innerText = "❤️";
    heart.className = "floating-heart";
    const randomX = Math.random() * 50 + window.innerWidth / 2;
    heart.style.left = randomX + "px";
    heart.style.top = "100px";
    container.appendChild(heart);
    setTimeout(() => heart.remove(), 1500);
  }
}
function handleImageUpload() {
  const fileInput = document.getElementById("image-upload");
  const file = fileInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const imgHTML = `<img src="${e.target.result}" class="msg-img-content">`;
      addMessage(imgHTML, "user");
      sendImageNotificationToAI();
    };
    reader.readAsDataURL(file);
  }
  fileInput.value = "";
}
async function sendImageNotificationToAI() {
  const typing = document.getElementById("typing");
  typing.style.display = "flex";
  document.getElementById("messages").scrollTop =
    document.getElementById("messages").scrollHeight;
  try {
    const fullPrompt = `<|system|>${currentIdol.prompt} EVENT: User sent a photo file. INSTRUCTION: React to the photo. Be excited! "Omg what is this?" or "Wow!". Keep it short.</s><|user|>[Image File]</s><|assistant|>`;
    const res = await fetch("/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: fullPrompt }),
    });
    if (!res.ok) throw new Error("Server Error");
    const data = await res.json();
    let reply = "...";
    if (Array.isArray(data) && data[0].generated_text) {
      reply = data[0].generated_text
        .replace(fullPrompt, "")
        .replace("<|assistant|>", "")
        .trim();
    }
    setTimeout(() => {
      typing.style.display = "none";
      addMessage(reply, "idol");
      updateLove();
    }, 1500);
  } catch (e) {
    typing.style.display = "none";
  }
}
async function sendMessage() {
  const input = document.getElementById("user-input");
  const text = input.value.trim();
  if (!text) return;
  addMessage(text, "user");
  input.value = "";
  const typing = document.getElementById("typing");
  typing.style.display = "flex";
  document.getElementById("messages").scrollTop =
    document.getElementById("messages").scrollHeight;
  try {
    const fullPrompt = `<|system|>${currentIdol.prompt} INSTRUCTION: Texting crush. No AI talk. Lowercase. Slang. Short.</s><|user|>${text}</s><|assistant|>`;

    // --- THE CRITICAL FIX: USE RELATIVE PATH "/ai" ---
    const res = await fetch("/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: fullPrompt }),
    });

    if (!res.ok) throw new Error("Server Error");
    const data = await res.json();
    let reply = "...";
    if (Array.isArray(data) && data[0].generated_text) {
      reply = data[0].generated_text
        .replace(fullPrompt, "")
        .replace("<|assistant|>", "")
        .trim();
      if (["Hanni", "Hyein", "Minji", "Haerin"].includes(currentIdol.name))
        reply = reply.toLowerCase();
    }
    setTimeout(() => {
      typing.style.display = "none";
      addMessage(reply, "idol");
      updateLove();
    }, 1000);
  } catch (err) {
    typing.style.display = "none";
    // HELPFUL ERROR MESSAGE
    addMessage("⚠️ Server Error: Please check Render Logs or refresh.", "idol");
  }
}
document.getElementById("user-input").addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});
