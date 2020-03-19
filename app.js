// module for storing the value
var budgetController = (function(){

    var Income = function(id, description, value){
         this.id = id;
         this.description = description;
         this.value = value;
    }

    var Expense = function(id, description, value){
        this.id = id;
         this.description = description;
         this.value = value;
         this.percentage = -1;
    }

    Expense.prototype.calculatePercentage = function(totalincome){
        if(totalincome > 0){
            this.percentage = Math.round((this.value/totalincome) * 100);
        }else{
            this.percentage = -1;
        }
    }

    Expense.prototype.getPercentage = function(){
        return this.percentage;
    }

    var calculateTotal = function(type){
        var sum = 0;
        data.allItems[type].forEach(function(cur){
            sum += cur.value; 
           
        })
        data.total[type] = sum;
    }

    var data= {
        allItems: {
            inc: [],
            exp: []
        },   
        total: {
            inc: 0,
            exp: 0
        },
        budget: 0,
        percentage: -1

    }

    return{
        addItem: function(type, des, val){
            var ID, newItem;
            
            //create new ID
            if(data.allItems[type].length > 0){
            ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            }else{
                ID = 0;
            }
            
            //console.log(ID);

            //creating objects based on the type
            if(type === 'inc'){
                newItem = new Income(ID, des, val);
            }else if(type === 'exp'){
                newItem = new Expense(ID, des, val);
            }
            
            //console.log(newItem);

            //push the value to the DS array
            data.allItems[type].push(newItem);

            //return the new item crated
            return newItem;
            
            // console.log(newItem.ID);
        },

        calculateBudget: function(){
            //1. Calculate the budget
        calculateTotal('exp');
        calculateTotal('inc');

            //2. find the total budget
        data.budget = data.total.inc - data.total.exp;

            //3. find the percentage
            
        data.percentage = Math.round((data.total.exp/data.total.inc) * 100);  
        //console.log(data.percentage);
    },

        getBudget: function(){
           return {
               budget: data.budget,
               totalinc: data.total.inc,
               totalexp: data.total.exp,
               percentage: data.percentage
           }
        },

        deleteItem: function(type, id){
            var ids, index;
     
             ids = data.allItems[type].map(function(current){
                 return current.id;
             });
             
             index = ids.indexOf(id);
             
             if(index !== -1){
               
             data.allItems[type].splice(index, 1);
             }
         },

         calculatePercentages: function(){
                 data.allItems.exp.forEach(function(current){
                     current.calculatePercentage(data.total.inc)
                    });
         },

         getPercentages: function(){
                var allPer = data.allItems.exp.map(function(cur){
                    return cur.getPercentage();
                })
                return allPer;
         },

        testing: function(){
            console.log(data);
        }

    }

})();

