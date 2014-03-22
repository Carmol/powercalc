#!/usr/bin/perl

use strict;
use warnings;

use Readonly;
#use FCGI;
use Carp;
use File::Find;
use Digest::MD5 qw( md5 md5_base64 );
use Digest::MD5::File qw(dir_md5_hex file_md5_hex url_md5_hex);
use Method::Signatures;
use English qw( -no_match_vars);
use Fatal qw( open close );

use feature qw(say switch);

Readonly::Scalar our $VERSION        => '0.1.7';
Readonly::Array  my  @IGNORE_ITEMS   => qw( ../. ../bin ../README.md ../manifest.php );
Readonly::Scalar my  $ROOT_DIRECTORY => q/../;
Readonly::Scalar my  $EMPTY          => q//;

func list_dirs($dir) {
    my @files;

    find ({ 'wanted' => sub { push @files, $ARG }, no_chdir => 1 },
        ($dir));

    return @files;
}

func must_be_shown($file) {

    return 0 if -d $file;

    for my $item (@IGNORE_ITEMS) {
        return 0 if substr($file, 0, length($item)) eq $item;
    }

    return 1;
}

sub main {
    #    while (FCGI::accept >= 0) {
    say 'Content-type: text/cache-manifest';
    say 'Status: 200 OK';
    say $EMPTY;
    say 'CACHE MANIFEST';

    my $hashes = $EMPTY;

    for my $entry (list_dirs($ROOT_DIRECTORY)) {
        if (must_be_shown($entry)) {
            $hashes .= file_md5_hex($entry);
            $entry =~ s/^[.][.]\///xms;
            say $entry;
        }
    }

    say '# Hash: ' . md5_base64 $hashes;
    #}
}

main();





































































































