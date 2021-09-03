var data
var weekdaysStr
var weekdaysNum
var loading

var resetstring = {"flop":[{"title":"tutorial","text":"<span class=\"in h1\" ondragstart=\"dragTask(event)\" ondragover=\"draggingOver(event)\" ondrop=\"dropTask(event)\" draggable=\"true\" style=\"\">Welcome to RiverBank!</span><span class=\"in\" ondragstart=\"dragTask(event)\" ondragover=\"draggingOver(event)\" ondrop=\"dropTask(event)\" draggable=\"true\" style=\"\">RiverBank is a tool for storing and scheduling your tasks.</span><span class=\"in\" ondragstart=\"dragTask(event)\" ondragover=\"draggingOver(event)\" ondrop=\"dropTask(event)\" draggable=\"true\" style=\"\">This is the Bank view, which is a \"bank\" of your unscheduled tasks and projects.</span><span class=\"in h1\" ondragstart=\"dragTask(event)\" ondragover=\"draggingOver(event)\" ondrop=\"dropTask(event)\" draggable=\"true\" style=\"\">Tutorial</span><span class=\"in h2\" ondragstart=\"dragTask(event)\" ondragover=\"draggingOver(event)\" ondrop=\"dropTask(event)\" draggable=\"true\" style=\"\">Getting started</span><span class=\"in list\" ondragstart=\"dragTask(event)\" ondragover=\"draggingOver(event)\" ondrop=\"dropTask(event)\" draggable=\"true\" style=\"\">• Click on this task to select it<span class=\"in list\" ondragstart=\"dragTask(event)\" ondragover=\"draggingOver(event)\" ondrop=\"dropTask(event)\" draggable=\"false\" style=\"\">•&nbsp;Press \"option-return\" to create a new task below</span><span class=\"in list\" ondragstart=\"dragTask(event)\" ondragover=\"draggingOver(event)\" ondrop=\"dropTask(event)\" draggable=\"false\" style=\"\">• Enter the task's title and press \"return\" to save</span><span class=\"in list\" ondragstart=\"dragTask(event)\" ondragover=\"draggingOver(event)\" ondrop=\"dropTask(event)\" draggable=\"true\" style=\"\">• Select the task and press \"return\" to edit</span><span class=\"in list\" ondragstart=\"dragTask(event)\" ondragover=\"draggingOver(event)\" ondrop=\"dropTask(event)\" draggable=\"true\" style=\"\">• Select the task and press \"delete\" to delete</span></span><span class=\"in list\" ondragstart=\"dragTask(event)\" ondragover=\"draggingOver(event)\" ondrop=\"dropTask(event)\" draggable=\"true\" style=\"\">• Create headings<span class=\"in list\" ondragstart=\"dragTask(event)\" ondragover=\"draggingOver(event)\" ondrop=\"dropTask(event)\" draggable=\"true\" style=\"\">•&nbsp;Create a new task and enter \"# \" followed by the task's title</span><span class=\"in list\" ondragstart=\"dragTask(event)\" ondragover=\"draggingOver(event)\" ondrop=\"dropTask(event)\" draggable=\"true\" style=\"\">• Save to make it a heading</span><span class=\"in list\" ondragstart=\"dragTask(event)\" ondragover=\"draggingOver(event)\" ondrop=\"dropTask(event)\" draggable=\"true\" style=\"\">• \"# \": heading 1, \"## \": heading 2, \"### \": heading 3</span><span class=\"in list\" ondragstart=\"dragTask(event)\" ondragover=\"draggingOver(event)\" ondrop=\"dropTask(event)\" draggable=\"true\" style=\"\">• Select the heading and press \"]\" to fold or \"[\" to unfold</span></span><span class=\"in list\" ondragstart=\"dragTask(event)\" ondragover=\"draggingOver(event)\" ondrop=\"dropTask(event)\" draggable=\"true\" style=\"\">• Create subtasks<span class=\"in list\" ondragstart=\"dragTask(event)\" ondragover=\"draggingOver(event)\" ondrop=\"dropTask(event)\" draggable=\"true\" style=\"\">•&nbsp;Select a task and press \"option-shift-return\" to create a subtask</span><span class=\"in list\" ondragstart=\"dragTask(event)\" ondragover=\"draggingOver(event)\" ondrop=\"dropTask(event)\" draggable=\"true\" style=\"\">• Select the subtask and press \"option-return\" to create a subtask after that one</span><span class=\"in list\" ondragstart=\"dragTask(event)\" ondragover=\"draggingOver(event)\" ondrop=\"dropTask(event)\" draggable=\"true\" style=\"\">• Press \"option-[\" to unindent and \"option-]\" to indent</span></span><span class=\"in list\" ondragstart=\"dragTask(event)\" ondragover=\"draggingOver(event)\" ondrop=\"dropTask(event)\" draggable=\"true\" style=\"\">• Create lists<span class=\"in list\" ondragstart=\"dragTask(event)\" ondragover=\"draggingOver(event)\" ondrop=\"dropTask(event)\" draggable=\"true\" style=\"\">•&nbsp;Right-click on \"tutorial\" (left column) and select \"new\" to create a new list</span><span class=\"in list\" ondragstart=\"dragTask(event)\" ondragover=\"draggingOver(event)\" ondrop=\"dropTask(event)\" draggable=\"true\" style=\"\">• Enter the list's name and press \"return\" to save</span><span class=\"in list\" ondragstart=\"dragTask(event)\" ondragover=\"draggingOver(event)\" ondrop=\"dropTask(event)\" draggable=\"true\" style=\"\">• Click on lists to load them</span></span><span class=\"in list\" ondragstart=\"dragTask(event)\" ondragover=\"draggingOver(event)\" ondrop=\"dropTask(event)\" draggable=\"true\" style=\"\">• Move tasks<span class=\"in list\" ondragstart=\"dragTask(event)\" ondragover=\"draggingOver(event)\" ondrop=\"dropTask(event)\" draggable=\"true\" style=\"\">•&nbsp;Select a task and drag it on top of another to move it below</span><span class=\"in list\" ondragstart=\"dragTask(event)\" ondragover=\"draggingOver(event)\" ondrop=\"dropTask(event)\" draggable=\"true\" style=\"\">•&nbsp;Press \"command\" and drag to drop the task above the target</span><span class=\"in list\" ondragstart=\"dragTask(event)\" ondragover=\"draggingOver(event)\" ondrop=\"dropTask(event)\" draggable=\"true\" style=\"\">• Press \"option\" and drag to drop the task as a subtask</span><span class=\"in list\" ondragstart=\"dragTask(event)\" ondragover=\"draggingOver(event)\" ondrop=\"dropTask(event)\" draggable=\"true\" style=\"\">• Drag a task to a list to move it between lists</span><span class=\"in list\" ondragstart=\"dragTask(event)\" ondragover=\"draggingOver(event)\" ondrop=\"dropTask(event)\" draggable=\"true\" style=\"\">• Headings move their subtasks along with them</span></span><span class=\"in list\" ondragstart=\"dragTask(event)\" ondragover=\"draggingOver(event)\" ondrop=\"dropTask(event)\" draggable=\"false\" style=\"\">• Schedule tasks<span class=\"in list\" ondragstart=\"dragTask(event)\" ondragover=\"draggingOver(event)\" ondrop=\"dropTask(event)\" draggable=\"true\" style=\"\">•&nbsp;Select a task and press \"option-Right\" to move it to the River list to the right (the list for dates)</span><span class=\"in list\" ondragstart=\"dragTask(event)\" ondragover=\"draggingOver(event)\" ondrop=\"dropTask(event)\" draggable=\"true\" style=\"\">• The \"search\" bar (top left) will be highlighted for you to enter a date</span><span class=\"in list\" ondragstart=\"dragTask(event)\" ondragover=\"draggingOver(event)\" ondrop=\"dropTask(event)\" draggable=\"true\" style=\"\">• Enter \"0d\" to move it to today, or \"1d\" to move it to tomorrow</span><span class=\"in list\" ondragstart=\"dragTask(event)\" ondragover=\"draggingOver(event)\" ondrop=\"dropTask(event)\" draggable=\"true\" style=\"\">• You can add a date at any time by typing \"d:\" and the date into the search bar</span><span class=\"in list\" ondragstart=\"dragTask(event)\" ondragover=\"draggingOver(event)\" ondrop=\"dropTask(event)\" draggable=\"true\" style=\"\">• \"d\" = days, \"w\" = weeks, \"m\" = months, \"y\" = years</span><span class=\"in list\" ondragstart=\"dragTask(event)\" ondragover=\"draggingOver(event)\" ondrop=\"dropTask(event)\" draggable=\"true\" style=\"\">• See full date options by scrolling through \"help\" (bottom left)</span></span><span class=\"in\" ondragstart=\"dragTask(event)\" ondragover=\"draggingOver(event)\" ondrop=\"dropTask(event)\" draggable=\"true\" style=\"\"><span class=\"italic\">_Move over to the River view (to the right) to finish the tutorial!_</span></span><span class=\"in h2\" ondragstart=\"dragTask(event)\" ondragover=\"draggingOver(event)\" ondrop=\"dropTask(event)\" draggable=\"true\" style=\"\">Become a RiverBank wizard</span><span class=\"in list\" ondragstart=\"dragTask(event)\" ondragover=\"draggingOver(event)\" ondrop=\"dropTask(event)\" draggable=\"true\" style=\"\">• Use the context menu by right-clicking (double-tapping on mobile) to see all available options</span><span class=\"in list\" ondragstart=\"dragTask(event)\" ondragover=\"draggingOver(event)\" ondrop=\"dropTask(event)\" draggable=\"true\" style=\"\">• Format tasks<span class=\"in list\" ondragstart=\"dragTask(event)\" ondragover=\"draggingOver(event)\" ondrop=\"dropTask(event)\" draggable=\"true\" style=\"\">•&nbsp;<span class=\"link\">[[links]]</span> will search when you click on them</span><span class=\"in list\" ondragstart=\"dragTask(event)\" ondragover=\"draggingOver(event)\" ondrop=\"dropTask(event)\" draggable=\"true\" style=\"\">•&nbsp;<span class=\"bold\">*bold*</span>, <span class=\"italic\">_italic_</span>, and <span class=\"bold-italic\">_*bold-italic*_</span></span><span class=\"in list\" ondragstart=\"dragTask(event)\" ondragover=\"draggingOver(event)\" ondrop=\"dropTask(event)\" draggable=\"true\" style=\"\">•&nbsp;Weblinks will automatically collapse into a clickable chain icon</span></span><span class=\"in list\" ondragstart=\"dragTask(event)\" ondragover=\"draggingOver(event)\" ondrop=\"dropTask(event)\" draggable=\"true\" style=\"\">• Set a timer<span class=\"in list\" ondragstart=\"dragTask(event)\" ondragover=\"draggingOver(event)\" ondrop=\"dropTask(event)\" draggable=\"true\" style=\"\">•&nbsp;Enter minutes into \"timer\" (top left)</span><span class=\"in list\" ondragstart=\"dragTask(event)\" ondragover=\"draggingOver(event)\" ondrop=\"dropTask(event)\" draggable=\"true\" style=\"\">•&nbsp;Press enter to start, space to stop, and esc to clear</span><span class=\"in list\" ondragstart=\"dragTask(event)\" ondragover=\"draggingOver(event)\" ondrop=\"dropTask(event)\" draggable=\"false\" style=\"\">•&nbsp;25, 15, 5: set minutes</span><span class=\"in list\" ondragstart=\"dragTask(event)\" ondragover=\"draggingOver(event)\" ondrop=\"dropTask(event)\" draggable=\"true\" style=\"\">•&nbsp;+2, -2: add/subtract 2 minutes</span></span><span class=\"in list\" ondragstart=\"dragTask(event)\" ondragover=\"draggingOver(event)\" ondrop=\"dropTask(event)\" draggable=\"true\" style=\"\">• Customize settings: click on options (top left)<span class=\"in list\" ondragstart=\"dragTask(event)\" ondragover=\"draggingOver(event)\" ondrop=\"dropTask(event)\" draggable=\"true\" style=\"\">•&nbsp;Change date between dd.mm.yyyy, mm/dd/yyyy, and yyyy-mm-dd</span><span class=\"in list\" ondragstart=\"dragTask(event)\" ondragover=\"draggingOver(event)\" ondrop=\"dropTask(event)\" draggable=\"true\" style=\"\">•&nbsp;Change weekdays between long (Mon) and short (M)</span><span class=\"in list\" ondragstart=\"dragTask(event)\" ondragover=\"draggingOver(event)\" ondrop=\"dropTask(event)\" draggable=\"true\" style=\"\">• Change color themes</span><span class=\"in list\" ondragstart=\"dragTask(event)\" ondragover=\"draggingOver(event)\" ondrop=\"dropTask(event)\" draggable=\"true\" style=\"\">• Hide/show buttons</span><span class=\"in list\" ondragstart=\"dragTask(event)\" ondragover=\"draggingOver(event)\" ondrop=\"dropTask(event)\" draggable=\"true\" style=\"\">• Hide/show help</span></span>"}],"pop":"<span class=\"in\" ondragstart=\"dragTask(event)\" ondragover=\"draggingOver(event)\" ondrop=\"dropTask(event)\" draggable=\"true\" style=\"\">This is the River view, where you can drag tasks to specific dates to schedule them.</span><span class=\"in list\" ondragstart=\"dragTask(event)\" ondragover=\"draggingOver(event)\" ondrop=\"dropTask(event)\" draggable=\"true\" style=\"\">• Complete tasks<span class=\"in list\" ondragstart=\"dragTask(event)\" ondragover=\"draggingOver(event)\" ondrop=\"dropTask(event)\" draggable=\"true\" style=\"\">• Select the task and press \"space\" to complete in place</span><span class=\"in list\" ondragstart=\"dragTask(event)\" ondragover=\"draggingOver(event)\" ondrop=\"dropTask(event)\" draggable=\"true\" style=\"\">• Or press shift-space to archive (moves to \"completed\" for today</span></span><span class=\"in list\" ondragstart=\"dragTask(event)\" ondragover=\"draggingOver(event)\" ondrop=\"dropTask(event)\" draggable=\"true\" style=\"\">•&nbsp;Create events<span class=\"in list\" ondragstart=\"dragTask(event)\" ondragover=\"draggingOver(event)\" ondrop=\"dropTask(event)\" draggable=\"true\" style=\"\">• Create a new task</span><span class=\"in list\" ondragstart=\"dragTask(event)\" ondragover=\"draggingOver(event)\" ondrop=\"dropTask(event)\" draggable=\"true\" style=\"\">• Type \"@ \" at the beginning to make it an event</span><span class=\"in list\" ondragstart=\"dragTask(event)\" ondragover=\"draggingOver(event)\" ondrop=\"dropTask(event)\" draggable=\"true\" style=\"\">•&nbsp;Option-drag tasks onto the event to schedule them for that block of time</span></span><span class=\"in list\" ondragstart=\"dragTask(event)\" ondragover=\"draggingOver(event)\" ondrop=\"dropTask(event)\" draggable=\"true\" style=\"\">• Create deadlines<span class=\"in list\" ondragstart=\"dragTask(event)\" ondragover=\"draggingOver(event)\" ondrop=\"dropTask(event)\" draggable=\"true\" style=\"\">•&nbsp;Create a new task</span><span class=\"in list\" ondragstart=\"dragTask(event)\" ondragover=\"draggingOver(event)\" ondrop=\"dropTask(event)\" draggable=\"true\" style=\"\">• Enter a greater-than sign (like a forward arrow) followed by a date or weekday</span><span class=\"in list\" ondragstart=\"dragTask(event)\" ondragover=\"draggingOver(event)\" ondrop=\"dropTask(event)\" draggable=\"true\" style=\"\">•&nbsp;Enter the task name and save</span><span class=\"in list\" ondragstart=\"dragTask(event)\" ondragover=\"draggingOver(event)\" ondrop=\"dropTask(event)\" draggable=\"true\" style=\"\">•&nbsp;A heading is displayed under the due date</span><span class=\"in list\" ondragstart=\"dragTask(event)\" ondragover=\"draggingOver(event)\" ondrop=\"dropTask(event)\" draggable=\"true\" style=\"\">•&nbsp;Click on the due date or deadline to navigate between them</span></span>","hidebuts":"false","style":"default.css","dateSplit":"mm/dd/yyyy","weekdays":"Mon","help":"show","loadedlist":0}

