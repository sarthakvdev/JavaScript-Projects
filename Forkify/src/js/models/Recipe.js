import axios from 'axios';

export default class Recipe {
    constructor(id) {
        this.id = id;
    }

    async getRecipe() {
        try {
            const res = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
            this.title = res.data.recipe.title;
            this.author = res.data.recipe.publisher;
            this.img = res.data.recipe.image_url;
            this.source = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;
        } catch(error) {
            alert('Something went wrong :(');
        }
    }

    calcTime() {
        // assuming that for each 3 ingredients we need 15 mins
        const numIng = this.ingredients.length;
        const period = Math.ceil(numIng / 3);
        this.time = period * 15;
    }

    calcServings() {
        this.servings = 4;
    }

    parseIngredients() {
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds']; 
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
        const units = [...unitsShort, 'kg', 'g'];

        const newIngredients = this.ingredients.map(ele => {
            let ingredient = ele.toLowerCase();
            // 1. convert from long to short form
            unitsLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, unitsShort[i]);
            });

            // 2. remove parenthesis
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

            // 3. parse ingredients into count, unit and ingredient
            const arrIng = ingredient.split(' ');
            const unitIndex = arrIng.findIndex(ele2 => units.includes(ele2));

            let objIng;
            if(unitIndex > -1) {
                // There is a unit
                // Ex. 4 1/2 cups, arrCount is [4,1/2] --> eval("4+1/2") --> 4.5
                // Ex. 4 Cups, arrCount is [4]
                let arrCount = arrIng.slice(0, unitIndex);

                let count;
                if(arrCount.length == 1) {
                    count = eval(arrCount[0].replace('-', '+'));
                } else if(arrCount > 0) {
                    // Ex. this turns [4,1/2] -> "4+1/2" and eval("4+1/2") --> 4.5   
                    count = eval(arrIng.slice(0, unitIndex).join('+'));
                }
                objIng = {
                    count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex + 1).join(' ')
                };

            } else if(parseInt(arrIng[0], 10)) {
                // There is no unit, but a number
                objIng = {
                    count: parseInt(arrIng[0], 10),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ')
                }
            } else if(unitIndex === -1) {
                // There is NO Unit and Number in 1st Position
                objIng = {
                    count: 1,
                    unit: '',
                    ingredient
                }
            }
            return objIng;
        });
        this.ingredients = newIngredients;
    }

    updateServings(type) {
        // Serving
        const newServing = (type === 'dec' ? this.servings - 1 : this.servings + 1);

        // Ingredient
        this.ingredients.forEach(ing => {
            ing.count *= (newServing/this.servings);
        });

        this.servings = newServing;
    }
}