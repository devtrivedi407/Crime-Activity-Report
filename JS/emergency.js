document.addEventListener("DOMContentLoaded", function() {
    const faqButtons = document.querySelectorAll(".faq-question");

    faqButtons.forEach(button => {
        button.addEventListener("click", function() {
            const answer = this.nextElementSibling;
            const icon = this.querySelector(".toggle-icon");

            if (answer.style.display === "block") {
                answer.style.display = "none";
                icon.textContent = "+";
            } else {
                answer.style.display = "block";
                icon.textContent = "-";
            }
        });
    });
});

function callEmergency(service) {
    if (service === "911") {
        window.location.href = "tel:911";
    } else if (service === "Local Police") {
        alert("Please call your local police department for assistance.");
    }
}

function reportIncident() {
    alert("Redirecting to the online crime reporting system...");
    window.location.href = "https://www.ic3.gov/"; // Redirect to reports page
}
