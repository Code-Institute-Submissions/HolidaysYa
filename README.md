# Eurotrip dashboard – Second milestone project

This is a website that will be used for people who are not sure where to go on holidays but they have a limited budget or they are looking for a specific weather.

In the intro screen they will select the month when they are planning to travel and then they can decide if they want to search based on budget or based on weather.

Once they select budget or weather they will be able to type their maximun budget or the temperatures that they are looking for. Based on the values entered the data will be filtered and a dashboard with some number displays, charts and a summary table will be displayed with the information from the cities that match the user selection.

The dashboard should help the users to decide which city is the best option for the holiday.
They will be able to find out more information about the cities that they are interested in by following the links to wikipedia or by sending an email asking for more information.

See below the link to the website:

https://elenasacristan.github.io/HolidaysYa/

## UX

This website is targeting people who want to travel in Europe but are concerned about the cost of travelling and/or the weather.

### mockups:

Below you can see the mockups that I drew using Pencil:

##### Intro page - month selection
![intro](/mockups/Month.png)


##### Budget page - maximum budget selection
![Budget Selection](/mockups/Budget.png)


##### Weather page - temperature range selection
![Temperature Selection](/mockups/Weather.png)


##### Dashboard layout - same for weather or budget
![Dashboard](/mockups/DasboardSelection.png)

* Note that the final design charts position differs from the initial design because when rendering the charts in the website I noticed some charts didn't look right with the origial design and I decided to change the layout of the dashboard.


### User stories:

- As a user with limited budget I want to know what cities I can afford to visit.
- As a user who is concerned about the temperature when travelling I want to know what cities in Europe have the temperature that I'm expecting for my holidays.
- As a user who is concerned about the chances of rain I want to know what is the chance of rain in the month that I want to travel.
- As a user who wants to know how popular is a specific city I want to know what is the number of visitors per year.
- As a user who is planning to travel I want to know what is the currency in case I need to exchange money in advance.
- As a user who is planning a trip around many cities in Europe I want to be able to calculate how much money I'll need for the whole trip.
- As a user who has decided what city to visit but is not sure when is the best time to go, I want check how is the temperature and precipitation for each month to find out when is the best time in the year to go.
- As a user, after analysing the dashboard charts, I want to find out more about a specific city.
- As a user, after analysing the dashboard charts, I have some doubs and I want to contact the website to clarify some information.
- As a user I want to follow "Eurotrip dashboard" on social media to know about new city additions or data updates.

## Features

### In all pages

- **Favicon:** Appears in the page tab and has been created using the following favicon generator "https://favicon.io/favicon-generator/".

