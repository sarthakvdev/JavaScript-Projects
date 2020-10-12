import { elements } from './base';

export const getInput = () => elements.searchInput.value;

// Clear search input box whenever search/enter is clicked
export const clearInput = () => {
    elements.searchInput.value = '';
};

// To clear previous results in resultsPanel whenever new item is searched
export const clearResults = () => {
    elements.searchResList.innerHTML = '';
    elements.searchResPages.innerHTML = '';
};

// Setting limit to the length of title of recipe in recipe panel
const limitRecipeTitle = (title, limit = 17) => {
    const newTitle = [];
    if (title.length > limit) {
        title.split(' ').reduce((acc, cur) => {
            if(acc + cur.length <= limit) {
                newTitle.push(cur);
            }
            return acc + cur.length;
        }, 0); // Passing 0 as a initial value for accumulator

        return `${newTitle.join(' ')} ...`;
    }
    return title;
}

// This markup code is added to HTML under searchResList
const renderRecipes = recipe => {
    const markup = `
    <li>
        <a class="results__link results__link--active" href="#${recipe.recipe_id}">
            <figure class="results__fig">
                <img src="${recipe.image_url}" alt="Test">
            </figure>
            <div class="results__data">
                <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                <p class="results__author">${recipe.publisher}</p>
            </div>
        </a>
    </li>`;

    // Adding HTML elements for each recipe on left side
    elements.searchResList.insertAdjacentHTML('beforeend', markup);
  
};

const createButton = (page, type) => `
    <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
        <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
        </svg>
    </button>`;

const renderButtons = (page, numOfPages, resPerPage) => {
    const pages = Math.ceil(numOfPages / resPerPage);
    let button;
 
    if(page === 1 && pages > 1) {
        // Just next button
        button = createButton(page, 'next');
    } else if(page < pages) {
        // Both button prev and next
        button = `
                ${createButton(page, 'prev')}
                ${createButton(page, 'next')}`;
    } else if(page === pages && pages > 1) {
        // Only prev button
        button = createButton(page, 'prev');
    }
    elements.searchResPages.insertAdjacentHTML('beforeend', button);
}

// Checkout result of data fetched and looping from them
export const renderResults = (recipes, page = 1, resPerPage = 10) => {
    // render results of current page
    const start = (page - 1) * resPerPage;
    const end = page * resPerPage;
    recipes.slice(start, end).forEach(ele => renderRecipes(ele));

    //render buttons of pagination
    renderButtons(page, recipes.length, resPerPage);
};