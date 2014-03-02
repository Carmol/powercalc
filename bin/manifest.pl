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

sub main {
    while (FCGI::accept >= 0) {
        print "Content-type: text/cache-manifest\r\n";
        print "Status: 200 OK\r\n\r\n";

        print "CACHE MANIFEST\n";

        my $hashes = "";

dir_entry:
        for my $entry (list_dirs('..')) {

            if (-d $entry) { next dir_entry; }

            my $original_file_name = $entry;

            $entry =~ s/^\.\.\///;
            if ($entry =~ /^\./
                    or $entry eq '..'
                    or $entry eq 'manifest.php'
                    or $entry eq 'README.md'
                    or $entry =~ /^bin/)
            {    next dir_entry; } 

            $hashes .= file_md5_hex($original_file_name);
            print $entry, "\n";
        }

        print "# Hash: " . md5_base64($hashes) . "\n";
    }
}

main();