- **Navigation bar:** The navigation bar was part of the template [Ample Bootstrap Admin Lite](https://wrappixel.com/demos/admin-templates/ampleadmin/ample-admin-lite/dashboard.html) that I used as base to start building the dashboard.
From the original template I kept the logo style but I removed all the options and added the hamburguer button from Bootstrap and the social media links. The navigation bar is always displayed and is fixed to the top so it will never hide.

- **Logo:** The logo will appear in the navigation bar for every section of the website and when clicked it will redirect the user to the intro page (month selection page).

- **FontAwesome:** The FontAwesome icons are used to add extra meaning in several areas (i.e. social media buttons, icons in the side-bar and icons for the number displays in the dashboard section).

- **Social media links:** They appear on the right side of the navigation bar for screens wider than 767px and allows the user to follow the "Eurotrip Dashboard" on social media so they can be up to date with new additions to the website or if there are data changes.  For screens smaller than 768px the social media links will be accesible from the hamburguer button on the dashboard section.

### Month selection screen

- **Drop down select menu:** Appears when the page is loaded and allows the users to select in which month they want to travel.

### Budget selection screen

- **Input box** Allows the users to enter the daily budget that they want to spend per day in order to find cities that they can afford to travel to.

### Weather selection screen

- **Input boxes:** They allow the users to enter the minimum, maximum or both temperatures in order to find cities that have that weather.

- **Error page:** This error page will display an error message when the following happens: 
  * The input box for the budget section or both input boxes for weather section are left empty.
  * The budget entered is too low and they are not cities found.
  * The minimum temperature is higher that the maximum temperature.
  * There are not cities matching the entered temperatures.

### Elements common to both dashboards

- **Hamburguer button:** this feature is taken from bootstrap and it appers when the screen is smaller than 768px. It will only appear in the dashboard page and it will have the following options:
    * **Change Month:** to go back to the main screen and choose another month.
    * **Change Budget / Change Temperatures:** To update the original filter value
    * **Contact Us:** To ask for more information about a city or anything regarding to the website.
    * **Follow Us!:** to follow "Eurotrip Dashboard" on social media.
      * Facebook
      * Twitter
      * Linkedin

- **Side bar:** The sidebar was part of the template [Ample Bootstrap Admin Lite:](https://wrappixel.com/demos/admin-templates/ampleadmin/ample-admin-lite/dashboard.html) that I used as base to start building the dashboard.
  The original sidebar came with many options but I only kept the dropdown option where I added the input boxes to update the filter (budget or temperature).
  The sidebar will only appear in screens wider than 767px.

- **Sidebar - Link to initial page:** By clicking the calendar icon the user gets redirected to the initial page where the month can be updated.

- **Sidebar - Update Budget / Temperature:** By clicking the filter icon one input box in the budget dashboard or two input boxes in the weather dashboard will be displayed and the user can update the filter value and see how the dashboard charts get updated.

- **Sidebar - Contact Us:** By cliking the envelope icon the user can send me an email to ask for additional information.
 
- **Modal:** Is taken from bootstrap and it will be displayed if any of the "Contact Us!" options are clicked.

- **Form:** Is taken from bootstrap and then it has been updated to only display the name, email and information fields. The form is placed inside the Modal element.

- **Reset button:** If the users have filtered the charts by clicking on them then they can reset them to the default values by clicking the "Reset" button.

- **Drop-down select menus:** They let the user filter the dashboard charts, by region, country and/or city. They can select multiple options by keeping the "ctrl" key pressed.

- **Collapseble chart:** All charts can be collapsed in case the user is not interested in some of them. This feauture wasn't implemented by me, it was part of the template that I used to create the dashboard but I decided to keep it because I found it useful.

### Elements Budget dasboard
The dashboard for the budget will display the following elements:

- **Number displays:** The number displays appear at the top of the charts. 
  * **Cities:** Number display that shows the count of cities that match the criteria
  * **Hostel:** Number display that shows the avarage price for a cheap hostel in a bunk bed, with good location and good reviews for the cities filtered.
  * **Meal:** Number display that shows the avarage price for three "budget meals" for the cities filtered.
  * **Drinks:** Number display that shows the average price for 3 local beers for the cities filtered.
  * **Attractions:** Number display that shows the average price for visiting one famous attraction for the cities filtered.
  * **Transport:** Number display that shows the average price for 2 rides in public transport.


- **Row Chart - Budget needed per day (€):** Displays the total budget needed per city in descending order. Hovering over the row for each city you can see how much exactly. By clicking on one of the bars the rest of the data in the dashboard will be filtered.

- **Stacked bar chart - Budget distribution (€):** Displays the total budget and how is it distributed among hostel, meals, drinks, attranctions and transport. Each category has a diferent color that match with the categories in the number displays. Also on hover over the bars it will tell the user how much (in euros) is the cost for each category. By clicking on one of the bars the rest of the data in the dashboard will be filtered.

- **Pie chart - Currency:** Displays the proportion for each currency for the cities selected. By clicking on the preferred currency the user can filter the rest of the charts.

- **Scatter plot chart - Correlation between cost of visiting and number of visitor per year:** This chart displays the correlation or lack of correlation between the cost of visiting a city (total daily budget) and the number of visitors per year that visit that city. On hover over the dots it will tell the user how much (in euros) is the total budget needed per day for that city and the number of visitors per year.

- **Summary table:** - This table shows the total budget needed per day, the costs for all the categories (hostel, meals, drinks, attractions and transport), the currency, the number of visitors per year and a link to wikipedia to find out more information about the cities. The table is sorted in ascending order starting from the cheapest city.

### Elements Weather dasboard:
The dashboard for the weather will display the following elements:

- **Number displays:** The number displays appear at the top of the charts. 
  * **Max. Temp:** Display the maximun temperature amongst all the maximum temperatures for the cities filtered.
  * **Min. Temp:** Display the minimun temperature amongst all the minimum temperatures for the cities filtered.
  * **Avg. Temp:** Display the avarage temperature amongst all the cities filtered.
  * **Max. Precipitation:** Display the maximun precipiation amongst all the   cities filtered.
  * **Min. Precipitation:** Display the minimum precipiation amongst all the cities filtered.

**Row Chart - Precipitation per month (mm):** Displays the average precipitation for that month for the cities filtered in descending order. Hovering over the row for each city you can see the exact mm. By cliking on one of the bars the rest of the data in the dashboard will be filtered.

- **Composite line chart - Maximum and Minimum temperatures (°C):** Displays two line charts. One line chart represents the maximun temperatures for each city and the other line chart represents the minimun temperatures for each city. Hovering over the line chart points the user can see the exact temperature for each city.

- **Pie chart - Chances of precipitation:** This pie chart can be used to filter the charts based on the chances of precipitation.

- **Composite Scatter plot chart - Correlation between Avg. temperature/Precipitation and number of visitor per year:** This chart displays the correlation between the average temperature per city and number of visitors (using the left axis) and the correlation between the average precipitation and the number of visitors (using the right axis). Hovering over each dot you can see for each city the temperature and number of visitors or the precipitation and number of visitors.

- **Summary table:** - This table shows the minimum, maximum and average temperatures for the month selected, the average preciptation for that month, the number of visitors per year and a link to wikipedia to find out more information about the cities. The higher average temperatures will be displayed at the top of the table.

## Features Left to Implement

- **Map:** My initial thought was to allow the user to select the favourite city from all the options and show a map (using the google maps API) with markers for the main attractions. However I was advised by my mentor to choose between the Google API map or the dashboard because doing both of them will be too much. This is a feature that I would like to implement in future.

## Technologies Used

#### Email API:

-**[emailjs](http://www.emailjs.com/):** When the Form inside the Modal is submited the API "mailjs" will send the email to my personal gmail account. NOT WORKING AT THE MOMENT!!!!!

#### Mockup tool:

- **[Pencil:](https://pencil.evolus.vn/ 'https://pencil.evolus.vn/)** I have used Pencil to create the initial mockups for the website.

#### Graphic Desing software:

- **[Adobe Fireworks:](https://www.adobe.com/products/fireworks.html)** I have used Adobe Fireworks to edit the background images.

#### Languages:

- **HTML5:** Is the main language used to create the structure of the website.

- **CSS3:** Is the language used to add styles to the HTML.

- **[JavaScript:](https://developer.mozilla.org/en-US/docs/Web/JavaScript)** This is the language used to add interactivity to the website and in order to manipulate the  data so it can be used to create the visualizations needed.

#### Libraries

- **[jQuery](https://jquery.com/)** This JavaScript library has been used to manipulate the DOM elements in a easier way than doing it with JavaScript. Mainly has been used to hide and show diferent sections of the website.

- **[D3.js](https://d3js.org/)** JavaScript library is used to create data visualization.
- **[DC.js](https://dc-js.github.io/dc.js/)** Is nother JavaScript library that provides prebuilt chart types for D3.
- **[Crossfilter.js](http://crossfilter.github.io/crossfilter/)** Is a JavaScript library that allows the charts to be interactive and interdependent of the same dataset.
- **[queue.js](https://github.com/d3/d3-queue)** Is a JavaScript library that is needed in order to wait for the data to be fully loaded before the rest of the code is run.
- **[FontAwesome:](https://fontawesome.com/ 'https://fontawesome.com/')** This library was already included in the template that I downloaded and I have used it to add icons in several places in the website to improve the user experience and to add social media links.

#### Development environment:

- **[VisualStudio:](https://visualstudio.microsoft.com/)**
For this second project I was recommended by my mentor change to VisualStudio because it seems to be a more powerful Development environment than Cloud9 and also using VisualStudio I was able to work without internet conexion when I needed to.

#### Version control system:

- **[Git:](https://git-scm.com/ 'https://git-scm.com/')**
I have used the version control system Git from the "Git Bash" terminal in order to track changes in the website and push them to GitHub.

#### Hosting service:

- **[GitHub:](https://github.com/ 'https://github.com/')**
I have used GitHub Pages in order to deploy the website and it is also the remote repository where I have pushed the changes from Git Bash.

#### Templates:

- **[Ample Bootstrap Admin Lite:](https://wrappixel.com/demos/admin-templates/ampleadmin/ample-admin-lite/dashboard.html)**

  I have used this template to help me with the charts positioning in the dashboard.
  This template includes FontAwesome and it is created with Bootstrap 3 so I have also been able to used Bootstrap and FontAwesome to modify the template to fit my needs.
  
## Testing

### Validation

- **HTML:** I have used https://validator.w3.org/ in order to validate the HTML code.
- **CSS:** I have used https://jigsaw.w3.org/css-validator/ in order to validate the CSS code.


### Features and responsiveness testing
 

### Additional testing
I have used development tools in Google Chrome to check how the website would look in different devices. In addition to that testing I have also asked friends and family to have a look at the website to let me know if everything looks fine on their browsers and devices.





### Problems and bugs:
- **Horizontal grid lines not being redered:** 

- **Hamburguer button second time that is opened**

- **Composite Line charts not being rendered:** I couldn't display the composite line charts when using an ordinal scale. I asked for help in Slack and I was told that I should add the dimension and group in the main section of the code as well as in the composite sections. Doing that I was able to display the chart.

- **Total number of cities:** The total number of cities matching the with the search options was not correct. After asking the Tutors they told me that the syntax seems right but they suggested to change the format of the number from .formatNumber(d3.format(".1s")) to .formatNumber(d3.format("d")) and that fixed the issue.

- **emailjs not sending the emails**

- **when data is not loaded** error screen is not appearing.

- **Composite line charts were not aligned with the labels in the x axis** I searched on the Internet and found the solution in the following link (https://github.com/dc-js/dc.js/issues/662). 
    


## Deployment
I have used GitHub Pages to deploy the website. In order to do that I have followed the steps below:

1. I have created a repository in GitHub called: “elenasacristan/HolidaysYa”
https://github.com/elenasacristan/HolidaysYa.git

2. I have initialised git from the terminal using Git Bash:
  
    `git init`

3. I have added the files that I was working on to the Staging area by using: 

    `git add .`

4. I have run the commit command with the first commit

    `git commit -m “initial commit`

5. I have copied from GitHub the following path and I have run it in the Git Bash terminal in order to indicate where is my remote repository:

    `git remote add origin git@github.com:elenasacristan/HolidaysYa.git`

    `git push -u origin master`

  
6. Then from my GitHub repository I have gone to settings, I have selected the master branch, I have saved and the website was published at:

    https://elenasacristan.github.io/HolidaysYa/ 

7. After this was done I have ran regular commits after every important update to the code, and I pushed the changes to GitHub pages.

### My repository

https://github.com/elenasacristan/HolidaysYa/


## Credits


#### Content

- **Data:** I have used two data sources and I have merged the data manually into a .csv file.
        The data that contains budget information has been collected from https://www.priceoftravel.com and the data that contains weather information has been collected from https://es.climate-data.org.

- **Additional information:**
I have also appended to the .csv file information about the number of visits per year. This information has been collected from the following websites:
  * https://www.hamburg-travel.com/business-media/facts-figures/tourism-statistics/european-cities/
  * https://www.hel.fi/uutiset/en/kaupunginkanslia/record-growth-2017
  * https://assets.simpleviewcms.com/simpleview/image/upload/v1/clients/norway/Key_Figures_2017_pages_9b3f82d5_43f4_4fe9_968c_7a85a36704b2_ed2d345f-e93b-410c-9fee-6c349da8eff0.pdf
  * http://www.edinburgh.gov.uk/downloads/download/1965/edinburgh_by_numbers_2018
  * https://www.dailysabah.com/tourism/2019/02/04/istanbul-attracts-134-million-foreign-visitors-in-2018
  * https://news.gtp.gr/2018/10/08/athens-expects-record-5-5-million-tourists-2018/
  * https://www.tourismireland.com/TourismIreland/media/Tourism-Ireland/Press%20Releases/TI_2017_Facts-Figures.pdf?ext=.pdf
  * http://www.um.warszawa.pl/en/Highlights/warsaw-attracts-more-and-more-tourists

- **Wikipedia:**  In the dashboard tables I have added links to each city that redirect the user to the wikipedia page to find out more about each city.

#### Media

##### background image intro page 
- The image used for the backgroung image in the intro page was obtained from Google images using the Advance Search and selecting “free to use, share or modify, even commercially”. 
 
https://www.pexels.com/photo/amsterdam-canal-city-city-challenge-39844/

##### background image budget selection page 
- The image used for the backgroung image in the budget selection page was obtained from Google images using the Advance Search and selecting “free to use, share or modify, even commercially”.

https://pixabay.com/photos/save-piggy-bank-teamwork-together-3451075/

##### background image weather selection page 
- The image used for the backgroung image in the weather selection page was obtained from Google images using the Advance Search and selecting “free to use, share or modify, even commercially”.

https://pixnio.com/nature-landscapes/sunset/seashore-sea-sand-sunset-water-sun-beach-dawn

##### background image for the error page 
- The image for the error page has been created using an image from Google images using the Advance Search and selecting “free to use, share or modify, even commercially” and then creating a new design based on the original picture using Adobe Fireworks.

https://pixabay.com/illustrations/sad-face-eyes-eyebrows-mouth-blue-1428080/



## Acknowledgements
- I received inspiration from the bootstrap template [Ample Bootstrap Admin Lite](https://wrappixel.com/demos/admin-templates/ampleadmin/ample-admin-lite/dashboard.html) which I used to help me speed up the process of design of the dashboard.
- The slack community and tutors where really helpful with some issues on the website.
- Thanks to Guido Cecilio García Bernal for helping me solve issues that were giving me a lot of problems and for teaching some things that I wouldn't have learnt otherwise.
 

