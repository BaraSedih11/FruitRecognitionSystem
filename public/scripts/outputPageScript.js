let inputData = null;

document.addEventListener('DOMContentLoaded', function() {
    inputData = JSON.parse(document.getElementById('sendedData').innerHTML);
    console.log('Input data', inputData);
    console.log('Input Data length', inputData.length);
});

// Function to update the output container content
function updateOutputContainer() {
    const outputContainer = document.getElementById('outputContainer');

    if (inputData && inputData.length) {
        outputContainer.innerHTML = `
            <div style="display: flex; align-items: center;">
                <div class="loading"></div>
                <p style="font-size: 24px; text-align: center;">Data is available. Processing output...</p>
            </div>`;
        proccessingOutput();
    } else {
        outputContainer.innerHTML = `
            <div style="display: flex; align-items: center;">
                <div class="loading"></div>
                <p style="font-size: 24px; text-align: center; margin-left: 10px;">Waiting for input data...</p>
            </div>`;
    }
}

function proccessingOutput(){
    console.log('Gotshaaaa');
}

// Call the function on page load
window.onload = updateOutputContainer;
