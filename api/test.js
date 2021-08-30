const fetch = require('node-fetch');

let data = 
`{
    "title": "Philippe",
    "key": "OL10000282W",
    "description": "",
    "author": ""
}`

fetch('https://search-writan-library-6nuqsq6ggx34ejgixfiirs5mc4.us-west-1.es.amazonaws.com/books/_doc/01', {
    method: 'PUT',
    body: data,
    headers: { 'Content-Type': 'application/json' }
}).then(res => res.json())
  .then(json => console.log(json))
  .catch(err => console.log(err))

