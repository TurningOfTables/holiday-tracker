# holiday tracker

## Description

A holiday tracker app created using Svelte, SvelteKit and TailwindCSS. Not production tested and should not be used for any real purpose in its current state.

*Do not use for any sensitive data - this is a work in progress and a learning project*


* Register a new account (passwords are hashed with bcrypt when stored in the db)
* Log in/log out
* View and set your annual holiday allowance total
* Add and delete holidays which are calculated against business days
* And and delete excluded holiday periods which cannot be booked against
* See your remaining holiday allowance
* Prevent various error scenarios such as adding more holiday than your allowance, booking holidays which start before they end, booking holidays which overlap etc.

![Screenshot](readme_screenshot.png)

## Improvements/features/stretch goals

* Increase test coverage now that functionality has stabilised
* Link to download to your calendar? 🤔

## Install and run

* Initialise the db with `npm run dbinit`
* Build with `npm run build`
* Then run with `npm run prod`
* Or dev with `npm run dev`

## Attributions

* [Svelte](https://svelte.dev/)
* [SvelteKit](https://kit.svelte.dev/)
* [TailwindCSS](https://tailwindcss.com/)
* [Heroicons](https://heroicons.com/)
* [date-fns](https://date-fns.org/)