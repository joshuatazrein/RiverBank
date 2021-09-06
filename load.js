var data
var weekdaysStr
var offlinemode
var offline

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

function load() {
  // tries to load current cookie's data; if not, redirects to welcome
  try {
    if (navigator.onLine) {
      // test for file mode or not (synchonous AJAX)
      const xml = new XMLHttpRequest()
      xml.open(
        'GET', 
        'users/testfile.json', 
        false
      )
      xml.send()
    } else {
      alert('No connection detected; saving locally')
      offline = true
      throw 'offline'
    }
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
    if (data.weekdays == 'M') {
      weekdaysStr = {0:'U', 1:'M', 2:'T', 3:'W', 4:'R', 5:'F', 6:'S'}
    } else if (data.weekdays == 'Mon') {
      weekdaysStr = {0:'Sun', 1:'Mon', 2:'Tue', 3:'Wed', 4:'Thu', 5:'Fri', 
      6:'Sat'}
    }
    setTimeout(500, loadpage)
  }
  // try the current cookie (synchronous request)
  const fname = getCookie('fname')
  console.log(document.cookie);
  if (fname == '') {
    // no user loaded
    window.location = 'https://riverbank.app/welcome.html'
    return
  }
  $.get(
    'users/' + getCookie('fname') + '.json', 
    function (datastr, status, xhr) {
      if (xhr.responseText == '') { 
        // no file found
        window.location = 'https://riverbank.app/welcome.html'
        return
      } else {
        data = JSON.parse(xhr.responseText)
        setTimeout(500, loadpage)
      }
    }
  )
}

load()