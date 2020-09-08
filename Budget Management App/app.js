
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

    var calculateTotal = function(type) {
        var sum = 0;

        data.allItems[type].forEach(function(cur) {
            sum = sum + cur.value;
        });

        data.totals[type] = sum;
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
        },

        budget: 0,
        percentage: -1
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

        deleteItem: function(id, type) {
            var ids, index;

            type = (type === 'income' ? 'inc' : 'exp'); 

            // We are using map function here to callback instead of forEach because map returns a new array
            ids = data.allItems[type].map(function(current) {
                return current.id;
            });

            index = ids.indexOf(id);

            if(index !== -1) {
                data.allItems[type].splice(index, 1);
            }

        },

        calculateBudget: function() {
            // 1. Calculate Total income and expenses
            calculateTotal('inc');
            calculateTotal('exp');

            // 2. Calculate the budget: totalIncome - totalExpenses
            data.budget = data.totals.inc - data.totals.exp;

            // 3. calculate percentage of income that we spent
            if(data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp/data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }
        },

        getBudget: function() {        //In getBudget we returns an object containing req data
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
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
        expensesContainer: ".expenses__list",
        budgetLabel: ".budget__value",
        incomeLabel: ".budget__income--value",
        expensesLabel: ".budget__expenses--value",
        percentageLabel: ".budget__expenses--percentage",
        container: ".container"
    };

    return {
        getInput: function() {
            return {
                type: document.querySelector(DOMstrings.inputType).value,          //It will be wither 'inc' or 'exp'
                description: document.querySelector(DOMstrings.inputDescription).value, //Name of entry
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)                //Amount of entry
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

        deleteListItem: function(selectorID) {
            // There is no method to directly remove the element but only childElement
            // So we will transfer it to parentNode and then delete childNode
            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
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
        },

        displayBudget: function(obj) {
            document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;

            if(obj.totalInc > 0) {
                document.querySelector(DOMstrings.incomeLabel).textContent = "+ " + obj.totalInc;
            } else {
                document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
            }

            if(obj.totalExp !== 0) {
                document.querySelector(DOMstrings.expensesLabel).textContent = "- " + obj.totalExp;
            } else {
                document.querySelector(DOMstrings.expensesLabel).textContent = obj.totalExp;
            }

            if(obj.percentage > 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + "%";
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = "---";
            }
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

        document.querySelector(DOM.container).addEventListener("click", ctrlDeleteItem)
    };

    var updateBudget = function() {
        // 1. Calcualate the Budget
        budgetCtrl.calculateBudget();
    
        // 2. Return the Budget
        var budget = budgetCtrl.getBudget();

        // 3. Display the Budget
        UICtrl.displayBudget(budget);
    }

    var ctrlAddItem = function() {
        var input, newItem;

        // 1. Get all the input data
        input = UICtrl.getInput();

        if(input.description !== "" && !isNaN(input.value) && input.value > 0) {

            // 2. Add item to the budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);
        
            // 3. Add item to the UI
            UICtrl.addListItem(newItem, input.type);
    
            // 4. Clear the fields
            UICtrl.clearFields();
    
            // 5. calculate and update budget
            updateBudget();
        }
    }

    var ctrlDeleteItem = function(event) {
        var itemID, splitID, type, ID;

        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        splitID = itemID.split("-");
        type = splitID[0];
        ID = parseInt(splitID[1]);
          
        //1. delete item from Data structure
        budgetCtrl.deleteItem(ID, type);

        //2. delete item from UI; Pass itemID so it can directly delete the element from DOM
        UICtrl.deleteListItem(itemID);

        //3. update the budget
        updateBudget();
    }
    
    return {
        init: function() {
            console.log("Application has started!");

            // passing modified budget object for initial budget values
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: 0
            });
            
            setUpEventListeners();
        }
    }

})(budgetController, UIController);


// only line of code thats going to be placed outside
// It's to be called when the webpage starts
controller.init();