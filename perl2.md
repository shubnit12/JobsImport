# Perl Interview Questions & Answers — Athena Health Context

> Every answer includes the JS parallel so you can connect it to what you know.
> Read each question first, try to think of the answer, then read the solution.

---

## Round 1 — Perl Fundamentals (Warm-up)

---

### Q1. How do you check if a key exists in a hash, and why can't you just use `if ($patient{dob})`?

**Answer:**

```perl
my %patient = (
    name => "John",
    dob  => "",          # empty string — patient didn't provide DOB
    age  => 0,           # newborn baby
);

# WRONG — these fail on valid-but-falsy values
if ($patient{dob})  { print "has dob\n" }    # DOESN'T PRINT — "" is false
if ($patient{age})  { print "has age\n" }    # DOESN'T PRINT — 0 is false

# CORRECT — use exists()
if (exists $patient{dob})  { print "has dob\n" }    # PRINTS — key exists
if (exists $patient{age})  { print "has age\n" }    # PRINTS — key exists

# To check if the VALUE is defined (not undef):
if (defined $patient{dob}) { print "dob is defined\n" }   # PRINTS — "" is defined
```

**Why?** Perl has multiple falsy values: `0`, `""`, `undef`, `"0"`. A patient's DOB might be an empty string (not yet filled in), or age might be `0` (newborn). Using `if ($hash{key})` would incorrectly skip these.

**JS parallel:**

```javascript
// Same problem exists in JS:
const patient = { name: "John", dob: "", age: 0 };

if (patient.dob) { }       // false! empty string is falsy
if (patient.age) { }       // false! 0 is falsy

// JS fix:
if ("dob" in patient) { }              // true — key exists
if (patient.dob !== undefined) { }     // true — like Perl's defined()
```

**Interview-ready one-liner:** "Use `exists` to check if the key is present in the hash, and `defined` to check if the value is not `undef`. Never use a bare truth test because `0`, `""`, and `"0"` are all valid values that evaluate to false."

---

### Q2. What's wrong with this code?

```perl
sub get_patient_names {
    my @patients = @_;
    my @names;
    for (@patients) {
        push @names, $_->{first_name} . " " . $_->{last_name};
    }
    return @names;
}

my @result = get_patient_names(
    { first_name => "John", last_name => "Doe" },
    { first_name => "Jane", last_name => "Smith" },
);
```

**Answer:** Trick question — **this code actually works fine!**

Here's why: You're passing anonymous hashrefs `{ ... }` (references, not bare hashes). References are scalars, so they don't flatten. `@_` gets a list of two scalar references, and `@patients` correctly receives them.

**If the question was about passing bare hashes, THEN it would break:**

```perl
# THIS would break:
my %p1 = (first_name => "John", last_name => "Doe");
my %p2 = (first_name => "Jane", last_name => "Smith");

get_patient_names(%p1, %p2);
# @_ = ("first_name", "John", "last_name", "Doe", "first_name", "Jane", ...)
# All flattened into one list! $_->{first_name} would FAIL because $_ is a string, not a ref

# FIX: Pass references
get_patient_names(\%p1, \%p2);
```

**Interview-ready answer:** "The code works because anonymous hashrefs are already references (scalars), so they don't flatten in `@_`. If bare hashes were passed instead, they'd flatten into a single list and lose their structure. The fix would be to pass `\%hash` references."

**JS parallel:**

```javascript
// JS objects are already references, so this never happens in JS:
getPatientNames({ firstName: "John" }, { firstName: "Jane" }); // always works
// Perl has the same behavior ONLY when you use {} to create refs
```

---

### Q3. Explain the output:

```perl
my @nums = (10, 20, 30);
my $x = @nums;
my ($y) = @nums;
print "x=$x, y=$y\n";
```

**Answer:** Output is `x=3, y=10`

```perl
my $x = @nums;
# $x is a SCALAR — forces SCALAR CONTEXT on @nums
# In scalar context, an array returns its LENGTH
# $x = 3

my ($y) = @nums;
# ($y) is a LIST (because of the parentheses) — forces LIST CONTEXT on @nums
# In list context, @nums expands to (10, 20, 30)
# $y gets the first element: 10
# The rest (20, 30) are discarded because there's only one variable to receive them
```

**The parentheses make ALL the difference:**

```perl
my $a = @nums;      # scalar context → length → 3
my ($a) = @nums;    # list context → first element → 10
```

**JS parallel — there's no direct equivalent, but think of it like:**

```javascript
// Scalar context (getting length):
let x = nums.length;       // 3

// List context (destructuring):
let [y] = nums;            // 10 (first element)
```

