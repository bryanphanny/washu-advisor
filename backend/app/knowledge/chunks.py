"""
Research-backed internship guide for Bryan Phan.
Each chunk is a focused, self-contained topic that embeds and retrieves well.
"""

CHUNKS = [
    {
        "id": "recruiting_timeline",
        "title": "Big Tech Internship Recruiting Timeline — Summer 2027",
        "content": """
Big tech internship portals for Summer 2027 open earlier than most students expect.
Amazon and Stripe open in late July to early August 2026 — not September.
Students who apply in the first week of a portal opening have meaningfully higher callback rates.

Company-by-company schedule based on 2025-2026 cycle patterns:
- Amazon: portal opens late July 2026. Apply day one. Positions fill within weeks. OA drops within 1 week of applying. Process: 3 OAs + virtual loop with Leadership Principle behavioral + coding.
- Stripe: portal opens early August 2026. Apply day one. First-wave candidates get more team options. Process: HackerRank OA → tech screen → 2 onsite rounds → manager round.
- Microsoft: portal opens around August 15, 2026. Apply by September. Process: Codility OA + phone screen + 3-round final.
- Meta: portal opens early September 2026. Average 37 days from application to offer. Rolling admissions — earlier applicants get more team choices. Shortest FAANG process: OA + 1 technical interview.
- Cloudflare: portal opens early September 2026. Apply by October for priority. Process: 4x 45-minute Superday (coding, system design, behavioral).
- Apple: September through November 2026. Hires team-by-team on a rolling basis. Check Apple careers page repeatedly as new team-specific postings appear.
- Google: portal opens around mid-October 2026. Critical: there is only a 2-4 week burst window. Miss it and you wait a year. Process: OA + 2 technical + 1 behavioral + team matching.
- Jane Street: September-October 2026. Approximately 1% acceptance rate, fewer than 150-200 spots globally. Completely different bar from standard SWE (see separate chunk).

Action items: Set job alerts on Simplify Jobs, LinkedIn, and Amazon.jobs starting July 1, 2026. Bookmark the Summer2027-Internships tracker on GitHub — it goes live around then. Have resume finalized before July.
""",
    },
    {
        "id": "dsa_prep",
        "title": "DSA / LeetCode Preparation Strategy for Big Tech Internships",
        "content": """
The NeetCode 150 has replaced Blind 75 as the current industry standard for technical interview preparation.
The intern bar is medium-heavy — not hard-heavy. Students who grind hards without mastering mediums choke on OAs.

Target: 200-250 quality problems solved by September 1 before Amazon and Stripe portals open.
Practice mediums timed at 25 minutes, hards at 40 minutes. Simulation under time pressure matters.

High-priority algorithmic topics in order of interview frequency:
1. Trees (traversal, LCA, serialize/deserialize)
2. Graphs (BFS/DFS, topological sort)
3. Dynamic programming (1D first, then 2D, then memoization)
4. Heaps and priority queues
5. Sliding window and two pointers
6. Binary search (including answer-space problems, not just sorted arrays)
7. Monotonic stack (increasingly common at Google and Amazon)
8. LRU Cache pattern (shows up everywhere, tests both design and implementation)

After NeetCode 150, spend August on company-tagged problems using LeetCode Premium ($35/month — worth it for 3 months before applications open). Target Amazon, Meta, and Google tags specifically.

Resource ranking by ROI:
1. NeetCode.io — best visual explanations, structured list, free videos
2. LeetCode Premium — company-tagged problems for targeted prep
3. Grokking the Coding Interview (Educative) — for pattern-first learners

Do not just solve problems. For each problem: be able to explain time and space complexity, handle edge cases cold, and solve it from scratch without looking at a solution. Pattern internalization matters more than problem count.
""",
    },
    {
        "id": "google_meta_interviews_2026",
        "title": "Google and Meta Interview Format Changes in 2026",
        "content": """
Google changed its interview format in 2026. This is live now and applies to Summer 2027 recruiting.

Google's new format has three rounds:
1. Code Comprehension Round: Candidates read, debug, and optimize a real-world codebase with Gemini available as an AI assistant. Interviewers explicitly evaluate AI fluency — prompt engineering, output validation, and debugging AI-generated code. This is new and most candidates are unprepared for it.
2. Open-Ended Engineering Round: Replaces one traditional coding interview. The problem is ambiguous with no clear requirements. You must clarify scope, define constraints, and then implement. This rewards engineering judgment over algorithmic pattern matching.
3. Behavioral Round: Now includes a technical design conversation based on your prior engineering work. Your ML research at Sun Lab becomes a direct interview topic — they will ask you to explain the system, justify architectural decisions, and discuss how you'd scale or modify it.

Implication: Practice using AI coding tools (Claude, Copilot) deliberately. But the key skill is validating and critiquing AI output, not just accepting it. Google explicitly evaluates this. Most candidates have a real gap here.

Meta changed its interview format in October 2025:
- AI-enabled coding round replaced one of two traditional coding rounds at the onsite stage
- Candidates work in a multi-file codebase through phases: bug fixing → core implementation → optimization
- Evaluated on four criteria: problem solving, code quality, verification (you must test your own output), communication
- Meta's process remains the shortest FAANG process — OA + 1 technical interview
- Average 37 days from application to offer with rolling admissions. Apply in September, not November.
""",
    },
    {
        "id": "amazon_stripe_interviews",
        "title": "Amazon and Stripe Interview Process and Strategy",
        "content": """
Amazon Online Assessment format:
- 2 problems on HackerRank (70-90 minutes)
- Problem 1: Arrays, strings, sliding window, or greedy (~20-25 min)
- Problem 2 (the decider): Graphs, trees, DP, or heaps with long problem descriptions. Reading comprehension is explicitly part of the test.
- Embedded work simulation: Personality/LP scenario questions within the OA. Students who click randomly get flagged for inconsistent LP alignment and may be rejected before a human reviews their coding score.
- Virtual loop: Behavioral (Leadership Principle) questions carry equal or greater weight than coding at the final stage.

Amazon Leadership Principles most tested in behavioral interviews (prepare STAR stories for each):
- Ownership: take responsibility for something outside your direct scope
- Bias for Action: make a decision with incomplete information
- Dive Deep: use data to solve a problem
- Customer Obsession: prioritize customer outcome over technical elegance
- Deliver Results: ship something under constraints or pressure

Each behavioral answer: keep action at 60% of the answer, quantify the result at the end. Memorize metrics from your ML research and GDG backend engineering experience.

Stripe interview is distinctly different from FAANG:
- Medium-difficulty LeetCode problems, but clean code quality and production-readiness are weighted heavily
- Interviewers evaluate variable naming, modular functions, and maintainability — not just whether the solution runs
- Integration round: read an unfamiliar GitHub repo and API docs quickly, then build on top of them. Rewards real engineering experience over competitive programming prep.
- Manager round: assesses how you handle changing requirements and communicate tradeoffs
- Apply day 1 of portal opening. First-wave candidates get better team matches.
""",
    },
    {
        "id": "cloudflare_janestreet_other",
        "title": "Cloudflare, Jane Street, and Non-FAANG Targets",
        "content": """
Cloudflare interview process:
- 4x 45-minute Superday: coding round + system design round + behavioral round
- System design at intern level is simplified: explain request flow, identify core components, show basic reasoning about databases, caches, and load balancers. You do not need full senior-level system design.
- Preparation should include basic Cloudflare Workers and edge computing concepts. They reward platform knowledge.
- Apply by October for priority consideration.

Jane Street (entirely different track, only pursue if specifically preparing):
- OA is 90-120 minutes with 3-5 medium-hard problems plus mental math for trading tracks
- Heavy OCaml and functional programming emphasis
- Approximately 1% acceptance rate, fewer than 150-200 spots globally
- Only worth pursuing if you invest specific prep time in probability, combinatorics, and functional programming idioms
- Not a standard SWE interview — treat it as a separate track entirely

Non-FAANG high-value targets for backend/cloud/AI:
Stripe, Cloudflare, Databricks, Ramp, Plaid, Figma, and Coinbase pay comparably to FAANG ($50-70/hour for SWE intern) and are slightly less competitive to get into than Google. Students who go FAANG-or-bust often end up with no offer. Apply broadly.

Databricks is specifically strong for backend/data infrastructure candidates. Ramp is excellent for backend engineers interested in fintech infrastructure. Both have strong intern-to-return offer pipelines.

Competition scale context: 273 applications per tech internship posting (Handshake 2025 Internships Index — highest of any industry). Cold applications without a referral or recruiter contact produce a very low callback rate at this volume.
""",
    },
    {
        "id": "backend_cloud_ai_bar",
        "title": "What Backend, Cloud, and AI Roles Actually Test vs Generic SWE",
        "content": """
For roles explicitly labeled backend, cloud, or AI/ML engineering, the DSA bar is identical to generic SWE, but additional dimensions are evaluated.

Backend roles (Amazon SDE, Cloudflare, Stripe infrastructure): DSA requirements are the same. Behavioral questions probe system thinking and tradeoffs. Expect simplified system design questions like 'design a rate limiter' or 'design a URL shortener' at the junior/intern level — not full senior system design, but basic component awareness (load balancer, database choice, caching layer, API design).

Cloud/infrastructure roles (AWS, GCP teams): Cloud fluency is expected even if not formally tested. If applying to AWS-specific teams, knowing the difference between S3, DynamoDB, Lambda, ECS, and when to use each is a real conversation advantage. Certifications signal intent to recruiters.

AI/ML engineering roles (Google DeepMind-adjacent, Meta FAIR-adjacent, AI infrastructure): Expect Python and PyTorch fluency questions, LLM orchestration concepts (RAG systems, vector databases, LangChain), and MLOps awareness (MLflow, Kubeflow, model serving). Your WashU ML research on the EHR transformer with Alzheimer's progression prediction is directly differentiating here. The behavioral round will probe what you built, how you evaluated model performance, and what tradeoffs you made in the pipeline design.

Key differentiator for AI roles in 2026: Companies want to see you can work with AI tools critically — not just write code, but validate and debug AI-generated output. Your FastAPI/Supabase project plus ML research at Sun Lab creates a strong narrative for 'AI-adjacent backend' roles. This combination is relatively rare at the intern level and opens doors at both traditional backend and AI infrastructure teams.

For Bryan specifically: the ML research at Sun Lab (EHR transformer, 40-50K patient cohort, Azure GPU compute, Python pipeline development) combined with backend engineering at GDG (n8n, HubSpot API, RAG pipeline, Supabase) positions you in the top tier of candidates for AI backend roles at Google, Meta AI, and Amazon ML infrastructure teams.
""",
    },
    {
        "id": "summer_projects",
        "title": "What Makes a Strong Portfolio Project for Tech Internship Applications",
        "content": """
The goal is one or two production-quality deployed projects, not five toy projects. Having a GitHub repo with a README is not enough — the project must be actually live and accessible.

What makes a project strong for backend/cloud/AI roles in 2026:
- Deployed and accessible: actually live on Railway, Fly.io, or AWS — not just a GitHub repo
- Has tests: at minimum pytest integration tests covering core endpoints
- Has a clear README with an architecture diagram, technology decisions with justifications, and measurable metrics ('handles X requests/second', 'reduced latency by Y%', 'serves Z daily users')
- Solves a real problem, not a to-do list app
- You can explain every architectural decision cold without looking at notes

Recommended project archetypes for Bryan's specific goals:

1. AI-augmented backend service: Build a FastAPI API that integrates an LLM with RAG over a domain corpus, backed by a vector database (pgvector in Supabase, Pinecone, or Chroma). Add streaming responses, rate limiting, basic auth, and Docker containerization. This directly aligns with AI backend roles and builds on your existing Supabase/FastAPI stack.

2. Distributed data pipeline: A small event-driven system using producer → message queue (Redis Streams or managed Kafka) → consumer → output (database + API). Demonstrates backend systems thinking and distributed computing awareness.

3. ML model serving system: Take a model or approach from your lab research, wrap it in a FastAPI endpoint, containerize it with Docker, and deploy it on Railway or AWS. Add a monitoring endpoint returning inference latency and throughput metrics. This bridges ML research to production engineering — very compelling for AI infrastructure roles.

Resume framing matters as much as the project itself. 'Built a REST API using FastAPI' is weak. 'Built a FastAPI service serving 500+ daily users that reduced response latency by 40% through Redis caching' is what lands interviews. Quantify everything, even if you have to estimate the metric from testing.
""",
    },
    {
        "id": "networking_tactics",
        "title": "Networking and Referral Strategy for Tech Internships",
        "content": """
Referrals are statistically significant: referred candidates are 4x more likely to get an interview than cold applicants. With 273 applications per posting, cold-applying without any network contact produces a very low callback rate.

Specific networking actions ranked by ROI:

1. WashU alumni outreach on LinkedIn: Search LinkedIn for WashU alumni at your target companies (Google, Meta, Amazon, Stripe, Cloudflare). Send a specific short message — not 'can I have a referral' but 'I'm a rising WashU junior working on [specific project]. I saw you're at Google on the [team] — would you have 20 minutes to chat about your experience? Happy to prepare specific questions.' Send 20-30 outreaches. Expect 4-6 conversations. One conversation can yield a referral, and referrals change the math entirely.

2. Your ML research advisor at WashU: Ask directly if they have contacts at Google DeepMind, Meta FAIR, or Microsoft Research. Lab PIs routinely have industry connections from conferences (NeurIPS, ICML, ICLR) and can make warm introductions. This is the most underutilized lever rising juniors have. A warm introduction from a professor to an industry researcher is stronger than any cold LinkedIn message.

3. Hackathons: Attend 1-2 hackathons this summer and fall. Not primarily for the technical output — for the recruiter network. High-value ones: HackMIT (fall), HackGT, and any Google-sponsored hackathon. Recruiters attend these events specifically to source candidates.

4. Grace Hopper Celebration 2026 (Anaheim, California, October 2026): Massive career fair with every major tech company recruiting on-site. Direct pipeline from floor conversations to recruiter contacts. Submit for the conference scholarship in July 2026 if cost is a concern.

5. Open source contributions: Contribute to repos maintained by your target companies. PyTorch for Meta-adjacent roles, Kubernetes or Istio for cloud-oriented roles. Contributions to high-visibility repos appear in recruiter searches and demonstrate initiative and production code quality.

6. Technical content online: A single substantive post on LinkedIn or Twitter/X about something you built gets genuine recruiter visibility. 1-2 posts about a real project you shipped attract more attention than 50 cold applications.
""",
    },
    {
        "id": "common_mistakes",
        "title": "Most Common Mistakes Rising Juniors Make During Tech Internship Recruiting",
        "content": """
These are the specific failure modes that appear repeatedly in candidate post-mortems:

1. Applying too late to Amazon and Stripe. Amazon's portal opens in late July. Students who apply in the first week have dramatically higher callback rates. Waiting until September means competing for the remaining spots after the best positions fill.

2. Underestimating Meta's process. Meta has the shortest FAANG process but rolling admissions means earlier applicants get more team choices. Apply in September, not November.

3. Not preparing Amazon Leadership Principle behavioral answers specifically. Amazon's LP questions are scored against specific criteria, not generic challenge questions. Students who improvise rather than preparing LP-specific STAR stories get screened out at the virtual loop even after passing coding rounds. This happens frequently.

4. Weak project framing on the resume. Having a project is not enough. 'I built a REST API using FastAPI' does not land interviews. 'Built a FastAPI service that reduced response latency by 40% through Redis caching, serving 500+ daily users' does. Quantify everything.

5. Grinding LeetCode hards before mastering mediums. The intern bar is medium-heavy. Students who focus on hards often cannot execute reliably under timed OA conditions because they skipped pattern internalization on mediums.

6. Not knowing your own projects cold. Google's behavioral round now includes a technical design conversation based on prior work. Stripe's integration round requires explaining your own architectural decisions. Candidates who cannot answer 'why did you choose PostgreSQL over MongoDB?' or 'how would you scale this service to 100x traffic?' about their own projects lose offers at this stage.

7. Ignoring Amazon's OA work simulation. The work simulation/LP personality section in Amazon's OA is graded. Answering randomly produces inconsistent LP alignment signals and can result in rejection before a human reviews coding performance.

8. Applying only to FAANG companies. Students who go FAANG-or-bust often end up without an offer. Stripe, Cloudflare, Databricks, Ramp, and Plaid pay comparably and are slightly less competitive to get into. Apply to 15-20 companies across tiers.

9. Not leveraging the WashU CS network. WashU has strong alumni at every major tech company. Students who use their professor relationships and alumni network get referrals. Students who don't, cold-apply, and get filtered out at the volume stage.

10. Forgetting Apple's team-by-team rolling model. Apple hires by team throughout a wide window. Applying once and waiting is wrong. Check Apple's careers page regularly as new postings appear — you may be a poor fit for one team's posting and an exact fit for another.
""",
    },
    {
        "id": "statistics_and_data",
        "title": "Statistics and Data on Big Tech Internship Competition and Success Rates",
        "content": """
Competition scale:
- 273 applications per tech internship posting (Handshake 2025 Internships Index) — highest of any industry sector
- Jane Street: approximately 1% acceptance rate, fewer than 150-200 spots globally
- Tech OA pass rates are not published, but anecdotally 20-30% of applicants who complete an OA advance to a phone screen

Intern-to-full-time conversion rates (NACE 2023-24 data):
- Industry average: 53% of interns receive full-time return offers, down from 58% in the prior cycle
- Meta: estimated 50-65% return offer rate
- Companies with highest conversion: approximately 72% offer rate

What differentiates successful candidates (from Levels.fyi, Taro, IGotAnOffer community data):
- Referral increases interview rate by 4x over cold applications (Zippia research)
- First-wave applicants (August-September for tech) have meaningfully higher callback rates than October-November applicants for the same roles
- Deployed GitHub portfolio with live projects is qualitatively noted by recruiters on Blind and Taro as a differentiator at the resume screen stage
- ML research plus backend engineering experience combination is specifically valuable for AI-adjacent backend roles in 2026. This combination is relatively rare at the intern level.
- Behavioral preparation: Amazon explicitly states behavioral questions carry equal or greater weight than coding at the virtual loop. Students who over-rotate on DSA and neglect LP prep lose offers at the final stage.

Market context:
- Big tech tightened intern headcounts vs 2021-2022 peaks. Google, Meta, and Amazon all reduced intern class sizes. The market has not fully recovered to peak levels.
- The combination of tighter headcounts and higher application volume means differentiation at both the resume screen (network, project quality) and technical screen (execution quality, not just problem-solving) matters more than it did three years ago.

Bryan's profile assessment vs these data points:
- 3.96 GPA at WashU CS: strong filter-passer, no GPA concern at any target company
- Python/FastAPI/Supabase/Docker: directly on-stack for AI backend and cloud infrastructure roles
- ML research at Sun Lab (EHR transformer, Azure GPU compute, Python pipeline): top-of-resume differentiator for Google DeepMind-adjacent, Meta AI Research-adjacent, and AI infrastructure roles
- GDG backend engineering (n8n, HubSpot API, RAG pipeline): demonstrates production system building beyond toy projects
- Gap: no deployed project demonstrating distributed systems thinking yet
- Gap: no cloud certification yet (minor, but addressable in the summer)
""",
    },
    {
        "id": "certifications",
        "title": "Cloud Certifications: Which Are Worth Getting and When",
        "content": """
Honest assessment of cloud certifications for a rising junior targeting backend/cloud/AI internships:

AWS Cloud Practitioner (CLF-C02):
- Study time: approximately 2-3 weeks
- Cost: approximately $100 to take
- Signal value: weak positive — it's a conversation credential, not a technical differentiator. Worth getting if targeting AWS-specific teams or if you want to signal cloud intent to resume screeners. Do not sacrifice coding prep time for this.

AWS Solutions Architect Associate (SAA-C03):
- Study time: approximately 4-6 weeks
- Cost: approximately $150 to take
- Signal value: meaningfully stronger than Cloud Practitioner. Demonstrates actual architectural understanding, not just terminology awareness. If you get one certification, make it this one rather than Cloud Practitioner. Relevant for backend cloud roles at any company using AWS (most of them).

Google Professional Cloud Associate:
- Study time: approximately 4-6 weeks
- Signal value: worth getting if specifically targeting GCP or Google Cloud teams. GCP has the strongest positioning in AI/data infrastructure (BigQuery, Vertex AI, TPUs) — directly relevant for AI engineering roles at Google or companies running AI workloads on GCP.

Bottom line on certifications: A deployed production project demonstrating real engineering skills beats any certification as a resume differentiator. Get certifications during dead time (travel, breaks between projects), not at the expense of project work or LeetCode prep. AWS SAA-C03 is the best use of summer time if you're targeting cloud infrastructure roles specifically.

Timeline recommendation for Bryan: Complete NeetCode 150 by August 1 first. If you have remaining time in August before portals open, study for AWS SAA-C03. Do not start certifications until the NeetCode 150 is complete.
""",
    },
]
