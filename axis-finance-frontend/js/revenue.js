document.addEventListener("DOMContentLoaded", init);

// ====== Config ======
const BASE_URL = "http://localhost:8080/revenue";
const CATEGORY_URL = "http://localhost:8080/category";
const JSON_HEADERS = {
    "Accept": "application/json",
    "Content-Type": "application/json",
};

// ====== DOM ======
const revenueForm = document.querySelector("#revenueForm");
const revenueDescription = document.querySelector(".revenueDescription");
const revenueAmount = document.querySelector(".revenueAmount");
const revenueCategory = document.querySelector(".revenueCategory");
const tableBody = document.getElementById("revenueTableBody");
const submitBtn = document.getElementById("submitBtn");
const cancelBtn = document.getElementById("cancelBtn");

// Estado: se tiver id, submit vira update
let editingRevenueId = null;

// ====== Init ======
function init() {
    if (!revenueForm || !tableBody || !submitBtn || !cancelBtn || !revenueCategory) return;

    loadCategoriesOptions();
    loadRevenues();

    revenueForm.addEventListener("submit", onSubmitRevenueForm);
    tableBody.addEventListener("click", onTableClick);
    cancelBtn.addEventListener("click", resetForm);
}

// ====== Event Handlers ======
async function onSubmitRevenueForm(event) {
    event.preventDefault();

    try {
        const payload = getFormPayload();

        if (editingRevenueId) {
            await updateRevenue(editingRevenueId, payload);
        } else {
            await createRevenue(payload);
        }

        resetForm();
        await loadRevenues();
    } catch (err) {
        console.error(err);
        alert(err.message || "Ocorreu um erro.");
    }
}

async function onTableClick(event) {
    const btn = event.target;

    if (btn.classList.contains("btn-delete")) {
        const id = btn.dataset.id;
        const confirmed = confirm("Tem certeza que deseja excluir esta receita?");
        if (!confirmed) return;

        try {
            await deleteRevenue(id);
            await loadRevenues();
        } catch (err) {
            console.error(err);
            alert(err.message || "Erro ao excluir receita.");
        }
        return;
    }

    if (btn.classList.contains("btn-update")) {
        const id = btn.dataset.id;
        const description = btn.dataset.description;
        const amount = btn.dataset.amount;
        const categoryId = btn.dataset.categoryId;

        fillFormForEdit(id, description, amount, categoryId);
    }
}

// ====== API ======
async function createRevenue(payload) {
    const res = await fetch(BASE_URL, {
        method: "POST",
        headers: JSON_HEADERS,
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        const msg = await getErrorMessage(res, "Erro ao salvar receita.");
        throw new Error(msg);
    }

    return safeJson(res);
}

async function loadRevenues() {
    const res = await fetch(BASE_URL, {
        method: "GET",
        headers: JSON_HEADERS,
    });

    if (!res.ok) throw new Error("Erro ao buscar receitas.");

    const data = await res.json();
    renderTable(data);
}

async function deleteRevenue(id) {
    const res = await fetch(`${BASE_URL}/${id}`, {
        method: "DELETE"
    });

    if (!res.ok) {
        const msg = await getErrorMessage(res, "Erro ao deletar receita.");
        throw new Error(msg);
    }
}

async function updateRevenue(id, payload) {
    const res = await fetch(`${BASE_URL}/${id}`, {
        method: "PUT",
        headers: JSON_HEADERS,
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        const msg = await getErrorMessage(res, "Erro ao atualizar receita.");
        throw new Error(msg);
    }

    return safeJson(res);
}

async function loadCategoriesOptions() {
    const res = await fetch(CATEGORY_URL, {
        method: "GET",
        headers: { "Accept": "application/json" },
    });

    if (!res.ok) throw new Error("Erro ao carregar categorias.");

    const data = await res.json();

    revenueCategory.innerHTML = `<option value="">Selecione uma categoria</option>`;

    data
        .filter(category => category.categoryType === "RECEITA")
        .forEach(category => {
            const option = document.createElement("option");
            option.value = category.id;
            option.textContent = category.name;
            revenueCategory.appendChild(option);
        });
}

// ====== UI Helpers ======
function renderTable(revenues) {
    tableBody.innerHTML = "";

    revenues.forEach((revenue) => {
        const row = document.createElement("tr");

        const revenueId = revenue.id ?? revenue.revenueId;
        const categoryId = revenue.category?.categoryId ?? revenue.category?.id ?? "";
        const categoryName = revenue.category?.name ?? "-";

        row.innerHTML = `
      <td>${escapeHtml(revenue.description)}</td>
      <td>${formatCurrency(revenue.amount)}</td>
      <td>${escapeHtml(categoryName)}</td>
      <td>
        <button 
          class="btn-update" 
          data-id="${revenueId}"
          data-description="${escapeHtml(revenue.description)}"
          data-amount="${revenue.amount}"
          data-category-id="${categoryId}">
          Editar
        </button>
        <button class="btn-delete" data-id="${revenueId}">Excluir</button>
      </td>
    `;

        tableBody.appendChild(row);
        console.log(revenueId)
    });
}

function getFormPayload() {
    return {
        description: revenueDescription.value.trim(),
        amount: Number(revenueAmount.value),
        category: {
            categoryId: Number(revenueCategory.value)
        }
    };
}

function resetForm() {
    revenueDescription.value = "";
    revenueAmount.value = "";
    revenueCategory.value = "";

    editingRevenueId = null;

    submitBtn.textContent = "Cadastrar";
    cancelBtn.hidden = true;
}

function fillFormForEdit(id, description, amount, categoryId) {
    editingRevenueId = id;

    revenueDescription.value = description;
    revenueAmount.value = amount;
    revenueCategory.value = categoryId;

    submitBtn.textContent = "Salvar";
    cancelBtn.hidden = false;
}

function formatCurrency(value) {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL"
    }).format(Number(value) || 0);
}

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

async function safeJson(res) {
    const contentType = res.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
        return res.json();
    }
    return null;
}