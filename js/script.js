//toggle light and dark mode
const toggleIcon = document.getElementById('toggle-icon');
const toggleText = document.getElementById('toggle-text');

//light and dark mode themes
const bgColor = '--bg-color';
const txtColor = '--text-color';
const elmntColor = '--elements-color';
const inptColor = '--input-color';
const boxShadow = '--box-shadow';
let darkMode = true;

//function that switch to light mode
const lightModeFeature = () => {
	document.documentElement.style.setProperty(bgColor, 'hsl(0, 0%, 98%)');
	document.documentElement.style.setProperty(txtColor, 'hsl(200, 15%, 8%)');
	document.documentElement.style.setProperty(elmntColor, 'hsl(0, 0%, 100%)');
	document.documentElement.style.setProperty(inptColor, 'hsl(0, 0%, 52%)');
	document.documentElement.style.setProperty(boxShadow, '0px 0px 2px 2px rgba(0, 0, 0, 0.2)');
	toggleIcon.classList.remove('fas', 'fa-moon');
	toggleIcon.classList.add('far', 'fa-sun');
	toggleText.textContent = 'Light Mode';
	localStorage.setItem('isDark', 'no');
	darkMode = false;
}

//function that switch to dark mode
const darkModeFeature = () => {
	document.documentElement.style.setProperty(bgColor, 'hsl(207, 26%, 17%)');
	document.documentElement.style.setProperty(txtColor, 'hsl(0, 0%, 100%)');
	document.documentElement.style.setProperty(elmntColor, 'hsl(209, 23%, 22%)');
	document.documentElement.style.setProperty(inptColor, 'hsl(0, 0%, 100%)');
	document.documentElement.style.setProperty(boxShadow, 'none');
	toggleIcon.classList.remove('far', 'fa-sun');
	toggleIcon.classList.add('fas', 'fa-moon');
	toggleText.textContent = 'Dark Mode';
	localStorage.setItem('isDark', 'yes');
	darkMode = true;
}

// Initial darkMode value based on localStorage (if available)
let storedMode = localStorage.getItem('isDark');
if (storedMode !== null) {
	darkMode = storedMode === 'yes';
}

// Apply the initial mode styles and icons
if (darkMode) {
	darkModeFeature();
} else {
	lightModeFeature();
}

// Toggle mode when clicking on the text
toggleText.addEventListener('click', () => {
	darkMode ? lightModeFeature() : darkModeFeature();
});


//When document is loaded

document.addEventListener('DOMContentLoaded', () => {
	const url = window.location.href.toString();

	// Display contents on the UI based on the current page
	if (url.includes('singleCountry.html')) {
		// Actions specific to the single country page
		initializeSingleCountryPage();
		setupSingleCountryPageEvents();
	} else {
		// Actions for other pages
		fetchAllCountries();
		displayHomeFeatures();
	}
});




const displayHomeFeatures = () => {
	//Dropdown toggle
	const dropBtn = document.querySelector('.dropbtn');
	const dropContent = document.querySelector('.dropdown-content');

	dropBtn.addEventListener('click', e => {
		dropContent.classList.toggle('show');
	})


	//Search Feature
	// Get the input field

	const searchInput = document.getElementById("search-input");
	searchInput.addEventListener('keyup', e => {
		const value = e.target.value.toLowerCase();
		getSpecificCountry(value);
		e.preventDefault();
	});


	//Dropdown for regions filter
	const regions = document.querySelectorAll('.region');
	regions.forEach(region => {
		region.addEventListener('click', e => {
			const value = e.target.innerHTML.toLowerCase();
			getRegionCountries(value);
			dropContent.classList.remove('show');
		})
	});




	// function that saves country to Local storage and redirect to single country page
	const saveCountry = (e) => {
		if (e.target.parentElement.classList.contains('country-link')) {
			const link = e.target.parentElement;

			const countryName = link.getAttribute('data-name').toLowerCase();

			//clear previous data
			localStorage.removeItem('country-name');
			//add data to storage
			localStorage.setItem("country-name", countryName);

			window.location.href = './singleCountry.html';
		}
	}

	const countries = document.querySelector('.countries');

	countries.addEventListener('click', saveCountry);
}

//Event listener for single country page
const setupSingleCountryPageEvents = () => {
	const backBtn = document.querySelector('.back-btn');

	backBtn.addEventListener('click', () => {
		window.location.href = './index.html';
	})

	// function that saves country to Local storage and redirect to home page
	const saveCountry = (e) => {
		if (e.target.classList.contains('country-btn')) {
			const btn = e.target;
			const countryCode = btn.value.toLowerCase();

			//clear previous data
			localStorage.removeItem('country-code');

			//add data to storage
			localStorage.setItem("country-code", countryCode);

			const code = JSON.stringify(localStorage.getItem('country-code'));
			//Get country by code
			getCountryByCode(code);
		}
	}

	const country = document.querySelector('.country');
	country.addEventListener('click', saveCountry);
}


//display all countries to the index page 
const displayCountries = countriesData => {
	const countries = document.querySelector('.countries');

	let output = '';
	countriesData.forEach(country => {
		output += `
           	<div class="card">
				<a data-name="${country.name.common}" class="country-link">
					<img class="card-img" src="${country.flags.svg}" alt="${country.name.common}">
				</a>
          
				<div class="card-body">
					<a data-name="${country.name.common}" class="country-link">
						<h3 class="card-title">${country.name.common}</h3>
					</a>
					<ul>
						<li>
							<span class="item-key">Population: </span>
							<span class="item-value">${country.population.toLocaleString('en')}</span>
						</li>
						<li>
							<span class="item-key">Region: </span>
							<span class="item-value">${country.region}</span>
						</li>
						<li>
							<span class="item-key">Capital: </span>
							<span class="item-value">${country.capital}</span>
						</li>
					</ul>
					
				</div>
           </div>
         `;
	});

	countries.innerHTML = output;
}



