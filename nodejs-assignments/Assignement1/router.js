const users = ["User1","User2"];
const routeHandler = (req,res) => {
    const url = req.url;
    const method = req.method;
    console.log("Server has Started in https:\\localhost:3000");
    if(url=="/"){    
        res.setHeader("Content-Type", "text/html");    
        res.write("<html>");
        res.write("<head><title>Enter Your Name</title></head>");
        res.write("<body>");
        res.write("<h1> Welcome to NodeJs Assignment One</h1>");
        res.write("<form action='/create-user' method='POST'>");
        res.write("<input type='text' name='username' placeholder='Enter Your Name'/><br>");
        res.write("<button type='submit'>Submit</button>");
        res.write("</form></body>");
        res.write("</html>");
        return res.end();
    }

    if(url=="/users"){
        res.setHeader("Content-Type", "text/html");   
        res.write("<html>");
        res.write("<head><title>Users List</title></head>");
        res.write("<body><ul>");
        for(let i = 0 ; i < users.length; i++){
            res.write("<li>"+users[i]+"</li>");
        }
        res.write("</ul></body>");
        res.write("</html>")
        return res.end();
    }

    if(url=="/create-user" && method === 'POST'){
        const body = [];
        req.on('data', chunck => {
            body.push(chunck);
        });
        return req.on('end',() => {
            const data = Buffer.concat(body).toString();
            users.push(data.split("=")[1]);
            console.log(data);
            res.statusCode = 302;
            res.setHeader('Location','/users')
            return res.end();
        })
    }
}

module.exports = routeHandler;