'use strict';

export class Gallery {

    constructor (selector) {
        this.gallery = document.querySelector(selector);
        this.galleryItems = Array.from(this.gallery.children);
        this.galleryScroll = this.galleryScroll.bind(this);
        this.pointerUp = this.pointerUp.bind(this);

        this.cancelDraggable();
        this.setGalleryScrollable();
        this.galleryItems.forEach((item) => {
            if (item.classList.contains('clickable')) {
                item.addEventListener('click', showBigImg);
            }
        });
    }

    cancelDraggable() {
        this.gallery.ondragstart = () => {
            return false;
        };
    }

    setGalleryScrollable() {
        this.gallery.addEventListener('pointerdown', () => {
            this.pageX = 0;
            document.addEventListener('pointermove', this.galleryScroll);
            document.addEventListener('pointerup', this.pointerUp);
        });
    }

    galleryScroll(e) {
        if (this.pageX !== 0) {
            this.gallery.scrollLeft = this.gallery.scrollLeft + (this.pageX - e.pageX);

            let event = new Event("moving", {bubbles: false});
            this.gallery.dispatchEvent(event);

            this.galleryItems.forEach((item) => {
                item.style.pointerEvents = 'none';
            });
        }
        this.pageX = e.pageX;
    }

    pointerUp() {
        this.galleryItems.forEach((item) => {
            item.style.pointerEvents = 'all';
        });
        document.removeEventListener('pointermove', this.galleryScroll);
        document.removeEventListener('pointerup', this.pointerUp);
    }

}

export class VideoGallery extends Gallery {

    constructor(selector) {
        super(selector);
        this.galleryItems = Array.from(this.gallery.children);
        this.bigVideoClickHandler = this.bigVideoClickHandler.bind(this);
        this.bigVideoPointerHandler = this.bigVideoPointerHandler.bind(this);
        this.setItemsClickable();
    }

    setItemsClickable() {
        this.galleryItems.forEach((video) => {
            video.addEventListener('click', (e) => {
                if (event.which != 1) return;
                this.setBigVideo(e);
            });
        });
    }

    setBigVideo(e) {
        this.bigVideoContainer = document.getElementById('bigVideoContainer').content.cloneNode(true).firstElementChild;
        this.bigVideoLayer = this.bigVideoContainer.querySelector('.video__layer');
        const video = this.bigVideoContainer.querySelectorAll('.video__content')[0];
        const videoSources = Array.from(video.children);
        const url = e.currentTarget.dataset.id;

        while (video.firstChild) {
            video.removeChild(video.firstChild);
        }

        [].forEach.call(videoSources, (source) => {
            source.src = source.src.replace('/id.', `/${url}.`);
            video.appendChild(source);
        });

        this.bigVideoContainer.addEventListener('click', this.bigVideoClickHandler);
        document.body.appendChild(this.bigVideoContainer);
        this.getBigVideoPlay();
    }

    bigVideoClickHandler(e) {
        this.bigVideo = this.bigVideoContainer.querySelector('.video__content');
        if (!e.target.closest('.video__layer')) {
            document.body.removeChild(this.bigVideoContainer);
        } else {
            if (this.bigVideoContainer.classList.contains('playing')) {
                this.bigVideo.pause();
                this.bigVideoContainer.classList.remove('playing');
                this.bigVideoContainer.classList.add('paused');
            } else {
                this.bigVideo.play();
                this.bigVideoContainer.classList.remove('paused');
                this.bigVideoContainer.classList.add('playing');
            }
        }
    }

    bigVideoPointerHandler() {
        if (this.bigVideoContainer.classList.contains('pointerMove')||this.bigVideoContainer.classList.contains('paused')) return;
        this.bigVideoContainer.classList.add('pointerMove');
        let timer = setTimeout(()=>{
            this.bigVideoContainer.classList.remove('pointerMove');
            clearTimeout(timer);
        }, 700);
    }

    getBigVideoPlay() {
        this.bigVideo = this.bigVideoContainer.querySelector('.video__content');
        this.bigVideo.play();
        this.bigVideoContainer.classList.add('playing');
        this.bigVideoLayer.addEventListener('pointermove', this.bigVideoPointerHandler);
    }

}

export class GalleryWithControls extends Gallery {

    constructor (selector) {
        super(selector);
        this.galleryItemsLinks = Array.from(this.gallery.querySelectorAll('.popularTrip__link'));

        this.createControls(selector);
        this.gallery.after(this.controlsContainer);

        this.btnPrev = this.gallery.parentNode.querySelector('.control__btn--prev');
        this.btnNext = this.gallery.parentNode.querySelector('.control__btn--next');
        this.progressbarPoiner = this.gallery.parentNode.querySelector('.control__progressbar__pointer');

        this.setControlsState();

        [this.btnPrev, this.btnNext].forEach((btn) => {
            btn.addEventListener('click', (e) => {
                this.btnsClickHandler(e);
            });
        });

        this.gallery.addEventListener('moving', () => this.setControlsState());
    }