//displays the singleCountry Page
const displayCountry = country => {
	const countryElement = document.querySelector('.country');
	const data = country[0];

	//Format native Name
	const nativeNames = data.name.nativeName;
	const nativeName = Object.values(nativeNames)[0].common;

	//Format Currencies
	const currencies = data.currencies;
	let currencyArr = []
	for (const key in currencies) {
		currencyArr.push(currencies[key].name)

	}
	const currency = currencyArr.join(', ');

	//Format Languages
	const languages = data.languages;
	let languagesArr = []
	for (const key in languages) {
		languagesArr.push(languages[key])

	}
	const language = languagesArr.join(', ');

	//Format Border Countries
	// By adding the Array.isArray(data.borders) check, we ensure that data.borders is an array before attempting to slice it.If data.borders is not an array(or undefined), we set fourBorders as an empty array to avoid the "Cannot read properties of undefined" error.

	const fourBorders = Array.isArray(data.borders) ? data.borders.slice(0, 4) : [];

	const borders = Object.assign({}, fourBorders);


	//display data in html
	countryElement.innerHTML = ` 
     <div class="country-image">
            <img src="${data.flags.svg}" alt="${data.name.common}">
        </div>
        <div class="country-details">
            <div class="details">
                <div class="primary-details">
                    <h3 class="country-name">${data.name.common}</h3>
                    <ul>
                        <li>
                            <span class="item-key">Native Name: </span>
                            <span class="item-value">${nativeName}</span>
                        </li>
                        <li>
                            <span class="item-key">Population: </span>
                            <span class="item-value">${data.population.toLocaleString('en')}</span>
                        </li>
                        <li>
                            <span class="item-key">Region: </span>
                            <span class="item-value">${data.region}</span>
                        </li>
                        <li>
                            <span class="item-key">Sub Region: </span>
                            <span class="item-value">${data.subregion}</span>
                        </li>
                        <li>
                            <span class="item-key">Capital: </span>
                            <span class="item-value">${data.capital}</span>
                        </li>
            
                    </ul>
                </div>
                <div class="secondary-details">
                    <ul>
                        <li>
                            <span class="item-key">Top Level Domain: </span>
                            <span class="item-value">${data.tld}</span>
                        </li>
                        <li>
                            <span class="item-key">Currencies: </span>
                            <span class="item-value">${currency}</span>
                        </li>
                        <li>
                            <span class="item-key">Languages: </span>
                            <span class="item-value">${language}</span>
                        </li>
                    </ul>
                </div>
            </div>

           ${Object.keys(borders).length === 0 && borders.constructor === Object ? '' : `
            <div class="border-countries">
                <div class="border-countries-label">
                    <h4>Border Countries:</h4>
                </div>
                <div class="border-countries-btns">
					${Object.keys(borders).map(function (key) {
		return "<button class='country-btn'  value='" + borders[key] + "'>" + borders[key] + "</button>"
	}).join("")}    
				</div>`
		}
		</div>`;

}



//API Calls

//Get all countries
const fetchAllCountries = () => {
	axios.get('https://restcountries.com/v3.1/all')
		.then(function (response) {
			console.log(response);

			const countriesData = response.data;
			displayCountries(countriesData);

		}).catch(function (error) {
			// handle error
			console.log(error);
		})
}


//Get specific country
const getSpecificCountry = (name) => {
	axios.get(`https://restcountries.com/v3.1/name/${name}`)
		.then(function (response) {
			const countriesData = response.data;

			displayCountries(countriesData);

		}).catch(function (error) {

			console.log(error);
		})
}


//Get countries by region
const getRegionCountries = (region) => {
	axios.get(`https://restcountries.com/v3.1/region/${region}`)
		.then(function (response) {

			const countriesData = response.data;

			displayCountries(countriesData);

		}).catch(function (error) {
			console.log(error);
		})
}


//Get specific country (for Single country Page)
const getCountry = (name) => {
	axios.get(`https://restcountries.com/v3.1/name/${name}`)
		.then(function (response) {
			console.log(response);

			const countryData = response.data;

			displayCountry(countryData);

		}).catch(function (error) {

			console.log(error);
		})
}

//Get specific country by code (for Country Single Page)
const getCountryByCode = (code) => {
	axios.get(`https://restcountries.com/v3.1/alpha/${code.replace(/\"/g, "")}`)
		.then(function (response) {

			const countryData = response.data;

			displayCountry(countryData);

		}).catch(function (error) {

			console.log(error);
		})
}


const initializeSingleCountryPage = () => {
	// console.log('This is the country page');

	try {
		// Retrieve data from localStorage
		const name = localStorage.getItem('country-name');
		const code = localStorage.getItem('country-code');

		// Check if the country page is reloaded
		const navigationEntries = performance.getEntriesByType('navigation');
		if (navigationEntries.length > 0 && navigationEntries[0].type === 'reload') {
			// Page is reloaded, get data by code
			getCountryByCode(code);
		} else {
			// Page is not reloaded, get data by name
			getCountry(name);
		}
	} catch (error) {
		console.error('Error occurred during country page initialization:', error);
	}
};



