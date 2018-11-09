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
    connection.query('SELECT * FROM products', function(err, res) {
        if (err) throw err;
        if (res.length > 0) {
            console.log('WELCOME TO BAMAZON!!! \n' +
                '__________________________________________________________________');
            console.log('Here are our products....');
            for(let x = 0; x < res.length; x++) {
                console.log(`Item ID: ${res[x].item_id} || Name: ${res[x].product_name} || Price: ${res[x].price}`);
            }
            console.log('\n');

            inquirer
                .prompt([
                    {
                        name: 'itemID',
                        type: 'input',
                        message: 'Enter the ID of the item you would like to purchase'
                    },
                    {
                        name: 'units',
                        type: 'input',
                        message: 'How many units would you like to purchase?'
                    }]).then(function(answer) {
                    //Check to see if the ID is valid
                    let id = parseInt(answer.itemID);
                    let units = parseInt(answer.units);

                    if (isNaN(id) || (id > res.length)) {
                        console.log('Please enter a valid ID number');
                    } else {
                        console.log('You\'re in bitch!');
                        transact(id, units);
                    }
                });
        } else {
            console.log('Our server is out for maintenance. Try again later.');
        }
    });
};

const transact = (id, units) => {
    let query = `SELECT product_name,price,stock_quantity FROM products WHERE item_id = ${id}`;
    connection.query(query, function(err, res) {
        if (err) throw err;
        console.log(res);

        if(units <= res[0].stock_quantity) {            //check if theres enough units for the product
            let newQuantity = res[0].stock_quantity - units;
            let orderPrice = res[0].price * units;
            let product = res[0].product_name;

            connection.query(                           //update the inventory for the product
                'UPDATE products SET ? WHERE ?',
                [
                    {
                        stock_quantity: newQuantity
                    },
                    {
                        item_id: id
                    }
                ],
                function(error) {
                    if (error) {
                        throw err;
                    } else {
                        console.log(`\nPurchase Complete!\nThank you for your purchase of ${units} units of ${product}.\nYour total cost for this purchase is  $${orderPrice}\n__________________________________________________________________\n`);
                        setTimeout(function () {
                            start();
                        }, 1500);
                    }
                }
            );
        } else {
            console.log('Insufficient quantity! \n Check back later.\n__________________________________________________________________\n');
            start();
        }
    });

};
