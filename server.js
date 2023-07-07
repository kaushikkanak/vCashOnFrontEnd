const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const path = require('path');
const fs = require('fs');

app.get('/', function(request, response) {
    const filePath = path.resolve(__dirname, './build', 'index.html');
    fs.readFile(filePath, 'utf8', function (err,data) {
       if (err) {
          return console.log(err);
       }
        const result = data.replace(/\$OG_IMAGE/g, ''); response.send(result);
    });
});

app.use(express.static(path.resolve(__dirname, './build')));

app.get('*', function(request, response) {
    const filePath = path.resolve(__dirname, './build', 'index.html');
    fs.readFile(filePath, 'utf8', function (err,data) {
        if (err) { return console.log(err);}
        const result = data.replace(/\$OG_IMAGE/g, ''); response.send(result);
    });
});

app.listen(port, () => console.log(`Listening on port ${port}`));