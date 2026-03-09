// category.js
document.addEventListener("DOMContentLoaded", init);

// ====== Config ======
const BASE_URL = "http://localhost:8080/category";
const JSON_HEADERS = {
    "Accept": "application/json",
    "Content-Type": "application/json",
};

// ====== DOM ======
const categoryForm = document.querySelector("#categoryForm");
const categoryName = document.querySelector(".categoryName");
const categoryType = document.querySelector(".categoryType");
const tableBody = document.getElementById("categoryTableBody");
const submitBtn = document.getElementById("submitBtn");
const cancelBtn = document.getElementById("cancelBtn");

cancelBtn.addEventListener("click", () => {
    resetForm(); // sai do modo edição e volta pro create
});

// Estado simples: quando tiver um id aqui, o submit vira "editar"
let editingCategoryId = null;

// ====== Init ======
function init() {

    if (!categoryForm || !tableBody || !submitBtn || !cancelBtn) return;

    // Carrega lista ao abrir a página
    loadCategories();

    // Submit do form (criar ou editar, dependendo do estado)
    categoryForm.addEventListener("submit", onSubmitCategoryForm);

    // 1 listener único para botões Editar/Excluir dentro da tabela
    tableBody.addEventListener("click", onTableClick);

    cancelBtn.addEventListener("click", resetForm);
}

// ====== Event Handlers ======
async function onSubmitCategoryForm(event) {
    event.preventDefault();

    try {
        const payload = {
            name: categoryName.value.trim(),
            categoryType: Number(categoryType.value)
        };

        if (editingCategoryId) {
            await updateCategory(editingCategoryId, payload);
        } else {
            await createCategory(payload);
        }

        resetForm();
        await loadCategories();
    } catch (err) {
        console.error(err);
        // Aqui depois dá pra trocar por snackbar/toast
        alert(err.message || "Ocorreu um erro.");
    }
}

async function onTableClick(event) {
    const btn = event.target;

    // Excluir
    if (btn.classList.contains("btn-delete")) {
        const id = btn.dataset.id;
        const confirmed = confirm("Tem certeza que deseja excluir esta categoria?");
        if (!confirmed) return;

        try {
            await deleteCategory(id);
            await loadCategories();
        } catch (err) {
            console.error(err);
            alert(err.message || "Erro ao excluir.");
        }
        return;
    }

    // Editar
    if (btn.classList.contains("btn-update")) {
        const id = btn.dataset.id;
        // Preenche o form com os dados da linha (sem precisar de outro GET)
        const row = btn.closest("tr");
        const name = row.children[0]?.textContent?.trim() ?? "";
        const typeText = row.children[1]?.textContent?.trim() ?? "";

        fillFormForEdit(id, name, typeText);
    }
}

// ====== API ======
async function createCategory(payload) {
    const res = await fetch(BASE_URL, {
        method: "POST",
        headers: JSON_HEADERS,
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        const msg = await getErrorMessage(res, "Erro ao salvar categoria.");
        throw new Error(msg);
    }

    return res.json(); // se você devolver body no 201
}

async function loadCategories() {
    const res = await fetch(BASE_URL, {
        method: "GET",
        headers: JSON_HEADERS,
    });

    if (!res.ok) throw new Error("Erro ao buscar categorias.");

    const data = await res.json();
    renderTable(data);
}

async function deleteCategory(id) {
    const res = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Erro ao deletar categoria.");
}

async function updateCategory(id, payload) {
    const res = await fetch(`${BASE_URL}/${id}`, {
        method: "PUT",
        headers: JSON_HEADERS,
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        const msg = await getErrorMessage(res, "Erro ao salvar categoria.");
        throw new Error(msg);
    }
}

// ====== UI Helpers ======
function renderTable(categories) {
    tableBody.innerHTML = "";

    categories.forEach((category) => {
        const row = document.createElement("tr");

        row.innerHTML = `
      <td>${escapeHtml(category.name)}</td>
      <td>${formatCategoryType(category.categoryType)}</td>
      <td>
        <button class="btn-update" data-id="${category.id}">Editar</button>
        <button class="btn-delete" data-id="${category.id}">Excluir</button>
      </td>
    `;

        tableBody.appendChild(row);
    });
}

function getFormPayload() {
    return {
        name: categoryName.value.trim(),
        categoryType: Number(categoryType.value)
    };
}

function resetForm() {
    categoryName.value = "";
    categoryType.value = "";

    editingCategoryId = null;

    submitBtn.textContent = "Cadastrar";
    cancelBtn.hidden = true; // esconde cancelar
}

function fillFormForEdit(id, name, typeText) {
    editingCategoryId = id;

    categoryName.value = name;
    categoryType.value = typeText.toLowerCase().includes("receita") ? "1" : "2";

    submitBtn.textContent = "Salvar";
    cancelBtn.hidden = false; // mostra cancelar
}

function formatCategoryType(value) {
    // Ajusta caso o backend retorne enum string (ex: REVENUE/EXPENSE)
    if (value === 1 || value === "1" || value === "RECEITA") return "Receita";
    if (value === 2 || value === "2" || value === "DESPESA") return "Despesa";
    return String(value);
}

// Evita injetar HTML caso alguém cadastre "<script>" como nome
function escapeHtml(str) {
    return String(str)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

async function getErrorMessage(res, fallback) {
    try {
        const contentType = res.headers.get("content-type") || "";
        if (contentType.includes("application/json")) {
            const body = await res.json();
            return body.message || fallback;
        }
        const text = await res.text();
        return text || fallback;
    } catch {
        return fallback;
    }
}
