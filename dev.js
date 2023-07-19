const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('¡Hola, mundo!');
});

app.listen(3000, () => {
  console.log('Servidor escuchando en el puerto 3000');
});

app.get('/home', (req, res) => {
  res.send(`Bienvenido al mejor sitio de películas en la región`);
});

app.get('/api/movie', (req, res) => {
  res.send(`EL CATÁLOGO DE PELÍCULAS AÚN ESTÁ EN CONSTRUCCIÓN.`);
});

app.get('/api/cines', (req, res) => {
  res.send(`EL CATÁLOGO DE CINES AÚN ESTÁ EN CONSTRUCCIÓN.`);
});

app.get('/api/movie/expoferia', (req, res) => {
  res.send(`GRAN ESTRENO DE LA NUEVA TEMPORADA DE BETTY LA FEA <br><img src="/images/betty.png" width="500">`);
});

app.get('/images/betty.png', (req, res) => {

    const fs = require("fs");
    const path = require("path");
    const url = require("url");
    
    
    const request = url.parse(req.url, true);

    const action = request.pathname;
    const filePath = "public/images/betty.png";
    fs.exists(filePath, function (exists) {
      if (!exists) {
          res.writeHead(404, {"Content-Type": "text/plain"});
          res.end("404 Not Found");
          return;
      }

      const ext = path.extname(action);
      let contentType = "text/plain";
      if (ext === ".png") {
          contentType = "image/png";
      }
      res.writeHead(200, {"Content-Type": contentType});

      fs.readFile(filePath,function (err, content) {res.end(content);});
    });
});



const winston = require('winston')
const remoteLog = new winston.transports.Http({
    host: "localhost",
    port: 3001,
    path: "/errors"
})

const consoleLog = new winston.transports.Console()

module.exports = {
    requestLogger: createRequestLogger([consoleLog]),
    errorLogger: createErrorLogger([remoteLog, consoleLog])
}

function createRequestLogger(transports) {
    const requestLogger = winston.createLogger({
        format: getRequestLogFormatter(),
        transports: transports
    })

    return function logRequest(req, res, next) {
        requestLogger.info({req, res})
        next()
    }
}

function createErrorLogger(transports) {
    const errLogger = winston.createLogger({
        level: 'error',
        transports: transports
    })

    return function logError(err, req, res, next) {
        errLogger.error({err, req, res})
        next()
    }
}

function getRequestLogFormatter() {
    const {combine, timestamp, printf} = winston.format;

    return combine(
        timestamp(),
        printf(info => {
            const {req, res} = info.message;
            return `${info.timestamp} ${info.level}: ${req.hostname}${req.port || ''}${req.originalUrl}`;
        })
    );
}