## Installation and Starting

In order for app to work, it is necessary to have Node.js installed on your machine. You can learn how to do that by visiting  **[Node.js site](https://nodejs.org/en/)**.

Once you have it installed and the app is downloaded, you need to navigate in your terminal to **api_service**,  **front_service** folders and run:
```sh
$ npm install
```
command in both of them (order doesn't matter). This will install all required dependencies.

Now it's time to run the app by executing the command:
```sh
$ npm start
```
in the same folders as before (in your terminal).

Provided everything went well, the app is now running! :)

## Usage

I've decided to implement basic frontend using React.js. The API service itself was tested with **[Postman platform](https://www.postman.com/)** but given the opportunity of direct interaction via web page, one has broader view of how the service works, what features it offers and has a chance to play with it.

Once the app is up and running, you can visit the home page at: **http://localhost:3000**.

### Features

- user have the possibility to create his own account
- each user is allowed to search for movies by movie title. The service provides information such as title, year of production, genre or average score for the movie
- logged users are able to rate the movies and mark/unmark them as their favorite ones
