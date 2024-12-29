let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
const transactionList = document.getElementById('transaction-list');
const totalIncomeEl = document.getElementById('total-income');
const totalExpensesEl = document.getElementById('total-expenses');
const netBalanceEl = document.getElementById('net-balance');

document
  .getElementById('add-transaction')
  .addEventListener('click', addTransaction);
document.getElementById('reset').addEventListener('click', resetForm);
document.querySelectorAll('input[name="filter"]').forEach((radio) => {
  radio.addEventListener('change', filterTransactions);
});

function addTransaction() {
  const description = document.getElementById('description').value;
  const amount = document.getElementById('amount').value;

  if (description && amount) {
    const transaction = {
      id: generateID(),
      description,
      amount: +amount,
    };
    transactions.push(transaction);
    updateLocalStorage();
    renderTransactions();
    resetForm();
  } else {
    alert('Please provide valid inputs');
  }
}

function generateID() {
  return Math.floor(Math.random() * 100000);
}

function renderTransactions(filter = 'all') {
  transactionList.innerHTML = '';
  const filteredTransactions = transactions.filter((transaction) => {
    if (filter === 'income') return transaction.amount > 0;
    if (filter === 'expense') return transaction.amount < 0;
    return true;
  });

  filteredTransactions.forEach((transaction) => {
    const li = document.createElement('li');
    li.classList.add(transaction.amount > 0 ? 'income' : 'expense');
    li.innerHTML = `
      ${transaction.description} - $${Math.abs(transaction.amount)}
      <button onclick="deleteTransaction(${transaction.id})">Delete</button>
    `;
    transactionList.appendChild(li);
  });

  updateTotals();
}

function deleteTransaction(id) {
  transactions = transactions.filter((transaction) => transaction.id !== id);
  updateLocalStorage();
  renderTransactions();
}

function updateTotals() {
  const totalIncome = transactions
    .filter((t) => t.amount > 0)
    .reduce((acc, t) => acc + t.amount, 0);
  const totalExpenses = transactions
    .filter((t) => t.amount < 0)
    .reduce((acc, t) => acc + t.amount, 0);
  const netBalance = totalIncome + totalExpenses;

  totalIncomeEl.innerText = totalIncome.toFixed(2);
  totalExpensesEl.innerText = Math.abs(totalExpenses).toFixed(2);
  netBalanceEl.innerText = netBalance.toFixed(2);
}

function resetForm() {
  document.getElementById('description').value = '';
  document.getElementById('amount').value = '';
}

function filterTransactions(e) {
  renderTransactions(e.target.value);
}

function updateLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

document.addEventListener('DOMContentLoaded', () => {
  renderTransactions();
});
