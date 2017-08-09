<?php
	$data = file_get_contents($argv[1]);
	$wddx = wddx_deserialize($data);
	var_dump($wddx);
?>