//module for receiving the value from UI
var UIcontroller = (function(){
    DOMstrings = {
        inputtype: '.add__type',
        inputdescription: '.add__description',
        inputvalue: '.add__value',
        inputbtn: '.add__btn',
        inputincomelist: '.income__list',
        inputexpenseslist: '.expenses__list',
        totalBudgetVal: '.budget__value',
        totalIncomeVal: '.budget__income--value',
        totalExpenseVal: '.budget__expenses--value',
        totalPercentage: '.budget__expenses--percentage',
        closebutton: '.container',
        expensePersentage: '.item__percentage',
        dateValue: '.budget__title--month'
    };

    var formatNumbers = function(num, type){
      var splitNum, int, dec, intValue, type;
        num = Math.abs(num);
        num = num.toFixed(2);
        
        splitNum = num.split('.');
        int = splitNum[0];
        dec = splitNum[1];

       if(int.length > 3){
       int = int.substr(0,int.length-3) +','+ int.substr(int.length-3,3);
       }

       return (type === 'exp' ? '-':'+')+ ' ' + int + '.' + dec;

    };
    
    //nodelist function
    var nodelistforEach = function(list, callback){
        for(var i=0; i<list.length; i++){
            callback(list[i], i);
        }
    }

    //making it public as this methods needs to be called 
    return{
    getInput: function(){

        return{
            type: document.querySelector(DOMstrings.inputtype).value,
            description: document.querySelector(DOMstrings.inputdescription).value,
            value: parseFloat(document.querySelector(DOMstrings.inputvalue).value)
        };
    },

    addlistitem: function(obj, type){
        var html, element, innerhtml;
         

        //create HTML with placeholder text
        if(type === 'inc'){
            element = '.income__list';
                 html='<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'; 
        }else if(type === 'exp'){
            element = '.expenses__list';
            html='<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
        }

        //replacing the placeholder with actual data by using replace method
        //console.log(obj.id);
        innerhtml = html.replace('%id%', obj.id);
        innerhtml = innerhtml.replace('%description%', obj.description);
        innerhtml = innerhtml.replace('%value%', formatNumbers(obj.value, type));

        //Manipulating the DOM and adding to the list
        document.querySelector(element).insertAdjacentHTML('beforeend', innerhtml);
    },

    deleteListItem: function(selectorID){
        var el = document.getElementById(selectorID);
        el.parentNode.removeChild(el);
         
    },

    clearFields: function(){
         var field, fieldArr;

        field = document.querySelectorAll(DOMstrings.inputdescription + ', ' + DOMstrings.inputvalue);
        fieldArr = Array.prototype.slice.call(field);
        fieldArr.forEach(function(current, index, array){
            current.value = "";
        });
        fieldArr[0].focus();
    },
    
    displayBudget: function(obj){
        var type;
        obj.budget > 0 ? type = 'inc' : type = 'exp';
         document.querySelector(DOMstrings.totalBudgetVal).textContent = formatNumbers(obj.budget, type);
         document.querySelector(DOMstrings.totalIncomeVal).textContent = formatNumbers(obj.totalinc, 'inc');
         document.querySelector(DOMstrings.totalExpenseVal).textContent = formatNumbers(obj.totalexp, 'exp');
         
         //console.log(obj.percentage);
         if(obj.percentage > 0){
         document.querySelector(DOMstrings.totalPercentage).textContent = obj.percentage + '%';
         }else{
            document.querySelector(DOMstrings.totalPercentage).textContent = "---";
         }
    },

    displayPercentages: function(percentage){
        var fields = document.querySelectorAll(DOMstrings.expensePersentage);

        nodelistforEach(fields, function(current, index){
           if(percentage[index] > 0){
               current.textContent = percentage[index] +'%' ;
           }else{
            current.textContent = '---';
           }

        });
    },
     
    setDate: function(){
    var now, year, month, months;
     now = new Date();
     year = now.getFullYear();
     month = now.getMonth();
     
     months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
     
     document.querySelector(DOMstrings.dateValue).textContent = months[month] +' '+ year;
    },
    
    changeColour: function(){
    var fields = document.querySelectorAll(DOMstrings.inputtype+','+DOMstrings.inputdescription+','+DOMstrings.inputvalue);
    nodelistforEach(fields, function(cur){
        cur.classList.toggle('red-focus');
    });
 
    document.querySelector(DOMstrings.inputbtn).classList.toggle('red');

    },

     getDOMstrings: function(){
           return DOMstrings;
     }

    }
})();

//module for interating with both controllers
var controller = (function(cntrlBudget, cntrlUI){

    var setupeventlisteners = function(){
        DOM = cntrlUI.getDOMstrings();

        document.querySelector(DOM.inputbtn).addEventListener('click', cntrladditem);
        document.addEventListener('keypress',function(event){
            if(event.keyCode === 13 || event.which === 13){
                cntrladditem();
            }
        });
        document.querySelector(DOM.closebutton).addEventListener('click', cntrldeleteitem);
        document.querySelector(DOM.inputtype).addEventListener('change', cntrlUI.changeColour);
    };
    

    var updateBudget = function(){
        //1. Calculate the budget
    cntrlBudget.calculateBudget();

        //2. Return the budget
    var budgetValues = cntrlBudget.getBudget();
        //3. Display the budget on the UI
    cntrlUI.displayBudget(budgetValues);

        };

    var updatePercentages = function(){
        //1. calculate the percentage
     cntrlBudget.calculatePercentages();

        //2. get the percentages
     expensePer = cntrlBudget.getPercentages();

        //3. display the percentage
    cntrlUI.displayPercentages(expensePer);
    };

    var cntrladditem = function(){

        var input, newItem;

    //1. Get the field input data
    input = cntrlUI.getInput();
         //console.log(input);
         //console.log('testing phase');

    if(input.description !== "" && !isNaN(input.value) && input.value > 0){
             //2. Add the item to the budget controller and recive back the object created
    newItem = cntrlBudget.addItem(input.type, input.description, input.value);
        //console.log(newItem);

    //3. Add the item to the UI
       cntrlUI.addlistitem(newItem, input.type);
    
    //4. clear the values of field  after adding
       cntrlUI.clearFields();   

    //5.calculate and update budget
    updateBudget();

    //6. calculate percentages
    updatePercentages();

    }
    };
    
    var cntrldeleteitem = function(event){
        var itemID, splitID, type, ID;

        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        
        if(itemID){
        splitID = itemID.split('-');
        
        type = splitID[0];
        ID = parseInt(splitID[1]);
        

        //1. Delete the ID from the DS
        cntrlBudget.deleteItem(type, ID);

        //2. Remove from the UI
        cntrlUI.deleteListItem(itemID);

        //3. update the budget
         updateBudget();

         // 4. calculate percentages
         updatePercentages();

        }
    };

    return{
    init: function(){
           setupeventlisteners();
           cntrlUI.setDate();
           cntrlUI.displayBudget({
            budget: 0,
            totalinc: 0,
            totalexp: 0,
            percentage: -1
           }
           );
    }
    };

})(budgetController, UIcontroller);

controller.init();