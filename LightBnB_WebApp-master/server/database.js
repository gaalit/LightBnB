const properties = require('./json/properties.json');
const users = require('./json/users.json');

const { Pool } = require('pg');

const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});

pool.connect()

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */


// getUserWithEmail
// Accepts an email address and will return a promise.
// The promise should resolve with the user that has that email address, or null if that user does not exist.

const getUserWithEmail = function(email) {
  const queryString = `SELECT *
  FROM users
  WHERE email = $1;`;

  //  const queryString = `SELECT * FROM users;`;
  
  return pool.query(queryString, [email]).then(res => {
    
    if(res.rows[0]) {
      return res.rows[0];
    } else {
      return null;
    }
  })
  .catch (err => {
    console.log('query error:', err)
  });
}

exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  const queryString = `
  SELECT *
  FROM users
  WHERE id = $1`

  return pool.query(queryString, [id]).then(res => {
    if(res.rows) {
      return res.rows[0];
    } else {
      return null;
    }}
    ).catch(err => {console.log('query error:', err)})
}
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser =  function(user) {
  const queryString = `
  INSERT INTO users(name, email, password)
  VALUES ($1, $2, $3)
  RETURNING *;
  `;

  const values = [user.name, user.email, user.password];

  return pool.query(queryString, values)
    .then(res => {
      return res.rows[0];
    })
      .catch(err => {
        return console.log('query error:', err)
      })
};
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {

 const queryString = `
 SELECT reservations.*, properties.*, AVG(property_reviews.rating) AS average_rating
 FROM reservations
 JOIN properties ON properties.id = reservations.property_id
 JOIN property_reviews ON property_reviews.property_id = properties.id
 WHERE reservations.guest_id = $1
 AND reservations.end_date < Now()
 GROUP BY properties.id, reservations.id
 ORDER BY reservations.start_date
 LIMIT $2;
`;
  return pool.query(queryString, [guest_id, limit])
    .then(res => {
      return res.rows;
    }).catch (err => {
      console.log('query error:', err)
    });
}
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */


//1.limiting the number of results to whatever is passed into the function.
  //2. using parameterized query to insure data being passed in is safe where $1 = limit in the function
   // 3. must add it in the pool.query as an array (same as adding [values array])
   const getAllProperties = function(options, limit = 10) {
     console.log(options.owner_id)
    let queryString = `
    SELECT properties.*, avg(property_reviews.rating) as average_rating
    FROM properties
    JOIN property_reviews ON properties.id = property_reviews.property_id
    `;
    const queryParams = [];

    //must adjust for different fields entered!
    if (options.city) {
      queryParams.push(`%${options.city}%`);
      queryString += `WHERE city LIKE $${queryParams.length} `;
    }

    if(options.owner_id) {
      queryParams.push(`%{options.owner_id}%`);

      if(queryParams.length === 1) {
        queryString += `WHERE owner_id = $${queryParams.length} `
      } else {
        queryString += `AND owner_id = $${queryParams.length} `;
      }
    }

    if(options.minimum_price_per_night || options.maximum_price_per_night) {
      queryParams.push(`%{options.minimum_price_per_night}%`, `%{options.maximum_price_per_night}%` );

      if(queryParams.length === 2) {
        queryString += `WHERE cost_per_night >= $${queryParams.length - 1} AND cost_per_night <= $${queryParams.length}`
      } else {
        queryString += `AND cost_per_night >= $${queryParams.length - 1} AND cost_per_night <= $${queryParams.length}`;
      }
    }
    queryString += `
    GROUP BY properties.id
  `;


    if(options.minimum_rating) {
      queryParams.push(`%{options.minimum_rating}%`);
        queryString += `HAVING avg(property_reviews.rating) >= $${queryParams.length}`
      }
    

    queryParams.push(limit);
    queryString += `
    ORDER BY cost_per_night
    LIMIT $${queryParams.length};
  `;
    
 // 5
 console.log(queryString, queryParams);

 // 6
 return query(queryString, queryParams)
  .then(res => res.rows);
};

//getAllProperties();
exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const queryString = `
  INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
  RETURNING *;
  `;
  const values = [property.owner_id, property.title, property.description, property.thumbnail_photo_url, property.cover_photo_url, property.cost_per_night, property.parking_spaces, property.number_of_bathrooms, property.number_of_bedrooms, property.country, property.street, property.city, property.province, property.post_code];
  
  return query(queryString, values)
    .then(res => {
      return res.rows[0];
    })
    .catch(err => {
      return console.log('query error:', err);
    })
}
exports.addProperty = addProperty;
