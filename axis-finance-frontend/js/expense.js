document.addEventListener("DOMContentLoaded", init);

// ===== Config =====
const BASE_URL = "http://localhost:8080/expense";
const CATEGORY_URL = "http://localhost:8080/category";

const JSON_HEADERS = {
    "Accept": "application/json",
    "Content-Type": "application/json",
};

// ===== DOM =====
const expenseForm = document.querySelector("#expenseForm");
const expenseDescription = document.querySelector(".expenseDescription");
const expenseAmount = document.querySelector(".expenseAmount");
const expenseCategory = document.querySelector(".expenseCategory");

const tableBody = document.getElementById("expenseTableBody");

const submitBtn = document.getElementById("submitBtn");
const cancelBtn = document.getElementById("cancelBtn");

let editingExpenseId = null;

// ===== Init =====
function init() {

    if (!expenseForm || !tableBody) return;

    loadCategoriesOptions();
    loadExpenses();

    expenseForm.addEventListener("submit", onSubmitExpenseForm);
    tableBody.addEventListener("click", onTableClick);

    cancelBtn.addEventListener("click", resetForm);
}

// ===== Event Handlers =====

async function onSubmitExpenseForm(event) {

    event.preventDefault();

    try {

        const payload = {
            description: expenseDescription.value.trim(),
            amount: Number(expenseAmount.value),
            category: {
                categoryId: Number(expenseCategory.value)
            }
        };

        if (editingExpenseId) {
            await updateExpense(editingExpenseId, payload);
        } else {
            await createExpense(payload);
        }

        resetForm();
        await loadExpenses();

    } catch (err) {

        console.error(err);
        alert(err.message || "Erro ao salvar despesa.");
    }
}

async function onTableClick(event) {

    const btn = event.target;

    if (btn.classList.contains("btn-delete")) {

        const id = btn.dataset.id;

        const confirmed = confirm("Tem certeza que deseja excluir esta despesa?");
        if (!confirmed) return;

        try {

            await deleteExpense(id);
            await loadExpenses();

        } catch (err) {

            console.error(err);
            alert(err.message || "Erro ao excluir despesa.");
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

// ===== API =====

async function createExpense(payload) {

    const res = await fetch(BASE_URL, {
        method: "POST",
        headers: JSON_HEADERS,
        body: JSON.stringify(payload)
    });

    if (!res.ok) {
        throw new Error("Erro ao salvar despesa.");
    }
}

async function loadExpenses() {

    const res = await fetch(BASE_URL, {
        method: "GET",
        headers: JSON_HEADERS
    });

    if (!res.ok) throw new Error("Erro ao buscar despesas.");

    const data = await res.json();

    renderTable(data);
}

async function updateExpense(id, payload) {

    const res = await fetch(`${BASE_URL}/${id}`, {
        method: "PUT",
        headers: JSON_HEADERS,
        body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error("Erro ao atualizar despesa.");
}

async function deleteExpense(id) {

    const res = await fetch(`${BASE_URL}/${id}`, {
        method: "DELETE"
    });

    if (!res.ok) throw new Error("Erro ao deletar despesa.");
}

async function loadCategoriesOptions() {

    const res = await fetch(CATEGORY_URL, {
        method: "GET",
        headers: { "Accept": "application/json" }
    });

    if (!res.ok) throw new Error("Erro ao carregar categorias.");

    const data = await res.json();

    expenseCategory.innerHTML = `<option value="">Selecione uma categoria</option>`;

    data
        .filter(category => category.categoryType === "DESPESA")
        .forEach(category => {

            const option = document.createElement("option");

            option.value = category.id;
            option.textContent = category.name;

            expenseCategory.appendChild(option);
        });
}

// ===== UI Helpers =====

function renderTable(expenses) {

    tableBody.innerHTML = "";

    expenses.forEach(expense => {

        const expenseId = expense.id ?? expense.expenseId;
        const categoryId = expense.category?.categoryId ?? "";
        const categoryName = expense.category?.name ?? "-";

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${escapeHtml(expense.description)}</td>
            <td>${formatCurrency(expense.amount)}</td>
            <td>${escapeHtml(categoryName)}</td>
            <td>
                <button 
                    class="btn-update"
                    data-id="${expenseId}"
                    data-description="${escapeHtml(expense.description)}"
                    data-amount="${expense.amount}"
                    data-category-id="${categoryId}">
                    Editar
                </button>
                <button class="btn-delete" data-id="${expenseId}">
                    Excluir
                </button>
            </td>
        `;

        tableBody.appendChild(row);
    });
}

function resetForm() {

    expenseDescription.value = "";
    expenseAmount.value = "";
    expenseCategory.value = "";

    editingExpenseId = null;

    submitBtn.textContent = "Cadastrar";
    cancelBtn.hidden = true;
}

function fillFormForEdit(id, description, amount, categoryId) {

    editingExpenseId = id;

    expenseDescription.value = description;
    expenseAmount.value = amount;
    expenseCategory.value = categoryId;

    submitBtn.textContent = "Salvar";
    cancelBtn.hidden = false;
}

// ===== Utils =====

function formatCurrency(value) {

    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL"
    }).format(value);
}

function escapeHtml(str) {

    return String(str)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}