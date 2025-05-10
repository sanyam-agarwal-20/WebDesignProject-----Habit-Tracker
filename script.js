//weather display
async function getWeather() {
    const city = document.getElementById('city').value;
    const url = `https://wttr.in/${city}?format=3`;
  
    try{
      const response = await fetch(url);
      const text = await response.text();
      document.getElementById('weather-result').textContent = text;
    }catch (err){
      document.getElementById('weather-result').textContent = "Error fetching weather.";
    }
}

document.addEventListener('DOMContentLoaded', () => {    
    
    //date display
    function updateDateTimeDisplay() {
        var dateTimeDisplay = document.getElementById('today-date-display');
        var now = new Date();
        var options = {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        };
    
        var formattedDate = now.toLocaleDateString(undefined, options);
        var formattedTime = now.toTimeString().slice(0, 5);
    
        dateTimeDisplay.textContent = `${formattedDate} | ${formattedTime}`;

        var timeInput = document.getElementById('habit-time');
        timeInput.value = formattedTime;
    }
    updateDateTimeDisplay();
    setInterval(updateDateTimeDisplay, 60000);

    //toggle theme
    var themetoggleButton = document.getElementById('toggle-theme');
    var body = document.body;
    if(localStorage.getItem('theme') === 'light') {
        body.classList.add('light');
    }
    else{
        body.classList.add('dark');
    }
    themetoggleButton.addEventListener('click', () => {
        body.classList.toggle('dark');
        body.classList.toggle('light');
    
        var currentTheme = body.classList.contains('dark') ? 'dark' : 'light';
        localStorage.setItem('theme', currentTheme);
    });

    //to animate text
    function runtextanimation(tagnametoedit, name, speed, left="", right="", preload=""){
        let indexcurr = 0;
        var animationofname = setInterval(() => {
            if(indexcurr === name.length){
                clearInterval(animationofname);
                indexcurr = 0;
            }
            else{
                ++indexcurr;
                tagnametoedit.innerHTML = preload + left + name.substring(0, indexcurr) + right;
            }
        }, parseInt(speed));
    }
    var sitetitle = document.getElementById('site-title');
    runtextanimation(sitetitle, "track-it", 90, '&lt;', '&gt;');

    //username check
    var usernameInput = document.getElementById('username-input');
    var setUsernameButton = document.getElementById('set-username');
    var usernameSection = document.getElementById('new-user-area');
    var usernameDisplay = document.getElementById('registered-user-area');

    let registereduser = localStorage.getItem('username-register');

    if (registereduser){
        usernameSection.style.display = 'none';
        usernameDisplay.style.display = 'block';
        runtextanimation(usernameDisplay, registereduser, 90, '&lt;', '&gt;');
        loadhabitsfordisplay();
    } 
    else {
        usernameSection.style.display = 'block';
        usernameDisplay.style.display = 'none';
    }

    setUsernameButton.addEventListener('click', () => {
        var username = usernameInput.value.trim();
        if (username !== '') {
            localStorage.setItem('username-register', username);
            registereduser = username;
            usernameSection.style.display = 'none';
            runtextanimation(usernameDisplay, registereduser, 90, '&lt;', '&gt;');
            usernameDisplay.style.display = 'block';
        }
        else {
            alert("Please enter a valid username.");
        }
    });

    //adding habit to list
    var habitinput = document.getElementById('habit-input');
    var habitaddbutton = document.getElementById('add-habit');

    habitaddbutton.addEventListener('click',() => {
        var habitName = habitinput.value.trim();
        var habitTime = document.getElementById('habit-time').value;
        var selectedDays = getSelectedDays();
    
        if (!habitName) {
            alert("Please enter a valid habit!");
            return;
        }
        if (!habitTime) {
            alert("Please select a time.");
            return;
        }
        if (selectedDays.length === 0) {
            alert("Please select at least one day.");
            return;
        }

        var newHabit = {
            name: habitName,
            time: habitTime || "Not Set",
            days: selectedDays
        };

        var habits = JSON.parse(localStorage.getItem("habits")) || [];

        habits.push(newHabit);
        localStorage.setItem("habits", JSON.stringify(habits));
    
        habitinput.value = "";
        document.getElementById('habit-time').value = "";
        clearDaySelection();

        displayHabits(habits);
    });

    function loadhabitsfordisplay() {
        var habitslist = JSON.parse(localStorage.getItem("habits")) || [];
        displayHabits(habitslist);
    }
    
    function displayHabits(habits) {
        var container = document.getElementById('habit-list');
        container.innerHTML = "";
    
        habits.forEach((habit, index) => {
            var el = document.createElement("div");
            el.classList.add("modify-item-list");
    
            var title = document.createElement("strong");
            title.textContent = `${habit.name} - ${habit.time}`;
    
            var tablecontent = createtableforweek(habit.days);
    
            var tableWrapper = document.createElement("div");
            tableWrapper.innerHTML = tablecontent;
    
            var donebutton = document.createElement("button");
            donebutton.textContent = "Done";
            donebutton.id = "done-button-display";
            donebutton.addEventListener('click', () => {
                if (checkdayinlist(habit.days)) {
                    el.classList.toggle('done');
                    //console.log(el);
                } else {
                    alert("Cannot perform this activity today");
                }
            });
    
            var delbutton = document.createElement("button");
            delbutton.textContent = "Delete";
            delbutton.id = "del-button-display";
            delbutton.addEventListener('click', () => {
                var habits = JSON.parse(localStorage.getItem("habits")) || [];
                habits.splice(index, 1);
                localStorage.setItem("habits", JSON.stringify(habits));
                displayHabits(habits);
            });
    
            el.appendChild(title);
            el.appendChild(document.createElement("br"));
            el.appendChild(donebutton);
            el.appendChild(delbutton);
            el.appendChild(tableWrapper);
            el.appendChild(document.createElement("hr"));
    
            container.appendChild(el);
        });
    }
    
     

    function getSelectedDays() {
        var days = [];
        var checkboxes = document.querySelectorAll('#habit-days input[type="checkbox"]');
        checkboxes.forEach(box => {
            if (box.checked) days.push(box.id);
        });
        return days;
    }
    
    function clearDaySelection() {
        var checkboxes = document.querySelectorAll('#habit-days input[type="checkbox"]');
        checkboxes.forEach(box => box.checked = false);
    }
    
    function createtableforweek(selectedDays){
        var table = document.createElement('table');
        var daysOfWeek = ['Su', 'M', 'T', 'W', 'Th', 'F', 'S'];

        let tableContent = "<tr>";
        daysOfWeek.forEach(day => {
            if(day=="Su")   day='S';
            else if(day=="Th")    day='T';
            tableContent += `<td>${day}</td>`;
        });
        tableContent += "</tr><tr>";

        daysOfWeek.forEach((day, index) => {
            if (selectedDays.includes(day)) {
                tableContent += `<td style="background-color: var(--backgroundcolor);"></td>`;
            } else {
                tableContent += `<td style="background-color: #fff;"></td>`;
            }
        });

        tableContent += "</tr>";
        table.innerHTML = tableContent;

        return table.outerHTML;
    }

    function checkdayinlist(habitDays) {
        var todayIndex = new Date().getDay();
        var daysMap = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
        return habitDays.includes(daysMap[todayIndex]);
    }
    
    //timer functionality
    var timerbutton = document.getElementById('timer-container');
    var containermenu = document.getElementById('container-menu');
    var containerbody = document.getElementById('container');
    var timemenucontent = document.getElementById('time-content');
    timemenucontent.classList.add('hide-timer');

    let mode = 'timer';
    let interval = null;
    let running = false;
    let timeSet = 0;
    let elapsed = 0;

    var display = document.getElementById('display');
    var progressCircle = document.getElementById('progressCircle');
    var circleLength = 2 * Math.PI * 90;

    timerbutton.addEventListener('click', () => {
        containermenu.classList.toggle('hide');
        if(containermenu.classList.contains('hide')){
            displaytimerfunction();
        }
        else{
            hidetimerfunction();
        }
    });

    function displaytimerfunction(){
        timemenucontent.classList.remove('hide-timer');
        var timerbutton = document.getElementById('timerBtn');
        timerbutton.addEventListener('click', ()=>{
            timerbutton.classList.toggle('active');
            stopwatchbutton.classList.toggle('active');
            selectMode(timerbutton.classList.contains('active')?'timer':'stopwatch');
        })
        var stopwatchbutton = document.getElementById('stopwatchBtn');
        stopwatchbutton.addEventListener('click', ()=>{
            timerbutton.classList.toggle('active');
            stopwatchbutton.classList.toggle('active');
            selectMode(timerbutton.classList.contains('active')?'timer':'stopwatch');
        }) 
        
        document.getElementById('start').addEventListener('click', ()=>{
            start();
        });
        document.getElementById('stop').addEventListener('click', ()=>{
            stop();
        });
        document.getElementById('pause').addEventListener('click', ()=>{
            pause();
        });

        function selectMode(selected) {
            mode = selected;
            document.getElementById('timeInputs').classList.toggle('hidden', selected === 'stopwatch');
            stop(); 
        }

        function formatTime(seconds) {
            var h = String(Math.floor(seconds / 3600)).padStart(2, '0');
            var m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
            var s = String(seconds % 60).padStart(2, '0');
            return `${h}:${m}:${s}`;
        }

        function updateProgress() {
            let percent = 0;
            if (mode === 'timer') {
              percent = (elapsed / timeSet);
            } else {
              percent = (timeSet > 0) ? (elapsed / timeSet) : 0;
            }
            percent = Math.min(percent, 1);
            var offset = circleLength * (1 - percent);
            progressCircle.style.strokeDashoffset = offset;
        }

        function start() {
            if (running) return;
          
            if (mode === 'timer') {
              var h = parseInt(document.getElementById('hours').value || 0);
              var m = parseInt(document.getElementById('minutes').value || 0);
              var s = parseInt(document.getElementById('seconds').value || 0);
              timeSet = h * 3600 + m * 60 + s;
              if (timeSet <= 0) return;
              elapsed = 0;
            }
          
            running = true;
            interval = setInterval(() => {
              if (mode === 'timer') {
                elapsed++;
                if (elapsed <= timeSet) {
                  display.textContent = formatTime(timeSet - elapsed);
                  updateProgress();
                } else {
                  stop();
                  alert("Time's up!");
                }
              } else if (mode === 'stopwatch') {
                elapsed++;
                display.textContent = formatTime(elapsed);
                updateProgress();
              }
            }, 1000);
          
            updateProgress();
        }

        function pause() {
            if (!running) return;
            clearInterval(interval);
            running = false;
            window.alert("Paused");
        }

        function stop() {
            clearInterval(interval);
            running = false;
            elapsed = 0;
            if (mode === 'timer') {
              display.textContent = formatTime(timeSet);
            } else {
              display.textContent = '00:00:00';
            }
            progressCircle.style.strokeDashoffset = circleLength;
        }

        progressCircle.style.strokeDasharray = circleLength;
        progressCircle.style.strokeDashoffset = circleLength;
    }

    function hidetimerfunction(){
        timemenucontent.classList.add('hide-timer');
    }

    //todays task list
    var datetimeobjectlistener = document.getElementById('today-date-display');
    var todayhabitlistvarainer = document.getElementById('today-habit-list-container');

    datetimeobjectlistener.addEventListener('click', ()=>{
        if(todayhabitlistvarainer.classList.contains('hide-today')){
            todayhabitlistvarainer.classList.remove('hide-today');
            displaytodaytasks();
        }
        else{
            todayhabitlistvarainer.classList.add('hide-today');
        }
    })

    function displaytodaytasks() {
        const todayIndex = new Date().getDay();
        const daysMap = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
        const todayChar = daysMap[todayIndex];
    
        const habits = JSON.parse(localStorage.getItem("habits")) || [];
        const todayHabits = habits.filter(habit => habit.days.includes(todayChar));
    
        const list = document.getElementById('today-task-list');
        list.innerHTML = "";
    
        if (todayHabits.length === 0) {
            list.innerHTML = "<li>No tasks scheduled for today.</li>";
            return;
        }
    
        todayHabits.forEach(habit => {
            const li = document.createElement("li");
            li.textContent = `${habit.name} at ${habit.time}`;
            list.appendChild(li);
        });
    }
    
    
});