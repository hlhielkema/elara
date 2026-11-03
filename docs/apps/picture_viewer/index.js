const previousButton = document.querySelector('.button.previous');
const nextButton = document.querySelector('.button.next');
const content = document.querySelector('.content');

let index = 0;

const images = [
    'img_1.jpg',
    'img_2.jpg',
    'img_3.jpg',
    'img_4.jpg',
    'img_5.jpg',
    'img_6.jpg',
];

previousButton.addEventListener('click', () => {
    if (--index < 0) {
        index = images.length - 1;
    }
    content.src = images[index];
});

nextButton.addEventListener('click', () => {
    index = (index + 1) % images.length;
    content.src = images[index];
});
