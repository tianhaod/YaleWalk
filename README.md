# YaleWalk

*YaleWalk* (formerly *Backup*) is a companion app to help you walk home safely. Users broadcast their walking plans to their friends, and can send precise alerts to their friends when they are in danger.

## Usage

### Deployment

*YaleWalk* is deployed at <a href="https://yaleswe-backup.firebaseapp.com" target="_blank">https://yaleswe-backup.firebaseapp.com</a>

### Local Build Setup

```bash
# install dependencies
$ npm install

# enable older Node.js security settings
$ export NODE_OPTIONS=--openssl-legacy-provider

# serve with hot reload at localhost:3000
$ npm run dev

# or build for production and launch server
$ npm run build
$ npm run start
```

### Running Tests

```bash
# First, install dependencies and enable older Node.js security settings (see above)
# Run tests
$ npm run test
```

## Tech Stack

*YaleWalk* is a progressive web-app ([PWA](https://web.dev/progressive-web-apps/)). This approach allows us to build a complex app with web technology, and easily develop one codebase for multiple platforms.

There are two major high-level components to our stack: [Nuxt.js](https://nuxtjs.org/) for our front-end and back-end, and [Google Firebase](https://firebase.google.com/) for data persistence, user authentication, and hosting.

Nuxt.js is a meta-framework that combines the back-end framework [Node.js](https://nodejs.org/en/) with the front-end framework [Vue.js](https://vuejs.org/). Nuxt allows us to easily organize our Node.js routing and serving with our Vue.js components in one organized mono-repo. Majorly, this also incorporates server-side rendering, and [Vuex](https://vuex.vuejs.org/) client-side state management.

Firebase is a huge suite of different tools for building apps. Of particular use to us are [Cloud Firestore](https://firebase.google.com/products/firestore), which is a No-SQL database, [Authentication](https://firebase.google.com/products/auth), which is a pre-built user authentication service, and [Hosting](https://firebase.google.com/products/hosting), which hosts our deployed app.

## Repository Organization

There are 5 folders in the root folder that contain the "meat" of our app:
- components
- pages
- layouts
- store
- test

Components, pages, and layouts are `*.vue` files. Each file begins with a `<template>` section, that lays out the actual content of the component/page/layout. Below this, there is a `<script>` section, that runs any code necessary to populate the content and handle interactivity.

The store contains functions and variables used for manipulating local and Firebase data.

Tests are [Jest](https://jestjs.io/) tests that test various parts of the code.

### `components`

The components directory contains Vue.js components. Components make up the different parts of pages and can be reused and imported into pages, layouts and even other components.

We have various components that are used throughout the app:

| Component | What it does | Where it's used |
| --------- | ------------ | --------------- |
| `User/GoogleSignIn.vue` | A Google sign-in button that ties into Firebase's auth service | `user/signin.vue` page |
| `User/UserAvatar.vue` | A button that displays sign-in or profile/log-out options, and the user's name (if they are logged in). Always visible. |  `default.vue` layout |
| `BottomNavigation.vue` | The bottom navigation bar that allows interacting with the walk controls, opening the ~~Squads page~~ (currently defunct), and opening the `notifications.vue` page. Always visible. | `default.vue` layout |
| `GoToNotificationCenterDialog.vue` | This is a modal that appears when the user receives an alert from a friend. It's dismissal redirects the user to the `notifications.vue` page. | |
| `ListPerspective.vue` | This component is a wrapper for a list of items that can be expanded or minimized to a more compact layout. Each item is a `ListPerspectiveItem.vue` component | `notifications.vue` page
| `ListPerspectiveItem.vue` | A list item. Each item is dismissable. | `ListPerspective.vue` component |
| `LocationPicker.vue` | A mapbox location picker | `NewWalkDialog.vue` component |
| `NewWalkDialog.vue` | A modal that appears when the user begins a new walk. It has input fields for setting the starting & ending locations and a walk title & subtitle. |  `WalkHome.vue` component |
| `SearchLocation.vue` | A mapbox-connected search field | `NewWalkDialog.vue` component |
| `WalkHome.vue` | The button that allows for walk starting, ending, and alert sending. | `BottomNavigation.vue` component |

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/components).

### `layouts`

Layouts change the look and feel of the app, and can be used by pages. These layouts describe the general "layout" of the page, which will be populated with the page's specific components.

In our case, we have a `default.vue` layout, and an `error.vue` layout, corresponding to general usage, and displaying errors, respectively.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/layouts).

### `pages`

This directory contains application views and routes. Nuxt will read all the `*.vue` files inside this directory and setup Vue Router automatically.

Each page corresponds to a route. We have three main pages, plus five user-specific pages.

**Main pages:**
| Page | What it does |
| ---- | ------------ |
| `index.vue` | The feed page. It shows the user's friends walks. This is the default page and corresponds to the root route. |
| `notifications.vue` | The notification center. It shows alerts from friends and incoming friend requests. |
| `search.vue` | A search page to search for and add other users as friends. |

**User pages:**
| Page | What it does |
| ---- | ------------ |
| `user/signin.vue` | Sign-in page. |
| `user/signup.vue` | Sign-up page. |
| `user/signout.vue` | Sign-out page. |
| `user/profile/index.vue` | The user's own editable profile page. |
| `user/profile/_slug.vue` | This is a dynamically routed page. Given a matching URL, it will set the `slug`[^1] variable, which we use to search for and load the correct user's profile page. |

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/get-started/routing).

### `store`

This directory contains Vuex store files. Code that reads and manipulates the local state is found here. **Notably, `firebase/actions.js` contain the bulk of the code responsible for interacting with local and database data.**

**`firebase/actions.js` functions:**
| Function | What it does |
| -------- | ------------ |
| `nuxtServerInit()` | Initializes the firebase store. |
| `checkVuexStore()` | Ensures the Firebase Vuex store is functioning correctly. *Used only for testing.* |
| --- | --- |
| `userAuthChange()` | Validates an `authUser` and fetches & sets the `profile` state variable. |
| `userSignIn()` | Given an email and password, attempts to sign the user in. |
| `userLogout()` | Logs out the current user. |
| `userSignUp()` | Given an email, password, and username, attempts to create a new user and log them in. |
| `userCreateNewProfile()` | Given a user and username, create a profile document in Firebase and load it into the `profile` state variable. |
| `userUpdateUsername()` |  Given a user's id and new displayName, updates their displayName in Firebase. |
| `userFetchProfile()` | Given a user's id, loads and sets the `profile` state variable. <br><br> Also starts a listener on the user's profile document in Firebase, that updates the local `profile` variable on any database changes, and calls `showAlert()` if needed. |
| `userSendFriendRequest()` | Given a user and another user, sends a friend request from the first user to the next user in Firebase. |
| `userAcceptFriendRequest()` | Given a user and another user, accepts a friend request from the other user to the first user. |
| `userDenyFriendRequest()` | Given a user and another user, denies a friend request from the other user to the first user. |
| --- | --- |
| `getProfileInfoForFeed()` | Given a user's id, fetches their profile information and returns it. |
| `getFeed()` | Pulls the walks of the user and their friend's from Firebase and populates the `feed` state variable. |
| --- | --- |
| `startWalk()` | Pulls walk details from the `walk` state variable and creates a walk document in Firebase. Updates the local `walk` and `is_walking` state variables to reflect the change. |
| `endWalk()` | Ends the current walk in Firebase and clears the `walk` and `is_walking` state variables. |
| `setWalk()` | Given a walk object, updates the `walk` state variable. |
| `setIsWalking()` | Given a boolean, updates the `isWalking` state variable. |
| --- | --- |
| `sendAlert()` | Appends the user's ID to the alerts array in the profile documents of each of the user's friends in Firebase. |
| `showAlert()` | Adds an alert item to the `alerts` state variable array, opens the `SetGoToNotificationCenter.vue` modal, and removes the alert from the user's profile document in Firebase. |
| --- | --- |
| `searchProfiles()` | Given a search string, searches the Firebase profiles collection for matching users, and returns the matches. |
| `testForSlug()` | Given a slug string, checks whether it already exists in Firebase. |


Also notable are `state.js` and `firebase/state.js` - these files hold the state variables for the application.

**`state.js` variables**
| Variable | Default | What it does |
| -------- | ------- | ------------ |
| `newWalkDialog` | `false` | Controls whether the `NewWalkDialog.vue` component is open. |
| `goToNotificationCenter` | `false` | Controls whether the `GoToNotificationCenterDialog.vue` component is open. |

**`firebase/state.js` variables**
| Variable | Default | What it does |
| -------- | ------- | ------------ |
| `authUser` | `null` | Holds the authentication information for the current user. |
| `profile` | `null` | Holds the profile document that corresponds to the current user. Pulled from Firebase. |
| `walk` | `null` | Holds the walk document for an ongoing walk. Pulled from Firebase. |
| `isWalking` | `false` | Corresponds to if the user is walking or not. |
| `feed` | `null` | Holds items for the feed. Items are pulled from Firebase, but are manipulated before being stored in this variable. |
| `sendingConnect` | `false` | Corresponds to if the user is sending another user a friend request.
| `alerts` | `[]` | Holds alert items, each corresponding to the data needed for a single `ListPerspectiveItem.vue` item. Alerts are pulled from Firebase before being manipulated to match the necessary item fields. |
| `friends` | `[]` | Holds friends items, each corresponding to the data needed for a single `ListPerspectiveItem.vue` item. friends are pulled from Firebase before being manipulated to match the necessary item fields. |
| `friend` | `Object` | friend item


More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/store).

### `test`

We are severely lacking in tests.

**Firebase tests**

- `firebase.actions.spec.js` "tests" friend request logic by mocking *both* Firebase and the functions LOL.
- `firebase.mutation.spec.js` tests the `SET_PROFILE` mutation from `store/firebase/mutations`.

**Vue tests**

- `UserAvatar.spec.js` tests that the `UserAvatar` Vue component mounts.
- `WalkHome.test.js` tests that the `WalkHome` Vue component mounts.
- `ConnectBT.specp.js` tests that if the connect button mounts and fires the function
**Node tests**

- N/A

<!-- GitHub Footnotes -->
[^1]: A slug is a searchable string that is mostly human readable, but is still unique to a user.
