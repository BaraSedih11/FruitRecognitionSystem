const path = require('path');

exports.startInputPage = (req, res) => {
    res.render(path.join(__dirname, '..', '/public', '/views', '/mainPage.html') );
}
exports.startOutputPage = (req, res) => {
    res.render(path.join(__dirname, '..', '/public', '/views', '/outputPage.html') );
}

