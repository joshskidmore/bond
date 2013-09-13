# Bond

Bond is a modern approach to messaging.


## Bond _Gold Edition_/node-webkit Dev Install
1. Confirm node and npm are installed.
2. `$ git clone git@github.com:joshskidmore/bond.git`
3. `$ cd bond`
4. `$ npm install   # Install npm modules`
5. `$ npm run-script build  # Build`
6. `$ npm run-script install-nw-osx   # Install node-webkit (for OS X; one time only)`
7. `$ npm start  # Run Bond through node-webkit`

## Code Organization

### `src/lib`

The `src/lib` folder is the root directory for all Node.js modules.


### `src/lib/services`

The `src/lib/services` folder contains service modules for working with various application-level domains.

### `src/lib/providers`

The `src/lib/providers` folder contains messenger clients.

### `app`

The `app` folder contains static resources that are web-only.  This includes styles and scripts that are "browser only".


### `scripts`

The `scripts` folder contains various install/setup/etc. scripts useful when setting up a local development environment.
