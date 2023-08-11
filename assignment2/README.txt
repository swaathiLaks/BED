Swaathi Lakshmanan
P2227171
DISM/FT/2B/21
1. Please unzip the project. 
2. Open mySQL workbench and press on ‘server’ and then press ‘Data import’. 
   Press on import from self-contained file. After which choose data.sql from the dialog box. 
   Press the new button beside the default target schema box. 
   For the name enter ‘sp_games_assignment_1’ Press start import.
3. After opening the project in visual studio code, open two new terminals (terminal A and terminal B). 
4. In terminal A, run the following commands:
    cd client
    npm -i
    nodemon index.js
5. In terminal B, run the following commands:
    cd backend
    npm -i
    nodemon server.js
6. Change the sql user and password to your desired user information in databaseConfig.js.
7. Now you can open a web browser and enter ‘http://localhost:8082’ in the search bar.
