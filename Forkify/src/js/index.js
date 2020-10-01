import Search from './models/Search';
// It is importing class Search from Search.js

/* Global state of the app
- Search object
- current recipe object
- shopping list object
- liked recipes
*/ // Trying to keep state empty 
const state = {};

const controlSearch = async () => {
    // 1. Get query from the queue
    const query = document.querySelector('.search__field').textContent; //TODO

    if(query) {

        console.log(query);
        // 2. create an object in state
        state.search = new Search(query);

        // 3. Prepare UI for new results

        // 4. get Results of the search.
        // We need to await this step so it get data from API -> async the function
        await state.search.getResults();

        // 5. Render results on UI
        console.log(state.search.result);
    } else {
        console.log('No query');
    }
}

document.querySelector('.search').addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});