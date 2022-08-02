'use strict';

export function handleDropdowns() {
    const dropDownItems = Array.from(document.querySelectorAll('.form__dropdown'));

    dropDownItems.forEach((elem) => {
        let options = elem.querySelectorAll(".dropdownItemsList")[0];
        let radio = Array.from(options.querySelectorAll('.hiddenRadio'));

        radio.forEach((elem) => {
            elem.addEventListener('change', displayChoosenValue);
        });
        elem.addEventListener('click', showDropDown);

        function showDropDown() {
            if (+options.dataset.hidden) {
                options.dataset.hidden = 0;
            } else return;
            setTimeout(() => { // чтобы не сработал обработчик и не закрыл сразу же выпадающее меню
                document.addEventListener('click', hideDropDown);
            }, 10);
        }

        function hideDropDown(e) {
            if (e.target.closest('ul') != options) {
                setTimeout(() => { // чтобы сначала отработало событие клика на showDropDown (иначе меню откроется снова)
                    options.dataset.hidden = 1;
                    document.removeEventListener('click', hideDropDown);
                }, 10);
            }
        }

        function displayChoosenValue(e) {
            let elem = e.target.closest('.dropdownItemsList');
            let displayInput = document.querySelector(`.form__item__fieldToDisplay[data-id="${elem.dataset.id}"]`);
            if (displayInput) {
                let choosenOption = e.target;
                displayInput.innerText = choosenOption.parentNode.innerText.trim();
                displayInput.dataset.value = choosenOption.value;
            }
        }
    });
}