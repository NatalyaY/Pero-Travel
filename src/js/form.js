'use strict';

const form = document.querySelector('.form');
const invalidFields = [];


export function markEmptyRequuiredInputs(e) {
    e.preventDefault();
    let emptyRequiredInputs = form.querySelectorAll('.form__input[required][value=""]');
    if (emptyRequiredInputs.length) {
        Array.from(emptyRequiredInputs).forEach((el) => {
            el.classList.add("invalid");
        });
    } else form.submit();
}

export function useInputMask(input) {
    const mask = input.dataset.mask.split('');

    function applyMask(inputValue) {
        let inputData = inputValue.slice();
        let maskedValue = [];

        for (let i = 0; i < mask.length; i++) {
            if ((inputData.length == 0)&&(maskedValue.length >= mask.indexOf("_"))) break;
            if (mask[i] != "_") { 
                maskedValue.push(mask[i]);
                continue;
            }
            if (inputData.length != 0) {
                maskedValue.push(inputData.shift());
                continue;
            }
        }
        return maskedValue.join('');
    }

    function inputChange(e) {
        let selectionStart = input.selectionStart;
        let selectionEnd = input.selectionEnd;

        let cleanInputValue = input.value.split('').slice(3).filter((char) => /\d/.test(char));

        let maskedValue = applyMask(cleanInputValue);

        input.value = maskedValue; // чтобы в поле отображалась маска при первом клике и было видно вводимые цифры

        if ((e.type == 'blur')&&(maskedValue.length != input.dataset.mask.length)) {
            if (invalidFields.includes(input)) input.classList.add("invalid");
            input.value = "";
            input.setAttribute("value", "");
            return;
        }

        if (maskedValue.length == input.dataset.mask.length) {
            input.setAttribute("value", maskedValue);
            if (input.classList.contains('invalid')) {
                invalidFields.push(input);
                input.classList.remove("invalid");
            }
        }

        if (cleanInputValue.length == 0) {
            return;
        }

        if (input.selectionEnd != selectionEnd) {
            while(input.selectionEnd != selectionEnd) {
                if (!/\d|s/.test(input.value[selectionEnd-1])) {
                    if (input.selectionEnd < selectionEnd) {
                        selectionEnd--;
                        selectionStart--;
                    } else {
                        selectionEnd++;
                        selectionStart++;
                    }
                } else {
                    input.selectionEnd = selectionEnd;
                    input.selectionStart = selectionStart;
                }
            }
        }

        input.selectionEnd = selectionEnd;
        input.selectionStart = selectionStart;

    }

    input.addEventListener('click', (e) => inputChange(e));
    input.addEventListener('keyup', (e) => inputChange(e));
    input.addEventListener('blur', (e) => inputChange(e));
}
