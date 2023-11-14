'use strict';

// Elements selection
const factsCategoriesElement = document.querySelector('.facts__categories');
const categoriesList = [...document.querySelectorAll('.category')];

const factsContainer = document.querySelector('.facts');
let factsList = document.querySelector('.facts__list');

const btnEdit = document.querySelector('.edit');
const btnDelete = document.querySelector('.delete');
const btnCloseEdit = document.querySelector('.btn--close-edit');
const btnCloseDelete = document.querySelector('.btn--close-delete');

const modalEdit = document.querySelector('.modal__edit');
const modalDelete = document.querySelector('.modal__delete');

const formEdit = document.querySelector('.modal__form--edit');
const formDelete = document.querySelector('.modal__form--delete');

const inputCategory = document.querySelector('.modal__input');

const overlay = document.querySelector('.overlay');

// To be used when edit/delete category:
let selectedCategory;

// Helper functions
function toggleModal() {
  this.classList.toggle('hidden');
  overlay.classList.toggle('hidden');
}
//
function createFactItems(data) {
  // Creating a new facts list:
  const newFactsList = document.createElement('ul');
  newFactsList.className = 'facts__list';

  data.forEach(fact => {
    const li = document.createElement('li');
    li.className = 'facts__item';

    const anchor = document.createElement('a');
    anchor.href = `/facts/${fact.id}`;

    const paragrapgh = document.createElement('p');
    paragrapgh.textContent = `${fact.title} (posted on ${fact.date})`;

    anchor.appendChild(paragrapgh);
    li.appendChild(anchor);

    newFactsList.appendChild(li);
  });

  return newFactsList;
}

//
function createErrorMsg(elementToReplace, elementToAppendTo, errorMessage) {
  elementToReplace.remove();
  const errorParagraph = document.createElement('p');
  errorParagraph.textContent = errorMessage;
  elementToAppendTo.appendChild(errorParagraph);

  if (elementToReplace === factsList) factsList = errorParagraph;
}

// Event listeners
factsCategoriesElement.addEventListener('click', e => {
  const categoryClicked = e.target.closest('.category');
  const editBtnClicked = e.target.closest('.edit');
  const deleteBtnClicked = e.target.closest('.delete');

  if (!categoryClicked && !editBtnClicked && !deleteBtnClicked) return;

  const categoryText = categoryClicked.querySelector('.category__name').textContent;

  selectedCategory = categoryText;

  // Select facts from a certain category:
  if (categoryClicked) {
    categoriesList.map(item =>
      item === categoryClicked ? item.classList.add('active') : item.classList.remove('active')
    );

    async function getData() {
      try {
        const res = await fetch('/facts/json');

        if (!res.ok)
          throw new Error(`💥(${res.status}: Not Found) Something went wrong with your request💥`);

        const data = await res.json();

        const factsToShow =
          categoryText === 'All' ? data : data.filter(fact => fact.category === categoryText);

        // Create a new list
        const newFactsList = createFactItems(factsToShow);
        // Remove the current list
        factsList.remove();
        // Add the new list
        factsContainer.appendChild(newFactsList);
        newFactsList.scrollIntoView();
        // Update so that the current list is the new one
        factsList = newFactsList;
      } catch (err) {
        // const errorParagraph = document.createElement('p');
        // errorParagraph.textContent = err.message;
        // factsList.remove();
        // factsContainer.appendChild(errorParagraph);
        // factsList = errorParagraph;
        createErrorMsg(factsList, factsContainer, err.message);
      }
    }
    getData();
  }

  // Edit a certain category:
  if (editBtnClicked) {
    toggleModal.call(modalEdit);

    inputCategory.value = categoryText;
  }

  // Delete a certain category:
  if (deleteBtnClicked) toggleModal.call(modalDelete);
});

// Btn event listeners
btnCloseEdit.addEventListener('click', toggleModal.bind(modalEdit));

btnCloseDelete.addEventListener('click', toggleModal.bind(modalDelete));

// Form event listeners
formEdit.addEventListener('submit', async e => {
  e.preventDefault();

  const formData = Object.fromEntries(new FormData(e.target));

  try {
    const res = await fetch('/facts', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ newCategory: formData.newCategory, category: selectedCategory }),
    });

    if (!res.ok)
      throw new Error(`💥(${res.status}: Not Found) Something went wrong with your request💥`);

    const data = await res.json();

    window.location.href = data.redirect;
  } catch (err) {
    console.log(err);
    document.querySelector('.modal__header').remove();

    createErrorMsg(formEdit, modalEdit, err.message);
  }
});

formDelete.addEventListener('submit', async e => {
  e.preventDefault();

  try {
    const res = await fetch(`/facts`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ category: selectedCategory }),
    });

    if (!res.ok)
      throw new Error(`💥(${res.status}: Not Found) Something went wrong with your request💥`);

    const data = await res.json();
    window.location.href = data.redirect;
  } catch (err) {
    console.log(err);

    createErrorMsg(formDelete, modalDelete, err.message);
  }

  console.log(selectedCategory);
});
