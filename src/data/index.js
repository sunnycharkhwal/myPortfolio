export const NAV_LINKS = ['Skills', 'Projects', 'Experience', 'Contact']

export const SKILLS = [
  { icon: '☁',  title: 'Cloud',         tags: ['AWS', 'EKS', 'Secrets Manager', 'CloudWatch', 'IAM'] },
  { icon: '📦', title: 'Containers',    tags: ['Kubernetes', 'Docker', 'Helm'] },
  { icon: '⚙',  title: 'CI / CD',      tags: ['Jenkins', 'ArgoCD', 'GitLab CI', 'GitHub Actions', 'Azure DevOps'] },
  { icon: '🏗',  title: 'IaC',          tags: ['Terraform', 'Ansible'] },
  { icon: '📊', title: 'Observability', tags: ['Prometheus', 'Grafana', 'CloudWatch'] },
  { icon: '🔒', title: 'Security',      tags: ['SonarQube', 'Trivy', 'OWASP', 'IAM Roles'] },
  { icon: '🖥',  title: 'Scripting',    tags: ['Python', 'Bash', 'Shell'] },
  { icon: '⚡', title: 'Frontend',      tags: ['React.js', 'Next.js', 'JavaScript', 'HTML', 'CSS3'] },
]

export const PROJECTS = [
  {
    id: 1, category: 'cicd', catLabel: 'CI/CD Pipeline',
    title: 'E-Commerce Platform: Automated Multi-Stage Deployment Pipeline',
    subtitle: 'Zero-downtime deployments for a Node.js + React app to AWS ECS',
    objective: 'Build a fully automated CI/CD pipeline that takes every GitHub commit through lint, test, security scan, staging deploy, smoke test, and production deploy — with automatic rollback on failure.',
    steps: [
      { title: 'Source & Trigger', text: 'Developer pushes to GitHub. <strong>AWS CodePipeline</strong> detects the change via webhook and starts the pipeline.' },
      { title: 'Build & Test', text: '<strong>AWS CodeBuild</strong> runs ESLint, Jest unit tests, and builds the Docker image. Fails fast and reports back to GitHub PR.' },
      { title: 'Security Scan', text: '<strong>Amazon ECR</strong> image scanning + Snyk CLI check in CodeBuild catches known CVEs before the image is pushed.' },
      { title: 'Staging Deploy', text: '<strong>AWS ECS (Fargate)</strong> deploys the new image to the staging cluster. Blue/green deployment using <strong>AWS CodeDeploy</strong>.' },
      { title: 'Smoke Tests', text: 'Post-deploy Lambda function triggers automated Postman collection via <strong>AWS Lambda</strong> and checks HTTP 200s on critical endpoints.' },
      { title: 'Production Deploy', text: 'Manual approval gate in CodePipeline → blue/green swap on the prod ECS cluster. Automatic rollback if CloudWatch alarms fire within 5 minutes.' },
    ],
    aws: ['CodePipeline', 'CodeBuild', 'CodeDeploy', 'ECR', 'ECS Fargate', 'Lambda', 'CloudWatch', 'SNS', 'S3'],
    outcomes: [
      'Deployment time reduced from 45 min manual to 8 min automated',
      'Zero-downtime deploys with instant rollback capability',
      'Every deployment artifact is versioned and auditable',
      'Security vulnerabilities caught before reaching production',
    ]
  },
  {
    id: 2, category: 'iac', catLabel: 'Infrastructure as Code',
    title: 'SaaS Startup: Multi-Environment AWS Infrastructure with Terraform',
    subtitle: 'Reproducible dev / staging / prod environments from a single codebase',
    objective: 'Replace ad-hoc ClickOps with a Terraform monorepo that provisions identical-but-isolated VPCs, EKS clusters, RDS databases, and IAM roles across three environments, with state stored remotely and drift detection in CI.',
    steps: [
      { title: 'Repo Structure', text: 'Terraform modules for <strong>VPC, EKS, RDS, IAM</strong>. Environment-specific tfvars files. Remote state in <strong>S3</strong> with DynamoDB locking.' },
      { title: 'CI Validation', text: '<strong>GitHub Actions</strong> runs `terraform fmt`, `validate`, `tfsec` static analysis, and `terraform plan` on every PR. Plan output is posted as a PR comment.' },
      { title: 'Apply Workflow', text: 'Merging to `main` triggers `terraform apply` for dev automatically. Staging and prod require a manual approval step via GitHub Environment protection rules.' },
      { title: 'Drift Detection', text: 'Scheduled GitHub Actions job runs `terraform plan` daily and posts a Slack alert via <strong>SNS → Lambda</strong> if any drift is detected.' },
      { title: 'Secret Management', text: 'All secrets injected at runtime from <strong>AWS Secrets Manager</strong> — never in tfvars. IAM roles use least-privilege policies generated per module.' },
      { title: 'State Management', text: 'Separate S3 bucket and DynamoDB table per environment. State files are versioned and encrypted with <strong>KMS</strong>.' },
    ],
    aws: ['S3', 'DynamoDB', 'EKS', 'RDS', 'VPC', 'IAM', 'Secrets Manager', 'KMS', 'SNS', 'Lambda'],
    outcomes: [
      'New environment spun up in under 12 minutes from scratch',
      'Infrastructure changes are reviewed like code — with diff and approval',
      'Drift detected and alerted within 24 hours automatically',
      'Eliminated all manually created "snowflake" cloud resources',
    ]
  },
  {
    id: 3, category: 'k8s', catLabel: 'Containers & Orchestration',
    title: 'FinTech App: Dockerized Microservices on Amazon EKS',
    subtitle: 'Containerizing a payments platform and running it on managed Kubernetes',
    objective: 'Package a multi-service payments application (API gateway, auth, transactions, notifications) into Docker containers, orchestrate them on EKS, and implement horizontal pod autoscaling and self-healing.',
    steps: [
      { title: 'Dockerize Services', text: 'Each service gets a hardened <strong>multi-stage Dockerfile</strong> — build stage compiles, final stage uses distroless base for minimal attack surface.' },
      { title: 'EKS Cluster Setup', text: '<strong>Amazon EKS</strong> cluster provisioned via Terraform. Node groups with mixed on-demand + spot instances. IRSA for pod-level IAM roles.' },
      { title: 'Helm Charts', text: 'Each microservice packaged as a <strong>Helm chart</strong> with environment-specific values. Deployed via ArgoCD GitOps — cluster state matches Git at all times.' },
      { title: 'Autoscaling', text: '<strong>HPA</strong> (CPU/memory) + <strong>KEDA</strong> (queue-depth scaling). <strong>Cluster Autoscaler</strong> adds/removes EC2 nodes automatically. Handles 10x traffic spikes.' },
      { title: 'Health & Recovery', text: 'Liveness + readiness probes on every pod. Pod Disruption Budgets ensure at least one replica survives node drain during upgrades.' },
      { title: 'Ingress & TLS', text: '<strong>AWS Load Balancer Controller</strong> + ACM certificate for TLS termination. NGINX Ingress for path-based routing between services.' },
    ],
    aws: ['EKS', 'ECR', 'ALB', 'ACM', 'EC2 (Spot)', 'IRSA / IAM', 'CloudWatch Container Insights', 'VPC'],
    outcomes: [
      'Pods auto-scale from 2 to 40 replicas during peak payment windows',
      'Node failures self-heal within 90 seconds — zero manual intervention',
      'Resource utilization improved 35% with bin-packing and spot instances',
      'Full GitOps: cluster state is always version-controlled and auditable',
    ]
  },
  {
    id: 4, category: 'cloud', catLabel: 'Cloud Migration',
    title: 'Retail Chain: Lift-and-Shift + Re-Architecture to AWS',
    subtitle: 'Migrating an on-prem inventory & POS system to AWS in two phases',
    objective: 'Migrate a 15-year-old on-premises retail management system to AWS — Phase 1 is lift-and-shift for speed; Phase 2 re-architects the monolith into managed services and reduces costs by 40%.',
    steps: [
      { title: 'Discovery & Assessment', text: '<strong>AWS Application Discovery Service</strong> + Migration Evaluator scan all 80 on-prem servers. Dependency mapping and TCO analysis produced automatically.' },
      { title: 'Phase 1 — Lift & Shift', text: '<strong>AWS MGN (Application Migration Service)</strong> replicates servers to EC2 with near-zero downtime. Database migrated using <strong>AWS DMS</strong> with ongoing replication during cutover.' },
      { title: 'Network Connectivity', text: '<strong>AWS Direct Connect</strong> for secure, low-latency hybrid connectivity during the transition period. VPN as failover path.' },
      { title: 'Phase 2 — Re-Architect', text: 'Monolithic app API layer moved to <strong>Lambda + API Gateway</strong>. MySQL moved from EC2 to <strong>Amazon Aurora Serverless v2</strong>. Static assets to <strong>S3 + CloudFront</strong>.' },
      { title: 'Data Migration', text: 'Historical transaction data (5 TB) migrated to <strong>Amazon Redshift</strong> for analytics. Replaces on-prem reporting server that took 4 hours per report.' },
      { title: 'Cutover & Validation', text: 'Blue/green DNS cutover via <strong>Route 53</strong> with weighted routing — 5% → 25% → 100% traffic shift over 48 hours with automated rollback triggers.' },
    ],
    aws: ['EC2', 'MGN', 'DMS', 'Aurora Serverless', 'Lambda', 'API Gateway', 'S3', 'CloudFront', 'Redshift', 'Direct Connect', 'Route 53'],
    outcomes: [
      'Phase 1 complete in 6 weeks — zero data loss, 4-hour maintenance window',
      'Phase 2 reduced monthly AWS bill by 42% vs equivalent EC2 lift-and-shift',
      'Reports that took 4 hours now run in 8 seconds on Redshift',
      'Eliminated 80 physical servers and $200K/yr data center lease',
    ]
  },
  {
    id: 5, category: 'mon', catLabel: 'Monitoring & Observability',
    title: 'Healthcare SaaS: Full-Stack Observability Platform',
    subtitle: 'Logs, metrics, traces, and alerting for a HIPAA-compliant application',
    objective: 'Implement end-to-end observability for a multi-tenant healthcare SaaS on AWS — covering structured logging, distributed tracing across microservices, custom business metrics, and SLO-based alerting that pages the right team at the right severity.',
    steps: [
      { title: 'Structured Logging', text: 'All services emit JSON logs to <strong>Amazon CloudWatch Logs</strong> via the CloudWatch Agent. Log groups per service. <strong>CloudWatch Insights</strong> for ad-hoc queries.' },
      { title: 'Distributed Tracing', text: '<strong>AWS X-Ray</strong> SDK instrumented in all Lambda functions and ECS services. Traces show exact latency contribution of each downstream call and DB query.' },
      { title: 'Metrics & Dashboards', text: 'Application metrics (order rate, error rate, p99 latency) pushed as <strong>CloudWatch Custom Metrics</strong>. Executive dashboard in <strong>Amazon Managed Grafana</strong>.' },
      { title: 'SLO Alerting', text: 'CloudWatch Composite Alarms model SLOs: "99.5% of requests succeed within 500ms over 5 min". Breach pages on-call via <strong>SNS → PagerDuty</strong>.' },
      { title: 'Log Archival', text: 'Logs shipped to <strong>S3</strong> via CloudWatch Subscriptions. <strong>Athena</strong> queries raw logs for compliance investigations. Retained 7 years for HIPAA.' },
      { title: 'Anomaly Detection', text: '<strong>CloudWatch Anomaly Detection</strong> learns seasonal patterns. Auto-scales alarm thresholds for business hours vs off-peak without manual tuning.' },
    ],
    aws: ['CloudWatch Logs', 'CloudWatch Metrics', 'AWS X-Ray', 'Amazon Managed Grafana', 'SNS', 'S3', 'Athena', 'Lambda', 'EventBridge'],
    outcomes: [
      'Mean time to detect (MTTD) reduced from 18 min to under 2 min',
      'Distributed traces pinpoint the root cause in seconds, not hours',
      'HIPAA-compliant 7-year log retention fully automated',
      'SLO dashboards give product team real-time reliability visibility',
    ]
  },
  {
    id: 6, category: 'sec', catLabel: 'DevSecOps',
    title: 'Insurance Platform: Security-First CI/CD Pipeline (DevSecOps)',
    subtitle: 'Embedding security scanning, secret detection, and compliance into every deploy',
    objective: 'Build a DevSecOps pipeline for a PCI-DSS compliant insurance platform where security is not a gate at the end — every stage validates security, secrets are managed centrally, and compliance evidence is generated automatically.',
    steps: [
      { title: 'Pre-Commit Hooks', text: '<strong>git-secrets</strong> and <strong>detect-secrets</strong> block commits containing API keys or credentials before they ever reach GitHub.' },
      { title: 'SAST in Pipeline', text: '<strong>CodeBuild</strong> runs <strong>SonarQube</strong> (code quality + security rules) and <strong>Checkov</strong> (IaC scanning). CVSS ≥ 7.0 vulnerabilities fail the build.' },
      { title: 'Container Scanning', text: '<strong>Amazon ECR Enhanced Scanning</strong> (powered by Snyk) scans every pushed image. Images with critical CVEs are blocked from ECS deployment by Lambda policy check.' },
      { title: 'Runtime Security', text: '<strong>Amazon GuardDuty</strong> monitors all accounts for threats (crypto mining, credential exfiltration). <strong>AWS Security Hub</strong> aggregates findings across services.' },
      { title: 'Secrets Management', text: 'All database passwords, API keys, and certificates stored in <strong>AWS Secrets Manager</strong>. Automatic 30-day rotation. Applications use IAM role + SDK — no hardcoded secrets anywhere.' },
      { title: 'Compliance Evidence', text: '<strong>AWS Config</strong> rules continuously check S3 bucket policies, security group rules, and encryption settings. <strong>AWS Audit Manager</strong> auto-collects PCI-DSS evidence.' },
    ],
    aws: ['CodePipeline', 'CodeBuild', 'ECR Enhanced Scanning', 'Secrets Manager', 'GuardDuty', 'Security Hub', 'AWS Config', 'Audit Manager', 'IAM', 'KMS'],
    outcomes: [
      'Security vulnerabilities caught 95% earlier — in PR, not in production',
      'Zero hardcoded secrets in any repository or deployment artifact',
      'PCI-DSS audit preparation reduced from 3 weeks to 2 days',
      'GuardDuty detected and blocked an SSH brute-force attempt within 4 minutes',
    ]
  },
  {
    id: 7, category: 'inc', catLabel: 'Incident Management',
    title: 'Ride-Sharing App: Automated Incident Response & Runbooks',
    subtitle: 'From alert firing to auto-remediation and structured post-mortems',
    objective: 'Build an incident management system where common failure modes are detected and auto-remediated within minutes, on-call engineers have runbooks that guide them step-by-step, and every incident produces a structured post-mortem with action items tracked.',
    steps: [
      { title: 'Alert → Ticket', text: '<strong>CloudWatch Alarms</strong> fire to <strong>SNS</strong>. Lambda function creates a PagerDuty incident, a Jira ticket, and posts in a dedicated Slack war-room channel — automatically.' },
      { title: 'Auto-Remediation', text: '<strong>AWS Systems Manager Automation</strong> documents handle known issues: ECS task OOMKill → restart task; RDS connections exhausted → kill idle connections; EC2 disk full → expand EBS volume.' },
      { title: 'Runbook Execution', text: 'Slack bot (Lambda-backed) responds to `/runbook <symptom>` and surfaces the relevant SSM Automation document. On-call engineer approves, bot executes — full audit trail in CloudTrail.' },
      { title: 'Escalation Logic', text: 'If P1 is unacknowledged in 5 min, <strong>EventBridge</strong> triggers Lambda to page the secondary on-call, then the engineering manager at 10 min via multi-level PagerDuty policy.' },
      { title: 'Timeline Recording', text: 'All Slack messages in the war-room, CloudWatch metric data, and X-Ray traces are automatically archived to <strong>S3</strong> to form the incident timeline for post-mortems.' },
      { title: 'Post-Mortem Generation', text: '<strong>Lambda + Bedrock (Claude)</strong> drafts a structured post-mortem from the timeline: summary, impact, root cause, contributing factors, action items. Team edits and publishes to Confluence.' },
    ],
    aws: ['CloudWatch', 'SNS', 'Lambda', 'SSM Automation', 'EventBridge', 'CloudTrail', 'S3', 'Bedrock', 'IAM'],
    outcomes: [
      'Auto-remediation resolves 40% of P2/P3 incidents without engineer intervention',
      'MTTR for known failure modes reduced from 25 min to under 4 min',
      'Every incident has a complete, machine-readable timeline for analysis',
      'Post-mortem quality improved significantly with AI-assisted drafts',
    ]
  },
  {
    id: 8, category: 'db', catLabel: 'Database DevOps',
    title: 'B2B SaaS: Zero-Downtime Database Schema Migrations',
    subtitle: 'Automated, safe, and reversible database changes on Amazon Aurora PostgreSQL',
    objective: 'Implement a database change management workflow using Flyway and Amazon Aurora PostgreSQL that enables zero-downtime schema migrations, instant rollback capability, and fully automated execution in CI/CD — eliminating risky manual DB changes.',
    steps: [
      { title: 'Migration Authoring', text: 'Schema changes written as versioned <strong>Flyway SQL migration files</strong> (V1__add_users_table.sql). Changes are code-reviewed like application code in GitHub PRs.' },
      { title: 'Validation in CI', text: '<strong>CodeBuild</strong> spins up an Aurora PostgreSQL clone using <strong>RDS fast cloning</strong> and runs Flyway migrate against it — validating the migration takes under 30 seconds in CI.' },
      { title: 'Expand Phase', text: 'Production migrations use the Expand/Contract pattern. Phase 1 (additive only): add new column/table. Application deployed to handle both old and new schema. No locks, no downtime.' },
      { title: 'Data Migration', text: 'Background <strong>Lambda</strong> function backfills data in 1000-row batches during off-peak hours. Progress tracked in a migration_status table. Idempotent — safe to re-run.' },
      { title: 'Contract Phase', text: 'After all data is migrated and old code paths are removed: Phase 2 drops old columns. Short table lock, but < 50ms on empty/small columns. Flyway repair handles failures.' },
      { title: 'Backup & Rollback', text: 'Automated <strong>Aurora snapshot</strong> taken before every migration. Point-in-time recovery to any second in the last 35 days. Rollback scripts tested in CI alongside forward migrations.' },
    ],
    aws: ['Amazon Aurora PostgreSQL', 'RDS Fast Clone', 'CodeBuild', 'Lambda', 'S3', 'Secrets Manager', 'CloudWatch', 'SNS'],
    outcomes: [
      'Eliminated all scheduled maintenance windows for schema changes',
      'Migration validation catches issues in CI — never reaches prod broken',
      'Rollback from any migration in under 3 minutes using Aurora snapshots',
      'Database changes now deployed 4× per week vs monthly batch previously',
    ]
  },
  {
    id: 9, category: 'mesh', catLabel: 'Microservices & Service Mesh',
    title: 'Media Streaming Platform: Service Mesh with AWS App Mesh + EKS',
    subtitle: 'Reliable inter-service communication, canary releases, and circuit breaking',
    objective: 'Implement a service mesh across 12 microservices on EKS to gain fine-grained traffic control for canary deployments, automatic circuit breaking for cascading failure prevention, and mTLS for all east-west service communication.',
    steps: [
      { title: 'App Mesh Setup', text: '<strong>AWS App Mesh</strong> deployed on EKS. Envoy sidecar injected automatically into all service pods via admission webhook. Mesh config stored as Kubernetes CRDs.' },
      { title: 'mTLS Everywhere', text: '<strong>AWS Certificate Manager Private CA</strong> issues short-lived certificates to every Envoy sidecar. All east-west traffic is mutually authenticated and encrypted — no code changes required.' },
      { title: 'Canary Releases', text: 'New version of the recommendation service deployed alongside old. App Mesh VirtualRouter routes 5% traffic to v2 using weighted targets. Monitor error rate → auto-shift to 100% or rollback.' },
      { title: 'Circuit Breaking', text: 'Envoy outlier detection configured: if a pod returns 5xx on 50% of requests in 10s, it is ejected from the load balancer pool for 30s. Prevents one bad instance from degrading all traffic.' },
      { title: 'Observability', text: '<strong>AWS X-Ray</strong> integrated with Envoy. Every request traced end-to-end across all 12 services. <strong>CloudWatch Container Insights</strong> shows per-route latency histograms.' },
      { title: 'Traffic Shaping', text: 'Retry policies (3 retries on 503, 50ms base delay), timeout policies (2s service timeout), and gRPC deadline propagation configured at mesh layer — no changes to application code.' },
    ],
    aws: ['EKS', 'AWS App Mesh', 'ACM Private CA', 'AWS X-Ray', 'CloudWatch', 'ALB', 'ECR', 'IAM'],
    outcomes: [
      'Canary releases catch production bugs before they affect >5% of users',
      'Circuit breaking prevented 3 full outages caused by a downstream service',
      'mTLS achieved across all services with zero application code changes',
      'Service-to-service latency reduced 12% by eliminating redundant retries',
    ]
  },
  {
    id: 10, category: 'fin', catLabel: 'FinOps & Cost Optimization',
    title: 'Scale-Up: AWS Cost Optimization & FinOps Program',
    subtitle: 'Reducing a $180K/month AWS bill by 38% without affecting performance',
    objective: 'Implement a FinOps program across AWS accounts to identify waste, enforce tagging, rightsizes resources, migrate eligible workloads to Spot and Savings Plans, and give engineering teams real-time cost visibility and budgets.',
    steps: [
      { title: 'Cost Visibility', text: '<strong>AWS Cost Explorer</strong> + <strong>AWS Cost and Usage Reports</strong> sent to S3 → <strong>Amazon QuickSight</strong> dashboard. Teams see their own costs broken down by service, environment, and resource tag.' },
      { title: 'Tagging Enforcement', text: '<strong>AWS Config</strong> rule flags any resource missing required tags (team, environment, project). <strong>Service Control Policies</strong> in AWS Organizations block resource creation without mandatory tags.' },
      { title: 'Rightsizing', text: '<strong>AWS Compute Optimizer</strong> identifies over-provisioned EC2 instances, Lambda memory, and EBS volumes. Recommendations reviewed weekly; automated resizing for non-prod via Lambda + SSM.' },
      { title: 'Spot & Savings Plans', text: 'Stateless ECS and EKS workloads migrated to <strong>Spot Instances</strong> (60-80% savings). Committed baseline purchased as <strong>Compute Savings Plans</strong>. Spot interruption handled gracefully by ECS task drain.' },
      { title: 'Idle Resource Cleanup', text: '<strong>Lambda</strong> scheduled daily: stops EC2 instances tagged env=dev at 7pm, terminates unused EBS snapshots older than 90 days, deletes unattached EIPs. Saves ~$8K/month passively.' },
      { title: 'Budget Alerts', text: '<strong>AWS Budgets</strong> per team with 80% and 100% threshold alerts to Slack. Forecast-based alerts warn if the team is trending toward overspend 7 days before month end.' },
    ],
    aws: ['Cost Explorer', 'CUR', 'QuickSight', 'AWS Config', 'Compute Optimizer', 'Savings Plans', 'Spot Instances', 'AWS Budgets', 'Lambda', 'Organizations / SCP'],
    outcomes: [
      '$68K/month saved — 38% reduction from $180K to $112K monthly AWS spend',
      '100% resource tagging compliance achieved and maintained via policy',
      'Dev/test environments automatically shut down nights and weekends',
      'Teams have real-time cost dashboards — cost awareness became part of sprint reviews',
    ]
  },
  {
    id: 11, category: 'dr', catLabel: 'Disaster Recovery',
    title: 'Banking App: Multi-Region Active-Active DR with Chaos Testing',
    subtitle: 'RTO < 5 min, RPO < 30 sec — and proving it through regular chaos exercises',
    objective: 'Design and implement an active-active multi-region DR architecture for a core banking application with near-zero RPO and RTO. Validate the design continuously using automated chaos engineering experiments — not just annual manual DR drills.',
    steps: [
      { title: 'Active-Active Architecture', text: 'Application deployed identically in <strong>us-east-1 and eu-west-1</strong>. <strong>Route 53 Latency Routing</strong> + health checks send users to the nearest healthy region. Either region can handle 100% of traffic.' },
      { title: 'Global Database', text: '<strong>Amazon Aurora Global Database</strong> replicates writes from primary to secondary region with < 1 second lag. In a regional failure, secondary is promoted to writable in ~60 seconds.' },
      { title: 'Stateless by Design', text: 'All application sessions stored in <strong>ElastiCache (Redis Global Datastore)</strong> — replicated cross-region. S3 assets use <strong>S3 Cross-Region Replication</strong> with versioning.' },
      { title: 'Automated Failover', text: '<strong>Route 53 health checks</strong> detect regional failure in 10 seconds. <strong>EventBridge</strong> triggers a Lambda runbook that promotes the Aurora secondary and updates DNS weights automatically.' },
      { title: 'Chaos Engineering', text: '<strong>AWS Fault Injection Simulator (FIS)</strong> experiments run monthly: terminate random ECS tasks, inject RDS latency, simulate AZ failure. Experiments are code (CDK) and run in prod during low-traffic windows.' },
      { title: 'Runbook Validation', text: 'Each FIS experiment automatically measures actual RTO and RPO and publishes results to a DR Health dashboard in <strong>CloudWatch</strong>. SLA breach auto-creates a Jira ticket for remediation.' },
    ],
    aws: ['Route 53', 'Aurora Global Database', 'ElastiCache Global Datastore', 'S3 CRR', 'ECS (multi-region)', 'FIS', 'EventBridge', 'Lambda', 'CloudWatch'],
    outcomes: [
      'Measured RTO: 3 min 42 sec (target < 5 min) — validated by FIS monthly',
      'Measured RPO: 18 seconds average across 12 months of chaos experiments',
      'Replaced annual manual DR drill with fully automated monthly validation',
      'Zero unplanned outages in 18 months — two regional events handled transparently',
    ]
  },
  {
    id: 12, category: 'mod', catLabel: 'Legacy Modernization',
    title: 'Government Agency: Strangling a 20-Year-Old Java Monolith',
    subtitle: 'Incrementally migrating a monolith to microservices using the Strangler Fig pattern',
    objective: 'Modernize a 20-year-old Java EE monolith (running on on-prem WebSphere) without a risky big-bang rewrite. Use the Strangler Fig pattern to extract services one-by-one over 18 months, run monolith and new services in parallel, and retire the monolith only when all functionality is migrated.',
    steps: [
      { title: 'Strangler Proxy', text: '<strong>Amazon API Gateway</strong> acts as the strangler proxy — all traffic enters here. Initially it forwards 100% to the monolith on EC2. New microservices are added as alternative routes over time.' },
      { title: 'First Extract: Auth', text: 'Authentication extracted first (highest leverage, clearest boundary). New auth service built as <strong>Lambda + Cognito</strong>. API Gateway routes /auth/* to new service. Monolith accepts JWT tokens from new service.' },
      { title: 'Database Decoupling', text: 'Each extracted service gets its own <strong>Amazon Aurora</strong> database. <strong>AWS DMS</strong> syncs the relevant tables from the legacy Oracle DB to the new service DB during the transition period.' },
      { title: 'Event-Driven Integration', text: 'As services are extracted, <strong>Amazon EventBridge</strong> carries domain events between the monolith and new services. Monolith publishes via SQS bridge; new services consume natively.' },
      { title: 'Traffic Migration', text: 'Each new service is rolled out with weighted API Gateway routes: 5% → 25% → 100%. Feature flags via <strong>AWS AppConfig</strong> allow instant rollback to the monolith path without redeployment.' },
      { title: 'Monolith Retirement', text: 'After 18 months and 14 extracted services: 0% of traffic routes to monolith. WebSphere server decommissioned. Legacy Oracle DB migrated to <strong>Aurora PostgreSQL</strong> via DMS. Job done.' },
    ],
    aws: ['API Gateway', 'Lambda', 'Cognito', 'Aurora', 'DMS', 'EventBridge', 'SQS', 'AppConfig', 'EC2', 'CloudWatch'],
    outcomes: [
      'Zero big-bang risk — monolith and microservices ran in parallel for 18 months',
      'Each extracted service independently deployable, scalable, and testable',
      'WebSphere licensing cost eliminated — saving $120K/year',
      'Deployment frequency went from quarterly to daily by month 12',
    ]
  },
]

