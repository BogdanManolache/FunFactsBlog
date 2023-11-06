'use strict';

// Element selectors
const factTitle = document.querySelector('.fact__title');
const factCategory = document.querySelector('.fact__category');
const factDescription = document.querySelector('.fact__description');

const btnEdit = document.querySelector('.btn--edit');
const btnDelete = document.querySelector('.btn--delete');
const btnCloseEdit = document.querySelector('.btn--close-edit');
const btnCloseDelete = document.querySelector('.btn--close-delete');
const btnSubmitEdit = document.querySelector('.btn__edit');
const btnSubmitDelete = document.querySelector('.btn__delete');

const overlay = document.querySelector('.overlay');

const modalEdit = document.querySelector('.modal__edit');
const modalDelete = document.querySelector('.modal__delete');

const formEdit = document.querySelector('.fact__form');
const formDelete = document.querySelector('.modal__form--delete');

const inputTitle = document.querySelector('#fact__title');
const inputCategory = document.querySelector('#fact__category');
const inputDescription = document.querySelector('#fact__description');

// Preparing the fact for editing
inputTitle.value = factTitle.textContent;
inputCategory.value = factCategory.textContent;
inputDescription.value = factDescription.textContent;

// Toggle modals function
function toggleModal() {
  this.classList.toggle('hidden');
  overlay.classList.toggle('hidden');
}

//
function createErrorMsg(elementToReplace, elementToAppendTo, errorMessage) {
  elementToReplace.remove();
  const errorParagraph = document.createElement('p');
  errorParagraph.textContent = errorMessage;
  elementToAppendTo.appendChild(errorParagraph);
}

// FACT ID:
const factId = window.location.href.split('/').at(-1);

// Btn event listeners
btnEdit.addEventListener('click', toggleModal.bind(modalEdit));

btnDelete.addEventListener('click', toggleModal.bind(modalDelete));

btnCloseEdit.addEventListener('click', toggleModal.bind(modalEdit));

btnCloseDelete.addEventListener('click', toggleModal.bind(modalDelete));

//Forms event listeners

formEdit.addEventListener('submit', async e => {
  e.preventDefault();

  try {
    const formData = Object.fromEntries(new FormData(e.target));

    const res = await fetch(`/facts/${factId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (!res.ok)
      throw new Error(`💥(${res.status}: Not Found) Something went wrong with your request💥`);

    const data = await res.json();
    window.location.href = data.redirect;
  } catch (err) {
    console.log(err);

    createErrorMsg(formEdit, modalEdit, err.message);
  }
});

formDelete.addEventListener('submit', async e => {
  e.preventDefault();

  try {
    const res = await fetch(`/facts/${factId}`, {
      method: 'DELETE',
    });

    if (!res.ok)
      throw new Error(`💥(${res.status}: Not Found) Something went wrong with your request💥`);

    const data = await res.json();
    window.location.href = data.redirect;
  } catch (err) {
    console.log(err);

    createErrorMsg(formDelete, modalDelete, err.message);
  }
});

// btnSubmitEdit.addEventListener('click', () => toggleModal.call(modalEdit));

// btnSubmitDelete.addEventListener('click', () => toggleModal.call(modalDelete));
