const path = require('path');

exports.startPage = (req, res) => {
    res.render(path.join(__dirname, '..', '/public', '/views', '/mainPage.html') );
}

