'use strict'

// Get a list of items in inventory based on the classification_id 
// document.addEventListener("DOMContentLoaded", function () {
//     let classIdURL = "/repair/all"
//     fetch(classIdURL)
//         .then(function (response) {
//             if (response.ok) {
//                 return response.json();
//             }
//             throw Error("Network response was not OK");
//         })
//         .then(function (data) {
//             console.log(data);
//             buildRepairList(data);
//         })
//         .catch(function (error) {
//             console.log('There was a problem: ', error.message)
//         })
// })
async function getData() {
    try {
        const data = await fetch("/repair/all")
        buildRepairList(data)
    } catch (error) {
        console.error("Error: " + error)
    }

}
function buildRepairList(data) {
    let repairDisplay = document.getElementById("repairDisplay");
    // Set up the table labels 
    let dataTable = '<thead>';
    dataTable += '<tr><th>Vehicle Name</th><th>Repair Description</th><th>Date</th><th>Cost</th></tr>';
    dataTable += '</thead>';
    // Set up the table body 
    dataTable += '<tbody>';
    // Iterate over all vehicles in the array and put each in a row 
    data.forEach(function (element) {
        console.log(element.inv_id + ", " + element.inv_model);
        dataTable += `<tr><td>${element.inv_make} ${element.inv_model}</td>`;
        dataTable += `<td><a href='/inv/edit/${element.inv_id}' title='Click to update'>Modify</a></td>`;
        dataTable += `<td><a href='/inv/delete/${element.inv_id}' title='Click to delete'>Delete</a></td></tr>`;
    })
    dataTable += '</tbody>';
    // Display the contents in the Inventory Management view 
    repairDisplay.innerHTML = dataTable;
}
getData()