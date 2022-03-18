let db;
const request = indexedDB.open('budget', 1);

request.onupgradeneeded = function(event) {
    const db = event.target.result;
    db.createObjectStore('new_budget', { autoIncremenet : true });
};

request.onsuccess = function(event) {
    db = event.target.result;
    if (navigator.onLine) {
        uploadBudget();
    }
}

request.onerror = function(event) {
    console.log(event.target.errorCode);
}

function saveBudget(budget) {
    const transaction = db.transaction(['new_budget'], 'readwrite');

    const budgetObjectStore = transaction.objectStore('new_budget');

    budgetObjectStore.add(budget);
}

function uploadBudget() {
    const transaction = db.transaction(['new_budget'], 'readwrite');

    const budgetObjectStore = transaction.objectStore('new_budget');

    const getAll = budgetObjectStore.getAll();

    getAll.onsuccess = function() {
        if (getAll.result.length > 0) {
            fetch('/api/transaction', {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                  Accept: 'application/json, text/plain, */*',
                  'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(serverResponse => {
                if(serverResponse.message) {
                    throw new Error(serverResponse);
                }
                const transaction = db.transaction(['new_budget'], 'readwrite');
                const budgetObjectStore = transaction.objectStore('new_budget');
                // clear all items in your store
                budgetObjectStore.clear();
              })
              .catch(err => {
                // set reference to redirect back here
                console.log(err);

            })
        }
    }

}

window.addEventListener('online', uploadBudget);