const path = require('path');

exports.getInputPage = (req, res) => {
    res.render(path.join(__dirname, '..', '/public', '/views', '/inputPage.ejs'));
};

exports.getOutputPage = (req, res) => {
    const trainingData = req.session.trainingData;
    console.log('Training Data: ', trainingData);
    res.render(path.join(__dirname, '..', '/public', '/views', '/outputPage.ejs'), {trainingData});
};

exports.sendData = (req, res) => {
    const trainingData = req.body.trainingData;
    req.session.trainingData = trainingData;

    console.log('Training Data: ', trainingData);

    res.render(path.join(__dirname, '..', '/public', '/views', '/outputPage.ejs'),
        {
            trainingData: req.session.trainingData,
        });
}
