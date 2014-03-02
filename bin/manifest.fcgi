#!/usr/bin/perl
##

use FCGI;

my $counter = 0;

while (FCGI::accept >= 0) {
    print "Content-type: text/cache-manifest\r\n";
    print "Status: 200 OK\r\n\r\n";

    print "CACHE MANIFEST\n";

    my $hash_values = "";

    my $dir = new RecursiveDirectoryIterator("..");
    for my $file (defined(<$dir_h>))  {
		
		if (substr($file, 0, 3) != "./." && substr($file, 0, 8) != "./unused") {
				if ($file->IsFile() && $file != "manifest.php" && substr($dir, 0, 3) != "./."
						&& substr($file->getFilename(), 0, 1) != ".") {
								echo $file . "\n";
								$hashes .= md5_file($file);
						}
		}
    }

    print "# Hash: " . md5($hashes) . "\n";
}
