const promptInput = document.getElementById("promptInput");
const generateBtn = document.getElementById("generateBtn");
const clearBtn = document.getElementById("clearBtn");
const languageSelect = document.getElementById("languageSelect");
const gallery = document.getElementById("gallery");
const statusText = document.getElementById("statusText");
const imageTemplate = document.getElementById("imageCardTemplate");
const themeInput = document.getElementById("themeInput");
const bookstoreGenerateBtn = document.getElementById("bookstoreGenerateBtn");
const bookstoreStatusText = document.getElementById("bookstoreStatusText");
const postOutput = document.getElementById("postOutput");
const postTemplate = document.getElementById("postTemplate");

const API_URL = "https://image.pollinations.ai/prompt/";
const DEFAULT_LANGUAGE = "en";
const AUTO_GENERATE_DELAY = 450;

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
    imageAltPrefix: "Generated image for",
    bookstoreKicker: "New feature",
    bookstoreTitle: "Warm Bookstore Post Generator",
    bookstoreSubtitle: "Enter a theme to generate an English inspirational quote, Korean translation, Instagram caption, and hashtags.",
    themeInputLabel: "Post theme",
    themeInputPlaceholder: "e.g. starting again, rainy evenings, self-kindness",
    bookstoreGenerateBtn: "Generate Warm Bookstore Post",
    bookstoreEmptyMessage: "Your warm bookstore post will appear here.",
    bookstoreThemeRequired: "Please enter a theme first.",
    bookstoreGenerating: "Warming the lamp and opening a fresh page...",
    bookstoreDone: "Done. Your warm bookstore post is ready.",
    themeLabel: "Theme",
    quoteTitle: "English Quote",
    translationTitle: "Korean Translation",
    captionTitle: "Instagram Caption",
    hashtagsTitle: "Hashtags"
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
    imageAltPrefix: "다음 프롬프트로 생성된 이미지",
    bookstoreKicker: "새 기능",
    bookstoreTitle: "따뜻한 서점 게시물 생성기",
    bookstoreSubtitle: "주제를 입력하면 영어 영감 문장, 한국어 번역, 인스타그램 캡션, 해시태그를 만들어드립니다.",
    themeInputLabel: "게시물 주제",
    themeInputPlaceholder: "예: 다시 시작하기, 비 오는 저녁, 나에게 다정하기",
    bookstoreGenerateBtn: "따뜻한 서점 게시물 만들기",
    bookstoreEmptyMessage: "따뜻한 서점 게시물이 이곳에 표시됩니다.",
    bookstoreThemeRequired: "먼저 주제를 입력해 주세요.",
    bookstoreGenerating: "작은 조명을 켜고 새 페이지를 여는 중이에요...",
    bookstoreDone: "완료되었습니다. 따뜻한 서점 게시물이 준비됐어요.",
    themeLabel: "Theme",
    quoteTitle: "English Quote",
    translationTitle: "Korean Translation",
    captionTitle: "Instagram Caption",
    hashtagsTitle: "Hashtags"
  }
};

const quoteFrames = [
  {
    quote: (theme) => `Let ${theme} arrive softly, like a page turning beside a cup that has finally stopped steaming.`,
    translation: (theme) => `${themeKo(theme)}은 마침내 김이 잦아든 찻잔 곁에서 책장이 넘어가듯 조용히 찾아와도 괜찮아요.`,
    caption: (theme) => `Some themes do not need to be solved all at once.\n\nLet ${theme} sit with you for a while, the way a good book waits open on a wooden table.\n\nThere is room here for your pace.`
  },
  {
    quote: (theme) => `Even ${theme} can become gentler when you give it a chair by the window and enough afternoon light.`,
    translation: (theme) => `${themeKo(theme)}도 창가의 의자와 충분한 오후의 빛을 내어주면 조금은 더 다정해질 수 있어요.`,
    caption: (theme) => `Maybe ${theme} is not asking you to hurry.\n\nMaybe it only needs a quieter room, a slower breath, and one honest line written in the margin.\n\nBegin there.`
  },
  {
    quote: (theme) => `Hold ${theme} the way bookstores hold silence: carefully, warmly, and without asking it to explain itself.`,
    translation: (theme) => `서점이 침묵을 품듯 ${themeKo(theme)}을 조심스럽고 따뜻하게, 굳이 설명하게 하지 않은 채 안아주세요.`,
    caption: (theme) => `There are feelings that open only when they are not rushed.\n\nToday, let ${theme} be met with lamplight instead of pressure, with kindness instead of a deadline.\n\nYou are allowed to be human here.`
  },
  {
    quote: (theme) => `${capitalize(theme)} may be a quiet chapter, but quiet chapters still teach the heart how to stay.`,
    translation: (theme) => `${themeKo(theme)}은 조용한 한 장일지 몰라도, 그런 장들도 마음에게 머무는 법을 가르쳐줘요.`,
    caption: (theme) => `Not every chapter announces itself loudly.\n\nSome arrive like rain against the bookstore window, asking only that you listen without turning away.\n\nLet ${theme} speak softly today.`
  }
];

