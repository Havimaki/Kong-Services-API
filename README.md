# 🦍 Kong Services API 

A CRUD API that handles the `Service` and `Version` entities.

[**Run Locally**](#run-locally) | [**Tech Stack**](#tech-stack) | [**Data Modeling**](#data-modeling) | [**Querying**](#querying) | [**Return Payloads**](#return-payloads) | [**Backlog**](#backlog) 

## Run Locally

A postman package can be found [here](https://www.getpostman.com/collections/5da64b771d9a3ea9a3da). Simply copy that link and import it in Postman (Sorry, 
I didn't have an Insomnia package ready). There you will have access to all the CRUD endpoints for the `Service` and `Version` entities. Since there is no seeded data, feel free to play around with the `POST` requests beforequerying with any of the `GET`requests. (Or start off with a `GET` request to view it's initial state).

```bash

# installation 
$ npm install

# run development
$ npm run local:upbuild

# rebuild development and run
$ npm run local:rebuild

# unit tests
$ npm run test

```

## Design Considerations

### <span style="color:#4B7BF5"> Tech Stack:</span>
- Postgres v12
- Node.js v14.17.0
- Nest.js v6.10.14
- TypeORM v0.2.45
- TypeScript 
- Docker

### <span style="color:#4B7BF5"> Data Modeling</span>
<style>
  .entity th {
      background-color: black;
      text-align: center;
  }
  .entity th:nth-child(2),
  .entity td:nth-child(2)
  {
    background: black;
  }

</style>
<div class="entity">

| Version     | | Service            
|------------ |-|-----------          
| id          | | id  
| name        | | name  
| description | | description
| serviceId   | | createdAt 
| createdAt   | | updateddAt  
| updateddAt  | | deletedAt   
| deletedAt   | |

</div>
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

### <span style="color:#4B7BF5"> Timestamps </span>
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

### <span style="color:#4B7BF5"> Name VS Number columns</span>

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

### <span style="color:#4B7BF5">Associations</span>

A foreign key (`serviceId`) was also used on the `Version` entity in order to associate 
a `version` with its associated `Service` entity and a unique index was set on the
`Version` entity between the `serviceId` and `number` columns.

Every `service` is required to have at least one `version`. Therefore upon service creation, `version` field values are also an input requirement for the `POST /services` endpoint. 

When deleting a `version`, a check is performed to ensure there is more than one version for its associated `service`. If there is only a count of 1, an error is thrown.

When deleting a `service`, all associated `versions` are deleted.


### <span style="color:#4B7BF5">Querying</span>

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

### <span style="color:#4B7BF5">Return Payloads</span>

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
          id: number,
          serviceId: number,
          name: string,
          desscription: string,
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
`GET /services` returns an array of `services`, which includes its id, name and descriptions, 
plus any associated (non-deleted) `version` reccords. I decided to include the version records 
themselves alongside the count, as there is a small difference in the query itself 
(a select and count VS a find and count), and this way the client has more information to 
expand upon, should there be a need for the version details at a later date. A `serviceCount` 
is also included - that way, if the client queries with a limit of 5 records out of 10, if the
client is on page 1, it knows that:

1. It's on page 1 (`offset: 1`)
2. It's displaying services the first 5 services (`with a { limit: 5 } => (limit - offset) + 1`)
4. It's displaying the current services out of the total services remaining on the next pages (`serviceCount: 10`)

While this calculation could have been set in the backend and simply returned something along the lines of
 `{ currentFirstId, currentLastId, lastId }`, this payload allows the frontend more flexibility,
 should it be changed later on to display page numbers instead of a count of services.

```javascript
GET /service/:id 
=================

{
  id: number,
  name: string,
  description: string,
  versions: [ 
    {
      id: number,
      serviceId: number,
      name: string,
      desscription: string,
    }
  ],
}

```
The `GET /service/:id` endpoint returns the `service` specified by `id` and any of its associated 
(non-deleted) `versions.`


## Backlog
- Add authentication
- Add a cache layer
- Properly mock typeorm's `Repository.createQueryBuilder()` function
- Properly mock typeorm's `Connection` class