**Interview-ready answer:** "The parentheses on the left side of the assignment create list context, so `@nums` expands and `$y` receives the first element (10). Without parentheses, it's scalar context, so `@nums` returns its count (3). Context is determined by the LEFT side of the assignment."

---

## Round 2 — Real-World Backend (Athena Context)

---

### Q4. Parse an HL7 PID segment into a hashref

**Input:**
```
PID|1||MRN123^^^HOSP||DOE^JOHN^M||19900515|M
```

**Answer:**

```perl
sub parse_pid_segment {
    my ($pid_string) = @_;

    # Step 1: Split the segment by pipe delimiter
    my @fields = split(/\|/, $pid_string);

    # Fields mapping (HL7 PID segment standard):
    # fields[0] = "PID" (segment type)
    # fields[1] = "1" (set ID)
    # fields[2] = "" (external patient ID — empty here)
    # fields[3] = "MRN123^^^HOSP" (patient identifier)
    # fields[4] = "" (alternate patient ID — empty)
    # fields[5] = "DOE^JOHN^M" (patient name)
    # fields[6] = "" (mother's maiden name — empty)
    # fields[7] = "19900515" (date of birth)
    # fields[8] = "M" (gender)

    # Step 2: Extract MRN from field 3
    # "MRN123^^^HOSP" — components separated by ^
    my @id_parts = split(/\^/, $fields[3]);
    my $mrn = $id_parts[0];    # "MRN123"

    # Step 3: Extract name from field 5
    # "DOE^JOHN^M" — last^first^middle
    my @name_parts = split(/\^/, $fields[5]);
    my $last_name   = $name_parts[0];    # "DOE"
    my $first_name  = $name_parts[1];    # "JOHN"
    my $middle_name = $name_parts[2];    # "M"

    # Step 4: Build and return the hashref
    my $patient = {
        mrn         => $mrn,
        last_name   => $last_name,
        first_name  => $first_name,
        middle_name => $middle_name,
        dob         => $fields[7],       # "19900515"
        gender      => $fields[8],       # "M"
    };

    return $patient;
}

# Test it
my $pid_line = "PID|1||MRN123^^^HOSP||DOE^JOHN^M||19900515|M";
my $result = parse_pid_segment($pid_line);

print "MRN:    $result->{mrn}\n";         # MRN123
print "Name:   $result->{first_name} $result->{last_name}\n";  # JOHN DOE
print "DOB:    $result->{dob}\n";         # 19900515
print "Gender: $result->{gender}\n";      # M
```

**JS equivalent for comparison:**

```javascript
function parsePidSegment(pidString) {
    const fields = pidString.split('|');
    const idParts = fields[3].split('^');
    const nameParts = fields[5].split('^');

    return {
        mrn:        idParts[0],
        lastName:   nameParts[0],
        firstName:  nameParts[1],
        middleName: nameParts[2],
        dob:        fields[7],
        gender:     fields[8],
    };
}
```

**Why Perl is great for this:** HL7 is all about splitting delimited strings and pattern matching — exactly what Perl's `split` and regex were built for. This is why Athena Health uses Perl for their HL7 engine.

---

### Q5. Count completed appointments per patient from CSV

**Input CSV:**
```
patient_id,date,provider,status
101,2024-01-15,Dr. Smith,completed
102,2024-01-15,Dr. Jones,cancelled
101,2024-02-20,Dr. Smith,completed
103,2024-03-10,Dr. Smith,no_show
101,2024-03-15,Dr. Jones,completed
```

**Answer:**

```perl
#!/usr/bin/perl
use strict;
use warnings;

open my $fh, '<', 'appointments.csv' or die "Cannot open file: $!";

# Skip the header line
my $header = <$fh>;

# Hash to store counts: patient_id => count
my %completed_count;

# Process each line
while (my $line = <$fh>) {
    chomp $line;                             # remove trailing newline

    my @fields = split(/,/, $line);          # split by comma
    my $patient_id = $fields[0];             # "101"
    my $status     = $fields[3];             # "completed"

    # Only count completed appointments
    if ($status eq 'completed') {
        $completed_count{$patient_id} = $completed_count{$patient_id} + 1;
        # shorter version: $completed_count{$patient_id}++
    }
}

close $fh;

# Print results
print "Completed appointments per patient:\n";
for my $patient_id (sort keys %completed_count) {
    print "  Patient $patient_id: $completed_count{$patient_id} visits\n";
}

# Output:
#   Patient 101: 3 visits
#   Patient 102: 0 visits   ← won't appear (never had completed)
#   Patient 103: 0 visits   ← won't appear (no_show, not completed)
```

