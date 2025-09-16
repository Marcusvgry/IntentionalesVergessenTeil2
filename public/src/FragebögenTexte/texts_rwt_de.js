const invalid_examples = {
  p: ["Palast-Palasttor-Palasthof-Palastdame", "Peter-Pia-Potsdam-Portugal"],
  m: [
    "Morgen-Morgenstunde-Morgenritual-Morgenstern",
    "Markus-Maja-Madrid-Marokko",
  ],
};

const rwt_instructions_text = (verbal_fluency_cue) => {
  if (["p", "m"].includes(verbal_fluency_cue)) {
    verbal_fluency_idx = verbal_fluency_cue;
  } else {
    /* default to p examples when unknown letter is used
        (alternatively, define your own examples in the dictionary above) */
    verbal_fluency_idx = "p";
  }

  return `<div class="instructions">
    Bei dieser Aufgabe sollst du innerhalb einer bestimmten Zeit möglichst viele verschiedene Wörter aufschreiben, die 
    ${'mit dem Buchstaben <b>"' + verbal_fluency_cue + '"</b> beginnen.'}
    
    Dabei sollstest du verschiedene Regeln beachten:<br>
    Du darfst nur <b>Nomen</b> ("Hauptwörter") aufschreiben, die in einer deutschen Zeitung oder in einem deutschen Buch 
    verwendet werden könnten. Dabei solltest du keine Wörter mehrfach aufschreiben.<br>
    Die Wörter dürfen aber auch nicht mit dem gleichen Wortstamm beginnen, also <b>${
      invalid_examples[verbal_fluency_cue][0]
    }</b> 
    gelten nur als ein Wort.<br>
    Weiterhin darfst du auch keine Eigennamen aufschreiben, also <b>${
      invalid_examples[verbal_fluency_cue][1]
    }</b> gelten nicht.<br>
    Bitte tippe jedes Wort einzeln ein, und bestätige deine Eingabe durch das Drücken der Enter-Taste oder den "ok"-Button 
    auf der Seite.<br><br>

    Bitte versuche, möglichst schnell viele verschiedene Wörter mit dem Anfangsbuchstaben <b>"${verbal_fluency_cue}"</b> aufzuschreiben.
</div>`;
};

const rwt_trial_text = (verbal_fluency_cue) => {
  return `<div class="instructions_c">
        Tippe ein Wort mit dem Anfangsbuchstaben ${verbal_fluency_cue} ein:
        <br>
        
        <span id="input-warning" style="font-size:14px; visibility: hidden">Bitte verwende nur Buchstaben!</span><br>   
        <input type="text" required="required" id="verbal-fluency" name="verbal-fluency" 
        pattern="[a-zA-ZäöüÄÖÜß]+" 
        oninvalid="document.getElementById('input-warning').style.visibility = 'visible';">
    </div>`;
};
