# 🦍 Kong Services API 

A CRUD API that handles the `Service` and `Version` entities.


[**Tech Stack**](#tech-stack) | [**Run Locally**](#run-locally) | [**Authentication**](#authentication) | [**Test Plan**](#test-plan) | [**Data Modeling**](#data-modeling) | [**Querying**](#querying) | [**Return Payloads**](#return-payloads) | [**Next Steps!**](#next-steps) 

## Tech Stack:
- Postgres v12
- Node.js v14.17.0
- Nest.js v6.10.14
- TypeORM v0.2.45
- TypeScript 
- Docker

## Run Locally

A postman package can be found [here](https://www.getpostman.com/collections/5da64b771d9a3ea9a3da). (Sorry, I didn't have an Insomnia package ready). Simply copy that link and import it in Postman and don't forget to add a new environment with an `access_token` key! This will hold the dynamic `access_token` variable which will populate the Bearer Token value for each subsequent request. There you will have access to all the CRUD endpoints for the `Service` and `Version` entities, as well as the login mechanism. I have added a simple Authentication mechanism to the application, so you will need to first login before being able to access any of the endpoints. Since there is no seeded data, feel free to play around with the `POST` requests before querying with any of the `GET`requests. (Or start off with a `GET` request to view its initial state).

```bash

# Postman setup
Import with link: 
https://www.getpostman.com/collections/5da64b771d9a3ea9a3da

Add a new environment to your Postman client:
  - Should be located in the top right corner of the client
  - Name it `Kong Services API`
  - Add `access_token` variable (Keep the value empty)

# installation 
$ npm install

# build and run development
$ npm run local:upbuild

# re-run development
$ npm run local:up

# rebuild development and run
$ npm run local:rebuild

# unit tests
$ npm run test

```

## Authentication

I added a simple authentication mechanism to the app, using `passport`. For the sake of simplicity when testing out the APIs, I just stored one user in an array in the `users.service.ts` file. This could be easily pulled into the database as a `User` entity.

*Note: I decided not to add .env to the .gitignore file, as an easier way to share the secrets. In a real life scenario, I would share the .env values in a safe manner (EX. using a one time link) or even going further than that, I could use AWS secrets manager to store these values. For the user password, I would use bcrypt to hash the password (or an encryption key) as the password shouldn't be stored as a plain text value ANYWHERE!*


## Test Plan

While I did add some unit tests, there is still a lot more that can be done. Here are some next steps for a proper test suite:
1. **Add unit tests with typeorm's Repository and Connection classes mocked.** These tests should mock all external libraries/parties/providers and test the input/ouput of a function, as well as what calls were made and with what arguments.
2. **Add integration tests for all provider functions (`*.service.ts` files).** These tests should emulate the database as closely as possible. An example of a test would be inserting a record into a table and querying to ensure the function returns what is expected.
3. **Use GitHub Actions to run these tests automatically.** This action can be configured to trigger based on preference - EX. triggered either on every pull request, or every merge to the `main` branch.
4. **Provision a test environment.** Ideally, there would be an environment that is tested against before deploying to production. This environment can be deployed to based on preference — EX. upon merging to `main` or for every pull request creation.

## Design Considerations

## Data Modeling

| Version     | | Service            
|------------ |-|-----------          
| id          | | id  
| name        | | name  
| description | | description
| serviceId   | | createdAt 
| number      | | updateddAt  
| createdAt   | | deletedAt   
| updateddAt  | |
| deletedAt   | |

<!-- 
```
SERVICE
-------------------------------------------------------------
 id | name | description | createdAt | updatedAt | deletedAt 
-------------------------------------------------------------
VERSION
-------------------------------------------------------------------------
 id | name | description | serviceId | createdAt | updatedAt | deletedAt 
-------------------------------------------------------------------------
```
-->

### Timestamps 
Both entities have timestamp columns as a useful way to verify:
1. Record creation
2. Record updates
3. Record deletion

Since the `updatedAt` field is also populated at creation time, if the `updatedAt` value 
is the same as the `createdAt` value on a record, it's safe to assume the record has never 
been updated.

Soft deletion was implemented as a way to retain all records while still leveraging 
the delete functionality. Typeorm filters out all records with a populated `deletedAt` 
field, but you can simply append `withDeleted()` should you ever need to query against 
deleted records.

###  Name VS Number columns

On the `Version` entity, there are three columns to take note of:

1. name
2. description
3. number

The `name` and `number` columns in theory may seem similar, but they hold separate 
responsibilities. The `name` property can be set as any stringed value — *EX. "Version One", "V1", "First Version"* — while the `number` property is strictly set to a decimal value. This decision was made for two main reasons:

1. **Localization:** allowing a more flexible value for the `name` property enables localization for languages more easily, while numbers are more universally concrete. Ex. the French `name` value would be "Première Version" while the `number` value could still remain `1.0`.

2. **Consistency:** By keeping the `name` property more flexible, there is less need 
for implementing logic that validates and transforms value input by the user. A float number being passed is easier to validate and less prone to human error.


#### Trade-off:
This doesn't handle a version number like `1.0` very well, since it returns it as just `1`. In these cases, there are two options: 
1. Add a transform function that returns the number as a stringed value => 1 to "1.0", or 1.1 to "1.1".
2. The client can append the `.0` should the number returned be a `1`.

I would prefer the first option, as I follow the belief that the client should not have to manipulate data.


*Assumption made: the version number will just be set to one decimal. Should there be need for two decimal points (IE. 1.0.0), then the column type would be a string value. Regardless, the X.X.X convention is still easier to validate and transform!*

### Associations

A foreign key (`serviceId`) was used on the `Version` entity in order to associate a `version` with its associated `Service` entity and a unique index was set on the `Version` entity between the `serviceId` and `number` columns.

Every `service` is required to have at least one `version`. Therefore upon service creation, `version` field values are also an input requirement for the `POST /services` endpoint. 

When deleting a `version`, a check is performed to ensure there is more than one version for its associated `service`. If there is only a count of 1, an error is thrown.

When deleting a `service`, all associated `versions` are deleted.


## Querying

There is one `GET /services` endpoint but two ways to utilize it:

1. `GET /services` fetches all services and their associated versions
2. `GET /services?query=one,three&limit=2&offset=1&sort=createdAt,ASC` fetches all services 
that are valid, as per the query parameters.

By default, zero keywords are passed in, the limit is 12, the offset is 1 and the records 
are sorted by the `createdAt` field in `DESC` order.

The query parameters broken down:
1. **query:** A string of values seperated by commas to fetch *all* records containing 
*any* of the values. An ILIKE sql function was used, which means if we query with `ne`, 
it will return a `service` with a name `Version One` as well as another service with 
a description `Never used before.`

2. **limit:** A number value that adds a limit on how many records are returned. This
can be considered the page size in the client view.

3. **offset:** A number value that sets the offset of where the query should start 
when returning records. This can be considered the page number in the client view.

4. **sort:** A string of two values separatd by a comma that dictate the order in which
the records should be returned. The first value will be the field from which the order 
will be fetched and the second value will dictate what order (descending or ascending).
This ordering is only done on the `Service` entity. The associated `versions` will be
returned in ascending order of `id` / `createdAt`.

## Return Payloads

```javascript
GET /services
===============

{
  services: [
    {
      id: number,
      name: string,
      description: string,
      versions: [ 
        {
          name: string,
          description: string,
          number: string,
        }
      ],
      versionCount: number,
    }
  ],
  serviceCount: number,
  offset: number,
  limit: number
}
```
`GET /services` returns an array of `services`, which includes its id, name and descriptions, plus any associated (non-deleted) `version` reccords. I decided to include the version records themselves alongside the count, as there is a small difference in the query itself (a select and count VS a find and count), and this way the client has more information to expand upon, should there be a need for the version details at a later date. A `serviceCount` is also included - that way, if the client queries with a limit of 5 records out of 10, if the client is on page 1, it knows that:

1. It's on page 1 (`offset: 1`)
2. It's displaying services the first 5 services (`with a { limit: 5 } => (limit - offset) + 1`)
4. It's displaying the current services out of the total services remaining on the next pages (`serviceCount: 10`)

While this calculation could have been set in the backend and simply returned something along the lines of `{ currentFirstId, currentLastId, lastId }`, this payload allows the frontend more flexibility, should it be changed later on to display page numbers instead of a count of services.

```javascript
GET /service/:id 
=================

{
  id: number,
  name: string,
  description: string,
  versions: [ 
    {
      name: string,
      description: string,
      number: number,
    }
  ],
}

```
The `GET /service/:id` endpoint returns the `service` specified by `id` and any of its associated 
(non-deleted) `versions.`


## Next Steps!

- Use GitHub actions to automatically run tests and deploy to a staging/prod environment
- Add a cache layer for storing any calls that are made often. (Not totally necessary here, but something good to make note of)  
- Properly mock typeorm's `Repository.createQueryBuilder()` function (Could not write all unit tests yet due to this)
- Properly mock typeorm's `Connection` class (Could not write service.service.spec.ts unit tests yet due to this)

