const image = document.querySelector('.image');
const filtersInput = document.querySelectorAll('.filters input');

function activeButtons() {
    const buttons = document.querySelectorAll(".btn-container .btn");

    buttons.forEach(btn => btn.addEventListener('click', function() {
        const currentButton = document.getElementsByClassName("btn-active");
        currentButton[0].className = currentButton[0].className.replace(" btn-active", "");
        this.className += " btn-active";
    }));
}
activeButtons();

function resetFilters() {
    const btnReset = document.querySelector('.btn-reset');

    function update() {
        const value = this.dataset.sizing || '';
        image.style.setProperty(`--${this.name}`, this.value + value);
    
        const output = this.nextElementSibling;
        output.innerHTML = this.value;
    }
    filtersInput.forEach(input => input.addEventListener('input', update));
    
    function reset() {
        filtersInput.forEach(input => {
            if(input.name === 'saturate'){
                input.value = 100;
            }
            else{
                input.value = 0;
            }
            image.style.setProperty(`--${input.name}`, input.value + (input.dataset.sizing || ''));
    
            const output = input.nextElementSibling;
            output.innerHTML = input.value;
        });
    }
    btnReset.addEventListener('click', reset);
}
resetFilters();

function getImage() {
    const btnNextPicture = document.querySelector('.btn-next');
    const btnPrevPicture = document.querySelector('.btn-prev');
    const basePath = 'https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/';

    function getPicturePath() {
        const hour = new Date().getHours();
        if (hour >= 6 && hour < 12) {
            return basePath + 'morning/';
        } else if (hour >= 12 && hour < 18) {
            return basePath + 'day/';
        } else if (hour >= 18 && hour < 24) {
            return basePath + 'evening/';
        } else {
            return basePath + 'night/';
        }
    }

    const images = ['01.jpg', '02.jpg', '03.jpg', '04.jpg', '05.jpg', '06.jpg', '07.jpg', '08.jpg', '09.jpg', '10.jpg', 
    '11.jpg', '12.jpg', '13.jpg', '14.jpg', '15.jpg', '16.jpg', '17.jpg', '18.jpg', '19.jpg', '20.jpg'];
    let currentIndex = 0;

    function nextPicture() {
        if (currentIndex == images.length - 1) {
            currentIndex = 0;
        } else {
            currentIndex++;
        }
        const imageSrc = getPicturePath() + images[currentIndex];
        image.src = imageSrc;

        btnNextPicture.disabled = true;
        setTimeout(function() {
            btnNextPicture.disabled = false;
        }, 100);
    }
    btnNextPicture.addEventListener('click', nextPicture);

    function previousePicture() {
        if (currentIndex == 0) {
            currentIndex = images.length - 1;
        } else {
            currentIndex--;
        }
        const imageSrc = getPicturePath() + images[currentIndex];
        image.src = imageSrc;
        
        btnPrevPicture.disabled = true;
        setTimeout(function() {
            btnPrevPicture.disabled = false;
        }, 100);
    }
    btnPrevPicture.addEventListener('click', previousePicture);
}
getImage();

function loadImage() {
    document.querySelector('input[type="file"]').addEventListener('change', () => {
        const fileReader = new FileReader();
        fileReader.onload = () => {
            image.src = fileReader.result;
        }
        fileReader.readAsDataURL(document.querySelector('input[type="file"]').files[0]);
        document.querySelector('input[type="file"]').value = null;
    });
}
loadImage();

function drawPicture() {
    const canvas = document.querySelector('canvas');

    function createCanvas(newImage) {
        let filters = '';

        document.querySelector('canvas').width = newImage.width;
        document.querySelector('canvas').height = newImage.height;

        filtersInput.forEach(input => {
            if (input.name === 'blur') {
                const size = (input.value * ((newImage.width / image.width + newImage.height / image.height) / 2)).toFixed(2);
                filters += `${input.name}(${size}${input.dataset.sizing})`;
            } else {
                filters += `${input.name}(${input.value}${input.dataset.sizing})`;
            }
        });

        document.querySelector('canvas').getContext("2d").filter = filters.trim();
        document.querySelector('canvas').getContext("2d").drawImage(newImage, 0, 0);
    }

    function savePicture() {
        document.querySelector('.btn-save').addEventListener('click', () => {
            const newImage = new Image();
            newImage.setAttribute('crossOrigin', 'anonymous');
            newImage.src = image.src; 
            newImage.onload = () => {
                createCanvas(newImage);
                let link = document.createElement('a');
                link.download = 'picture.png';
                link.href = document.querySelector('canvas').toDataURL('image/png');
                link.click();
                link.delete;
            };
        });
    }
    savePicture();
}
drawPicture();

function fullScreen(){   
    let element = document.getElementById('project');
    if(element.requestFullscreen || element.webkitRequestFullscreen) {
            requestFullScreen(element);
    }
    if(document.fullscreenElement || document.webkitExitFullscreen) {
            exitFullScreen();
    }
}

function requestFullScreen(element){
    if (element.requestFullscreen)
        element.requestFullscreen();
    else if (element.webkitRequestFullscreen)
        element.webkitRequestFullscreen();
}

function exitFullScreen(){
    if (document.fullscreenElement)
        return document.exitFullscreen();
    else if (document.webkitExitFullscreen)
        document.webkitExitFullscreen();
}
