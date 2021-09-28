var resetstring = {"flop":[{"title":"inbox","text":"<span class=\"buffer\" style=\"height:var(--butheight)\"></span><span class=\"in h1 ui-draggable-handle ui-droppable\" style=\"\">Welcome to RiverBank!</span><span class=\"in ui-draggable-handle ui-droppable\" style=\"\">RiverBank is a tool for storing and scheduling your tasks.</span><span class=\"in ui-draggable-handle ui-droppable\" style=\"\">&nbsp;This is the Bank view, which is a \"bank\" of your unscheduled tasks and projects.</span><span class=\"in ui-draggable-handle ui-droppable\" style=\"\"><span class=\"bold\">Go over to the \"help\" at the bottom-left. Click the \"tutorial\" button to see the full tutorial!</span></span><span class=\"in h1 ui-draggable-handle ui-droppable\" style=\"\" folded=\"false\">Tasks</span><span class=\"in ui-draggable-handle ui-droppable\" style=\"\">create tasks<span class=\"in ui-draggable-handle ui-droppable\" style=\"\">subtasks</span></span><span class=\"in list ui-draggable-handle ui-droppable\" style=\"\">• lists</span><span class=\"in note ui-draggable-handle ui-droppable\" style=\"\">- notes</span><span class=\"in ui-draggable-handle ui-droppable\" style=\"\">deadlines (click to jump to date or task) <span class=\"deadline\">&gt;11/11/2222 </span></span><span class=\"in ui-draggable-handle ui-droppable\" style=\"\">links (click to search) <span class=\"link\">[[find me]]</span><span class=\"in ui-draggable-handle ui-droppable\" style=\"\">find me!</span></span><span class=\"in ui-draggable-handle ui-droppable h2\" style=\"\" folded=\"false\">subheadings</span><span class=\"in ui-draggable-handle ui-droppable h3\" style=\"\" folded=\"false\">sub-sub-headings</span><span class=\"in h1 ui-draggable-handle ui-droppable folded\" style=\"\" folded=\"true\">fold headings ...</span><span class=\"in ui-draggable-handle ui-droppable\" style=\"display: none;\">SURPRISE! :)</span><span class=\"in h1 ui-draggable-handle ui-droppable\" style=\"\" folded=\"false\">Controls</span><span class=\"in list ui-draggable-handle ui-droppable\" style=\"\">• Use the asterisk button to change task types</span><span class=\"in list ui-draggable-handle ui-droppable\" style=\"\">• Use the <span class=\"weblink\" title=\"\" ...\"\"=\"\">\"...\"</span> button (top-right) for options</span><span class=\"in list ui-draggable-handle ui-droppable\" style=\"\">• Drag tasks anywhere you want! Try dragging this one.<span class=\"in list ui-draggable-handle ui-droppable\" style=\"\">• Default: insert after target</span><span class=\"in list ui-draggable-handle ui-droppable\" style=\"\">• Command-drag: insert before target</span><span class=\"in list ui-draggable-handle ui-droppable\" style=\"\">• Option-drag: insert as subtask of target</span></span><span class=\"in list ui-draggable-handle ui-droppable\" style=\"\">• Type into the search bar to search</span><span class=\"in list ui-draggable-handle ui-droppable ui-droppable-active\" style=\"\">• Space: complete; Shift-Space: archive</span><span class=\"in list ui-draggable-handle ui-droppable ui-droppable-active\" style=\"\">• try out the tutorial for the buttons!</span><span class=\"in h2 ui-draggable-handle ui-droppable ui-droppable-active\" style=\"\" folded=\"false\">Extras</span><span class=\"in list ui-draggable-handle ui-droppable ui-droppable-active\" style=\"\">• Consult the help for key commands</span><span class=\"buffer bottom\" style=\"height:90%;\"></span>"},{"title":"create/edit/drag lists","text":"<span class=\"buffer\" style=\"height:var(--butheight)\"></span><span class=\"buffer bottom\" style=\"height:90%;\"></span>"}],"pop":"<span class=\"buffer\" style=\"height:var(--butheight)\"></span><span class=\"placeholder\">today</span><span class=\"in h1 dateheading ui-droppable\" folded=\"false\" style=\"\">Wed 09/15/2021</span><span class=\"in ui-draggable-handle ui-droppable\" style=\"\">This is the River view, where you can drag tasks to specific dates to schedule them. As you can see, today's date is automatically added.</span><span class=\"placeholder\">1d</span><span class=\"in h1 dateheading ui-droppable ui-droppable-active\" folded=\"false\" style=\"\">Thu 09/16/2021</span><span class=\"in event ui-draggable-handle ui-droppable\" style=\"\"><span class=\"timing\">10a-12p</span> events<span class=\"in list ui-draggable-handle ui-droppable ui-droppable-active\" style=\"\">• drag tasks into events</span><span class=\"in list ui-draggable-handle ui-droppable ui-droppable-active\" style=\"\">• click on time and drag to change</span></span><span class=\"in ui-draggable-handle ui-droppable\" style=\"\">repeats ~1d<span class=\"in list ui-draggable-handle ui-droppable\" style=\"\">• complete repeat to schedule next</span><span class=\"in ui-draggable-handle ui-droppable list\" style=\"\">• examples: ~1d (daily), ~1w (weekly), ~M (every Monday), ~11 (11th of every month)</span></span><span class=\"in ui-draggable-handle ui-droppable list ui-droppable-active\" style=\"\">• Create new dates by searching \"d:\" and your date<span class=\"in list ui-draggable-handle ui-droppable ui-droppable-active\" style=\"\">• Use shorthand: M/Mon/Monday</span><span class=\"in list ui-draggable-handle ui-droppable ui-droppable-active\" style=\"\">• Dates in future: 0d, 1d, 1w</span><span class=\"in list ui-draggable-handle ui-droppable ui-droppable-active\" style=\"\">• You can also enter a date</span></span><span class=\"in list ui-draggable-handle ui-droppable\" style=\"\">• Use the timer (top-right) to time yourself!<span class=\"in list ui-draggable-handle ui-droppable\" style=\"\">• Just click \"play\" to start a stopwatch</span></span><span class=\"placeholder\">201y1m3w5d</span><span class=\"in h1 dateheading ui-droppable ui-droppable-active\" folded=\"false\" style=\"\">Mon 11/11/2222</span><span class=\"duedate\">&gt; deadlines (click to jump to date or task)  </span><span class=\"buffer bottom\" style=\"height:90%\"></span>","hidebuts":"false","style":"default.css","dateSplit":"mm/dd/yyyy","weekdays":"Mon","help":"show","loadedlist":0,"headingalign":"center"}

