document.addEventListener("DOMContentLoaded", function () {
    function animateCounter(id, target) {
        let element = document.getElementById(id);
        let count = 0;
        let increment = Math.ceil(target / 100); // Increment value
        let duration = 4000; // 4 seconds
        let interval = duration / (target / increment);

        let counter = setInterval(() => {
            count += increment;
            if (count >= target) {
                count = target;
                clearInterval(counter);
            }
            element.textContent = count.toLocaleString();
        }, interval);
    }

    // Animate all counters
    animateCounter("crime-24hrs", 4562);
    animateCounter("crime-week", 30854);
    animateCounter("crime-month", 132567);
    animateCounter("crime-year", 1458902);
});
