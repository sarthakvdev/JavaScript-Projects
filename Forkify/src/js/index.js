import Search from './models/Search';
import { elements, renderLoader, clearLoader } from './views/base';
import * as searchView from './views/searchView';

/* Global state of the app
- Search object
- current recipe object
- shopping list object
- liked recipes
*/ // Trying to keep state empty 
const state = {};

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

        // 4. get Results of the search.
        // We need to await this step so it get data from API -> async the function
        await state.search.getResults();

        // 5. Render results on UI
        clearLoader();
        searchView.renderResults(state.search.result);
    }
}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});