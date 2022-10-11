<p align="center">
<img src="https://github.com/juctaposed/aps/blob/main/public/imgs/navlogo/default.png" alt="logo" align="center" width="225" height="225"/>
</p>

<div align="center">

# Allegheny Property Search

</div>


This is a simple user interface that allows users to search for detailed property information from buildings in Allegheny County. 

**Website:** http://allegheny-property-search.herokuapp.com/
![](https://github.com/juctaposed/aps/blob/main/APSv1Giphy.gif)

## Optimizations

I pushed for an MVP that provides basic functionality of displaying useful property information. When I continue to build upon this project, some improvements and functionalities I plan on adding include:

- A dashboard for property analytics - retroactive visuals for sales and previous owners, tax information branched out into local/county/school (both retroactive and forecasts/escrow amounts)

- More interactive data on property search page - image of property, latitude/longitude, lien records, etc.

- Further UI/UX - it's very bare bone currently as the main focus up to this point was on functionality. In particular, I'll be working on themes for better contrast and setting better content decisions for mobile users. 

- Currently when completing the form to search for a property, substrings such as "Street", "Road", or any synonyms thereof must be left off. E.g.

`1000 Liberty Avenue`
would be 
`1000 Liberty`

This could be altered in the future in order to ease user experience.

## Lessons Learned

This was a tremendous opportunity to learn more about utilizing information from user requests. I was able to create an API wrapper around Dan Wilkerson's acre-api search that grabs information from the request body to make an API call to Allegheny County's website.

It was interesting working with different nested objects and properties, then figuring out how to display them to the user through EJS and HTML. 

When planning out how I wanted to eventually manipulate data for visuals, I stumbled quite a bit with how I wanted to approach adding the required information to the database. In all, there's approximately 600,000 unique parcel IDs I would need to loop through. Instead of creating a schema for the parcels and then looping through the collection, I could have instead wrote a function to directly loop through an API call for each parcel - essentially saving the time of looping through 600k additional iterations. 

## Install

`npm install`

---

## Things to add

- Create a `.env` file in config folder and add the following as `key = value`
  - PORT = 2121 (can be any port example: 3000)
  - DB_STRING = `your database URI`
  - GOOGLE_CLIENT_ID = `your google client ID`
  - GOOGLE_CLIENT_SECRET = `your google client secret`
---

## Run

`npm start`
