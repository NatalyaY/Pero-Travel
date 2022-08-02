'use strict';

import { initializeDatepickers } from "./initializeDatepickers.js";
import { handleDropdowns } from "./handleDropdowns.js";
import { setDefaultFilters } from "./setDefaultFilters.js";
import '../css/style.css';


function beforeShow(input, inst) {
    let offset = $('.filter__form__date').offset();
    let height = parseInt($('.filter__form__date').css("height"));
    window.setTimeout(function() {
        $(inst.dpDiv).css({ top: (offset.top + height) + 'px', left: offset.left + 'px' })}, 1);
}

const items =
[   {id: "datepicker", options: {range: "period", beforeShow: beforeShow}, hasWrap: true},
    {id: "datepickerInline", options: {range: "period"}},
];


function setMultipleRanges() {
    let multipleRanges = document.querySelectorAll('.multipleRange');
    [].forEach.call(multipleRanges, (range) => {
        let sliderContainer = range.querySelectorAll('.multipleRangeContainer')[0];
        let inputsContainer = range.querySelectorAll('.multipleRangeInputsContainer')[0];
        let sliderMin = [].find.call(sliderContainer.children,
            (el) => el.classList.contains('multipleRange--min'));
        let sliderMax = [].find.call(sliderContainer.children,
            (el) => el.classList.contains('multipleRange--max'));

        let inputMin = [].find.call(inputsContainer.children,
            (el) => el.classList.contains('multipleRange__input--min'));
        let inputMax = [].find.call(inputsContainer.children,
            (el) => el.classList.contains('multipleRange__input--max'));

        const progressBar = sliderContainer.querySelectorAll('.multipleRangeSelect')[0];

        if (inputMin && inputMax) {
            inputMin.value = parseInt(sliderMin.min);
            inputMax.value = parseInt(sliderMin.max);

            inputMin.addEventListener('change', () => {
                let value;
                switch (true) {
                case (+inputMin.value < +sliderMin.min):
                    inputMin.value = parseInt(sliderMin.min);
                    value = +sliderMin.min;
                    break;
                case (+inputMin.value > +sliderMax.value):
                    inputMin.value = parseInt(sliderMax.value);
                    value = +sliderMax.value;
                    break;
                default:
                    value = +inputMin.value;
                }
                sliderMin.value = value;
                setProgressBarPosition();
            });

            inputMax.addEventListener('change', () => {
                let value;
                switch (true) {
                case (+inputMax.value > +sliderMax.max):
                    inputMax.value = parseInt(sliderMax.max);
                    value = +sliderMax.max;
                    break;
                case (+inputMax.value < +sliderMin.value):
                    inputMax.value = parseInt(sliderMin.value);
                    value = +sliderMin.value;
                    break;
                default:
                    value = +inputMax.value;
                }
                sliderMax.value = value;
                setProgressBarPosition();
            });
        }

        function setProgressBarPosition() {
            let left = (+sliderMin.value / +sliderMin.max) * 100;
            let width = (+sliderMax.value / +sliderMax.max) * 100 - left;
            progressBar.style.left = `calc(${left}% - 7.5px)`;
            progressBar.style.width = width + '%';
        }

        sliderMin.addEventListener('input', () => {
            if (+sliderMin.value > +sliderMax.value) {
                sliderMin.value = +sliderMax.value;
            }
            setProgressBarPosition();
            if (inputMin) inputMin.value = parseInt(sliderMin.value);
        });

        sliderMax.addEventListener('input', () => {
            if (+sliderMax.value < +sliderMin.value) {
                sliderMax.value = +sliderMin.value;
            }
            setProgressBarPosition();
            if (inputMax) inputMax.value = parseInt(sliderMax.value);
        });
    });
}


function linkSameFilters() {
    const initialFilters = Array.from(document.querySelectorAll('[data-initialfilter]'));
    const doublingFilters = initialFilters.reduce((obj, filter) => {
        obj[`${filter.dataset.id}`] = Array.from(document.querySelectorAll(`.dropdownItemsList[data-id='${filter.dataset.id}']`));
        return obj;
    }, {});

    for (let key in doublingFilters) {
        let arr = doublingFilters[key];
        arr.forEach((elem) => {
            let options = Array.from(elem.querySelectorAll('.hiddenRadio'));
            options.forEach((option) => {
                option.addEventListener('click', (e) => {
                    let value = e.target.value;
                    let filterToChange = arr.filter((el) => el != elem)[0];
                    let optionToChange = filterToChange.querySelectorAll(`.hiddenRadio[value="${value}"]`)[0];
                    optionToChange.checked = true;
                    optionToChange.dispatchEvent(new Event('change'));
                });
            });
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initializeDatepickers(items);
    setDefaultFilters();
    linkSameFilters();
    setMultipleRanges();
    handleDropdowns();

    const cleanBtn = document.querySelector(".filter__main__clean");
    cleanBtn.addEventListener('click', setDefaultFilters);

    const favoritBtns = document.querySelectorAll('.favorits__btn');
    for (let btn of favoritBtns) {
        btn.addEventListener('click', (e) => {
            e.currentTarget.classList.toggle('favorits__btn--active');
        });
    }

});