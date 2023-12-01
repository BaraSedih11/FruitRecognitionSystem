let trainingData = [];

function toggleDataInput() {
    const dataChoice = document.getElementById('data-input-choice');
    const dynamicData = document.getElementById('manual-entry');
    const fileData = document.getElementById('file-entry');

    if (dataChoice.value === 'manual') {
        dynamicData.style.display = 'block';
        fileData.style.display = 'none';
    } else {
        dynamicData.style.display = 'none';
        fileData.style.display = 'block';
    }
}

// Example function to predict the fruit type (replace with your actual prediction logic)
function predictFruitType(sweetness, color) {
    if (color === 'red' && sweetness !== 0) {
        return 'apple';
    } else if (color === 'yellow') {
        return 'banana';
    } else if (color === 'darkBlue') {
        return 'grape';
    } else if (color === 'orange'){
        return 'orange';
    }
}


function trainNeuralNetwork() {
    const dataChoice = document.getElementById('data-input-choice');
    const learningRate = parseFloat(document.getElementById('learning-rate').value);
    const maxEpochs = parseInt(document.getElementById('max-epochs').value);
    const numberOfNeurons = parseInt(document.getElementById('neorons').value);

    if (isNaN(learningRate) || isNaN(maxEpochs) || isNaN(numberOfNeurons)) {
        alert('Please enter valid training configuration.');
        return;
    }

    if (dataChoice.value === 'file') {
        const fileInput = document.getElementById('data-file');
        const file = fileInput.files[0];

        if (file) {
            const reader = new FileReader();

            reader.onload = function (e) {
                const fileContent = e.target.result;

                // Split the file content into lines
                const lines = fileContent.split('\n');

                console.log('Number of lines:', lines.length);

                // Process each line
                lines.forEach((line, index) => {
                    console.log(`Processing line ${index + 1}: ${line}`);

                    // Split the line into data values (assuming space-separated values)
                    const values = line.trim().split(/\s+/);

                    console.log('Values:', values);

                    // Check if expected values are present
                    if (values.length >= 3) {
                        const sweetnessData = parseFloat(values[0]);
                        const colorData = values[1].trim();
                        const expectedOutputData = values[2].trim();

                        console.log('sweetnessData:', sweetnessData);
                        console.log('colorData:', colorData);
                        console.log('expectedOutputData:', expectedOutputData);

                        if (!isNaN(sweetnessData) && !isNaN(expectedOutputData)) {
                            // Create an object for each line
                            const inputData = {
                                sweetness: sweetnessData,
                                color: colorData,
                                expectedOutput: expectedOutputData,
                                learningRate: learningRate,
                                maxEpochs: maxEpochs,
                                numberOfNeurons: numberOfNeurons
                                // Add more properties as needed
                            };

                            // Push the data to the trainingData array
                            trainingData.push(inputData);

                            // Print the input data to the console (adjust this part based on your needs)
                            console.log('Training Data:', inputData);
                        }
                    }
                });
            };

            reader.readAsText(file);
        }
    }else {
        const sweetnessData = parseFloat(document.getElementById('sweetness').value);
        const colorData = document.getElementById('color').value;
        const expectedOutputData = parseFloat(document.getElementById('expected').value);

        const inputData = {
            sweetness: isNaN(sweetnessData) ? 0 : sweetnessData,
            color: colorData,
            expectedOutput: isNaN(expectedOutputData) ? 0 : expectedOutputData,
            learningRate: learningRate,
            maxEpochs: maxEpochs,
            numberOfNeurons: numberOfNeurons
            // Add more properties as needed
        };

        // Push the data to the trainingData array
        trainingData.push(inputData);

        // Print the input data to the console (adjust this part based on your needs)
        console.log('Training Data:', inputData);
    }
}
