const form = document.getElementById("expenseform");
const list = document.getElementById("expenses");
const totalIncomeInput = document.getElementById("total-income");

const incomeCircle = document.getElementById("incomeCircle");
const expenseCircle = document.getElementById("expenseCircle");
const restCircle = document.getElementById("restCircle");

let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
let totalIncome = Number(localStorage.getItem("totalIncome")) || 0;
let totalExpense = 0;

// old data load
incomeCircle.textContent = "₹" + totalIncome;

expenses.forEach(exp => {
    showExpense(exp.title, exp.amount);
    totalExpense += Number(exp.amount);
});

expenseCircle.textContent = "₹" + totalExpense;
restCircle.textContent = "₹" + (totalIncome - totalExpense);

// submit event
form.addEventListener("submit", function (e) {
    e.preventDefault();

    let title = document.getElementById("title").value.trim();
    let amount = Number(document.getElementById("amount").value);

    // blank validation
    if (title === "" || isNaN(amount) || amount <= 0) {
        alert("Please enter valid title and amount");
        return;
    }

    if (totalIncomeInput.value !== "") {
        totalIncome = Number(totalIncomeInput.value);
        localStorage.setItem("totalIncome", totalIncome);
    }

    incomeCircle.textContent = "₹" + totalIncome;

    totalExpense += amount;
    expenseCircle.textContent = "₹" + totalExpense;
    restCircle.textContent = "₹" + (totalIncome - totalExpense);

    let newExpense = { title, amount };
    expenses.push(newExpense);

    localStorage.setItem("expenses", JSON.stringify(expenses));

    showExpense(title, amount);

    document.getElementById("title").value = "";
    document.getElementById("amount").value = "";
    document.getElementById("category").value = "";
    document.getElementById("date").value = "";
});

// show expense
function showExpense(title, amount) {
    let li = document.createElement("li");

    li.innerHTML = `
        <span>${title} - ₹${amount}</span>
        <div class="action-buttons">
            <button class="delete-btn" onclick="deleteItem(this, '${title}', ${amount})">Delete</button>
            <button class="edit-btn" onclick="editItem(this, '${title}', ${amount})">Edit</button>
        </div>
    `;

    list.appendChild(li);
}

// delete
function deleteItem(button, title, amount) {
    let li = button.closest("li");
    li.remove();

    expenses = expenses.filter(
        exp => !(exp.title === title && exp.amount == amount)
    );

    localStorage.setItem("expenses", JSON.stringify(expenses));

    totalExpense -= Number(amount);
    expenseCircle.textContent = "₹" + totalExpense;
    restCircle.textContent = "₹" + (totalIncome - totalExpense);
}

// edit
function editItem(button, title, amount) {
    document.getElementById("title").value = title;
    document.getElementById("amount").value = amount;

    deleteItem(button, title, amount);
}
document.getElementById("searchExpense").addEventListener("input", function () {
    let searchValue = this.value.toLowerCase();
    let items = document.querySelectorAll("#expenses li");

    items.forEach(item => {
        let text = item.innerText.toLowerCase();
        item.style.display = text.includes(searchValue) ? "flex" : "none";
    });
});
