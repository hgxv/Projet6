class Film {
    constructor(
        id,
        title,
        year,
        image_url,
        directors,
        actors,
        genres,
        rated,
        score,
        duration,
        origin,
        boxoffice,
        description,
        index
    ) {
        this.id = id;
        this.title = title;
        this.year = year;
        this.image_url = image_url;
        this.directors = directors;
        this.actors = actors;
        this.genres = genres;
        this.rated = rated;
        this.score = score;
        this.duration = duration;
        this.origin = origin;
        if (boxoffice == null) {
            this.boxoffice = "Pas de résultat connu"
        }
        else {
            this.boxoffice = Intl.NumberFormat('en-US').format(boxoffice) + "$"
        }
        this.synopsis = description;
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