**JS equivalent:**

```javascript
const fs = require('fs');
const lines = fs.readFileSync('appointments.csv', 'utf8').split('\n');
lines.shift(); // skip header

const completedCount = {};
for (const line of lines) {
    const [patientId, date, provider, status] = line.split(',');
    if (status === 'completed') {
        completedCount[patientId] = (completedCount[patientId] || 0) + 1;
    }
}

Object.entries(completedCount)
    .sort(([a], [b]) => a - b)
    .forEach(([id, count]) => console.log(`Patient ${id}: ${count} visits`));
```

---

### Q6. Find patients over 65, sorted by last name

**Answer:**

```perl
use POSIX qw(floor);

sub find_senior_patients {
    my ($patients_ref) = @_;    # arrayref of patient hashrefs

    # Get current date components
    my @now = localtime();
    my $current_year  = $now[5] + 1900;   # localtime year is years since 1900
    my $current_month = $now[4] + 1;      # localtime month is 0-11
    my $current_day   = $now[3];

    my @seniors;

    for my $patient (@{$patients_ref}) {

        # Parse DOB (assuming format: YYYY-MM-DD)
        my ($birth_year, $birth_month, $birth_day) = split(/-/, $patient->{dob});

        # Calculate age
        my $age = $current_year - $birth_year;

        # Adjust if birthday hasn't occurred yet this year
        if ($current_month < $birth_month) {
            $age = $age - 1;
        }
        elsif ($current_month == $birth_month && $current_day < $birth_day) {
            $age = $age - 1;
        }

        # Check if over 65
        if ($age > 65) {
            $patient->{age} = $age;    # store calculated age
            push @seniors, $patient;
        }
    }

    # Sort by last name (string comparison = cmp)
    my @sorted = sort { lc($a->{last_name}) cmp lc($b->{last_name}) } @seniors;

    return \@sorted;
}

# Test data
my @patients = (
    { first_name => "John",  last_name => "Doe",     dob => "1955-03-15" },
    { first_name => "Jane",  last_name => "Smith",   dob => "1990-07-22" },
    { first_name => "Alice", last_name => "Brown",   dob => "1940-12-01" },
    { first_name => "Bob",   last_name => "Adams",   dob => "1958-09-10" },
);

my $seniors = find_senior_patients(\@patients);

for my $p (@{$seniors}) {
    print "$p->{last_name}, $p->{first_name} (age $p->{age})\n";
}

# Output (sorted by last name):
#   Adams, Bob (age 67)
#   Brown, Alice (age 85)
#   Doe, John (age 71)
```

**Key points interviewers look for:**
- Correct age calculation (accounting for birthday not yet passed)
- Using `cmp` for string sort (not `<=>` which is numeric)
- Case-insensitive sort with `lc()`
- Passing arrays by reference to avoid flattening

---

## Round 3 — OOP & Architecture

---

### Q7. Patient class with Moose

**With Moose (modern — what Athena Health uses):**

```perl
package Patient;
use Moose;

# 'ro' = read-only (set once in constructor, can't change later)
# 'rw' = read-write (can be changed anytime)
# 'required' = must be passed to constructor or it dies

has 'first_name' => (
    is       => 'ro',
    isa      => 'Str',        # type constraint: must be a string
    required => 1,             # MUST provide this
);

has 'last_name' => (
    is       => 'ro',
    isa      => 'Str',
    required => 1,
);

has 'dob' => (
    is        => 'ro',
    isa       => 'Str',
    required  => 0,            # optional
    predicate => 'has_dob',    # auto-generates $patient->has_dob() method
);

# Method
sub full_name {
    my ($self) = @_;
    return $self->last_name . ", " . $self->first_name;
}

no Moose;                      # clean up namespace (best practice)
__PACKAGE__->meta->make_immutable;   # performance optimization

1;

# Usage:
my $p = Patient->new(
    first_name => "John",
    last_name  => "Doe",
    dob        => "1990-05-15",
);

print $p->full_name();      # "Doe, John"
print $p->first_name();     # "John"
print $p->has_dob();        # 1 (true)

# This would die:
# my $bad = Patient->new(first_name => "John");
# Error: Attribute (last_name) is required
```

**Same thing with plain bless (classical OOP):**

