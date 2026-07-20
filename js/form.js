/* ============================================================
   form.js — Validasi form lead (dwibahasa)
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("leadForm");
  if (!form) return;

  const success = document.getElementById("formSuccess");

  const MSG = {
    id: {
      required: "Wajib diisi.",
      email: "Masukkan email yang valid.",
      url: "Masukkan URL yang valid (mis. https://situs.com)."
    },
    en: {
      required: "This field is required.",
      email: "Enter a valid email address.",
      url: "Enter a valid URL (e.g. https://site.com)."
    }
  };
  const msg = () => MSG[document.documentElement.lang] || MSG.id;

  const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  const isUrl = (v) => {
    try { const u = new URL(v); return u.protocol === "http:" || u.protocol === "https:"; }
    catch { return false; }
  };

  const setError = (input, text) => {
    const box = form.querySelector(`[data-error-for="${input.id}"]`);
    input.classList.toggle("is-invalid", !!text);
    input.setAttribute("aria-invalid", text ? "true" : "false");
    if (box) box.textContent = text || "";
    return !text;
  };

  const validateField = (input) => {
    const v = input.value.trim();
    const m = msg();
    if (!v) return setError(input, m.required);
    if (input.type === "email" && !isEmail(v)) return setError(input, m.email);
    if (input.type === "url" && !isUrl(v)) return setError(input, m.url);
    return setError(input, "");
  };

  // Validasi ulang saat user memperbaiki input
  form.querySelectorAll("input").forEach((input) => {
    input.addEventListener("input", () => {
      if (input.classList.contains("is-invalid")) validateField(input);
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let ok = true;
    let firstInvalid = null;

    form.querySelectorAll("input").forEach((input) => {
      const valid = validateField(input);
      if (!valid && !firstInvalid) firstInvalid = input;
      ok = ok && valid;
    });

    if (!ok) {
      if (firstInvalid) firstInvalid.focus();
      if (success) success.hidden = true;
      return;
    }

    // TODO: hubungkan ke endpoint nyata (mis. fetch POST ke API / form handler).
    // const data = Object.fromEntries(new FormData(form).entries());
    // await fetch("/api/lead", { method: "POST", body: JSON.stringify(data) });

    form.reset();
    if (success) {
      success.hidden = false;
      success.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  });
});
