﻿# Social-Media-App-Backend-REST-API

 ## API Structure

 The API structure for the "Social-Media" project can be organized as follows:

 - Authentication Routes
   - **/api/users/signup**: Register a new user account.
   - **/api/users/signin**: Log in as a user.
   - **/api/users/logout**: Log out the currently logged-in user.
   - **/api/users/logout-all-devices**: Log out the user from all devices.
 
  - User Profile Routes
    - /api/users/get-details/:userId: Retrieve user information, ensuring sensitive data like passwords is not exposed.
    - /api/users/get-all-details: Retrieve information for all users, avoiding display of sensitive credentials like passwords.
    - /api/users/update-details/:userId: Update user details while ensuring that sensitive data like passwords remains secure and undisclosed.
   
  - Post Routes
    - **/api/posts/all**: Retrieve all posts from various users to compile a news feed.
    - **/api/posts/:postId**: Retrieve a specific post by ID.
    - **/api/posts/**: Retrieve all posts for a specific user to display on their profile page.
    - **/api/posts/**: Create a new post.
    - **/api/posts/:postId**: Delete a specific post.
    - **/api/posts/:postId**: Update a specific post.
