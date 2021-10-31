//this is a js class that does all that relates to our book, here
//we add, remove and update books

const fileUtil = require('./fileUtil');
const routeHandler = {};
const helper = require('./helper');
routeHandler.books = (data, callback) => {
    const acceptableHeaders = ["post", "get", "put", "delete"];
    if (acceptableHeaders.indexOf(data.method) > -1) {
        routeHandler._books[data.method](data, callback);
    } else {
        callback(405);
    }
};

//main route object
routeHandler._books = {};

//Post route -- for creating a book
routeHandler._books.post = (data, callback) => {
    //validate that all required fields are filled out
    var name = typeof(data.payload.name) === 'string' && data.payload.name.trim().length > 0 ? data.payload.name : false;
    var price = (typeof(data.payload.price) === 'string' || typeof(data.payload.price) === 'number') && !isNaN(parseInt(data.payload.price)) ? data.payload.price : false;
    var author = typeof(data.payload.author) === 'string' && data.payload.author.trim().length > 0 ? data.payload.author : false;
    var publisher = typeof(data.payload.publisher) === 'string' && data.payload.publisher.trim().length > 0 ? data.payload.publisher : false;
    if (name && author && publisher) {
        const fileName = helper.generateRandomString(30);
        fileUtil.create('books', fileName, data.payload, (err) => {
            if (!err) {
                callback(200, { message: "Add book successfull", data: null });
            } else {
                callback(400, { message: "Add book Failed" });
            }
        });
    } else {
        callback(400, { message: "You must provide the 'name, price, author and publisher' of the book" });
    }
};
//we use this 'get route' to get a book
routeHandler._books.get = (data, callback) => {
    if (data.query.name) {
        fileUtil.read('books', data.query.name, (err, data) => {
            if (!err && data) {
                callback(200, { message: 'book retrieved', data: data });
            } else {
                callback(404, { err: err, data: data, message: 'book retrieval failed' });
            }
        });
    } else {
        callback(404, { message: 'book not found', data: null });
    }
};
//now let us update the book
routeHandler._books.put = (data, callback) => {
    if (data.query.name) {
        fileUtil.update('books', data.query.name, data.payload, (err) => {
            if (!err) {
                callback(200, { message: 'Successfully updated the books' })
            } else {
                callback(400, { err: err, data: null, message: 'update failed' });
            }
        });
    } else {
        callback(404, { message: 'book not found' });
    }
};
//if we want to remove the books this is called
routeHandler._books.delete = (data, callback) => {
    if (data.query.name) {
        fileUtil.delete('books', data.query.name, (err) => {
            if (!err) {
                callback(200, { message: 'book removed' });
            } else {
                callback(400, { err: err, message: 'sorry, you cannot remove this book' });
            }
        })
    } else {
        callback(404, { message: 'book not found' });
    }
};


routeHandler.ping = (data, callback) => {
    callback(200, { response: "server is running" });
};
routeHandler.notfound = (data, callback) => {
    callback(404, { response: 'not found' });
};

module.exports = routeHandler;