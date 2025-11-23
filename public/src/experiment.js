var timeline = [];

const jsPsych = initJsPsych({
  on_finish: function () {
    const responses = jsPsych.data
      .get()
      .filter({ trial_type: "survey-html-form" })
      .values()[0].response;
    const vpnNumber = responses["VPN-Nummer"];

    const filename = `IntentionalesVergessen2_VP${vpnNumber}.csv`;

    jsPsych.data.get().localSave("csv", filename);
  },
});

var freeRecallList = [];

// Preload

function createTimeline() {
  timeline.push(preload);
  timeline.push(CBC_VPNNummer);
  /*
  timeline.push(stMarys);
  timeline.push(breakInstructions);
  timeline.push(instructions);
  timeline.push(instructions2);
  timeline.push(freeRecallWoerter);
  timeline.push(Instructions_Teil3);
  timeline.push(cuedRecallTrial);
  timeline.push(stanfordSleepiness);
  timeline.push(
    pvt_start_screen,
    pvt_practice_outer,
    pvt_main_instructions,
    pvt_core,
    pvt_end_screen
  );
  */
  timeline.push(rwt_instructions, verbal_fluency_loop);
  timeline.push(Debriefing);
}
function startExperiment() {
  createTimeline();
  jsPsych.run(timeline);
}
