// Initialisierung von jsPsych und der Timeline
var timeline = [];
const jsPsych = initJsPsych({
  on_finish: function () {
    // VPN-Nummer speichern
    const responses = jsPsych.data
      .get()
      .filter({ trial_type: "survey-html-form" })
      .values()[0].response;
    const vpnNumber = responses["VPN-Nummer"];

    // Dateiname erstellen
    const filename = `IntentionalesVergessen2_VP${vpnNumber}.csv`;

    // Daten als CSV speichern
    jsPsych.data.get().localSave("csv", filename);
  },
});

function startExperiment() {
  jsPsych.run(timeline);
}

// Variablen
var freeRecallList = [];

// Preload
var preload = {
  type: jsPsychPreload,
  auto_preload: true,
};

var Bedingung_1 = [
  "Auto",
  "Baden",
  "Berg",
  "Blut",
  "Boden",
  "Brett",
  "Dampf",
  "Ecke",
  "Erde",
  "Gift",
  "Grab",
  "Haut",
  "Hose",
  "Seil",
  "Tier",
  "Vieh",
];

var Bedingung_2 = [
  "Allee",
  "Apfel",
  "Buch",
  "Wald",
  "Eisen",
  "Fluss",
  "Geld",
  "Gold",
  "Heer",
  "Kalk",
  "Kind",
  "Luft",
  "Meer",
  "Moor",
  "Ofen",
  "Pelz",
];

var Stimuli = [];
var cuedRecallWords = Bedingung_1.concat(Bedingung_2);

timeline.push({
  type: jsPsychFullscreen,
  fullscreen_mode: true,
});

// Erste Instruktionen
const CBC_VPNNummer = {
  type: jsPsychSurveyHtmlForm,
  preamble: ``,
  html: `
        <div class="survey-container">
    <p>Versuchspersonennummer</p>
    <input type="number" id="VPN-Nummer" name="VPN-Nummer" required class="input-field"/>

    <p>Bedingung</p>
    <div class="condition-radio">
  <input type="radio" id="Bedingung1" name="Bedingung" value="1" required class="condition-radio-input"/>
  <label for="Bedingung1" class="condition-label">1</label>

  <input type="radio" id="Bedingung2" name="Bedingung" value="2" required class="condition-radio-input"/>
  <label for="Bedingung2" class="condition-label">2</label>
</div>


  <!-- Reaktivierter Ton erinnern -->
  <p>Reaktivierter Ton erinnern</p>
  <select name="ReaktivierterTon" id="ReaktivierterTon" required class="condition-select">
    <option value=""  –</option>
    <option value="Klavier (Bed. 1)">Klavier (Bed. 1)</option>
    <option value="Saxophon (Bed. 1)">Saxophon (Bed. 1)</option>
    <option value="Gitarre (Bed. 2)">Gitarre (Bed. 2)</option>
    <option value="Violine (Bed. 2)">Violine (Bed. 2)</option>
  </select>

  <!-- Reaktivierter Ton vergessen -->
  <p>Reaktivierter Ton vergessen</p>
  <select name="ReaktivierterTon2" id="ReaktivierterTon2" required class="condition-select">
    <option value=""  –</option>
    <option value="Klavier (Bed. 2)">Klavier (Bed. 2)</option>
    <option value="Saxophon (Bed. 2)">Saxophon (Bed. 2)</option>
    <option value="Gitarre (Bed. 1)">Gitarre (Bed. 1)</option>
    <option value="Violine (Bed. 1)">Violine (Bed. 1)</option>
  </select>
</div>
    
`,
};

// Weitere Phasen und Instruktionen
const instructions = {
  type: jsPsychInstructions,
  pages: [
    `<div class="instructions">
        Guten Morgen! Wir hoffen, Sie haben gut geschlafen. <br> Wir werden Sie nun bitten, sich an die Wörter zu erinnern, die Sie beim ersten Termin gelernt haben</div>`,
  ],
  show_clickable_nav: true,
  button_label_next: "Weiter",
  allow_backward: false,
};

const instructions2 = {
  type: jsPsychInstructions,
  pages: [
    `<div class="instructions">
        <p> Der Gedächtnistest wird so ähnlich ablaufen wie der Gedächtnistest, den Sie bereits im Übungsdurchgang am ersten Termin absolviert haben. </p>
        <p>Im Folgenden werden Ihnen wieder eine Reihe von Wörtern präsentiert. Zunächst einmal bitten wir Sie, alle Wörter die Sie so viele der gelernten Wörter, frei aus dem Gedächtnis abzurufen. </p>
        <p>WICHTIG: Anders als in den Übungsdurchgängen möchten wir Sie diesmal bitten ALLE Wörter einzugeben, an die Sie sich noch erinnern. Dieser Test ist also unabhängig davon, ob dem Wort in der Lernphase ein EEE oder ein VVV gefolgt war</p>
        </div>`,
  ],
  show_clickable_nav: true,
  button_label_next: "Gedächtnistest beginnen",
  allow_backward: false,
};

