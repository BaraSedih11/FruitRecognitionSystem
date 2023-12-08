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

    let totalError;
    let epoch = 0;
    let correctPredictions = 0;
    let trainedData = [];

    // Step 1: Initialization
    let {weightsForHidden, weightsForOutput, thresholdsForHidden, thresholdsForOutput} = Initialization(numberOfNeurons);

    while (epoch < epochs) {
        totalError = 0;

        for (let dataRow = 0; dataRow < inputData.length; dataRow++) {
            let expectedOutput = getExpectedOutputFromDataRow(inputData[dataRow]);
            expectedOutput = [expectedOutput];

            // Step 2: Forward Pass
            let layer1Outputs = Activation(inputData[dataRow], weightsForHidden, weightsForOutput, thresholdsForHidden, thresholdsForOutput, activationFunctionForHidden, activationFunctionForOutput);

            // Step 3: Backpropagation and Weight Update
            totalError += WeightTraining(inputData[dataRow], weightsForHidden, weightsForOutput, layer1Outputs.actualOutput, getExpectedOutput(), layer1Outputs.layer1Outputs);

            console.log('Total Error:', totalError);
            console.log(layer1Outputs.actualOutput);

            if (epoch === epochs - 1) {
                let actualOutputs = layer1Outputs.actualOutput;
                let finalOutputIndex = actualOutputs.indexOf(Math.max(...actualOutputs));
                let finalOutput = getFinalOutput(finalOutputIndex);
            
                trainedData[dataRow] = finalOutput;
            }
        } 

        // Check convergence criterion
        if (totalError <= errorCriterion) {
            console.log('Converged. Stopping training.');
            break;
        }


        epoch++;
    }

    console.log('Bedroooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo');

    console.log(trainedData);

    console.log('kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk');

    for (let dataRow = 0; dataRow < inputData.length; dataRow++) {
        const output = trainedData[dataRow];
        let expectedOutput = getExpectedOutputFromDataRow(inputData[dataRow]);

        console.log(output);
        console.log(expectedOutput);
        if(output === expectedOutput) correctPredictions++;

    }
        
    // here to test
    console.log(correctPredictions);
    console.log(inputData.length);

    let accuracy = correctPredictions/inputData.length;
    console.log(`Epoch ${epoch} - Accuracy: ${accuracy*100}%`);
}


function getExpectedOutput(){
    let output = [];
    output[0] = 0;
    output[1] = 0.5;
    output[2] = 1;
    return output;
}

function getFinalOutput(index){
    if(index === 0){
        return 'apple';
    } else if(index === 1){
        return 'orange';
    } else if(index === 2){
        return 'banana';
    }
}

function getExpectedOutputFromDataRow(dataRow) {
    return dataRow.output;
}

function initializeWeights(rows, columns, Fi) { 
    const weights = [];

    for (let i = 0; i < rows; i++) {
        weights[i] = [];
        for (let j = 0; j < columns; j++) {
            weights[i][j] = 0;
            let randomWeight = 0;

            // Adjusted the condition to also check if randomWeight is not equal to NaN
            while (randomWeight === 0 || isNaN(randomWeight) || !isFinite(randomWeight)) {
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
    const weightsForHidden = initializeWeights(2, neuronsSize, 2);
    const thresholdsForHidden = initializeThresholds(2, neuronsSize);
    
    // Layer2
    const weightsForOutput = initializeWeights(neuronsSize, 3, 2);
    const thresholdsForOutput = initializeThresholds(neuronsSize, 3);

    return { weightsForHidden, weightsForOutput, thresholdsForHidden, thresholdsForOutput };
}

function getColorValue(color){
    if(color === 'red') return 0;
    else if(color === 'orange') return 0.5;
    else if(color === 'yellow') return 1;
}

function getSweetnessValue(sweetness){
    return (1 - (sweetness/10));
}

function applyActivationFunctionForHidden(activationFunctionForHidden, x){

    if(activationFunctionForHidden === 'RelU'){
        return Math.max(0, x);
    } 
    else if(activationFunctionForHidden === 'Tanh'){
        return Math.tanh(x);
    }
    else if(activationFunctionForHidden === 'Sigmoid'){
        return ( 1 / ( 1 + ( Math.exp(-x) ) ) )
    }
    else {
        console.error('Invalid activation function fot hidden layer');
    }
}

function applyActivationFunctionForOutput(activationFunctionForOutput, x, outputs) {
    if (activationFunctionForOutput === 'Softmax') {
        


        
    } else if (activationFunctionForOutput === 'Sigmoid') {
        return 1 / (1 + Math.exp(-x));
    } else {
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

    // Apply softmax activation for the output layer
    actualOutputs = applyActivationFunctionForOutput(activationFunctionForOutput, 0, layer2Outputs);

    // Apply softmax to the output layer
    actualOutputs = softmax(layer2Outputs);

    // Find the index of the maximum value in actualOutputs
    const finalOutputIndex = actualOutputs.indexOf(Math.max(...actualOutputs));

    // Get the final output based on the index
    const finalOutput = getFinalOutput(finalOutputIndex);

    return { actualOutput: actualOutputs, finalOutput: finalOutput, layer1Outputs: layer1Outputs, layer2Outputs: layer2Outputs };
}

function WeightTraining(inputRow, weightsForHidden, weightsForOutput, actualOutputs, expectedOutput, layer1Outputs) {
    let totalError = 0;
    const epsilon = 1e-10;

    // Calculate the error gradients for the output layer
    let gradientErrorsOutput = [];
    for (let k = 0; k < expectedOutput.length; k++) {
        let ek = expectedOutput[k] - actualOutputs[k];

        // Check for NaN and infinity values in the output
        if (isNaN(actualOutputs[k]) || !isFinite(actualOutputs[k])) {
            console.error(`Invalid output encountered at output layer (neuron ${k}). Check for extreme values. Actual Output: ${actualOutputs[k]}`);
            return; // You may choose to return a different value in case of an invalid output.
        }

        // Calculate the gradient error and store it
        let gradientErrork = actualOutputs[k] * (1 - actualOutputs[k]) * ek;
        gradientErrorsOutput.push(gradientErrork);

        // Calculate and update weights for output neurons
        for (let j = 0; j < numberOfNeurons; j++) {
            // Check for division by small numbers
            let deltaWjk = Math.abs(layer1Outputs[j]) > epsilon ? learningRate * layer1Outputs[j] * gradientErrorsOutput[k] : 0;

            console.log(`Weight Update (Output): W${j}${k} += ${deltaWjk}`);
            weightsForOutput[j][k] += deltaWjk;
        }

        // Accumulate the total error
        totalError += Math.abs(ek);
    }

    // Calculate the error gradients for the hidden layer
    for (let i = 0; i < numberOfNeurons; i++) {
        let sumGradientErrorsOutput = 0;
        for (let k = 0; k < expectedOutput.length; k++) {
            sumGradientErrorsOutput += gradientErrorsOutput[k] * weightsForOutput[i][k];
        }

        // Calculate the gradient error
        let gradientErrori = layer1Outputs[i] * (1 - layer1Outputs[i]) * sumGradientErrorsOutput;

        // Update weights for hidden neurons
        for (let j = 0; j < inputRow.length; j++) {
            let deltaWij = learningRate * inputRow[j] * gradientErrori;

            console.log(`Weight Update (Hidden): W${j}${i} += ${deltaWij}`);
            weightsForHidden[j][i] += deltaWij;
        }
    }

    return totalError;
}









