<?php
if ($argc != 2) {
	print_r("" . $argv[0] . " path/to/data\n");
	return;
}   

class foo {
	function __wakeup() {
		$this->{'x'} = 1;
	}
}

$poc = unserialize(file_get_contents($argv[1]));

//serialize($poc);
//var_dump($poc);
//$xx = array($poc);
//var_dump($xx);
?>
