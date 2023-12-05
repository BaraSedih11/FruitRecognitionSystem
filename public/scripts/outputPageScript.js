let inputData = null;
let learningRate = null;
let numberOfNeurons = null;
let numberOfEpochs = null;
let activationFunctionForHidden = null;
let activationFunctionForOutput = null;
let errorCriterion = 0.0001; // or any other small positive value

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
        epochs = parsedData.maxEpochs;
        activationFunctionForHidden = parsedData.activationFunctionForHidden;
        activationFunctionForOutput = parsedData.activationFunctionForOutput;

        console.log('Input data:', inputData);
        console.log('Learning Rate:', learningRate);
        console.log('Number of Neurons:', numberOfNeurons);
        console.log('Number of Epochs:', epochs);
        console.log('Activation Function for hidden layer:', activationFunctionForHidden);
        console.log('Activation Function for output layer:', activationFunctionForOutput);

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

    for (let epoch = 0; epoch < epochs; epoch++) {
        let totalError = 0;
        let layer1Outputs;

        for (let dataRow = 0; dataRow < inputData.length; dataRow++) {
            // step1
            let { weightsForHidden, weightsForOutput, thresholdsForHidden, thresholdsForOutput } = Initialization(numberOfNeurons);
            let expectedOutput = getExpectedOutputFromDataRow(inputData[dataRow]);
            
            // Loop until the error criterion is satisfied
            do {
                // step2
                layer1Outputs = Activation(inputData[dataRow], weightsForHidden, weightsForOutput, thresholdsForHidden, thresholdsForOutput, activationFunctionForHidden, activationFunctionForOutput);

                console.log(`Epoch ${epoch + 1}, Example ${dataRow + 1}:`);
                console.log('Actual Output:', layer1Outputs.actualOutput);

                // Assuming your expected output is available in the inputData
                expectedOutput = inputData[dataRow].output;
                console.log('Expected Output:', expectedOutput);

                // step3
                totalError = WeightTraining(inputData[dataRow], weightsForHidden, weightsForOutput, layer1Outputs.actualOutput, expectedOutput, layer1Outputs.layer1Outputs);
            } while (totalError > errorCriterion);
        }
    }
}

function getExpectedOutputFromDataRow(dataRow) {
    return dataRow.output;
}

function initializeWeights(rows, columns) { 
    const weights = [];
    const Fi = rows;

    for (let i = 0; i < rows; i++) {
        weights[i] = [];
        for (let j = 0; j < columns; j++) {
            let randomWeight = 0;
            
            // Generate random weights until a non-zero value is obtained
            while (randomWeight === 0) {
                // Calculate the range for random numbers
                const range = 2.4 / Fi;

                // Generate a random number in the specified range and round to one decimal place
                randomWeight = Math.round((Math.random() * (2 * range) - range) * 10) / 10;
                
            }

            // Assign the non-zero random weight to the array element
            weights[i][j] = randomWeight;
        }
    }
    return weights;
}

function initializeThresholds(inputSize, neuronsSize) {
    const thresholds = [];
    const Fi = inputSize;

    for (let i = 0; i < neuronsSize; i++) {
        let randomThreshold = 0;

        // Generate random thresholds until a non-zero value is obtained
        while (randomThreshold === 0) {
            const range = 2.4 / Fi;

            // Generate a random number in the specified range and round to one decimal place
            randomThreshold = Math.round((Math.random() * (2 * range) - range) * 10) / 10;
        }

        // Assign the non-zero random threshold to the array element
        thresholds[i] = randomThreshold;
    }

    return thresholds;
}

function Initialization(neuronsSize){
    // Layer1
    const weightsForHidden = initializeWeights(2, neuronsSize);
    const thresholdsForHidden = initializeThresholds(2, neuronsSize);
    
    // Layer2
    const weightsForOutput = initializeWeights(neuronsSize, 3);
    const thresholdsForOutput = initializeThresholds(neuronsSize, 3);

    return { weightsForHidden, weightsForOutput, thresholdsForHidden, thresholdsForOutput };
}

function getColorValue(color){
    if(color === 'red') return 0;
    else if(color === 'orange') return 0.5;
    else if(color === 'yellow') return 1;
}

function getSweetnessValue(sweetness){
    return sweetness/10;
}

function applyActivationFunctionForHidden(activationFunctionForHidden, x){

    if(activationFunctionForHidden === 'RelU'){
        return Math.max(0, x);
    } 
    else if(activationFunctionForHidden === 'Tanh'){
        return Math.tanh(x);
    }
    else if(activationFunctionForHidden === 'Sigmoid'){
        return ( 1 / ( 1 + ( Math.exp(x) ) ) )
    }
    else {
        console.error('Invalid activation function fot hidden layer');
    }
}

