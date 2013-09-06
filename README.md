# Bond

Bond is a modern approach to messaging.


## Bond _Gold Edition_/node-webkit Dev Install
1. Confirm node and npm are installed.
2. `$ git clone git@github.com:joshskidmore/bond.git`
3. `$ cd spa-test`
4. `$ npm install   # Install npm modules`
5. `$ npm run-script install-nw   # Install node-webkit`
6. `$ npm run-script grunt  # Compile jade + less`
7. `$ npm run-script repair   # (Optionally) repair node-expat for use with node-webkit`
8. Add a gTalk account to `config/accounts/example.json.` (Be sure to change "connectOnStartup" boolean true!)
9. `$ npm start  # Run Bond through node-webkit`
