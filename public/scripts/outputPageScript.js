let inputData = null;
let learningRate = null;
let numberOfNeurons = null;
let numberOfEpochs = null;
let activationFunctionForHidden = null;
let activationFunctionForOutput = null;
let errorCriterion = 0.0001; // or any other small positive value
let totalError;
let epoch = 0;
let correctPredictions = 0;
let trainedData = [];

let weightsForHidden = [];
let weightsForOutput = [];
let thresholdsForHidden = [];
let thresholdsForOutput = [];

document.addEventListener('DOMContentLoaded', function () {
    console.log('DOMContentLoaded event fired');
    const rawData = document.getElementById('sendedData').textContent;

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
    <div style="align-items: center;">
        <p style="font-size: 24px; text-align: center;">Done Learning. Testing output...</p>
        <br>
        <p>Enter data to test</p>
        <input type="number" min="1" max="10" id="sweetnessTest" placeholder="Sweetness" style="margin-right: 10px;">
        <br>
        <select id="colorTest" style="margin-right: 10px;">
            <option value="green">Green</option>
            <option value="yellow">Yellow</option>
            <option value="red">Red</option>
            <option value="orange">Orange</option>
        </select>
        <button onclick="testData()">Test Data</button>
    </div>`;
    processingOutput();
}

function testData(){
    
}

function processingOutput() {
    console.log('Processing output...');

    while (epoch < epochs) {
        totalError = 0;
        console.log(`Epoch: ${epoch}`);
        for (let dataRow = 0; dataRow < inputData.length; dataRow++) {

            if(epoch == 0){
                // Step 1: Initialization
                let  InitializeData = Initialization(numberOfNeurons);
                weightsForHidden[dataRow] = InitializeData.weightsForHidden;
                weightsForOutput[dataRow] = InitializeData.weightsForOutput;
                thresholdsForHidden[dataRow] = InitializeData.thresholdsForHidden;
                thresholdsForOutput[dataRow] = InitializeData.thresholdsForOutput;
            }
            
            let expectedOutput = getExpectedOutputFromDataRow(inputData[dataRow]);
            expectedOutput = [expectedOutput];

            // Step 2: Forward Pass
            let layer1Outputs = Activation(inputData[dataRow], weightsForHidden[dataRow], weightsForOutput[dataRow], thresholdsForHidden[dataRow], thresholdsForOutput[dataRow], activationFunctionForHidden, activationFunctionForOutput);
            
            // Print relevant values for debugging
            console.log('Actual Outputs:', layer1Outputs.actualOutput);
            console.log(JSON.stringify(weightsForHidden[dataRow]));
            console.log(JSON.stringify(weightsForOutput[dataRow]));

            // Step 3: Backpropagation and Weight Update
            let BackpropagationObj = WeightTraining(inputData[dataRow], weightsForHidden[dataRow], weightsForOutput[dataRow], layer1Outputs.actualOutput, getExpectedOutput(inputData[dataRow].output), layer1Outputs.layer1Outputs, layer1Outputs.layer2Outputs);

            totalError += BackpropagationObj.totalError;
            weightsForHidden[dataRow] = BackpropagationObj.weightsForHidden;
            weightsForOutput[dataRow] = BackpropagationObj.weightsForOutput;

            console.log('Total Error:', totalError);
            console.log('Weights for Hidden:', JSON.stringify(weightsForHidden[dataRow]));
            console.log('Weights for Output:', JSON.stringify(weightsForOutput[dataRow]));
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

    console.log(trainedData);

    for (let dataRow = 0; dataRow < inputData.length; dataRow++) {
        const output = trainedData[dataRow];
        let expectedOutput = getExpectedOutputFromDataRow(inputData[dataRow]);

        console.log(output);
        console.log(expectedOutput);
        if(output === expectedOutput) correctPredictions++;

    }

    let accuracy = correctPredictions/inputData.length;
    console.log(`Epoch ${epoch} - Accuracy: ${accuracy*100}%`);
}

function getExpectedOutput(dataOutput){
    let output = [];
    output[0] = 0.2;
    output[1] = 0.5;
    output[2] = 0.8;
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
    if(color === 'red') return 0.2;
    else if(color === 'green') return 0.25;
    else if(color === 'orange') return 0.6;
    else if(color === 'yellow') return 0.9;
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
        return ( 1 / ( 1 + ( Math.exp(-x) ) ) )
    }
    else {
        console.error('Invalid activation function fot hidden layer');
    }
}

function applySoftmaxForOutput(output) {
    const expOutput = output.map(Math.exp);
    const sumExp = expOutput.reduce((acc, val) => acc + val, 0);
    const softmaxResult = expOutput.map(value => value / sumExp);
    return softmaxResult;
}  

function softmaxDerivative(output){
    let softmaxValue = applySoftmaxForOutput(output);
    
    for(let i = 0 ; i < output.length ; i++){
        output[i] = softmaxValue * (1 - softmaxValue);
    }
    return output;
}

function applySigmoidForOutput(output){
    output = (1/ (1 + Math.exp(-output)));
    return output * (1 - output);
}

function applyTanhForOutput(output){
    return Math.tanh(output);
}

function getOutputForHidden(inputRow, weightsForHidden, thresholdsForHidden, activationFunctionForHidden, i){
    let sum = 0;

    let x1 = getSweetnessValue(inputRow.input[0]);
    let x2 = getColorValue(inputRow.input[1]);

    sum += (x1 * weightsForHidden[0][i]) + (x2 * weightsForHidden[1][i]) + thresholdsForHidden[i];
    return applyActivationFunctionForHidden(activationFunctionForHidden, sum);    
}

function getOutputForOutput(input, weightsForOutput, threshold, y){
    let sum = 0;

    for (let i = 0 ; i < input.length ; i++){
        sum  += input[i] * weightsForOutput[i][y];
    }
    sum += threshold;
    
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

    if(activationFunctionForOutput === 'Softmax'){
        actualOutputs = applySoftmaxForOutput(layer2Outputs);
    } else if(activationFunctionForOutput === 'Sigmoid'){
        for(let y = 0 ; y < 3 ; y++){
            actualOutputs[y] = applySigmoidForOutput(layer2Outputs[y]);
        }
    } else {
        console.error('Invalid activation function for output layer');
    }

    // Find the index of the maximum value in actualOutputs
    const finalOutputIndex = actualOutputs.indexOf(Math.max(...actualOutputs));

    // Get the final output based on the index
    const finalOutput = getFinalOutput(finalOutputIndex);

    return { actualOutput: actualOutputs, finalOutput: finalOutput, layer1Outputs: layer1Outputs, layer2Outputs: layer2Outputs };
}

function WeightTraining(inputRow, weightsForHidden, weightsForOutput, actualOutputs, expectedOutput, layer1Outputs, layer2Outputs) {
    let totalError = 0;

    // Calculate the error gradients for the output layer
    let gradientErrorsOutput = [];
    for (let k = 0; k < 3; k++) { 
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
            let deltaWjk = learningRate * layer2Outputs[k] * gradientErrorsOutput[k];

            console.log(`Weight Update (Output): W${j}${k} += ${deltaWjk}`);
            weightsForOutput[j][k] += deltaWjk;
            console.log(`Weights for output after modification: ${weightsForOutput[j][k]}`);
        }

        // Accumulate the total error
        totalError = Math.abs(ek);
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
        for (let j = 0; j < 2; j++) {
            console.log('Tesssssssssss');
            let x;
            if(j == 0){
                x = getSweetnessValue(inputRow.input[0]);
            } else{
                x = getColorValue(inputRow.input[1]);
            }
            let deltaWij = learningRate * x * gradientErrori;

            console.log(`Weight Update (Hidden): W${j}${i} += ${deltaWij}`);
            weightsForHidden[j][i] += deltaWij;
            console.log(`Weights for hidden after modification: ${weightsForHidden[j][i]}`);
        }
    }

    return {totalError, weightsForHidden, weightsForOutput};
}
 