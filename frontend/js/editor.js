// Expect localStorage: "azurill", "bronzor", ...
const templateId = localStorage.getItem("selectedTemplate") || "azurill";

// UI: show current template
const hint = document.getElementById("templateHint");
if (hint) hint.innerHTML = `Template: <span class="pill">${templateId}</span>`;

fetch(`templates/${templateId}.html`)
  .then(res => {
    if (!res.ok) throw new Error("Template not found: " + templateId);
    return res.text();
  })
  .then(html => {
    document.getElementById("resumePreview").innerHTML = html;

    bindTemplateUniversal();

    // apply after template inject
    applyPhotoToTemplate();
    applyThemeToTemplate();
    applySidebarVisibility();

    setupTabs();
    setupButtons();

    window.addEventListener("resumePhotoUpdated", applyPhotoToTemplate);
    window.addEventListener("resumeThemeUpdated", applyThemeToTemplate);

    const sidebarToggle = document.getElementById("useSidebarToggle");
    if (sidebarToggle) {
      sidebarToggle.addEventListener("change", () => {
        localStorage.setItem("useSidebar", sidebarToggle.checked ? "1" : "0");
        applySidebarVisibility();
      });
    }
  })
  .catch(err => {
    console.error(err);
    document.getElementById("resumePreview").innerHTML =
      "<h2 style='font-family:Inter,sans-serif'>Template failed to load</h2>";
  });

function setupButtons() {
  const printBtn = document.getElementById("printBtn");
  const downloadBtn = document.getElementById("downloadBtn");
  const clearBtn = document.getElementById("clearBtn");

  const doPrint = () => window.print();

  const validateAndPrint = () => {
    if (!validateRequiredFields()) return;
    doPrint();
  };

  if (printBtn) printBtn.addEventListener("click", validateAndPrint);
  if (downloadBtn) downloadBtn.addEventListener("click", validateAndPrint);

  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      const ids = [
        "nameInput","titleInput","summaryInput",
        "emailInput","phoneInput","locationInput","linkedinInput","githubInput",
        "degreeInput","majorInput","collegeInput","eduYearsInput","eduCityInput",
        "skillsInput",
        "job1TitleInput","job1CompanyInput","job1YearsInput","job1CityInput","job1BulletsInput",
        "job2TitleInput","job2CompanyInput","job2YearsInput","job2CityInput","job2BulletsInput",
        "certificationsInput","languagesInput","referencesInput",
      ];

      ids.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
          el.value = "";
          el.dispatchEvent(new Event("input"));
        }
      });

      localStorage.removeItem("resumePhotoDataUrl");
      window.dispatchEvent(new Event("resumePhotoUpdated"));
    });
  }
}

function validateRequiredFields() {
  const nameInput = document.getElementById("nameInput");
  const titleInput = document.getElementById("titleInput");
  const emailInput = document.getElementById("emailInput");
  const phoneInput = document.getElementById("phoneInput");
  const degreeInput = document.getElementById("degreeInput");
  const majorInput = document.getElementById("majorInput");
  const collegeInput = document.getElementById("collegeInput");

  if (!nameInput || !nameInput.value.trim()) {
    alert("Please enter your full name.");
    nameInput.focus();
    return false;
  }

  if (!titleInput || !titleInput.value.trim()) {
    alert("Please enter your job title.");
    titleInput.focus();
    return false;
  }

  if (!emailInput || !emailInput.value.trim()) {
    alert("Please enter your email.");
    emailInput.focus();
    return false;
  }

  if (!emailInput.value.trim().endsWith("@gmail.com")) {
    alert("Please enter a valid Gmail address ending with @gmail.com.");
    emailInput.focus();
    return false;
  }

  if (!phoneInput || !phoneInput.value.trim()) {
    alert("Please enter your phone number.");
    phoneInput.focus();
    return false;
  }

  if (phoneInput.value.trim().length !== 10) {
    alert("Please enter a 10-digit phone number.");
    phoneInput.focus();
    return false;
  }

  if (!degreeInput || !degreeInput.value.trim()) {
    alert("Please enter your degree.");
    degreeInput.focus();
    return false;
  }

  if (!majorInput || !majorInput.value.trim()) {
    alert("Please enter your major.");
    majorInput.focus();
    return false;
  }

  if (!collegeInput || !collegeInput.value.trim()) {
    alert("Please enter your college/university.");
    collegeInput.focus();
    return false;
  }

  // For experience: require at least one field per job (title or company)
  const job1Title = document.getElementById("job1TitleInput");
  const job1Company = document.getElementById("job1CompanyInput");
  if ((!job1Title || !job1Title.value.trim()) && (!job1Company || !job1Company.value.trim())) {
    alert("Please enter either a job title or company for Job 1.");
    (job1Title || job1Company).focus();
    return false;
  }

  // Job 2 is optional — no required validation here.

  return true;
}

