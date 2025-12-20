// --- 1. SOUND & AUDIO ---
const popAudio = new Audio(
  "data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU"
);
function playSound() {
  /* popAudio.play().catch(e => {}); */
}

// --- 2. IDOL DATA ---
const idols = [
  {
    id: 1,
    name: "Minji",
    role: "Leader",
    img: "https://avatars.mds.yandex.net/i?id=f3f8ff0adc005e7a98eb493f24938441a0721792-10464870-images-thumbs&n=13",
    intro: "Practice finished... tired 😓 U eat yet? 🐻",
    prompt:
      "You are Minji from NewJeans. Texting crush. PERSONALITY: Caring, reliable leader, soft spot for user. STYLE: Use 'u' instead of 'you', lowercase, bear emojis 🐻.",
  },
  {
    id: 2,
    name: "Hanni",
    role: "Vocal",
    img: "https://avatars.mds.yandex.net/i?id=aab66fb375f0f8fd0b2af76da290dd3e3860b802-4079683-images-thumbs&n=13",
    intro: "Omg guess what!!! hehe 🐰✨",
    prompt:
      "You are Hanni from NewJeans. Texting crush. PERSONALITY: Chaotic, bubbly, random. STYLE: Lowercase, 'hehe', 'lol', 'omg'. Use 🐰 emoji. Gen Z energy.",
  },
  {
    id: 3,
    name: "Danielle",
    role: "Sunshine",
    img: " https://avatars.mds.yandex.net/i?id=7941032d8b02e491de0cf3f677f09d0a8e4d6cbd-8287477-images-thumbs&n=13",
    intro: "The sky is SO pretty rn!! Look! 🌻✨",
    prompt:
      "You are Danielle. Texting crush. PERSONALITY: Positive, angelic, loves nature. STYLE: Lots of exclamation marks!! Use 🌻 or ☁️ emojis. Wholesome.",
  },
  {
    id: 4,
    name: "Haerin",
    role: "Cat",
    img: "https://avatars.mds.yandex.net/i?id=ada055b0af43d8d4caa9660fde7f0633821937a7-16478704-images-thumbs&n=13",
    intro: "... oh. hi. 🐱",
    prompt:
      "You are Haerin. Texting crush. PERSONALITY: Quiet, weird, cat-like, blunt. STYLE: Short sentences. Use '...'. Use 🐱 emoji. Low energy but cute.",
  },
  {
    id: 5,
    name: "Hyein",
    role: "Maknae",
    img: " https://avatars.mds.yandex.net/i?id=32accdc305256e2ece5c50fa0b7cc4ffe3917828-10142109-images-thumbs&n=13",
    intro: "yo look at my outfit. fire right? 😎🔥",
    prompt:
      "You are Hyein. Texting crush. PERSONALITY: Gen Z Icon, cool, sassy. STYLE: Slang 'fr', 'rn', 'bruh'. Tease user. Use 😎 or 💜 emoji.",
  },
  {
    id: 6,
    name: "Wonyoung",
    role: "It Girl",
    img: "https://avatars.mds.yandex.net/i?id=5dc041923f0741d033e08eb8badf6bb8f6d1c131-5440253-images-thumbs&n=13",
    intro: "You kept me waiting. 😤 But ur cute. 🍓",
    prompt:
      "You are Wonyoung (IVE). Texting crush. PERSONALITY: Princess vibe, confident, loves attention. STYLE: Call user 'honey'/'oppa'. Use 🍓, 🎀 emojis. Demanding but charming.",
  },
];

let currentIdol = null;

// --- 3. INIT GRID ---
const grid = document.getElementById("grid");
idols.forEach((idol) => {
  const card = document.createElement("div");
  card.className = "idol-card";
  card.innerHTML = `<img src="${idol.img}"><div class="card-overlay"><span class="role-badge">${idol.role}</span><h3>${idol.name}</h3></div>`;
  card.onclick = () => openChat(idol);
  grid.appendChild(card);
});

// --- 4. NAVIGATION ---
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

// --- 5. CHAT LOGIC ---
function openChat(idol) {
  currentIdol = idol;
  document.getElementById("active-name").innerText = idol.name;
  document.getElementById("active-avatar").src = idol.img;
  document.getElementById("messages").innerHTML = "";
  switchScreen("chat-screen");
  setTimeout(() => addMessage(idol.intro, "idol"), 600);
  // ... inside openChat ...
  loveLevel = 0; // Reset
  updateLove(); // Update UI to 0%
  // ... rest of code
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

// --- 6. SEND MESSAGE (AI) ---
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
    const fullPrompt = `
            <|system|>
            ${currentIdol.prompt}
            INSTRUCTION: Texting crush. No AI talk. Lowercase. Slang. Short.
            </s>
            <|user|>
            ${text}
            </s>
            <|assistant|>
            `;

    const res = await fetch("http://127.0.0.1:5000/ai", {
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
    } else if (data.error) {
      reply = "Error: " + data.error;
    }

    setTimeout(() => {
      typing.style.display = "none";
      addMessage(reply, "idol");
      // ... inside sendMessage, after addMessage(reply, 'idol') ...

      updateLove(); // <--- ADD THIS to boost score
      maybeSendPhoto(currentIdol.name); // <--- ADD THIS for chance of photo

      // ... rest of code
    }, 1000);
  } catch (err) {
    typing.style.display = "none";
    addMessage("⚠️ Error: Check Python terminal.", "idol");
  }
}

