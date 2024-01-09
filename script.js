document.addEventListener('DOMContentLoaded', function () {
    let fasting = false;
    let startTime;
    let timerInterval;

    const startButton = document.getElementById('startButton');
    const endButton = document.getElementById('endButton');
    const hoursSpan = document.getElementById('hours');
    const minutesSpan = document.getElementById('minutes');
    const secondsSpan = document.getElementById('seconds');

    const currentDayElement = document.getElementById('currentDay');
    displayCurrentDay(currentDayElement);


    startButton.addEventListener('click', function () {
        if (!fasting) {
            fasting = true;
            startTime = new Date();
            timerInterval = setInterval(updateTimer, 1000);
        }
    });

    endButton.addEventListener('click', function () {
        if (fasting) {
            fasting = false;
            clearInterval(timerInterval);
            let endTime = new Date();
            saveFastingData(startTime, endTime);
            resetTimer();
        }
    });

    function saveFastingData(startTime, endTime) {
        let duration = (endTime - startTime) / (1000 * 60 * 60); // Duration in hours
        let today = new Date().toISOString().split('T')[0];

        let fastingData = JSON.parse(localStorage.getItem('fastingData')) || {};
        fastingData[today] = duration.toFixed(2); // Store duration as a string

        localStorage.setItem('fastingData', JSON.stringify(fastingData));
    }

    function getFastingData() {
        let labels = [];
        let data = [];
        let fastingData = JSON.parse(localStorage.getItem('fastingData')) || {};
    
        for (let i = 6; i >= 0; i--) {
            let day = new Date(new Date().setDate(new Date().getDate() - i));
            let dayKey = day.toISOString().split('T')[0];
            labels.push(day.toLocaleDateString('en-US', { weekday: 'long' })); // Day names
            
            let durationInHours = parseFloat(fastingData[dayKey] || 0);
            if (durationInHours < 1) {
                // Convert to minutes and seconds if less than 1 hour
                let minutes = Math.floor(durationInHours * 60);
                let seconds = Math.floor((durationInHours * 3600) % 60);
                data.push(`${minutes}m ${seconds}s`);
            } else {
                data.push(durationInHours.toFixed(2));
            }
        }
    
        return { labels, data };
    }
    

    function displayCurrentDay(element) {
        let today = new Date();
        let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        let formattedDate = today.toLocaleDateString('en-US', options);
        element.textContent = `${formattedDate}`;
    }
    

  
function updateTimer() {
    const currentTime = new Date();
    const diff = currentTime - startTime;
    const totalSeconds = 16 * 60 * 60; // Total fasting seconds (example: 16 hours)
    const elapsedSeconds = diff / 1000; // Elapsed seconds since start
    const progress = elapsedSeconds / totalSeconds; // Progress percentage

    let hours = Math.floor(diff / 3600000);
    let minutes = Math.floor((diff % 3600000) / 60000);
    let seconds = Math.floor((diff % 60000) / 1000);

    // Update the text
    hoursSpan.textContent = pad(hours);
    minutesSpan.textContent = pad(minutes);
    secondsSpan.textContent = pad(seconds);

    // Update the progress circle
    const circle = document.querySelector('#circle-progress circle:nth-child(2)');
    const circumference = 2 * Math.PI * 90; // The circumference of the circle
    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    circle.style.strokeDashoffset = circumference * (1 - progress);
}

    function resetTimer() {
        hoursSpan.textContent = '00';
        minutesSpan.textContent = '00';
        secondsSpan.textContent = '00';
    }

    function pad(number) {
        return number < 10 ? '0' + number : number;
    }

    const reportLink = document.querySelector('#menu a[href="#report"]');
    const reportSection = document.getElementById('report');

    reportLink.addEventListener('click', function (e) {
        e.preventDefault();
        reportSection.style.display = 'block';
        initializeChart();
    });

    function initializeChart() {
        const { labels, data } = getFastingData();
        const ctx = document.getElementById('fastingChart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Fasting Duration',
                    data: data,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
    
});

function getFastingData() {
    // This function should return an array of fasting hours for the last 7 days.
    // For demonstration, I'm returning a dummy array.
    return [12, 13, 11, 14, 10, 12, 13]; // Hours fasted each day
}
