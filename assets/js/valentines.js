document.addEventListener('DOMContentLoaded', function() {
    const noButton = document.getElementById('noButton');
    const yesButton = document.getElementById('yesButton');
    const header = document.getElementById('header');
    const image = document.getElementById('image');
    let imageChanged = false;

    noButton.addEventListener('mouseover', function() {
        const maxX = window.innerWidth - noButton.offsetWidth;
        const maxY = window.innerHeight - noButton.offsetHeight;
        const x = Math.random() * maxX;
        const y = Math.random() * maxY;

        noButton.style.left = `${x}px`;
        noButton.style.top = `${y}px`;
        noButton.classList.add('absolute');

        if (!imageChanged) {
            header.textContent = 'pleaseeeeee';
            image.src = 'assets/img/valentines/no.gif';
            imageChanged = true;
            
        }
    });

    yesButton.addEventListener('click', function() {
        header.textContent = 'yay!! happy valentine\'s day!';
        image.src = 'assets/img/valentines/yes.gif';
        noButton.classList.remove('absolute');
        recreateNode(document.getElementById("noButton"));
    });
});