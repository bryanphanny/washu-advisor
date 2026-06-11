"""
Generic WashU academic advising knowledge base.
Content is applicable to any CS or CS+Finance student — no student-specific data.
"""

CHUNKS = [
    {
        "id": "cs_major_overview",
        "title": "WashU CS Major — Degree Requirements Overview",
        "content": """
The Bachelor of Science in Computer Science at WashU McKelvey School of Engineering requires:

CORE REQUIREMENTS (21 credits — all required, C- or better):
- CSE 1301: Introduction to Computer Science
- CSE 1302: Introduction to Computer Engineering
- CSE 2400: Logic and Discrete Mathematics
- CSE 2407: Data Structures and Algorithms
- CSE 3302: Object-Oriented Software Development Laboratory
- CSE 3407: Analysis of Algorithms
- CSE 3601: Introduction to Systems Software

SYSTEMS ELECTIVE (3 credits — choose 1):
- CSE 4202: Operating Systems Organization
- CSE 4205: Programming Systems and Languages
- CSE 4301: Translation of Computer Languages
- CSE 4303: Introduction to Computer Security
- CSE 4304: Reverse Engineering and Malware Analysis
- CSE 4703: Introduction to Computer Networks

METHODS ELECTIVE (3 credits — choose 1):
- CSE 4102: Introduction to Artificial Intelligence
- CSE 4107: Introduction to Machine Learning
- CSE 4402: Introduction to Cryptography
- CSE 4507: Introduction to Visualization
- CSE 4608: Introduction to Quantum Computing
- and others

TECHNICAL ELECTIVES (15 credits — 5 CSE courses):
- At least 2 must be 4000-level or above
- Up to 6 credits can come from approved non-CSE courses

MATHEMATICS (15 credits — all required):
- MATH 131: Calculus I
- MATH 132: Calculus II
- MATH 2130: Calculus III
- MATH 3300: Matrix Algebra
- ESE 3260: Probability and Statistics

COLLEGE WRITING (3 credits):
- CWP 1500 or equivalent (CWP 118 satisfies this requirement)

NATURAL SCIENCES (8 credits minimum)

HUMANITIES & SOCIAL SCIENCES (18 credits minimum)

TOTAL: 120 credits to graduate
""",
    },
    {
        "id": "finance_minor_overview",
        "title": "WashU Finance Minor — Requirements Overview",
        "content": """
The Finance Minor at WashU Olin Business School requires 15 credits total.

REQUIRED CORE (12 credits — all 4 courses required):
- ACCT 2610: Principles of Financial Accounting
- FIN 3150: Capital Markets and Financial Management
- FIN 4410: Investments
- FIN 4480: Advanced Financial Management

FINANCE ELECTIVE (3 credits — choose 1 from):
- FIN 3175: Banking and Financial Institutions
- FIN 4010: Advanced Valuation (1.5 cr)
- FIN 4023: Venture Capital Methods (1.5 cr)
- FIN 4024: Venture Capital Practice (1.5 cr)
- FIN 4025: Private Equity Methods (1.5 cr)
- FIN 4026: Private Equity Practice (1.5 cr)
- FIN 4232: Mergers and Acquisitions (1.5 cr)
- FIN 4280: Investment Praxis
- FIN 4370: Advanced Derivative Securities
- FIN 4400: Real Estate Finance (1.5 cr)
- FIN 4430: International Finance
- FIN 4506: Financial Technology: Methods and Practice
- FIN 4510: Options, Futures and Derivative Securities
- FIN 4601: Research Methods in Finance

NOTE: Some Finance electives are 1.5 credits each. Two 1.5-credit courses can satisfy the 3-credit elective requirement.
Students can combine two 1.5-credit electives (e.g., FIN 4023 + FIN 4024 for Venture Capital Methods + Practice).

Prerequisites: ACCT 2610 must be completed before most upper-level FIN courses.
FIN 3150 is a prerequisite or co-requisite for FIN 4410 and FIN 4480.
""",
    },
    {
        "id": "course_planning_strategy",
        "title": "Effective Semester Planning for CS Students",
        "content": """
WORKLOAD GUIDELINES:
- Full-time is 12-18 credit hours per semester
- A typical CS student takes 15-16 credits per semester to stay on pace for 4 years
- 120 credits ÷ 8 semesters = 15 credits/semester average
- Heavy STEM semesters (3+ CSE courses): consider dropping to 12-13 credits to maintain GPA

PREREQUISITE SEQUENCING:
The CS core has several mandatory sequences:
1. Start with CSE 1301 → CSE 1302 → CSE 2407 → CSE 3407 (algorithms chain)
2. CSE 2400 (Discrete Math) is a prerequisite for many upper-level CSE courses
3. MATH 131 → MATH 132 → MATH 2130 → MATH 3300 (math chain — can overlap with CS)
4. ESE 3260 (Probability/Stats) typically requires MATH 132

UPPER-LEVEL COURSE PLANNING:
- Take CSE 3601 (Systems Software) before most systems electives
- CSE 4202 (OS) strongly recommended before upper-level systems courses
- AI/ML electives (CSE 4102, CSE 4107) benefit from MATH 3300 background
- Finance Minor: plan ACCT 2610 early since it gates FIN 3150

BALANCING CS AND FINANCE MINOR:
- Finance courses have fixed scheduling (many only offered once/year)
- ACCT 2610 is often offered Fall only — check each semester's schedule
- FIN 3150 tends to be Spring only
- Build Finance courses into early semesters to avoid senior-year bottlenecks

GRADUATION CHECKLIST:
- Verify Natural Sciences credits (8 minimum) — AP/transfer credits often satisfy this
- Humanities & Social Sciences (18 credits) — diverse course spread across disciplines
- Double-check that at least 2 Technical Electives are 4000-level or above
- College Writing must be completed — CWP 118 satisfies this if taken
""",
    },
    {
        "id": "academic_policies",
        "title": "WashU Academic Policies — Grades, Add/Drop, Withdrawal",
        "content": """
GRADING SCALE:
A+, A (4.0) | A- (3.7) | B+ (3.3) | B (3.0) | B- (2.7)
C+ (2.3) | C (2.0) | C- (1.7) | D+ (1.3) | D (1.0) | D- (0.7) | F (0.0)
CR/NC (Credit/No Credit) — does not affect GPA
Pass/Fail — does not affect GPA; does count toward credits

CS CORE MINIMUM GRADE: C- or better is required in all CS Core courses.
Grades below C- do not satisfy the requirement and the course must be retaken.

WITHDRAWAL (W GRADE):
- Withdrawing from a course after the add/drop period results in a W on the transcript
- W grades do NOT affect GPA calculation
- W grades count toward credit hours attempted (can affect financial aid satisfactory academic progress)
- There is a limit on total W grades — consult your academic advisor if approaching this limit
- Courses withdrawn can be retaken in a future semester

ADD/DROP PERIOD:
- Typically the first ~2 weeks of each semester
- Dropping within this window leaves no record on transcript
- After the add/drop period, dropping becomes a Withdrawal (W grade)
- Late withdrawal may require Dean's approval and documentation

REPEAT POLICY:
- If a course is repeated, both grades appear on transcript
- The higher grade typically replaces the lower for GPA calculation purposes (verify with registrar)
- Some courses have retake limits

GPA REQUIREMENT:
- Minimum 2.0 cumulative GPA to remain in good standing
- Many graduate program applications and scholarship requirements specify a higher minimum
""",
    },
    {
        "id": "transfer_ap_credit",
        "title": "Transfer Credits and AP Exam Credit at WashU",
        "content": """
AP EXAM CREDIT AT WASHU:
WashU awards credit for many AP exams, typically requiring a score of 4 or 5.
Common AP equivalencies for CS/Engineering students:
- AP Calculus AB (score 4+): MATH 131 — Calculus I (3 credits)
- AP Calculus BC (score 4+): MATH 132 — Calculus II (3 credits); also may grant MATH 131 credit
- AP Chemistry (score 4+): CHEM 105 — General Chemistry I (3 credits)
- AP Biology (score 4+): BIOL 100A credit (6 credits)
- AP Statistics (score 4+): SDS 2200 — Elementary Probability and Statistics (3 credits)
- AP Computer Science A (score 4+): CSE 1301 — Introduction to Computer Science (3 credits)
- AP Microeconomics (score 4+): ECON 1011 — Introduction to Microeconomics (3 credits)
- AP Macroeconomics (score 4+): ECON 1021 — Introduction to Macroeconomics (3 credits)
- AP English Language (score 4+): CWP 118 — College Writing equivalent (3 credits)

Official AP equivalencies are listed in the WashU Course Bulletin (bulletin.wustl.edu).
AP credits appear as "Exam Credit" on the transcript and count toward total credit hours.
AP credits for courses that are degree requirements (like MATH 131, MATH 132) satisfy those requirements.

TRANSFER CREDIT:
- Transfer credits from accredited institutions can satisfy degree requirements if equivalent
- Transfer credit evaluation is done by the relevant department
- Transfer credits appear on the transcript and count toward graduation credits
- Up to a certain number of transfer credits can count toward the degree (verify with your advisor)

CREDIT HOUR COUNTS:
AP and transfer credits DO count toward the 120-credit graduation requirement.
Having AP credits allows students to take higher-level courses earlier or add a minor/second major.
""",
    },
    {
        "id": "cs_career_advice",
        "title": "Career and Internship Preparation for CS Students",
        "content": """
TECHNICAL INTERVIEW PREPARATION:
Software engineering internships at most companies involve coding interviews.

Core topics to master:
1. Data structures: arrays, linked lists, trees, graphs, hash tables, heaps
2. Algorithms: sorting, searching, BFS/DFS, dynamic programming, greedy algorithms
3. Complexity analysis: Big-O time and space complexity for all solutions
4. Problem-solving frameworks: clarify, plan, implement, test

Recommended preparation resources:
- LeetCode (structured practice — focus on Easy and Medium problems first)
- NeetCode 150 (curated problem list with video explanations)
- Cracking the Coding Interview (book — comprehensive reference)

Common interview question patterns:
- Two pointers, sliding window (arrays/strings)
- Tree traversal (BFS, DFS, level-order)
- Dynamic programming (1D, 2D, memoization)
- Graph traversal and topological sort
- Heap/priority queue problems

INTERNSHIP RECRUITING TIMELINE:
- Large tech companies (Amazon, Google, Meta, Microsoft) recruit early — often August to October for summer internships
- Application portals open earlier than most students expect: Amazon often opens in late July/August
- Apply early — rolling admissions means earlier applicants often get more team choices
- Prepare your resume and have 1-2 solid projects ready before applications open

RESUME TIPS:
- Quantify project impact where possible ("served X users", "reduced latency by Y%")
- List specific technologies and frameworks, not just general languages
- Each project bullet should describe what you built, how, and the outcome
- Keep it to 1 page as an undergraduate student

NETWORKING:
- WashU has strong alumni networks at major tech companies — use LinkedIn to connect
- Career fairs at WashU are valuable for direct recruiter contact
- Research experiences and lab work are strong differentiators on CS resumes
""",
    },
    {
        "id": "washu_academic_resources",
        "title": "WashU Academic Resources and Support Services",
        "content": """
ACADEMIC SUPPORT FOR CS STUDENTS:

Office Hours:
- All CS faculty hold regular office hours — check course syllabi for times
- Teaching assistants (TAs) hold additional office hours, especially for core CS courses
- Office hours are the most efficient way to get help on coursework and projects

WashU Resources:
- Writing Center: free tutoring for writing assignments including technical writing
- Academic Resource Center (ARC): tutoring, academic coaching, and study skills
- McKelvey Student Services: advising specific to engineering students
- Student Success Center: general academic support across all subjects

REGISTRATION TIPS:
- Registration opens on a rolling basis by credit hours — seniors register first
- Popular CS electives fill quickly — have backup courses planned
- Check prerequisites carefully before registering — the system may not catch all conflicts
- For Finance Minor courses, cross-check with Olin's schedule since they may only be offered once per year

ADVISING:
- Each CS student is assigned a faculty advisor — meet at least once per semester
- The CS undergraduate advising office can answer questions about requirements and degree exceptions
- Pre-registration advising sessions help plan course sequences in advance

DEGREE AUDIT:
- WebSTAC shows your official degree audit and credit counts
- Verify your unofficial audit matches your actual transcript regularly
- Report any discrepancies to the registrar before they become graduation issues
""",
    },
    {
        "id": "technical_electives_guide",
        "title": "CS Technical Electives — Selection Strategy",
        "content": """
The CS major requires 15 credits of technical electives (5 courses), with at least 2 at the 4000-level.
Up to 6 credits can come from approved non-CSE courses.

POPULAR ELECTIVE TRACKS by career goal:

AI/Machine Learning track:
- CSE 4102: Introduction to Artificial Intelligence
- CSE 4107: Introduction to Machine Learning
- CSE 4027: Introduction to Natural Language Processing
- CSE 4061: Text Mining
- CSE 4106: Data Science for Complex Networks
- CSE 4109: Introduction to AI for Health

Systems/Security track:
- CSE 4202: Operating Systems Organization
- CSE 4303: Introduction to Computer Security
- CSE 4304: Reverse Engineering and Malware Analysis
- CSE 4703: Introduction to Computer Networks
- CSE 4690: Security of the Internet of Things
- CSE 4607: Embedded Computing Systems

Software Engineering/Full Stack track:
- CSE 2004: Web Development
- CSE 3300: Rapid Prototype Development and Creative Programming
- CSE 4305: Database Management Systems
- CSE 4307: Software Engineering Workshop
- CSE 4308: Mobile Application Development
- CSE 4504: Software Engineering for External Clients

Systems/Architecture track:
- CSE 3602: Computer Architecture
- CSE 4059: Applied Parallel Programming: GPUs
- CSE 4207: Cloud Computing With Big Data Applications
- CSE 4208: Multi-Paradigm Programming in C++
- CSE 4602: Computer Systems Design

Theory track:
- CSE 4402: Introduction to Cryptography
- CSE 4470: Introduction to Formal Languages and Automata
- CSE 4608: Introduction to Quantum Computing
- CSE 3401: Parallel and Sequential Algorithms

APPROVED NON-CSE ELECTIVES (up to 6 credits can count):
Courses in mathematics, statistics, physics, and certain engineering disciplines may count.
Verify eligibility with your CS advisor before assuming a non-CSE course satisfies this requirement.

SENIOR CAPSTONE OPTIONS:
- CSE 4970/4971: Senior Project I & II (6 credits total — spans two semesters)
- CSE 4975: Undergraduate Honors Thesis
- CSE 4001: Independent Study (with faculty sponsor)
These capstone options count toward technical elective credits.
""",
    },
    {
        "id": "cs_finance_combined_planning",
        "title": "Planning CS + Finance Minor Together — Timeline and Strategy",
        "content": """
Combining a CS major with the Finance Minor requires careful sequencing since both have specific prerequisites.

RECOMMENDED SEQUENCING APPROACH:

Early semesters (Freshman/Sophomore):
- Complete CS core foundations: CSE 1301, CSE 1302, CSE 2400, CSE 2407
- Complete math sequence: MATH 131 → MATH 132 → MATH 2130
- Start Finance Minor early: ACCT 2610 (often only offered Fall)
- Natural Sciences and H&SS requirements can be spread across these semesters

Middle semesters (Sophomore/Junior):
- Advance in CS core: CSE 3302, CSE 3601
- Begin upper-level Finance: FIN 3150 after ACCT 2610
- Complete MATH 3300 and begin ESE 3260
- Start selecting CS electives aligned with career goals

Later semesters (Junior/Senior):
- Complete CS Core: CSE 3407 (Analysis of Algorithms)
- Complete Finance Core: FIN 4410, FIN 4480 (need FIN 3150 first)
- Select and complete Finance Elective
- Remaining CS Technical Electives — prioritize 4000-level courses
- Capstone or senior project if desired

CREDIT LOAD CONSIDERATIONS:
- CS + Finance Minor = approximately 120-130 credits total
- The minor adds 15 credits on top of the CS major requirements
- With AP credit for Calculus or other courses, students have more flexibility

SCHEDULING CONFLICTS:
- Many Finance courses are scheduled MWF or TTh in morning/afternoon blocks
- CS labs and studio courses often run in 3-hour blocks
- Build your schedule to avoid day-long blocks without breaks
- Finance courses at Olin and CS courses at McKelvey are in different buildings — allow travel time between classes on the same day

CAREER SYNERGIES:
CS + Finance combination is particularly valuable for:
- Fintech companies (Stripe, Plaid, Ramp, Bloomberg)
- Quantitative trading firms
- Investment bank technology divisions
- Financial technology consulting
""",
    },
]
