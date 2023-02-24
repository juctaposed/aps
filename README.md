<p align="center">
<img src="https://github.com/juctaposed/aps/blob/main/public/imgs/frame6.svg" alt="logo" align="center" width="225" height="225"/>
</p>
<div align="center">

# Allegheny Property Search

</div>


This is a simple user interface that allows users to search for detailed property information from buildings in Allegheny County. 

**Website:** http://allegheny-property-search.herokuapp.com/
![](https://github.com/juctaposed/aps/blob/main/public/imgs/apsDemoGif.gif)

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

Note: Government buildings such as `1000 Liberty` may be missing building info, or show values as 0. This will be handled as 'N/A' at a later date.

## Lessons Learned

1. This was a tremendous opportunity to learn more about utilizing information from user requests. I was able to create an API wrapper around Dan Wilkerson's acre-api  that allows users to grab information about properties they are inquiring about.

2. If I know what my data and given data types will look like, I'll be leaning towards using an SQL database such as Postgres. Even though MongoDB was helpful to get up and running with a prototype it's starting to prove messier than a relational database for how many connections any given property has.

2. When implementing the different API calls, I stumbled more than I thought I would. The original plan was to loop through the 600k unique property addresses in Allegheny, create records in the database and then respond with values when users look up an address with availability to preload data with d3.js or other visualization tooling. I somehow overlooked that, in addition to the original search, there are bonus calls for ancillary data such as tax info, building info, owner info, etc. These all take information returned from the original call as a parameter (parcel ID). Long story short - 600,000 calls quickly evolved to 3 million calls. To get up and running, the project makes live calls against Allegheny's site (for now). Moving forward I'll definitely be planning out rate limiting and caching more appropriately when dealing with large sets of data and using many API calls. 


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
