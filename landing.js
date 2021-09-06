function signIn() {
  // keep prompting until they get it right
  $.post('getuser.php', {
    // trying data
    usertest: $('#username').val(),
    pwtest: $('#password').val(),
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
  $.post(
    'checkuser.php',
    {usertest: $('#newusername').val()},
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
  $.post(
    'setuser.php',
    {
      usertest: $('#newusername').val(),
      pwtest: $('#newpassword1').val()
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
    $("#tutorial").css("height", $("#welcome").height() + "px")
  }
}