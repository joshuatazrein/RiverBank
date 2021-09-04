var data
var weekdaysStr
var weekdaysNum
var loadonstart
var offlinemode

var resetstring = {"flop":[{"title":"inbox","text":"<span class=\"in h1\" ondragstart=\"dragTask(event)\" ondragover=\"draggingOver(event)\" ondrop=\"dropTask(event)\" draggable=\"true\" style=\"\">Welcome to RiverBank!</span><span class=\"in\" ondragstart=\"dragTask(event)\" ondragover=\"draggingOver(event)\" ondrop=\"dropTask(event)\" draggable=\"true\" style=\"\">RiverBank is a tool for storing and scheduling your tasks.</span><span class=\"in\" ondragstart=\"dragTask(event)\" ondragover=\"draggingOver(event)\" ondrop=\"dropTask(event)\" draggable=\"true\" style=\"\">This is the Bank view, which is a \"bank\" of your unscheduled tasks and projects.</span><span class=\"in\" ondragstart=\"dragTask(event)\" ondragover=\"draggingOver(event)\" ondrop=\"dropTask(event)\" draggable=\"true\" style=\"\">Go over to the \"help\" at the bottom-left. Click the button to see the full tutorial!</span>"}],"pop":"<span class=\"in\" ondragstart=\"dragTask(event)\" ondragover=\"draggingOver(event)\" ondrop=\"dropTask(event)\" draggable=\"true\" style=\"\">This is the River view, where you can drag tasks to specific dates to schedule them. As you can see, today's date is automatically added.</span>","hidebuts":"false","style":"default.css","dateSplit":"mm/dd/yyyy","weekdays":"Mon","help":"show","loadedlist":0}

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function signIn() {
  // keep prompting until they get it right
  const username = prompt('Username:')
  const password = prompt('Password:')
  $.post('getuser.php', {
    // trying data
    usertest: username,
    pwtest: password,
  }, function(dataval, status, xhr) {
    if (xhr.responseText == 'FAIL') {
      // fail
      alert('Username and password not recognized; try again.')
      signIn()
    } else {
      // success
      const inaweek = new Date();
      inaweek.setTime(inaweek.getTime() + 604800000);
      document.cookie = 'fname=' + xhr.responseText + '; expires=' + 
        inaweek.toUTCString();
      document.cookie = 'user=' + username + '; expires=' + 
        inaweek.toUTCString();
      document.cookie = 'pw=' + password + '; expires=' + 
        inaweek.toUTCString();
      $.get(
        'users/' + xhr.responseText + '.json', 
        function (dataval, status, xhr2) {
          console.log(xhr2.responseText)
          data = JSON.parse(xhr2.responseText)
          loadpage()
        }
      )
    }
  })
}

function checkUser() {
  const username = prompt('Enter your new username:')
  $.post(
    'checkuser.php',
    {usertest: username},
    function (val, status, xhr) {
      if (xhr.responseText == 'FAIL') {
        alert('That username is already taken. Please try again.')
        checkUser()
      } else {
        checkPass(username)
      }
    }
  )
}

function checkPass(username) {
  // check password
  const password = prompt('Enter your new password:')
  const passcheck = prompt('Enter your password again:')
  if (passcheck != password) {
    alert('Passwords do not match; please try again.')
    checkPass(username)
  } else {
    newUser(username, password)
  }
}

function newUser(username, password) {
  // create a new user, has passed the tests - makes file and adds to table
  $.post(
    'setuser.php',
    {
      usertest: username,
      pwtest: password
    },
    function (val, status, xhr) {
      // success
      data = JSON.parse(JSON.stringify(resetstring))
      const inaweek = new Date();
      inaweek.setTime(inaweek.getTime() + 604800000);
      document.cookie = 'fname=' + xhr.responseText + '; expires=' + 
        inaweek.toUTCString();
      document.cookie = 'user=' + username + '; expires=' + 
        inaweek.toUTCString();
      document.cookie = 'pw=' + password + '; expires=' + 
        inaweek.toUTCString();
      // create new file
      loadpage();
    }
  )
}

function resetCookies() {
  let past = new Date()
  past.setTime(
    past.getTime() - 10000000)
  past = past.toUTCString()
  document.cookie = 'user=;expires=' + past + ';'
  document.cookie = 'fname=;expires=' + past + ';'
  document.cookie = 'pw=;expires=' + past + ';'
}

function load() {
  try {
    // test for internet connection
    const xml = new XMLHttpRequest()
    xml.open(
      'GET', 
      'users/testfile.json', 
      false
    )
    xml.send()
  } catch (err) {
    console.log('offline mode');
    offlinemode = true;
    // offline mode
    try {
      data = JSON.parse(localStorage.getItem('data'))
      $('head').append(
        $("<link rel='stylesheet' type='text/css' href='" +
        data.style + "' />")
      );
    } catch (err) {
      data = JSON.parse(JSON.stringify(resetstring))
      $('head').append(
        $("<link rel='stylesheet' type='text/css' href='" +
        data.style + "' />")
      );
    }
    resetCookies();
    if (data.weekdays == 'M') {
      weekdaysStr = {0:'U', 1:'M', 2:'T', 3:'W', 4:'R', 5:'F', 6:'S'}
      weekdaysNum = {'U':0, 'M':1, 'T':2, 'W':3, 'R':4, 'F':5, 'S':6}
    } else if (data.weekdays == 'Mon') {
      weekdaysStr = {0:'Sun', 1:'Mon', 2:'Tue', 3:'Wed', 4:'Thu', 5:'Fri', 
      6:'Sat'}
      weekdaysNum = {'Sun':0, 'Mon':1, 'Tue':2, 'Wed':3, 'Thu':4, 'Fri':5, 
      'Sat':6}
    }
    loadonstart = true
    return
  }
  try {
    // try the current cookie (synchronous request)
    const fname = getCookie('fname')
    if (fname == '') {throw 'no user loaded'}
    $.get(
      'users/' + getCookie('fname') + '.json', 
      function (datastr, status, xhr) {
        if (xhr.responseText == '') { throw 'no user loaded' }
        data = JSON.parse(xhr.responseText)
        loadpage()
      }
    )
  } catch (err) {
    console.log(err);
    // there are no cookies or the cookies failed
    const newuser = confirm('Welcome to RiverBank! Press "OK" to create a new user or "Cancel" to sign in to your account.')
    if (!newuser) {
      // wanting to sign in
      signIn()
    } else {
      // create a new user
      checkUser()
    }
  }
}

load()