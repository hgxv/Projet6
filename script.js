let test = " Saucisse";
let carrousel1 = document.getElementsByClassName("carrousel_1")[0];

window.addEventListener("load", function(result) {
    fetch("http://localhost:8000/api/v1/titles/?sort_by=-imdb_score")
    .then(function(res) {
        if (res.ok) {
            return res.json();
        }
    })
    .then(function(request) {
        carrousel1.innerHTML = ""
        for (index = 0; index < request.results.length; index++) {
            let node = document.createElement("div");
            node.classList.add("slide");
            let id = request.results[index].id;
            node.setAttribute("id", id);
            carrousel1.appendChild(node);
    
            let nodeImg = document.createElement("img");
            nodeImg.setAttribute("src", request.results[index].image_url);
            document.getElementById(id).appendChild(nodeImg);
        }})
    .catch(function(err) {
        console.log(err);
    })    
})
