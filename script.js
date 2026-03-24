const premiumButton = document.getElementById("openPremium");
const premiumPanel = document.getElementById("premiumPanel");
const goBackTop = document.getElementById("goBackTop");

const authTabs = document.querySelectorAll(".auth-tab");
const signinForm = document.getElementById("signinForm");
const signupForm = document.getElementById("signupForm");

premiumButton.addEventListener("click", () => {
  premiumPanel.scrollIntoView({ behavior: "smooth", block: "start" });
});

goBackTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

authTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    authTabs.forEach((item) => item.classList.remove("active"));
    tab.classList.add("active");

    const mode = tab.dataset.auth;

    if (mode === "signin") {
      signinForm.classList.remove("hidden");
      signupForm.classList.add("hidden");
    } else {
      signupForm.classList.remove("hidden");
      signinForm.classList.add("hidden");
    }
  });
});