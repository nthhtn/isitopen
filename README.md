# IS IT OPEN?

***

Description of the webapp is here: https://gist.github.com/seahyc/d013a8f8f1c1be52513cf7b77cce6e81

This is the raw data for restaurant opening hours - (https://gist.githubusercontent.com/seahyc/7ee4da8a3fb75a13739bdf5549172b1f/raw/f1c3084250b1cb263198e433ae36ba8d7a0d9ea9/hours.csv). Treat it as a raw data source that you can extract, transform and load into your database.

### Features

* Authentication (login to use)
* Extract, transform, and load restaurants from .csv file into database
* View and filter restaurants
* Create personal collection of restaurants
* Add restaurants into collection
* Remove restaurants from collection

### Technologies in use

***

* Node.js ft. Express
* React ft. Redux
* MongoDB

### Installation

* Clone project:
```
git clone https://github.com/nthhtn/isitopen.git
```

* Install packages:
```
npm install
```

* Initialize `.env` file in root folder, specifying:
```
MONGO_DB=your_mongodb_uri
```

* Run project:
```
npm start
```

### Acknowledgements

***

This webapp is a prototype only, with limited functionalities and lack of exception handling


### Contributors

***

Nguyen The Hien <thehien115@gmail.com>
