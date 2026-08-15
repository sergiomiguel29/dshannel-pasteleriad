const socialData = {
  facebook: {
    label: "Facebook",
    className: "facebook",
    url: "https://www.facebook.com/share/1bkTCEhRax/?mibextid=wwXIfr",
    icon: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.4 8.3V6.8c0-.7.5-.9.9-.9h2.3V2.1L14.4 2c-3.6 0-4.5 2.7-4.5 4.4v1.9H7v3.9h2.9V22h4.1v-9.8h3.2l.5-3.9h-3.3z"/></svg>`
  },
  tiktok: {
    label: "TikTok",
    className: "tiktok",
    url: "https://www.tiktok.com/@pagina_oficial5?is_from_webapp=1&sender_device=pc",
    icon: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16.2 2c.4 3 2.1 4.8 5 5v3.4a8.5 8.5 0 0 1-5-1.6v6.8c0 3.5-2.3 6.4-6.3 6.4A6.2 6.2 0 0 1 3.6 16c0-3.7 3-6.6 7-6.2v3.6c-1.8-.3-3.2.8-3.2 2.5 0 1.5 1.1 2.5 2.5 2.5 1.6 0 2.6-.9 2.6-3.1V2h3.7z"/></svg>`
  }
};

const toast = document.querySelector("#toast");
const cakeForm = document.querySelector("#cakeForm");
const consultForm = document.querySelector("#consultForm");
const requestSummary = document.querySelector("#requestSummary");
const whatsappLink = document.querySelector("#whatsappLink");
const estimate = document.querySelector("#estimate");
const clientName = document.querySelector("#clientName");
const clientPhone = document.querySelector("#clientPhone");
const referencePhoto = document.querySelector("#referencePhoto");
const uploadPreview = document.querySelector("#uploadPreview");
const previewImage = document.querySelector("#previewImage");
const fileName = document.querySelector("#fileName");
const removePhoto = document.querySelector("#removePhoto");
const socialLinks = document.querySelector("#socialLinks");
const builderSummary = document.querySelector("#builderSummary");
const steps = [...document.querySelectorAll(".builder-step")];
const progressSteps = [...document.querySelectorAll(".progress-step")];
const prevStep = document.querySelector("#prevStep");
const nextStep = document.querySelector("#nextStep");
const prepareQuote = document.querySelector("#prepareQuote");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const filterChips = [...document.querySelectorAll(".filter-chip")];
const catalogProducts = [...document.querySelectorAll(".catalog-product")];
const productLinks = [...document.querySelectorAll("[data-product]")];
const categoryLinks = [...document.querySelectorAll("[data-filter-link]")];

let currentStep = 0;
let uploadedReference = null;
let previewUrl = null;

function money(value) {
  return `S/ ${Number(value || 0).toFixed(0)}`;
}

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 2600);
}

function selectedRadio(name) {
  return cakeForm.querySelector(`input[name="${name}"]:checked`);
}

function fieldValue(id) {
  return cakeForm.querySelector(`#${id}`)?.value.trim() || "";
}

function calculateEstimate() {
  const mold = selectedRadio("mold");
  const decoration = fieldValue("style");
  const total = Number(mold?.dataset.price || 0) + (decoration ? 20 : 0);
  estimate.textContent = money(total);
  return total;
}

function selectedText(name, fallback = "por definir") {
  return selectedRadio(name)?.value || fallback;
}

function buildSummaryRows(photoUrl = "") {
  const selectedFile = referencePhoto.files[0];
  const photoText = selectedFile
    ? photoUrl || `Seleccionada: ${selectedFile.name}`
    : "no adjuntada";

  return [
    ["Tamaño", selectedText("mold")],
    ["Sabor", selectedText("flavor")],
    ["Relleno", selectedText("filling")],
    ["Decoración", fieldValue("style") || "por definir"],
    ["Fecha deseada", fieldValue("delivery") || "por confirmar"],
    ["Detalles", fieldValue("notes") || "sin detalles adicionales por ahora"],
    ["Foto de referencia", photoText],
    ["Monto aproximado", money(calculateEstimate())]
  ];
}

function renderBuilderSummary() {
  builderSummary.innerHTML = buildSummaryRows()
    .map(([label, value]) => `<p><span>${label}</span><strong>${value}</strong></p>`)
    .join("");
}

