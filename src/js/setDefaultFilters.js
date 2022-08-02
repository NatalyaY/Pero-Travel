'use strict';

export function setDefaultFilters() {
    const allFilterItems = Array.from(document.querySelectorAll('.form__item'));

    allFilterItems.forEach((elem) => {
        let defaultValueItems = Array.from(elem.querySelectorAll('[data-defaultValue]'));
        if (defaultValueItems.length == 0) return;
        defaultValueItems.map((el) => {
            if (el.dataset.initialfilter) {
                let id = el.dataset.id;
                let allSameFilters = Array.from(document.querySelectorAll(`[data-id="${id}"]`));
                allSameFilters.forEach((filter) => {
                    if (filter != el) {
                        filter.dataset.defaultvalue = el.dataset.defaultvalue;
                        defaultValueItems.push(filter);
                    }
                });
            }
        });
        defaultValueItems.forEach((el) => {
            if (el.dataset.datepicker) {
                let datepickers = Array.from(document.querySelectorAll('.hasDatepicker'));
                let today = new Date();
                let month = today.getMonth() + 1;
                if (month < 10) {
                    month = "0" + month;
                }
                let todayDate = today.getDate() + '.' + month + '.' + today.getFullYear();

                datepickers.forEach((datepicker) => {
                    $(`#${datepicker.id}`).datepicker('setDate', todayDate);
                });
                return;
            }

            if (el.dataset.options) {
                let option = el.querySelectorAll(`.hiddenRadio[value="${el.dataset.defaultvalue}"]`)[0];
                option.checked = true;
                return;
            }

            if (el.value != undefined) {
                el.value = el.dataset.defaultvalue;
            } else {
                if (el.dataset.otherdisplayedvalue) {
                    let option = el.parentNode.querySelectorAll(`.hiddenRadio[value="${el.dataset.defaultvalue}"]`)[0];
                    el.innerText = option.parentNode.innerText.trim();
                    return;
                }
                el.innerText = el.dataset.defaultvalue;
                if (el.dataset.value) el.dataset.value = el.dataset.defaultvalue;
            }

            if (el.dataset.defaultfirechange) {
                let event = new Event(`${el.dataset.defaultfirechange}`);
                el.dispatchEvent(event);
            }
        })
    });
}
