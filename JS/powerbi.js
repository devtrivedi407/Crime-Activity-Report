document.addEventListener("DOMContentLoaded", function () {
    const reports = [
        { title: "Crime Trends by State", url: "/Power BI Reports/Overall_Crime_Trends.pdf", summary: "This report analyzes overall crime trends across different states, helping policymakers track increases or decreases in crime rates." },
        { title: "Statewise Crime Analysis", url: "/Power BI Reports/Statewise_Crime_Comparison.pdf", summary: "Comparison of crime rates across states, providing insights into which states have higher or lower crime levels." },
        { title: "Violent vs Property Crime Overview", url: "/Power BI Reports/Violent_vs_Property_Crimes.pdf", summary: "A breakdown of violent vs. property crimes, showing how different types of crimes are distributed over time." },
        { title: "Top 5 Highest Crime States", url: "/Power BI Reports/Top_5_Highest_Crime_States.pdf", summary: "This visualization ranks the top 5 states with the highest reported crime rates." },
        { title: "Top 5 Lowest Crime States", url: "/Power BI Reports/Top_5_Lowest_Crime_States.pdf", summary: "A report highlighting the 5 states with the lowest crime rates based on available data." },
        { title: "Heatmap for Crime Count across US", url: "/Power BI Reports/Crime_Heatmap.pdf", summary: "A visual heatmap representing crime density across different regions of the United States." },
        { title: "Crime Types Pie Chart", url: "/Power BI Reports/Crime_Type_Pie.pdf", summary: "A breakdown of different types of crimes represented in a pie chart for easy comparison." },
        { title: "KPI Dashboard for Crime Analysis", url: "/Power BI Reports/Crime_KPI_Dashboard.pdf", summary: "Key Performance Indicators (KPIs) dashboard to track crime trends and law enforcement efficiency." }
    ];

    const container = document.getElementById("report-container");
    const modal = document.getElementById("report-modal");
    const modalTitle = document.getElementById("modal-title");
    const modalFrame = document.getElementById("modal-frame");
    const modalSummary = document.getElementById("modal-summary");
    const downloadSummary = document.getElementById("download-summary");
    const closeModal = document.querySelector(".close-btn");

    reports.forEach(report => {
        const reportDiv = document.createElement("div");
        reportDiv.className = "report-tile";
        reportDiv.innerHTML = `
            <h3>${report.title}</h3>
            <iframe src="${report.url}" allowfullscreen></iframe>
        `;

        reportDiv.addEventListener("click", () => {
            modal.style.display = "flex";
            modalTitle.textContent = report.title;
            modalFrame.src = report.url;
            modalSummary.textContent = report.summary;
            downloadSummary.href = report.url;
        });

        container.appendChild(reportDiv);
    });

    closeModal.addEventListener("click", () => {
        modal.style.display = "none";
    });

    // ✅ Dark Mode Toggle with Local Storage
    const darkModeToggle = document.getElementById("dark-mode-toggle");

    // Load Dark Mode Preference from Local Storage
    if (localStorage.getItem("darkMode") === "enabled") {
        document.body.classList.add("dark-mode");
        darkModeToggle.innerHTML = "☀️ Light Mode";
    }

    // Toggle Dark Mode
    darkModeToggle.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");

        if (document.body.classList.contains("dark-mode")) {
            localStorage.setItem("darkMode", "enabled");
            darkModeToggle.innerHTML = "☀️ Light Mode";
        } else {
            localStorage.setItem("darkMode", "disabled");
            darkModeToggle.innerHTML = "🌙 Dark Mode";
        }
    });
});
