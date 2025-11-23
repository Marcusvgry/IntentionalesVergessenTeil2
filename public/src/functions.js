function checkOther(
  val,
  comparison,
  div_id = null,
  text_ids = null,
  select_ids = null
) {
  // Normalize to arrays
  if (text_ids && !Array.isArray(text_ids)) text_ids = [text_ids];
  if (select_ids && !Array.isArray(select_ids)) select_ids = [select_ids];

  const showExtraFields = comparison.includes(val);

  // Show/hide additional div if applicable
  if (div_id) {
    const div = document.getElementById(div_id);
    if (div) {
      div.style.display = showExtraFields ? "block" : "none";

      // If hiding: clear all inputs and selects inside the div
      if (!showExtraFields) {
        const elements = div.querySelectorAll("input, select, textarea");
        elements.forEach((el) => {
          el.value = "";
          el.removeAttribute("required");
        });
      }
    }
  }

  // Handle text fields
  if (text_ids) {
    text_ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        el.style.display = showExtraFields ? "block" : "none";
        if (showExtraFields) {
          el.setAttribute("required", "required");
        } else {
          el.removeAttribute("required");
          el.value = "";
        }
      }
    });
  }

  // Handle select fields
  if (select_ids) {
    select_ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        if (showExtraFields) {
          el.setAttribute("required", "required");
        } else {
          el.removeAttribute("required");
          el.value = "";
        }
      }
    });
  }
}

// FUNCTIONS --------------------------------------------------------------------------------------------

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// PVT timer function
function startTimer() {
  var start = Date.now();

  // Interval in a variable so it can be reset
  timer_interval = setInterval(timer, 1); // now set the value of the timer_interval variable, which also starts the timer

  function timer() {
    // get the number of seconds that have elapsed since
    // startTimer() was called
    diff = (Date.now() - start) | 0;
    diff = String(diff);

    // add 00s if necessary
    if (diff.length == 4) {
      disp = `<span style="color: rgb(104, 30, 30)">0</span><span style="color:  rgb(241, 26, 26);">${diff}</span>`;
    } else if (diff.length == 3) {
      disp = `<span style="color: rgb(104, 30, 30)">00</span><span style="color:  rgb(241, 26, 26)">${diff}</span>`;
    } else if (diff.length == 2) {
      disp = `<span style="color: rgb(104, 30, 30)">000</span><span style="color:  rgb(241, 26, 26)">${diff}</span>`;
    } else if (diff.length == 1) {
      disp = `<span style="color: rgb(104, 30, 30)">0000</span><span style="color:  rgb(241, 26, 26)">${diff}</span>`;
    }

    display = document.querySelector("#time");
    display.innerHTML = disp;
  }
  // we don't want to wait a full second before the timer starts
  minutes = timer();
}

/**
 * @returns {trial} Return a cued recall trial with all 32 words in random order
 */
function createCuedRecallTrial() {
  var allWords = jsPsych.randomization.repeat(wordList, 1);
  return {
    type: cuedRecall,
    prompt:
      "Vervollständigen sie das Wort und bestätigen sie ihre Eingabe mit der Enter-Taste.",
    button_label: "Fertig",
    string_to_display: allWords,
  };
}

function ensureTimerEl() {
  let el = document.getElementById("vf-timer");
  if (!el) {
    el = document.createElement("div");
    el.id = "vf-timer";
    el.setAttribute("aria-live", "polite");
    // schlichtes Styling oben rechts
    el.style.position = "fixed";
    el.style.top = "12px";
    el.style.right = "12px";
    el.style.padding = "6px 10px";
    el.style.borderRadius = "9999px";
    el.style.background = "rgba(0,0,0,0.75)";
    el.style.color = "#fff";
    el.style.fontFamily = "system-ui, sans-serif";
    el.style.fontWeight = "600";
    el.style.zIndex = "9999";
    document.body.appendChild(el);
  }
  return el;
}

function updateVFTimer() {
  const remaining =
    verbal_fluency_duration - (Date.now() - verbal_fluency_start);
  const el = ensureTimerEl();
  el.textContent = formatMMSS(remaining);
}
