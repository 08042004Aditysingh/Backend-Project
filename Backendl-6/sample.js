import express from "express";

import axios from "axios";

const app = express();

app.get("/githubdata", (req, res) => {
    axios.get("https://api.github.com/users/hiteshchoudhary")
        .then((response) => {
            console.log(response.data);
            res.send(response.data.name);
        })
        .catch((error) => {
            console.log(error);
            res.send(error);
        })
})

app.listen(3000,()=>{
    console.log(`Server is ready to serve at http://localhost:${3000}/githubdata`)
})