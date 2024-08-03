document.addEventListener('DOMContentLoaded', () => {
    let purchaseStarted = false;
    const itemState = {};
    const moneyCounter = document.getElementById('money-counter');
    const startPurchaseBtn = document.getElementById('start-purchase');
    const cancelPurchaseBtn = document.getElementById('cancel-purchase');
    const finishPurchaseBtn = document.getElementById('finish-purchase');
    const langBtn = document.getElementById('lang-btn');

    document.getElementById('item-form').addEventListener('submit', (event) => {
        event.preventDefault();
        const name = document.getElementById('item-name').value;
        const cost = parseFloat(document.getElementById('item-cost').value);
        const amount = parseInt(document.getElementById('item-amount').value, 10);

        if (name && !isNaN(cost) && !isNaN(amount) && amount >= 0) {
            addItem(name, cost, amount);
            document.getElementById('item-form').reset();
        }
    });

    startPurchaseBtn.addEventListener('click', () => {
        if (purchaseStarted) return;
        purchaseStarted = true;
        moneyCounter.textContent = '0.00';
        startPurchaseBtn.classList.add('hidden');
        cancelPurchaseBtn.classList.remove('hidden');
        finishPurchaseBtn.classList.remove('hidden');
    });

    cancelPurchaseBtn.addEventListener('click', () => {
        if (!purchaseStarted) return;
        purchaseStarted = false;
        resetAllItems();
        moneyCounter.textContent = '0.00'; // Reset money counter
        startPurchaseBtn.classList.remove('hidden');
        cancelPurchaseBtn.classList.add('hidden');
        finishPurchaseBtn.classList.add('hidden');
    });

    finishPurchaseBtn.addEventListener('click', () => {
        if (!purchaseStarted) return;
        // No item reset
        purchaseStarted = false;
        moneyCounter.textContent = '0.00'; // Reset money counter
        startPurchaseBtn.classList.remove('hidden');
        cancelPurchaseBtn.classList.add('hidden');
        finishPurchaseBtn.classList.add('hidden');
    });

    function addItem(name, cost, amount) {
        if (document.querySelector(`.item[data-name="${name}"]`)) return;

        const li = document.createElement('li');
        li.classList.add('item');
        li.setAttribute('data-name', name);
        li.setAttribute('data-cost', cost);
        li.setAttribute('data-amount', amount);

        const nameSpan = document.createElement('span');
        nameSpan.textContent = name;
        li.appendChild(nameSpan);

        const costSpan = document.createElement('span');
        costSpan.textContent = `Cost: $${cost.toFixed(2)}`;
        li.appendChild(costSpan);

        const amountSpan = document.createElement('span');
        amountSpan.textContent = `Amount: ${amount}`;
        li.appendChild(amountSpan);

        const btnContainer = document.createElement('div');
        btnContainer.classList.add('btn-container');

        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Remove';
        removeBtn.classList.add('remove-btn');
        removeBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent triggering the item click event
            removeItem(name);
        });
        btnContainer.appendChild(removeBtn);

        const updateBtn = document.createElement('button');
        updateBtn.textContent = 'Update';
        updateBtn.classList.add('update-btn');
        updateBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent triggering the item click event
            updateItem(name);
        });
        btnContainer.appendChild(updateBtn);

        li.appendChild(btnContainer);

        li.addEventListener('click', () => {
            if (purchaseStarted) {
                const cost = parseFloat(li.getAttribute('data-cost'));
                const amount = parseInt(li.getAttribute('data-amount'), 10);

                if (amount > 0) {
                    li.setAttribute('data-amount', amount - 1);
                    li.querySelector('span:nth-of-type(3)').textContent = `Amount: ${amount - 1}`;
                    moneyCounter.textContent = (parseFloat(moneyCounter.textContent) + cost).toFixed(2);

                    if (amount - 1 === 0) {
                        removeItem(name);
                    }
                }
            }
        });

        document.getElementById('item-list').appendChild(li);

        itemState[name] = { cost, amount };
    }

    function removeItem(name) {
        document.querySelector(`.item[data-name="${name}"]`).remove();
        delete itemState[name];
    }

    function updateItem(name) {
        const newAmount = prompt('Enter new amount:');
        const newCost = prompt('Enter new cost:');
        const item = document.querySelector(`.item[data-name="${name}"]`);

        if (item && newAmount && newCost) {
            const amount = parseInt(newAmount, 10);
            const cost = parseFloat(newCost);

            if (!isNaN(amount) && !isNaN(cost) && amount >= 0) {
                item.setAttribute('data-amount', amount);
                item.setAttribute('data-cost', cost);
                item.querySelector('span:nth-of-type(2)').textContent = `Cost: $${cost.toFixed(2)}`;
                item.querySelector('span:nth-of-type(3)').textContent = `Amount: ${amount}`;
                itemState[name] = { cost, amount };
            }
        }
    }

    function resetAllItems() {
        document.querySelectorAll('.item').forEach(item => {
            const name = item.getAttribute('data-name');
            item.setAttribute('data-amount', itemState[name].amount);
            item.setAttribute('data-cost', itemState[name].cost);
            item.querySelector('span:nth-of-type(2)').textContent = `Cost: $${itemState[name].cost.toFixed(2)}`;
            item.querySelector('span:nth-of-type(3)').textContent = `Amount: ${itemState[name].amount}`;
        });
    }

    function toggleLanguage() {
        const lang = langBtn.getAttribute('data-lang');
        if (lang === 'en') {
            document.getElementById('html-lang').setAttribute('dir', 'rtl');
            document.getElementById('html-lang').setAttribute('lang', 'ar');
            langBtn.textContent = 'EN';
            langBtn.setAttribute('data-lang', 'ar');
        } else {
            document.getElementById('html-lang').setAttribute('dir', 'ltr');
            document.getElementById('html-lang').setAttribute('lang', 'en');
            langBtn.textContent = 'AR';
            langBtn.setAttribute('data-lang', 'en');
        }
        updateTextContent();
    }

    function updateTextContent() {
        const elements = document.querySelectorAll('[data-lang-en]');
        elements.forEach(el => {
            const lang = langBtn.getAttribute('data-lang');
            el.textContent = el.getAttribute(`data-lang-${lang}`);
            if (el.tagName === 'INPUT') {
                el.setAttribute('placeholder', el.getAttribute(`data-lang-${lang}`));
            }
        });
    }

    langBtn.addEventListener('click', toggleLanguage);

    // Initial language setup
    updateTextContent();
});
