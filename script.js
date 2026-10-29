const menuToggle = document.getElementById("menu-toggle");
const menu = document.getElementById("menu");
const themeToggle = document.getElementById("theme-toggle");
const root = document.documentElement;

// Saudação dinâmica de acordo com o horário.
function atualizarSaudacao() {
    const hora = new Date().getHours();
    let texto = "Olá! Seja bem-vindo(a).";

    if (hora >= 5 && hora < 12) {
        texto = "Bom dia! Seja bem-vindo(a).";
    } else if (hora >= 12 && hora < 18) {
        texto = "Boa tarde! Seja bem-vindo(a).";
    } else {
        texto = "Boa noite! Seja bem-vindo(a).";
    }

    document.getElementById("saudacao").textContent = texto;
}
atualizarSaudacao();

// Abre e fecha o menu no celular.
menuToggle.addEventListener("click", function () {
    const aberto = menu.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(aberto));
    menuToggle.setAttribute("aria-label", aberto ? "Fechar menu" : "Abrir menu");
});

menu.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
        menu.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Abrir menu");
    });
});

document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && menu.classList.contains("open")) {
        menu.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Abrir menu");
        menuToggle.focus();
    }
});

// Alterna o modo claro e escuro.
themeToggle.addEventListener("click", function () {
    const escuro = root.dataset.theme !== "dark";

    if (escuro) {
        root.dataset.theme = "dark";
        themeToggle.textContent = "☀";
        themeToggle.setAttribute("aria-label", "Ativar modo claro");
    } else {
        delete root.dataset.theme;
        themeToggle.textContent = "☾";
        themeToggle.setAttribute("aria-label", "Ativar modo escuro");
    }
});

// Mostra a foto somente se o arquivo estiver disponível.
const photo = document.getElementById("profile-photo");
const portraitCard = document.querySelector(".portrait-card");

function verificarFoto() {
    portraitCard.classList.toggle("has-photo", photo.complete && photo.naturalWidth > 0);
}
photo.addEventListener("load", verificarFoto);
photo.addEventListener("error", verificarFoto);
verificarFoto();

// Ano automático no rodapé.
document.getElementById("ano").textContent = new Date().getFullYear();

// Validação do formulário no navegador; os dados não são enviados.
const form = document.getElementById("contact-form");
const statusMessage = document.getElementById("form-status");

const fields = [
    {
        input: document.getElementById("nome"),
        error: document.getElementById("erro-nome"),
        check: value => value.trim().length >= 2 ? "" : "Digite seu nome (mínimo de 2 caracteres)."
    },
    {
        input: document.getElementById("email"),
        error: document.getElementById("erro-email"),
        check: value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) ? "" : "Digite um e-mail válido."
    },
    {
        input: document.getElementById("mensagem"),
        error: document.getElementById("erro-mensagem"),
        check: value => value.trim().length >= 10 ? "" : "Escreva pelo menos 10 caracteres."
    }
];

function validarCampo(field) {
    const message = field.check(field.input.value);
    field.error.textContent = message;
    field.input.setAttribute("aria-invalid", String(Boolean(message)));
    return message === "";
}

fields.forEach(function (field) {
    field.input.addEventListener("input", function () {
        validarCampo(field);
        statusMessage.textContent = "";
    });
});

const consent = document.getElementById("consentimento");
const consentError = document.getElementById("erro-consentimento");

consent.addEventListener("change", function () {
    consentError.textContent = consent.checked ? "" : "Marque o consentimento para continuar.";
    statusMessage.textContent = "";
});

form.addEventListener("submit", function (event) {
    event.preventDefault();

    const validFields = fields.map(validarCampo).every(Boolean);
    const validConsent = consent.checked;

    consentError.textContent = validConsent ? "" : "Marque o consentimento para continuar.";

    if (!validFields || !validConsent) {
        statusMessage.textContent = "Confira os campos indicados e tente novamente.";
        const firstInvalid = fields.find(field => field.input.getAttribute("aria-invalid") === "true");

        if (firstInvalid) {
            firstInvalid.input.focus();
        } else {
            consent.focus();
        }
        return;
    }

    statusMessage.textContent = "Tudo certo! A validação funcionou, mas a mensagem não foi enviada.";
    form.reset();

    fields.forEach(function (field) {
        field.error.textContent = "";
        field.input.removeAttribute("aria-invalid");
    });
    consentError.textContent = "";
});
