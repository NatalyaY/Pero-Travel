'use strict';


import {Gallery, GalleryWithControls} from "./gallery.js";
import { initializeDatepickers } from "./initializeDatepickers.js";
import { handleDropdowns } from "./handleDropdowns.js";
import { setDefaultFilters } from "./setDefaultFilters.js";
import '../css/style.css';


const items =
[	{id: "datepickerForm", options: {showOtherMonths: true}, hasWrap: true},
    {id: "datepickerTripPage", options: {showOtherMonths: true}},
];

function addTimeToCalendar() {
    let observer = new MutationObserver(mutations => {
        let elem = mutations[0].target;
        let selectableCalendarDays = elem.querySelectorAll('.ui-state-default:not(.withTime)');
        selectableCalendarDays = Array.from(selectableCalendarDays);
        selectableCalendarDays.forEach((day) => {
            let time = document.createElement('span');
            time.innerText = "06:00-20:00";
            if (day.parentNode.classList.contains('ui-datepicker-unselectable')) {
                time.classList.add('tripPage__calendar__widget__time', 'tripPage__calendar__widget__time--inactive');
            } else time.classList.add('tripPage__calendar__widget__time', 'tripPage__calendar__widget__time--active');
            day.appendChild(time);
            day.classList.add('withTime');
        });
    });
    let datePicker = document.querySelector('.ui-datepicker-inline');
    observer.observe(datePicker, {childList: true, subtree: true});
}


document.addEventListener('DOMContentLoaded', () => {
    initializeDatepickers(items);
    addTimeToCalendar();
    handleDropdowns();
    setDefaultFilters();

    new GalleryWithControls('.tripPage__path__gallery__content');
    new Gallery('.tile-grid');
    new GalleryWithControls('.reviews');

    const favoritBtns = document.querySelectorAll('.favorits__btn');
    for (let btn of favoritBtns) {
        btn.addEventListener('click', (e) => {
            e.currentTarget.classList.toggle('favorits__btn--active');
        });
    }
});