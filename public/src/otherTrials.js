const preload = {
  type: jsPsychPreload,
  auto_preload: true,
};

const freeRecallWoerter = {
  type: freeRecall,
  prompt:
    "Geben Sie die Wörter ein und bestätigen Sie Ihre Eingabe mit der Enter-Taste.",
  button_label: "Fertig",
};

// Cued recall trial - use timeline_variables for dynamic randomization
const cuedRecallTrial = {
  type: cuedRecall,
  prompt:
    "Vervollständigen sie das Wort und bestätigen sie ihre Eingabe mit der Enter-Taste.",
  button_label: "Fertig",
  string_to_display: function () {
    return jsPsych.randomization.repeat(wordList, 1);
  },
};

// Debriefing
const Debriefing = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `<div class="instructions">
    <p> Sie sind am Ende der Studie angelangt. <br>
Vielen Dank für Ihre Teilnahme, Sie unterstützen damit unsere Forschung
! </p>
<p> Wenden Sie sich nun bitte an die Versuchsleitung </p>
<p> Information an die Versuchsleitung: Daten speichern mit Pfeil-nach-unten Taste</p>
    </div>`,
  choices: ["ArrowDown"],
};
