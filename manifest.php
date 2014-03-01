<?php
session_start();

header("Content-type: text/cache-manifest");

echo "CACHE MANIFEST\n";

$hashes = "";

$dir = new RecursiveDirectoryIterator(".");
foreach(new RecursiveIteratorIterator($dir) as $file) {
		
		if (substr($file, 0, 3) != "./." && substr($file, 0, 8) != "./unused") {
				if ($file->IsFile() && $file != "manifest.php" && substr($dir, 0, 3) != "./."
						&& substr($file->getFilename(), 0, 1) != ".") {
								echo $file . "\n";
								$hashes .= md5_file($file);
						}
		}
}

echo "# Hash: " . md5($hashes) . "\n";
?>

