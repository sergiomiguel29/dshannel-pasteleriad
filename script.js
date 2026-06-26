const defaultServices = [
  {
    id: crypto.randomUUID(),
    title: "Tortas personalizadas",
    description: "Diseños para cumpleaños, bautizos, aniversarios y fechas especiales con sabores y rellenos a elección.",
    includes: ["Bizcocho a elección", "Relleno personalizado", "Decoración según temática", "Dedicatoria o nombre"],
    tag: "Más pedido"
  },
  {
    id: crypto.randomUUID(),
    title: "Cupcakes decorados",
    description: "Cupcakes temáticos ideales para mesas dulces, detalles corporativos o celebraciones pequeñas.",
    includes: ["Decoración coordinada", "Presentación por pedido", "Sabores clásicos o especiales", "Colores según evento"],
    tag: "Por encargo"
  },
  {
    id: crypto.randomUUID(),
    title: "Mesas dulces",
    description: "Combinación de postres, bocaditos, cupcakes y torta central para eventos con una presentación armoniosa.",
    includes: ["Selección de postres", "Armonía de colores", "Opciones por cantidad de invitados", "Asesoría para composición"],
    tag: "Eventos"
  }
];

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

const serviceGrid = document.querySelector("#serviceGrid");
const socialLinks = document.querySelector("#socialLinks");
const toast = document.querySelector("#toast");
const cakeForm = document.querySelector("#cakeForm");
const consultForm = document.querySelector("#consultForm");
const requestSummary = document.querySelector("#requestSummary");
const whatsappLink = document.querySelector("#whatsappLink");
const estimate = document.querySelector("#estimate");
const referencePhoto = document.querySelector("#referencePhoto");
const uploadPreview = document.querySelector("#uploadPreview");
const previewImage = document.querySelector("#previewImage");
const fileName = document.querySelector("#fileName");
const removePhoto = document.querySelector("#removePhoto");
let uploadedReference = null;

function getServices() {
  const saved = localStorage.getItem("dshannel-services");
  if (!saved) return defaultServices;

  const parsed = JSON.parse(saved);
  if (parsed.some(service => !service.includes)) {
    localStorage.removeItem("dshannel-services");
    return defaultServices;
  }

  return parsed;
}

function money(value) {
  return `S/ ${Number(value || 0).toFixed(0)}`;
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 2600);
}

function renderServices() {
  const services = getServices();
  serviceGrid.innerHTML = services.map(service => `
    <article class="service-card reveal visible">
      <span>${service.tag}</span>
      <h3>${service.title}</h3>
      <p>${service.description}</p>
      <div class="includes">
        <strong>Qué incluye</strong>
        <ul>
          ${service.includes.map(item => `<li>${item}</li>`).join("")}
        </ul>
      </div>
      <a class="btn ghost dark" href="#contactenos" data-service="${service.title}">Contáctenos</a>
    </article>
  `).join("");

  document.querySelectorAll("[data-service]").forEach(link => {
    link.addEventListener("click", () => {
      requestSummary.value = `Hola D'Shannel, quisiera consultar por el servicio: ${link.dataset.service}.`;
      updateWhatsapp();
    });
  });
}

function renderSocials() {
  socialLinks.innerHTML = Object.values(socialData).map(item => `
    <a class="social-card ${item.className}" href="${item.url}" target="_blank" rel="noreferrer">
      <span class="network-icon social-icon">${item.icon}</span>
      <div>
        <span>${item.label}</span>
        <strong>Visitar perfil oficial</strong>
      </div>
    </a>
  `).join("");
}

function calculateEstimate() {
  const mold = cakeForm.mold.selectedOptions[0];
  const decorationText = cakeForm.style.value.trim();
  const total = Number(mold.dataset.price) + (decorationText ? 20 : 0);
  estimate.textContent = money(total);
  return total;
}

function buildCakeSummary(photoUrl = "") {
  const total = calculateEstimate();
  const selectedFile = referencePhoto.files[0];
  const photoLine = selectedFile
    ? photoUrl
      ? `Foto de referencia: ${photoUrl}`
      : `Foto de referencia: sí, seleccioné ${selectedFile.name}`
    : "Foto de referencia: no adjuntada";

  return [
    "Hola D'Shannel, quisiera cotizar una torta personalizada.",
    `Tamaño: ${cakeForm.mold.value}`,
    `Sabor: ${cakeForm.flavor.value || "por definir"}`,
    `Relleno: ${cakeForm.filling.value || "por definir"}`,
    `Decoración: ${cakeForm.style.value.trim() || "por definir"}`,
    `Fecha deseada: ${cakeForm.delivery.value || "por confirmar"}`,
    `Detalles: ${cakeForm.notes.value.trim() || "sin detalles adicionales por ahora"}`,
    photoLine,
    `Monto aproximado mostrado: ${money(total)}`
  ].join("\n");
}

function updateWhatsapp() {
  const text = requestSummary.value.trim() || "Hola D'Shannel, quisiera consultar disponibilidad y una cotización personalizada.";
  whatsappLink.href = `https://wa.me/51993124676?text=${encodeURIComponent(text)}`;
}

function getFullConsultText() {
  const name = document.querySelector("#clientName").value.trim();
  const phone = document.querySelector("#clientPhone").value.trim();
  const body = requestSummary.value.trim() || buildCakeSummary();
  return [`Cliente: ${name || "por indicar"}`, phone ? `Teléfono: ${phone}` : "", body].filter(Boolean).join("\n");
}

cakeForm.addEventListener("change", calculateEstimate);
cakeForm.addEventListener("input", calculateEstimate);
referencePhoto.addEventListener("change", () => {
  const file = referencePhoto.files[0];
  uploadedReference = null;
  if (!file) {
    clearReferencePhoto();
    return;
  }

  fileName.textContent = file.name;
  previewImage.src = URL.createObjectURL(file);
  uploadPreview.hidden = false;
});

function clearReferencePhoto() {
  referencePhoto.value = "";
  uploadedReference = null;
  uploadPreview.hidden = true;
  previewImage.removeAttribute("src");
  fileName.textContent = "Imagen seleccionada";
}

removePhoto.addEventListener("click", clearReferencePhoto);

async function uploadReferencePhoto() {
  return null;
}

cakeForm.addEventListener("submit", event => {
  event.preventDefault();
  requestSummary.value = buildCakeSummary();
  updateWhatsapp();
  document.querySelector("#contactenos").scrollIntoView({ behavior: "smooth" });
  showToast("Consulta preparada.");
});

consultForm.addEventListener("input", updateWhatsapp);
whatsappLink.addEventListener("click", async event => {
  event.preventDefault();
  if (!requestSummary.value.trim()) {
    requestSummary.value = buildCakeSummary();
    updateWhatsapp();
  }

  const file = referencePhoto.files[0];
  if (file) {
    showToast("Demo GitHub: la foto queda mencionada en el mensaje. En hosting PHP se envía como enlace.");
  }

  window.location.href = `https://wa.me/51993124676?text=${encodeURIComponent(getFullConsultText())}`;
});

consultForm.addEventListener("submit", async event => {
  event.preventDefault();
  const fullText = getFullConsultText();

  try {
    await navigator.clipboard.writeText(fullText);
    showToast("Consulta copiada. Ya puedes pegarla donde necesites.");
  } catch {
    showToast("No se pudo copiar automáticamente, pero la consulta ya está lista.");
  }
});

function initReveals() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.16 });

  document.querySelectorAll(".reveal").forEach(element => observer.observe(element));
}

renderServices();
renderSocials();
calculateEstimate();
updateWhatsapp();
initReveals();
