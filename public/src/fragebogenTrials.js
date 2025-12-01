// PVT -----------------------------------------------------------------------------------------------

var pvt_fixation = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `<span class = "fixation">00000</span>`,
  choices: " ",
  response_ends_trial: false,
  /* custom argument in html keyboard response plugin:
    log rts of alle key presses happening during fixation; allows us to record the number (and rts) 
    of all premature responses during the ITI */
  log_multiple: true,
  trial_duration: getRndInteger(min_wait, max_wait),
  on_finish: function (data) {
    data.trial = `${pvt_phase}_pvt_fixation`;
    // count all key presses during ITI as prematures
    pvt_premature_iti_count = pvt_premature_iti_count + data.rt.length;
  },
};

var pvt_stopwatch = {
  on_load: function () {
    startTimer();
  },
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `<div><span id="time" class="time">00000</span></div>`,
  trial_duration: 10000,
  choices: [" "],
  on_finish: function (data) {
    /* diff and elapsed time are not completely aligned, so diff will stop
        at 99998 or something. So if the participants did not make a response,
        we set the display to 10000.*/
    if (data.rt === null) diff = "10000";

    if (data.rt == null || data.rt > lapse_time) {
      pvt_lapse_count++;
      data.pvt_correct = 0;
    } else if (data.rt != null && data.rt < premature_time) {
      pvt_premature_stopwatch_count++;
      data.pvt_correct = 0;
    } else {
      data.pvt_correct = 1;
    }

    data.pvt_stopwatch = diff;
    clearInterval(timer_interval);

    data.trial = `${pvt_phase}_pvt_stopwatch`;
  },
};

// Leave the time when the stopwatch was stopped on the screen for a bit
var pvt_feedback = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: () => {
    let last_trial_data = jsPsych.data.getLastTrialData().values()[0];

    if (last_trial_data.rt === null) {
      diff = "10000";
    } else {
      diff = last_trial_data.pvt_stopwatch;
    }

    if (diff.length == 5) {
      disp = `<span style="color:  rgb(241, 26, 26);">${diff}</span>`;
    } else if (diff.length == 4) {
      disp = `<span style="color: rgb(104, 30, 30)">0</span><span style="color:  rgb(241, 26, 26);">${diff}</span>`;
    } else if (diff.length == 3) {
      disp = `<span style="color: rgb(104, 30, 30)">00</span><span style="color:  rgb(241, 26, 26)">${diff}</span>`;
    } else if (diff.length == 2) {
      disp = `<span style="color: rgb(104, 30, 30)">000</span><span style="color:  rgb(241, 26, 26)">${diff}</span>`;
    } else if (diff.length == 1) {
      disp = `<span style="color: rgb(104, 30, 30)">0000</span><span style="color:  rgb(241, 26, 26)">${diff}</span>`;
    }

    return `<div><span class="feedback">${disp}</span></div>`;
  },
  choices: "NO_KEYS",
  trial_duration: 1500,
  on_finish: function (data) {
    data.trial = `${pvt_phase}_pvt_feedback`;
  },
};

// INSTRUCTIONS -----------------------------------------------------------------------------------------

var pvt_start_screen = {
  type: jsPsychInstructions,
  pages: [pvt_start_p1, pvt_start_p2],
  show_clickable_nav: true,
  button_label_next: () => cont_text,
  allow_backward: false,

  data: { trial: "pvt_start_screen" },

  on_finish: (data) => {
    /* Turn background black for the PVT */
    disp = document.querySelector(".jspsych-display-element");
    disp.style.background = "#000000";

    /* Record that we are in the practice phase right now. */
    pvt_phase = "practice";

    data.view_history = JSON.stringify(data.view_history);
  },
};

