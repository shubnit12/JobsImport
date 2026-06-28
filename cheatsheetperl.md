# 🎯 PERL MASTER CHEAT SHEET — Athena Health Interview

> Complete reference for a JS/Node.js dev. Everything we covered + everything
> else interviewers ask. Sections marked 🔥 are high-frequency. ⚠️ = gotcha.

---

# TABLE OF CONTENTS

1. [Quick Syntax Lookup (Perl ↔ JS)](#1-quick-syntax-lookup)
2. [Variables & Sigils](#2-variables--sigils)
3. [Context — Scalar vs List 🔥](#3-context)
4. [my / our / local / state 🔥](#4-scoping)
5. [Operators](#5-operators)
6. [References & Dereferencing 🔥](#6-references)
7. [Data Structures](#7-data-structures)
8. [Control Flow & Loops](#8-control-flow)
9. [Subroutines & @_ 🔥](#9-subroutines)
10. [Special Variables](#10-special-variables)
11. [String Functions](#11-string-functions)
12. [Array Functions](#12-array-functions)
13. [Hash Functions](#13-hash-functions)
14. [Regular Expressions 🔥](#14-regex)
15. [File I/O & File Tests](#15-file-io)
16. [Modules & Packages](#16-modules)
17. [OOP — bless & $self 🔥](#17-oop)
18. [Moose 🔥](#18-moose)
19. [Error Handling 🔥](#19-error-handling)
20. [DBI — Database 🔥](#20-dbi)
21. [Testing](#21-testing)
22. [One-Liners](#22-one-liners)
23. [Advanced Idioms](#23-advanced-idioms)
24. [Healthcare-Specific (HL7, Fixed-Width)](#24-healthcare)
25. [⚠️ THE GOTCHAS SECTION 🔥](#25-gotchas)
26. [Ready-to-Use Code Patterns](#26-code-patterns)
27. [Behavioral / HR Prep (Athena + Agile Axis)](#27-behavioral)

---

<a name="1-quick-syntax-lookup"></a>
# 1. QUICK SYNTAX LOOKUP (Perl ↔ JS)

| Concept | Perl | JavaScript |
|---------|------|-----------|
| Scalar | `my $x = 5;` | `let x = 5;` |
| Array | `my @a = (1,2,3);` | `let a = [1,2,3];` |
| Hash | `my %h = (k => "v");` | `let h = {k:"v"};` |
| String concat | `$a . $b` | `a + b` |
| String repeat | `"ab" x 3` | `"ab".repeat(3)` |
| Interpolation | `"Hi $name"` | `` `Hi ${name}` `` |
| No interpolation | `'Hi $name'` | `'Hi $name'` |
| Print | `print "hi\n";` | `console.log("hi");` |
| Array length | `scalar @a` | `a.length` |
| Last index | `$#a` | `a.length - 1` |
| Comment | `# comment` | `// comment` |
| Block comment | `=pod ... =cut` | `/* ... */` |
| Ternary | `$x ? "y" : "n"` | `x ? "y" : "n"` |
| Equality (num) | `==` | `===` |
| Equality (str) | `eq` | `===` |
| Function | `sub f { }` | `function f() {}` |
| Anonymous fn | `sub { }` | `() => {}` |
| Throw | `die "msg"` | `throw new Error("msg")` |
| Try/catch | `eval{}; if($@){}` | `try{}catch(e){}` |
| Class | `package + bless` | `class` |
| Inherit | `use parent 'X'` | `extends X` |
| Import | `use M qw(f)` | `import {f} from 'm'` |
| Null | `undef` | `undefined`/`null` |
| Defined check | `defined $x` | `x != null` |
| Regex test | `$s =~ /re/` | `/re/.test(s)` |
| Regex replace | `$s =~ s/a/b/g` | `s.replaceAll("a","b")` |
| map | `map { } @a` | `a.map(x => )` |
| filter | `grep { } @a` | `a.filter(x => )` |
| Comparison op | `<=>` (num), `cmp` (str) | `a - b` |

---

<a name="2-variables--sigils"></a>
# 2. VARIABLES & SIGILS

```perl
my $scalar = "single value";       # $ = scalar (string, number, or reference)
my @array  = (1, 2, 3);            # @ = array (ordered list)
my %hash   = (key => "value");     # % = hash (key-value pairs)
```

**⚠️ THE GOLDEN RULE: The sigil matches what you GET, not what you HAVE.**

```perl
my @array = (10, 20, 30);
$array[0];       # $ — getting ONE element (a scalar)        → 10
@array[0,2];     # @ — getting a SLICE (a list)              → (10, 30)
$#array;         # last index                                → 2
scalar @array;   # count                                     → 3

my %hash = (a => 1, b => 2, c => 3);
$hash{a};        # $ — getting ONE value                     → 1
@hash{qw(a b)};  # @ — getting a SLICE (a list)              → (1, 2)
keys %hash;      # all keys                                  → (a, b, c)
```

---

<a name="3-context"></a>
# 3. CONTEXT — SCALAR vs LIST 🔥 (Perl's #1 unique concept)

> Every operation happens in either **scalar** or **list** context.
> The SAME code behaves differently depending on context.
> **There is no JS equivalent — this is the thing that trips up JS devs most.**

```perl
my @arr = (1, 2, 3, 4, 5);

# LIST context — array expands to its elements
my @copy = @arr;              # (1,2,3,4,5)
my ($first) = @arr;           # 1 (parentheses = list context, takes first)

# SCALAR context — array returns its LENGTH
my $count = @arr;             # 5
print "Size: " . @arr;        # "Size: 5"  (. forces scalar)
if (@arr) { }                 # true if non-empty (length > 0)

# Force context explicitly
my $n = scalar @arr;          # force scalar → 5
```

**What forces which context:**

| Forces SCALAR context | Forces LIST context |
|----------------------|---------------------|
| `my $x = ...` | `my @x = ...` |
| `scalar ...` | `my ($x) = ...` (note parens!) |
| `.` concatenation | `(...)` parentheses |
| `+ - * /` math | function args |
| `if`, `while` conditions | `for`/`foreach` lists |
| `==`, `eq` comparisons | array/hash assignment |

**`wantarray()` — detect caller's context inside a sub:**

```perl
sub get_data {
    if (wantarray()) {
        return (1, 2, 3);        # caller wants a list
    } else {
        return "scalar result";  # caller wants a scalar
    }
}
my @list = get_data();   # (1, 2, 3)
my $str  = get_data();   # "scalar result"
# wantarray returns: true (list), false/"" (scalar), undef (void context)
```

---

<a name="4-scoping"></a>
# 4. my / our / local / state 🔥

```perl
my $x = 10;       # LEXICAL scope — like let/const. Use this 99% of the time.
                  # Visible only within the enclosing block { }.

our $x = 10;      # PACKAGE GLOBAL — like a top-level var / window.x.
                  # Declares/aliases a package variable, visible across files.

local $x = 10;    # DYNAMIC scope — NO JS equivalent.
                  # Temporarily overrides a GLOBAL, restores it when scope exits.
                  # Callees see the temporary value.

state $x = 10;    # PERSISTENT (5.10+) — like a static var.
                  # Keeps its value between sub calls, initialized once.
```

**`state` example (like a closure-captured counter, but simpler):**

```perl
use feature 'state';
sub counter {
    state $count = 0;     # initialized ONCE, persists across calls
    return ++$count;
}
counter();  # 1
counter();  # 2
counter();  # 3
```

**`local` — the classic use case (temporarily change a global special var):**

```perl
sub read_whole_file {
    my ($filename) = @_;
    open my $fh, '<', $filename or die $!;
    local $/;              # temporarily undef the line separator (slurp mode)
    return <$fh>;          # reads ENTIRE file
}                          # $/ automatically restored here
```

**Why `local` and not `my` for special vars?** Special variables like `$/`, `$_`, `$\`, `@ARGV` are package globals — you can't `my` them. `local` is how you safely override them.

---

<a name="5-operators"></a>
# 5. OPERATORS

## ⚠️ String vs Numeric (the eq/== trap)

```perl
# NUMERIC    STRING    MEANING
# ==         eq        equal
# !=         ne        not equal
# <          lt        less than
# >          gt        greater than
# <=         le        less or equal
# >=         ge        greater or equal
# <=>        cmp       comparison (returns -1, 0, 1)

# ⚠️ TRAP:
"apple" == "banana"    # TRUE! Both are 0 numerically. Use eq!
"apple" eq "banana"    # false (correct)
10 == 10.0             # true
"10" eq "10.0"         # false (different strings)
```

## Logical & Assignment Operators

```perl
# Logical
$a && $b      # and (returns last evaluated value)
$a || $b      # or  (returns first truthy)
!$a           # not
$a and $b     # low-precedence and (for flow control)
$a or  $b     # low-precedence or  → open(...) or die;

# Defined-or (5.10+) — checks DEFINEDNESS, not truthiness
$a // $b      # if $a is defined use it, else $b (0 and "" are kept!)

# Assignment shortcuts
$x ||= 5;     # $x = $x || 5   (set if falsy)
$x //= 5;     # $x = $x // 5   (set if undefined) ← preferred for defaults
$x += 5;      # $x = $x + 5
$x .= "!";    # $x = $x . "!"  (string append)
$x **= 2;     # exponent
$x x= 3;      # string repeat-assign
```

**⚠️ `||` vs `//` for defaults:**

```perl
my $count = $input || 10;    # if $input is 0, you get 10 (BUG if 0 is valid!)
my $count = $input // 10;    # if $input is 0, you keep 0 (only undef → 10)
```

## Other Operators

```perl
$str x $n          # repeat string: "ab" x 3 → "ababab"
(list) x $n        # repeat list: (0) x 3 → (0, 0, 0)
$a .. $b           # range: 1..5 → (1,2,3,4,5); 'a'..'e' → (a,b,c,d,e)
$s =~ /pat/        # regex bind (match)
$s !~ /pat/        # regex bind (no match)
$ref->{key}        # arrow: dereference + access
\$x  \@a  \%h      # backslash: create reference
```

---

<a name="6-references"></a>
# 6. REFERENCES & DEREFERENCING 🔥

> References are Perl's pointers. They're how you build nested data and pass
> data structures to subs without flattening.

## Creating References

```perl
# Reference to existing variables (backslash)
my $sref = \$scalar;
my $aref = \@array;
my $href = \%hash;
my $cref = \&subroutine;     # reference to a sub

# Anonymous references (literals) — most common
my $aref = [1, 2, 3];               # anon array ref     (like JS [])
my $href = { name => "John" };      # anon hash ref      (like JS {})
my $cref = sub { return $_[0]*2 };  # anon sub (closure) (like JS () => {})
```

## Dereferencing

```perl
# Scalar ref
my $x = 5; my $ref = \$x;
$$ref;           # 5     (or ${$ref})

# Array ref
my $aref = [10, 20, 30];
@$aref;          # (10,20,30)   — whole array
$$aref[0];       # 10           — one element (old style)
$aref->[0];      # 10           — one element (PREFERRED arrow style)
scalar @$aref;   # 3            — length
@{$aref}[0,1];   # (10,20)      — slice

# Hash ref
my $href = { a => 1, b => 2 };
%$href;          # (a,1,b,2)    — whole hash
$$href{a};       # 1            — one value (old style)
$href->{a};      # 1            — one value (PREFERRED arrow style)
keys %$href;     # (a, b)

# Code ref
my $cref = sub { $_[0] + $_[1] };
$cref->(2, 3);   # 5            — call it (PREFERRED)
&$cref(2, 3);    # 5            — old style
```

## The Arrow Rule

```perl
my $data = {
    users => [
        { name => "Alice", roles => ["admin", "user"] },
    ],
};
# Arrow is OPTIONAL between adjacent brackets ] [ or } {
$data->{users}->[0]->{name};   # explicit
$data->{users}[0]{name};       # same thing, cleaner    → "Alice"
$data->{users}[0]{roles}[1];   #                        → "user"
```

## `ref()` — Check Reference Type

```perl
ref($aref);    # "ARRAY"
ref($href);    # "HASH"
ref($cref);    # "CODE"
ref($sref);    # "SCALAR"
ref($obj);     # "Patient"  (blessed → returns class name)
ref("string"); # ""         (not a reference → empty string)
```

**⚠️ `\@array` vs `[@array]`:**
```perl
my @orig = (1, 2, 3);
my $ref1 = \@orig;       # reference TO original (changes reflect back)
my $ref2 = [@orig];      # NEW anonymous array (shallow COPY)
push @$ref1, 4;          # @orig is now (1,2,3,4)
push @$ref2, 99;         # @orig unchanged
```

---

<a name="7-data-structures"></a>
# 7. DATA STRUCTURES (built with references)

```perl
# ── ARRAY OF HASHES (AoH) — like array of objects ──
my @employees = (
    { name => "Alice", role => "dev"    },
    { name => "Bob",   role => "devops" },
);
$employees[0]{name};                # "Alice"
push @employees, { name => "Carol", role => "qa" };
for my $emp (@employees) {
    print "$emp->{name}: $emp->{role}\n";
}

# ── HASH OF ARRAYS (HoA) ──
my %teams = (
    backend  => ["Alice", "Bob"],
    frontend => ["Carol"],
);
$teams{backend}[0];                 # "Alice"
push @{$teams{frontend}}, "Dave";   # add to a nested array (note @{...})

# ── HASH OF HASHES (HoH) — like nested config object ──
my %config = (
    prod => { host => "p.com", port => 443, db => { name => "main" } },
    dev  => { host => "d.com", port => 8443 },
);
$config{prod}{db}{name};            # "main"

# ── Iterate nested ──
for my $env (sort keys %config) {
    print "$env => $config{$env}{host}\n";
}
```

**⚠️ Use `@{...}` / `%{...}` to deref a nested structure in a loop:**
```perl
for my $name (@{$teams{backend}}) { ... }     # loop over nested array
while (my ($k,$v) = each %{$config{prod}}) { ... }  # loop over nested hash
```

---

<a name="8-control-flow"></a>
# 8. CONTROL FLOW & LOOPS

```perl
# if / elsif / else
if ($x > 10)    { ... }
elsif ($x > 5)  { ... }
else            { ... }

# unless (= if not)
unless ($valid) { die "invalid" }

# Postfix (idiomatic Perl)
print "hi\n" if $debug;
die "bad" unless $ok;
$sum += $_ for @nums;
print "$_\n" foreach @list;

# Ternary (chainable)
my $grade = $score >= 90 ? "A"
          : $score >= 80 ? "B"
          : $score >= 70 ? "C"
          :                "F";

# given/when (5.10+ switch — experimental, often avoided)
use feature 'switch';
given ($status) {
    when ('active')   { ... }
    when (/^pend/)    { ... }     # regex match
    default           { ... }
}
```

```perl
# ── LOOPS ──
for (my $i = 0; $i < 10; $i++) { ... }       # C-style
foreach my $item (@array)      { ... }        # foreach (idiomatic)
for my $item (@array)          { ... }        # 'for' == 'foreach'
while (my $line = <$fh>)       { ... }        # while
until ($done)                  { ... }        # until (= while not)
do { ... } while ($cond);                      # do-while
do { ... } until ($cond);                      # do-until

# Loop control
next;        # JS: continue
last;        # JS: break
redo;        # restart current iteration (no JS equiv)

# Labels (for nested loops)
OUTER: for my $i (1..3) {
    INNER: for my $j (1..3) {
        next OUTER if $j == 2;   # continue outer loop
        last OUTER if $i == 3;   # break out of both
    }
}
```

**⚠️ `for (1..1_000_000)` is fine — Perl optimizes ranges in `for`, no array built.**

---

<a name="9-subroutines"></a>
# 9. SUBROUTINES & @_ 🔥

```perl
# @_ holds ALL arguments (like JS "arguments")
sub greet {
    my ($name, $greeting) = @_;       # unpack named params
    $greeting //= "Hello";            # default value
    return "$greeting, $name!";
}
greet("Shubnit");              # "Hello, Shubnit!"
greet("Shubnit", "Hi");        # "Hi, Shubnit!"

# Variadic (all args)
sub sum {
    my $total = 0;
    $total += $_ for @_;       # @_ = all args
    return $total;
}
sum(1, 2, 3, 4);               # 10

# shift defaults to @_ inside a sub
sub new {
    my $class = shift;         # first arg
    my %args  = @_;            # rest as hash
    ...
}

# Modern signatures (5.20+, was experimental)
use feature 'signatures';
no warnings 'experimental::signatures';
sub add ($a, $b = 0) {         # named params + defaults, like JS!
    return $a + $b;
}
```

**⚠️ Pass arrays/hashes BY REFERENCE to avoid flattening:**
```perl
# WRONG — both flatten into @_, %opts gets nothing
sub process { my (@list, %opts) = @_; }
process(@items, %settings);        # BROKEN

# RIGHT — pass references
sub process { my ($list, $opts) = @_; my @list = @$list; my %opts = %$opts; }
process(\@items, \%settings);      # works
```

**Returning values:**
```perl
return $scalar;          # scalar
return @array;           # list (in list context) or count (in scalar context)
return %hash;            # flattened list
return \@array;          # reference (preferred for big data)
return wantarray ? @list : \@list;   # context-aware
# Bare "return;" returns undef (scalar ctx) or () (list ctx) — NOT "return undef"!
```

**⚠️ Never write `return undef;`** — in list context it becomes a 1-element list `(undef)` which is TRUE. Use bare `return;`.

---

<a name="10-special-variables"></a>
# 10. SPECIAL VARIABLES (no JS equivalent — memorize top ones)

| Variable | Meaning | JS-ish analogy |
|----------|---------|----------------|
| `$_` | Default variable ("it") | implicit loop var |
| `@_` | Sub arguments | `arguments` |
| `$0` | Script name | `process.argv[1]` |
| `@ARGV` | Command-line args | `process.argv.slice(2)` |
| `%ENV` | Environment vars | `process.env` |
| `$!` | System/OS error (errno) | `err.message` (syscall) |
| `$@` | Last `eval`/`die` error | `catch (e)` |
| `$?` | Child process exit status | exit code |
| `$$` | Current process ID | `process.pid` |
| `$/` | Input record separator | line delimiter (default `\n`) |
| `$\` | Output record separator | (auto-append on print) |
| `$,` | Output field separator | print join separator |
| `$"` | List separator in strings | `arr.join(" ")` default |
| `$.` | Current input line number | — |
| `$&` | Entire last regex match | `RegExp.lastMatch` |
| `$1,$2…` | Regex capture groups | `match[1], match[2]` |
| `$+{name}` | Named capture | `match.groups.name` |
| `@INC` | Module search paths | `NODE_PATH` |
| `%SIG` | Signal handlers | `process.on('SIGINT')` |

**`$_` — the "it" variable (auto-used by many functions):**
```perl
for (@nums) { print "$_\n"; }              # $_ = each element
my @x = map { $_ * 2 } @nums;              # $_ = each element
my @y = grep { $_ > 5 } @nums;             # $_ = each element
while (<$fh>) { chomp; print; }            # $_ = each line; chomp/print use $_
print for @list;                           # print $_ implicitly
```

---

<a name="11-string-functions"></a>
# 11. STRING FUNCTIONS

```perl
length($s)                  # s.length
uc($s)  lc($s)              # toUpperCase / toLowerCase
ucfirst($s)  lcfirst($s)    # capitalize / decapitalize first char
reverse($s)                 # ⚠️ in SCALAR context reverses string; in LIST reverses list
index($s, "x")              # s.indexOf("x")  (-1 if not found)
rindex($s, "x")             # s.lastIndexOf("x")
substr($s, $start, $len)    # s.substring  (also assignable!)
substr($s, 0, 3) = "ABC";   # in-place replacement (no JS equiv)
sprintf("%05.2f", $n)       # formatted string (see below)
join(",", @list)            # list.join(",")
split(/,/, $s)              # s.split(",")
split(/,/, $s, 3)           # limit to 3 pieces
split(//, $s)               # explode into chars
chomp($s)                   # remove trailing newline (modifies in place, returns # removed)
chop($s)                    # remove LAST char regardless (modifies in place)
"ab" x 3                    # "ababab"  (repeat)
ord("A")  chr(65)           # char ↔ code point  (65 ↔ "A")
sprintf("%s costs %d", $item, $price)
```

**`sprintf`/`printf` format specifiers (frequently asked):**
```perl
sprintf("%d",    42)       # "42"        integer
sprintf("%05d",  42)       # "00042"     zero-padded width 5
sprintf("%-5d|", 42)       # "42   |"    left-justified
sprintf("%+d",   42)       # "+42"       force sign
sprintf("%.2f",  3.14159)  # "3.14"      2 decimal places
sprintf("%8.2f", 3.14159)  # "    3.14"  width 8, 2 decimals
sprintf("%x",    255)      # "ff"        hex
sprintf("%o",    8)        # "10"        octal
sprintf("%b",    5)        # "101"       binary
sprintf("%e",    1234.5)   # "1.2345e+03" scientific
sprintf("%s",    "hi")     # "hi"        string
sprintf("%%")              # "%"         literal percent
sprintf("%3\$s %1\$s", "a","b","c")  # positional args → "c a"
```

**Heredocs (multi-line strings):**
```perl
my $sql = <<"END_SQL";          # double-quote: interpolated
    SELECT * FROM patients
    WHERE id = $patient_id
END_SQL

my $raw = <<'END';              # single-quote: literal, no interpolation
    Literal $text here
END

my $indented = <<~END;          # 5.26+: strips leading indentation
    Auto-dedented
    text block
    END
```

---

<a name="12-array-functions"></a>
# 12. ARRAY FUNCTIONS

```perl
push    @a, $x;          # a.push(x)        — add to end
pop     @a;              # a.pop()          — remove from end
unshift @a, $x;          # a.unshift(x)     — add to front
shift   @a;              # a.shift()        — remove from front
splice(@a, $i, $len);    # a.splice(i, len) — remove
splice(@a, $i, 0, $x);   # a.splice(i,0,x)  — insert
reverse @a;              # [...a].reverse()
sort @a;                 # default: STRING sort!  ⚠️
sort { $a <=> $b } @a;   # numeric ascending
sort { $b <=> $a } @a;   # numeric descending
sort { $a cmp $b } @a;   # string ascending (explicit)
join("-", @a);           # a.join("-")
grep { COND } @a;        # a.filter(x => COND)    — uses $_
map  { EXPR } @a;        # a.map(x => EXPR)       — uses $_
wantarray;               # context check
$#a;                     # last index (length - 1)
scalar @a;               # length

# List::Util — import these (like lodash)
use List::Util qw(sum sum0 max min first reduce uniq any all none shuffle);
sum(@nums);              # ⚠️ undef on empty list
sum0(@nums);             # 0 on empty list (safer)
max(@nums);  min(@nums);
first { $_ > 5 } @nums;  # first match (like Array.find)
reduce { $a + $b } @nums;# a.reduce((a,b)=>a+b)
uniq(@list);             # dedupe (preserves order)
any { $_ > 5 } @nums;    # a.some(x => x > 5)
all { $_ > 0 } @nums;    # a.every(x => x > 0)
none { $_ < 0 } @nums;   # !a.some(x => x < 0)
```

**⚠️ Default `sort` is STRING sort:**
```perl
sort (10, 2, 1, 20)               # (1, 10, 2, 20) — WRONG for numbers!
sort { $a <=> $b } (10, 2, 1, 20) # (1, 2, 10, 20) — correct
```

**Dedupe idiom (no List::Util):**
```perl
my %seen;
my @unique = grep { !$seen{$_}++ } @arr;
# JS: [...new Set(arr)]
```

---

<a name="13-hash-functions"></a>
# 13. HASH FUNCTIONS

```perl
keys   %h;               # Object.keys(h)
values %h;               # Object.values(h)
exists $h{k};            # "k" in h        — does KEY exist?
defined $h{k};           # h.k != null     — is VALUE defined?
delete $h{k};            # delete h.k
each %h;                 # iterator → ($key, $value) pairs

# Iterate (two ways)
while (my ($k, $v) = each %h) { print "$k=$v\n"; }    # iterator
for my $k (sort keys %h)      { print "$k=$h{$k}\n"; } # sorted (preferred)

# Hash slices
@h{qw(a b c)};                  # get multiple values → (1,2,3)
@h{qw(x y)} = (10, 20);         # set multiple at once

# Merge (later wins)
my %merged = (%defaults, %overrides);    # {...defaults, ...overrides}

# Invert (swap keys/values)
my %inverted = reverse %h;

# Count occurrences (classic pattern)
my %count;
$count{$_}++ for @words;        # autovivification handles the 0 case

# Check empty
if (%h) { }                     # true if hash has any keys
keys %h == 0;                   # explicit empty check
```

**⚠️ `exists` vs `defined` vs truthiness:**
```perl
my %h = (a => 0, b => undef, c => "");
exists  $h{a};   # true  (key present)
defined $h{a};   # true  (value is 0, which is defined)
$h{a};           # FALSE (0 is falsy) ← the trap
exists  $h{b};   # true  (key present)
defined $h{b};   # false (value is undef)
exists  $h{z};   # false (no such key)
```

---

<a name="14-regex"></a>
# 14. REGULAR EXPRESSIONS 🔥 (Perl's superpower — Athena uses it heavily for HL7)

```perl
# Match
$s =~ /pattern/;            # true if matches
$s !~ /pattern/;            # true if NOT matches

# Capture
if ($s =~ /(\d+)-(\d+)/) {
    my ($a, $b) = ($1, $2);  # capture groups
}

# Global match (all occurrences)
my @all = ($s =~ /(\d+)/g);  # all numbers as a list

# Substitution
$s =~ s/old/new/;            # replace first
$s =~ s/old/new/g;           # replace all
$s =~ s/(\w+)/\U$1/g;        # uppercase each word (\U in replacement)
my $copy = $s =~ s/a/b/gr;   # /r → return modified COPY, leave $s intact (5.14+)

# Transliteration (char-by-char, NOT regex)
$s =~ tr/a-z/A-Z/;           # uppercase (like toUpperCase per char)
my $count = ($s =~ tr/a//);  # count occurrences of 'a'
$s =~ tr/aeiou//d;           # delete all vowels
$s =~ tr/a-z//s;             # squeeze repeated chars
```

**Modifiers:**
```
/i   case-insensitive
/g   global (all matches)
/m   multiline (^ and $ match line boundaries)
/s   single-line (. matches newline too)
/x   extended (ignore whitespace, allow # comments in pattern)
/r   return copy (non-destructive s/// and tr///)
```

**Metacharacters & classes:**
```
.        any char (except newline, unless /s)
\d \D    digit / non-digit
\w \W    word char [A-Za-z0-9_] / non-word
\s \S    whitespace / non-whitespace
^  $     start / end (of string, or line with /m)
\b \B    word boundary / non-boundary
\A \z    absolute start / absolute end of string
\Z       end of string (before final newline)
*  +  ?  0+, 1+, 0-or-1
{n}      exactly n      {n,}  n or more     {n,m}  n to m
*? +? ?? non-greedy versions
[abc]    character set       [^abc]  negated set
(...)    capture group       (?:...)  non-capturing group
(?<name>...)  named capture → $+{name}
a|b      alternation
\1 \2    backreferences
(?=...)  lookahead      (?!...)   negative lookahead
(?<=...) lookbehind     (?<!...)  negative lookbehind
```

**Extended mode `/x` (great for complex patterns):**
```perl
$phone =~ /
    (\d{3})    # area code
    [-.\s]?    # optional separator
    (\d{3})    # prefix
    [-.\s]?
    (\d{4})    # line number
/x;
```

**Precompile with `qr//` (performance in loops):**
```perl
my $pattern = qr/^ERROR:\s+(.+)$/;
for my $line (@lines) {
    if ($line =~ $pattern) { print "$1\n"; }
}
```

**Named captures (cleaner than $1, $2):**
```perl
if ($date =~ /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/) {
    print "$+{year} / $+{month} / $+{day}";
}
```

---

<a name="15-file-io"></a>
# 15. FILE I/O & FILE TESTS

```perl
# 3-arg open (ALWAYS use this — secure)
open my $fh, '<', $file  or die "read $file: $!";    # read
open my $fh, '>', $file  or die "write $file: $!";   # write (truncate)
open my $fh, '>>', $file or die "append $file: $!";  # append
open my $fh, '+<', $file or die $!;                   # read+write

# Read line by line (memory-efficient — like Node streams)
while (my $line = <$fh>) {
    chomp $line;
    process($line);
}

# Read all lines into array
my @lines = <$fh>;
chomp @lines;            # chomp works on whole array

# Slurp entire file into scalar
my $content = do { local $/; <$fh> };

# Write
print $fh "line\n";
printf $fh "%s = %d\n", $key, $val;
say $fh "auto-newline";  # use feature 'say';  (print + \n)

close $fh or warn "close failed: $!";

# Diamond operator <> reads from @ARGV files or STDIN
while (<>) { print; }    # like `cat` — reads all files in @ARGV

# STDIN / STDOUT / STDERR
my $input = <STDIN>;
print STDOUT "normal\n";
print STDERR "error\n";  # warn "msg\n"; also goes to STDERR
```

**File test operators (often in MCQs):**
```perl
-e $file    # exists
-f $file    # plain file
-d $file    # directory
-r $file    # readable
-w $file    # writable
-x $file    # executable
-s $file    # size in bytes (undef/0 if empty)
-z $file    # zero size (empty)
-l $file    # symbolic link
# Stack them:
if (-e $f && -r $f && -s $f) { ... }   # exists, readable, non-empty
```

**Directories:**
```perl
opendir my $dh, $dir or die $!;
my @files = readdir $dh;
closedir $dh;

# glob (shell-style wildcards)
my @perl_files = glob("*.pl");
my @logs = glob("/var/log/*.log");

# Recursive traversal
use File::Find;
find(sub { print "$File::Find::name\n" if /\.pm$/ }, $dir);
```

---

<a name="16-modules"></a>
# 16. MODULES & PACKAGES

```perl
# Using modules
use strict;                          # MANDATORY — catches errors
use warnings;                        # MANDATORY — warns on mistakes
use feature qw(say signatures state);
use JSON;                            # CPAN module
use List::Util qw(sum max);          # import specific functions
use POSIX qw(floor ceil strftime);

require Some::Module;                # runtime load (no import)

# Creating a module: file lib/MyApp/Utils.pm
package MyApp::Utils;
use strict; use warnings;
use Exporter 'import';
our @EXPORT_OK = qw(add multiply);   # available on request
our @EXPORT    = qw(add);            # exported by default (avoid!)

sub add      { $_[0] + $_[1] }
sub multiply { $_[0] * $_[1] }

1;   # ⚠️ MUST end with truthy value (module load contract)

# Using it
use MyApp::Utils qw(add multiply);
add(2, 3);
```

**⚠️ Why `1;` at the end?** `use`/`require` evaluates the file and checks the return value. If falsy, the load fails. `1;` guarantees truthy.

**`@INC` and `lib`:**
```perl
use lib '/path/to/lib';     # add to module search path (like NODE_PATH)
push @INC, '/another/path'; # runtime
perl -I/path script.pl      # command-line
```

**`use` vs `require`:**
```perl
use Module;       # COMPILE-time, calls import()       (like static import)
require Module;   # RUN-time, no import()               (like dynamic require())
# use Module qw(f); ≈ BEGIN { require Module; Module->import('f'); }
```

---

<a name="17-oop"></a>
# 17. OOP — bless & $self 🔥

> **A class is a package. An object is a blessed reference. A method is a sub
> whose first argument is the object. Inheritance walks `@ISA`.**

```perl
package Patient;
use strict; use warnings;

# CONSTRUCTOR
sub new {
    my ($class, %args) = @_;       # $class = "Patient" (auto-passed)
    die "name required" unless defined $args{name};
    my $self = {                   # build the instance data
        name => $args{name},
        dob  => $args{dob},
    };
    return bless $self, $class;    # tag the hashref as a "Patient"
}

# METHOD (getter)
sub name {
    my ($self) = @_;               # $self = the object (auto-passed first)
    return $self->{name};          # access instance data via hashref
}

# METHOD with args
sub set_dob {
    my ($self, $dob) = @_;         # object first, then real args
    $self->{dob} = $dob;
    return $self;                  # return $self → enables method chaining
}

1;
```

**The key mechanic — what method calls expand to:**
```perl
my $p = Patient->new(name => "John");   # Patient::new("Patient", name=>"John")
$p->name();                              # Patient::name($p)
$p->set_dob("1990-01-01");               # Patient::set_dob($p, "1990-01-01")
#  ↑ Perl AUTO-INSERTS the object/class as the FIRST argument
```

**Inheritance:**
```perl
package InpatientPatient;
use parent 'Patient';            # extends Patient  (sets @ISA)
# OR: our @ISA = ('Patient');

sub new {
    my ($class, %args) = @_;
    my $self = Patient::new($class, %args);   # call parent constructor
    $self->{bed} = $args{bed};
    return $self;                # already blessed into $class
}

sub discharge {                  # new method
    my ($self) = @_;
    return "$self->{name} discharged from bed $self->{bed}";
}

# Override + call parent
sub name {
    my ($self) = @_;
    my $base = $self->SUPER::name();   # super.name()
    return "Inpatient: $base";
}
1;
```

**Introspection:**
```perl
ref($p);              # "Patient" (class name)
$p->isa('Patient');   # true (is-a check, includes inheritance)
$p->can('name');      # returns coderef if method exists, else undef
$p->DOES('Role');     # role check
```

**⚠️ `$self` is just a convention** — you could name it anything, but always use `$self`. Unlike JS, it is NOT automatically available; you must extract it from `@_`.

---

<a name="18-moose"></a>
# 18. MOOSE 🔥 (Modern OOP — Athena Health USES this)

```perl
package Patient;
use Moose;                       # turns on modern OOP

# Attributes (auto-generates getters/setters)
has 'first_name' => (
    is       => 'ro',            # read-only (rw = read-write)
    isa      => 'Str',           # type constraint
    required => 1,               # must provide in constructor
);

has 'last_name'  => (is => 'ro', isa => 'Str', required => 1);

has 'age' => (
    is      => 'rw',
    isa     => 'Int',
    default => 0,                # default value
);

has 'visits' => (
    is      => 'rw',
    isa     => 'ArrayRef[Str]',
    default => sub { [] },        # ⚠️ refs need sub{} for defaults
    lazy    => 1,                # build only when first accessed
);

has 'mrn' => (
    is        => 'ro',
    isa       => 'Str',
    predicate => 'has_mrn',      # auto-generates $obj->has_mrn()
    builder   => '_build_mrn',   # method to lazily compute value
    lazy      => 1,
);
sub _build_mrn { my $self = shift; return "MRN" . int(rand(99999)); }

# Methods
sub full_name {
    my $self = shift;
    return $self->last_name . ", " . $self->first_name;
}

no Moose;                        # clean up Moose keywords
__PACKAGE__->meta->make_immutable;  # speed optimization (lock the class)
1;

# Usage
my $p = Patient->new(first_name => "John", last_name => "Doe");
$p->first_name;            # "John"   (auto getter)
$p->age(45);               # set (rw attr)
$p->full_name;             # "Doe, John"
$p->has_mrn;               # true/false
```

**Moose attribute options cheat sheet:**
| Option | Meaning |
|--------|---------|
| `is => 'ro'/'rw'` | read-only / read-write |
| `isa => 'Str'/'Int'/'ArrayRef'/'HashRef'/'CodeRef'/'Patient'` | type constraint |
| `required => 1` | mandatory in constructor |
| `default => val` or `sub {}` | default value (refs MUST use sub{}) |
| `builder => '_method'` | method that builds the value |
| `lazy => 1` | defer building until first access |
| `predicate => 'has_x'` | auto has_x() existence check |
| `clearer => 'clear_x'` | auto clear_x() method |
| `trigger => sub {}` | run code when attr is set |
| `handles => [...]` | delegation |

**Roles (like interfaces/mixins — solves multiple-inheritance):**
```perl
package Billable;
use Moose::Role;
requires 'calculate_cost';        # consuming class MUST implement this
sub invoice { ... }               # shared method

package Patient;
use Moose;
with 'Billable';                  # consume the role (like implements)
sub calculate_cost { ... }
```

**Moo** = lightweight Moose (faster startup, subset of features). Same `has`/`with` syntax.

---

<a name="19-error-handling"></a>
# 19. ERROR HANDLING 🔥

```perl
# die = throw, eval = try/catch
eval {
    open my $fh, '<', $file or die "cannot open: $!";
    risky_operation();
    1;                       # ⚠️ return truthy at end of eval block
} or do {
    my $err = $@;            # capture error IMMEDIATELY
    warn "Failed: $err";
};

# Classic check
eval { risky(); };
if ($@) { handle_error($@); }

# warn = non-fatal (goes to STDERR), die = fatal
warn "just a warning\n";    # continues execution
die  "fatal error\n";       # stops (unless caught by eval)

# die with object (structured errors)
die { code => 500, msg => "Server Error" };   # $@ is a hashref
eval { ... };
if (ref $@ eq 'HASH') { print $@->{code}; }
```

**⚠️ THE NESTED EVAL / `$@` CLOBBERING BUG:**
```perl
# BROKEN — inner eval clobbers $@, execution continues after inner failure
eval {
    process();
    eval { notify(); };       # if this fails, $@ is set...
    update_status();          # ...but this STILL RUNS and may reset $@
};
if ($@) { log_error($@); }    # may miss the error entirely!

# FIX 1 — check after each eval
eval {
    process();
    eval { notify(); };
    if ($@) { log_error("notify failed: $@"); }
    update_status();
};
if ($@) { log_error("process failed: $@"); }
```

**Try::Tiny (RECOMMENDED — avoids `$@` pitfalls entirely):**
```perl
use Try::Tiny;
try {
    risky_operation();
} catch {
    warn "Caught: $_";        # $_ holds the error (NOT $@)
} finally {
    cleanup();                # always runs
};
```

**Carp (better error reporting in modules):**
```perl
use Carp qw(croak carp confess cluck);
croak "error";     # die, but reports from CALLER's perspective (use in modules)
carp  "warning";   # warn, but from caller's perspective
confess "error";   # die + full stack trace
cluck "warning";   # warn + full stack trace
```

---

<a name="20-dbi"></a>
# 20. DBI — DATABASE 🔥 (PostgreSQL/Oracle at Athena)

```perl
use DBI;

# Connect
my $dbh = DBI->connect(
    "dbi:Pg:dbname=athena;host=localhost;port=5432",   # Pg / Oracle / mysql
    $user, $password,
    { RaiseError => 1, AutoCommit => 1, PrintError => 0 }
) or die $DBI::errstr;

# ── SELECT with placeholders (ALWAYS — prevents SQL injection) ──
my $sth = $dbh->prepare("SELECT id, name FROM patients WHERE age > ?");
$sth->execute(65);

# Fetch row by row
while (my $row = $sth->fetchrow_hashref) {   # { id => .., name => .. }
    print "$row->{id}: $row->{name}\n";
}

# ── Fetch methods ──
my @row   = $sth->fetchrow_array;        # one row → list (by column order)
my $row   = $sth->fetchrow_hashref;      # one row → hashref (by column name) ← common
my $all   = $sth->fetchall_arrayref;     # all rows → [ [..], [..] ]
my $all_h = $sth->fetchall_arrayref({}); # all rows → [ {..}, {..} ]  ← like pg res.rows
my $href  = $dbh->selectall_hashref($sql, 'id');  # keyed by 'id' column

# ── One-shot helpers ──
my $count = $dbh->selectrow_array("SELECT COUNT(*) FROM patients");
my @row   = $dbh->selectrow_array("SELECT id,name FROM patients WHERE id=?", undef, 5);

# ── INSERT / UPDATE / DELETE (do = prepare+execute for non-SELECT) ──
$dbh->do("INSERT INTO patients (name, age) VALUES (?, ?)", undef, "John", 45);
my $rows_affected = $dbh->do("UPDATE patients SET age=? WHERE id=?", undef, 46, 5);

# ── Reuse a prepared statement in a loop (efficient) ──
my $ins = $dbh->prepare("INSERT INTO log (msg) VALUES (?)");
$ins->execute($_) for @messages;

# ── Transactions ──
$dbh->begin_work;
eval {
    $dbh->do("UPDATE accounts SET bal = bal - 100 WHERE id = 1");
    $dbh->do("UPDATE accounts SET bal = bal + 100 WHERE id = 2");
    $dbh->commit;
};
if ($@) {
    $dbh->rollback;
    die "Transaction failed: $@";
}

# Last insert id
my $id = $dbh->last_insert_id(undef, undef, 'patients', 'id');

$dbh->disconnect;
```

**⚠️ Placeholders are NOT just for strings** — they handle quoting/escaping. Never interpolate user input into SQL.

**Fetch method decision:**
| Method | Returns | Use when |
|--------|---------|----------|
| `fetchrow_array` | list | speed, known columns |
| `fetchrow_hashref` | hashref | readability (most common) |
| `fetchall_arrayref` | AoA | all rows, index access |
| `fetchall_arrayref({})` | AoH | all rows, name access |

---

<a name="21-testing"></a>
# 21. TESTING (Test::More — Perl's Jest)

```perl
use Test::More;
use Test::Exception;     # for testing die
use Test::Deep;          # deep structure comparison

# Assertions
ok($condition, 'msg');                      # truthy
is($got, $expected, 'msg');                 # eq comparison
isnt($got, $bad, 'msg');                    # not equal
like($str, qr/pattern/, 'msg');             # regex match
unlike($str, qr/pattern/, 'msg');           # no regex match
is_deeply(\@got, \@exp, 'msg');             # deep equality (arrays/hashes)
cmp_ok($n, '>', 5, 'msg');                  # operator comparison
isa_ok($obj, 'Patient', 'msg');             # class check
can_ok($obj, 'method_name');                # method exists
dies_ok  { risky() } 'dies on bad input';   # expect death
lives_ok { safe() }  'survives';            # expect no death
throws_ok { f() } qr/error/, 'right error'; # die matches pattern

# Grouping (like describe)
subtest 'patient validation' => sub {
    my $p = Patient->new(name => "X");
    isa_ok($p, 'Patient');
    is($p->name, "X", 'name set');
};

done_testing;            # or: use Test::More tests => 5;
```

**Run:** `prove -v -r t/`  (recursive, verbose) — like `npx jest`
**Coverage:** `cover -test` (Devel::Cover) — like `jest --coverage`

| Jest | Test::More |
|------|-----------|
| `describe()` | `subtest` |
| `expect(x).toBe(y)` | `is($x,$y)` |
| `expect(x).toEqual(o)` | `is_deeply($x,$o)` |
| `expect(x).toMatch(re)` | `like($x,qr/re/)` |
| `expect(f).toThrow()` | `dies_ok {f()}` |
| `expect(x).toBeInstanceOf(C)` | `isa_ok($x,'C')` |

---

<a name="22-one-liners"></a>
# 22. ONE-LINERS (command-line Perl — common in interviews)

```bash
perl -e 'print "hi\n"'                       # execute code
perl -n -e 'print if /ERROR/' log.txt        # grep-like (loop, no auto-print)
perl -p -e 's/foo/bar/g' file.txt            # sed-like (loop + auto-print)
perl -i -pe 's/old/new/g' file.txt           # in-place edit
perl -i.bak -pe 's/old/new/g' file.txt       # in-place + backup
perl -a -F, -ne 'print "$F[2]\n"' data.csv   # autosplit on comma → @F
perl -l -ne 'print uc' file.txt              # auto-chomp + auto-newline
perl -ne '$sum+=$_; END{print "$sum\n"}' nums.txt   # sum a column
perl -ne 'print unless $seen{$_}++' file.txt # unique lines
perl -MList::Util=sum -e 'print sum(1..100)' # load module, use function
```

**Flags:**
```
-e  execute code        -n  wrap in while(<>){}  (no print)
-p  wrap in while(<>){} (auto-print $_)          -i  in-place edit
-a  autosplit into @F   -F  set split delimiter  -l  chomp + add newline
-M  load module         -E  execute with all features (say, etc.)
```

---

<a name="23-advanced-idioms"></a>
# 23. ADVANCED IDIOMS (senior-level signals)

## Dispatch Tables (hash of coderefs — replaces big if/elsif) 🔥
```perl
my %dispatch = (
    add => sub { $_[0] + $_[1] },
    sub => sub { $_[0] - $_[1] },
    mul => sub { $_[0] * $_[1] },
);
my $op = "add";
my $result = $dispatch{$op}->(5, 3);     # 8
# Like a JS object of functions: const ops = { add: (a,b)=>a+b }; ops[op](5,3)

# With fallback
my $handler = $dispatch{$op} // sub { die "unknown op: $op" };
$handler->(@args);
```

## Schwartzian Transform (efficient sort by computed key) 🔥
```perl
# Sort files by modification time — compute key ONCE per element
my @sorted =
    map  { $_->[1] }                      # 3. extract original
    sort { $a->[0] <=> $b->[0] }          # 2. sort by computed key
    map  { [ -M $_, $_ ] }                # 1. build [key, value] pairs
    @files;
# Read bottom-to-top: decorate → sort → undecorate
# Avoids recomputing the sort key on every comparison
```

## Closures (functions that capture variables)
```perl
sub make_counter {
    my $count = shift // 0;          # captured
    return sub { return $count++ };  # anon sub closes over $count
}
my $c = make_counter(10);
$c->();  # 10
$c->();  # 11
# Identical to JS: const makeCounter = (n=0) => () => n++;
```

## Higher-order functions
```perl
sub apply_twice {
    my ($fn, $val) = @_;
    return $fn->($fn->($val));
}
apply_twice(sub { $_[0] * 2 }, 5);   # 20
```

## Memoization
```perl
my %cache;
sub fib {
    my $n = shift;
    return $cache{$n} //= $n < 2 ? $n : fib($n-1) + fib($n-2);
}
```

## Method chaining (return $self)
```perl
$query->select('name')->from('patients')->where('age > 65')->execute;
# Each method ends with `return $self;`
```

---

<a name="24-healthcare"></a>
# 24. HEALTHCARE-SPECIFIC (HL7 & Fixed-Width) 🔥

## HL7 Parsing (pipe + caret delimited)
```perl
# MSH|^~\&|LAB|FAC|ATHENA|NET|20240115||ORU^R01|MSG1|P|2.3.1
# PID|1||MRN123^^^HOSP||DOE^JOHN^M||19900515|M
sub parse_hl7 {
    my ($msg) = @_;
    my %parsed;
    for my $segment (split /\r?\n/, $msg) {     # segments by newline/CR
        my @fields = split /\|/, $segment;       # fields by pipe
        my $type = $fields[0];
        if ($type eq 'PID') {
            my @name = split /\^/, $fields[5];   # components by caret
            $parsed{patient} = {
                mrn        => (split /\^/, $fields[3])[0],
                last_name  => $name[0],
                first_name => $name[1],
                dob        => $fields[7],
                gender     => $fields[8],
            };
        }
        elsif ($type eq 'OBX') {                  # observation/result
            push @{$parsed{results}}, {
                code  => (split /\^/, $fields[3])[0],
                value => $fields[5],
                units => $fields[6],
            };
        }
    }
    return \%parsed;
}
```

## Fixed-Width Records (pack/unpack) — legacy healthcare formats
```perl
# Record: 10-char ID, 20-char name, 8-char date (space-padded)
my $record = pack("A10 A20 A8", "MRN123", "John Doe", "19900515");
#   A = ASCII space-padded string; number = field width

my ($id, $name, $dob) = unpack("A10 A20 A8", $record);
# A strips trailing spaces on unpack

# Common templates:
#   A = space-padded string   a = null-padded
#   N = unsigned 32-bit (big-endian)   n = 16-bit
#   C = unsigned char          H = hex string
```

## CSV (use the module, not hand-rolled split — handles quoted commas)
```perl
use Text::CSV;
my $csv = Text::CSV->new({ binary => 1, auto_diag => 1 });
open my $fh, '<', 'patients.csv' or die $!;
$csv->header($fh);                       # read header row
while (my $row = $csv->getline_hr($fh)) {  # hashref keyed by header
    print "$row->{patient_id}: $row->{name}\n";
}
close $fh;
# ⚠️ split /,/ breaks on "Doe, John" — use Text::CSV for real CSV
```

## JSON
```perl
use JSON;
my $data   = decode_json($json_string);   # JSON.parse
my $string = encode_json($perl_ref);      # JSON.stringify
# Pretty:
my $pretty = JSON->new->pretty->encode($ref);
```

---

<a name="25-gotchas"></a>
# 25. ⚠️ THE GOTCHAS SECTION 🔥 (memorize — these are interview gold)

### G1. `==` vs `eq` on strings
```perl
"foo" == "bar"   # TRUE (both 0 numerically!). Use eq for strings.
```

### G2. Scalar vs list context on assignment
```perl
my $x = @array;      # LENGTH (scalar context)
my ($x) = @array;    # FIRST ELEMENT (list context — note parens)
```

### G3. List flattening in hashes/arrays
```perl
my @a = (1, 2, 3);
my %h = (big => @a);          # BROKEN: %h = (big=>1, 2=>3) ← flattened!
my %h = (big => \@a);         # FIXED: store a reference
my @combined = (@a, @b);      # flattens to one list (often desired)
```

### G4. Falsy values & `if ($hash{key})`
```perl
# Falsy in Perl: 0, "0", "", undef, ()
if ($patient{age}) { }        # FALSE if age is 0 (newborn)! Use exists/defined.
```

### G5. `||` vs `//` for defaults
```perl
my $n = $val || 10;   # 0 becomes 10 (BUG)
my $n = $val // 10;   # only undef becomes 10 (correct)
```

### G6. ⚠️ Loop variable / `$_` is an ALIAS (modifying it changes the array!)
```perl
my @nums = (1, 2, 3);
$_ *= 2 for @nums;            # @nums is now (2,4,6)! $_ aliases real elements
for my $x (@nums) { $x++ }    # also mutates @nums — $x is an alias, not a copy
my @doubled = map { $_ * 2 } @nums;   # SAFE: returns new list, but DON'T mutate $_
```

### G7. ⚠️ `print (...)` parenthesis trap
```perl
print (1 + 2) * 3;    # prints "3"! Perl reads print(1+2), then *3 is discarded
print((1 + 2) * 3);   # prints "9" (correct)
# Warning: "print (...) interpreted as function"
```

### G8. ⚠️ Magic string auto-increment
```perl
my $v = "aa"; $v++;   # "ab"
my $v = "Az"; $v++;   # "Ba"
my $v = "Zz"; $v++;   # "AAa"
my $v = "a9"; $v++;   # "b0"
# But $v-- does NOT do magic — numeric only
```

### G9. ⚠️ `return undef` in list context
```perl
sub find { return undef; }
my @r = find();       # @r = (undef) → length 1 → TRUE! Bug.
sub find { return; }  # FIX: bare return → () in list, undef in scalar
```

### G10. Floating point (same as every language)
```perl
0.1 + 0.2 == 0.3      # FALSE. Use sprintf("%.2f",...) or abs(diff) < epsilon
```

### G11. ⚠️ Hash key autovivification (silent creation)
```perl
my %h;
if ($h{a}{b}{c}) { }          # creates $h{a} and $h{a}{b} as empty hashrefs!
exists $h{a};                 # now TRUE (side effect of the check above)
```

### G12. Default `sort` is alphabetical
```perl
sort (10, 9, 100)             # (10, 100, 9) — string sort!
sort { $a <=> $b } (10,9,100) # (9, 10, 100) — numeric
```

### G13. `chomp` vs `chop`
```perl
chomp $s;   # removes trailing newline ONLY (safe), returns # removed
chop  $s;   # removes LAST char unconditionally (dangerous)
```

### G14. Slurp mode needs `local`
```perl
my $c = do { local $/; <$fh> };   # $/ MUST be local'd, else you break later reads
```

### G15. Hash in list context → flattened pairs (order not guaranteed)
```perl
my %h = (a=>1, b=>2);
my @list = %h;        # (a,1,b,2) or (b,2,a,1) — ORDER IS RANDOM
# Use `sort keys %h` when you need deterministic order
```

### G16. `my` in a loop condition vs reuse
```perl
while (my $line = <$fh>) { }   # fresh $line each iteration (good)
```

### G17. Comparing array/hash directly doesn't work
```perl
if (@a == @b) { }      # compares LENGTHS, not contents!
# Use is_deeply in tests, or compare element-by-element
```

### G18. `wantarray` in void context returns undef (not false)
```perl
# list → true, scalar → "", void → undef. Distinguish with defined().
```

### G19. Numeric string increment vs concatenation
```perl
my $x = "5"; $x + 1;   # 6  (numeric context)
my $x = "5"; $x . 1;   # "51" (string context)
"5 apples" + 3;        # 8 (leading number extracted, with warning)
```

### G20. `0 but true` — the magic string
```perl
# "0E0" or "0 but true" → numerically 0 but boolean TRUE.
# DBI returns this from $dbh->do() when 0 rows affected (so it's still "success").
my $rows = $dbh->do(...);   # "0E0" if zero rows → if($rows) is true
```

---

<a name="26-code-patterns"></a>
# 26. READY-TO-USE CODE PATTERNS

```perl
# ── Read CSV, build AoH ──
my @records;
open my $fh, '<', $file or die $!;
chomp(my $header = <$fh>);
my @cols = split /,/, $header;
while (my $line = <$fh>) {
    chomp $line;
    my @vals = split /,/, $line;
    my %row; @row{@cols} = @vals;     # hash slice assignment
    push @records, \%row;
}

# ── Count / group by ──
my %count;
$count{$_->{category}}++ for @records;

# ── Group items into buckets ──
my %groups;
push @{$groups{$_->{type}}}, $_ for @items;

# ── Frequency, sorted by count desc ──
my @top = sort { $count{$b} <=> $count{$a} } keys %count;

# ── Find max by field ──
use List::Util 'max';
my $oldest = (sort { $b->{age} <=> $a->{age} } @people)[0];

# ── Sum a field ──
use List::Util 'sum0';
my $total = sum0 map { $_->{amount} } @transactions;

# ── Unique preserving order ──
my %seen;
my @uniq = grep { !$seen{$_}++ } @list;

# ── Flatten AoA ──
my @flat = map { @$_ } @array_of_arrays;

# ── Hash → array of "k=v" ──
my @pairs = map { "$_=$h{$_}" } sort keys %h;

# ── Retry with backoff ──
my $attempts = 0;
RETRY: {
    my $ok = eval { do_thing(); 1 };
    unless ($ok) {
        if (++$attempts < 3) { sleep $attempts; redo RETRY; }
        die "failed after retries: $@";
    }
}

# ── Reverse a string (no reverse) ──
my $r = join '', map { substr($s, $_, 1) } reverse 0..length($s)-1;

# ── Two Sum ──
sub two_sum {
    my ($nums, $target) = @_;
    my %seen;
    for my $i (0..$#$nums) {
        my $need = $target - $nums->[$i];
        return ($seen{$need}, $i) if exists $seen{$need};
        $seen{$nums->[$i]} = $i;
    }
    return;
}

# ── FizzBuzz ──
for (1..100) {
    print $_ % 15 == 0 ? "FizzBuzz"
        : $_ % 3  == 0 ? "Fizz"
        : $_ % 5  == 0 ? "Buzz"
        : $_;
    print "\n";
}

# ── Anagram check ──
sub is_anagram {
    my ($a, $b) = @_;
    return join('', sort split //, lc $a) eq join('', sort split //, lc $b);
}

# ── Word frequency from file ──
my %freq;
while (<$fh>) {
    $freq{lc $_}++ for /(\w+)/g;
}
```

---

<a name="27-behavioral"></a>
# 27. BEHAVIORAL / HR PREP (Athena Health + Agile Axis)

## About the role/company (talking points)
- Athena's core platform (**athenaNet/athenaOne**) is a ~25-year-old **Perl monolith** handling EHR, revenue cycle management (RCM/billing), and patient engagement.
- They are **modernizing onto AWS** (EKS, Outposts, Local Zones) — decomposing the monolith into microservices. Frontend is moving to **React + GraphQL**.
- Stack you'll touch: **Perl (Moose OOP), Java/Spring Boot, PostgreSQL/Oracle, Perforce + Git, Jenkins/Harness, Terraform, HL7/FHIR**.
- **Agile Axis** is likely a **staffing/contract intermediary** — clarify in HR round: direct-hire vs contract-to-hire, who's the employer of record, conversion timeline, benefits.

## Smart questions to ask THEM
- "Is this team on the legacy monolith, the microservices migration, or both?"
- "What's the current split between Perl and Java work day-to-day?"
- "How mature is the test coverage on the Perl codebase? What's the CI setup?"
- "Is this role direct-hire with Athena or through Agile Axis as a contract? What's the conversion path?"
- "How does the team handle HL7/FHIR integration work?"

## Your positioning (you're a JS dev moving to Perl — own it)
- **Strength framing:** "I have 3.5+ years in JS/Node/React with strong backend fundamentals — REST APIs, PostgreSQL, JWT/RBAC auth, Docker/K8s/Jenkins. I've been mapping Perl concepts to what I know (references ≈ pointers, Moose ≈ TypeScript classes, DBI ≈ pg driver), and I learn fast by connecting systems."
- **Honesty on Perl:** List Perl as a current focus area, not faked experience. Emphasize transferable depth (Unix/Linux, SQL, AWS, CI/CD) — those don't change between languages.
- **Healthcare angle:** Mention your interest in HL7/data-processing — Perl's regex/text strengths are exactly why Athena uses it.

## STAR stories to prepare (from your real work)
- **Debugging a systemic bug across services** → your KP-580 403/auth investigation (root cause across multiple repos).
- **Fact-checking with source docs** → KP-568 (corrected a wrong hypothesis using developer portal docs).
- **Cross-team collaboration** → multi-tab rollout blocker with multiple colleagues.
- **Infra/ops** → Certbot/Nginx SSL fix; self-hosted cloud storage system.
- **Shipping at scale** → React plugin used by 90,000+ users across 40+ locales.

## Common behavioral Qs
- "Tell me about yourself" — 90-sec pitch: experience → strengths → why Athena.
- "Why move from Cognizant/JS to a Perl role?" — growth, backend depth, healthcare domain, systems-level work.
- "Describe a tough bug you solved." — KP-580 (be specific about method).
- "How do you handle working across time zones / with US teams?" — you already do this at Intuit.
- "How do you learn a new technology quickly?" — your JS→Perl mapping approach is the literal answer.

---

> **Print this, skim it the morning of the interview.** The sections to nail
> cold: **Context (#3)**, **References (#6)**, **OOP/$self (#17)**, **the
> Gotchas (#25)**, and **HL7 parsing (#24)**. Those are where a JS dev either
> shines or stumbles. Good luck, Shubnit. 🚀
