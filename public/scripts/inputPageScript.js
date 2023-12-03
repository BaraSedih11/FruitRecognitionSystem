let trainingData = [];
let learningRate;
let numberOfNeurons;
let maxEpochs;
let activationFunction;

function sendDataToServer() {
    console.log('Sending data to the server...', { trainingData, learningRate, numberOfNeurons, maxEpochs, activationFunction });

    fetch('/main/sendData', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ trainingData, learningRate, numberOfNeurons, maxEpochs, activationFunction }),
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

function getTrainingData() {
    const fileInput = document.getElementById('data-file');
    
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = function (event) {
            try {
                const content = event.target.result;
                const lines = content.split('\n');

                const formattedTrainingData = lines.map(line => {
                    const [sweetness, color, output] = line.trim().split(' ');
                    return {
                        input: [parseFloat(sweetness), color],
                        output: output
                    };
                });

                resolve(formattedTrainingData);
            } catch (error) {
                reject(error);
            }
        };

        reader.onerror = function (error) {
            reject(error);
        };

        reader.readAsText(fileInput.files[0]);
    });
}

document.getElementById('submit').addEventListener('click', function() {
    const learningRateInput = document.getElementById('learning-rate');
    const neuronsInput = document.getElementById('neurons');
    const maxEpochsInput = document.getElementById('max-epochs');
    const activationFunctionInput = document.getElementById('activationFunction');

    learningRate = parseFloat(learningRateInput.value);
    numberOfNeurons = parseInt(neuronsInput.value);
    maxEpochs = parseInt(maxEpochsInput.value);
    activationFunction = activationFunctionInput.options[activationFunctionInput.selectedIndex].text;

    getTrainingData().then(data => {
        trainingData = data;
        sendDataToServer();
    }).catch(error => {
        console.error('Error reading training data:', error);
    });
});
