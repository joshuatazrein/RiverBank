<?php
$cookie = $_COOKIE['username'];
echo move_uploaded_file(
  $_FILES["upfile"]["tmp_name"], 
  'users/' . $cookie . '.json'
) ? "OK" : "ERROR UPLOADING";