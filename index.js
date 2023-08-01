const http = require("http");
const fs = require("fs");
const querystring = require('querystring');

const getViewUrl = (url)=>{
    if(url == '/'){
        return `views/index.html`;
    }
    else if(url == '/project/new'){
        return `views/addProject.html`;
    }
    return `views${url}.html`;
};

const myServer = http.createServer((req, res) => {

    if (req.method === 'POST' && req.url === '/projects') {
        // Handle the incoming POST data
        let body = '';
        req.on('data', (chunk) => {
        body += chunk.toString();
        });

        req.on('end', () => {
        // Parse the POST data using querystring module
        const postData = querystring.parse(body);

        // Redirect to the result page along with the data
        const query = `name=${postData.name}&description=${postData.description}`;
        res.writeHead(302, { 'Location': `/projects?${query}` });
        res.end();
        });

  } else if ( req.url.startsWith('/projects')) {
    // Serve the result.html page for GET requests to /result
    fs.readFile('views/projects.html', 'utf8', (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
      } else {
        // Extract name and description from the query parameters
        const params = new URLSearchParams(req.url.split('?')[1]);
        const name = params.get('name');
        const description = params.get('description');

        // Replace placeholders in the result.html page with the data
        data = data.replace('{{name}}', name).replace('{{description}}', description);

        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
      }
    });
  } else {
        let viewUrl = getViewUrl(req.url);
        fs.readFile(viewUrl, (error, data) => {
        if(error){
            res.writeHead(404);
            res.write("<h1>File not Found</h1>");
        } else {
            res.writeHead(200, {
                "Content-Type": "text/html"
            })
            res.write(data);
        }
        res.end();
    })
  }

    
    
});

myServer.listen(8000, ()=> console.log('Server started!'));

