import { elements } from './base';

export const getInput = () => elements.searchInput.value;

// Clear search input box whenever search/enter is clicked
export const clearInput = () => {
    elements.searchInput.value = '';
};

// To clear previous results in resultsPanel whenever new item is searched
export const clearResults = () => {
    elements.searchResList.innerHTML = '';
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

// Checkout result of data fetched and looping from them
export const renderResults = recipes => {
    recipes.forEach(ele => renderRecipes(ele));
};