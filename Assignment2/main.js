window.onload=function(){
    function isValidDate(dateString) {
      var regEx = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateString.match(regEx)) return false;  // Invalid format
      var date = new Date(dateString);
      if (isNaN(date.getTime())) return false;  // Invalid date
      var today = new Date();
      var minDate = new Date();
      minDate.setDate(today.getDate() - 91);
      return (date >= minDate && date <= today);
    }

      // 90 days-Date constraint
      // Get the search date input element
      var searchDateInput = document.getElementById("search-date");
      // ...// Get today's date
      var today = new Date();
      // Set the maximum date allowed
      var maxDate = new Date();
      maxDate.setDate(today.getDate() - 91);
      // Set the minimum date allowed
      var minDate = new Date();
      minDate.setDate(today.getDate() - 1);
      // Convert the dates to the required format (YYYY-MM-DD)
      var maxDateString = formatDate(maxDate);
      var minDateString = formatDate(minDate);
      // Function to format the date as YYYY-MM-DD
      function formatDate(date) {
        var year = date.getFullYear();
        var month = ("0" + (date.getMonth() + 1)).slice(-2);
        var day = ("0" + date.getDate()).slice(-2);
        return year + "-" + month + "-" + day;
      }
      // Set the date range for the input field
      searchDateInput.setAttribute("min", maxDateString);
      searchDateInput.setAttribute("max", minDateString);


    // Add event listener to the search form
    var searchForm = document.getElementById("search-form");
    searchForm.addEventListener("submit", async function(event) {

    event.preventDefault();

    var selectedDate = searchDateInput.value;
    let inputField = document.getElementById('search-date');
    let Container2 = document.getElementById('Dep-stats-container');
    let Container3 = document.getElementById('Arr-stats-container');
    let h2 = document.getElementById('h2');
    // Clear statistics function
    function clearStatistics() {
      
      Container2.innerHTML = '';
      Container3.innerHTML = '';
      h2.innerText = '';
    }
    // Event listener for click event on input field
    inputField.addEventListener('click', clearStatistics);
    

    if (!selectedDate) {
      // Check if alert message already exists
      var alertMessage = document.querySelector(".alert");
      if (!alertMessage) {
        // Create a new alert message element
        var alertMessage = document.createElement("div");
        alertMessage.className = "alert";
        alertMessage.textContent = "Please select a date before clicking the Search button.";

        // Insert the alert message above the input form
        var formContainer = document.getElementById("form-container");
        formContainer.insertBefore(alertMessage, searchForm);
      } else {
        // Clear any existing alert message
        alertMessage.remove();

        // Reset the browser validation message
        searchDateInput.setCustomValidity("");

        // Clear the date input field
        searchDateInput.value = "";
        // Create a new alert message element
        var alertMessage = document.createElement("div");
        alertMessage.className = "alert";
        alertMessage.textContent = "Please select a date before clicking the Search button.";

        // Insert the alert message above the input form
        var formContainer = document.getElementById("form-container");
        formContainer.insertBefore(alertMessage, searchForm);
      }
  } else if (!isValidDate(selectedDate)) {
      // Check if alert message already exists
      var alertMessage = document.querySelector(".alert");
      if (!alertMessage) {
        // Create a new alert message element
        var alertMessage = document.createElement("div");
        alertMessage.className = "alert";
        alertMessage.textContent = "Please enter a valid date before clicking the Search button.";

        // Insert the alert message above the input form
        var formContainer = document.getElementById("form-container");
        formContainer.insertBefore(alertMessage, searchForm);
      } else {
        // Clear any existing alert message
        alertMessage.remove();

        // Reset the browser validation message
        searchDateInput.setCustomValidity("");
        
        // Clear the date input field
        searchDateInput.value = "";
        // Create a new alert message element
        var alertMessage = document.createElement("div");
        alertMessage.className = "alert";
        alertMessage.textContent = "Please enter a valid date before clicking the Search button.";

        // Insert the alert message above the input form
        var formContainer = document.getElementById("form-container");
        formContainer.insertBefore(alertMessage, searchForm);
      }
      // valid Date
  } else {
      // Clear any existing alert message
      var alertMessage = document.querySelector(".alert");
      if (alertMessage) {
        alertMessage.remove();
      }

      // Reset the browser validation message
      searchDateInput.setCustomValidity("");

      // Clear the date input field
      searchDateInput.value = "";

      // Display the date
      var FlightStatistics = document.getElementById("h2");
      FlightStatistics.innerText = `Flight Statistics on ${selectedDate}`;
      // Insert the head message below the input form
      var formContainer = document.getElementById("form-container");
      formContainer.insertBefore(FlightStatistics, searchForm);

      // fetch iata.json and flight data 
      await fetchData();
      
    }
      async function fetchData() {
        try {
          const iataResponse = await fetch('iata.json');
          const iata = await iataResponse.json();
          await fRequest(iata);
        } catch (error) {
          console.log('Error fetching IATA data:', error);
        }
      }
      
      async function fRequest(iata) {
        try {
          //console.log(selectedDate);
          const response1 = await fetch(`flight.php?date=${selectedDate}&lang=en&cargo=false&arrival=false`);
          const response2 = await fetch(`flight.php?date=${selectedDate}&lang=en&cargo=false&arrival=true`);
          if (response1.ok && response2.ok) {
            const data1 = await response1.json(); // Parse the response as JSON
            const data2 = await response2.json();
            processDepartureData(data1, iata); // Call a new function to process the flight data
            processArrivalData(data2, iata);
          } else {
            throw new Error(`Request failed. Returned status of ${response1.status} and ${response2.status}`);
          }
        } catch (error) {
          console.log('Error fetching flight data:', error);
        }
      }

      function processDepartureData(data1, iata) {
        //Check Date
        for (let key in data1) {
          if (data1[key]["date"] = selectedDate) {
            var Depdata = data1[key];
            //console.log(Depdata);
          }
        }
        let departure = document.getElementById("departure")
        departure.innerText = "Departure"
        // 'Next' problem has NOT beensolved!!!!

        // Calculate the total number of departure flights and display it
        let departureFlights = Depdata["list"].length;
        let departureCount = document.getElementById("departure-count");
        departureCount.innerText = `Total Flights       ${departureFlights}`;
        // Calculate the total unique destinations
        let departureDestinations = new Set();
        for (let key in Depdata["list"]){
          let destination = Depdata["list"][key]["destination"][0];
          if (!(destination in departureDestinations)){
            departureDestinations.add(destination);
          }
        }
        let departureDestinationsCount = departureDestinations.size;
        let departureDestination = document.getElementById("departure-des-count");
        departureDestination.innerText = `Destinations ${departureDestinationsCount}`;
        // Count and display each special case in the departure dataset
        var departureSpecialCases = {};
        for (let key in Depdata["list"]) {
          let status = Depdata["list"][key]["status"];
          //console.log(typeof status);
          if (!status.includes("Dep")) {
            if (departureSpecialCases[status]) {
              departureSpecialCases[status]++;
            } else {
              departureSpecialCases[status] = 1;
            }
          }
        };
        //console.log(departureSpecialCases);
        let SpecialCase = document.getElementById("departure-special-cases");
        SpecialCase.innerText = "Special Cases";
        let departureSpecialCasesList = document.getElementById("Dspecialcases");
        departureSpecialCasesList.innerHTML = "";
        for (let specialCase in departureSpecialCases) {
          let frequency = departureSpecialCases[specialCase];
          let listItem = document.createElement("li");
          listItem.innerText = `${specialCase}: ${frequency}`;
          departureSpecialCasesList.appendChild(listItem);
        }

        // Generate departure histogram   
        let departureHistogram = document.getElementById("departure-histogram");
        generateHistogram(Depdata, departureHistogram, "departure");
        function generateHistogram(flights, histogramElement, type) {
          let histogramData = Array(25).fill(0);
          for (let key in flights["list"]){
            if (flights["list"][key]["status"].length == 9) {
              let hour = parseInt(flights["list"][key]["status"].slice(4,6));
              ////);
              histogramData[hour]++;
            } 
            // else if (flights["list"][key]["status"].length > 9){
            //     histogramData[25]++;    
            // }
          }
  
      
        
          // Create the chart container element
          let chartContainer = document.createElement('div');
          chartContainer.classList.add('histogram');
        
          // Create the chart title element
          let chartTitle = document.createElement('h3');
          chartTitle.className = 'DTitle';
          chartTitle.innerText = `${type} Time`;
        
          // Create the chart canvas element
          let chartCanvas = document.createElement('canvas');
          chartCanvas.className = "DCanvas";
          chartCanvas.width = 400;
          chartCanvas.height = 300;
        
          // Append the chart title and canvas elements to the chart container
          chartContainer.appendChild(chartTitle);
          chartContainer.appendChild(chartCanvas);
        
          // Append the chart container to the histogram element
          histogramElement.appendChild(chartContainer);
        
          // Draw the chart using the canvas element
          let ctx = chartCanvas.getContext('2d');
          let barHeight = chartCanvas.height / histogramData.length;
          let maxValue = Math.max(...histogramData);
          let scaleFactor = chartCanvas.width / maxValue;
        
          const label1 = ['prev','00','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','23','next']
          for(let i=0;i<histogramData.length;i++){
            let y = (i+1) * barHeight;
            let x = 10;
            let barWidth = histogramData[i] * scaleFactor;
            ctx.fillStyle = 'rgba(75, 192, 192, 0.2)';
            ctx.fillRect(x, y, barWidth, barHeight);
            ctx.strokeStyle = 'rgba(75, 192, 192, 1)';
            ctx.strokeRect(x, y, barWidth, barHeight);
        

            ctx.fillStyle = 'black';
            ctx.font = '12px Arial';
            ctx.fillText(label1[i], x-10 , y);

            ctx.fillStyle = 'black';
            ctx.font = '12px Arial';
            ctx.fillText(histogramData[i], x + barWidth + 5, y + barHeight - 5);
          }
        }
        // Display top ten destination airports
        // IATA process
        var airportdict = {};
        iata.forEach(obj => {
          const iataCode = obj.iata_code;
          const name = obj.name;
          const city = obj.municipality;
          airportdict[iataCode] = iataCode+'   '+name+', '+city;
        })
        // Display top ten destination airports
        let topDestinations = getTopDestinationAirports(Depdata["list"], "destination", 10, iata);
        //console.log(topDestinations)
        let TopTen = document.getElementById("TopDes")
        TopTen.innerText = "Top Ten Destinations"
        let DAirport = document.getElementById("DAirport")
        DAirport.innerText = "Airport"
        let DAirportNum = document.getElementById("DAirportNum")
        DAirportNum.innerText = "No. of Flights"
        let topDestinationsList = document.getElementById("top-destinations");
        topDestinationsList.innerHTML = "";
        topDestinations.forEach((airport, index) => {
          let listItem = document.createElement("li");
          listItem.className = "listItem";
          listItem.innerText = `${airport.info} - ${airport.count}`;
          topDestinationsList.appendChild(listItem);
        });
        // Function to get top airports
        function getTopDestinationAirports(data, type, limit, iata) {
          let airports = {};          
          //console.log(data);
          data.forEach(obj => {
            let airportCode = obj["destination"][0];
            //console.log(airportCode)
            // Only count airports with valid IATA codes
              if (airports[airportCode]) {
                airports[airportCode].count++;
              } else {
                airports[airportCode] = {
                  info: airportdict[airportCode],
                  count: 1
                };
              }
          });
          // Convert object to array
          let airportArray = Object.values(airports);
          // Sort array by count in descending order
          airportArray.sort((a, b) => b.count - a.count);
          //console.log(airportArray)
          // Return top N airports
          return airportArray.slice(0, limit);
        }
        
        
      }


      function processArrivalData(data2, iata) {
        // Check Date
        let arrival = document.getElementById("arrival");
        arrival.innerText = "arrival";
        for (let key in data2) {
          if (data2[key]["date"] === selectedDate) {
            var Arrdata = data2[key];
            //console.log(Arrdata);
          }
        }      
        
        // Calculate the total number of arrival flights and display it
        let arrivalFlights = Arrdata["list"].length;
        let arrivalCount = document.getElementById("arrival-count");
        arrivalCount.innerText = `Total Flights: ${arrivalFlights}`;     
        // Calculate the total unique origins
        let arrivalOrigins = new Set();
        for (let key in Arrdata["list"]) {
          let origin = Arrdata["list"][key]["origin"][0];
          if (!arrivalOrigins.has(origin)) {
            arrivalOrigins.add(origin);
          }
        }
        let arrivalOriginsCount = arrivalOrigins.size;
        let arrivalOrigin = document.getElementById("arrival-origins-count");
        arrivalOrigin.innerText = `Origins: ${arrivalOriginsCount}`;    
        // Count and display each special case in the arrival dataset
        var arrivalSpecialCases = {};
        for (let key in Arrdata["list"]) {
          let status = Arrdata["list"][key]["status"];
          if (!status.includes("At")) {
            if (arrivalSpecialCases[status]) {
              arrivalSpecialCases[status]++;
            } else {
              arrivalSpecialCases[status] = 1;
            }
          }
        }
        //console.log(arrivalSpecialCases);
        let ASpecialCase = document.getElementById("arrival-special-cases");
        ASpecialCase.innerText = "Special Cases";
        let arrivalSpecialCasesList = document.getElementById("Aspecialcases");
        arrivalSpecialCasesList.innerHTML = "";
        for (let specialCase in arrivalSpecialCases) {
          let frequency = arrivalSpecialCases[specialCase];
          let listItem = document.createElement("li");
          listItem.innerText = `${specialCase}: ${frequency}`;
          arrivalSpecialCasesList.appendChild(listItem);
        }      
        // Generate arrival histogram
        let arrivalHistogram = document.getElementById("arrival-histogram");
        generateArrivalHistogram(Arrdata, arrivalHistogram, "arrival");
        function generateArrivalHistogram(flights, histogramElement, type) {
          let histogramData = Array(25).fill(0);
          for (let key in flights["list"]){
            if (flights["list"][key]["status"].length == 13) {
              let hour = parseInt(flights["list"][key]["status"].slice(8,10));
              ////);
              histogramData[hour]++;
            } 
            // else if (flights["list"][key]["status"].length > 9){
            //     histogramData[25]++;    
            // }
          }
          // Create the chart container element
          let chartContainer = document.createElement('div');
          chartContainer.classList.add('histogram');
        
          // Create the chart title element
          let chartTitle = document.createElement('h3');
          chartTitle.className = 'ATitle';
          chartTitle.innerText = `${type} Time`;
        
          // Create the chart canvas element
          let chartCanvas = document.createElement('canvas');
          chartCanvas.className = "ACanvas";
          chartCanvas.width = 400;
          chartCanvas.height = 300;
        
          // Append the chart title and canvas elements to the chart container
          chartContainer.appendChild(chartTitle);
          chartContainer.appendChild(chartCanvas);
        
          // Append the chart container to the histogram element
          histogramElement.appendChild(chartContainer);
        
          // Draw the chart using the canvas element
          let ctx = chartCanvas.getContext('2d');
          let barHeight = chartCanvas.height / histogramData.length;
          let maxValue = Math.max(...histogramData);
          let scaleFactor = chartCanvas.width / maxValue;
        
          const label1 = ['prev','00','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','23','next']
          for(let i=0;i<histogramData.length;i++){
            let y = (i+1) * barHeight;
            let x = 10;
            let barWidth = histogramData[i] * scaleFactor;
            ctx.fillStyle = 'rgba(75, 192, 192, 0.2)';
            ctx.fillRect(x, y, barWidth, barHeight);
            ctx.strokeStyle = 'rgba(75, 192, 192, 1)';
            ctx.strokeRect(x, y, barWidth, barHeight);
        

            ctx.fillStyle = 'black';
            ctx.font = '12px Arial';
            ctx.fillText(label1[i], x-10 , y);

            ctx.fillStyle = 'black';
            ctx.font = '12px Arial';
            ctx.fillText(histogramData[i], x + barWidth + 5, y + barHeight - 5);
          }
        }
        let airportdict = {};
        //console.log("airportdict",airportdict)
        iata.forEach(obj => {
          const iataCode = obj.iata_code;
          const name = obj.name;
          const city = obj.municipality;
          airportdict[iataCode] = iataCode+'   '+name+', '+city;
        })
        // Display top ten origin airports
        let topOrigins = getTopOriginAirports(Arrdata["list"], "origin", 10, iata);
        //console.log(topOrigins)
        let topOriginsList = document.getElementById("top-origins");
        let TopTen = document.getElementById("TopOri")
        TopTen.innerText = "Top Ten Origins"
        let AAirport = document.getElementById("AAirport")
        AAirport.innerText = "Airport"
        let AAirportNum = document.getElementById("AAirportNum")
        AAirportNum.innerText = "No. of Flights"
        topOriginsList.innerHTML = "";
        topOrigins.forEach((airport, index) => {
          let listItem = document.createElement("li");
          listItem.innerText = `${airport.info} - ${airport.count}`;
          topOriginsList.appendChild(listItem);
        });
        // Function to get top airports
        function getTopOriginAirports(data, type, limit, iata) {
          let airports = {};         
          //console.log("data",data);
          data.forEach(obj => {
            let airportCode = obj["origin"][0];
            //console.log(airportCode)
            // Only count airports with valid IATA codes
            //console.log("reached here")
            //console.log("this is airport dict",airportdict)
              if (airports[airportCode]) {
                airports[airportCode].count++;
              } else {
                airports[airportCode] = {
                  info: airportdict[airportCode],
                  count: 1
                };
              }
              //console.log("airpots:", airports)
          });

          // Convert object to array
          let airportArray = Object.values(airports);
          //console.log(airports)
          // Sort array by count in descending order
          airportArray.sort((a, b) => b.count - a.count);

          // Return top N airports
          return airportArray.slice(0, limit);
        }
      }

  
  

});


};


