import Search from './models/Search';
import Recipe from './models/Recipe';
import { elements, renderLoader, clearLoader, elementStrings } from './views/base';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';

/* Global state of the app
- Search object
- current recipe object
- shopping list object
- liked recipes
*/
// trying to keep state empty
const state = {};

/* Search Controller */
const controlSearch = async () => {
    // 1. Get query from the queue
    const query = searchView.getInput();

    if(query) {
        // 2. create an object in state
        state.search = new Search(query);

        // 3. Prepare UI for new results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes); // Adding loader to result panel
        
        try {
            // 4. get Results of the search.
            // We need to await this step so it get data from API -> async the function
            await state.search.getResults();

            // 5. Render results on UI
            clearLoader();
            searchView.renderResults(state.search.result);
        } catch(error) {
            alert(error);
            clearLoader();
        }
    }
}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if(btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
    }
});

/* Recipe Controller */
const controlRecipe = async () => {
    const id = window.location.hash.replace('#', '') ; // To extract hash from url
    if(id) {
        // Prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        // Highlight selected search item
        if(state.search) searchView.highlightSelected(id);

        // Create new UI object
        state.recipe = new Recipe(id);
        
        try {
            // get recipe data and parse Ingredients
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();
            console.log(state.recipe.ingredients);

            // calculate serving and timing
            state.recipe.calcTime();
            state.recipe.calcServings();

            //render recipe
            clearLoader();
            recipeView.renderRecipe(state.recipe);
        } catch(error) {
            console.log(`Error: ${error}`);
        }
    }
}

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));