// rwt_german.js

// FUNCTIONS ---------------------------------------------------------------------------------------------------------------------------------

// Global variables that are defined here, and later used in the timer functions
var timer_interval;
var diff;

// Randomly define experimentConfig Variables:
var experimentConfig = {
  ProfessionsorHobbies: "",
  PorM: "",
};

// Function to randomly select an item from an array
function randomSelect(array) {
  return array[Math.floor(Math.random() * array.length)];
}

const instructionsWidth = 900;

// Set up the configuration ----------------------------------- this has to be changed in loading in the data
function setupExperimentConfig() {
  const professionsorHobbiesOptions = ["Hobbies", "Berufe"];
  const porMOptions = ["P", "M"];
  experimentConfig.ProfessionsorHobbies = randomSelect(
    professionsorHobbiesOptions
  );
  experimentConfig.PorM = randomSelect(porMOptions);
}

// Call the setup function to initialize the configuration
setupExperimentConfig();

// Timer function - stopwatch counting down
function startCountdown(duration, display) {
  var start = Date.now();
  var diff;

  // Interval in a variable so it can be reset
  timer_interval = setInterval(timer, 1000); // now set the value of the timer_interval variable, which also starts the timer

  function timer() {
    // get the number of seconds that have elapsed since
    // startTimer() was called
    diff = ((Date.now() - start) / 1000) | 0;
    diff = duration - diff;

    // does the same job as parseInt truncates the float
    minutes = (diff / 60) | 0;
    seconds = diff % 60 | 0;

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    display.innerHTML = minutes + ":" + seconds;
  }
  // we don't want to wait a full second before the timer starts
  minutes = timer();
}

// CUSTOM PLUGIN -----------------------------------------------------------------------------------------------------------------------------------------------
var TextInputTrial = (function (jsPsych) {
  "use strict";

  const info = {
    name: "text_input_trial",
    parameters: {
      preamble: {
        type: jsPsych.ParameterType.FUNCTION,
        pretty_name: "Preamble",
        default: undefined,
        description:
          "Function that returns HTML formatted string to display at the top of the page above the text input.",
      },
      trial_duration: {
        type: jsPsych.ParameterType.INT,
        pretty_name: "Trial duration",
        default: null,
        description: "The maximum duration to wait for the subject to finish.",
      },
    },
  };

  class TextInputTrial {
    constructor(jsPsych) {
      this.jsPsych = jsPsych;
    }
    trial(display_element, trial) {
      // display preamble
      let preamble =
        typeof trial.preamble === "function"
          ? trial.preamble()
          : trial.preamble;
      if (preamble !== null) {
        display_element.innerHTML =
          '<div id="jspsych-text-input-preamble" class="jspsych-text-input-preamble">' +
          preamble +
          "</div>";
      }

      // add text input and a div to display entered words
      display_element.innerHTML +=
        '<input type="text" id="wordInput" name="wordInput" placeholder="Gib hier das Wort ein" style="font-size: 20px; width: 300px;"><br>' +
        '<div id="enteredWords" style="margin-top: 20px;"></div>';

      let inputField = document.getElementById("wordInput");
      let displayWords = document.getElementById("enteredWords");
      let words = [];

      inputField.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
          e.preventDefault();
          words.push(inputField.value); // add the entered word to the array
          // Create a new div for the entered word and style it as a bubble
          var wordBubble = document.createElement("div");
          wordBubble.textContent = inputField.value;
          wordBubble.style.display = "inline-block";
          wordBubble.style.margin = "5px";
          wordBubble.style.padding = "10px";
          wordBubble.style.backgroundColor = "#ffffff"; // white background
          wordBubble.style.borderRadius = "15px"; // rounded corners to make it look like a bubble
          wordBubble.style.boxShadow = "0px 1px 2px rgba(0, 0, 0, 0.1)"; // subtle shadow for depth
          wordBubble.style.color = "#000000"; // text color
          displayWords.appendChild(wordBubble); // append the bubble to the display container
          inputField.value = ""; // clear input field
        }
      });

      var startTime = performance.now();

      // end trial if trial_duration is set
      if (trial.trial_duration !== null) {
        this.jsPsych.pluginAPI.setTimeout(() => {
          end_trial();
        }, trial.trial_duration);
      }

      const end_trial = () => {
        display_element.innerHTML = ""; // clear display

        let trialData =
          typeof trial.data === "function" ? trial.data() : trial.data;
        var trial_data = {
          typed_words: JSON.stringify(words),
          rt: performance.now() - startTime,
          ...trialData,
        };

        this.jsPsych.finishTrial(trial_data);
      };
    }
  }

  TextInputTrial.info = info;

  return TextInputTrial;
})(jsPsychModule);

// TRIALS -------------------------------------------------------------------------------------------------------------------------------------------------------

