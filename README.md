# Zillow Hack Housing Hackathon; February 6-8th, 2015: Push to Rent

Push to Rent is an application that gives renters at the lowest income levels to be able to apply for and find housing in one easy to use environment. 

Renters simply go to the Push to Rent Desktop or Mobile Website and create an account which also serves as the only application they need to complete. In one place, renters input their applicant information such as Name, Email, Phone Number, Address, Social Security Number, Monthly Income, Name of Employer; all the information needed when applying for a rental property. This information is immediately verified through credit checks, background checks, and  employment verification, and Push to Rent provides a list of rental properties which fit the needs of the prospective tenants.

Through an algorithm, we are able to establish a ranking of best properties, color coating by green, yellow, and red, and in addition having a number score. This score takes into account public housing qualifications, Section 8 Voucher qualifications, ability to pay, proximity to employment, and transportation need. 

The application was developed on February 6th, 2015 for the Zillow Hack Housing Hackathon.

# Challenge and Approach
* Our submission is for the Challenge of improving renting for low income renters.
* Our approach for satisfying this challenge was to:
  * Understand the difficulties of renting as a low income renter and how one would be able to create a single place to find a home.
  * Develop a responsive app which allows for applicant data to be collected and reviewed, along with using data to discover public housing options, rentals, and street views of properties.
  * Analyzing scalability of application across all income levels.

# Team Members
Our team is comprised of:

* @ksadasivam - Full Stack Engineer, hacker, works @Microsoft 
* @nparashuram - developer, serial hacker, midnight dog walker
* @HVerespej - Full Stack Engineer, Growth Hacker @MadronaVentures, Former @Microsoft 
* @jonathangags - Biz Dev Entrepreneur, AdTech Accounts Lead, Startup Aficionado, former Mortgage Consultant @Bank of America

# Technologies, APIs, and Datasets Utilized
* AngularJS
* NodeJS
* Twilio
* Google maps geolocation api
* Public housing development datasets


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

# License
Our code is licensed under the MIT License. Pull requests will be accepted to this repo, pending review and approval.


