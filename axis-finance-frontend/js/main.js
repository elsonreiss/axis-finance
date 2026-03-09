// main.js
document.addEventListener("DOMContentLoaded", init);

const BASE_URL = "http://localhost:8080";
const JSON_HEADERS = { Accept: "application/json" };

const categoryCountElement = document.getElementById("categoryQuantity");
const revenueCountElement = document.getElementById("revenueQuantity");
const revenueAmountElement = document.getElementById("revenueAmount");
const expenseCountElement = document.getElementById("expenseQuantity");
const expenseAmountElement = document.getElementById("expenseAmount");

function init() {
  if (!categoryCountElement) return;
  loadCategoryCount();
  loadRevenueInfo();
  loadExpenseInfo();

  // Atualiza o dashboard periodicamente sem recarregar a página
  setInterval(loadCategoryCount, 30000);
  setInterval(loadRevenueInfo, 30000);
  setInterval(loadExpenseInfo, 30000);
}

async function loadCategoryCount() {
  try {
    const res = await fetch(BASE_URL + "/category", { method: "GET", headers: JSON_HEADERS });
    if (!res.ok) throw new Error("Erro ao buscar categorias para o dashboard.");

    const data = await res.json();
    categoryCountElement.textContent = data.length;
  } catch (err) {
    console.error(err);
    // Deixa o card com algum fallback
    categoryCountElement.textContent = "-";
  }
}

async function loadRevenueInfo() {
  try {
    const res = await fetch(BASE_URL + "/revenue", { method: "GET", headers: JSON_HEADERS });
    if (!res.ok) throw new Error("Erro ao buscar receita(s) para o dashboard.");

    const data = await res.json();
    revenueCountElement.textContent = data.length;
  } catch (err) {
    console.error(err);
    // Deixa o card com algum fallback
    revenueCountElement.textContent = "-";
  }

  try {
    const res = await fetch(BASE_URL + "/revenue", { method: "GET", headers: JSON_HEADERS });
    if (!res.ok) throw new Error("Erro ao buscar valor de receita(s) para o dashboard.");

    const data = await res.json();
    let totalRevenueValue = 0;

    for (let i = 0; i < data.length; i++) {
      totalRevenueValue += data[i].amount;
    }

    revenueAmountElement.textContent = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL"
    }).format(totalRevenueValue);

  } catch (err) {
    console.error(err);
    revenueAmountElement.textContent = "-";
  }
}

async function loadExpenseInfo() {
  try {
    const res = await fetch(BASE_URL + "/expense", { method: "GET", headers: JSON_HEADERS });
    if (!res.ok) throw new Error("Erro ao buscar despesa(s) para o dashboard.");

    const data = await res.json();
    expenseCountElement.textContent = data.length;
  } catch (err) {
    console.error(err);
    // Deixa o card com algum fallback
    expenseCountElement.textContent = "-";
  }

  try {
    const res = await fetch(BASE_URL + "/expense", { method: "GET", headers: JSON_HEADERS });
    if (!res.ok) throw new Error("Erro ao buscar valor de despesa(s) para o dashboard.");

    const data = await res.json();
    let totalExpenseValue = 0;

    for (let i = 0; i < data.length; i++) {
      totalExpenseValue += data[i].amount;
    }

    expenseAmountElement.textContent = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL"
    }).format(totalExpenseValue);

  } catch (err) {
    console.error(err);
    expenseAmountElement.textContent = "-";
  }
}