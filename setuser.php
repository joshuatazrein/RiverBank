<?php
$username = $_POST['usertest'];
$password = $_POST['pwtest'];
$data = '{"flop":[{"title":"inbox","text":"<span class=\"buffer\"></span><span class=\"in h1 ui-draggable-handle ui-droppable\" style=\"\" draggable=\"true\" quickhelp=\"task (see help: syntax)\">Welcome to RiverBank!</span><span class=\"in ui-draggable-handle ui-droppable\" style=\"\" draggable=\"true\" quickhelp=\"task (see help: syntax)\">RiverBank is a tool for storing and scheduling your tasks.</span><span class=\"in ui-draggable-handle ui-droppable\" style=\"\" draggable=\"true\" quickhelp=\"task (see help: syntax)\">&nbsp;This is the Bank view, which is a \"bank\" of your unscheduled tasks and projects.</span><span class=\"in ui-draggable-handle ui-droppable\" style=\"\" draggable=\"true\" quickhelp=\"task (see help: syntax)\"><span class=\"bold\">Go over to the \"help\" at the bottom-left. Click the \"tutorial\" button to see the full tutorial!</span></span><span class=\"in h1 ui-draggable-handle ui-droppable\" style=\"\" folded=\"false\" draggable=\"true\" quickhelp=\"task (see help: syntax)\">Tasks</span><span class=\"in ui-draggable-handle ui-droppable\" style=\"\" draggable=\"true\" quickhelp=\"task (see help: syntax)\">create tasks<span class=\"in ui-draggable-handle ui-droppable\" style=\"\" draggable=\"true\" quickhelp=\"task (see help: syntax)\">subtasks</span></span><span class=\"in list ui-draggable-handle ui-droppable\" style=\"\" draggable=\"true\" quickhelp=\"task (see help: syntax)\">• lists</span><span class=\"in note ui-draggable-handle ui-droppable\" style=\"\" draggable=\"true\" quickhelp=\"task (see help: syntax)\">- notes</span><span class=\"in ui-draggable-handle ui-droppable\" style=\"\" draggable=\"true\" quickhelp=\"task (see help: syntax)\">deadlines (click to jump to date or task) <span class=\"deadline\" quickhelp=\"deadline (see help: dates)\">&gt;11/11/2222 </span></span><span class=\"in ui-draggable-handle ui-droppable\" style=\"\" draggable=\"true\" quickhelp=\"task (see help: syntax)\">links (click to search) <span class=\"link\">[[find me]]</span><span class=\"in ui-draggable-handle ui-droppable\" style=\"\" draggable=\"true\" quickhelp=\"task (see help: syntax)\">find me!</span></span><span class=\"in ui-draggable-handle ui-droppable h2\" style=\"\" folded=\"false\" draggable=\"true\" quickhelp=\"task (see help: syntax)\">subheadings</span><span class=\"in ui-draggable-handle ui-droppable h3\" style=\"\" folded=\"false\" draggable=\"true\" quickhelp=\"task (see help: syntax)\">sub-sub-headings</span><span class=\"in h1 ui-draggable-handle ui-droppable folded\" style=\"\" folded=\"true\" draggable=\"true\" quickhelp=\"task (see help: syntax)\">fold headings ...</span><span class=\"in ui-draggable-handle ui-droppable\" style=\"display: none;\" quickhelp=\"task (see help: syntax)\">SURPRISE! :)</span><span class=\"in h1 ui-draggable-handle ui-droppable\" style=\"\" folded=\"false\" draggable=\"true\" quickhelp=\"task (see help: syntax)\">Controls</span><span class=\"in list ui-draggable-handle ui-droppable\" style=\"\" draggable=\"true\" quickhelp=\"task (see help: syntax)\">• Use the asterisk button to change task types</span><span class=\"in list ui-draggable-handle ui-droppable\" style=\"\" draggable=\"true\" quickhelp=\"task (see help: syntax)\">• Use the <span class=\"weblink\" title=\"\" ...\"\"=\"\">\"...\"</span> button (top-right) for options</span><span class=\"in list ui-draggable-handle ui-droppable\" style=\"\" draggable=\"true\" quickhelp=\"task (see help: syntax)\">• Drag tasks anywhere you want! Try dragging this one.<span class=\"in list ui-draggable-handle ui-droppable\" style=\"\" draggable=\"true\" quickhelp=\"task (see help: syntax)\">• Default: insert after target</span><span class=\"in list ui-draggable-handle ui-droppable\" style=\"\" draggable=\"true\" quickhelp=\"task (see help: syntax)\">• Command-drag: insert before target</span><span class=\"in list ui-draggable-handle ui-droppable\" style=\"\" draggable=\"true\" quickhelp=\"task (see help: syntax)\">• Option-drag: insert as subtask of target</span></span><span class=\"in list ui-draggable-handle ui-droppable\" style=\"\" draggable=\"true\" quickhelp=\"task (see help: syntax)\">• Type into the search bar to search</span><span class=\"in list ui-draggable-handle ui-droppable ui-droppable-active\" style=\"\" draggable=\"true\" quickhelp=\"task (see help: syntax)\">• Space: complete; Shift-Space: archive</span><span class=\"in list ui-draggable-handle ui-droppable ui-droppable-active\" style=\"\" draggable=\"true\" quickhelp=\"task (see help: syntax)\">• try out the tutorial for the buttons!</span><span class=\"in h2 ui-draggable-handle ui-droppable ui-droppable-active\" style=\"\" folded=\"false\" draggable=\"true\" quickhelp=\"task (see help: syntax)\">Extras</span><span class=\"in list ui-draggable-handle ui-droppable ui-droppable-active\" style=\"\" draggable=\"true\" quickhelp=\"task (see help: syntax)\">• Consult the help for key commands</span><span class=\"buffer bottom\"></span>"},{"title":"create/edit/drag lists","text":"<span class=\"buffer\" style=\"height:var(--butheight)\"></span><span class=\"buffer bottom\" style=\"height:90%;\"></span>"}],"pop":"<span class=\"buffer\"></span><span class=\"in ui-draggable-handle ui-droppable\" style=\"\" draggable=\"true\" quickhelp=\"task (see help: syntax)\">This is the River view, where you can drag tasks to specific dates to schedule them. As you can see, today\'s date is automatically added.</span><span class=\"in h1 dateheading ui-droppable ui-droppable-active\" folded=\"false\" style=\"\" quickhelp=\"date (see help: dates)\">Thu 09/16/2021<span class=\"placeholder\" title=\"task (see help: syntax)\">-2w3d</span></span><span class=\"in event ui-draggable-handle ui-droppable complete\" style=\"\" draggable=\"true\" quickhelp=\"event (see help: syntax)\"><span class=\"timing\" quickhelp=\"time (click to adjust)\">10a-12p</span> events</span><span class=\"in h1 dateheading ui-droppable\" quickhelp=\"date (see help: dates)\" folded=\"false\" draggable=\"false\" style=\"\">U 10/3/21<span class=\"placeholder\" title=\"task (see help: syntax)\">today</span></span><span class=\"in list ui-draggable-handle ui-droppable\" style=\"\" draggable=\"true\" quickhelp=\"task (see help: syntax)\">• Use the timer (top-right) to time yourself!</span><span class=\"in list ui-draggable-handle ui-droppable\" style=\"\" draggable=\"true\" quickhelp=\"task (see help: syntax)\">• Just click \"play\" to start a stopwatch</span><span class=\"in ui-draggable-handle ui-droppable list ui-droppable-active\" style=\"\" draggable=\"true\" quickhelp=\"task (see help: syntax)\">• Create new dates by searching \"d:\" and your date</span><span class=\"in list ui-draggable-handle ui-droppable ui-droppable-active\" style=\"\" draggable=\"true\" quickhelp=\"task (see help: syntax)\">• You can also enter a date</span><span class=\"in list ui-draggable-handle ui-droppable ui-droppable-active\" style=\"\" draggable=\"true\" quickhelp=\"task (see help: syntax)\">• Dates in future: 0d, 1d, 1w</span><span class=\"in list ui-draggable-handle ui-droppable ui-droppable-active\" style=\"\" draggable=\"true\" quickhelp=\"task (see help: syntax)\">• Use shorthand: M/Mon/Monday</span><span class=\"in ui-draggable-handle ui-droppable\" style=\"\" draggable=\"true\" quickhelp=\"task (see help: syntax)\">repeats ~1d</span><span class=\"in ui-draggable-handle ui-droppable list\" style=\"\" draggable=\"true\" quickhelp=\"task (see help: syntax)\">• examples: ~1d (daily), ~1w (weekly), ~M (every Monday), ~11 (11th of every month)</span><span class=\"in list ui-draggable-handle ui-droppable\" style=\"\" draggable=\"true\" quickhelp=\"task (see help: syntax)\">• complete repeat to schedule next</span><span class=\"in list ui-draggable-handle ui-droppable ui-droppable-active\" style=\"\" draggable=\"true\" quickhelp=\"task (see help: syntax)\">• click on time and drag to change</span><span class=\"in list ui-draggable-handle ui-droppable ui-droppable-active\" style=\"\" draggable=\"true\" quickhelp=\"task (see help: syntax)\">• drag tasks into events</span><span class=\"in h1 dateheading futuredate ui-droppable\" quickhelp=\"date (see help: dates)\" folded=\"false\" draggable=\"false\" style=\"\">Mon 10/4/21<span class=\"placeholder\" title=\"task (see help: syntax)\">1d</span></span><span class=\"in h1 dateheading futuredate ui-droppable\" quickhelp=\"date (see help: dates)\" folded=\"false\" draggable=\"false\" style=\"\">Tue 10/5/21<span class=\"placeholder\" title=\"task (see help: syntax)\">2d</span></span><span class=\"in h1 dateheading futuredate ui-droppable\" quickhelp=\"date (see help: dates)\" folded=\"false\" draggable=\"false\" style=\"\">Wed 10/6/21<span class=\"placeholder\" title=\"task (see help: syntax)\">3d</span></span><span class=\"in h1 dateheading futuredate ui-droppable\" quickhelp=\"date (see help: dates)\" folded=\"false\" draggable=\"false\" style=\"\">Thu 10/7/21<span class=\"placeholder\" title=\"task (see help: syntax)\">4d</span></span><span class=\"in h1 dateheading futuredate ui-droppable\" quickhelp=\"date (see help: dates)\" folded=\"false\" draggable=\"false\" style=\"\">Fri 10/8/21<span class=\"placeholder\" title=\"task (see help: syntax)\">5d</span></span><span class=\"in h1 dateheading futuredate ui-droppable\" quickhelp=\"date (see help: dates)\" folded=\"false\" draggable=\"false\" style=\"\">Sat 10/9/21<span class=\"placeholder\" title=\"task (see help: syntax)\">6d</span></span><span class=\"in h1 dateheading futuredate ui-droppable\" quickhelp=\"date (see help: dates)\" folded=\"false\" draggable=\"false\" style=\"\">Sun 10/10/21<span class=\"placeholder\" title=\"task (see help: syntax)\">1w</span></span><span class=\"in h1 dateheading futuredate ui-droppable\" quickhelp=\"date (see help: dates)\" folded=\"false\" draggable=\"false\" style=\"\">Mon 10/11/21<span class=\"placeholder\" title=\"task (see help: syntax)\">1w1d</span></span><span class=\"in h1 dateheading futuredate ui-droppable\" quickhelp=\"date (see help: dates)\" folded=\"false\" draggable=\"false\" style=\"\">Tue 10/12/21<span class=\"placeholder\" title=\"task (see help: syntax)\">1w2d</span></span><span class=\"in h1 dateheading futuredate ui-droppable\" quickhelp=\"date (see help: dates)\" folded=\"false\" draggable=\"false\" style=\"\">Wed 10/13/21<span class=\"placeholder\" title=\"task (see help: syntax)\">1w3d</span></span><span class=\"in h1 dateheading futuredate ui-droppable\" quickhelp=\"date (see help: dates)\" folded=\"false\" draggable=\"false\" style=\"\">Thu 10/14/21<span class=\"placeholder\" title=\"task (see help: syntax)\">1w4d</span></span><span class=\"in h1 dateheading futuredate ui-droppable\" quickhelp=\"date (see help: dates)\" folded=\"false\" draggable=\"false\" style=\"\">Fri 10/15/21<span class=\"placeholder\" title=\"task (see help: syntax)\">1w5d</span></span><span class=\"in h1 dateheading futuredate ui-droppable\" quickhelp=\"date (see help: dates)\" folded=\"false\" draggable=\"false\" style=\"\">Sat 10/16/21<span class=\"placeholder\" title=\"task (see help: syntax)\">1w6d</span></span><span class=\"in h1 dateheading futuredate ui-droppable\" quickhelp=\"date (see help: dates)\" folded=\"false\" draggable=\"false\" style=\"\">Sun 10/17/21<span class=\"placeholder\" title=\"task (see help: syntax)\">2w</span></span><span class=\"in h1 dateheading futuredate ui-droppable\" quickhelp=\"date (see help: dates)\" folded=\"false\" draggable=\"false\" style=\"\">Mon 10/18/21<span class=\"placeholder\" title=\"task (see help: syntax)\">2w1d</span></span><span class=\"in h1 dateheading futuredate ui-droppable\" quickhelp=\"date (see help: dates)\" folded=\"false\" draggable=\"false\" style=\"\">Tue 10/19/21<span class=\"placeholder\" title=\"task (see help: syntax)\">2w2d</span></span><span class=\"in h1 dateheading futuredate ui-droppable\" quickhelp=\"date (see help: dates)\" folded=\"false\" draggable=\"false\" style=\"\">Wed 10/20/21<span class=\"placeholder\" title=\"task (see help: syntax)\">2w3d</span></span><span class=\"in h1 dateheading futuredate ui-droppable\" quickhelp=\"date (see help: dates)\" folded=\"false\" draggable=\"false\" style=\"\">Thu 10/21/21<span class=\"placeholder\" title=\"task (see help: syntax)\">2w4d</span></span><span class=\"in h1 dateheading futuredate ui-droppable\" quickhelp=\"date (see help: dates)\" folded=\"false\" draggable=\"false\" style=\"\">Fri 10/22/21<span class=\"placeholder\" title=\"task (see help: syntax)\">2w5d</span></span><span class=\"in h1 dateheading futuredate ui-droppable\" quickhelp=\"date (see help: dates)\" folded=\"false\" draggable=\"false\" style=\"\">Sat 10/23/21<span class=\"placeholder\" title=\"task (see help: syntax)\">2w6d</span></span><span class=\"in h1 dateheading futuredate ui-droppable\" quickhelp=\"date (see help: dates)\" folded=\"false\" draggable=\"false\" style=\"\">Sun 10/24/21<span class=\"placeholder\" title=\"task (see help: syntax)\">3w</span></span><span class=\"in h1 dateheading futuredate ui-droppable\" quickhelp=\"date (see help: dates)\" folded=\"false\" draggable=\"false\" style=\"\">Mon 10/25/21<span class=\"placeholder\" title=\"task (see help: syntax)\">3w1d</span></span><span class=\"in h1 dateheading futuredate ui-droppable\" quickhelp=\"date (see help: dates)\" folded=\"false\" draggable=\"false\" style=\"\">Tue 10/26/21<span class=\"placeholder\" title=\"task (see help: syntax)\">3w2d</span></span><span class=\"in h1 dateheading futuredate ui-droppable\" quickhelp=\"date (see help: dates)\" folded=\"false\" draggable=\"false\" style=\"\">Wed 10/27/21<span class=\"placeholder\" title=\"task (see help: syntax)\">3w3d</span></span><span class=\"in h1 dateheading futuredate ui-droppable\" quickhelp=\"date (see help: dates)\" folded=\"false\" draggable=\"false\" style=\"\">Thu 10/28/21<span class=\"placeholder\" title=\"task (see help: syntax)\">3w4d</span></span><span class=\"in h1 dateheading futuredate ui-droppable\" quickhelp=\"date (see help: dates)\" folded=\"false\" draggable=\"false\" style=\"\">Fri 10/29/21<span class=\"placeholder\" title=\"task (see help: syntax)\">3w5d</span></span><span class=\"in h1 dateheading futuredate ui-droppable\" quickhelp=\"date (see help: dates)\" folded=\"false\" draggable=\"false\" style=\"\">Sat 10/30/21<span class=\"placeholder\" title=\"task (see help: syntax)\">3w6d</span></span><span class=\"in h1 dateheading futuredate ui-droppable\" quickhelp=\"date (see help: dates)\" folded=\"false\" draggable=\"false\" style=\"\">Sun 10/31/21<span class=\"placeholder\" title=\"task (see help: syntax)\">4w</span></span><span class=\"in h1 dateheading futuredate ui-droppable\" quickhelp=\"date (see help: dates)\" folded=\"false\" draggable=\"false\" style=\"\">Mon 11/1/21<span class=\"placeholder\" title=\"task (see help: syntax)\">4w1d</span></span><span class=\"in h1 dateheading ui-droppable\" quickhelp=\"date (see help: dates)\" folded=\"false\" draggable=\"false\" style=\"\">Mon 11/11/22<span class=\"placeholder\" title=\"task (see help: syntax)\">1y1m<br>1w1d</span></span><span class=\"duedate\" title=\"duedate\" quickhelp=\"duedate (click to see task)\">&gt; deadlines (click to jump to date or task)  <span class=\"duedateBacklink\">Tasks</span></span><span class=\"buffer bottom\"></span>","hidebuts":"false","style":"default.css","dateSplit":"mm/dd/yyyy","weekdays":"Mon","help":"show","headingalign":"center","play":"true","futurepanes":"show","loadedlist":0}';

$conn = new mysqli('server204.web-hosting.com', 
  'joshgncd_joshua', 'hn%X=FbWIU]J', 'joshgncd_riverbank', 3306);
if ($conn->connect_error) {
  die('Connection failed: ' . $conn->connect_error);
}
$sql1 = 'INSERT INTO users (user, pw)
VALUES ("' . $username . '", "' . $password . '")';
$conn->query($sql1);
$sql2 = 'SELECT * FROM users WHERE user="' . 
$username . '"';
$result = $conn->query($sql2);
while ($row = $result->fetch_assoc()) {
  file_put_contents('users/' . $row["fname"] . '.json', $data);
  echo $row["fname"];
}
$conn->close();
?>