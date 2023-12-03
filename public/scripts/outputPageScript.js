let inputData = null;
let learningRate = null;
let numberOfNeurons = null;
let activationFunction = null;

document.addEventListener('DOMContentLoaded', function () {
    console.log('DOMContentLoaded event fired');
    const rawData = document.getElementById('sendedData').textContent;
    console.log('Raw data:', rawData);

    try {
        const parsedData = JSON.parse(rawData);
        inputData = parsedData.trainingData;
        
        // Access properties correctly
        learningRate = parsedData.learningRate;
        numberOfNeurons = parsedData.numberOfNeurons;
        activationFunction = parsedData.activationFunction;

        console.log('Input data:', inputData);
        console.log('Learning Rate:', learningRate);
        console.log('Number of Neurons:', numberOfNeurons);
        console.log('Activation Function:', activationFunction);

        updateOutputContainer();
    } catch (error) {
        console.error('Error parsing input data:', error);
    }
});

// Function to update the output container content
function updateOutputContainer() {
    console.log('Updating output container...');
    const outputContainer = document.getElementById('outputContainer');

    // Check if data is already present
    if (!inputData || !Array.isArray(inputData) || inputData.length === 0) {
        outputContainer.innerHTML = `
            <div style="display: flex; align-items: center;">
                <div class="loading"></div>
                <p style="font-size: 24px; text-align: center; margin-left: 10px;">Waiting for input data...</p>
            </div>`;
        return;
    }

    // Update the container only if data is available
    outputContainer.innerHTML = `
        <div style="display: flex; align-items: center;">
            <div class="loading"></div>
            <p style="font-size: 24px; text-align: center;">Data is available. Processing output...</p>
        </div>`;
    processingOutput();
}

function processingOutput() {
    console.log('Processing output...');
    // Your processing logic goes here

    
}

