# Perl Interview Prep — Athena Health (via Agile Axis)

> **Your edge:** You already know JS/Node.js, React, AWS, Docker, K8s, Jenkins.
> This guide maps every Perl concept to what you already know.

---

## Master Checklist — Everything You Need to Cover

### Phase 1: Core Language (Must-Know)

| # | Topic | JS Parallel | Priority |
|---|-------|-------------|----------|
| 1 | Scalars, Arrays, Hashes (`$`, `@`, `%`) | `let`, arrays, objects | 🔴 Critical |
| 2 | Sigils and Context (scalar vs list) | No direct equivalent | 🔴 Critical |
| 3 | String vs Numeric operators (`eq` vs `==`) | `===` vs `==` | 🔴 Critical |
| 4 | References (`\$x`, `\@arr`, `\%hash`) | Pointers / object refs | 🔴 Critical |
| 5 | Regular Expressions (Perl's superpower) | JS RegExp but on steroids | 🔴 Critical |
| 6 | Subroutines & `@_` | Functions & `arguments` | 🔴 Critical |
| 7 | Control flow (`if/elsif/unless/until`) | `if/else if` | 🔴 Critical |
| 8 | Loops (`for`, `foreach`, `while`, `until`) | `for`, `for...of`, `while` | 🔴 Critical |
| 9 | Special variables (`$_`, `$!`, `$@`, `@ARGV`) | No equivalent | 🔴 Critical |
| 10 | `use strict; use warnings;` | `'use strict'` in JS | 🔴 Critical |

### Phase 2: Data & File Handling

| # | Topic | JS Parallel | Priority |
|---|-------|-------------|----------|
| 11 | Complex data structures (AoH, HoA, HoH) | Nested objects/arrays | 🔴 Critical |
| 12 | File I/O (`open`, `close`, `<FH>`) | `fs.readFile`, streams | 🔴 Critical |
| 13 | String functions (`chomp`, `split`, `join`, `substr`) | `.trim()`, `.split()`, `.join()` | 🔴 Critical |
| 14 | Array functions (`push`, `pop`, `map`, `grep`, `sort`) | Same names in JS! | 🔴 Critical |
| 15 | Hash operations (`keys`, `values`, `exists`, `delete`) | `Object.keys()`, `delete` | 🔴 Critical |
| 16 | Directory operations (`opendir`, `readdir`, `glob`) | `fs.readdir` | 🟡 Important |

### Phase 3: Modules & OOP

| # | Topic | JS Parallel | Priority |
|---|-------|-------------|----------|
| 17 | Modules (`use`, `require`, `@INC`) | `import/require`, `node_modules` | 🔴 Critical |
| 18 | Packages and Namespaces | ES Modules, classes | 🔴 Critical |
| 19 | OOP (`bless`, constructors, methods) | `class`, `new`, `this` | 🔴 Critical |
| 20 | Inheritance (`@ISA`, `use parent`) | `extends` | 🟡 Important |
| 21 | Moose/Moo (Modern OOP) | TypeScript-like class syntax | 🟡 Important |
| 22 | CPAN ecosystem | npm ecosystem | 🔴 Critical |

### Phase 4: Advanced Perl

| # | Topic | JS Parallel | Priority |
|---|-------|-------------|----------|
| 23 | Closures & anonymous subs | Arrow functions, closures | 🟡 Important |
| 24 | `eval` / `die` error handling | `try/catch/throw` | 🔴 Critical |
| 25 | DBI (database access) | `pg`, `mysql2`, Sequelize | 🔴 Critical |
| 26 | Process management (`fork`, `exec`, `system`) | `child_process` | 🟡 Important |
| 27 | Socket programming | `net` module | 🟢 Nice to know |
| 28 | Signal handling (`%SIG`) | `process.on('SIGINT')` | 🟢 Nice to know |
| 29 | Tied variables | Proxy objects in JS | 🟢 Nice to know |
| 30 | `AUTOLOAD` | Proxy traps | 🟢 Nice to know |

### Phase 5: Athena Health Specific

| # | Topic | JS Parallel | Priority |
|---|-------|-------------|----------|
| 31 | Text/log parsing (healthcare data) | String processing | 🔴 Critical |
| 32 | CSV/TSV processing | `csv-parser` npm | 🔴 Critical |
| 33 | JSON handling (`JSON` module) | `JSON.parse/stringify` | 🔴 Critical |
| 34 | REST API calls (`LWP`, `HTTP::Tiny`) | `axios`, `fetch` | 🟡 Important |
| 35 | Testing (`Test::More`) | Jest/Mocha | 🔴 Critical |
| 36 | Debugging (`Data::Dumper`, `-d`) | `console.log`, Chrome DevTools | 🟡 Important |
| 37 | One-liners (command-line Perl) | No JS equivalent | 🟡 Important |
| 38 | CGI (legacy, but asked) | Express.js routes | 🟢 Nice to know |
| 39 | Template processing (`Template::Toolkit`) | Handlebars, EJS | 🟢 Nice to know |
| 40 | Perl + Docker/CI integration | Same as your Node.js CI | 🟡 Important |

---

## PART 1: Core Language Concepts

---

### 1. Variables — Sigils (`$`, `@`, `%`)

Perl uses **sigils** (prefix symbols) to tell you the type. JS doesn't have this.

```perl
# PERL                          # JAVASCRIPT EQUIVALENT
my $name = "Shubnit";          # let name = "Shubnit";
my $age  = 25;                  # let age = 25;
my @colors = ("red", "blue");   # let colors = ["red", "blue"];
my %user = (                    # let user = {
    name => "Shubnit",          #     name: "Shubnit",
    role => "engineer",         #     role: "engineer",
);                              # };
```

**Key rule:** The sigil changes based on what you're ACCESSING:

```perl
my @arr = (10, 20, 30);
print $arr[0];      # 10  — use $ because you're getting ONE scalar
print @arr[0, 2];   # slice — use @ because you're getting a LIST

my %h = (a => 1, b => 2);
print $h{a};         # 1  — use $ for one value
print @h{qw(a b)};   # slice — use @ for multiple values
```

**Interview trap:** "What's the difference between `$arr[0]` and `@arr[0]`?"
Answer: `$arr[0]` returns a scalar (the element). `@arr[0]` returns a one-element list (list context).

---

### 2. Context — Scalar vs List

This is Perl's most unique concept. **There is NO equivalent in JavaScript.**

```perl
my @arr = (1, 2, 3, 4, 5);

# LIST context — the array expands
my @copy = @arr;          # @copy gets (1,2,3,4,5)

# SCALAR context — the array returns its LENGTH
my $count = @arr;         # $count = 5
print "Length: " . @arr;  # "Length: 5" — string concat forces scalar context

# Forcing context
my $len = scalar @arr;    # explicitly force scalar context
```

**JS analogy (approximate):**
```javascript
// Imagine if this worked in JS:
let arr = [1, 2, 3];
let x = arr;        // x = 3  (length!)  ← This is what Perl does in scalar context
let y = [...arr];   // y = [1,2,3]       ← This is list context
```

**Interview question:** "What does `wantarray()` do?"
Answer: Inside a subroutine, `wantarray()` returns true if the caller wants a list, false if it wants a scalar. It's like checking the return expectation.

```perl
sub flexible {
    return wantarray() ? (1, 2, 3) : "three items";
}
my @list = flexible();   # (1, 2, 3)
my $str  = flexible();   # "three items"
```

---

### 3. String vs Numeric Operators

In JS you have `==` vs `===`. In Perl, the split is **string vs number**:

```perl
# NUMERIC     STRING        JS EQUIVALENT
# ==          eq            ===
# !=          ne            !==
# <           lt            <  (for strings)
# >           gt            >  (for strings)
# <=          le            <=
# >=          ge            >=
# <=>         cmp           .localeCompare()

# TRAP: This is WRONG in Perl
if ("hello" == "world") {
    print "TRUE!\n";  # This PRINTS! Both strings are 0 numerically
}

# CORRECT:
if ("hello" eq "world") {
    print "TRUE!\n";  # Does NOT print
}
```

**Interview question:** "What does `"abc" == "def"` evaluate to in Perl?"
Answer: **True (1)**, because `==` forces numeric context. Both strings become 0, and `0 == 0` is true. Use `eq` for string comparison.

---

### 4. References (Perl's Pointers)

References are how Perl does complex data structures. Think of them like JS object references, but explicit.

```perl
# PERL                                  # JAVASCRIPT
my $scalar = 42;
my $ref = \$scalar;         # create ref  # let ref = { value: scalar } (roughly)
print $$ref;                # deref: 42   # console.log(ref.value)
print ${$ref};              # same thing  # same

my @arr = (1, 2, 3);
my $aref = \@arr;           # ref to array  # let aref = arr (JS arrays are already refs)
print $$aref[0];            # 1
print $aref->[0];           # 1 (arrow notation — preferred, cleaner)

my %hash = (a => 1);
my $href = \%hash;           # ref to hash
print $$href{a};             # 1
print $href->{a};            # 1 (arrow notation — preferred)

# ANONYMOUS references (like JS literals)
my $aref = [1, 2, 3];       # [] creates anon array ref    # let aref = [1,2,3]
my $href = {a => 1, b => 2}; # {} creates anon hash ref    # let href = {a:1, b:2}
```

**Arrow rule:** Use `->` between adjacent brackets:
```perl
my $data = {
    users => [
        { name => "Shubnit", skills => ["Perl", "JS"] },
    ],
};

# Accessing nested data:
print $data->{users}->[0]->{name};          # "Shubnit"
print $data->{users}[0]{skills}[1];         # "JS" (-> optional between adjacent brackets)
```

**Interview question:** "What's the difference between `\@array` and `[@array]`?"
Answer: `\@array` is a reference TO the original array (changes reflect). `[@array]` creates a NEW anonymous array (a shallow copy).

---

### 5. Regular Expressions — Perl's Crown Jewel

You know JS regex. Perl regex is the same engine (PCRE = Perl Compatible RE) but with **much cleaner syntax**.

```perl
# PERL                                    # JAVASCRIPT
my $str = "Hello World 123";

# Match
if ($str =~ /World/) { ... }              # if (/World/.test(str)) { ... }

# Match with capture
if ($str =~ /(\w+)\s(\w+)/) {             # let m = str.match(/(\w+)\s(\w+)/);
    print "$1 $2\n";  # Hello World       # console.log(m[1], m[2]);
}

# Substitution
$str =~ s/World/Perl/;                    # str = str.replace("World", "Perl")
$str =~ s/World/Perl/g;                   # str = str.replaceAll("World","Perl")

# Case-insensitive
$str =~ /hello/i;                          # /hello/i

# Multiline
$str =~ /^hello/m;                         # /^hello/m

# Extended mode (allows comments + whitespace in regex)
$str =~ /
    (\d{3})    # area code
    [-.\s]?    # separator
    (\d{3})    # prefix
    [-.\s]?    # separator
    (\d{4})    # line number
/x;
# ^ The /x flag has NO JS equivalent — super useful for complex patterns
```

**Perl-specific regex features:**
```perl
# Named captures (Perl had these before JS)
if ($str =~ /(?<first>\w+)\s(?<last>\w+)/) {
    print $+{first};   # "Hello"
    # JS: match.groups.first
}

# Lookahead/lookbehind
$str =~ /(?<=\$)\d+/;    # match digits after $
$str =~ /\d+(?=\%)/;     # match digits before %

# Non-greedy
$str =~ /<(.+?)>/;       # same as JS

# Transliteration (no JS equivalent)
my $text = "Hello";
$text =~ tr/a-z/A-Z/;    # "HELLO" — like .toUpperCase() but character-by-character
$text =~ tr/aeiou//d;     # delete all vowels
$text =~ tr/a-z//s;       # squeeze repeated chars
```

**Interview coding question:** "Extract all email addresses from a text file."
```perl
#!/usr/bin/perl
use strict;
use warnings;

open my $fh, '<', 'data.txt' or die "Cannot open: $!";
my %emails;
while (my $line = <$fh>) {
    while ($line =~ /([a-zA-Z0-9._%+-]+\@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g) {
        $emails{$1} = 1;
    }
}
close $fh;

print "$_\n" for sort keys %emails;
```

**JS equivalent for comparison:**
```javascript
const fs = require('fs');
const data = fs.readFileSync('data.txt', 'utf8');
const emails = [...new Set(data.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g))];
emails.sort().forEach(e => console.log(e));
```

---

### 6. Subroutines & `@_`

```perl
# PERL                                    # JAVASCRIPT
sub greet {                                # function greet(name, age) {
    my ($name, $age) = @_;                 #     // params already named
    return "Hi $name, age $age";           #     return `Hi ${name}, age ${age}`;
}                                          # }

print greet("Shubnit", 25);

# @_ is like the `arguments` object in old JS
sub sum_all {
    my $total = 0;
    $total += $_ for @_;     # @_ contains ALL arguments
    return $total;
}
print sum_all(1, 2, 3, 4);   # 10
# JS equivalent: [...arguments].reduce((a,b) => a+b, 0)
```

**Default values (Perl 5.20+):**
```perl
# Old way
sub greet {
    my $name = shift || "World";     # like: function greet(name = "World")
    return "Hello, $name!";
}

# Modern way (Perl 5.20+ with signatures — experimental)
use feature 'signatures';
sub greet($name = "World") {
    return "Hello, $name!";
}
```

**Interview trap:** "What does `shift` do without arguments inside a sub?"
Answer: Inside a subroutine, `shift` with no args operates on `@_`. Outside a sub, it operates on `@ARGV`.

---

### 7. Special Variables (Perl's Secret Sauce)

These have NO JavaScript equivalent. Memorize the top 10.

```perl
# VARIABLE    MEANING                           ANALOGY
$_            # Default variable ("it")          Like an implicit parameter
@_            # Subroutine arguments             arguments object
$!            # System error message             err.message in callbacks
$@            # eval error (die message)         catch(e) { e.message }
$0            # Script name                      process.argv[0]
@ARGV         # Command-line arguments           process.argv.slice(2)
%ENV          # Environment variables            process.env
$/            # Input record separator           readline delimiter
$\            # Output record separator          (none)
$,            # Output field separator           Array.join() separator
$.            # Current line number              (none)
$$            # Process ID                       process.pid
$&            # Last regex match                 RegExp.lastMatch
$1, $2...     # Regex capture groups             match[1], match[2]
@ISA          # Inheritance chain                prototype chain
```

**How `$_` works (the "it" variable):**
```perl
# $_ is the default variable in many operations
my @nums = (1, 2, 3, 4, 5);

# These are equivalent:
my @doubled = map { $_ * 2 } @nums;
# JS: nums.map(x => x * 2)  — $_ is like the arrow function parameter

my @evens = grep { $_ % 2 == 0 } @nums;
# JS: nums.filter(x => x % 2 === 0)

# $_ in loops
for (@nums) {
    print "$_\n";    # $_ is automatically each element
}

# $_ in file reading
while (<STDIN>) {    # each line goes into $_
    chomp;           # chomp operates on $_ by default
    print "Line: $_\n";
}
```

---

### 8. Control Flow

```perl
# PERL                                    # JAVASCRIPT

# if / elsif / else
if ($x > 10) {                            # if (x > 10) {
    print "big";                           #     console.log("big");
} elsif ($x > 5) {                         # } else if (x > 5) {
    print "medium";                        #     console.log("medium");
} else {                                   # } else {
    print "small";                         #     console.log("small");
}                                          # }

# unless (reverse if — no JS equivalent)
unless ($logged_in) {                      # if (!loggedIn) {
    redirect("/login");                    #     redirect("/login");
}                                          # }

# Postfix notation (Perl-unique, very idiomatic)
print "Hello\n" if $greet;                 # if (greet) console.log("Hello");
die "Error!" unless $valid;                # if (!valid) throw new Error("Error!");
print "$_\n" for @items;                   # items.forEach(i => console.log(i));

# Ternary — same as JS
my $status = $age >= 18 ? "adult" : "minor";

# given/when (Perl 5.10+ — like switch)
use feature 'switch';
given ($color) {
    when ("red")   { print "Stop"  }
    when ("green") { print "Go"    }
    default        { print "Wait"  }
}
# JS: switch(color) { case "red": ... }
```

---

### 9. Loops

```perl
# PERL                                    # JAVASCRIPT

# C-style for
for (my $i = 0; $i < 10; $i++) {          # for (let i = 0; i < 10; i++) {
    print "$i\n";                          #     console.log(i);
}                                          # }

# foreach (most idiomatic)
foreach my $item (@array) {               # for (const item of array) {
    print "$item\n";                       #     console.log(item);
}                                          # }
# "for" and "foreach" are interchangeable in Perl

# while
while (my $line = <$fh>) {               # while (line = reader.read()) {
    chomp $line;                           #     line = line.trim();
    process($line);                        #     process(line);
}                                          # }

# until (reverse while — no JS equivalent)
until ($found) {                           # while (!found) {
    $found = search_next();                #     found = searchNext();
}                                          # }

# do-while
do {                                       # do {
    $input = prompt();                     #     input = prompt();
} while ($input ne 'quit');                # } while (input !== 'quit');

# Loop controls
next;     # JS: continue
last;     # JS: break
redo;     # restart current iteration (no JS equivalent)

# Labeled loops (like labeled statements in JS, rarely used)
OUTER: for my $i (1..10) {
    for my $j (1..10) {
        next OUTER if $j == 5;   # skip to next $i
        last OUTER if $i == 3;   # break out of both loops
    }
}
```

---

## PART 2: Data Structures & File Handling

---

### 10. Complex Data Structures

Since Perl doesn't have native objects like JS, you build complex structures with **references**.

```perl
# ARRAY OF HASHES (AoH) — like an array of objects in JS
my @employees = (
    { name => "Alice",   role => "dev",    salary => 90000 },
    { name => "Bob",     role => "qa",     salary => 80000 },
    { name => "Charlie", role => "devops", salary => 95000 },
);

# Access:
print $employees[0]->{name};      # "Alice"
# JS: employees[0].name

# HASH OF ARRAYS (HoA)
my %teams = (
    backend  => ["Alice", "Bob"],
    frontend => ["Charlie", "Diana"],
);

# Access:
print $teams{backend}[0];         # "Alice"
# JS: teams.backend[0]

# HASH OF HASHES (HoH)
my %config = (
    production => {
        host => "prod.athena.com",
        port => 443,
        db   => { name => "athena_prod", pool => 10 },
    },
    staging => {
        host => "stage.athena.com",
        port => 8443,
    },
);

# Access:
print $config{production}{db}{name};    # "athena_prod"
# JS: config.production.db.name
```

**Interview question:** "How do you pass an array and a hash to a subroutine without them merging?"
Answer: Use references! Without them, `@` and `%` flatten into one list.

```perl
# WRONG — arrays flatten
sub process {
    my (@arr, %hash) = @_;    # %hash gets NOTHING — @arr absorbs everything
}
process(@data, %opts);

# CORRECT — use references
sub process {
    my ($arr_ref, $hash_ref) = @_;
    my @arr  = @$arr_ref;
    my %hash = %$hash_ref;
}
process(\@data, \%opts);
```

---

### 11. File I/O

```perl
# PERL                                    # NODE.JS EQUIVALENT

# Read file
open my $fh, '<', 'data.txt'              # const data = fs.readFileSync('data.txt')
    or die "Cannot open: $!";             #   // or throw error
while (my $line = <$fh>) {               # data.split('\n').forEach(line => {
    chomp $line;                           #     line = line.trimEnd();
    print "$line\n";                       #     console.log(line);
}                                          # });
close $fh;

# Write file
open my $out, '>', 'output.txt'           # fs.writeFileSync('output.txt', content)
    or die "Cannot write: $!";
print $out "Hello World\n";
close $out;

# Append
open my $log, '>>', 'app.log'             # fs.appendFileSync('app.log', msg)
    or die "Cannot append: $!";
print $log "Log entry\n";
close $log;

# Slurp entire file (like readFileSync)
open my $fh, '<', 'file.txt' or die $!;
my $content = do { local $/; <$fh> };     # Unset line separator, read all at once
close $fh;

# Read all lines into array
open my $fh, '<', 'file.txt' or die $!;
my @lines = <$fh>;
chomp @lines;
close $fh;
```

**Three-argument open (modern, secure):**
```perl
# ALWAYS use three-arg open (interview will check this)
open my $fh, '<', $filename or die "Cannot open $filename: $!";

# NEVER do this (two-arg open — security risk):
open FH, $filename;    # vulnerable to shell injection if $filename = "|rm -rf /"
```

---

### 12. String Functions

```perl
# PERL                               # JAVASCRIPT

chomp($str);                          # str.trimEnd() (removes trailing newline)
chop($str);                           # str.slice(0, -1) (removes last char)

my @parts = split(/,/, $str);        # str.split(",")
my $joined = join("-", @parts);       # parts.join("-")

my $sub = substr($str, 0, 5);        # str.substring(0, 5)
substr($str, 0, 5, "HELLO");         # str = "HELLO" + str.substring(5)  (in-place!)

my $pos = index($str, "find");       # str.indexOf("find")
my $pos = rindex($str, "find");      # str.lastIndexOf("find")

my $len = length($str);              # str.length

my $uc = uc($str);                   # str.toUpperCase()
my $lc = lc($str);                   # str.toLowerCase()
my $ucf = ucfirst($str);             # str[0].toUpperCase() + str.slice(1)

my $reversed = reverse($str);        # str.split('').reverse().join('')

# String repetition
my $line = "-" x 40;                  # "-".repeat(40)

# String interpolation (like template literals)
my $msg = "Hello $name, you are $age years old";
# JS: `Hello ${name}, you are ${age} years old`

# Single quotes = no interpolation (like raw strings)
my $raw = 'Hello $name';             # Literally: Hello $name
# JS: String.raw`Hello ${name}` (roughly)
```

---

### 13. Array Functions

Almost all have JS equivalents — you'll pick these up fast.

```perl
# PERL                               # JAVASCRIPT

push @arr, $val;                      # arr.push(val)
my $last = pop @arr;                  # arr.pop()
unshift @arr, $val;                   # arr.unshift(val)
my $first = shift @arr;              # arr.shift()

my @sorted = sort @arr;              # [...arr].sort()
my @sorted = sort { $a <=> $b } @arr; # [...arr].sort((a,b) => a - b)
my @sorted = sort { $b <=> $a } @arr; # [...arr].sort((a,b) => b - a)
my @sorted = sort { lc($a) cmp lc($b) } @arr;  # case-insensitive string sort

my @reversed = reverse @arr;         # [...arr].reverse()

# map — nearly identical to JS
my @doubled = map { $_ * 2 } @arr;   # arr.map(x => x * 2)

# grep — Perl's name for filter
my @evens = grep { $_ % 2 == 0 } @arr; # arr.filter(x => x % 2 === 0)

# splice — identical concept
splice(@arr, 2, 1);                   # arr.splice(2, 1)
splice(@arr, 2, 0, "new");           # arr.splice(2, 0, "new")

# Check existence
if (grep { $_ eq "target" } @arr) {} # arr.includes("target")

# Unique values (no built-in, common pattern)
my %seen;
my @unique = grep { !$seen{$_}++ } @arr;
# JS: [...new Set(arr)]

# Reduce equivalent
use List::Util 'reduce';
my $sum = reduce { $a + $b } @arr;   # arr.reduce((a,b) => a + b)
```

**Interview question:** "What's the difference between `sort { $a <=> $b }` and `sort { $a cmp $b }`?"
Answer: `<=>` is numeric comparison (spaceship operator), `cmp` is string comparison. `<=>` sorts 2 before 10; `cmp` sorts "10" before "2" (lexicographic).

---

### 14. Hash Functions

```perl
# PERL                               # JAVASCRIPT

my @k = keys %hash;                  # Object.keys(hash)
my @v = values %hash;                # Object.values(hash)

if (exists $hash{key}) { ... }       # if ("key" in hash) { ... }
                                      # or: hash.hasOwnProperty("key")

delete $hash{key};                    # delete hash.key

# Iterate
while (my ($k, $v) = each %hash) {   # for (const [k, v] of Object.entries(hash)) {
    print "$k => $v\n";               #     console.log(`${k} => ${v}`);
}                                      # }

# Alternative iteration
for my $key (sort keys %hash) {      # Object.keys(hash).sort().forEach(key => {
    print "$key: $hash{$key}\n";     #     console.log(`${key}: ${hash[key]}`);
}                                      # });

# Hash slice
my @selected = @hash{qw(name age)};  # [hash.name, hash.age]

# Merge hashes
my %merged = (%hash1, %hash2);       # {...hash1, ...hash2}

# Count occurrences (very common pattern)
my %count;
$count{$_}++ for @words;
# JS: words.reduce((acc, w) => ({...acc, [w]: (acc[w]||0)+1}), {})
```

---

## PART 3: Modules, OOP & Error Handling

---

### 15. Modules & Packages

```perl
# PERL                                    # NODE.JS EQUIVALENT

# Using a module
use JSON;                                  # const JSON = require('json');
use File::Basename qw(basename dirname);   # const { basename, dirname } = require('path');
use LWP::UserAgent;                       # const axios = require('axios');

# require (runtime loading)
require "utils.pl";                        # require('./utils');  (CommonJS)

# Creating a module — file: MyApp/Utils.pm
package MyApp::Utils;                      # // myapp/utils.js or utils.mjs
use strict;                                #
use warnings;                              #
use Exporter 'import';                     # module.exports = { ... }
our @EXPORT_OK = qw(add multiply);        #

sub add { return $_[0] + $_[1] }          # exports.add = (a,b) => a + b;
sub multiply { return $_[0] * $_[1] }     # exports.multiply = (a,b) => a * b;

1;  # Module must return true              # (not needed in JS)

# Using it
use MyApp::Utils qw(add multiply);        # const { add, multiply } = require('./utils');
print add(2, 3);                           # console.log(add(2, 3));
```

**Interview question:** "Why does a Perl module end with `1;`?"
Answer: The `use`/`require` statement evaluates the file. If the last expression is false, the module load fails. `1;` ensures it returns true. It's a loading contract.

**`@INC` is like `NODE_PATH`:**
```perl
# Where Perl looks for modules
print join("\n", @INC);

# Add a path at runtime
use lib '/custom/lib/path';                # NODE_PATH=/custom/lib node app.js
push @INC, '/another/path';
```

---

### 16. OOP in Perl (Classical — `bless`)

Perl OOP is manual compared to JS classes, but the concepts map directly.

```perl
# PERL                                    # JAVASCRIPT (ES6)

package Animal;                            # class Animal {
use strict;                                #
use warnings;                              #

sub new {                                  #   constructor(name, sound) {
    my ($class, %args) = @_;              #
    my $self = {                           #
        name  => $args{name},              #     this.name = name;
        sound => $args{sound},             #     this.sound = sound;
    };                                     #
    return bless $self, $class;            #   }  (bless = "make this hash an object")
}

sub speak {                                #   speak() {
    my ($self) = @_;                       #
    return "$self->{name} says $self->{sound}";  #  return `${this.name} says ${this.sound}`;
}                                          #   }

1;                                         # }

# Usage:
my $dog = Animal->new(name => "Rex", sound => "Woof");
print $dog->speak();                       # "Rex says Woof"
# JS: const dog = new Animal("Rex", "Woof"); dog.speak();
```

**What `bless` does:** It takes a reference (usually a hashref) and tags it with a class name. That's literally it. It's saying "this hash IS an Animal now."

```perl
my $obj = bless { x => 1 }, "MyClass";
print ref($obj);    # "MyClass"
# JS analogy: Object.setPrototypeOf({x:1}, MyClass.prototype)
```

**Inheritance:**
```perl
package Dog;
use parent 'Animal';    # Dog extends Animal
# JS: class Dog extends Animal

sub fetch {
    my ($self) = @_;
    return "$self->{name} fetches the ball!";
}

# Override
sub speak {
    my ($self) = @_;
    my $base = $self->SUPER::speak();    # JS: super.speak()
    return "$base (tail wagging)";
}

1;
```

---

### 17. Modern OOP with Moose / Moo

Moose/Moo makes Perl OOP look like TypeScript. Athena Health likely uses this.

```perl
# Moo (lightweight Moose)
package Employee;
use Moo;                                   # Think of this as TypeScript decorators

has 'name'     => (is => 'ro', required => 1);   # readonly string name;
has 'role'     => (is => 'rw', default => sub { 'engineer' });  # let role = 'engineer';
has 'salary'   => (is => 'rw', isa => sub { die "Must be number" unless $_[0] =~ /^\d+$/ });
has 'start_date' => (is => 'ro', lazy => 1, builder => '_build_start_date');

sub _build_start_date {
    return localtime();
}

sub promote {
    my ($self, $raise) = @_;
    $self->salary($self->salary + $raise);
}

1;

# Usage:
my $emp = Employee->new(name => "Shubnit", salary => 100000);
$emp->promote(15000);
print $emp->salary;  # 115000

# JS/TS Equivalent:
# class Employee {
#   readonly name: string;
#   role: string = 'engineer';
#   salary: number;
#   get start_date() { return new Date(); }  // lazy
#   promote(raise: number) { this.salary += raise; }
# }
```

**`is => 'ro'` vs `is => 'rw'`:**
- `ro` = read-only (like `readonly` in TypeScript)
- `rw` = read-write (normal property)

---

### 18. Error Handling — `eval` / `die`

```perl
# PERL                                    # JAVASCRIPT

# die = throw
die "Something went wrong!\n";             # throw new Error("Something went wrong!");

# eval = try/catch
eval {                                     # try {
    open my $fh, '<', 'missing.txt'        #     // risky operation
        or die "Cannot open: $!";          #     throw new Error("Cannot open");
    # process file...                      #     // process...
};                                         # }
if ($@) {                                  # catch (e) {
    print "Caught error: $@\n";            #     console.log("Caught:", e.message);
}                                          # }

# Modern approach: Try::Tiny (like a proper try/catch)
use Try::Tiny;

try {
    dangerous_operation();
} catch {
    warn "Caught error: $_";               # $_ contains the error
} finally {
    cleanup();
};
```

**Interview question:** "What's wrong with `eval` for error handling?"
Answer: Several gotchas:
1. `$@` can be clobbered by destructors or signal handlers between `eval` and the check
2. `$@` can be an empty string if `die ""` was called
3. `$@` is global — nested evals can stomp on each other
That's why `Try::Tiny` is preferred in modern Perl.

---

### 19. DBI — Database Access

```perl
# PERL with DBI                           # NODE.JS with pg/mysql2

use DBI;                                   # const { Client } = require('pg');

# Connect
my $dbh = DBI->connect(                   # const client = new Client({
    "dbi:Pg:dbname=athena;host=localhost", #     database: 'athena',
    "user",                                #     user: 'user',
    "password",                            #     password: 'password',
    { RaiseError => 1, AutoCommit => 1 }   # });
) or die $DBI::errstr;                     # await client.connect();

# Parameterized query (ALWAYS use placeholders — like Node.js $1, $2)
my $sth = $dbh->prepare(                  # const res = await client.query(
    "SELECT name, age FROM patients WHERE age > ?"  # 'SELECT name, age FROM patients WHERE age > $1',
);                                         # );
$sth->execute(30);                        # [30]

# Fetch results
while (my $row = $sth->fetchrow_hashref) { # res.rows.forEach(row => {
    print "$row->{name}: $row->{age}\n";  #     console.log(`${row.name}: ${row.age}`);
}                                          # });

# Insert
$dbh->do(                                 # await client.query(
    "INSERT INTO patients (name, age) VALUES (?, ?)",  # 'INSERT INTO patients (name, age) VALUES ($1, $2)',
    undef,                                 #
    "John", 45                             # ['John', 45]
);                                         # );

# Transaction
$dbh->begin_work;                          # await client.query('BEGIN');
eval {
    $dbh->do("UPDATE accounts SET balance = balance - 100 WHERE id = 1");
    $dbh->do("UPDATE accounts SET balance = balance + 100 WHERE id = 2");
    $dbh->commit;                          # await client.query('COMMIT');
};
if ($@) {
    $dbh->rollback;                        # await client.query('ROLLBACK');
    die "Transaction failed: $@";
}

$dbh->disconnect;                          # await client.end();
```

---

### 20. Testing with Test::More

```perl
# PERL (Test::More)                       # JAVASCRIPT (Jest)

use Test::More tests => 5;                # // jest auto-discovers

# Basic assertions
ok(1 + 1 == 2, "addition works");         # expect(1 + 1).toBe(2);
is(add(2, 3), 5, "add returns 5");        # expect(add(2, 3)).toBe(5);
isnt($x, $y, "x and y differ");           # expect(x).not.toBe(y);
like($str, qr/pattern/, "matches");       # expect(str).toMatch(/pattern/);
is_deeply(\@got, [1,2,3], "arrays match"); # expect(got).toEqual([1,2,3]);

# Grouping
subtest "user creation" => sub {          # describe("user creation", () => {
    plan tests => 2;                       #
    my $user = User->new(name => "Test"); #     const user = new User("Test");
    isa_ok($user, "User");                #     expect(user).toBeInstanceOf(User);
    is($user->name, "Test", "name set");  #     expect(user.name).toBe("Test");
};                                         # });

# Run: prove -v test_file.t              # npx jest
#   or: perl test_file.t
```

---

## PART 4: Interview Coding Questions

---

### Q1. Reverse a string without using `reverse()`

```perl
sub reverse_string {
    my ($str) = @_;
    my $result = '';
    $result = substr($str, $_, 1) . $result for 0 .. length($str) - 1;
    return $result;
}

# Or using split/join:
sub reverse_string_v2 {
    return join '', reverse split //, $_[0];
}
```

---

### Q2. Find duplicates in an array

```perl
sub find_duplicates {
    my @arr = @_;
    my %count;
    $count{$_}++ for @arr;
    return grep { $count{$_} > 1 } keys %count;
}

my @dupes = find_duplicates(1, 2, 3, 2, 4, 3, 5);
print "Duplicates: @dupes\n";    # 2 3
```

**JS equivalent:**
```javascript
const findDuplicates = arr => [...new Set(arr.filter((v,i) => arr.indexOf(v) !== i))];
```

---

### Q3. Parse a CSV file and compute column averages

```perl
#!/usr/bin/perl
use strict;
use warnings;

open my $fh, '<', 'patients.csv' or die "Cannot open: $!";

my $header = <$fh>;
chomp $header;
my @cols = split /,/, $header;

my %totals;
my $count = 0;

while (my $line = <$fh>) {
    chomp $line;
    my @vals = split /,/, $line;
    for my $i (0 .. $#vals) {
        $totals{$cols[$i]} += $vals[$i] if $vals[$i] =~ /^\d+\.?\d*$/;
    }
    $count++;
}
close $fh;

print "Averages ($count records):\n";
for my $col (sort keys %totals) {
    printf "  %s: %.2f\n", $col, $totals{$col} / $count;
}
```

---

### Q4. Implement a hash-based cache with TTL (LRU-like)

```perl
package SimpleCache;
use strict;
use warnings;

sub new {
    my ($class, %args) = @_;
    return bless {
        ttl   => $args{ttl} || 60,
        store => {},
    }, $class;
}

sub set {
    my ($self, $key, $value) = @_;
    $self->{store}{$key} = {
        value   => $value,
        expires => time() + $self->{ttl},
    };
}

sub get {
    my ($self, $key) = @_;
    return undef unless exists $self->{store}{$key};

    if (time() > $self->{store}{$key}{expires}) {
        delete $self->{store}{$key};
        return undef;
    }
    return $self->{store}{$key}{value};
}

sub clear_expired {
    my ($self) = @_;
    my $now = time();
    for my $key (keys %{$self->{store}}) {
        delete $self->{store}{$key} if $now > $self->{store}{$key}{expires};
    }
}

1;
```

---

### Q5. Process a log file — extract errors and group by hour

```perl
#!/usr/bin/perl
use strict;
use warnings;

# Log format: [2024-01-15 14:23:45] ERROR: Connection timeout
open my $fh, '<', 'server.log' or die "Cannot open: $!";

my %errors_by_hour;

while (<$fh>) {
    if (/^\[(\d{4}-\d{2}-\d{2})\s(\d{2}):\d{2}:\d{2}\]\s+ERROR:\s+(.+)/) {
        my ($date, $hour, $msg) = ($1, $2, $3);
        push @{$errors_by_hour{"$date $hour:00"}}, $msg;
    }
}
close $fh;

for my $time (sort keys %errors_by_hour) {
    my $count = scalar @{$errors_by_hour{$time}};
    print "$time — $count errors\n";
    print "  - $_\n" for @{$errors_by_hour{$time}};
}
```

---

### Q6. Build a simple REST API client

```perl
#!/usr/bin/perl
use strict;
use warnings;
use LWP::UserAgent;
use JSON;
use URI;

my $ua = LWP::UserAgent->new(timeout => 10);
# Like: const axios = require('axios').create({ timeout: 10000 });

# GET request
my $response = $ua->get('https://api.example.com/patients/123');

if ($response->is_success) {
    my $data = decode_json($response->decoded_content);
    print "Patient: $data->{name}\n";
} else {
    die "API error: " . $response->status_line;
}

# POST request (like axios.post)
my $payload = encode_json({
    name  => "Jane Doe",
    dob   => "1990-05-15",
    notes => "New patient intake",
});

my $res = $ua->post(
    'https://api.example.com/patients',
    'Content-Type' => 'application/json',
    Content         => $payload,
);
```

---

### Q7. Implement FizzBuzz (classic, but with Perl idioms)

```perl
# Idiomatic Perl — one-liner style
print( ($_ % 15 == 0) ? "FizzBuzz" :
       ($_ % 3  == 0) ? "Fizz" :
       ($_ % 5  == 0) ? "Buzz" : $_ ), print "\n"
    for 1..100;

# Clean subroutine version
sub fizzbuzz {
    my ($n) = @_;
    my @result;
    for my $i (1..$n) {
        if    ($i % 15 == 0) { push @result, "FizzBuzz" }
        elsif ($i % 3  == 0) { push @result, "Fizz" }
        elsif ($i % 5  == 0) { push @result, "Buzz" }
        else                 { push @result, $i }
    }
    return @result;
}
```

---

### Q8. Two Sum (hash-based O(n) solution)

```perl
sub two_sum {
    my ($nums_ref, $target) = @_;
    my %seen;

    for my $i (0 .. $#$nums_ref) {
        my $complement = $target - $nums_ref->[$i];
        if (exists $seen{$complement}) {
            return ($seen{$complement}, $i);
        }
        $seen{$nums_ref->[$i]} = $i;
    }
    return ();
}

my @result = two_sum([2, 7, 11, 15], 9);
print "Indices: @result\n";    # 0 1
```

---

### Q9. Recursively search directories for files matching a pattern

```perl
use File::Find;

my @matches;
find(
    sub {
        push @matches, $File::Find::name if /\.pl$|\.pm$/;
    },
    '/path/to/search'
);

print "$_\n" for sort @matches;

# Node.js equivalent:
# const glob = require('glob');
# glob('**/*.{pl,pm}', (err, files) => console.log(files));
```

---

### Q10. Closure & higher-order function (to show JS knowledge transfer)

```perl
# Perl closures work exactly like JS closures
sub make_counter {
    my $count = 0;                    # captured by closure
    return sub { return ++$count };   # anonymous sub = arrow function
}

my $counter = make_counter();
print $counter->();  # 1
print $counter->();  # 2
print $counter->();  # 3

# JS equivalent:
# const makeCounter = () => {
#     let count = 0;
#     return () => ++count;
# };
```

---

## PART 5: Athena Health Context

### Why Perl at Athena Health?

Athena Health's platform (athenaNet) was originally built with **Perl** for backend services, patient data processing, and billing/claims workflows. Key areas:

1. **HL7/FHIR message parsing** — healthcare data exchange uses fixed-width and delimited formats. Perl's regex is ideal.
2. **ETL pipelines** — transforming and loading patient/claims data.
3. **Legacy API layer** — many internal services still run Perl.
4. **Report generation** — complex text processing and templating.
5. **Batch processing** — nightly jobs for claims, billing, eligibility checks.

### Questions They May Ask About Your Background

1. "How would you migrate a Perl service to Node.js?" — Talk about gradual migration, API compatibility layers, testing parity.
2. "How would you containerize a Perl application?" — You know Docker. The Dockerfile uses `perl:5.38`, installs CPAN deps via `cpanm`, and runs the script.
3. "How would you set up CI/CD for Perl?" — Jenkins pipeline with `prove` for testing, Docker build, K8s deploy.

### Sample Dockerfile for Perl (use your Docker knowledge):
```dockerfile
FROM perl:5.38-slim
RUN cpanm --notest DBI DBD::Pg JSON LWP::UserAgent Test::More
WORKDIR /app
COPY . .
CMD ["perl", "app.pl"]
```

### Sample Jenkinsfile for Perl:
```groovy
pipeline {
    agent { docker { image 'perl:5.38' } }
    stages {
        stage('Install') { steps { sh 'cpanm --installdeps .' } }
        stage('Test')    { steps { sh 'prove -v -r t/' } }
        stage('Build')   { steps { sh 'docker build -t athena-app .' } }
    }
}
```

---

## PART 6: Quick Reference — Perl One-Liners

One-liners come up in interviews and are useful for healthcare data processing.

```bash
# Print lines matching a pattern (like grep but with Perl power)
perl -ne 'print if /ERROR/' server.log

# Replace text in a file (in-place, like sed)
perl -pi -e 's/oldtext/newtext/g' config.txt

# Sum a column from CSV
perl -F, -ane '$sum += $F[2]; END { print "$sum\n" }' data.csv

# Print unique lines (preserving order)
perl -ne 'print unless $seen{$_}++' data.txt

# Count word frequencies
perl -ne 'for (split /\W+/) { $c{lc $_}++ } END { print "$_ $c{$_}\n" for sort keys %c }' doc.txt

# Extract fields from colon-separated file (like /etc/passwd)
perl -F: -ane 'print "$F[0]\n"' /etc/passwd

# Convert JSON to CSV (one-liner!)
perl -MJSON -e 'my @d = @{decode_json(do{local $/;<STDIN>})}; print join(",", keys %{$d[0]}), "\n"; print join(",", @{$_}{keys %{$d[0]}}), "\n" for @d'
```

**Flags cheat sheet:**
```
-e    Execute code from command line
-n    Wrap in while(<>) loop (read STDIN line by line)
-p    Like -n but also prints $_ at end
-i    In-place editing
-a    Auto-split into @F
-F    Set field separator (used with -a)
-l    Auto-chomp and add newline
```

---

## PART 7: Tricky Interview Questions (Theory)

### Q: "What are the differences between `my`, `local`, and `our`?"

```perl
my $x = 10;      # Lexical scope (like let/const in JS)
                  # Visible only in current block. THIS IS WHAT YOU ALMOST ALWAYS WANT.

local $x = 10;   # Dynamic scope (no JS equivalent)
                  # Temporarily overrides a global for the current scope AND callees.
                  # Reverts when scope exits.

our $x = 10;     # Package global (like window.x in browser JS)
                  # Declares a package variable accessible everywhere.
```

### Q: "What is autovivification?"

```perl
# Perl automatically creates intermediate data structures when you access nested keys
my %data;
$data{users}{shubnit}{role} = "engineer";  # creates all intermediate hashes!
# JS: you'd need data.users = {}; data.users.shubnit = {}; first

# This is POWERFUL but can create unwanted keys:
if ($data{users}{nonexistent}{name}) { ... }
# ^ This creates $data{users}{nonexistent} as an empty hashref! (side effect)
```

### Q: "What is the difference between `use` and `require`?"

```perl
use Module;    # Compile-time. Calls Module->import(). Like static import in JS.
require Module; # Runtime. Does NOT call import(). Like dynamic require() in Node.js.

# use Module qw(func1 func2);
# is equivalent to:
# BEGIN { require Module; Module->import('func1', 'func2'); }
```

### Q: "Explain Perl's garbage collection."

Answer: Perl uses **reference counting** (not mark-and-sweep like JS V8). Every variable has a refcount. When it drops to 0, memory is freed immediately. **Circular references** are the main gotcha — they leak. Use `Scalar::Util::weaken` to break cycles (like JS WeakRef/WeakMap).

```perl
use Scalar::Util 'weaken';

my $parent = { name => "parent" };
my $child  = { name => "child", parent => $parent };
$parent->{child} = $child;    # circular reference!

weaken($parent->{child});     # break the cycle — like WeakRef in JS
```

### Q: "What is `qw//`?"

```perl
my @list = qw(apple banana cherry);
# Equivalent to: my @list = ("apple", "banana", "cherry");
# It's a "quote words" shortcut — splits on whitespace, no commas needed.
```

### Q: "Explain hash slices."

```perl
my %user = (name => "Shubnit", age => 25, role => "dev", city => "Gurugram");

# Get multiple values at once
my @info = @user{qw(name role)};          # ("Shubnit", "dev")
# JS: [user.name, user.role]  or  Object.values(pick(user, ['name','role']))

# Assign multiple values at once
@user{qw(age city)} = (26, "Bangalore");  # update both at once
```

### Q: "What happens when you use an array in boolean context?"

```perl
my @empty = ();
my @full  = (1, 2, 3);

if (@empty) { print "yes" }  # does NOT print (0 is false)
if (@full)  { print "yes" }  # PRINTS (3 is true)
# In boolean context, an array returns its length — 0 is false, nonzero is true

# JS equivalent:
# [].length ? true : false     (JS arrays are always truthy even when empty!)
# This is a KEY DIFFERENCE between Perl and JS.
```

---

## PART 8: Cheat Sheet — Perl vs JS Quick Lookup

| Concept | Perl | JavaScript |
|---------|------|-----------|
| Declare variable | `my $x = 5;` | `let x = 5;` |
| Array | `my @a = (1,2,3);` | `let a = [1,2,3];` |
| Hash/Object | `my %h = (k => "v");` | `let h = {k: "v"};` |
| String concat | `.` (dot) | `+` |
| String repeat | `"x" x 5` | `"x".repeat(5)` |
| Print | `print "hello\n";` | `console.log("hello");` |
| Interpolation | `"Hello $name"` | `` `Hello ${name}` `` |
| Array length | `scalar @arr` | `arr.length` |
| Last index | `$#arr` | `arr.length - 1` |
| Regex match | `$s =~ /pat/` | `/pat/.test(s)` |
| Regex replace | `$s =~ s/a/b/g` | `s.replaceAll("a","b")` |
| Map | `map { ... } @arr` | `arr.map(x => ...)` |
| Filter | `grep { ... } @arr` | `arr.filter(x => ...)` |
| Sort numeric | `sort { $a <=> $b }` | `.sort((a,b) => a-b)` |
| Hash keys | `keys %h` | `Object.keys(h)` |
| Check key | `exists $h{k}` | `"k" in h` |
| Function def | `sub foo { ... }` | `function foo() {...}` |
| Anonymous fn | `sub { ... }` | `() => { ... }` |
| Error throw | `die "msg"` | `throw new Error("msg")` |
| Try/catch | `eval { ... }; if ($@)` | `try {...} catch(e)` |
| File read | `open my $f, '<', $p` | `fs.readFileSync(p)` |
| Class | `package + bless` | `class` |
| Inheritance | `use parent 'Base'` | `extends Base` |
| Import | `use Module qw(fn)` | `import {fn} from 'm'` |
| Null check | `defined $x` | `x !== null && x !== undefined` |
| Falsy values | `0, "", undef, "0"` | `0, "", null, undefined, NaN, false` |
| Ternary | `$x ? "y" : "n"` | `x ? "y" : "n"` |

---

> **Final tip:** In the interview, actively mention your JS parallels. Say things like
> "This is similar to how closures work in JavaScript" or "Perl's DBI is like
> Node's pg driver." It shows you learn by connecting concepts — exactly what
> Athena Health wants for someone transitioning into their Perl stack.

Good luck, Shubnit! 🎯
