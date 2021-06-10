# TinyApp Project

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly).

## Final Product

!["cookies are encrypted"](https://github.com/lucasjohannson/tinyapp/blob/master/docs/encrypt.png?raw=true)
!["homepage"](https://github.com/lucasjohannson/tinyapp/blob/master/docs/url-home.png?raw=true)
!["shortURL output"](https://github.com/lucasjohannson/tinyapp/blob/master/docs/shortURL.png?raw=true)

## Dependencies

- Node.js
- Express
- EJS
- bcrypt
- body-parser
- cookie-session

## Getting Started

- Install all dependencies (using the `npm install` command).
- Run the development web server using the `node express_server.js` command.

## What the product does

Tiny App is my first web application that handles user sessions and personalized browser output. The application can create accounts via the register tab and supports logging in. All the personal information is hashed to ensure user security and the cookies are encrypted. The application will display the active users URL's and gives the option to add, delete or edit the urls. Each short URL created will redirect the user to the long urls page. No user can manipulate another users urls. This was a super fun project to create, Enjoy!