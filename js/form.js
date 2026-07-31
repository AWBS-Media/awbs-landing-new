/* ============================================================
   form.js — Validasi form lead (dwibahasa)
   ============================================================ */

// Ganti dengan Web App URL hasil deploy Google Apps Script (lihat apps-script/Code.gs)
const LEAD_FORM_ENDPOINT = "";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("leadForm");
  if (!form) return;

  const success = document.getElementById("formSuccess");
  const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');

  const MSG = {
    id: {
      required: "Wajib diisi.",
      email: "Masukkan email yang valid.",
      url: "Masukkan URL yang valid (mis. https://situs.com).",
      submitError: "Gagal mengirim. Silakan coba lagi.",
      submitting: "Mengirim…"
    },
    en: {
      required: "This field is required.",
      email: "Enter a valid email address.",
      url: "Enter a valid URL (e.g. https://site.com).",
      submitError: "Something went wrong. Please try again.",
      submitting: "Sending…"
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

  const setSubmitError = (text) => {
    let box = form.querySelector(".lead-form__submit-error");
    if (!text) {
      if (box) box.textContent = "";
      return;
    }
    if (!box) {
      box = document.createElement("p");
      box.className = "lead-form__submit-error";
      box.setAttribute("role", "alert");
      form.insertBefore(box, submitBtn ? submitBtn.nextSibling : null);
    }
    box.textContent = text;
  };

  form.addEventListener("submit", async (e) => {
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

    setSubmitError("");
    const m = msg();
    const data = Object.fromEntries(new FormData(form).entries());
    data.lang = document.documentElement.lang || "id";

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.dataset.originalText = submitBtn.dataset.originalText || submitBtn.textContent;
      submitBtn.textContent = m.submitting;
    }

    try {
      if (LEAD_FORM_ENDPOINT) {
        // text/plain menghindari CORS preflight yang tidak didukung Apps Script Web App
        await fetch(LEAD_FORM_ENDPOINT, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify(data)
        });
      }

      form.reset();
      if (success) {
        success.hidden = false;
        success.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    } catch (err) {
      setSubmitError(m.submitError);
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = submitBtn.dataset.originalText;
      }
    }
  });
});
