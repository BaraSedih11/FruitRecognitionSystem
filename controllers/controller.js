const path = require('path');

exports.getInputPage = (req, res) => {
    res.render(path.join(__dirname, '..', '/public', '/views', '/inputPage.ejs'));
};

exports.getOutputPage = (req, res) => {
    res.render(path.join(__dirname, '..', '/public', '/views', '/outputPage.ejs'), {
        trainingData : req.session.trainingData,
        learningRate : req.session.learningRate,
        maxEpochs : req.session.maxEpochs,
        numberOfNeurons : req.session.numberOfNeurons,
        activationFunction : req.session.activationFunction,
    });
};



exports.sendData = (req, res) => {
    const trainingData = req.body.trainingData;
    const learningRate = req.body.learningRate;
    const maxEpochs = req.body.maxEpochs;
    const numberOfNeurons = req.body.numberOfNeurons;
    const activationFunction = req.body.activationFunction;

    // Check if trainingData is an object and not empty before storing in the session
    if (trainingData && typeof trainingData === 'object' && Object.keys(trainingData).length > 0) {
        req.session.trainingData = trainingData;
        req.session.learningRate = learningRate;
        req.session.numberOfNeurons = numberOfNeurons;
        req.session.maxEpochs = maxEpochs;
        req.session.activationFunction = activationFunction;

        // Send response with the required data
        res.json({
            trainingData: req.session.trainingData,
            learningRate: req.session.learningRate,
            numberOfNeurons: req.session.numberOfNeurons,
            maxEpochs: req.session.maxEpochs,
            activationFunction: req.session.activationFunction,
        });
        
    } else {
        console.error('Error: Empty or invalid training data received.');
        res.status(400).send('Bad Request');
    }
};



