# Contact Book App

A simple web application for managing contacts built with React and Node.js.

## What This App Does

- Add new contacts with name, email, and phone number
- View all your contacts in a list
- Delete contacts you no longer need
- Navigate through multiple pages of contacts
- Works on both mobile phones and computers

## Technologies Used

- **Frontend**: React (for the user interface)
- **Backend**: Node.js with Express (for the server)
- **Database**: SQLite (stores your contacts)

## How to Run the App

### Step 1: Install Dependencies

First, install the backend dependencies:

cd backend
npm install


Then, install the frontend dependencies:

cd ../frontend
npm install


### Step 2: Start the Backend Server

Open a terminal and run:

cd backend
npm start


You should see: "Server is running on http://localhost:5000"

### Step 3: Start the Frontend

Open a new terminal and run:
cd frontend
npm start


You should see: "Local: http://localhost:3000"

### Step 4: Open the App

Open your web browser and go to: http://localhost:3000


## File Structure

```
├── frontend/              # React app
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── services/      # API calls
│   │   └── App.js         # Main app component
├── backend/               # Node.js server
│   ├── db.js             # Database setup
│   ├── server.js         # API endpoints
│   └── package.json      # Dependencies
└── README.md             # This file
```



### Frontend Files
- **App.js**: Main component that manages all the app's data
- **ContactForm.js**: The form for adding new contacts
- **ContactList.js**: Shows the list of all contacts
- **Pagination.js**: Handles page navigation
- **api.js**: Makes requests to the backend server

### Backend Files
- **server.js**: Creates the server and API endpoints
- **db.js**: Sets up the database and handles data operations
