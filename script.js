class Film {
    constructor(
        id,
        title,
        date,
        image_url,
        directors,
        actors,
        genres,
        rated,
        score,
        duration,
        origin,
        boxoffice,
        synopsis,
        index
    ) {
        this.id = id;
        this.title = title;
        this.date = date;
        this.image_url = image_url;
        this.directors = directors;
        this.actors = actors;
        this.genres = genres;
        this.rated = rated;
        this.score = score;
        this.duration = duration;
        this.orgin = origin;
        this.boxoffice = boxoffice;
        this.synopsis = synopsis;
        this.index = index;
    }
}

class Carrousel {
    constructor(carrousel, films) {
        this.films = films;
        this.carrousel = carrousel;
        const visibles = 4
        let index = visibles - 1

        let nextButton = document.createElement('button')
        let container = document.createElement('div')
        let prevButton = document.createElement('button')

        let prevImg = document.createElement("img")
        let nextImg = document.createElement("img")
        prevImg.setAttribute("src", "media/moins.png")
        nextImg.setAttribute("src", "media/plus.png")

        prevButton.appendChild(prevImg)
        nextButton.appendChild(nextImg)


        prevButton.classList.add("previous")
        container.classList.add("carrouselContainer")
        nextButton.classList.add("next")

        carrousel.appendChild(prevButton)
        carrousel.appendChild(container)
        carrousel.appendChild(nextButton)
        prevButton.disabled = true

        for (i = 0; i < films.length; i++) {
            let element = films[i]
            let div = createSlide(container, element.id, element.image_url)
            if (i < visibles) {
                div.classList.add("active")
            }
        }

        let slides = container.children
        let elements = carrousel.getElementsByClassName("active")
        let actives = Object.values(elements)
        console.log(slides)
        console.log(actives)

        nextButton.addEventListener("click", function () {
            index++
            if (index == films.length - 1) {
                nextButton.disabled = true
            }
            if (index >= visibles) {
                prevButton.disabled = false
            }
            let first = actives.shift();
            first.classList.remove("active");

            slides[index].classList.add("active");
            actives.push(slides[index])
        })
        prevButton.addEventListener("click", function () {
            index--
            if (index == visibles - 1) {
                prevButton.disabled = true
            }
            if (index < films.length) {
                nextButton.disabled = false
            }
            let last = actives.pop();
            last.classList.remove("active");

            slides[index - (visibles - 1)].classList.add("active");
            actives.unshift(slides[index - (visibles - 1)])
        })
    }
}

let bestMoviesDict = {};

let nombreParCaroussel = 7
let carrousel1 = document.getElementById("carrousel1")
let carrousel2 = document.getElementById("carrousel2")
let carrousel3 = document.getElementById("carrousel3")
let carrousel4 = document.getElementById("carrousel4")
let bestMovies = []
let cat1 = []
let cat2 = []
let cat3 = []
let starDiv = document.getElementById("bestFilm");

let triche = [
    "Action",
    "Adult",
    "Adventure",
    "Biography",
    "Comedy",
    "Crime",
    "Documentary",
    "Drama",
    "Family",
    "Fantasy",
    "Film-Noir",
    "History",
    "Horror",
    "Music",
    "Musical",
    "Mystery",
    "News",
    "Reality-TV",
    "Romance"
]

let films1 = "http://localhost:8000/api/v1/titles/?sort_by=-imdb_score";
let films2 = categorie()
let films3 = categorie()
let films4 = categorie()

window.addEventListener("load", function () {
    /**
     * Prépare les requêtes à partir de catégories aléatoires
     */

    getFilms(films1, bestMovies, nombreParCaroussel + 1);
    getFilms(films2, cat1, nombreParCaroussel);
    getFilms(films3, cat2, nombreParCaroussel);
    getFilms(films4, cat3, nombreParCaroussel);
    setTimeout(affichage, 2000);
})

function affichage() {
    /**
     * Manage l'ordre des fonctions
     */

    triage(bestMovies)
    triage(cat1)
    triage(cat2)
    triage(cat3)
    let bestMovie = bestMovies.shift();
    addFilm(starDiv, bestMovie);
    console.log(bestMovies)
    new Carrousel(carrousel1, bestMovies)
    new Carrousel(carrousel2, cat1)
    new Carrousel(carrousel3, cat2)
    new Carrousel(carrousel4, cat3)
    addClicker();
}


function categorie() {
    let link = "http://localhost:8000/api/v1/titles/?sort_by=-imdb_score&genre="
    let cat = triche.splice(Math.random() * triche.length, 1)
    return link + cat
}

function getFilms(url, filmTab, number, nombreRequete = 0) {
    fetch(url)
        .then(function (res) {
            if (res.ok) {
                return res.json();
            }
        })
        .then(function (request) {
            console.log(request.count)
            if (request.count < 7) {
                let cat = categorie()
                return getFilms(cat, filmTab, number)
            }
            nextUrl = request.next;
            for (i = 0; i < request.results.length; i++) {
                if (nombreRequete >= number) { break; }
                createFilm(request.results[i].url, nombreRequete, filmTab);
                nombreRequete++;
            }
            if (nombreRequete < number) {
                return getFilms(nextUrl, filmTab, number, nombreRequete);
            }
        })
        .catch(function (err) {
            console.log(err);
        })
}


function addFilm(container, films) {
    let div = createSlide(container, films.id, films.image_url)
    div.classList.add('active')
}


function createSlide(container, id, url) {
    let div = document.createElement("div");
    div.setAttribute("id", id);
    div.classList.add("slide");

    let img = document.createElement("img");
    img.setAttribute("src", url)

    container.appendChild(div);
    div.appendChild(img);

    return div
}


function addClicker() {
    slides = document.getElementsByClassName("slide");
    for (i = 0; i < slides.length; i++) {
        let id = slides[i].id
        slides[i].addEventListener('click', function () {
            let movie = bestMoviesDict[id];
            modal = document.getElementById("modal");
            modal.style.display = "block";
            document.getElementById("title").innerHTML = movie.id;

            let modalImg = document.getElementById("modalImg");
            modalImg.setAttribute("src", movie.image_url);

            document.getElementById("genre").innerHTML = movie.genres;
        })
    }
}


function createFilm(filmUrl, requete, tab) {
    fetch(filmUrl)
        .then(function (res) {
            if (res.ok) {
                return res.json();
            }
        })
        .then(function (request) {
            let movie = request;
            let film = new Film(
                movie.id,
                movie.original_title,
                movie.date,
                movie.image_url,
                movie.directors,
                movie.actors,
                movie.genres,
                movie.rated,
                movie.score,
                movie.duration,
                movie.origin,
                movie.boxoffice,
                movie.synopsis,
                requete
            )
            tab.push(film);
            bestMoviesDict[movie.id] = film;
        })
        .catch(function (err) {
            console.log(err);
        })
}


function triage(tab) {
    tab.sort(function (a, b) {
        return a.index - b.index;
    })
}
