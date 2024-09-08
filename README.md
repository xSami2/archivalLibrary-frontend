
# The Archival Library

## Overview

Archival Libray is a project that allows authenticated users to upload files and add metadata such as title, author, and so on. Each user has his own files, which he can download or delete it. 

## Architecture

The application is divided into two main components:

> Backend : 
 - SpringBoot
 - Hibernate
 - postgress
 - Lombok
 - Spring MVC
> Frontend
- React.js
- PrimeReact
 - react-toastify
 - Axios
 - react-router-dom

 ## Database Schema
![image](https://github.com/user-attachments/assets/f66e197a-a830-48d0-9e76-cfcbbe2a8a0c)


## Installation


```git
git clone https://github.com/xSami2/archivalLibrary-frontend.git

git clone https://github.com/xSami2/archivalLibrary.git
```

Now for Building the Image make sure you have docker installed in your Device 

- Navgaite to Front-end application

```cmd
 cd archivalLibrary-frontend
```

Install All Depdency 

```cmd
 npm i
```

Now build the Frontend docker image 

```cmd
  docker build -t  react-app . 
```

- Navgaite to Backend application

```cmd
 cd ..
 cd archivalLibrary
```

Now build the Backend docker image 

```cmd
  docker build -t  my-backend-image . 
```

now Build the Docker Compose 

```cmd
  docker compose up
```

Now you should See the Docker application running the Container 

try access http://localhost:5173

## Test Cases

- __Test Case 1: Register User__

**Expected Result**: The user is registered, and a confirmation message is displayed.
- __Test Case 2: Login User__

**Expected Result**: The user can login with his username and password and confirmation message is displayed.

- __Test Case 3: Upload Document without metadata__
**Expected Result**: The Appliction will inform the user about the required information and will not allow the user to upload the documents.
- __Test Case 4: Upload Document with metadata__
**Expected Result**: The Appliction will allow the user to upload the file and will show in the table
- __Test Case 5: Download Document__
**Expected Result**: The Appliction will Download the file for the user 
- __Test Case 6: Delete Document__
**Expected Result**: The Appliction will delete the appliction from the server and from the database for the user 

