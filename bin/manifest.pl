#!/usr/bin/perl

use strict;
use warnings;

use Readonly;
#use FCGI;
use Carp;
use File::Find;
use Digest::MD5 qw( md5 md5_base64 );
use Digest::MD5::File qw(dir_md5_hex file_md5_hex url_md5_hex);

Readonly::Array  my @ignore_items   => qw( ../. ../bin ../README.md );
Readonly::Scalar my $root_directory => '..';

sub list_dirs {
    my @dirs = shift;
    my @files;

    find ({ 'wanted' => sub { push @files, $_ }, no_chdir => 1 }, @dirs);

    return @files;
}

sub must_be_shown {
    my $file = shift;

    return 0 if -d $file;

    for my $item (@ignore_items) {
        return 0 if substr($file, 0, length($item)) eq $item;
    }

    return 1;
}

sub main {
# I don't think we need FCGI here. This is neither a resource nor a
# performance problem, but makes installation way easier. I wonder,
# though, whether the php version wouldn't even more portable.
#    while (FCGI::accept >= 0) {
        print "Content-type: text/cache-manifest\n";
        print "Status: 200 OK\n\n";

        print "CACHE MANIFEST\n";

        my $hashes = "";

        for my $entry (list_dirs('..')) {
            if (must_be_shown($entry)) {
                $hashes .= file_md5_hex($entry);
                $entry =~ s/^\.\.\///;
                print $entry, "\n";
            }
        }

        print "# Hash: " . md5_base64($hashes) . "\n";
#    }
}

main();