function setupTabs() {
  const tabs = document.querySelectorAll(".tab");
  const sections = document.querySelectorAll(".form-section");

  tabs.forEach(btn => {
    btn.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      btn.classList.add("active");

      const key = btn.dataset.tab;
      sections.forEach(sec => sec.classList.remove("active"));
      const target = document.getElementById(`tab-${key}`);
      if (target) target.classList.add("active");
    });
  });
}

// Universal IDs across all templates
function bindTemplateUniversal() {
  bindText("nameInput", "nameText", "YOUR NAME");
  bindText("titleInput", "titleText", "YOUR JOB TITLE");
  bindText("summaryInput", "summaryText", "");

  bindText("emailInput", "emailText", "you@email.com");
  bindText("phoneInput", "phoneText", "+91 00000 00000");
  bindText("locationInput", "locationText", "Your City");

  bindLink("linkedinInput", "linkedinLink", "LinkedIn");
  bindLink("githubInput", "githubLink", "GitHub");

  bindText("degreeInput", "degreeText", "Degree");
  bindText("majorInput", "majorText", "Major");
  bindText("collegeInput", "collegeText", "College / University");
  bindText("eduYearsInput", "eduYearsText", "Years");
  bindText("eduCityInput", "eduCityText", "City");

  bindSkills("skillsInput", "skillsList");

  // Job 1
  bindText("job1TitleInput", "job1TitleText", "Job Title");
  bindText("job1CompanyInput", "job1CompanyText", "Company");
  bindText("job1YearsInput", "job1YearsText", "Years");
  bindText("job1CityInput", "job1CityText", "City");
  bindBullets("job1BulletsInput", "job1Points");

  // Job 2
  bindText("job2TitleInput", "job2TitleText", "Job Title");
  bindText("job2CompanyInput", "job2CompanyText", "Company");
  bindText("job2YearsInput", "job2YearsText", "Years");
  bindText("job2CityInput", "job2CityText", "City");
  bindBullets("job2BulletsInput", "job2Points");
}

function applyPhotoToTemplate() {
  const usePhoto = (localStorage.getItem("usePhoto") ?? "1") === "1";
  const photo = localStorage.getItem("resumePhotoDataUrl");

  const imgs = document.querySelectorAll("#resumePhoto, .resume-photo, [data-photo] img, .photo img");
  imgs.forEach(img => {
    if (!usePhoto || !photo) {
      img.style.display = "none";
      return;
    }
    img.src = photo;
    img.style.display = "block";
  });
}

function applyThemeToTemplate() {
  const color = localStorage.getItem("resumePrimaryColor") || "#2563eb";
  const font = localStorage.getItem("resumeFont") || "Inter";

  const container = document.getElementById("resumePreview");
  if (!container) return;

  container.style.setProperty("--resume-primary", color);
  container.style.setProperty("--resume-font", font);
  container.style.fontFamily = font + ", Inter, sans-serif";
}

function applySidebarVisibility() {
  const useSidebar = (localStorage.getItem("useSidebar") ?? "1") === "1";
  document.querySelectorAll(".sidebar, [data-sidebar]").forEach(el => {
    el.style.display = useSidebar ? "" : "none";
  });
}

// helpers
function bindText(inputId, outputId, fallback = "") {
  const input = document.getElementById(inputId);
  const out = document.getElementById(outputId);
  if (!input || !out) return;

  const update = () => {
    out.textContent = input.value.trim() || fallback;
  };

  input.addEventListener("input", update);
  update();
}

function bindLink(inputId, anchorId, labelFallback) {
  const input = document.getElementById(inputId);
  const a = document.getElementById(anchorId);
  if (!input || !a) return;

  const update = () => {
    const url = input.value.trim();
    if (!url) {
      a.href = "#";
      a.textContent = labelFallback;
      a.style.opacity = "0.8";
      return;
    }
    a.href = url;
    a.textContent = labelFallback;
    a.style.opacity = "1";
  };

  input.addEventListener("input", update);
  update();
}

function bindSkills(inputId, listId) {
  const input = document.getElementById(inputId);
  const ul = document.getElementById(listId);
  if (!input || !ul) return;

  const update = () => {
    const raw = input.value.trim();
    const skills = raw
      ? raw.split(",").map(s => s.trim()).filter(Boolean)
      : ["AWS", "Node.js", "MongoDB"];

    ul.innerHTML = skills.map(s => `<li>${escapeHtml(s)}</li>`).join("");
  };

  input.addEventListener("input", update);
  update();
}

function bindBullets(inputId, ulId) {
  const input = document.getElementById(inputId);
  const ul = document.getElementById(ulId);
  if (!input || !ul) return;

  const update = () => {
    const raw = input.value.trim();
    const lines = raw ? raw.split("\n").map(l => l.trim()).filter(Boolean) : [];
    ul.innerHTML = lines.map(l => `<li>${escapeHtml(l)}</li>`).join("");
  };

  input.addEventListener("input", update);
  update();
}

function escapeHtml(str) {
  return str
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
