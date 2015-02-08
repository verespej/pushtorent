# pushtorent

# Dev Setup

0. Ensure that you have `node` installed, and have the following npmmodules installed -  `grunt-cli`, `bower`
1. Install all dependencies using `npm install` and `bower install`
2. Run `npm start` to start the node server to get data from backend
3. Run `grunt dev` to start serving the front end web pages
4. Navigate to `http://localhost:9000`. You will have Less to CSS compiles, HTML process, live reload and a bunch of other things that the Gruntfile.js does 

# Demo/Production
1. Ensure that you have all the dependencies installed
2. Run `grunt dist` to compile and transform less, JS and HTML files. These are placed in `bin-site` directory
3. Start up the node server using `npm start`, and navigate to `http://localhost:5000`.