const freeRecallWoerter = {
  type: freeRecall,
  prompt:
    "Geben Sie die Wörter ein und bestätigen Sie Ihre Eingabe mit der Enter-Taste.",
  button_label: "Fertig",
};

const Instructions_Teil3 = {
  type: jsPsychInstructions,
  pages: [
    `<div class="instructions">
        In der vorherigen Lernphase hatten wir Ihnen 32 Wörter präsentiert, die Sie erinnern oder vergessen sollten. <br>
        Wir zeigen Ihnen von diesen Wörtern jetzt jeweils die ersten beiden Buchstaben und möchten Sie bitten, 
        das Wort dann entsprechend zu vervollständigen. <br> Auch hier ist es wiederum nicht relevant ob das Wort erinnert
         oder vergessen werden sollte. <br> Es gilt wiederum, auch wenn sie das Wort eben schon korrekt erinnert haben, sollen 
         Sie es trotzdem noch einmal in diesem Test vervollständigen</div>`,
  ],
  show_clickable_nav: true,
  button_label_next: "Vervollständigungsaufgabe beginnen",
  allow_backward: false,
};

// Cued-Recall Phase
const cuedRecallTrial = {
  type: cuedRecall,
  prompt:
    "Vervollständigen sie das Wort und bestätigen sie ihre Eingabe mit der Enter-Taste.",
  button_label: "Fertig",
  string_to_display: [
    "Haut",
    "Heer",
    "Dampf",
    "Allee",
    "Baden",
    "Meer",
    "Blut",
    "Buch",
    "Pelz",
    "Ecke",
    "Berg",
    "Vieh",
    "Grab",
    "Kalk",
    "Gift",
    "Kind",
    "Wald",
    "Seil",
    "Ofen",
    "Geld",
    "Erde",
    "Auto",
    "Tier",
    "Gold",
    "Apfel",
    "Boden",
    "Luft",
    "Brett",
    "Hose",
    "Eisen",
    "Fluss",
    "Moor",
  ],
};

const survey_trial = {
  type: jsPsychSurvey,
  survey_json: {
    showQuestionNumbers: false,
    title: "Nachbefragung", // Haupttitel
    completeText: "Weiter",
    pageNextText: "Weiter",
    pagePrevText: "Zurück",
    pages: [
      {
        name: "page1",
        description: "",
        elements: [
          {
            type: "radiogroup",
            title: `Zum Abschluss möchten wir Sie bitten, uns noch kurz mitzuteilen, ob Sie bei 
          der Bearbeitung der Aufgabe irgendwelche Strategien eingesetzt haben, um die mit "VVV" gekennzeichneten Wörter zu vergessen.`,
            choices: ["Ja", "Nein"],
            colCount: 0,
            name: "Strategien",
            isRequired: true,
          },
          {
            type: "comment",
            name: "AndereStrategien",
            visibleIf: "{Strategien} = 'Ja'",
            title:
              "Bitte beschreiben Sie die Strategie knapp in Ihren eigenen Worten.",
            isRequired: true,
            rows: 5,
            cols: 70,
          },
        ],
      },
      {
        name: "page2",
        description:
          "Wir möchten Sie zum Abschluss noch bitten, einige demographische Daten anzugeben:",
        elements: [
          {
            type: "text",
            title: "Wie alt sind Sie?",
            placeholder: "Alter",
            name: "Alter",
            size: 30,
            isRequired: true,
            inputType: "number",
            min: 1,
            max: 100,
          },
          {
            type: "radiogroup",
            title: "Mit welcher Geschlechtsidentität identifizieren Sie sich?",
            choices: [
              "Männlich",
              "Weiblich",
              "Nicht-binär",
              "Andere",
              "keine Angabe",
            ],
            colCount: 0,
            name: "Geschlechtsidentität",
            isRequired: true,
          },
          {
            type: "text",
            name: "AndereGeschlechtsidentität",
            visibleIf: "{Geschlechtsidentität} = 'Andere'",
            title: "Bitte geben Sie Ihre Geschlechtsidentität an:",
            isRequired: true,
          },
          {
            type: "text",
            title: "Was ist ihr Studienfach?",
            name: "Studienfach",
            placeholder: "Studienfach",
            isRequired: true,
          },
        ],
      },
    ],
  },
};

// Debriefing
const Debriefing = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `<div class="instructions">
    Sie sind am Ende der Studie angelangt. <br>
Vielen Dank für Ihre Teilnahme, Sie unterstützen damit unsere Forschung
!
    </div>`,
  choices: ["ArrowDown"],
};

// Timeline
timeline.push(preload);
timeline.push(CBC_VPNNummer);
timeline.push(instructions);
timeline.push(instructions2);
timeline.push(freeRecallWoerter);
timeline.push(Instructions_Teil3);
timeline.push(cuedRecallTrial);
timeline.push(survey_trial);
timeline.push(Debriefing);
