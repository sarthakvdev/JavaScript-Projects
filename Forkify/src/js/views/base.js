export const elements = {
    searchForm: document.querySelector('.search'),
    searchInput : document.querySelector('.search__field'),
    searchRes: document.querySelector('.results'),
    searchResList: document.querySelector('.results__list'),
    searchResPages: document.querySelector('.results__pages'),
    recipe: document.querySelector('.recipe'),
    shopping: document.querySelector('.shopping__list'),
    likesMenu: document.querySelector('.likes__field'),
    likesList: document.querySelector('.likes__list')
};

export const elementStrings = {
    loader: 'loader'
};

// Adding spinner to show loading in searchResPanel and RecipePanel
// We want to reuse it so adding in base.js
export const renderLoader = parent => {
    const loader = `
        <div class="loader">
            <svg>
                <use href="img/icons.svg#icon-cw"></use>
            </svg>
        </div>`;
    // We want it just after div starts
    parent.insertAdjacentHTML('afterbegin', loader);
}

// selecting loader and going to parent element and delete it
export const clearLoader = () => {
    const loader = document.querySelector(`.${elementStrings.loader}`);
    if(loader)
        loader.parentElement.removeChild(loader);
}