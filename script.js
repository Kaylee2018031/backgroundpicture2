const themeInput = document.getElementById("themeInput");
const generateBtn = document.getElementById("generateBtn");
const clearBtn = document.getElementById("clearBtn");
const languageSelect = document.getElementById("languageSelect");
const postOutput = document.getElementById("postOutput");
const statusText = document.getElementById("statusText");
const template = document.getElementById("postTemplate");

const DEFAULT_LANGUAGE = "en";
const AUTO_GENERATE_DELAY = 450;

const translations = {
  en: {
    htmlLang: "en",
    eyebrow: "Warm Bookstore Creator",
    languageLabel: "Language",
    title: "Create a quiet, comforting Instagram post.",
    subtitle: "Enter a theme and receive an English quote, Korean translation, caption, and hashtags in a warm bookstore voice.",
    generatorKicker: "Theme",
    generatorTitle: "What should the post be about?",
    inputLabel: "Enter a theme",
    inputPlaceholder: "e.g. starting again, rainy evenings, self-kindness",
    generateBtn: "Generate Warm Bookstore Post",
    postKicker: "Generated post",
    postTitle: "Warm bookstore copy",
    clearBtn: "Clear",
    emptyMessage: "Your generated post will appear here as you type a theme.",
    statusPromptRequired: "Please enter a theme first.",
    statusGenerating: "Warming the lamp and opening a fresh page...",
    statusDone: "Done. Your warm bookstore post is ready.",
    statusCleared: "Post cleared.",
    themeLabel: "Theme",
    quoteTitle: "English Quote",
    translationTitle: "Korean Translation",
    captionTitle: "Instagram Caption",
    hashtagsTitle: "Hashtags"
  },
  ko: {
    htmlLang: "ko",
    eyebrow: "따뜻한 서점 크리에이터",
    languageLabel: "언어",
    title: "조용하고 다정한 인스타그램 글을 만들어보세요.",
    subtitle: "주제를 입력하면 따뜻한 서점의 분위기로 영어 문장, 한국어 번역, 캡션, 해시태그를 만들어드립니다.",
    generatorKicker: "주제",
    generatorTitle: "어떤 이야기를 담아볼까요?",
    inputLabel: "주제 입력",
    inputPlaceholder: "예: 다시 시작하기, 비 오는 저녁, 나에게 다정하기",
    generateBtn: "따뜻한 서점 게시물 만들기",
    postKicker: "생성된 게시물",
    postTitle: "따뜻한 서점 카피",
    clearBtn: "비우기",
    emptyMessage: "주제를 입력하면 생성된 게시물이 이곳에 표시됩니다.",
    statusPromptRequired: "먼저 주제를 입력해 주세요.",
    statusGenerating: "작은 조명을 켜고 새 페이지를 여는 중이에요...",
    statusDone: "완료되었습니다. 따뜻한 서점 게시물이 준비됐어요.",
    statusCleared: "게시물을 비웠습니다.",
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

function applyLanguage(language) {
  currentLanguage = translations[language] ? language : DEFAULT_LANGUAGE;
  document.documentElement.lang = t("htmlLang");

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.dataset.i18n;
    element.textContent = t(key);
  });

  themeInput.placeholder = t("inputPlaceholder");
  localStorage.setItem("preferredLanguage", currentLanguage);
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
  const fragment = template.content.cloneNode(true);
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

function generatePost() {
  const theme = themeInput.value.trim();

  if (!theme) {
    setStatus(t("statusPromptRequired"));
    themeInput.focus();
    return;
  }

  generateBtn.disabled = true;
  setStatus(t("statusGenerating"));

  window.setTimeout(() => {
    renderPost(createPost(theme));
    setStatus(t("statusDone"));
    generateBtn.disabled = false;
  }, 120);
}

function scheduleAutoGenerate() {
  window.clearTimeout(autoGenerateTimer);

  if (themeInput.value.trim().length < 2) return;

  autoGenerateTimer = window.setTimeout(generatePost, AUTO_GENERATE_DELAY);
}

function createEmptyMessage() {
  const message = document.createElement("p");
  message.className = "empty-message";
  message.dataset.i18n = "emptyMessage";
  message.textContent = t("emptyMessage");
  return message;
}

function clearPost() {
  window.clearTimeout(autoGenerateTimer);
  currentPost = null;
  themeInput.value = "";
  postOutput.classList.add("empty");
  postOutput.replaceChildren(createEmptyMessage());
  setStatus(t("statusCleared"));
  themeInput.focus();
}

function getInitialLanguage() {
  const stored = localStorage.getItem("preferredLanguage");
  if (stored && translations[stored]) return stored;

  return navigator.language?.toLowerCase().startsWith("ko") ? "ko" : DEFAULT_LANGUAGE;
}

generateBtn.addEventListener("click", generatePost);
themeInput.addEventListener("input", scheduleAutoGenerate);
themeInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    window.clearTimeout(autoGenerateTimer);
    generatePost();
  }
});

clearBtn.addEventListener("click", clearPost);
languageSelect.addEventListener("change", (event) => {
  applyLanguage(event.target.value);
  if (currentPost) renderPost(currentPost);
});

const initialLanguage = getInitialLanguage();
languageSelect.value = initialLanguage;
applyLanguage(initialLanguage);
