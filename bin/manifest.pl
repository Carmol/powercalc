#!/usr/bin/perl

use strict;
use warnings;

use FCGI;
use Carp;
use File::Find;
use Digest::MD5 qw( md5 md5_base64 );
use Digest::MD5::File qw(dir_md5_hex file_md5_hex url_md5_hex);

sub list_dirs {
    my @dirs = shift;
    my @files;

    find ({ 'wanted' => sub { push @files, $_ }, no_chdir => 1 }, @dirs);

    return @files;
}

sub must_be_shown {
    my $file = shift;
 
    # ugly hack; do not know, what I did wrong...
    return 0 if $file =~ /^\.\.\/\./;
    return 0 if $file =~ /^\.\.\/bin/;
    return 0 if -d $file or $file eq '../manifest.php' or $file eq '../README.md'
        or $file =~ /^\.\.\/bin/;

    return 1;
}

sub main {
    while (FCGI::accept >= 0) {
        print "Content-type: text/cache-manifest\n";
        print "Status: 200 OK\n\n";

        print "CACHE MANIFEST\n";

        my $hashes = "";

dir_entry:
        for my $entry (list_dirs('..')) {
            if (must_be_shown($entry)) {
                $hashes .= file_md5_hex($entry);
                $entry =~ s/^\.\.\///;
                print $entry, "\n";
            }
        }

        print "# Hash: " . md5_base64($hashes) . "\n";
    }
}

main();

