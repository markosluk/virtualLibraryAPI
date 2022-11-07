Virtual library API

Created with nodejs/express and mysql db.
Works on localhost.

Rest client extension was used for testing. 
File requests.rest included for test routes and parameters.

.env file included to check necessary data structure

Functionality description:

- user registration (username, first name, password)
- user login (login, password)
- administrator registration (username, first name, password)
- administrator login (username, password)

- creating book ( title, ISBN, author) by administrator
- deleting book by administrator
- editing details of books by administrator

- reading list of books by user and administrator
- reading list of available books by user and administrator

- borrowing book by user
- returning book by user

- User cannot perform administrator actions and vice versa.
- Borrowed book cannot be borrowed again unless the user which borrowed it returned it.
- JWT is used.
