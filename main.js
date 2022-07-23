let moviesDict = {};
let nombreParCaroussel = 7
let is_finished = 0
let carrousel1 = document.getElementById("carrousel1")
let carrousel2 = document.getElementById("carrousel2")
let carrousel3 = document.getElementById("carrousel3")
let carrousel4 = document.getElementById("carrousel4")
let bestMovies = []
let cat1 = []
let cat2 = []
let cat3 = []
let starDiv = document.getElementById("bestFilm");
let categories = [
    "http://localhost:8000/api/v1/titles/?sort_by=-imdb_score",
    "http://localhost:8000/api/v1/titles/?sort_by=-imdb_score&genre=Sci-Fi",
    "http://localhost:8000/api/v1/titles/?sort_by=-imdb_score&genre=Drama",
    "http://localhost:8000/api/v1/titles/?sort_by=-imdb_score&genre=Thriller",
]

let films1 = "http://localhost:8000/api/v1/titles/?sort_by=-imdb_score";


window.addEventListener("load", function () {
    /**
     * Prépare les requêtes à partir de catégories aléatoires
     */

    getFilms(categories[0], bestMovies, nombreParCaroussel + 1);
    getFilms(categories[1], cat1, nombreParCaroussel);
    getFilms(categories[2], cat2, nombreParCaroussel);
    getFilms(categories[3], cat3, nombreParCaroussel);

})


function affichage() {
    /**
     * Manage l'ordre des fonctions
     */

    //Trie les requêtes dans l'ordre où elles sont passées
    triage(bestMovies)
    triage(cat1)
    triage(cat2)
    triage(cat3)

    //Retire le meilleur film du tableau pour le mettre en vedette
    let bestMovie = bestMovies.shift();
    addFilm(starDiv, bestMovie);

    //Affiche les titres h2
    let titles = document.querySelectorAll("h2")
    for (let i = 0; i < titles.length; i++) {
        titles[i].style.display = "block";
    }

    //Prépare les carrousels
    new Carrousel(carrousel1, bestMovies)
    new Carrousel(carrousel2, cat1)
    new Carrousel(carrousel3, cat2)
    new Carrousel(carrousel4, cat3)

    //Prépare les modales
    addModal();
}


function getFilms(url, filmTab, nombreParCarrousel, nombreRequete = 0) {
    /**
     * Prépare un tableau de la classe Film()
     * 
     * @param {string} lien lien de la requête
     * @param {Object} Film données du film
     * @param {number} slides nombre de slide par carrousel
     * @param {number} requête nombre de requêtes déjà accumulées
     */

    fetch(url)
        .then(function (res) {
            if (res.ok) {
                return res.json();
            }
        })
        .then(function (request) {
            //Prépare la prochaine page si besoin
            nextUrl = request.next;
            for (i = 0; i < request.results.length; i++) {
                //Crée un objet Film
                if (request.results[i].votes >= 25000) {
                    createFilm(request.results[i].url, nombreRequete, filmTab);
                    nombreRequete++;
                }

                if (nombreRequete >= nombreParCarrousel) { break; }
            }
            if (nombreRequete < nombreParCarrousel) {
                //Si pas assez de requête à la fin de la page, charge la prochaine
                return getFilms(nextUrl, filmTab, nombreParCarrousel, nombreRequete);
            }
        })
        .catch(function (err) {
            console.log(err);
        })
}


function addFilm(container, film) {
    /**
     * Ajoute le film vedette
     * 
     * @param {HTMLBodyElement} div div contenant le carrousel
     * @param {Object} Film film vedette
     */
    let div = createSlide(container, film.id, film.image_url)
    div.classList.add("theBest")
    div.classList.add('active')
    div.style.width = "30%"
}


function createSlide(container, id, url) {
    /**
     * Crée une slide du carrousel
     * 
     * @param {HTMLBodyElement} div div contenant le carrousel
     * @param {string} Film.id Identifiant du film
     * @param {string} Film.image_url Url de l'image du film
     */

    //Crée un objet div avec pour id, l'identifiant du film, et la classe slide
    let div = document.createElement("div");
    div.setAttribute("id", id);
    div.classList.add("slide");

    //Crée un objet image avec l'affiche du film
    let img = document.createElement("img");
    img.setAttribute("src", url)
    img.setAttribute("alt", "Affiche du film")

    container.appendChild(div);
    div.appendChild(img);

    return div
}


function createFilm(filmUrl, requete, tab) {
    /**
     * Crée un objet Film et récupère ses données.
     * 
     * @param {string} url Url du film
     * @param {number} index Représente l'ordre de la requête
     * @param {Array.<Object>} Film  Tableau de la classe Film
     */

    fetch(filmUrl)
        .then(function (res) {
            if (res.ok) {
                return res.json();
            }
        })
        .then(function (movie) {
            let film = new Film(
                movie.id,
                movie.original_title,
                movie.year,
                movie.image_url,
                movie.directors,
                movie.actors,
                movie.genres,
                movie.rated,
                movie.imdb_score,
                movie.duration,
                movie.countries,
                movie.worldwide_gross_income,
                movie.description,
                requete
            )
            //Ajoute l'objet Film au tableau dédié
            tab.push(film);
            if (tab.length == 7) {
                is_finished++
            }
            if (is_finished == 4) {
                affichage()
            }

            //Lie l'objet Film à son id, pour plus tard créer des slides
            moviesDict[movie.id] = film;
        })
        .catch(function (err) {
            console.log(err);
        })
}


function triage(tab) {
    /**
     * Trie un tableau de Film dans l'ordre des requêtes
     * 
     * @param {Array.<Object>} Film objet Film
     */

    tab.sort(function (a, b) {
        return a.index - b.index;
    })
}