```perl
package Patient;
use strict;
use warnings;

sub new {
    my ($class, %args) = @_;

    # Validate required fields
    die "first_name is required" unless defined $args{first_name};
    die "last_name is required"  unless defined $args{last_name};

    my $self = {
        first_name => $args{first_name},
        last_name  => $args{last_name},
        dob        => $args{dob},          # optional, might be undef
    };

    return bless $self, $class;
}

# Getter for first_name
sub first_name {
    my ($self) = @_;
    return $self->{first_name};
}

# Getter for last_name
sub last_name {
    my ($self) = @_;
    return $self->{last_name};
}

# Getter for dob
sub dob {
    my ($self) = @_;
    return $self->{dob};
}

# Check if dob exists
sub has_dob {
    my ($self) = @_;
    return defined $self->{dob};
}

# Method
sub full_name {
    my ($self) = @_;
    return $self->{last_name} . ", " . $self->{first_name};
}

1;
```

**JS/TypeScript equivalent:**

```typescript
class Patient {
    readonly firstName: string;
    readonly lastName: string;
    readonly dob?: string;

    constructor(firstName: string, lastName: string, dob?: string) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.dob = dob;
    }

    fullName(): string {
        return `${this.lastName}, ${this.firstName}`;
    }

    hasDob(): boolean {
        return this.dob !== undefined;
    }
}
```

**Why Moose wins over bless:**
- Type checking (`isa => 'Str'`) — like TypeScript
- Auto-generated getters/setters — no boilerplate
- `required` validation — automatic constructor checks
- `predicate` — auto-generates has_X() methods
- `default`/`builder` — like default values in class fields
- Roles — like mixins/interfaces

---

### Q8. How would you extract a billing module from the monolith?

**Answer (use your Docker/K8s/Jenkins knowledge):**

"Having worked with Docker, Kubernetes, and Jenkins at Intuit, here's how I'd approach decomposing a billing module from a 25-year-old Perl monolith:

**Phase 1 — Understand and Isolate**
- Map all the billing-related Perl modules, database tables, and API endpoints
- Identify every place in the monolith that calls billing code (grep the codebase)
- Document the data flow: which tables are read, written, shared with other modules

**Phase 2 — Strangler Fig Pattern**
- Don't rewrite — wrap. Put an API gateway in front of the monolith
- New billing requests route to the new microservice
- Old requests still hit the monolith
- Gradually migrate endpoints one by one

```
                    ┌─────────────────┐
  Request  ──────► │   API Gateway    │
                    │  (routing layer) │
                    └────┬────────┬───┘
                         │        │
                         ▼        ▼
              ┌──────────────┐  ┌──────────────┐
              │  New Billing  │  │   Monolith   │
              │ Microservice  │  │   (Perl)     │
              │  (Perl/Java)  │  │              │
              └──────────────┘  └──────────────┘
```

**Phase 3 — Containerize**
- Dockerize the new billing service (same approach as your KeyPay work)
- Deploy on EKS (which Athena Health already uses)
- Set up Jenkins/Harness CI/CD pipeline with `prove` for Perl tests

```dockerfile
FROM perl:5.38-slim
RUN cpanm --notest Moose DBI DBD::Pg JSON HTTP::Tiny Test::More
WORKDIR /app
COPY . .
EXPOSE 8080
CMD ["perl", "billing_service.pl"]
```

**Phase 4 — Data Separation**
- Initially, both monolith and microservice read from the same database
- Gradually move billing tables to a dedicated database
- Use events/message queue for cross-service communication

**Phase 5 — Testing & Cutover**
- Run both old and new in parallel, compare results (shadow testing)
- Monitor with logging and metrics
- Gradual traffic shift: 10% → 50% → 100%"

---

### Q9. Perl's bless+package OOP vs JS class+prototype

**Answer:**

```perl
# PERL OOP — Manual, explicit
# 1. A "class" is just a package (namespace)
# 2. An "object" is just a blessed reference (usually a hashref)
# 3. A "method" is just a subroutine that receives $self as first arg
# 4. "Inheritance" is just @ISA lookup (or "use parent")
# 5. There's NO access control (no private/public)
# 6. There's NO constructor magic — you write "new" yourself
# 7. Properties are just hash keys — no formal declaration

package Dog;
sub new {
    my ($class, %args) = @_;
    return bless \%args, $class;    # any hashref can be an object
}
sub speak {
    my ($self) = @_;                # $self is passed explicitly
    return "Woof! I'm $self->{name}";
}
```

