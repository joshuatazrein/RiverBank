<?php
$username = $_POST['usertest'];
$password = $_POST['pwtest'];
$data = '{"flop":[{"title":"inbox","text":"<span class=\"in h1\" ondragstart=\"dragTask(event)\" ondragover=\"draggingOver(event)\" ondrop=\"dropTask(event)\" draggable=\"true\" style=\"\">Welcome to RiverBank!</span><span class=\"in\" ondragstart=\"dragTask(event)\" ondragover=\"draggingOver(event)\" ondrop=\"dropTask(event)\" draggable=\"true\" style=\"\">RiverBank is a tool for storing and scheduling your tasks.</span><span class=\"in\" ondragstart=\"dragTask(event)\" ondragover=\"draggingOver(event)\" ondrop=\"dropTask(event)\" draggable=\"true\" style=\"\">This is the Bank view, which is a \"bank\" of your unscheduled tasks and projects.</span><span class=\"in\" ondragstart=\"dragTask(event)\" ondragover=\"draggingOver(event)\" ondrop=\"dropTask(event)\" draggable=\"true\" style=\"\">Go over to the \"help\" at the bottom-left. Click the button to see the full tutorial!</span>"}],"pop":"<span class=\"in\" ondragstart=\"dragTask(event)\" ondragover=\"draggingOver(event)\" ondrop=\"dropTask(event)\" draggable=\"true\" style=\"\">This is the River view, where you can drag tasks to specific dates to schedule them. As you can see, today\'s date is automatically added.</span>","hidebuts":"false","style":"default.css","dateSplit":"mm/dd/yyyy","weekdays":"Mon","help":"show","loadedlist":0,"play":"true"}';

$conn = new mysqli('server204.web-hosting.com', 
  'joshgncd_joshua', 'hn%X=FbWIU]J', 'joshgncd_riverbank', 3306);
if ($conn->connect_error) {
  die('Connection failed: ' . $conn->connect_error);
}
$sql = 'INSERT INTO users (user, pw, dt)
VALUES ("' . $username . '", "' . $password . '", "' . $data . '")';
$conn->query($sql);
// original
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