function signIn() {
  // keep prompting until they get it right
  const username = $('#username').val()
  const password = $('#password').val()
  if ($('#username').val() == '') {
    alert('Please enter your username.')
    return
  }
  if ($('#password').val() == '') {
    alert('Please enter your password.')
    return
  }
  $.post('getuser.php', {
    // trying data
    usertest: username,
    pwtest: password,
  }, function(dataval, status, xhr) {
    if (xhr.responseText == 'FAIL') {
      // fail
      alert('Username and password not recognized; please try again.')
      $('#username').val('')
      $('#password').val('')
      return
    } else {
      // success
      const inaweek = new Date();
      inaweek.setTime(inaweek.getTime() + 604800000);
      document.cookie = 'fname=' + xhr.responseText + '; expires=' + 
        inaweek.toUTCString() + ';path=/;';
      document.cookie = 'user=' + username + '; expires=' + 
        inaweek.toUTCString() + ';path=/;';
      document.cookie = 'pw=' + password + '; expires=' + 
        inaweek.toUTCString() + ';path=/;';
      $.get(
        'users/' + xhr.responseText + '.json', 
        function (dataval, status, xhr2) {
          data = JSON.parse(xhr2.responseText)
          window.location='https://riverbank.app'
        }
      )
    }
  })
}

function checkNewUser() {
  if ($('#newusername').val() == '') {
    alert('Please enter a username.')
    return
  }
  if ($('#newpassword1').val() == '') {
    alert('Please enter a password.')
    return
  }
  const username = $('#newusername').val()
  $.post(
    'checkuser.php',
    {usertest: username},
    function (val, status, xhr) {
      if (xhr.responseText == 'FAIL') {
        alert('Username taken; please try again.')
        $('#newusername').val('')
        return
      } else {
        newUser()
      }
    }
  )
}

function newUser() {
  // create a new user, has passed the tests - makes file and adds to table
  if ($('#newpassword1').val() != $('#newpassword1').val()) {
    $('#newpassword1').val('')
    $('#newpassword2').val('')
    alert('Passwords do not match; please try again.')
    return
  }
  const username = $('#newusername').val()
  const password = $('#newpassword1').val()
  $.post(
    'setuser.php',
    {
      usertest: username,
      pwtest: password,
    },
    function (val, status, xhr) {
      // success
      data = JSON.parse(JSON.stringify(resetstring))
      const inaweek = new Date();
      inaweek.setTime(inaweek.getTime() + 604800000);
      document.cookie = 'fname=' + xhr.responseText + '; expires=' + 
        inaweek.toUTCString() + ';path=/;';
      document.cookie = 'user=' + username + '; expires=' + 
        inaweek.toUTCString() + ';path=/;';
      document.cookie = 'pw=' + password + '; expires=' + 
        inaweek.toUTCString() + ';path=/;';
      window.location='https://riverbank.app'
    }
  )
}

function setTutorialHeight() {
  if (window.innerWidth > 600) { 
    const height = window.innerHeight - 110 - $('#login').height()
    $("#tutorial").css("height", height - 50 + 'px')
    $('#text').css('height', height + 'px')
  } else {
    $('#tutorial, #text').css('height', '')
  }
}

$('video').toArray().forEach((x) => {
  x.currentTime = 0;
})
setTimeout(function () {$('#createaccountbut').trigger('click')}, 250)
console.log('loaded');