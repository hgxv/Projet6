let modal = document.getElementById("modal");
let modalCloser = document.getElementsByClassName("close")[0];

modalCloser.onclick = function () {
    modal.style.display = "none";
}

window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

function addModal() {
    /**
     * Pour chaque objet div possédant la classe slide, 
     * ajoute un évènement onclick qui ouvre une modale
     * avec les données du film.
     */

    slides = document.getElementsByClassName("slide");
    for (i = 0; i < slides.length; i++) {
        let id = slides[i].id
        slides[i].children[0].addEventListener('click', function () {
            let movie = moviesDict[id]
            document.getElementById("modal").style.display = "block";

            for (let property in movie) {
                if (property != "id" && property != "image_url" && property != "index") {
                    document.getElementById(property).innerHTML = movie[property]
                }
            }

            document.getElementById("modalImg").setAttribute("src", movie.image_url);
        })
    }
}