function applyActivationFunctionForOutput(activationFunctionForOutput, x, outputs){

    if(activationFunctionForOutput === 'Softmax'){
        let outputsSum = 0;
        x = Math.exp(x);
        for(let output = 0 ; output < 3 ; output++){
            outputsSum += Math.exp(outputs[output]);
        }
        return x/outputsSum;
    } 
    else if(activationFunctionForOutput === 'Sigmoid'){
        return ( 1 / ( 1 + ( Math.exp(x) ) ) )
    }
    else {
        console.error('Invalid activation function for output layer');
    }
}

function getOutputForHidden(inputRow, weightsForHidden, thresholdsForHidden, activationFunctionForHidden, i){
    let sum = 0;

    let x1 = getColorValue(inputRow.input[1]);
    let x2 = getSweetnessValue(inputRow.input[0]);

    sum += (x1 * weightsForHidden[0][i]) + (x2 * weightsForHidden[1][i]) - thresholdsForHidden[i];
    return applyActivationFunctionForHidden(activationFunctionForHidden, sum);
}

function getOutputForOutput(input, weightsForOutput, threshold, y){
    let sum = 0;

    for (let i = 0 ; i < input.length ; i++){
        sum  += input[i] * weightsForOutput[i][y];
    }
    sum -= threshold;
    
    return sum;
}


function Activation(inputRow, weightsForHidden, weightsForOutput, thresholdsForHidden, thresholdsForOutput, activationFunctionForHidden, activationFunctionForOutput) {
    let layer1Outputs = [];
    let layer2Outputs = [];
    let actualOutputs = [];

    // Layer1
    for (let neuron = 0; neuron < numberOfNeurons; neuron++) {
        let output = getOutputForHidden(inputRow, weightsForHidden, thresholdsForHidden, activationFunctionForHidden, neuron);
        layer1Outputs[neuron] = output;
    }

    // Layer2
    for (let y = 0; y < 3; y++) {
        let output = getOutputForOutput(layer1Outputs, weightsForOutput, thresholdsForOutput[y], y);
        layer2Outputs[y] = output;

    }

    // Apply activation function for output layer
    // I made another loop because softmax wants all sums to be calculated
    for (let y = 0; y < 3; y++) {
        let output = applyActivationFunctionForOutput(activationFunctionForOutput, layer2Outputs[y], layer2Outputs);
        actualOutputs[y] = output;
    }

    let actualOutput = actualOutputs.length > 0 ? actualOutputs[0] : 0;

    for (let output = 0; output < actualOutputs.length; output++) {
        actualOutput = Math.max(actualOutputs[output], actualOutput);
    }

    return { actualOutput: actualOutput, layer1Outputs: layer1Outputs };
}

function WeightTraining(inputRow, weightsForHidden, weightsForOutput, actualOutput, expectedOutput, layer1Outputs) {
    let totalError = 0;

    console.log('baraaaa');
    console.log(layer1Outputs);

    // Calculate the error gradient for the output layer
    let gradientErrorsOutput = [];
    for (let k = 0; k < 3; k++) {
        let ek = expectedOutput[k] - actualOutput;
        let gradientErrork = actualOutput * (1 - actualOutput) * ek;
        gradientErrorsOutput[k] = gradientErrork;

        // Calculate weight corrections and update weights at the output neurons
        for (let j = 0; j < numberOfNeurons; j++) {
            let deltaWjk = learningRate * layer1Outputs[j] * gradientErrork;
            weightsForOutput[j][k] += deltaWjk;
        }

        // Accumulate the total error
        totalError += Math.abs(ek);
    }

    // Calculate the error gradient for the hidden layer
    for (let i = 0; i < numberOfNeurons; i++) {
        let sumGradientErrorsOutput = 0;
        for (let k = 0; k < 3; k++) {
            sumGradientErrorsOutput += gradientErrorsOutput[k] * weightsForOutput[i][k];
        }

        let gradientErrori = layer1Outputs[i] * (1 - layer1Outputs[i]) * sumGradientErrorsOutput;

        // Calculate weight corrections and update weights at the hidden neurons
        for (let j = 0; j < 2; j++) {
            let deltaWij = learningRate * inputRow[j] * gradientErrori;
            weightsForHidden[j][i] += deltaWij;
        }
    }

    return totalError;
}

