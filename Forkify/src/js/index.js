import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import { elements, renderLoader, clearLoader, elementStrings } from './views/base';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';

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

            // calculate serving and timing
            state.recipe.calcTime();
            state.recipe.calcServings();

            //render recipe
            clearLoader();
            recipeView.renderRecipe(
                state.recipe,
                state.likes.isLiked(id)
            );
        } catch(error) {
            console.log(`Error: ${error}`);
        }
    }
}

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

//
// List Controller
//

const controlList = () => {
    // create a new list IF there is none yet
    if(!state.list) state.list = new List();
    
    // add each ingredient to the list and UI
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItems(item);
    });
}

//
// Likes Controller
//

// Testing
state.likes = new Likes();
likesView.toggleLikesMenu(state.likes.getNumLikes());

const controlLike = () => {
    if (!state.likes) state.likes = new Likes();
    const currentID = state.recipe.id;
    
    // User have not liked current recipe yet
    if(!state.likes.isLiked(currentID)) {
        // Add like to the state
        const newLike = state.likes.addLike(
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        );

        // Toggle the like button
        likesView.toggleLikeBtn(true);

        // Add the like to UI List
        likesView.renderLike(newLike);
    } else {
        // removes like from the state
        state.likes.deleteLike(currentID);

        // Toggle the like button
        likesView.toggleLikeBtn(false);

        // Remove like from UI list
        likesView.deleteLike(currentID);
    }

    likesView.toggleLikesMenu(state.likes.getNumLikes());
}

// Restore like reciepes on the pg load
window.addEventListener('load', () => {
    state.likes = new Likes();

    // Restore Likes
    state.likes.readStorage();

    // Toggle like menu button
    likesView.toggleLikeMenu(state.likes.getNumLikes());
});


// Handle delete and update list item event / button clicks
 elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;
    
    // Handle the delete button
    if(e.target.matches('.shopping__delete, .shopping__delete *')) {
        // Delete from state
        state.list.deleteItem(id);

        // Delete from UI
        listView.deleteItem(id);

        // Handle the count update
    } else if(e.target.matches('.shopping__count-value')) {
        const val = parseFloat(e.target.value, 10);
        state.list.updateCount(id, val);
    }
});


elements.recipe.addEventListener('click', e => {
    // Handling recipe servings control
    if(e.target.matches('.btn-decrease, .btn-decrease *')) {
        // decrease button is clicked
        if(state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingIngredients(state.recipe);
        }
    } else if(e.target.matches('.btn-increase, .btn-increase *')) {
        // increase button is clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingIngredients(state.recipe);
    } else if(e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        controlList();
    } else if(e.target.matches('.recipe__love, .recipe__love *')) {
        controlLike();
    }
});