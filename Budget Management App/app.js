
// BUDGET CONTROLLER
var budgetController = (function() {
    //function constructor of Expenses and Income
    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }

    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }

    //We created a data structre consisting of Objects to structure our expense and income
    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        }
    }

    return {
        addItem: function(type, des, val) {
            var newItem, ID;

            // [1 2 3 4 5] next ID = 6
            // ID = last ID + 1
            // Create new ID
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length -1].id + 1;
            } else {
                ID = 0;
            }

            // Create new item based on 'inc' or 'exp' type
            if(type === 'exp') {
                newItem = new Expense(ID, des, val);
            } else if(type === 'inc') {
                newItem = new Income(ID, des, val);
            }

            // Push it into our data strucure
            data.allItems[type].push(newItem);

            // return new Item
            return newItem;
        },

        testing: function() {
            console.log(data);
        }
    }
})();

// UI CONTROLLER
var UIController = (function() {
    var DOMstrings = {                  //object contains strings vars for class names
        inputType: ".add__type",
        inputDescription: ".add__description",
        inputValue: ".add__value",
        inputBtn: ".add__btn",
        incomeContainer: ".income__list",
        expensesContainer: ".expenses__list"
    };

    return {
        getInput: function() {
            return {
                type: document.querySelector(DOMstrings.inputType).value,          //It will be wither 'inc' or 'exp'
                description: document.querySelector(DOMstrings.inputDescription).value, //Name of entry
                value: document.querySelector(DOMstrings.inputValue).value                //Amount of entry
            }
        },

        addListItem: function(obj, type) {
            var html, newHtml, element;

            //creating html strings to enter within their preferred div boxes
            if(type === 'inc') {
                element = document.querySelector(DOMstrings.incomeContainer);

                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">+ %value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if(type === 'exp') {
                element = document.querySelector(DOMstrings.expensesContainer);
                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">- %value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            //replacing %id%, %description% and %value% from our 'inc' and 'exp' Strings
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);

            element.insertAdjacentHTML('beforeend', newHtml);
        },

        clearFields: function() {
            var fields, fieldsArr;

            // querySelectorAll returns a list, assigned to 'fields'
            fields = document.querySelectorAll(DOMstrings.inputDescription + ", " + DOMstrings.inputValue);

            //converting fields to array called fieldsArr by slice method in array prototype
            fieldsArr = Array.prototype.slice.call(fields);

            //using forEach method to remove value of each element in fieldsArr
            fieldsArr.forEach(function(current, index, array) {
                current.value = "";
            });

            fieldsArr[0].focus();   //bringing focus back to description
        },

        getDOMStrings: function() {
                return DOMstrings;
        }
    };
})();


// GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl) {

    var setUpEventListeners = function() {
        //Imported all the DOMStrings we assigned in UIController
        var DOM = UICtrl.getDOMStrings();

        // Event Listner if user press the "CHECK" button
        document.querySelector(DOM.inputBtn).addEventListener("click", ctrlAddItem);

        // Event Listner if user press "ENTER" key
        document.addEventListener("keypress", function(event) { 
            if(event.keyCode === 13 || event.which === 13) {
               ctrlAddItem();
            }
        });
    };

    function ctrlAddItem() {
        var input, newItem;

        // 1. Get all the input data
        input = UICtrl.getInput();

        // 2. Add item to the budget controller
        newItem = budgetCtrl.addItem(input.type, input.description, input.value);
        
        // 3. Add item to the UI
        UICtrl.addListItem(newItem, input.type);

        // 4. Clear the fields
        UICtrl.clearFields();

        // 5. calculate the budget


        // 6. display the budget in UI

    }
    
    return {
        init: function() {
            console.log("Application has started!");
            setUpEventListeners();
        }
    }

})(budgetController, UIController);


// only line of code thats going to be placed outside
controller.init();