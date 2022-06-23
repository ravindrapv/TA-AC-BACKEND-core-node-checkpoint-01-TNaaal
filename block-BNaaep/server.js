let http = require('http');
let fs = require('fs');
let qs = require('querystring');
let url = require('url');
let server = http.createServer(handleRequest);
function handleRequest(req, res) {
  var parsedUrl = url.parse(req.url, true);
  var store = '';
  req.on('data', (chunk) => {
    store += chunk;
  });
  req.on('end', () => {
  if (req.method === 'GET' && req.url === '/') {
    fs.readFile('./index.html', (err, content) => {
      res.setHeader('Content-Type', 'text/html');
      res.write(content);
      res.end();
    });
  } else if (req.method === 'GET' && req.url === '/about') {
    fs.readFile('./about.html', (err, content) => {
      res.setHeader('Content-Type', 'text/html');
      res.write(content);
      res.end();
    });
  } else if (req.url.split('.').pop() === 'css') {
    fs.readFile(__dirname + req.url, (err, content) => {
      if (err) return console.log(err);
      res.setHeader('Content-Type', 'text/css');
      res.end(content);
    });
  } else if (req.url.split('.').pop() === 'jpg') {
    fs.readFile(__dirname + req.url, (err, content) => {
      if (err) return console.log(err);
      res.setHeader('Content-Type', 'image/jpg');
      res.end(content);
    });
  } else if (req.url.split('.').pop() === 'png') {
    fs.readFile(__dirname + req.url, (err, content) => {
      if (err) return console.log(err);
      res.setHeader('Content-Type', 'image/png');
      res.end(content);
    });
  } else if (req.method === 'GET' && req.url === '/contact') {
    fs.readFile('./contactform.html', (err, content) => {
      res.setHeader('Content-Type', 'text/html');
      res.end(content);
    });
  }
  
   else if(req.method === 'POST' && req.url === '/form') {
      // console.log(req.headers['content-type']);
  
      let parseData = qs.parse(store);
      // console.log(parseData);
      if(!parseData.username){
        return res.end("user name is required");
      }
      fs.open(
        __dirname + '/contacts/' + parseData.username + '.json',
        'wx',
        (err, fd) => {
          if (err) return res.end('username already taken');
          fs.write(fd, JSON.stringify(parseData), (err) => {
            if (err) return console.log(err);
            fs.close(fd, () => {
              res.end('contacts saved successfully');
            });
          });
        }
      );
    }
  else if(req.method === 'GET' && parsedUrl.pathname === '/users') {
      var username = parsedUrl.query.username;
      console.log(username);
      fs.readFile(
        __dirname + '/contacts/' + username + '.json',
        (err, content) => {
          res.setHeader('Content-Type', 'text/html');
          let parseData = JSON.parse(content);

          res.end(`<h1>${parseData.name}</h1> 
              <h2>${parseData.email}</h2>
                <h2>${parseData.username}</h2>
                <h2>${parseData.age}</h2>
                <h2>${parseData.bio}</h2>`);
        }
      );
    } else {
      res.end("page not found");
    }
  });
} 

server.listen(5000, () => {
  console.log('port 5k started');
});