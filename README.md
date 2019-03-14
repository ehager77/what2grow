# what2grow

[Deployed Link](https://ehager77.github.io/what2grow/)

Collaborators |
:---------:
* Eric Hager
* Denis Galo
* Halina Zmachynskaya
* Max Weidmer

## Description
### This is a web application designed to help amateur gardeners make informed decisions about the plants they choose to grow. Going to the site will land the user on a splash page, with a button to take them to the main user interface. The user then has the option to type in a crop or plant of their choice. If the database for the page has useful data about the plant chosen, the plant name will come up in the autocomplete options. If a user tries to enter the name of the plant not included in the database, no changes will be made to the page except to clear out the user's input and notify them that their choice was invalid. Underneath the search bar there is a button labeled get location, which will retrieve the user's coordinates, which will be used to get weather data about the user's location.  If the user doesn't press the get location button, the location defaults to San Francisco.

### When the user presses the search button, historical weather data for the next four months is retrieved based on the user's location. The weather data is then averaged and compared against the minimum and maximum temperatures necessary for the plant chosen to survive. If the temperature for all of the next four months fall outside the range, the user will be informed that the plant is not suitable for their location, at least for the next third of a year. Otherwise, the user will be informed of the expected minimum, maximum, and average temperatures of the first month where the minimum temperature were above the required minimum temperature of the plant, as well the the the temperature information for the first month where the minimum temperature falls above an optimal temperature of 70F (18C).  The user will also be shown some useful information such as possible planting methods, maximum and minimum soil ph levels, and the average days to harvest for that particular crop. Links to external sites with general information about the information fields are also supplied.

## Screenshots/GIFS

Splash Page |
:------------------:
![Splash Page](https://github.com/ehager77/what2grow/blob/master/images/splash.JPG) |

Main user interface |
:------------------:
![Main user interface](https://github.com/ehager77/what2grow/blob/master/images/main.JPG) |

Search autocomplete |
:------------------:
![Search autocomplete](https://github.com/ehager77/what2grow/blob/master/images/auto.gif) |

## Important Code Details

Variable declaration |
:------------------:
![Variable declaration](https://github.com/ehager77/what2grow/blob/master/images/variables.JPG) |

aWhere Weather API AJAX Authorization |
:------------------:
![aWhere Weather API AJAX Authorization](https://github.com/ehager77/what2grow/blob/master/images/ajax.JPG) |

Geolocation functions |
:------------------:
![Geolocation functions](https://github.com/ehager77/what2grow/blob/master/images/location.JPG) |

aWhere data response manipulation |
:------------------:
![aWhere data response manipulation](https://github.com/ehager77/what2grow/blob/master/images/data-manipulation.JPG) |

Firebase Database Population |
:------------------:
![Firebase Database Population](https://github.com/ehager77/what2grow/blob/master/images/firebase.JPG) |

Responsive bootstrap layout sample |
:------------------:
![Responsive bootstrap layout sample](https://github.com/ehager77/what2grow/blob/master/images/bootstrap.JPG) |

Possible future features |
:---------:
* A sign-in feature for storing specific information about a users personal garden
* A map displaying other users nearby with garden information
* More specific plant information
* More plants and plant data

Technologies Used |
:---------:
* HTML
* Javascript
* CSS
* JQuery
* JQueryUI
* Bootstrap
* aWhere Weather API
* Trefle Plants API (Attempted, will be used in future when data set is more complete)
* Moment.js
* Firebase
* HTML5 Geolocation