function buildCakeSummary(photoUrl = "") {
  const rows = buildSummaryRows(photoUrl);
  return [
    "Hola D'Shannel, quisiera cotizar una torta personalizada.",
    ...rows.map(([label, value]) => `${label}: ${value}`)
  ].join("\n");
}

function updateWhatsapp() {
  const text = requestSummary.value.trim() || "Hola D'Shannel, quisiera consultar disponibilidad y una cotización personalizada.";
  whatsappLink.href = `https://wa.me/51993124676?text=${encodeURIComponent(text)}`;
}

function cleanClientName(value) {
  return value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ ]/g, "").replace(/\s{2,}/g, " ");
}

function formatPeruPhone(value) {
  const digits = value.replace(/\D/g, "");
  const localNumber = digits.startsWith("51") ? digits.slice(2, 11) : digits.slice(0, 9);
  const parts = [];

  if (localNumber.slice(0, 3)) parts.push(localNumber.slice(0, 3));
  if (localNumber.slice(3, 6)) parts.push(localNumber.slice(3, 6));
  if (localNumber.slice(6, 9)) parts.push(localNumber.slice(6, 9));

  return localNumber ? `+51 ${parts.join(" ")}` : "";
}

function isValidPeruPhone(value) {
  return /^\+51 [0-9]{3} [0-9]{3} [0-9]{3}$/.test(value.trim());
}

function getFullConsultText() {
  const name = clientName.value.trim();
  const phone = clientPhone.value.trim();
  const body = requestSummary.value.trim() || buildCakeSummary();
  return [`Cliente: ${name || "por indicar"}`, phone ? `Teléfono: ${phone}` : "", body].filter(Boolean).join("\n");
}

function setStep(index) {
  currentStep = Math.max(0, Math.min(index, steps.length - 1));
  steps.forEach((step, stepIndex) => step.classList.toggle("active", stepIndex === currentStep));
  progressSteps.forEach((step, stepIndex) => step.classList.toggle("active", stepIndex === currentStep));
  prevStep.classList.toggle("hidden", currentStep === 0);
  nextStep.classList.toggle("hidden", currentStep === steps.length - 1);
  prepareQuote.classList.toggle("hidden", currentStep !== steps.length - 1);
  renderBuilderSummary();
}

function renderSocials() {
  socialLinks.innerHTML = Object.values(socialData).map(item => `
    <a class="social-card ${item.className}" href="${item.url}" target="_blank" rel="noreferrer">
      <span class="social-icon">${item.icon}</span>
      <strong>${item.label}</strong>
    </a>
  `).join("");
}

function applyCatalogFilter(filter) {
  filterChips.forEach(chip => chip.classList.toggle("active", chip.dataset.filter === filter));
  catalogProducts.forEach(product => {
    const categories = product.dataset.category.split(" ");
    const shouldShow = filter === "todos" || categories.includes(filter);
    product.classList.toggle("is-hidden", !shouldShow);
  });
}

function selectProduct(productName) {
  const styleField = cakeForm.querySelector("#style");
  const notesField = cakeForm.querySelector("#notes");

  if (styleField && !styleField.value.trim()) {
    styleField.value = productName;
  }

  if (notesField && !notesField.value.trim()) {
    notesField.value = `Me interesa cotizar una ${productName}.`;
  }

  requestSummary.value = `Hola D'Shannel, quisiera cotizar la ${productName}.`;
  calculateEstimate();
  renderBuilderSummary();
  updateWhatsapp();
  showToast(`${productName} agregada a tu consulta.`);
}

function clearReferencePhoto() {
  referencePhoto.value = "";
  uploadedReference = null;
  uploadPreview.hidden = true;
  previewImage.removeAttribute("src");
  fileName.textContent = "Imagen seleccionada";

  if (previewUrl) {
    URL.revokeObjectURL(previewUrl);
    previewUrl = null;
  }

  renderBuilderSummary();
}

async function uploadReferencePhoto() {
  const file = referencePhoto.files[0];
  if (!file) return null;

  if (uploadedReference && uploadedReference.fileName === file.name && uploadedReference.fileSize === file.size) {
    return uploadedReference;
  }

  const data = new FormData();
  data.append("referencePhoto", file);

  const response = await fetch("upload_reference.php", {
    method: "POST",
    body: data
  });
  const result = await response.json();

  if (!response.ok || !result.ok) {
    throw new Error(result.error || "No se pudo subir la imagen");
  }

  uploadedReference = {
    fileName: file.name,
    fileSize: file.size,
    url: result.url
  };

  return uploadedReference;
}

