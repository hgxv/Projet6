let modal = document.getElementById("modal");
let modalCloser = document.getElementsByClassName("close")[0];

modalCloser.onclick = function() {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
}
