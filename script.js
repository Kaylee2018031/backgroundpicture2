const promptInput = document.getElementById("promptInput");
const generateBtn = document.getElementById("generateBtn");
const clearBtn = document.getElementById("clearBtn");
const gallery = document.getElementById("gallery");
const statusText = document.getElementById("statusText");
const template = document.getElementById("imageCardTemplate");

const API_URL = "https://image.pollinations.ai/prompt/";

function setStatus(message) {
  statusText.textContent = message;
}

function createImageCard(prompt, imageUrl) {
  const fragment = template.content.cloneNode(true);
  const img = fragment.querySelector("img");
  const caption = fragment.querySelector(".prompt-caption");

  img.src = imageUrl;
  img.alt = `Generated image for: ${prompt}`;
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
    setStatus("Please enter a prompt first.");
    promptInput.focus();
    return;
  }

  generateBtn.disabled = true;
  setStatus("Generating image...");

  try {
    const imageUrl = buildImageUrl(prompt);

    await new Promise((resolve, reject) => {
      const preload = new Image();
      preload.onload = resolve;
      preload.onerror = reject;
      preload.src = imageUrl;
    });

    createImageCard(prompt, imageUrl);
    setStatus("Done! Your new image was added to the gallery.");
  } catch (error) {
    setStatus("Image generation failed. Please try again.");
    console.error(error);
  } finally {
    generateBtn.disabled = false;
  }
}

generateBtn.addEventListener("click", generateImage);
promptInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") generateImage();
});

clearBtn.addEventListener("click", () => {
  gallery.innerHTML = "";
  setStatus("Gallery cleared.");
});
