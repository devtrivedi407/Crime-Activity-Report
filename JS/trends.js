let yearlyTrends = {}; // Global variable to store yearly trends
let crimeChart = null;

document.addEventListener("DOMContentLoaded", function () {
    loadCrimeData();
});

function loadCrimeData() {
    Papa.parse("../data/final_crime_data.csv", {
        download: true,
        header: true,
        dynamicTyping: true,
        complete: function (results) {
            let crimeData = results.data.filter(row => row["Crime Type"] !== "Data.Population");
            crimeData.forEach(row => row["Crime Count"] = parseFloat(row["Crime Count"]) || 0);
            populateDropdowns(crimeData);
            attachEventListeners(crimeData);
        },
    });
}

function populateDropdowns(data) {
    let states = [...new Set(data.map(row => row.State))].sort();
    let crimeTypes = [...new Set(data.map(row => row["Crime Type"]))].sort();

    let stateSelect = document.getElementById("stateSelect");
    states.forEach(state => {
        let option = document.createElement("option");
        option.value = state;
        option.textContent = state;
        stateSelect.appendChild(option);
    });

    let crimeSelect = document.getElementById("crimeSelect");
    crimeTypes.forEach(crime => {
        let option = document.createElement("option");
        option.value = crime;
        option.textContent = crime;
        crimeSelect.appendChild(option);
    });
}

function attachEventListeners(crimeData) {
    document.getElementById("generateTrends").addEventListener("click", () => processCrimeTrends(crimeData));
    document.getElementById("predictFuture").addEventListener("click", () => processCrimePredictions());
}

function processCrimeTrends(crimeData) {
    let state = document.getElementById("stateSelect").value;
    let crimeType = document.getElementById("crimeSelect").value;

    yearlyTrends = {}; // Reset global variable

    let filteredData = crimeData.filter(row =>
        (state === "All" || row.State === state) &&
        (crimeType === "All" || row["Crime Type"] === crimeType)
    );

    filteredData.forEach(row => {
        yearlyTrends[row.Year] = (yearlyTrends[row.Year] || 0) + row["Crime Count"];
    });

    plotCrimeTrends(Object.keys(yearlyTrends), Object.values(yearlyTrends));
}

function processCrimePredictions() {
    if (Object.keys(yearlyTrends).length === 0) {
        alert("Please generate crime trends first before predicting future trends!");
        return;
    }

    let years = Object.keys(yearlyTrends).map(Number).sort((a, b) => a - b);
    let crimeCounts = years.map(year => yearlyTrends[year]);

    let regressionModel = linearRegression(years, crimeCounts);
    let futureYears = [];
    let futurePredictions = [];

    let lastYear = years[years.length - 1];
    for (let i = 1; i <= 5; i++) {
        futureYears.push(lastYear + i);
        futurePredictions.push(regressionModel.predict(lastYear + i));
    }

    // 📊 Update Prediction Summary Before Plotting
    updatePredictionSummary(futureYears, futurePredictions);

    // Send data to chart with regression line
    plotCrimeTrends(years, crimeCounts, futureYears, futurePredictions);
}

function plotCrimeTrends(years, crimeCounts, futureYears = [], futurePredictions = []) {
    let ctx = document.getElementById("crimeTrendsChart").getContext("2d");

    // Destroy previous chart before creating a new one
    if (crimeChart !== null) {
        crimeChart.destroy();
    }

    let datasets = [
        {
            label: "Actual Crime Data",
            data: crimeCounts,
            borderColor: "blue",
            fill: false,
            pointRadius: 4,
            pointBackgroundColor: "blue",
            tension: 0.2 // Smoother curve
        }
    ];

    // 🔥 Improved Regression Line for Predictions
    if (futureYears.length > 0) {
        datasets.push({
            label: "Predicted Future Crimes (Regression)",
            data: new Array(years.length).fill(null).concat(futurePredictions),
            borderColor: "#ff3b3b", // 🔥 Bright Red for Visibility
            borderWidth: 3, // Thicker Line
            borderDash: [10, 5], // Dashed Style
            fill: false,
            pointRadius: 5,
            pointBackgroundColor: "#ff3b3b",
            tension: 0.2
        });
    }

    crimeChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: [...years, ...futureYears],
            datasets: datasets
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: true },
                title: {
                    display: true,
                    text: "Crime Trends & Future Predictions",
                    font: { size: 22 }
                }
            },
            scales: {
                x: { title: { display: true, text: "Year" } },
                y: { title: { display: true, text: "Crime Count" } }
            }
        }
    });
}

// 📊 Function to Generate Prediction Summary
function updatePredictionSummary(futureYears, futurePredictions) {
    let summarySection = document.getElementById("predictionSummary");
    let summaryText = document.getElementById("predictionText");

    let lastPredictedYear = futureYears[futureYears.length - 1];
    let lastPredictedValue = futurePredictions[futurePredictions.length - 1].toFixed(2);

    summaryText.innerHTML = `📊 By <strong>${lastPredictedYear}</strong>, crime is expected to be around <strong>${lastPredictedValue}</strong> cases. 🚀`;
    
    summarySection.style.display = "block";
}

function linearRegression(x, y) {
    let n = x.length;
    let sumX = x.reduce((a, b) => a + b, 0);
    let sumY = y.reduce((a, b) => a + b, 0);
    let sumXY = x.map((xi, i) => xi * y[i]).reduce((a, b) => a + b, 0);
    let sumX2 = x.map(xi => xi * xi).reduce((a, b) => a + b, 0);

    let slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    let intercept = (sumY - slope * sumX) / n;

    return {
        predict: function (year) { return slope * year + intercept; }
    };
}
