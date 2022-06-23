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
        this.index = 4

        let actives = carrousel.getElementsByClassName("active")
        let nextButton = document.createElement('button')
        let container = document.createElement('div')
        let prevButton = document.createElement('button')

        prevButton.classList.add("previous")
        container.classList.add("carrouselContainer")
        nextButton.classList.add("next")

        let nextText = document.createTextNode(">")
        nextButton.appendChild(nextText)
        let prevText = document.createTextNode("<")
        prevButton.appendChild(prevText)

        carrousel.appendChild(prevButton)
        carrousel.appendChild(container)
        carrousel.appendChild(nextButton)

        films.forEach(element => {
            let div = createSlide(container, element.id, element.image_url)
            if (element.index <= index) {
                div.classList.add("active")
            }
        });

        let slides = container.children

        console.log(actives)
        nextButton.addEventListener("click", function() {
            this.index++
            let first = actives.shift();
            first.classList.remove("active");

            slides[this.index].classList.add(actives);
            actives.push(slides[this.index])
            
        })
        prevButton.addEventListener("click", function() {
            this.index--
            let last = actives.pop();
            last.classList.remove("active");

            slides[this.index].classList.add(actives);
            actives.push(slides[this.index])
        })
    }
}

let bestMovies = [];
let bestMoviesDict = {};
let carrousel1 = document.getElementById("carrousel1");
let starDiv = document.getElementById("bestFilm");
let nextUrl = "http://localhost:8000/api/v1/titles/?sort_by=-imdb_score";

window.addEventListener("load", function() {
    getFilms(nextUrl);
    setTimeout(affichage, 2000);
})

function affichage() {
    bestMovies.sort(function(a, b) {
        return a.index - b.index;
    })
    let bestMovie = bestMovies.shift();
    addFilms(starDiv, bestMovie);
    let carrousel = new Carrousel(carrousel1, bestMovies)
    //addFilms(carrousel1, bestMovies);
    addClicker();
}

function getFilms(nextUrl, nombreRequete=0) {
    fetch(nextUrl)
    .then(function(res) {
        if (res.ok) {
            return res.json();
        }
    })
    .then(function(request) {
        nextUrl = request.next;
        for (index = 0; index < request.results.length; index++) {
            if (nombreRequete >= 8) { break; }
            createFilm(request.results[index].url, nombreRequete);
            nombreRequete++;
        }
        if (nombreRequete < 8) {
            return getFilms(nextUrl, nombreRequete);
        }
    })
    .catch(function(err) {
        console.log(err);
    })
}


function addFilms(container, films) {
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
        slides[i].addEventListener('click', function(){
            let movie = bestMoviesDict[id];
            modal = document.getElementById("modal");
            modal.style.display = "block";
            document.getElementById("title").innerHTML = movie.title;

            let modalImg = document.getElementById("modalImg");
            modalImg.setAttribute("src", movie.image_url);

            document.getElementById("genre").innerHTML = movie.genres;
        })
    }
}


function createFilm(filmUrl, requete) {
    fetch(filmUrl)
    .then(function(res) {
        if (res.ok) {
            return res.json();
        }
    })
    .then(function(request) {
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
        bestMovies.push(film);
        bestMoviesDict[movie.id] = film;
    })
    .catch(function(err) {
        console.log(err);
    })  
}

