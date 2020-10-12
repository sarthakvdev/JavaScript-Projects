import Search from './models/Search';
import Recipe from './models/Recipe';
import { elements, renderLoader, clearLoader, elementStrings } from './views/base';
import * as searchView from './views/searchView';

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
        // Prepare for UI

        // Create new UI object
        state.recipe = new Recipe(id);

        // get recipe data
        await state.recipe.getRecipe();

        // calculate serving and timing
        state.recipe.calcTime();
        state.recipe.calcServings();

        // render data
        // console.log(state.recipe);
    }
}

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));