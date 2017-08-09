<?php
	if ($argc != 2) {
		print_r("" . $argv[0] . " path/to/data\n");
		return;
	}

	$poc = unserialize(file_get_contents($argv[1]));

	serialize($poc);

	gc_collect_cycles();

?>
