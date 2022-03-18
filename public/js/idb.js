let db;
const request = indexedDB.open('budget', 1);

request.onupgradeneeded = function(event) {
    const db = event.target.result;
    db.createObjectStore('new_budget', { autoIncremenet : true });
};

request.onsuccess = function(event) {
    db = event.target.result;
    if (navigator.online) {
        uploadBudget();
    }
}

request.onerror = function(event) {
    console.log(event.target.errorCode);
}

function saveBudget(budget) {

}

function uploadBudget() {

}

window.addEventListener('online', uploadBudget);