```javascript
// JS OOP — Built-in, automatic
// 1. A "class" is a class declaration (syntactic sugar over prototype)
// 2. An "object" is auto-created by "new" and linked to prototype
// 3. A "method" has implicit "this"
// 4. "Inheritance" is prototype chain + "extends"
// 5. Private fields exist (#field)
// 6. Constructor is built-in
// 7. Properties can be declared in class body

class Dog {
    #name;    // private field
    constructor(name) {
        this.#name = name;    // "this" is implicit
    }
    speak() {
        return `Woof! I'm ${this.#name}`;
    }
}
```

**Key differences:**

| Aspect | Perl (bless) | JavaScript (class) |
|--------|-------------|-------------------|
| Object is | A blessed hashref | Auto-created by engine |
| `this`/`self` | Explicitly passed as `$_[0]` | Implicitly bound via `this` |
| Properties | Just hash keys, no declaration | Declared or assigned in constructor |
| Private fields | None (convention: `_name`) | `#name` syntax |
| Type checking | None built-in | None built-in (TS adds it) |
| Method dispatch | Walks `@ISA` chain | Walks prototype chain |
| Multiple inheritance | Yes (multiple `@ISA` entries) | No (single extends) |

**What Moose solves:**
- Adds `has` for property declaration (like class fields)
- Adds type constraints (like TypeScript)
- Adds `required` validation
- Adds read-only/read-write control
- Adds Roles (like interfaces/mixins — solves multiple inheritance problems)
- Eliminates boilerplate constructors and getters/setters

---

## Round 4 — Database & Performance

---

### Q10. Find patients with 3+ appointments with same provider in last 6 months

**Answer:**

```perl
use DBI;

my $dbh = DBI->connect(
    "dbi:Pg:dbname=athena;host=localhost",
    "user", "password",
    { RaiseError => 1, AutoCommit => 1 }
) or die $DBI::errstr;

my $sql = q{
    SELECT
        p.first_name,
        p.last_name,
        a.provider,
        COUNT(*) AS visit_count
    FROM patients p
    INNER JOIN appointments a
        ON p.patient_id = a.patient_id
    WHERE a.appointment_date >= CURRENT_DATE - INTERVAL '6 months'
      AND a.status = 'completed'
    GROUP BY p.patient_id, p.first_name, p.last_name, a.provider
    HAVING COUNT(*) > 3
    ORDER BY visit_count DESC
};

my $sth = $dbh->prepare($sql);
$sth->execute();

print "Patients with 3+ visits to same provider (last 6 months):\n";
print "-" x 60 . "\n";

while (my $row = $sth->fetchrow_hashref) {
    print "  $row->{first_name} $row->{last_name}";
    print " — $row->{provider}";
    print " ($row->{visit_count} visits)\n";
}

$dbh->disconnect;
```