    createControls(selector) {
        let svgNS = "http://www.w3.org/2000/svg";
        let linkNS = "http://www.w3.org/1999/xlink";

        this.controlsContainer = document.createElement('div');
        this.controlsContainer.classList.add('d-flex', 'align-center', 'gallery__controls', `${selector.slice(1)}__controls`);

        let btns = document.createElement('div');
        btns.classList.add('gallery__controls__btns');

        let btnPrev = document.createElementNS(svgNS, 'svg');
        btnPrev.classList.add('gallery__controls__btns__btn', 'control__btn', 'control__btn--prev');
        let btnPrevUse = document.createElementNS(svgNS, 'use');
        btnPrevUse.setAttributeNS(linkNS, 'href', '#prev');
        btnPrev.append(btnPrevUse);

        let btnNext = document.createElementNS(svgNS, 'svg');
        btnNext.classList.add('gallery__controls__btns__btn', 'control__btn', 'control__btn--next');
        let btnNextUse = document.createElementNS(svgNS, 'use');
        btnNextUse.setAttributeNS(linkNS, 'href', '#next');
        btnNext.append(btnNextUse);

        btns.append(btnPrev, btnNext);

        let progressbar = document.createElement('div');
        progressbar.classList.add('gallery__controls__progressbar', 'control__progressbar');
        let progressbarPoiner = document.createElement('div');
        progressbarPoiner.classList.add('control__progressbar__pointer');
        progressbar.append(progressbarPoiner);

        this.controlsContainer.append(btns, progressbar);
    }

    setControlsState() {
        if (this.gallery.scrollLeft == 0) {
            this.btnPrev.classList.remove('control__btn--active');
            this.btnNext.classList.add('control__btn--active');
        } else if (this.gallery.scrollWidth-this.gallery.scrollLeft == this.gallery.offsetWidth) {
            this.btnPrev.classList.add('control__btn--active');
            this.btnNext.classList.remove('control__btn--active');
        } else {
            this.btnPrev.classList.add('control__btn--active');
            this.btnNext.classList.add('control__btn--active');
        }

        this.progressbarPoiner.style.width = (this.gallery.offsetWidth+this.gallery.scrollLeft) / this.gallery.scrollWidth  * 100 + '%';
    }

    btnsClickHandler(e) {
        if (!e.target.classList.contains('control__btn--active')) return;

        this.galleryItemWidth = parseFloat(window.getComputedStyle(this.gallery.firstElementChild).width);
        this.galleryItemMargin = parseFloat(window.getComputedStyle(this.gallery.firstElementChild).marginRight);

        let shift = e.target.classList.contains('control__btn--prev') ? -this.galleryItemWidth-this.galleryItemMargin : this.galleryItemWidth+this.galleryItemMargin;
        this.animateMoving(shift);
    }

    animateMoving(step) {
        const render = (progress) => {
            this.gallery.scrollLeft = currentShift + step * progress;
            this.setControlsState();
        };

        const currentShift = this.gallery.scrollLeft;
        let startTime = performance.now();

        requestAnimationFrame(function animate(time) {
            let progress = (time - startTime) / 400;
            if (progress > 1) progress = 1;
            if (progress < 0) {
                requestAnimationFrame(animate);
                return;
            }
            render(progress);
            if (progress < 1) requestAnimationFrame(animate);
        })
    }

}

function showBigImg(e) {
    const scrollY = window.scrollY;
    const img = e.target.querySelector('img');
    const name = img.dataset.name;

    const bigImg = img.cloneNode();
    let imgSrcArr = img.src.split('/');
    bigImg.src = `img/${imgSrcArr[imgSrcArr.length-2]}/bigImg/${name}.webp`;
    bigImg.className = 'bigImg';

    const layer = document.createElement('div');
    layer.classList.add('layer');

    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;

    document.body.appendChild(layer);
    document.body.appendChild(bigImg);

    function closeBigImg(e) {
        if (!e.target.closest('.bigImgWrap')) {
            document.body.removeChild(bigImg);
            document.body.removeChild(layer);
            const scrollY = document.body.style.top;
            document.body.style.position = '';
            document.body.style.top = '';
            window.scrollTo(0, parseInt(scrollY || '0') * -1);
            document.removeEventListener('click', closeBigImg);
        }
    }

    setTimeout(() => document.addEventListener('click', closeBigImg), 10);
}

// document.addEventListener('DOMContentLoaded', () => {
//     new VideoGallery(".header__video");
//     new GalleryWithControls('.popularTrips');
//     new Gallery('.tile-grid');
//     new GalleryWithControls('.reviews');
// });