const koreanThemeDictionary = {
  "starting again": "다시 시작하는 마음",
  "new beginning": "새로운 시작",
  "rainy evenings": "비 오는 저녁",
  "rain": "비",
  "self-kindness": "나에게 다정해지는 일",
  "self kindness": "나에게 다정해지는 일",
  "rest": "쉼",
  "healing": "회복",
  "hope": "희망",
  "patience": "기다림",
  "comfort": "위로",
  "loneliness": "외로움",
  "courage": "용기",
  "books": "책",
  "coffee": "커피",
  "love": "사랑",
  "autumn": "가을",
  "winter": "겨울"
};

const baseHashtags = [
  "#dailyquote",
  "#gentlereminders",
  "#bookstorevibes",
  "#cozycafe",
  "#slowliving",
  "#quietmoments",
  "#mindfulliving",
  "#감성글",
  "#위로글귀",
  "#책스타그램",
  "#카페감성"
];

let currentLanguage = DEFAULT_LANGUAGE;
let autoGenerateTimer;
let currentPost;

function t(key) {
  return translations[currentLanguage][key] ?? translations[DEFAULT_LANGUAGE][key] ?? "";
}

function setStatus(message) {
  statusText.textContent = message;
}

function setBookstoreStatus(message) {
  bookstoreStatusText.textContent = message;
}

function applyLanguage(language) {
  currentLanguage = translations[language] ? language : DEFAULT_LANGUAGE;
  document.documentElement.lang = t("htmlLang");

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.dataset.i18n;
    element.textContent = t(key);
  });

  promptInput.placeholder = t("inputPlaceholder");
  themeInput.placeholder = t("themeInputPlaceholder");
  localStorage.setItem("preferredLanguage", currentLanguage);
}

function createImageCard(prompt, imageUrl) {
  const fragment = imageTemplate.content.cloneNode(true);
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

function normalizeTheme(theme) {
  return theme.trim().replace(/\s+/g, " ").toLowerCase();
}

function capitalize(text) {
  if (!text) return text;
  return `${text.charAt(0).toUpperCase()}${text.slice(1)}`;
}

function themeKo(theme) {
  const normalized = normalizeTheme(theme);
  return koreanThemeDictionary[normalized] ?? `‘${theme}’`;
}

function getThemeIndex(theme) {
  return [...theme].reduce((total, character) => total + character.charCodeAt(0), 0) % quoteFrames.length;
}

function createHashtags(theme) {
  const themeTag = `#${normalizeTheme(theme).replace(/[^a-z0-9가-힣]+/gi, "")}`;
  const tags = [themeTag, ...baseHashtags].filter((tag) => tag.length > 1);
  return [...new Set(tags)].slice(0, 12).join(" ");
}

function createPost(theme) {
  const normalizedTheme = normalizeTheme(theme);
  const frame = quoteFrames[getThemeIndex(normalizedTheme)];

  return {
    theme: normalizedTheme,
    quote: frame.quote(normalizedTheme),
    translation: frame.translation(normalizedTheme),
    caption: frame.caption(normalizedTheme),
    hashtags: createHashtags(normalizedTheme)
  };
}

function renderPost(post) {
  const fragment = postTemplate.content.cloneNode(true);
  currentPost = post;

  postOutput.classList.remove("empty");
  postOutput.replaceChildren(fragment);

  postOutput.querySelector('[data-field-title="quote"]').textContent = t("quoteTitle");
  postOutput.querySelector('[data-field-title="translation"]').textContent = t("translationTitle");
  postOutput.querySelector('[data-field-title="caption"]').textContent = t("captionTitle");
  postOutput.querySelector('[data-field-title="hashtags"]').textContent = t("hashtagsTitle");
  postOutput.querySelector('[data-field="quote"]').textContent = `“${post.quote}”`;
  postOutput.querySelector('[data-field="translation"]').textContent = `“${post.translation}”`;
  postOutput.querySelector('[data-field="caption"]').textContent = post.caption;
  postOutput.querySelector('[data-field="hashtags"]').textContent = post.hashtags;
  postOutput.querySelector(".theme-chip").textContent = `${t("themeLabel")}: ${post.theme}`;
}

function generateBookstorePost() {
  const theme = themeInput.value.trim();

  if (!theme) {
    setBookstoreStatus(t("bookstoreThemeRequired"));
    themeInput.focus();
    return;
  }

  bookstoreGenerateBtn.disabled = true;
  setBookstoreStatus(t("bookstoreGenerating"));

  window.setTimeout(() => {
    renderPost(createPost(theme));
    setBookstoreStatus(t("bookstoreDone"));
    bookstoreGenerateBtn.disabled = false;
  }, 120);
}

function scheduleAutoGeneratePost() {
  window.clearTimeout(autoGenerateTimer);

  if (themeInput.value.trim().length < 2) return;

  autoGenerateTimer = window.setTimeout(generateBookstorePost, AUTO_GENERATE_DELAY);
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

bookstoreGenerateBtn.addEventListener("click", generateBookstorePost);
themeInput.addEventListener("input", scheduleAutoGeneratePost);
themeInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    window.clearTimeout(autoGenerateTimer);
    generateBookstorePost();
  }
});

languageSelect.addEventListener("change", (event) => {
  applyLanguage(event.target.value);
  if (currentPost) renderPost(currentPost);
});

const initialLanguage = getInitialLanguage();
languageSelect.value = initialLanguage;
applyLanguage(initialLanguage);
