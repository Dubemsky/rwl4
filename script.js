const syncButton = document.getElementById("syncButton");
const asyncButton = document.getElementById("asyncButton");
const fetchButton = document.getElementById("fetchButton");
const dataTable = document.getElementById("dataTable").getElementsByTagName('tbody')[0];

// Function to process data and add it to the table
function processData(data) {
    data.forEach(entry => {
        const [firstName, lastName] = entry.name.split(" ");
        const row = dataTable.insertRow();
        row.insertCell(0).textContent = firstName;
        row.insertCell(1).textContent = lastName;
        row.insertCell(2).textContent = entry.id;
    });
}

// Synchronous XMLHttpRequest
syncButton.addEventListener("click", () => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "data/reference.json", false); // Synchronous request
    xhr.send();
    
    const referenceData = JSON.parse(xhr.responseText);
    const dataFiles = [referenceData.data_location, "data2.json", "data3.json"];

    dataFiles.forEach(file => {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", `data/${file}`, false); // Synchronous request
        xhr.send();
        const data = JSON.parse(xhr.responseText).data;
        processData(data);
    });
});

// Asynchronous XMLHttpRequest with callbacks
asyncButton.addEventListener("click", () => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "data/reference.json", true);
    
    xhr.onload = function() {
        const referenceData = JSON.parse(xhr.responseText);
        const dataFiles = [referenceData.data_location, "data2.json", "data3.json"];

        let loadData = function(index) {
            if (index >= dataFiles.length) return;
            const xhr = new XMLHttpRequest();
            xhr.open("GET", `data/${dataFiles[index]}`, true);
            xhr.onload = function() {
                const data = JSON.parse(xhr.responseText).data;
                processData(data);
                loadData(index + 1); // Process the next file after the previous one finishes
            };
            xhr.send();
        };
        loadData(0);
    };
    xhr.send();
});

// Fetch API with Promises
fetchButton.addEventListener("click", () => {
    fetch('data/reference.json')
        .then(response => response.json())
        .then(referenceData => {
            const dataFiles = [referenceData.data_location, "data2.json", "data3.json"];
            return Promise.all(dataFiles.map(file => fetch(`data/${file}`).then(res => res.json())));
        })
        .then(results => {
            results.forEach(result => processData(result.data));
        });
});
