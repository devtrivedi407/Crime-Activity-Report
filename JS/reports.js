document.addEventListener("DOMContentLoaded", function () {
    function populateDropdowns() {
        fetch('http://127.0.0.1:5000/get-dropdown-options')  // Fetch dropdown options from Flask
            .then(response => response.json())
            .then(data => {
                populateSelect("state", data.states);
                populateSelect("year", data.years);
                populateSelect("crimeType", data.crime_types);
            })
            .catch(error => console.error("Error fetching dropdown data:", error));
    }

    function populateSelect(selectId, options) {
        const selectElement = document.getElementById(selectId);
        options.forEach(option => {
            let opt = document.createElement("option");
            opt.value = option;
            opt.innerHTML = option;
            selectElement.appendChild(opt);
        });
    }

    // ✅ Ensure generateReport is accessible globally
    window.generateReport = function () {
        const state = document.getElementById("state").value;
        const year = document.getElementById("year").value;
        const crimeType = document.getElementById("crimeType").value;
    
        const url = `http://127.0.0.1:5000/generate-report?state=${state}&year=${year}&crimeType=${crimeType}`;
    
        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // ✅ Auto-download the generated PDF
                    let a = document.createElement("a");
                    a.href = data.pdf_url;
                    a.setAttribute("download", "crime_report.pdf");
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                } else {
                    alert("No data found for the selected filters.");
                }
            })
            .catch(error => console.error("Error generating report:", error));
    };

    populateDropdowns();
});
