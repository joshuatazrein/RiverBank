<?php
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Cache-Control");
$cookie = $_COOKIE['fname'];
$data = $_POST['datastr'];
$list = $_POST['datalist'];
$dataobj = json_decode(file_get_contents('users/' . $cookie . '.json'));
if ($list == 'pop') {
  $dataobj->pop = $data;
} else {
  $dataobj->flop[$list]->text = $data;
}
file_put_contents('users/' . $cookie . '.json', json_encode($dataobj));
echo $dataobj->flop[$list]->text;
?>