export const EXPERIENCE = {
  title: 'Lead Front-End Developer',
  company: 'Maxlence Digital (OPC) Pvt. Ltd.',
  location: 'Gurgaon',
  period: 'Apr 2022 – Nov 2024',
  points: [
    'Built and maintained a modular React component library improving reusability across 30+ projects.',
    'Developed high-performance responsive web apps with React.js and Next.js.',
    'Optimised performance via lazy loading, code splitting, and bundle optimisation — reducing load time by ~30%.',
    'Enforced code quality through structured reviews, documentation, and team feedback loops.',
    'Collaborated with UI/UX and product teams to ship user-centric interfaces.',
  ],
}

export const CONTACT = [
  { icon: '✉',  label: 'Email',     val: 'sunny.charkhwal@gmail.com',     href: 'mailto:sunny.charkhwal@gmail.com' },
  { icon: 'in', label: 'LinkedIn',  val: 'linkedin.com/in/sunnycharkhwal', href: 'https://www.linkedin.com/in/sunnycharkhwal' },
  { icon: '☎',  label: 'Phone',     val: '+91 9013030173',                 href: 'tel:+919013030173' },
  { icon: '⬡',  label: 'Portfolio', val: 'sunnycharkhwal.in',              href: 'https://www.sunnycharkhwal.in' },
]

export const TERMINAL_LINES = [
  { type: 'prompt', cmd: 'kubectl get nodes' },
  { type: 'out',    text: 'NAME        STATUS   ROLES    AGE' },
  { type: 'out',    text: 'node-01     ', hi: 'Ready', rest: '    master   14d' },
  { type: 'out',    text: 'node-02     ', hi: 'Ready', rest: '    worker   14d' },
  { type: 'out',    text: 'node-03     ', hi: 'Ready', rest: '    worker   14d' },
  { type: 'blank' },
  { type: 'prompt', cmd: 'terraform apply --auto-approve' },
  { type: 'out',    text: 'Plan: ', hi: '5 to add', rest: ', 0 to change, 0 to destroy' },
  { type: 'out',    text: '',       hi: 'Apply complete!', rest: ' Resources: 5 added.' },
  { type: 'blank' },
  { type: 'prompt', cmd: 'argocd app sync wanderlust' },
  { type: 'out',    text: '', hi: 'SYNCED', rest: '  Healthy  wanderlust' },
  { type: 'blank' },
  { type: 'cursor' },
]
