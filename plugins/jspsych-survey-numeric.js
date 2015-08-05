/**
 * jspsych-survey-text
 * a jspsych plugin for free response survey questions
 *
 * Josh de Leeuw
 *
 * documentation: docs.jspsych.org
 *
 */

(function($) {
  jsPsych['survey-numeric'] = (function() {

    var plugin = {};

    plugin.create = function(params) {

      //params = jsPsych.pluginAPI.enforceArray(params, ['data']);

      var trials = [];
      for (var i = 0; i < params.questions.length; i++) {
        var rows = [], cols = [];
        if(typeof params.rows == 'undefined' || typeof params.columns == 'undefined'){
          for(var j = 0; j < params.questions[i].length; j++){
            // cols.push(40);
            // rows.push(1);
          }
        }

        trials.push({
          preamble: typeof params.preamble == 'undefined' ? "" : params.preamble[i],
          questions: params.questions[i],
          // rows: typeof params.rows == 'undefined' ? rows : params.rows[i],
          // columns: typeof params.columns == 'undefined' ? cols : params.columns[i]
        });
      }
      return trials;
    };

    plugin.trial = function(display_element, trial) {

      // if any trial variables are functions
      // this evaluates the function and replaces
      // it with the output of the function
      trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);

      // show preamble text
      display_element.append($('<div>', {
        "id": 'jspsych-survey-numeric-preamble',
        "class": 'jspsych-survey-numeric-preamble'
      }));

      $('#jspsych-survey-numeric-preamble').html(trial.preamble);


      //make it a form
      display_element.append("<form>");
      var form = $('form');

      // add questions
      for (var i = 0; i < trial.questions.length; i++) {
        // create div
        var div_id = 'jspsych-survey-numeric-' + i;
        form.append($('<div>', {
          "id": div_id,
          "class": 'jspsych-survey-numeric-question'
        }));

        var response_id = 'jspsych-survey-numeric-response-' + i;
        // add question text
        $("#jspsych-survey-numeric-" + i).append('<label class="jspsych-survey-numeric" for="' + response_id + '">' + trial.questions[i] + '</p>');

        // add text box
        $("#" + div_id).append('<input type="text" name="#' + response_id + '" id="' + response_id + '"></input>');
      }

      // add submit button
      form.append($('<input>', {
        'id': 'jspsych-survey-numeric-next',
        'class': 'jspsych-survey-numeric',
        'type':'submit',
        'value':'Submit'
      }));

      $("#jspsych-survey-numeric-next").html('Submit Answers');
      $("#jspsych-survey-numeric-next").click(form.submit);

      form.submit(function(event) {
        event.preventDefault();
        // measure response time
        var endTime = (new Date()).getTime();
        var response_time = endTime - startTime;

        // create object to hold responses
        var question_data = {};
        $("div.jspsych-survey-numeric-question").each(function(index) {
          var id = "Q" + index;
          var val = $(this).children('textarea').val();
          var obje = {};
          obje[id] = val;
          $.extend(question_data, obje);
        });

        // save data
        jsPsych.data.write({
          "rt": response_time,
          "responses": JSON.stringify(question_data)
        });

        display_element.html('');

        // next trial
        jsPsych.finishTrial();
      });

      var startTime = (new Date()).getTime();
    };

    return plugin;
  })();
})(jQuery);
