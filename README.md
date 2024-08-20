# Boilerplate Next 15 with Postgress connection using pure SQL

This template shows an example of a Next 15 CRUD with the PostgreSQL DBMS using best practices. Give this template a ⭐ if you like it, so you can save it and use it later.

# Notes Manager

The note manager is a very simple project in which you can register, update and delete a note, with a form validator [ZOD](https://zod.dev/?id=introduction), local database [PG](https://www.postgresql.org/download/) and very fast web browsing with [Next 15](https://nextjs.org/blog/next-15-rc). The main focus is to start a project with the structure already defined, with the best practices as soon as possible.

![alt text](https://github.com/ManoelFer/next-with-postgresql-boilerplate/blob/main/readme-files/notes-management-2024-8-15.gif 'Web example gif')

### Technologies used

- [ZOD](https://zod.dev/?id=introduction)
- [PostgreSQL](https://www.postgresql.org/download/)
- [Next 15](https://nextjs.org/blog/next-15-rc)
- [Husky](https://typicode.github.io/husky/)
- [Prettier](https://prettier.io/)
- [Eslint](https://eslint.org/)
- [Tailwind](https://tailwindcss.com/)

## Before the start

Before you start, make sure you have all this installed and working:

- IDE - I'm using [VSCode](https://code.visualstudio.com/download)
- PostgreSQL - we need to have it installed and connected
- [Node](https://nodejs.org/en/download/package-manager/current) - Version: v20.12.2 or higher

## Recommended VSCode extensions

- Prettier:

![prettier](https://github.com/ManoelFer/next-with-postgresql-boilerplate/blob/main/readme-files/prettier.png)

- Eslint:

![eslint](https://github.com/ManoelFer/next-with-postgresql-boilerplate/blob/main/readme-files/eslint.png)

## Necessary knowledge

- Javascript, tailwind css, SQL, React, NextJS, Git, Node

## How to start ✅

1 - Execute the queries in your postgress connection:

⚠️ If you don't know how to do this, watch the [video](https://www.youtube.com/watch?v=L_2l8XTCPAE)!

```
CREATE DATABASE note_db;

CREATE TABLE notes(
  id BIGSERIAL NOT NULL PRIMARY KEY,
  note VARCHAR(200) NOT NULL,
  date VARCHAR(12) NOT NULL
);
```

2 - After that, clone this template and give it the initial name of the project:

![alt text](https://github.com/ManoelFer/next-with-postgresql-boilerplate/blob/main/readme-files/use-template.png)

3 - Assuming you already know how to clone a repository into a local folder of your choice, let's move on to the next commands.

4 - Run the following command to install the project dependencies:

```
yarn
```

or

```
npm install
```

5 - Create a file in the root of the project and name it **_.env.local_** and add the parameters to the connection to the pg database. In the end, your file will look like this:

![env file](https://github.com/ManoelFer/next-with-postgresql-boilerplate/blob/main/readme-files/env.png)

6 - Now run `yarn dev` or `npm run dev` command and see the magic ✨
