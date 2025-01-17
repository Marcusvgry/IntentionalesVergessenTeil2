// Initialisierung von jsPsych und der Timeline
var timeline = [];
const jsPsych = initJsPsych({
    on_finish: function () {
        // VPN-Nummer speichern
        const responses = jsPsych.data.get().filter({trial_type: 'survey-html-form'}).values()[0].response;
        const vpnNumber = responses["VPN-Nummer"];

        // Dateiname erstellen
        const filename = `IntentionalesVergessen_VP${vpnNumber}.csv`;

        // Daten als CSV speichern
        jsPsych.data.get().localSave("csv", filename);
    
        jsPsych.data.displayData();
    }
});

function startExperiment() {
    jsPsych.run(timeline);
}

// Variablen
var freeRecallList = [];

// Preload
var preload = {
    type: jsPsychPreload,
    auto_preload: true
};

// Wörterlisten
var Bedingung_1 = [
    '1aaa', '2bbb', '3ccc', '4ddd',
    '5eee', '6fff', '7ggg', '8hhh',
    '9iii', '10jjj', '11kkk', '12lll'
];

var Bedingung_2 = [
    '13mmm', '14nnn', '15ooo', '16ppp',
    '17qqq', '18rrr', '19sss', '20ttt',
    '21uuu', '22vvv', '23www', '24xxx'
];

var Stimuli = [];
var filteredStimuli = [];
var cuedRecallWords = [];

timeline.push({
    type: jsPsychFullscreen,
    fullscreen_mode: true
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
        <label for="Bedingung1" class="condition-label">1</label>
        <input type="radio" id="Bedingung1" name="Bedingung" value="1" required class="condition-radio-input"/>
        <label for="Bedingung2" class="condition-label">2</label>
        <input type="radio" id="Bedingung2" name="Bedingung" value="2" required class="condition-radio-input"/>
    </div>
    
</div>
`,
    on_finish: function (data) {
        const responses = data.response;
        selectedCondition = responses["Bedingung"];
        if (selectedCondition === "1") {
            // Bedingung 1
            for (let i in Bedingung_1) {
                Stimuli.push({ Wort: Bedingung_1[i], Anweisung: "*eee*" });
            }
            for (let i in Bedingung_2) {
                Stimuli.push({ Wort: Bedingung_2[i], Anweisung: "*vvv*" });
            }
        } else if (selectedCondition === "2") {
            // Bedingung 2
            for (let i in Bedingung_1) {
                Stimuli.push({ Wort: Bedingung_1[i], Anweisung: "*vvv*" });
            }
            for (let i in Bedingung_2) {
                Stimuli.push({ Wort: Bedingung_2[i], Anweisung: "*eee*" });
            }
        }

        // Filtern der Wörter, die erinnert werden müssen
        filteredStimuli = Stimuli.filter(stimulus => stimulus.Anweisung === "*eee*");

        for (let stimulus of filteredStimuli) {
            cuedRecallWords.push(stimulus.Wort);
        }
    }
};

// Weitere Phasen und Instruktionen
const instructions = {
    type: jsPsychInstructions,
    pages: [
        `<div class="instructions">
        Instruktionen 1 </div>`,
    ],
    show_clickable_nav: true,
    button_label_next: "Beginnen",
    allow_backward: false,
};

const extinction_phase = {
    timeline: [
        {
            type: jsPsychHtmlKeyboardResponse,
            stimulus: '<div style="font-size: 60px;">+</div>',
            choices: "NO_KEYS",
            trial_duration: 500
        },
        {
            type: jsPsychHtmlKeyboardResponse,
            stimulus: jsPsych.timelineVariable('Wort'),
            choices: "NO_KEYS",
            trial_duration: 1000,
            stimulus_duration: 1000,
            css_classes: ['stimulus-large-text']  // CSS-Klasse hier angewendet
        },
        {
            type: jsPsychHtmlKeyboardResponse,
            stimulus: jsPsych.timelineVariable('Anweisung'),
            choices: "NO_KEYS",
            trial_duration: 800,
            css_classes: ['stimulus-large-text']  // CSS-Klasse hier angewendet
        },
    ],
    timeline_variables: Stimuli,
    randomize_order: true
};

const Instructions_Teil2 = {
    type: jsPsychInstructions,
    pages: [
        `<div class="instructions">
        Instruktionen Free-Recall </div>`,
    ],
    show_clickable_nav: true,
    button_label_next: "Beginnen",
    allow_backward: false,
};

const freeRecallWoerter = {
    type: freeRecall,
    prompt: "Instruktionen Free-Recall.",
    button_label: "Fertig",
};

const Instructions_Teil3 = {
    type: jsPsychInstructions,
    pages: [
        `<div class="instructions">
        Instruktionen Cued-Recall </div>`,
    ],
    show_clickable_nav: true,
    button_label_next: "Beginnen",
    allow_backward: false,
};

// Cued-Recall Phase
const cuedRecallTrial = {
    type: cuedRecall,
    prompt: "Instruktionen Cued-Recall.",
    button_label: "Fertig",
    string_to_display: cuedRecallWords,
};

// Debriefing
const Debriefing = {
    type: jsPsychInstructions,
    pages: [
        `<div class="instructions">
        Debriefing </div>`,
    ],
    show_clickable_nav: true,
    button_label_next: "Beenden",
    allow_backward: false,
};

// Timeline
timeline.push(preload);
timeline.push(CBC_VPNNummer);
timeline.push(instructions);
timeline.push(extinction_phase);
timeline.push(Instructions_Teil2);
timeline.push(freeRecallWoerter);
timeline.push(Instructions_Teil3);
timeline.push(cuedRecallTrial);
timeline.push(Debriefing);