function initReveals() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll(".reveal").forEach(element => observer.observe(element));
}

menuToggle?.addEventListener("click", () => {
  const isOpen = document.body.classList.toggle("menu-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks?.addEventListener("click", event => {
  if (event.target.matches("a")) {
    document.body.classList.remove("menu-open");
    menuToggle?.setAttribute("aria-expanded", "false");
  }
});

progressSteps.forEach(button => {
  button.addEventListener("click", () => setStep(Number(button.dataset.goto)));
});

filterChips.forEach(chip => {
  chip.addEventListener("click", () => applyCatalogFilter(chip.dataset.filter));
});

categoryLinks.forEach(link => {
  link.addEventListener("click", () => applyCatalogFilter(link.dataset.filterLink));
});

productLinks.forEach(link => {
  link.addEventListener("click", () => selectProduct(link.dataset.product));
});

prevStep.addEventListener("click", () => setStep(currentStep - 1));
nextStep.addEventListener("click", () => setStep(currentStep + 1));

cakeForm.addEventListener("change", () => {
  calculateEstimate();
  renderBuilderSummary();
});

cakeForm.addEventListener("input", () => {
  calculateEstimate();
  renderBuilderSummary();
});

referencePhoto.addEventListener("change", () => {
  const file = referencePhoto.files[0];
  uploadedReference = null;

  if (!file) {
    clearReferencePhoto();
    return;
  }

  if (previewUrl) URL.revokeObjectURL(previewUrl);
  previewUrl = URL.createObjectURL(file);
  previewImage.src = previewUrl;
  fileName.textContent = file.name;
  uploadPreview.hidden = false;
  renderBuilderSummary();
});

removePhoto.addEventListener("click", clearReferencePhoto);

cakeForm.addEventListener("submit", event => {
  event.preventDefault();
  requestSummary.value = buildCakeSummary();
  updateWhatsapp();
  document.querySelector("#contactenos").scrollIntoView({ behavior: "smooth" });
  showToast("Consulta preparada para WhatsApp.");
});

clientName.addEventListener("input", () => {
  const cleanedName = cleanClientName(clientName.value);
  if (clientName.value !== cleanedName) clientName.value = cleanedName;
});

clientPhone.addEventListener("input", () => {
  clientPhone.value = formatPeruPhone(clientPhone.value);
});

consultForm.addEventListener("input", updateWhatsapp);

whatsappLink.addEventListener("click", async event => {
  event.preventDefault();
  clientName.value = cleanClientName(clientName.value).trimStart();
  clientPhone.value = formatPeruPhone(clientPhone.value);

  if (clientPhone.value && !isValidPeruPhone(clientPhone.value)) {
    clientPhone.reportValidity();
    showToast("Escribe el teléfono con formato peruano: +51 999 999 999.");
    return;
  }

  if (!requestSummary.value.trim()) {
    requestSummary.value = buildCakeSummary();
  }

  const file = referencePhoto.files[0];
  if (file) {
    try {
      showToast("Subiendo foto de referencia...");
      const uploaded = await uploadReferencePhoto();
      requestSummary.value = buildCakeSummary(uploaded.url);
    } catch (error) {
      const filename = file.name ? ` Archivo seleccionado: ${file.name}.` : "";
      requestSummary.value = `${buildCakeSummary()}\nNota: la foto no pudo subirse en esta versión demo.${filename}`;
      showToast(error.message || "No se pudo subir la foto. Se enviará el nombre del archivo.");
    }
  }

  const fullText = getFullConsultText();
  window.location.href = `https://wa.me/51993124676?text=${encodeURIComponent(fullText)}`;
});

consultForm.addEventListener("submit", async event => {
  event.preventDefault();
  clientName.value = cleanClientName(clientName.value).trim();
  clientPhone.value = formatPeruPhone(clientPhone.value);

  if (!consultForm.reportValidity()) return;

  const fullText = getFullConsultText();

  try {
    await navigator.clipboard.writeText(fullText);
    showToast("Consulta copiada.");
  } catch {
    showToast("La consulta está lista para enviar.");
  }
});

renderSocials();
applyCatalogFilter("todos");
calculateEstimate();
renderBuilderSummary();
updateWhatsapp();
setStep(0);
initReveals();
