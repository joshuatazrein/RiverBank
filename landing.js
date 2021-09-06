var resetstring = {"flop":[{"title":"inbox","text":"<span class=\"in h1\" ondragstart=\"dragTask(event)\" ondragover=\"draggingOver(event)\" ondrop=\"dropTask(event)\" draggable=\"true\" style=\"\">Welcome to RiverBank!</span><span class=\"in\" ondragstart=\"dragTask(event)\" ondragover=\"draggingOver(event)\" ondrop=\"dropTask(event)\" draggable=\"true\" style=\"\">RiverBank is a tool for storing and scheduling your tasks.</span><span class=\"in\" ondragstart=\"dragTask(event)\" ondragover=\"draggingOver(event)\" ondrop=\"dropTask(event)\" draggable=\"true\" style=\"\">This is the Bank view, which is a \"bank\" of your unscheduled tasks and projects.</span><span class=\"in\" ondragstart=\"dragTask(event)\" ondragover=\"draggingOver(event)\" ondrop=\"dropTask(event)\" draggable=\"true\" style=\"\">Go over to the \"help\" at the bottom-left. Click the button to see the full tutorial!</span>"}],"pop":"<span class=\"in\" ondragstart=\"dragTask(event)\" ondragover=\"draggingOver(event)\" ondrop=\"dropTask(event)\" draggable=\"true\" style=\"\">This is the River view, where you can drag tasks to specific dates to schedule them. As you can see, today's date is automatically added.</span>","hidebuts":"false","style":"default.css","dateSplit":"mm/dd/yyyy","weekdays":"Mon","help":"show","loadedlist":0}

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
          console.log(xhr2.responseText)
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
    $("#tutorial").css("height", 
      Math.max($("#welcome").height(), window.innerHeight - 110) + "px")
  }
}