/* Evaluate the practice phase - participants need to get at least 2 out of 3 trials correct. 
For the evaluation of the practice phase, responses during the ITI are ignored, but participants 
receive a hint that they should not press any buttons during the ITI. */
var evalPvtPractice = {
  on_load: () => {
    disp = document.querySelector(".jspsych-display-element");
    disp.style.background = default_background;
  },
  type: jsPsychHtmlButtonResponse,
  data: { trial: "practice_pvt_evaluation" },
  stimulus: function () {
    /* Number of correct trials: Number of trials - lapses - prematures */
    var feedback = pvt_feedback_text(
      n_practice_trials,
      pvt_lapse_count,
      pvt_premature_stopwatch_count,
      pvt_premature_iti_count
    );

    /* Add "well done" when they got at least practice_correct_threshold correct */
    if (
      n_practice_trials - pvt_lapse_count - pvt_premature_stopwatch_count >=
      practice_correct_threshold
    )
      feedback = feedback + pvt_praise;

    return feedback;
  },

  choices: () => [cont_text],

  on_finish: () => {
    disp = document.querySelector(".jspsych-display-element");
    disp.style.background = "#000000";

    pvt_practice_round_counter++;

    /* After n_practice_trials failed practice rounds */
    if (pvt_practice_round_counter >= max_practice_rounds) {
      repeat_practice = false;
      if (
        n_practice_trials - pvt_lapse_count - pvt_premature_stopwatch_count >=
        practice_correct_threshold
      ) {
        pvt_failed_practice = 0;
      } else {
        pvt_failed_practice = 1;
      }
      pvt_failed_practice = 1;
    } else if (
      n_practice_trials - pvt_lapse_count - pvt_premature_stopwatch_count >=
      practice_correct_threshold
    ) {
      repeat_practice = false;
      pvt_failed_practice = 0;
    } else {
      repeat_practice = true;
    }
  },
};

/* If participants failed the practice phase, they get one more try. */
wrongPracticePVT = {
  on_load: () => {
    disp = document.querySelector(".jspsych-display-element");
    disp.style.background = default_background;
  },
  type: jsPsychHtmlButtonResponse,
  data: { trial: "failed_practice_pvt" },
  stimulus: () => failed_pvt_feedback(),
  choices: () => [cont_text],
  on_finish: function () {
    disp = document.querySelector(".jspsych-display-element");
    disp.style.background = "#000000";
    // Reset counter for correct practice trials so practice can be repeated
    pvt_lapse_count = 0;
    pvt_premature_stopwatch_count = 0;
    pvt_premature_iti_count = 0;
  },
};

ifWrongPracticePVT = {
  timeline: [wrongPracticePVT],
  conditional_function: () => repeat_practice,
};

var pvt_main_instructions = {
  on_load: () => {
    // Reset counters after the practice phase
    pvt_lapse_count = 0;
    pvt_premature_stopwatch_count = 0;
    pvt_premature_iti_count = 0;
    disp = document.querySelector(".jspsych-display-element");
    disp.style.background = default_background;
  },
  type: jsPsychHtmlButtonResponse,
  stimulus: pvt_main_instructions_text(),
  choices: () => [cont_text],
  data: { trial: "pvt_instructions" },
  on_finish: () => {
    disp = document.querySelector(".jspsych-display-element");
    disp.style.background = "#000000";

    pvt_start = +new Date();

    pvt_phase = "main";
  },
};

var pvt_end_screen = {
  on_load: () => {
    disp = document.querySelector(".jspsych-display-element");
    disp.style.background = default_background;
  },

  type: jsPsychHtmlButtonResponse,
  stimulus: pvt_end_text,
  choices: () => [cont_text],
  data: { trial: "pvt_end_screen" },
  on_finish: (data) => {
    // Log PVT performance
    data.pvt_failed_practice = pvt_failed_practice;
    data.pvt_lapses = pvt_lapse_count;
    data.pvt_prematures_stopwatch = pvt_premature_stopwatch_count;
    data.pvt_prematures_iti = pvt_premature_iti_count;

    // Log number of PVT trial for convenience
    let pvt_main_trials = jsPsych.data.get().filter({
      trial: "main_pvt_stopwatch",
    });

    data.pvt_n_trials = pvt_main_trials.trials.length;
  },
};

// PVT TIMELINE -----------------------------------------------------------------------------------------

var pvt_practice_inner = {
  timeline: [pvt_fixation, pvt_stopwatch, pvt_feedback],
  on_timeline_finish: () => pvt_practice_trial_counter++,
};

var pvt_practice_inner_loop = {
  timeline: [pvt_practice_inner],
  loop_function: () => pvt_practice_trial_counter < n_practice_trials,
  on_timeline_finish: () => (pvt_practice_trial_counter = 0),
};

