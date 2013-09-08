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

## Code Organization

### `/lib`

The `/lib` folder is the root directory for all Node.js modules.

### `/lib/services`

The `lib/services` folder contains service modules for working with various application-level domains.

### `/public`

The `/public` folder contains static resources that are web-only.  This includes styles and scripts that are "browser only".

### `/public/src`

Several of the static resources must be compiled (e.g., `.jade` and `.less` files).  These files reside within `/public/src`, and are then compiled and moved to their appropriate directories using Grunt.

### `/scripts`

The `/scripts` folder contains various install/setup/etc. scripts useful when setting up a local development environment.
