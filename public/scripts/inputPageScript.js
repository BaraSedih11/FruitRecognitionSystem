let trainingData = [];

function sendDataToServer() {
    console.log('Sending data to the server...');

    fetch('/main/sendData', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ trainingData }),
    })
    .then(response => {
        if (response.ok) {
            console.log('Data sent successfully. Redirecting to /main/output.');
            window.location.href = '/main/output';
        } else {
            console.error('Failed to send data. Server responded with:', response.status, response.statusText);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function trainNeuralNetwork() {
    const learningRateInput = document.getElementById('learning-rate');
    const maxEpochsInput = document.getElementById('max-epochs');
    const numberOfNeuronsInput = document.getElementById('neorons');

    if (!learningRateInput || !maxEpochsInput || !numberOfNeuronsInput) {
        console.error('One or more input elements not found');
        return;
    }

    const learningRate = parseFloat(learningRateInput.value);
    const maxEpochs = parseInt(maxEpochsInput.value);
    const numberOfNeurons = parseInt(numberOfNeuronsInput.value);

    const fileInput = document.getElementById('data-file');
    const file = fileInput.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function (e) {
            const fileContent = e.target.result; 

            const lines = fileContent.split('\n');

            console.log('Number of lines:', lines.length);

            lines.forEach((line, index) => {
                console.log(`Processing line ${index + 1}: ${line}`);

                const values = line.trim().split(/\s+/);

                console.log('Values:', values);

                if (values.length >= 3) {
                    const sweetnessData = parseFloat(values[0]);
                    const colorData = values[1].trim();
                    const expectedOutputData = values[2].trim();

                    console.log('sweetnessData:', sweetnessData);
                    console.log('colorData:', colorData);
                    console.log('expectedOutputData:', expectedOutputData);

                    if (!isNaN(sweetnessData) && !isNaN(expectedOutputData)) {
                        const inputData = {
                            sweetness: sweetnessData,
                            color: colorData,
                            expectedOutput: expectedOutputData,
                            learningRate,
                            maxEpochs,
                            numberOfNeurons
                        };

                        trainingData.push(inputData);

                        console.log('Training Data:', inputData);
                    }
                }
            });
        };

        reader.readAsText(file);
    }

    sendDataToServer();
}
