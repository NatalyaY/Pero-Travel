'use strict';

import {markEmptyRequuiredInputs, useInputMask} from "./form.js";
import {Gallery, VideoGallery, GalleryWithControls} from "./gallery.js";
import '../css/style.css';

const form = document.querySelector('.form');
const formSubmitBtn = form.querySelector('.form__submit');
const inputsWithMask = form.querySelectorAll('[data-mask]');

formSubmitBtn.addEventListener('click', (e) => markEmptyRequuiredInputs(e));

Array.from(inputsWithMask).forEach((el) => useInputMask(el));

document.addEventListener('DOMContentLoaded', () => {
    new VideoGallery(".header__video");
    new GalleryWithControls('.popularTrips');
    new Gallery('.tile-grid');
    new GalleryWithControls('.reviews');
});