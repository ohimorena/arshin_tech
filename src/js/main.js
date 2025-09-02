import "../css/style.css";

import "inputmask";
import JustValidate from "just-validate";


// dropdown
const select = document.querySelector('.select');
const selectValue = document.querySelector('.select__value');
const selectDropdown = document.querySelector('.select__dropdown');
const arrow = document.querySelector('.select__arrow');

selectDropdown.addEventListener('click', e => {
  const option = e.target.closest('.select__option');
	if (option) {
		selectValue.textContent = option.textContent;
    e.target.closest('.select').blur();
    arrow.hidden = true;
    select.dispatchEvent(new CustomEvent('change', { detail: option.textContent }));
  }
})

let cameraPurpose;
select.addEventListener('change', e => {
  cameraPurpose = [e.detail];
});


// inputMask
let phoneSelector = document.querySelector('#phone');
let im = new Inputmask('+7 (999) 999-99-99');

im.mask(phoneSelector);


// burger menu
let header = document.querySelector('.header');
let burgerBtn = document.getElementById('burger_btn');

burgerBtn.addEventListener('click', e => {
  header.classList.toggle('open');
});


// validate data
let validator = new JustValidate('form');

validator
  .addField("#full_name", [
    {
      rule: 'required',
      errorMessage: 'Введите ФИО'
    },
    {
      rule: 'minLength',
      value: 5,
      errorMessage: 'Минимум 5 символов'
    },
    {
      rule: 'maxLength',
      value: 60,
    },
  ])
  .addField("#email", [
    {
      rule: 'required',
      errorMessage: 'Введите email'
    },
		{
			rule: 'email',
			errorMessage: 'Email введён некорректно'
		}
  ])
  .addField("#phone", [
    {
      validator: (value) => {
				let phone = phoneSelector.inputmask.unmaskedvalue();
				return Boolean(Number(phone) && phone.length > 0)
			},
      errorMessage: 'Введите телефон'
    },
    {
      validator: (value) => {
				let phone = phoneSelector.inputmask.unmaskedvalue();
				return Boolean(Number(phone) && phone.length === 10)
			},
      errorMessage: 'Введите телефон полностью'
    },
  ])
  .onSuccess(async (e) => {
    e.preventDefault();
    let form = document.querySelector('form');
    let checkBoxes = document.querySelectorAll('.card__checkbox:checked');

    let object = [];
    let roomSize = [];
    let videoResolution = [];
    let archiveVolume = [];
    let distanceToDvr = [];
    let distanceToPower = [];
    
    checkBoxes.forEach((checkbox) => {
      switch(checkbox.name) {
        case 'object':
          object.push(checkbox.value);
          break;
        case 'room_size':
          roomSize.push(checkbox.value);
          break;
        case 'video_resolution':
          videoResolution.push(checkbox.value);
          break;
        case 'archive_volume':
          archiveVolume.push(checkbox.value);
          break;
        case 'distance_to_dvr':
          distanceToDvr.push(checkbox.value);
          break;
        case 'distance_to_power':
          distanceToPower.push(checkbox.value);
          break;
      }
    });

    let formData = new FormData(form);

    formData.append("object", object);
    formData.append("room_size", roomSize);
    formData.append("video_resolution", videoResolution);
    formData.append("archive_volume", archiveVolume);
    formData.append("distance_to_dvr", distanceToDvr);
    formData.append("distance_to_power", distanceToPower);
    formData.append("camera_purpose", cameraPurpose);

    let response = await fetch('handler.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify(Object.fromEntries(formData))
    });

    let result = await response.text();
    document.querySelector('#result').innerText = result;
  });