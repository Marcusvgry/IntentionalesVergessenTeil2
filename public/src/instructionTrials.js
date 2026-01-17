const CBC_VPNNummer = {
  type: jsPsychSurveyHtmlForm,
  preamble: ``,
  html: `
    <div class="survey-container">
    <p>Probandennummer</p>
    <input type="number" id="Probandennummer" name="Probandennummer" required class="input-field"/>

    <p> Heutiges Datum</p>
    <input type="date" id="Heutiges-Datum" name="Heutiges-Datum" required class="input-field"/>

    <p> Name der Messperson</p>
    <input type="text" id="Name-der-Messperson" name="Name-der-Messperson" required class="input-field"/>
  
</div>
    
`,
  on_finish: function (data) {
    const responses = data.response;
    settingsDone = true;
  },
};

const instructions = {
  type: jsPsychInstructions,
  pages: [
    `<div class="instructions">
        <br> Wir werden Sie nun bitten, sich an die Wörter zu erinnern, die Sie gestern Abend gelernt haben</div>`,
  ],
  show_clickable_nav: true,
  button_label_next: "Weiter",
  allow_backward: false,
};

const instructions2 = {
  type: jsPsychInstructions,
  pages: [
    `<div class="instructions">
        <p> Der Gedächtnistest wird so ähnlich ablaufen wie der Gedächtnistest, den Sie bereits im Übungsdurchgang gestern Abend absolviert haben. </p>
        <p>Im Folgenden werden Ihnen wieder eine Reihe von Wörtern präsentiert. Zunächst einmal bitten wir Sie, so viele der gelernten Wörter wie möglich, frei aus dem Gedächtnis abzurufen. </p>
        <p>WICHTIG: Anders als in den Übungsdurchgängen möchten wir Sie diesmal bitten <strong> ALLE </strong> Wörter einzugeben, an die Sie sich noch erinnern. Dieser Test ist also unabhängig davon, ob dem Wort in der Lernphase ein EEE oder ein VVV gefolgt war</p>
        <p> <strong> Bitte schreiben Sie also auch die Wörter auf, die Sie vergessen sollten. </strong></p>
         <p> Sobald Sie ein Wort eingegeben haben, können Sie Ihre Eingabe mit der Enter-Taste bestätigen. Sobald Ihnen keine Wörter mehr einfallen, können Sie mit dem Fertig-Button fortfahren. Sie müssen dann noch bestätigen, dass Sie wirklich fortfahren wollen sowie ein weiteres Mal auf den Fertig-Button klicken.</p>
        </div>`,
  ],
  show_clickable_nav: true,
  button_label_next: "Gedächtnistest beginnen",
  allow_backward: false,
};

const breakInstructions = {
  type: jsPsychInstructions,
  pages: [
    `<div class="instructions">
          Bitte wenden Sie sich an die Versuchsleitung
      </div>`,
  ],
  show_clickable_nav: true,
  button_label_next: "Weiter",
  allow_backward: false,
};

const Instructions_Teil3 = {
  type: jsPsychInstructions,
  pages: [
    `<div class="instructions">
        In der vorherigen Lernphase hatten wir Ihnen 32 Wörter präsentiert, die Sie erinnern oder vergessen sollten. <br>
        Wir zeigen Ihnen von diesen Wörtern jetzt jeweils die ersten beiden Buchstaben und möchten Sie bitten, 
        das Wort dann entsprechend zu vervollständigen. <br> Auch hier ist es nicht relevant, ob das Wort erinnert
         oder vergessen werden sollte. <br> Es gilt außerdem wieder, auch wenn sie das Wort eben schon korrekt erinnert haben, soll
         Sie es trotzdem noch einmal in diesem Test vervollständigen <br>
          <p> Ihre Eingabe bestätigen Sie bitte wieder mit der Enter-Taste. Beim letzten Word erscheint der Fertig-Button, mit dem Sie Fortfahren können. Das Bestätigen mit der Enter Taste funktioniert beim letzten Wort nicht mehr. Tippen Sie das Wort ein und klicken Sie dann auf den Fertig-Button, Ihre Eingabe wird gespeichert.</p></div>`,
  ],
  show_clickable_nav: true,
  button_label_next: "Vervollständigungsaufgabe beginnen",
  allow_backward: false,
};