function load() {
  loading = true
  try {
    const xml = new XMLHttpRequest()
    xml.open(
      'GET', 
      'users/testfile.json', 
      false
    )
    xml.send()
    $.get('usertest.php', function(data, status, xhr) {
      console.log(xhr.responseText);
    })
  } catch (err) {
    console.log('testfile failed');
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
    var inaweek = new Date();
    inaweek.setTime(inaweek.getTime() + 604800000);
    document.cookie = 'username=_; expires=' + inaweek.toUTCString();
    if (data.weekdays == 'M') {
      weekdaysStr = {0:'U', 1:'M', 2:'T', 3:'W', 4:'R', 5:'F', 6:'S'}
      weekdaysNum = {'U':0, 'M':1, 'T':2, 'W':3, 'R':4, 'F':5, 'S':6}
    } else if (data.weekdays == 'Mon') {
      weekdaysStr = {0:'Sun', 1:'Mon', 2:'Tue', 3:'Wed', 4:'Thu', 5:'Fri', 
      6:'Sat'}
      weekdaysNum = {'Sun':0, 'Mon':1, 'Tue':2, 'Wed':3, 'Thu':4, 'Fri':5, 
      'Sat':6}
    }
    return
  }
  if (document.cookie === '') {
    var inaweek = new Date();
    inaweek.setTime(inaweek.getTime() + 604800000);
    const username = prompt('enter username (or create new user): ');
    const password = prompt('enter password (or create new password): ');
    document.cookie = 'username=' + username + '_' + password + 
    '; expires=' + inaweek.toUTCString();
  }
  var worked = false
  while (worked === false) {
    const test = new XMLHttpRequest();
    test.onreadystatechange = function () {
      if (this.readyState == 4) {
        if (this.status != 200) {
          // file not found
          const newuser = confirm(
            'Current user is not recognized. Create a new user? ' + 
            '(Press Cancel to re-enter username & password)'
          )
          if (newuser) {
            worked = true
            data = JSON.parse(JSON.stringify(resetstring))
          } else {
            // reset cookies and try again
            const inaweek = new Date()
            inaweek.setTime(inaweek.getTime() + 604800000)
            const past = new Date()
            past.setTime(past.getTime() - 86400000)
            const username = prompt('re-enter username: ')
            const password = prompt('enter password: ')
            document.cookie = 'username=; expires=' + past.toUTCString()
            document.cookie = 'username=' + username + '_' + password + 
              '; expires=' + inaweek.toUTCString()
          }
        } else {
          // file found
          worked = true
          data = JSON.parse(this.responseText)
        }
      }
    }
    test.open(
      'POST', 
      'users/' + document.cookie.split(';')[0].split('=')[1] + '.json', 
      false
    )
    test.send()
  }
  $('head').append(
    $("<link rel='stylesheet' type='text/css' href='" +
    data.style + "' />")
  );
  if (data.weekdays == 'M') {
    weekdaysStr = {0:'U', 1:'M', 2:'T', 3:'W', 4:'R', 5:'F', 6:'S'}
    weekdaysNum = {'U':0, 'M':1, 'T':2, 'W':3, 'R':4, 'F':5, 'S':6}
  } else if (data.weekdays == 'Mon') {
    weekdaysStr = {0:'Sun', 1:'Mon', 2:'Tue', 3:'Wed', 4:'Thu', 5:'Fri', 
    6:'Sat'}
    weekdaysNum = {'Sun':0, 'Mon':1, 'Tue':2, 'Wed':3, 'Thu':4, 'Fri':5, 
    'Sat':6}
  }
}

load();