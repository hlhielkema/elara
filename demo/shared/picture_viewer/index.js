var previousButton = document.querySelector('.button.previous');
var nextButton = document.querySelector('.button.next');
var content = document.querySelector('.content');

var index = 0;

var images = [
    'img_1.jpg',
    'img_2.jpg',
    'img_3.jpg',
    'img_4.jpg',
    'img_5.jpg',
    'img_6.jpg',
];

previousButton.addEventListener('click', function() {
    if (--index < 0) {
        index = images.length - 1;
    }    
    content.src = images[index];
});

nextButton.addEventListener('click', function() {
    index = (index + 1) % images.length;
    content.src = images[index];
});