/* Conditional: If participants get the practice trials wrong, they need to do them again
Move on if participants failed the practice twice, but exclude them from data analysis later. */
var pvt_practice_outer = {
  timeline: [pvt_practice_inner_loop, evalPvtPractice, ifWrongPracticePVT],
  loop_function: () => repeat_practice,
};

// PVT main procedure
var pvt_core = {
  timeline: [pvt_fixation, pvt_stopwatch, pvt_feedback],
  loop_function: () => +new Date() - pvt_start < pvt_time_limit,
};

var stanfordSleepiness = {
  on_load: () => {
    // The last option is just for reference an cannot be clicked.
    // Here, we disable the radiobutton and make it grey.
    lastOption = document.getElementById(
      "jspsych-survey-multi-choice-response-0-7"
    );
    lastOption.disabled = true;
    lastOption.style.backgroundColor = "#9b9b9b";
  },
  type: jsPsychSurveyMultiChoice,
  questions: [
    {
      prompt: () => sss_prompt,
      name: "stanford_sleepiness",
      options: () => sssOptions,
      required: true,
    },
  ],
  button_label: () => cont_text,
  data: { trial: "stanford_sleepiness" },
  on_finish: function (data) {
    delete data.question_order;
    // Turn response into numeric score
    var sleepiness_string = data.response.stanford_sleepiness;
    var index = sssOptions.indexOf(sleepiness_string);
    // Convert to SSS score from 1 - 7
    data.response = index + 1;
  },
};

const stMarys = {
  type: jsPsychSurveyHtmlForm,
  preamble: () => st_marys_premable,
  html: () => st_marys_text,
  button_label: () => cont_text,
  data: { trial: "st_marys" },
  on_finish: (data) => {
    // Needs to be stringified, because arrays cannot be saved in a .csv file.
    data.response = JSON.stringify(data.response);
  },
};

// Hilfsfunktion: mm:ss formatieren
function formatMMSS(ms) {
  ms = Math.max(0, ms);
  const totalSec = Math.ceil(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

// Globale Referenz für das Interval, damit wir es aufräumen können
let vfTimerHandle = null;

var rwt_instructions = {
  type: jsPsychHtmlButtonResponse,
  stimulus: () => rwt_instructions_text(verbal_fluency_cue),
  choices: () => [cont_text],
  data: { trial: "rwt_instructions" },
  on_finish: () => (verbal_fluency_start = +new Date()),
};

var verbal_fluency = {
  on_load: () => {
    // Auto focus input field
    let inputField = document.getElementById("verbal-fluency");
    if (inputField) inputField.focus();

    // Countdown oben rechts initialisieren/anzeigen
    updateVFTimer();
    // Alle 200ms aktualisieren (flüssig, aber nicht zu häufig)
    if (vfTimerHandle) jsPsych.pluginAPI.clearInterval(vfTimerHandle);
    vfTimerHandle = jsPsych.pluginAPI.setInterval(updateVFTimer, 200);
  },
  type: jsPsychSurveyHtmlForm,

  // Sorgt dafür, dass der Trial rechtzeitig endet
  trial_duration: () =>
    verbal_fluency_duration - (Date.now() - verbal_fluency_start),

  html: () => rwt_trial_text(verbal_fluency_cue),
  button_label: "ok",
  data: { trial: "verbal_fluency" },

  on_finish: function (data) {
    // Clean response
    data.response = data.response["verbal-fluency"];
    data.verbal_fluency_cue = verbal_fluency_cue;

    // Timer-Interval bereinigen (Element darf bleiben, damit es im nächsten Trial weiter genutzt wird)
    if (vfTimerHandle) {
      jsPsych.pluginAPI.clearInterval(vfTimerHandle);
      vfTimerHandle = null;
    }
    // Letztes Update, falls knapp beendet wurde
    updateVFTimer();
  },
};

// Run until time is up
var verbal_fluency_loop = {
  timeline: [verbal_fluency],
  loop_function: () =>
    Date.now() - verbal_fluency_start < verbal_fluency_duration,
};

// Optional: Timer am Ende des gesamten Loops entfernen
const removeTimer = {
  type: jsPsychCallFunction,
  func: () => {
    const el = document.getElementById("vf-timer");
    if (el) el.remove();
  },
};
// Beispiel: erst dein Loop, dann das Entfernen
// timeline: [verbal_fluency_loop, removeTimer]
