'use strict'

import '/node_modules/jquery-ui/ui/widgets/datepicker.js';
import './jquery.datepicker.extension.range.min.js';
import '/node_modules/jquery-ui/themes/base/theme.css';
import '/node_modules/jquery-ui/themes/base/datepicker.css';

export function initializeDatepickers(items) {

    $.datepicker.regional['ru'] = {
        dayNamesMin: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
        monthNames: ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'],
        dateFormat: 'dd.mm.yy',
        firstDay: 1,
        showMonthAfterYear: false,
        minDate: 0,
        onSelect: function(dateText, inst, extensionRange) {
            const date = extensionRange ? extensionRange : dateText;
            upDateInputsFromDatepicker(inst, date);
            let datepickers = Array.from(document.querySelectorAll('.hasDatepicker'));
            datepickers.forEach((elem) => {
                if (elem.id != inst.id) {
                    let date = extensionRange ? [extensionRange.startDateText, extensionRange.endDateText] : dateText;
                    $(`#${elem.id}`).datepicker('setDate', date);
                }
            });
        },
    };

    $.datepicker.setDefaults($.datepicker.regional['ru']);

    $.datepicker._setDate_copy = $.datepicker._setDate;
    $.datepicker._setDate = function(instance, e, i) {
        $.datepicker._setDate_copy(instance, e, i);
        if (typeof e === "object" && !Array.isArray(e) && e !== null) {
            e = `${e.getDate()}.0${e.getMonth()+1}.${e.getFullYear()}`;
        }
        const extensionRange = instance.dpDiv.data("datepickerExtensionRange");
        const date = extensionRange ? extensionRange : e;
        upDateInputsFromDatepicker(instance, date);
    };

    function initializeItems() {
        items.forEach((item) => {
            $(`#${item.id}`).datepicker(item.options);
            if (item.hasWrap) {
                $(`.${item.id}__wrap`).click(() => $(`#${item.id}`).datepicker("show"));
            }
        });
    }

    initializeItems();

    function upDateInputsFromDatepicker(inst, date) {
        const isExtensionRange = typeof date === "object" && !Array.isArray(date) && date !== null;
        const id = inst.id;
        const inputStart = document.querySelector(`[data-id="${id}__inputStart"]`);
        const inputEnd = document.querySelector(`[data-id="${id}__inputEnd"]`);
        const fieldToDisplay = document.querySelector(`[data-id="${id}__fieldToDisplay"]`);

        if (fieldToDisplay) {
            let text;
            if (isExtensionRange) {
                text = (date.startDateText == date.endDateText) ? date.startDateText :
                    date.startDateText + ' - ' + date.endDateText;
            } else text = date;
            $(fieldToDisplay).text(text);
        }

        if (inputStart) $(inputStart).val(date.startDateText||date);
        if (inputEnd) $(inputEnd).val(date.endDateText||date);
    }
}