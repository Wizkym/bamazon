//Require packages
const inquirer = require('inquirer');
const mysql = require('mysql');

// create the connection information for the sql database
const connection = mysql.createConnection({
    host: 'localhost',

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: 'root',

    // Your password
    password: '',
    database: 'bamazon_db'
});

// connect to the mysql server and sql database
connection.connect(function(err) {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    start();
});

const start = () => {
    console.log('WELCOME TO BAMAZON \n***MANAGER VIEW***\n_________________________________________________\n');
    inquirer.prompt({
        name: 'choice',
        type: 'list',
        message:
            'Select',
        choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product']

    }).then(function (ans) {
        switch (ans.choice) {
            case 'View Products for Sale':
                viewAll();
                break;
            case 'View Low Inventory':
                viewLowInv();
                break;
            case 'Add to Inventory':
                addInv();
                break;
            case 'Add New Product':
                addProd();
                break;
            default:
                console.log('Please choose an option.');
                start();
                break;
        }
    });
};

const viewAll = () => {
    connection.query('SELECT * FROM products', function(err, res) {
        if(!res) {
            console.log('\nEmpty Set!');
        } else {
            console.log('\n');
            console.table(res);
            console.log('\n_________________________________________________\n');
        }
        start();
    });
};

const viewLowInv = () => {
    connection.query('SELECT * FROM products WHERE stock_quantity < 5', function(err, res) {
        if (res.length < 1) {
            console.log("\nTHERE\'S CURRENTLY NO PRODUCTS UNDER THIS CRITERIA\n_________________________________________________\n");
        } else {
            console.log('\n');
            console.table(res);
            console.log('\n___________________________________________________________________________\n');
        }
        start();
    });
};

const addInv = () => {
    connection.query('SELECT * FROM products', function (err, res) {
        if (err) throw err;
        if(!res) {
            console.log('\nEmpty Set!');
        } else {
            let items = [];                     // define an array to store item names
            for(let i = 0; i < res.length; i++) {
                items.push(res[i].product_name);    //push all items inside the array
            }

            inquirer.prompt([{
                name: 'choice',
                type: 'list',
                message:
                    'Which of the following items do you want to add?',
                choices: items
            }, {
                name: 'units',
                type: 'input',
                message: 'How many more units do you want to add?',
                validate: function (units) {
                    if(!parseInt(units)){
                        return 'Please enter a valid number of units';
                    }
                    return true;
                }
            }]).then(function (ans) {
                let name;
                let itemId;
                let currentUnits;

                if (parseInt(ans.units)) {
                    for (let x = 0; x < res.length; x++) {
                        if(ans.choice === res[x].product_name) {
                            name = res[x].product_name;
                            itemId = res[x].item_id;                //grab the item id
                            currentUnits = parseInt(res[x].stock_quantity);   //grab the stock quantity
                        }
                    }
                    let newUnits = currentUnits + parseInt(ans.units);        //compute for the new number of units
                    connection.query(
                        'UPDATE products SET ? WHERE ?',
                        [
                            {
                                stock_quantity: newUnits

                            }, {
                            item_id: itemId
                        }
                        ],
                        function (error) {
                            if (error) {
                                throw err;
                            } else {
                                console.log(`\nUpdate in progress..........\nSUCESS!!!\nThere's now ${newUnits} current units of ${name}\n_________________________________________________\n`);
                                start();
                            }
                        }
                    );
                } else {
                    console.log("\nPlease enter a valid unit number!!!\n_________________________________________________\n");
                    start();
                }
            });
        }
    });
};

const addProd = () => {
    console.log('\n***Welcome to the product addition menu***\nFollow the prompts carefully!\n');
    inquirer.prompt(
        [
            {
                name: 'item',
                type: 'input',
                message: "What is the name of the product?"
            },
            {
                name: 'dept',
                type: 'input',
                message: 'What department is this item in?'
            },
            {
                name: 'price',
                type: 'input',
                message: 'What would be the cost of this item?(up to 2dp)',
                validate: function (val) {
                    if (!parseFloat(val)) {
                        return 'Please enter a valid price';
                    }
                    return true;
                }
            },
            {
                name: 'stock',
                type: 'input',
                message: 'How much do you have of this product?',
                validate: function (num) {
                    if(!parseInt(num)){
                        return 'Please enter a valid amount';
                    }
                    return true;
                }
            }
        ]
    ).then(function (ans) {
        let newPrice = parseFloat(ans.price);
        let newStock = parseInt(ans.stock);

        connection.query('INSERT INTO products SET ?', {
            product_name: ans.item,
            department_name: ans.dept,
            price: newPrice,
            stock_quantity: newStock

        }, function (err) {
            if (err) {
                throw err;
            } else {
                console.log(`Your new item has been successfully added to the inventory.`);
                start();
            }
        });
    });

};