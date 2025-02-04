document.addEventListener("DOMContentLoaded", function () {
    const generateGraphBtn = document.getElementById("generateGraph");
    const graphImage = document.getElementById("graphImage");
    const downloadGraphBtn = document.getElementById("downloadGraph");

    generateGraphBtn.addEventListener("click", function () {
        console.log("✅ Button Clicked! Sending request to Flask...");

        const graphType = document.getElementById("graphType").value;
        const state = document.getElementById("state").value;
        const year = document.getElementById("year").value;
        const crimeType = document.getElementById("crimeType").value;

        console.log(`✅ Graph Type: ${graphType}, State: ${state}, Year: ${year}, Crime Type: ${crimeType}`);

        const url = `http://127.0.0.1:5000/generate-graph?graphType=${graphType}&state=${state}&year=${year}&crimeType=${crimeType}`;

        fetch(url)
            .then(response => response.json())  // ✅ Expect JSON response
            .then(data => {
                if (data.success) {
                    console.log("✅ Graph received. Updating UI...");
                    graphImage.src = data.image_url + "?timestamp=" + new Date().getTime(); // ✅ Prevent browser cache issue
                    graphImage.style.display = "block"; // ✅ Show the image
                    downloadGraphBtn.style.display = "block"; // ✅ Show the download button

                    // ✅ Enable Download Button
                    downloadGraphBtn.onclick = () => {
                        const link = document.createElement("a");
                        link.href = data.image_url;
                        link.download = "crime_graph.png";
                        link.click();
                    };
                } else {
                    console.error("❌ Graph generation failed:", data.error);
                }
            })
            .catch(error => console.error("❌ Error generating graph:", error));
    });

    // ✅ Populate Dropdowns
    function populateDropdowns() {
        console.log("✅ Fetching dropdown data...");

        fetch("http://127.0.0.1:5000/get-dropdown-options")
            .then(response => response.json())
            .then(data => {
                console.log("✅ Dropdown Data:", data);
                populateSelect("state", data.states);
                populateSelect("year", data.years);
                populateSelect("crimeType", data.crime_types);
            })
            .catch(error => console.error("❌ Error fetching dropdown data:", error));
    }

    function populateSelect(selectId, options) {
        const selectElement = document.getElementById(selectId);
        selectElement.innerHTML = "";

        let defaultOption = document.createElement("option");
        defaultOption.value = "all";
        defaultOption.textContent = "All";
        selectElement.appendChild(defaultOption);

        options.forEach(option => {
            let opt = document.createElement("option");
            opt.value = option;
            opt.textContent = option;
            selectElement.appendChild(opt);
        });
    }

    populateDropdowns();
});