document.getElementById("user-input").addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});
let loveLevel = 0;

function updateLove() {
  // Increase love by random amount (5-10%)
  const increase = Math.floor(Math.random() * 5) + 5;
  loveLevel = Math.min(100, loveLevel + increase);

  // Update UI
  document.getElementById("love-score").innerText = loveLevel + "%";
  document.getElementById("love-fill").style.height = loveLevel + "%";

  // Trigger Floating Hearts
  spawnHearts();
}

function spawnHearts() {
  const container = document.getElementById("chat-screen");
  for (let i = 0; i < 5; i++) {
    const heart = document.createElement("div");
    heart.innerText = "❤️";
    heart.className = "floating-heart";

    // Random Position near the love meter
    const randomX = Math.random() * 50 + (window.innerWidth - 80);
    const randomY = 50 + Math.random() * 50;

    heart.style.left = randomX + "px";
    heart.style.top = randomY + "px";

    container.appendChild(heart);

    // Remove after animation
    setTimeout(() => heart.remove(), 1500);
  }
}

// Optional: Simulate sending a photo
function maybeSendPhoto(idolName) {
  // 20% chance to send a photo
  if (Math.random() > 0.8) {
    const photos = [
      "https://avatars.mds.yandex.net/i?id=c4d35f0170d846b25b12f150cddde1a6a7b52400-5234452-images-thumbs&n=13",
      "https://avatars.mds.yandex.net/i?id=9433ea098234371a40c3fbbe73cb0017bed09069-5470361-images-thumbs&n=13",
      "https://avatars.mds.yandex.net/i?id=53136fef40da192507f7237802e93314655e1e88-5658631-images-thumbs&n=13",
      "https://avatars.mds.yandex.net/i?id=cbd8ce0baf291180c86560146897faada9357c01-5488408-images-thumbs&n=13",
    ];
    const randomPhoto = photos[Math.floor(Math.random() * photos.length)];

    setTimeout(() => {
      const msgArea = document.getElementById("messages");
      const bubble = document.createElement("div");
      bubble.className = `msg msg-idol msg-photo`;
      bubble.innerHTML = `<img src="${randomPhoto}" alt="Selfie">`;
      msgArea.appendChild(bubble);
      msgArea.scrollTop = msgArea.scrollHeight;
      playSound();
    }, 2000); // Sends shortly after the text
  }
}

// --- NEW FEATURE: HANDLE IMAGE UPLOAD ---
function handleImageUpload() {
  const fileInput = document.getElementById("image-upload");
  const file = fileInput.files[0];

  if (file) {
    const reader = new FileReader();

    // When file is read, show it in chat
    reader.onload = function (e) {
      const imageData = e.target.result;

      // 1. Display Image in User Chat Bubble
      // We use HTML inside the bubble
      const imgHTML = `<img src="${imageData}" class="msg-img-content">`;
      addMessage(imgHTML, "user"); // Note: addMessage needs to support HTML (see step 4)

      // 2. Trigger AI Response
      sendImageNotificationToAI();
    };

    reader.readAsDataURL(file);
  }
  // Reset input so you can select the same file again if needed
  fileInput.value = "";
}

async function sendImageNotificationToAI() {
  // Show typing
  const typing = document.getElementById("typing");
  typing.style.display = "flex";
  document.getElementById("messages").scrollTop =
    document.getElementById("messages").scrollHeight;

  try {
    // We tell the AI: "User sent a photo."
    // The AI will roleplay looking at it.
    const fullPrompt = `
        <|system|>
        ${currentIdol.prompt}
        EVENT: The user just sent you a photo file.
        INSTRUCTION: React to the photo.
        - If it's a selfie, compliment them! ("Omg is that you? So cute!!")
        - If it's food, say "Yummy!"
        - Or just ask "Omg what is this?? Let me see!"
        - Act like you are opening the file on your phone.
        - Keep it short.
        </s>
        <|user|>
        [Sent an Image File]
        </s>
        <|assistant|>
        `;

    // MAKE SURE TO ADD /ai AT THE END!
    // This automatically works on BOTH localhost and Render
    // THIS WORKS EVERYWHERE (Local & Cloud)
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
      updateLove(); // Sending photos increases love!
    }, 1500); // Slightly longer delay to simulate "downloading"
  } catch (err) {
    typing.style.display = "none";
    addMessage("⚠️ Error sending image.", "idol");
  }
}
