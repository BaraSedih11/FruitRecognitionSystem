let inputData = null;
let learningRate = null;
let numberOfNeurons = null;
let numberOfEpochs = null;
let activationFunctionForHidden = null;
let activationFunctionForOutput = null;
let errorCriterion = 0.0001; // or any other small positive value
let totalError;
let crossEntropy;
let epoch = 0;
let correctPredictions = 0;
let trainedData = [];
let accuracy ;
let classError ;

let weightsForHidden ;
let weightsForOutput ;
let thresholdsForHidden;
let thresholdsForOutput;

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
        <p id="accuracy"></p>
        <p id="classError"></p>
        <p id="mse"></p>
        <p id="crossEntropy"></p>
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
        <br>
        <br>
        <p id="result"></p>
        <br>
        <img id="result-img"></img>
    </div>`;
    processingOutput();
}

function testData(){
    console.log('Testing data...');

    let sweetness = document.getElementById('sweetnessTest').value;
    let color = document.getElementById('colorTest').value;

    let testObj = {
        input: [
            sweetness,
            color
        ],
    }
    
    let testOutput = Activation(testObj);

    console.log('Tested Outputs:', testOutput.actualOutput);

    let actualOutput = testOutput.actualOutput[0];
    let index = 0;

    if(actualOutput < testOutput.actualOutput[1]) {
        index = 1;
        actualOutput = testOutput.actualOutput[1];
    }
    if(actualOutput < testOutput.actualOutput[2]){
        index = 2;
        actualOutput = testOutput.actualOutput[2];
    } 
    
        

    console.log(index);
    let result = getFinalOutput(index);

    document.getElementById('result').textContent = `Testing output: ${result}`;

    let img = document.getElementById('result-img');
    img.width = 50;
    img.height = 50;
    if(result === 'apple'){
        if(color === 'red')
            img.src = '../images/apple.png';
        else if(color === 'green'){
            img.src = '../images/greenApple.png';
            img.width = 70;
            img.height = 70;
        }
        else
            img.src = '../images/yellowApple.png';
    } else if(result === 'orange'){
        img.src = '../images/orange.png';
    } else if(result === 'banana'){
        img.src = '../images/banana.png';
    }

}

function processingOutput() {
    console.log('Processing output...');

    // Step 1: Initialization
    let InitializeData = Initialization(numberOfNeurons);
    weightsForHidden = InitializeData.weightsForHidden;
    weightsForOutput = InitializeData.weightsForOutput;
    thresholdsForHidden = InitializeData.thresholdsForHidden;
    thresholdsForOutput = InitializeData.thresholdsForOutput;

    while (epoch < epochs) {
        totalError = 0;
        crossEntropy = 0;
        accuracy = 0;
        classError = 1;
        console.log(`Epoch: ${epoch}`);

        for (let dataRow = 0; dataRow < inputData.length; dataRow++) {

            // Step 2: Forward Pass
            let layer1Outputs = Activation(inputData[dataRow]);

            // Step 3: Backpropagation and Weight Update
            let BackpropagationObj = WeightTraining(inputData[dataRow], layer1Outputs.actualOutput, getExpectedOutput(inputData[dataRow].output), layer1Outputs.layer1Outputs, layer1Outputs.layer2Outputs);

            totalError += BackpropagationObj.totalError;
            crossEntropy += BackpropagationObj.crossEntropy;
            weightsForHidden = BackpropagationObj.weightsForHidden;
            weightsForOutput = BackpropagationObj.weightsForOutput;
            thresholdsForHidden = BackpropagationObj.thresholdsForHidden;
            thresholdsForOutput = BackpropagationObj.thresholdsForOutput;

            if (epoch === epochs - 1) {
                let actualOutputs = layer1Outputs.actualOutput;
                let finalOutputIndex = actualOutputs.indexOf(Math.max(...actualOutputs));
                let finalOutput = getFinalOutput(finalOutputIndex);
            
                trainedData[dataRow] = finalOutput;
            }
        } 

        for (let index = 0; index < inputData.length ; index++){
            const output = trainedData[index];
            let expectedOutputValue = getExpectedOutputFromDataRow(inputData[index]);
            if(output === expectedOutputValue) correctPredictions++;
        }
        
        accuracy = correctPredictions/inputData.length;
        classError = 1 - accuracy;

        totalError /= inputData.length; //mse
        crossEntropy /= inputData.length;

        // Check convergence criterion
        if (classError <= errorCriterion) {
            console.log('Converged. Stopping training.');
            break;
        }

        epoch++;
    }

    console.log(`Epoch ${epoch}`);

    document.getElementById('accuracy').textContent = `Accuracy: ${accuracy*100}%`;
    document.getElementById('classError').textContent = `Classification Error: ${classError}`;
    document.getElementById('mse').textContent = `MSE: ${totalError}`;
    document.getElementById('crossEntropy').textContent = `Cross-Entropy: ${crossEntropy}`; 
}

function getExpectedOutput(dataOutput){
    let output = [];
    if(dataOutput === 'apple'){
        output[0] = 1;
        output[1] = 0;
        output[2] = 0;
    }
    if(dataOutput === 'orange'){
        output[0] = 0;
        output[1] = 1;
        output[2] = 0;
    }
    if(dataOutput === 'banana'){
        output[0] = 0;
        output[1] = 0;
        output[2] = 1;
    }
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
    else if(color === 'green') return 0.05;
    else if(color === 'orange') return 1;
    else if(color === 'yellow') return 0.5;
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

function Activation(inputRow) {
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

function WeightTraining(inputRow, actualOutputs, expectedOutput, layer1Outputs, layer2Outputs) {
    let totalError = 0;
    let crossEntropy = 0;

    // Calculate the error gradients for the output layer
    let gradientErrorsOutput = [];
    for (let k = 0; k < 3; k++) { 
        let ek = expectedOutput[k] - actualOutputs[k];
        let ek2 = Math.pow(ek, 2);
        crossEntropy += expectedOutput[k] * Math.log(actualOutputs[k]);

        // Check for NaN and infinity values in the output
        if (isNaN(actualOutputs[k]) || !isFinite(actualOutputs[k])) {
            console.error(`Invalid output encountered at output layer (neuron ${k}). Check for extreme values. Actual Output: ${actualOutputs[k]}`);
            return; 
        }

        let gradientErrork = actualOutputs[k] * (1 - actualOutputs[k]) * ek;
        gradientErrorsOutput.push(gradientErrork);

        for (let j = 0; j < numberOfNeurons; j++) {
            let deltaWjk = learningRate * layer2Outputs[k] * gradientErrorsOutput[k];

            weightsForOutput[j][k] += deltaWjk;
        }

        let thresholdSign;
        if(thresholdsForOutput[k]){
            thresholdSign = 1;
        } else {
            thresholdSign = -1;
        }

        let deltaTheta = learningRate * thresholdSign * gradientErrork;

        thresholdsForOutput[k] += deltaTheta;

        totalError += ek2;
    }


    // Calculate the error gradients for the hidden layer
    for (let i = 0; i < numberOfNeurons; i++) {
        let sumGradientErrorsOutput = 0;
        for (let k = 0; k < expectedOutput.length; k++) {
            sumGradientErrorsOutput += gradientErrorsOutput[k] * weightsForOutput[i][k];
        }

        let gradientErrori = layer1Outputs[i] * (1 - layer1Outputs[i]) * sumGradientErrorsOutput;

        for (let j = 0; j < 2; j++) {
            let x;
            if(j == 0){
                x = getSweetnessValue(inputRow.input[0]);
            } else{
                x = getColorValue(inputRow.input[1]);
            }
            let deltaWij = learningRate * x * gradientErrori;

            weightsForHidden[j][i] += deltaWij;
        }

        let thresholdSign;
        if(thresholdsForHidden[i]){
            thresholdSign = 1;
        } else {
            thresholdSign = -1;
        }

        let deltaTheta = learningRate * thresholdSign * gradientErrori;
        thresholdsForHidden[i] += deltaTheta;
    }

    crossEntropy *= -1;
    return {totalError, crossEntropy, weightsForHidden, weightsForOutput, thresholdsForHidden, thresholdsForOutput};
}
 