**Key points:**
- Use `INNER JOIN` (not LEFT JOIN — we only want patients WITH appointments)
- `GROUP BY` must include all non-aggregated columns (PostgreSQL strict mode)
- `HAVING` filters after grouping (not `WHERE`)
- Use `INTERVAL` for date math in PostgreSQL
- Always use placeholders (`?`) for user input (this query has no user input so it's fine)

**If it had user input:**
```perl
# Parameterized — prevents SQL injection
my $sth = $dbh->prepare(q{
    SELECT * FROM patients WHERE provider = ? AND status = ?
});
$sth->execute($provider_name, "completed");

# NEVER do this:
# my $sth = $dbh->prepare("SELECT * FROM patients WHERE provider = '$provider_name'");
# This is vulnerable to SQL injection — same as in Node.js
```

---

### Q11. Optimize a slow HL7 batch processing script

**Answer:**

"With 500,000 messages per night, here's how I'd optimize, drawing from my Node.js streaming and performance experience:

**1. Profile first (don't guess)**
```perl
# Use Devel::NYTProf — Perl's profiler (like Node's --inspect + Chrome DevTools)
# Run: perl -d:NYTProf process_hl7.pl
# Then: nytprofhtml  (generates HTML report showing where time is spent)
```

**2. Batch database operations**
```perl
# SLOW — one INSERT per message
for my $msg (@messages) {
    $dbh->do("INSERT INTO results VALUES (?, ?)", undef, $msg->{id}, $msg->{data});
}

# FAST — batch INSERT (same optimization you'd do in Node.js)
my $sth = $dbh->prepare("INSERT INTO results VALUES (?, ?)");
$dbh->begin_work;

my $batch_count = 0;
for my $msg (@messages) {
    $sth->execute($msg->{id}, $msg->{data});
    $batch_count++;

    if ($batch_count % 1000 == 0) {
        $dbh->commit;
        $dbh->begin_work;
    }
}
$dbh->commit;
```

**3. Stream the file — don't slurp**
```perl
# SLOW — reads entire file into memory
my @lines = <$fh>;    # 500K messages in memory at once!

# FAST — process line by line (like Node.js streams)
while (my $line = <$fh>) {    # one line at a time
    chomp $line;
    process_message($line);
}
```

**4. Precompile regex patterns**
```perl
# SLOW — regex recompiled every iteration
for my $msg (@messages) {
    if ($msg =~ /PID\|.*?\|.*?\|(\w+)\^/) { ... }
}

# FAST — precompile with qr//
my $pid_pattern = qr/PID\|.*?\|.*?\|(\w+)\^/;
for my $msg (@messages) {
    if ($msg =~ $pid_pattern) { ... }
}
```

**5. Use forking for parallel processing**
```perl
# Split the file into chunks and process with multiple workers
# Like Node.js worker_threads or child_process.fork()

use Parallel::ForkManager;

my $pm = Parallel::ForkManager->new(4);    # 4 parallel workers

for my $chunk (@file_chunks) {
    $pm->start and next;    # fork

    process_chunk($chunk);   # child processes this chunk

    $pm->finish;             # child exits
}

$pm->wait_all_children;
```

**6. Use prepared statements** (already shown above — avoids SQL parsing overhead)"

---

### Q12. fetchrow_array vs fetchrow_hashref vs fetchall_arrayref

**Answer:**

```perl
# Setup: query returns patients
my $sth = $dbh->prepare("SELECT patient_id, first_name, last_name FROM patients");
$sth->execute();

# ─────────────────────────────────────────────────
# fetchrow_array — returns a list of VALUES (ordered by column)
# ─────────────────────────────────────────────────

while (my @row = $sth->fetchrow_array) {
    print "ID: $row[0], Name: $row[1] $row[2]\n";
    # Access by index: $row[0] = patient_id, $row[1] = first_name, etc.
}
# JS analogy: rows.map(row => [row[0], row[1], row[2]])
# Use when: performance matters and you know the column order
# Downside: $row[0] is unclear — what column is that?


# ─────────────────────────────────────────────────
# fetchrow_hashref — returns a HASH reference (column_name => value)
# ─────────────────────────────────────────────────

while (my $row = $sth->fetchrow_hashref) {
    print "ID: $row->{patient_id}, Name: $row->{first_name} $row->{last_name}\n";
    # Access by name: $row->{patient_id}, $row->{first_name}
}
# JS analogy: rows.map(row => ({ patient_id: row.patient_id, ... }))
# Use when: readability matters (most common in practice)
# Downside: slightly slower than fetchrow_array (hash creation overhead)


# ─────────────────────────────────────────────────
# fetchall_arrayref — fetches ALL rows at once into a nested array
# ─────────────────────────────────────────────────

my $all_rows = $sth->fetchall_arrayref;
# $all_rows = [
#     [101, "John", "Doe"],
#     [102, "Jane", "Smith"],
# ]
for my $row (@{$all_rows}) {
    print "ID: $row->[0], Name: $row->[1]\n";
}
# JS analogy: const allRows = await client.query(sql); allRows.rows
# Use when: you need all data in memory (small result sets, building reports)
# Downside: loads EVERYTHING into memory — bad for large result sets


# BONUS: fetchall_arrayref with hash slice
my $all_hashes = $sth->fetchall_arrayref({});
# $all_hashes = [
#     { patient_id => 101, first_name => "John", last_name => "Doe" },
#     { patient_id => 102, first_name => "Jane", last_name => "Smith" },
# ]
# This is the closest to Node.js: res.rows from pg driver
```

**Quick decision guide:**

| Method | Returns | Memory | Readability | Speed |
|--------|---------|--------|-------------|-------|
| `fetchrow_array` | One row as list | Low | Low (index-based) | Fastest |
| `fetchrow_hashref` | One row as hashref | Low | High (name-based) | Fast |
| `fetchall_arrayref` | All rows at once | High | Medium | One DB call |
| `fetchall_arrayref({})` | All rows as hashrefs | High | High | One DB call |

---

## Round 5 — Debugging & Error Handling

---

### Q13. Debugging a script that silently inserts wrong data

**Answer:**

"Here's my debugging approach, mapped from my Node.js/Chrome DevTools experience:

**Step 1: Add strict mode and warnings (if not already present)**
```perl
use strict;        # catches undeclared variables
use warnings;      # catches common mistakes (like using undef)
# Same as 'use strict' in JS + enabling ESLint
```

**Step 2: Dump the data at each stage with Data::Dumper**
```perl
use Data::Dumper;

# This is Perl's console.log for complex data structures
print Dumper($patient_record);
# Output:
# $VAR1 = {
#     'first_name' => 'John',
#     'last_name' => 'Doe',
#     'dob' => undef,          ← AH HA! DOB is undef, that's the bug
# };

# For cleaner output:
$Data::Dumper::Sortkeys = 1;    # sort hash keys
$Data::Dumper::Indent = 1;      # compact indentation
```

**Step 3: Use the Perl debugger for step-through**
```bash
# Run the script in debug mode (like node --inspect):
perl -d script.pl

# Debugger commands:
# n        = next line (step over)       — like F10 in Chrome
# s        = step into function          — like F11 in Chrome
# c        = continue                    — like F8 in Chrome
# p $var   = print variable              — like console.log
# x $var   = dump variable (like Dumper) — like hover in Chrome
# b 42     = set breakpoint at line 42   — like clicking gutter in Chrome
# w $var   = watch variable
```

**Step 4: Log the actual SQL being executed**
```perl
# Enable DBI tracing — shows exact SQL + bound parameters
$dbh->{TraceLevel} = 2;
# Or: DBI->trace(2, '/tmp/dbi_trace.log');

# Now every query execution is logged:
# -> prepare('INSERT INTO patients VALUES (?, ?, ?)')
# -> execute('John', 'Doe', undef)
#    ← you'd see the undef here and know DOB isn't being passed
```

**Step 5: Add assertions at critical points**
```perl
# Guard clauses that die loudly instead of silently continuing
die "patient_id is required" unless defined $patient->{patient_id};
die "DOB format invalid: $dob" unless $dob =~ /^\d{4}-\d{2}-\d{2}$/;

# Like throwing validation errors in Express middleware
```

**Step 6: Use prove to add regression tests**
```perl
# Create: t/test_insert.t
use Test::More;

my $record = prepare_patient_record($raw_data);
is($record->{dob}, '1990-05-15', 'DOB correctly parsed');
ok(defined $record->{patient_id}, 'patient_id is present');
isnt($record->{last_name}, '', 'last_name is not empty');

done_testing;

# Run: prove -v t/test_insert.t
```
"

---

### Q14. What's wrong with this nested eval error handling?

```perl
eval {
    my $result = process_claim($claim_id);
    eval {
        send_notification($result);
    };
    update_status($claim_id, "processed");
};
if ($@) {
    log_error($@);
}
```

**Answer — Two serious bugs:**

**Bug 1: The inner `eval` clobbers `$@`**

```perl
eval {
    my $result = process_claim($claim_id);     # suppose this SUCCEEDS

    eval {
        send_notification($result);            # suppose this FAILS
    };
    # Right here, $@ has the notification error message

    # BUT: even if inner eval failed, execution CONTINUES here!
    update_status($claim_id, "processed");     # THIS STILL RUNS!
    # The claim gets marked "processed" even though notification failed
};

if ($@) {
    # $@ was set by the inner eval, but then cleared by the
    # successful completion of update_status.
    # If update_status succeeds, $@ is now "" (empty).
    # So this block might NOT execute even though there was an error!
    log_error($@);
}
```

**Bug 2: The inner eval's error is silently swallowed**

The inner `eval` catches the notification error, but nothing checks `$@` after it. The error vanishes.

**The fix:**

```perl
# OPTION 1: Check $@ after each eval
eval {
    my $result = process_claim($claim_id);

    eval {
        send_notification($result);
    };
    if ($@) {
        # Handle notification error explicitly
        log_error("Notification failed: $@");
        # Decide: should we still update status?
        # Maybe re-throw: die "Notification failed: $@";
    }

    update_status($claim_id, "processed");
};
if ($@) {
    log_error("Claim processing failed: $@");
}


# OPTION 2: Use Try::Tiny (recommended — avoids $@ clobbering entirely)
use Try::Tiny;

try {
    my $result = process_claim($claim_id);

    try {
        send_notification($result);
    } catch {
        log_error("Notification failed: $_");
        # $_ contains the error in Try::Tiny (not $@)
    };

    update_status($claim_id, "processed");

} catch {
    log_error("Claim processing failed: $_");
};
```

**JS parallel — this is like the classic "unhandled promise inside try/catch" bug:**

```javascript
// JS equivalent of the same bug:
try {
    const result = await processClaim(claimId);

    try {
        await sendNotification(result);
    } catch (innerErr) {
        // If you don't re-throw, execution continues!
    }

    await updateStatus(claimId, "processed");  // runs even if notification failed!

} catch (err) {
    logError(err);
}
```

---

### Q15. Adding test coverage to untested legacy Perl code

**Answer:**

"Coming from a Jest testing background, here's how I'd approach adding tests to untested Perl code:

**Step 1: Start with characterization tests (capture current behavior)**

Don't try to fix anything yet. Just document what the code currently does, even if it's wrong:

```perl
# t/characterization/billing.t
use Test::More;
use BillingModule;

# Capture what the function CURRENTLY returns
# (not what it SHOULD return — that comes later)

my $result = BillingModule::calculate_total({
    amount    => 100,
    tax_rate  => 0.08,
    discount  => 10,
});

# Document current behavior:
is($result, 97.2, 'current billing calculation behavior');
# Now if someone changes the function, this test breaks
# and they know they need to verify the change

done_testing;
```

**Step 2: Use Test::More (Perl's Jest equivalent)**

```perl
# Full test structure:
use Test::More;
use Test::Exception;    # for testing dies
use Test::Deep;         # for deep structure comparison (like Jest's toEqual)

# Group tests with subtest (like Jest's describe)
subtest 'Patient validation' => sub {
    # Test normal case
    my $p = Patient->new(first_name => "John", last_name => "Doe");
    is($p->full_name, "Doe, John", "full_name formats correctly");

    # Test edge case
    my $p2 = Patient->new(first_name => "Mary Jane", last_name => "O'Brien");
    is($p2->full_name, "O'Brien, Mary Jane", "handles apostrophes and spaces");

    # Test error case (like Jest's expect().toThrow())
    dies_ok {
        Patient->new(first_name => "John");    # missing required last_name
    } 'dies without last_name';
};

subtest 'HL7 parsing' => sub {
    my $pid = 'PID|1||MRN123^^^HOSP||DOE^JOHN^M||19900515|M';
    my $result = parse_pid_segment($pid);

    # Deep comparison (like Jest's toEqual)
    cmp_deeply($result, {
        mrn         => 'MRN123',
        first_name  => 'JOHN',
        last_name   => 'DOE',
        middle_name => 'M',
        dob         => '19900515',
        gender      => 'M',
    }, 'PID segment parsed correctly');
};

done_testing;
```

**Step 3: Run with prove (Perl's test runner — like npx jest)**
```bash
# Run all tests:
prove -v -r t/

# Run one file:
prove -v t/billing.t

# With color and timer:
prove -v --timer t/

# Jest equivalent:
# npx jest --verbose
# npx jest billing.test.js
```

**Step 4: Measure coverage (like Jest --coverage)**
```bash
# Install coverage tool:
# cpanm Devel::Cover

# Run tests with coverage:
cover -test

# Generate HTML report:
cover -report html

# Open: cover_db/coverage.html
# Shows line-by-line coverage like Istanbul/Jest coverage
```

**Step 5: Prioritize what to test**
1. Functions that handle money/billing (highest risk at healthcare company)
2. HL7 parsing logic (data corruption = patient safety issue)
3. Database write operations
4. API endpoint handlers
5. Authentication/authorization checks

**Step 6: Add CI integration (use your Jenkins knowledge)**
```groovy
// Jenkinsfile
pipeline {
    agent { docker { image 'perl:5.38' } }
    stages {
        stage('Install') {
            steps { sh 'cpanm --installdeps --notest .' }
        }
        stage('Test') {
            steps { sh 'prove -v -r t/' }
        }
        stage('Coverage') {
            steps {
                sh 'cover -test'
                sh 'cover -report html'
            }
            post {
                always {
                    publishHTML(target: [
                        reportDir: 'cover_db',
                        reportFiles: 'coverage.html',
                        reportName: 'Perl Coverage'
                    ])
                }
            }
        }
    }
}
```
"

---

## Quick Reference: Perl Testing ↔ Jest Mapping

| Jest (JS) | Test::More (Perl) |
|-----------|-------------------|
| `describe('name', () => {})` | `subtest 'name' => sub {};` |
| `expect(x).toBe(y)` | `is($x, $y, 'message')` |
| `expect(x).not.toBe(y)` | `isnt($x, $y, 'message')` |
| `expect(x).toEqual(obj)` | `is_deeply($x, $obj, 'msg')` |
| `expect(x).toMatch(/re/)` | `like($x, qr/re/, 'msg')` |
| `expect(fn).toThrow()` | `dies_ok { fn() } 'msg'` |
| `expect(x).toBeTruthy()` | `ok($x, 'msg')` |
| `expect(x).toBeInstanceOf(C)` | `isa_ok($x, 'C')` |
| `npx jest` | `prove -v -r t/` |
| `--coverage` | `cover -test` |

---

> **Tip for the interview:** When answering architecture or process questions,
> always reference your real experience: "At Intuit, I used Jenkins pipelines
> for CI/CD, and I'd apply the same approach with `prove` instead of `jest`
> in the test stage." This shows you can transfer skills, which is exactly
> what they want from a JS dev moving to Perl.