var rwtIntro = {
  on_load: () => {
    nFlankersCorrect = 0;
  },
  type: jsPsychHtmlButtonResponse,
  data: { trial: "instructions_rwt" },
  stimulus: `
  <div id="parchment">
  <div style="max-width:${instructionsWidth}px; align-items:center;">
      <div class="instructions" style="padding-left: 40px;">
        In diesem abschließenden Experiment sollen Sie innerhalb eines Zeitfensters 
        von <b>zwei Minuten</b> so viele Wörter wie möglich tippen. 
        Diese Wörter sollen mit einem bestimmten Buchstaben beginnen.<br><br>
        
        <b>Dabei sollen Sie verschiedene Regeln beachten:</b><br>
        <li>Sie sollen nur Wörter aufschreiben, die in einer deutschen Zeitung 
        oder in einem deutschen Buch verwendet werden könnten.</li>
        <li>Die Wörter dürfen nur Nomen sein.</li>
        <li>Dabei sollen Sie keine Wörter mehrfach aufschreiben.</li>
        <li>Die Wörter dürfen aber auch nicht mit dem gleichen 
        Wortstamm beginnen, also „Palast-Palasttor-Palasthof-Palastdame“ 
        gelten nur als ein Wort.</li>
        <li>Weiterhin dürfen Sie auch keine Eigennamen aufschreiben, 
        also „Peter-Pia-Potsdam-Portugal“ gelten nicht.</li><br><br>
        Bitte versuchen Sie, möglichst schnell, 
        viele verschiedene Wörter mit dem Anfangsbuchstaben aufzuschreiben.
      </div>
    </div>
    </div><br>
  `,
  choices: ["weiter"],
  button_html: function (choice) {
    return '<button class="jspsych-btn" tabindex="-1">' + choice + "</button>";
  },
  on_finish: () => {},
};

var rwtInstructions = {
  type: jsPsychHtmlButtonResponse,
  stimulus:
    "<br><br>" +
    `<div class="instructions" style="text-align: center; margin: auto; display: block; max-width: ${instructionsWidth}px;">` +
    'In diesem Experiment wirst du aufgefordert, innerhalb von 2 Minuten so viele Wörter wie möglich einzugeben. <br>Denke daran, nach dem Eingeben eines Wortes im Textfeld die Eingabetaste zu drücken. <br>Drücke "weiter", um das Experiment zu starten.' +
    "<br><br><b>Viel Glück!<b>" +
    "</div><br>",
  choices: ["weiter"],
  data: { trial: "rwtinstructions" },
};

var getReady = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `<span style='font-size:60px'>Machen Sie sich bereit</span><br>
  <span style='font-size:30px'>Bitte antworten sie so schnell und so genau wie möglich.</span>`,
  data: { trial: `get_ready` },
  choices: "NO_KEYS",
  trial_duration: 2000,
};

var rwtPorM = {
  on_load: function () {
    var display = document.querySelector("#matrix-time");
    startCountdown(1 * 120, display); // 1 * 120
  },
  trial_duration: 2 * 60000, // 2 * 60000
  preamble: function () {
    return `
    <div align="center"><span style="font-size:50px" id="matrix-time">2:00</span></div>
    <br><br>
    <b>Geben Sie so viele Wörter ein, die mit dem Buchstaben <span style="color: blue;">'${experimentConfig.PorM}'</span> beginnen, wie Sie können.<br> Drücken Sie nach jedem Wort die Eingabetaste.</b><br><br><br>`;
  },
  type: TextInputTrial,
  data: function () {
    return {
      trial: "rwtPorM",
      PorM: experimentConfig.PorM,
    };
  },
  on_finish: function (data) {
    var wordsArray = JSON.parse(data.typed_words);
  },
};

var rwtInstructions2 = {
  type: jsPsychHtmlButtonResponse,
  stimulus: `
     <div id="parchment">
  <div style="max-width:${instructionsWidth}px; align-items:center;">
      <div class="instructions" style="padding-left: 40px;">
    <p> Nun folgt der zweite Teil dieses Experiments. </p>
    <p> Auch in diesem Abschnitt sollen Sie innerhalb eines Zeitfensters von zwei Minuten so viele passende Wörter wie möglich eingeben.</p>

    <p><strong>Dabei gelten folgende Regeln:</strong></p>
    <ul>
    <li>Die Wörter sollen in der deutschen Sprache gebräuchlich sein.</li>
    <li>Die Wörter müssen zur vorgegebenen Kategorie passen.</li>
    <li>Jedes Wort darf nur einmal eingegeben werden.</li>
    <li>Verwenden Sie bitte keine Eigennamen.</li>
    <li>Die Wörter sollten nur Nomen sein.</li>
    </ul>
    <br>
    <p>Bitte geben Sie die Wörter einzeln ein und drücken Sie nach jedem Wort die Eingabetaste.</p>

    <p>Die genaue Aufgabenstellung wird Ihnen im nächsten Schritt angezeigt.</p>
    </div><br>`,
  choices: ["weiter"],
  data: { trial: "rwtinstructions" },
};

var rwtProfessionsorHobbies = {
  on_load: function () {
    var display = document.querySelector("#matrix-time");
    startCountdown(1 * 120, display); // 1 * 120
  },
  trial_duration: 2 * 60000, // 2 * 60000
  preamble: function () {
    return `
    <div align="center"><span style="font-size:50px" id="matrix-time">2:00</span></div>
    <br><br>
    <b>Geben Sie so viele <span style="color: blue;">${experimentConfig.ProfessionsorHobbies}</span> ein, wie Sie können.<br> Drücken Sie nach jedem Wort die Eingabetaste.</b>
    <br>`;
  },
  type: TextInputTrial,
  data: {
    trial: "rwtProfessionsorHobbies",
    professionsorhobbies: experimentConfig.ProfessionsorHobbies,
  },
  on_finish: function (data) {
    var wordsArray = JSON.parse(data.typed_words);
  },
};
