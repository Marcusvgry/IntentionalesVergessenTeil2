const cont_text = "Weiter";
const prev_text = "zurück";

// PVT

const verbal_fluency_cue = "p";
const verbal_fluency_duration = 2 * 60000; // 2 min

let verbal_fluency_start;

const default_background = "#fff";

const pvt_time_limit = 3 * 60000; // Task duration: 3 min
let pvt_start;

// Counting how many (practice) trials were valid.
var pvt_lapse_count = 0;
// only collects early responses during stopwatch trials, not during ITI
var pvt_premature_stopwatch_count = 0;
// only collects responses during the ITI, not during the stopwatch trials
var pvt_premature_iti_count = 0;
var repeat_practice = false;
var pvt_practice_round_counter = 0;
var pvt_practice_trial_counter = 0;
let pvt_failed_practice;
let n_practice_trials = 3;
let practice_correct_threshold = 2;
let max_practice_rounds = 2;

// Minimum and maximum waiting interval (ITI when the stopwatch is not counting up).
var min_wait = 2000;
var max_wait = 10000;

let psqi_components = {
  PSQIDURAT: null,
  PSQIDISTB: null,
  PSQILATEN: null,
  PSQIDAYDYS: null,
  PSQIHSE: null,
  PSQISLPQUAL: null,
  PSQIMEDS: null,
};
