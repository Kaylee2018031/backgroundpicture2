const promptInput = document.getElementById("promptInput");
const generateBtn = document.getElementById("generateBtn");
const clearBtn = document.getElementById("clearBtn");
const languageSelect = document.getElementById("languageSelect");
const gallery = document.getElementById("gallery");
const statusText = document.getElementById("statusText");
const template = document.getElementById("imageCardTemplate");

const API_URL = "https://image.pollinations.ai/prompt/";
const DEFAULT_LANGUAGE = "en";

const translations = {
  en: {
    htmlLang: "en",
    eyebrow: "Creative Studio",
    languageLabel: "Language",
    title: "AI Image Generator",
    subtitle: "Type a prompt and generate stylized sample images instantly.",
    inputLabel: "Describe your image",
    inputPlaceholder: "e.g. Futuristic city skyline at sunset, ultra-detailed",
    generateBtn: "Generate",
    galleryTitle: "Generated Gallery",
    clearBtn: "Clear",
    statusPromptRequired: "Please enter a prompt first.",
    statusGenerating: "Generating image...",
    statusDone: "Done! Your new image was added to the gallery.",
    statusFailed: "Image generation failed. Please try again.",
    statusCleared: "Gallery cleared.",
    imageAltPrefix: "Generated image for"
  },
  ko: {
    htmlLang: "ko",
    eyebrow: "크리에이티브 스튜디오",
    languageLabel: "언어",
    title: "AI 이미지 생성기",
    subtitle: "프롬프트를 입력하고 스타일 이미지 샘플을 즉시 생성해보세요.",
    inputLabel: "이미지 설명 입력",
    inputPlaceholder: "예: 노을 진 미래 도시 스카이라인, 초고해상도 디테일",
    generateBtn: "생성",
    galleryTitle: "생성된 갤러리",
    clearBtn: "비우기",
    statusPromptRequired: "먼저 프롬프트를 입력해 주세요.",
    statusGenerating: "이미지를 생성하는 중...",
    statusDone: "완료! 새 이미지가 갤러리에 추가되었습니다.",
    statusFailed: "이미지 생성에 실패했습니다. 다시 시도해 주세요.",
    statusCleared: "갤러리를 비웠습니다.",
    imageAltPrefix: "다음 프롬프트로 생성된 이미지"
  }
};

let currentLanguage = DEFAULT_LANGUAGE;

function t(key) {
  return translations[currentLanguage][key] ?? translations[DEFAULT_LANGUAGE][key] ?? "";
}

function setStatus(message) {
  statusText.textContent = message;
}

function applyLanguage(language) {
  currentLanguage = translations[language] ? language : DEFAULT_LANGUAGE;
  document.documentElement.lang = t("htmlLang");

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.dataset.i18n;
    element.textContent = t(key);
  });

  promptInput.placeholder = t("inputPlaceholder");
  localStorage.setItem("preferredLanguage", currentLanguage);
}

function createImageCard(prompt, imageUrl) {
  const fragment = template.content.cloneNode(true);
  const img = fragment.querySelector("img");
  const caption = fragment.querySelector(".prompt-caption");

  img.src = imageUrl;
  img.alt = `${t("imageAltPrefix")}: ${prompt}`;
  caption.textContent = prompt;

  gallery.prepend(fragment);
}

function buildImageUrl(prompt) {
  const encoded = encodeURIComponent(prompt);
  const seed = Date.now();
  return `${API_URL}${encoded}?seed=${seed}&width=768&height=768&nologo=true`;
}

async function generateImage() {
  const prompt = promptInput.value.trim();

  if (!prompt) {
    setStatus(t("statusPromptRequired"));
    promptInput.focus();
    return;
  }

  generateBtn.disabled = true;
  setStatus(t("statusGenerating"));

  try {
    const imageUrl = buildImageUrl(prompt);

    await new Promise((resolve, reject) => {
      const preload = new Image();
      preload.onload = resolve;
      preload.onerror = reject;
      preload.src = imageUrl;
    });

    createImageCard(prompt, imageUrl);
    setStatus(t("statusDone"));
  } catch (error) {
    setStatus(t("statusFailed"));
    console.error(error);
  } finally {
    generateBtn.disabled = false;
  }
}

function getInitialLanguage() {
  const stored = localStorage.getItem("preferredLanguage");
  if (stored && translations[stored]) return stored;

  return navigator.language?.toLowerCase().startsWith("ko") ? "ko" : DEFAULT_LANGUAGE;
}

generateBtn.addEventListener("click", generateImage);
promptInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") generateImage();
});

clearBtn.addEventListener("click", () => {
  gallery.innerHTML = "";
  setStatus(t("statusCleared"));
});

languageSelect.addEventListener("change", (event) => {
  applyLanguage(event.target.value);
});

const initialLanguage = getInitialLanguage();
languageSelect.value = initialLanguage;
applyLanguage(initialLanguage);
