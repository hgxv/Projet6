class Film {
    constructor(id, url, title, year, image_url, directors, actors, genres) {
        this.id = id;
        this.url = url;
        this.title = title;
        this.year = year;
        this.image_url = image_url;
        this.directors = directors;
        this.actors = actors;
        this.genres = genres;
    }
}

let bestMovies = [];
let bestMoviesDict = {};
let carrousel1 = document.getElementsByClassName("carrousel_1")[0];
let starDiv = document.getElementById("bestFilm");
let nextUrl = "http://localhost:8000/api/v1/titles/?sort_by=-imdb_score";

window.addEventListener("load", function() {
    getFilms(nextUrl);
})

function getFilms(nextUrl) {
    fetch(nextUrl)
    .then(function(res) {
        if (res.ok) {
            return res.json();
        }
    })
    .then(function(request) {
        nextUrl = request.next;

        for (index = 0; index < request.results.length; index++) {
            movie = request.results[index];
            if (movie.votes > 50000) {
                let film = new Film(
                    movie.id,
                    movie.url,
                    movie.title,
                    movie.year,
                    movie.image_url,
                    movie.directors,
                    movie.actors,
                    movie.genres
                )
                bestMovies.push(film)
                bestMoviesDict[movie.id] = film;
                if (bestMovies.length == 6) { 
                    break;
                }
            }
        }
        if (bestMovies.length != 6) {
            return getFilms(nextUrl);
        }
        else {
            let bestMovie = bestMovies.shift();
            console.log(typeof(bestMovie));
            console.log(typeof(bestMovies));
            addFilms(starDiv, bestMovie);
            addFilms(carrousel1, bestMovies);
            addClicker();
        }
    })
    .catch(function(err) {
        console.log(err);
    })    
}


function addFilms(container, films) {
    console.log(container)
    switch (container) {
        case starDiv:
            let node = document.createElement("div");
    
            let id = films.id;
            node.setAttribute("id", id);
            container.appendChild(node);
    
            let nodeImg = document.createElement("img");
            nodeImg.classList.add("slide");
            nodeImg.setAttribute("src", films.image_url);
            node.appendChild(nodeImg);
            break;

        default:
            for (index = 0; index < films.length; index++) {
                let node = document.createElement("div");
        
                let id = films[index].id;
                node.setAttribute("id", id);
                container.appendChild(node);
        
                let nodeImg = document.createElement("img");
                nodeImg.classList.add("slide");
                nodeImg.setAttribute("src", films[index].image_url);
                node.appendChild(nodeImg);
            }
            break;
    }
}


function addClicker() {
    slides = document.getElementsByClassName("slide");
    for (i = 0; i < slides.length; i++) {
        let id = slides[i].parentElement.id
        slides[i].addEventListener('click', function(){
            modal = document.getElementById("modal");
            modal.style.display = "block";
            document.getElementById("title").innerHTML = bestMoviesDict[id].title;
            document.getElementById("modalImg").setAttribute("src", bestMoviesDict[id].image_url) ;
        })
    }
}
