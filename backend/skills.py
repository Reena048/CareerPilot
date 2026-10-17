"""
CareerPilot - Local Skill Dictionary and Recommendation Catalog
Provides extensible skill definitions, regex matching patterns, categories,
and deterministic improvement recommendations.
"""

from typing import Dict, List, Optional, Any
import re

# Deterministic recommendations catalog for skill gaps
SKILL_RECOMMENDATIONS: Dict[str, Dict[str, str]] = {
    # Programming
    "Python": {
        "topic": "Python Core & Advanced Concepts",
        "task": "Build an asynchronous CLI utility or web scraper using modern Python features (type hints, dataclasses, context managers).",
        "rationale": "Python is essential for modern backend development, data analysis, and automation."
    },
    "Java": {
        "topic": "Modern Java & Spring Boot Fundamentals",
        "task": "Develop a multi-tiered REST service demonstrating OOP principles, Streams API, and concurrency.",
        "rationale": "Java is heavily utilized in enterprise systems and scalable backend architectures."
    },
    "C": {
        "topic": "Low-Level Programming & Memory Management in C",
        "task": "Implement custom data structures (linked list, hash table) with dynamic memory allocation and pointer arithmetic.",
        "rationale": "C demonstrates fundamental understanding of memory management, systems architecture, and runtime performance."
    },
    "C++": {
        "topic": "Modern C++ (C++17/20) & Resource Management (RAII)",
        "task": "Implement a high-performance cache or algorithm suite using smart pointers, templates, and the STL.",
        "rationale": "C++ is widely used for systems programming, high-frequency engines, and performance-critical services."
    },
    "JavaScript": {
        "topic": "Modern JavaScript (ES6+) & Asynchronous Event Loop",
        "task": "Build an interactive web app manipulating DOM events, Promises, async/await, and Fetch API without external libraries.",
        "rationale": "JavaScript is the core language of the modern web and full-stack software development."
    },
    "TypeScript": {
        "topic": "TypeScript Type System & Static Typing",
        "task": "Convert an existing JavaScript module to TypeScript using generics, utility types, and strict mode.",
        "rationale": "TypeScript improves code reliability, maintainability, and developer velocity in production codebases."
    },
    "SQL": {
        "topic": "Relational Querying & Optimization",
        "task": "Practice complex multi-table JOINs, subqueries, GROUP BY aggregations, window functions, and indexing strategies.",
        "rationale": "SQL is universally required to extract, filter, and transform data stored in relational databases."
    },

    # Frontend
    "HTML": {
        "topic": "Semantic HTML5 & Accessibility (WCAG / a11y)",
        "task": "Construct a fully accessible landing page with semantic tags, ARIA attributes, and keyboard navigation.",
        "rationale": "Semantic HTML ensures high accessibility, SEO performance, and responsive web foundations."
    },
    "CSS": {
        "topic": "Modern CSS (Flexbox, Grid, Custom Properties, Animations)",
        "task": "Build a responsive multi-column layout with smooth transition states without relying on UI frameworks.",
        "rationale": "Strong CSS fundamentals allow creating bespoke, highly responsive user experiences."
    },
    "React": {
        "topic": "Component Architecture & State Management in React",
        "task": "Build a reusable component-based interface utilizing custom hooks, Context API, and state lifting.",
        "rationale": "React is one of the most widely adopted frontend component libraries across industry applications."
    },
    "Angular": {
        "topic": "Angular Architecture (TypeScript, Services, RxJS)",
        "task": "Build a multi-page dashboard with reactive forms, dependency injection, and RxJS observable pipelines.",
        "rationale": "Angular is a complete enterprise framework that enforces structured, scalable code organization."
    },
    "Vue": {
        "topic": "Vue 3 Composition API & State Management",
        "task": "Create a responsive single-page application with Pinia store, reactive computed properties, and scoped styling.",
        "rationale": "Vue provides a progressive, developer-friendly ecosystem for building reactive interfaces."
    },
    "Bootstrap": {
        "topic": "Bootstrap Grid System & UI Utilities",
        "task": "Assemble a responsive administration dashboard layout utilizing standard Bootstrap grid, cards, and modals.",
        "rationale": "Bootstrap enables rapid prototyping and consistent responsive layout structures."
    },
    "Tailwind CSS": {
        "topic": "Utility-First CSS with Tailwind",
        "task": "Recreate a modern SaaS landing page using utility classes, responsive variants, and custom theme tokens.",
        "rationale": "Tailwind accelerates UI development with clean, purgeable utility classes directly in markup."
    },

    # Backend
    "Node.js": {
        "topic": "Node.js Runtime & Non-blocking I/O",
        "task": "Create an event-driven HTTP server processing file streams and background event emitters.",
        "rationale": "Node.js powers fast, lightweight backend services handling heavy concurrent I/O operations."
    },
    "Express.js": {
        "topic": "Express Middleware & REST API Architecture",
        "task": "Build a REST API with routing modularity, centralized error-handling middleware, and JWT authentication.",
        "rationale": "Express is the standard minimal web framework for building Node.js HTTP web services."
    },
    "FastAPI": {
        "topic": "Asynchronous Web APIs with FastAPI & Pydantic",
        "task": "Develop a high-performance REST API with automated OpenAPI docs, dependency injection, and Pydantic validation.",
        "rationale": "FastAPI is a leading Python framework for blazing fast asynchronous microservices and API backends."
    },
    "Django": {
        "topic": "Django MVT Architecture & ORM Security",
        "task": "Build a data-driven web portal with Django ORM migrations, admin panel customization, and user auth.",
        "rationale": "Django offers a 'batteries-included' full-featured framework for rapid backend application development."
    },
    "Flask": {
        "topic": "Lightweight Microservices with Flask",
        "task": "Design a lightweight service utilizing Blueprints, application factory pattern, and SQLAlchemy ORM.",
        "rationale": "Flask provides complete flexibility and simplicity for microservices and API wrappers."
    },
    "REST API": {
        "topic": "RESTful API Design & HTTP Status Protocols",
        "task": "Design and document a complete CRUD API adhering to idempotent verbs, HTTP status codes, and JSON schemas.",
        "rationale": "REST API conventions are the cornerstone of client-server distributed system communication."
    },

    # Databases
    "MySQL": {
        "topic": "Relational Data Modeling in MySQL",
        "task": "Set up a relational schema with foreign keys, indexes, and write transactions with ACID guarantees.",
        "rationale": "MySQL is the most widely deployed open-source relational database management system."
    },
    "PostgreSQL": {
        "topic": "Advanced PostgreSQL & Query Optimization",
        "task": "Execute advanced SQL queries using JSONB indexing, CTEs (WITH clauses), and analyze EXPLAIN query plans.",
        "rationale": "PostgreSQL is renowned for standards compliance, transactional integrity, and advanced data types."
    },
    "MongoDB": {
        "topic": "NoSQL Document Modeling with MongoDB",
        "task": "Design a document schema with aggregation pipelines ($match, $group, $lookup) and compound indexing.",
        "rationale": "MongoDB is a leading document database suited for flexible schemas and unstructured payloads."
    },
    "SQLite": {
        "topic": "Embedded Database Storage with SQLite",
        "task": "Integrate an embedded SQLite database with schema migrations in a local desktop or lightweight web app.",
        "rationale": "SQLite is ideal for edge computing, local persistence, mobile applications, and testing environments."
    },

    # Tools
    "Git": {
        "topic": "Distributed Version Control with Git",
        "task": "Practice branching strategies, rebasing, resolving merge conflicts, interactive rebasing, and cherry-picking.",
        "rationale": "Git is an indispensable requirement for professional software engineering collaboration."
    },
    "GitHub": {
        "topic": "Collaborative Development & GitHub Actions CI/CD",
        "task": "Configure a GitHub repository with pull request templates, branch protection rules, and automated test workflows.",
        "rationale": "GitHub is the primary platform for code hosting, peer reviews, issue tracking, and automation pipelines."
    },
    "Docker": {
        "topic": "Containerization Fundamentals with Docker",
        "task": "Write a multi-stage Dockerfile for a web app and run a multi-service stack with Docker Compose.",
        "rationale": "Docker ensures consistent runtime environments across development, testing, and production stages."
    },
    "Linux": {
        "topic": "Linux Command Line & Shell Scripting",
        "task": "Navigate system directories, manage permissions (chmod/chown), monitor processes, and write a Bash backup script.",
        "rationale": "Most production servers and cloud infrastructure run on Linux operating systems."
    },
    "VS Code": {
        "topic": "Developer Productivity in Visual Studio Code",
        "task": "Configure launch.json for interactive step-debugging, linting extensions (ESLint/Black), and keyboard shortcuts.",
        "rationale": "VS Code is the industry-standard extensible code editor for modern cross-platform development."
    },

    # Computer Science
    "Data Structures": {
        "topic": "Fundamental & Advanced Data Structures",
        "task": "Implement and benchmark stacks, queues, hash tables, binary search trees, and heaps in code.",
        "rationale": "Data structures are fundamental for writing memory-efficient, performant software solutions."
    },
    "Algorithms": {
        "topic": "Algorithm Analysis & Problem Solving",
        "task": "Solve common algorithmic problems focusing on Time and Space Complexity (Big-O), recursion, and dynamic programming.",
        "rationale": "Algorithmic thinking allows solving complex computational challenges with optimal scaling."
    },
    "OOP": {
        "topic": "Object-Oriented Programming & SOLID Principles",
        "task": "Refactor a monolithic program into distinct classes applying Encapsulation, Inheritance, Polymorphism, and SOLID.",
        "rationale": "OOP enables building modular, extensible, and easily maintainable large-scale software systems."
    },
    "DBMS": {
        "topic": "Database Management Systems Architecture",
        "task": "Study database normalization (1NF through BCNF), indexing B-trees, concurrency control, and transaction isolation levels.",
        "rationale": "Understanding DBMS internals ensures high data integrity and robust database performance under load."
    },
    "Operating Systems": {
        "topic": "Operating Systems Principles",
        "task": "Study process scheduling, multithreading, inter-process communication, memory paging, and deadlock handling.",
        "rationale": "OS concepts demystify hardware-software interaction, concurrency issues, and system bottlenecks."
    },
    "Computer Networks": {
        "topic": "Computer Networking & Web Protocols",
        "task": "Inspect HTTP/HTTPS request headers, TCP three-way handshakes, DNS resolution, and WebSocket handshakes using Wireshark or curl.",
        "rationale": "Network awareness is critical for debugging latency, packet transmission, and secure API integration."
    },
    "Software Engineering": {
        "topic": "Software Engineering Methodologies & Lifecycle",
        "task": "Apply Agile principles, write unit and integration test suites, and draft technical architecture diagrams.",
        "rationale": "Software engineering principles ensure reliable, scalable, and team-sustainable project delivery."
    },

    # Data and AI
    "NumPy": {
        "topic": "Vectorized Computing with NumPy",
        "task": "Perform array slicing, matrix multiplications, broadcasting, and numerical computations on high-dimensional arrays.",
        "rationale": "NumPy forms the core numerical computing foundation for Python data science and machine learning."
    },
    "Pandas": {
        "topic": "Data Wrangling & Analysis with Pandas",
        "task": "Clean a messy real-world dataset, handle missing values, perform groupby transformations, and export pivot summaries.",
        "rationale": "Pandas is the leading Python tool for data ingestion, cleaning, transformation, and exploratory analysis."
    },
    "Matplotlib": {
        "topic": "Data Visualization with Matplotlib & Seaborn",
        "task": "Create publication-quality charts (histograms, scatter plots, subplots) with custom legends, themes, and annotations.",
        "rationale": "Clear visualization skills allow communicating analytical findings and metric trends effectively."
    },
    "Machine Learning": {
        "topic": "Applied Machine Learning Workflows",
        "task": "Build, evaluate, and tune a predictive classification/regression model using Scikit-Learn with cross-validation.",
        "rationale": "Machine learning enables automated pattern recognition and predictive decision systems."
    },
    "Deep Learning": {
        "topic": "Neural Network Fundamentals & Architectures",
        "task": "Train a multi-layer perceptron or convolutional network on an image/text dataset using PyTorch or TensorFlow.",
        "rationale": "Deep learning drives modern perception models, vision processing, and generative AI systems."
    },
    "Natural Language Processing": {
        "topic": "Natural Language Processing (NLP) & Text Pipelines",
        "task": "Build a text classification or sentiment analysis pipeline with tokenization, TF-IDF / embeddings, and evaluation.",
        "rationale": "NLP enables software to parse, understand, and extract structured insight from unstructured human text."
    },

    # Additional Extensible Skills
    "AWS": {
        "topic": "Amazon Web Services Cloud Fundamentals",
        "task": "Deploy a containerized application to AWS ECS or Elastic Beanstalk using S3 storage and IAM policies.",
        "rationale": "AWS is the leading public cloud platform for enterprise hosting and infrastructure."
    },
    "Docker & Containerization": {
        "topic": "Container Orchestration & Microservices",
        "task": "Deploy an interconnected multi-container stack with network isolation and persistent storage volumes.",
        "rationale": "Container skills are essential for cloud-native deployment standards."
    },
    "Redis": {
        "topic": "In-Memory Caching & Pub/Sub with Redis",
        "task": "Implement session caching, rate limiting, and quick key-value lookups with Redis in front of a primary database.",
        "rationale": "Redis drastically improves backend response times and throughput for frequently accessed data."
    },
    "GraphQL": {
        "topic": "Declarative API Querying with GraphQL",
        "task": "Build a GraphQL schema with resolvers, mutations, and query depth validation.",
        "rationale": "GraphQL eliminates over-fetching and under-fetching by letting clients request precise data graphs."
    },
    "CI/CD": {
        "topic": "Continuous Integration & Deployment Pipelines",
        "task": "Create an automated pipeline that runs unit tests, lints code, and deploys artifacts upon git push.",
        "rationale": "Automated CI/CD pipelines minimize deployment friction and catch regressions before production."
    }
}

# Skill Definition Model
class SkillDefinition:
    def __init__(
        self,
        name: str,
        category: str,
        patterns: List[str],
        case_sensitive: bool = False,
        priority: int = 0
    ):
        self.name = name
        self.category = category
        self.patterns = patterns
        self.case_sensitive = case_sensitive
        self.priority = priority  # Higher priority matched first when resolving overlaps

# Complete Master Skill Dictionary
SKILL_DICTIONARY: List[SkillDefinition] = [
    # ------------------ Programming Languages ------------------
    SkillDefinition(
        name="Python",
        category="Programming",
        patterns=[r"\bpython\s*(?:3(?:\.\d+)?)?\b", r"\bpy3\b"]
    ),
    SkillDefinition(
        name="Java",
        category="Programming",
        patterns=[r"\bjava\b(?!\s*script)"]
    ),
    SkillDefinition(
        name="C++",
        category="Programming",
        patterns=[r"\bc\+\+(?![a-zA-Z0-9+])", r"\bcpp\b"],
        priority=10
    ),
    SkillDefinition(
        name="C",
        category="Programming",
        # Explicit pattern for C: capital C with word boundaries, not followed by ++ or #
        patterns=[r"\bC\b(?!\s*(?:\+\+|#))", r"\b[Cc][- ]programming\b", r"\b[Cc]\s+language\b"],
        case_sensitive=True,
        priority=0
    ),
    SkillDefinition(
        name="JavaScript",
        category="Programming",
        patterns=[r"\bjavascript\b", r"\bjs\b", r"\bes[56789]\b", r"\becmascript\b"],
        priority=5
    ),
    SkillDefinition(
        name="TypeScript",
        category="Programming",
        patterns=[r"\btypescript\b", r"\bts\b"],
        priority=5
    ),
    SkillDefinition(
        name="SQL",
        category="Programming",
        patterns=[r"\bsql\b(?!\s*server)", r"\bstructured\s+query\s+language\b", r"\bt-sql\b", r"\bpl/sql\b"]
    ),

    # ------------------ Frontend ------------------
    SkillDefinition(
        name="HTML",
        category="Frontend",
        patterns=[r"\bhtml(?:5)?\b"]
    ),
    SkillDefinition(
        name="CSS",
        category="Frontend",
        patterns=[r"\bcss(?:3)?\b"]
    ),
    SkillDefinition(
        name="React",
        category="Frontend",
        patterns=[r"\breact(?:\.js|js)?\b", r"\breact\s+native\b"]
    ),
    SkillDefinition(
        name="Angular",
        category="Frontend",
        patterns=[r"\bangular(?:\.js|js)?\b", r"\bangular\s*[2-9]?\b"]
    ),
    SkillDefinition(
        name="Vue",
        category="Frontend",
        patterns=[r"\bvue(?:\.js|js)?\b", r"\bvue\s*[23]\b"]
    ),
    SkillDefinition(
        name="Bootstrap",
        category="Frontend",
        patterns=[r"\bbootstrap(?:\s*[345])?\b"]
    ),
    SkillDefinition(
        name="Tailwind CSS",
        category="Frontend",
        patterns=[r"\btailwind(?:\s*css)?\b"]
    ),

    # ------------------ Backend ------------------
    SkillDefinition(
        name="Node.js",
        category="Backend",
        patterns=[r"\bnode(?:\.?js)?\b", r"\bnodejs\b"]
    ),
    SkillDefinition(
        name="Express.js",
        category="Backend",
        patterns=[r"\bexpress(?:\.?js)?\b", r"\bexpressjs\b"]
    ),
    SkillDefinition(
        name="FastAPI",
        category="Backend",
        patterns=[r"\bfastapi\b"]
    ),
    SkillDefinition(
        name="Django",
        category="Backend",
        patterns=[r"\bdjango\b"]
    ),
    SkillDefinition(
        name="Flask",
        category="Backend",
        patterns=[r"\bflask\b"]
    ),
    SkillDefinition(
        name="REST API",
        category="Backend",
        patterns=[r"\brest\s*api[s]?\b", r"\brestful(?:\s*api[s]?)?\b", r"\brest\b(?!\s*in\s*peace)"]
    ),

    # ------------------ Databases ------------------
    SkillDefinition(
        name="MySQL",
        category="Databases",
        patterns=[r"\bmysql\b"]
    ),
    SkillDefinition(
        name="PostgreSQL",
        category="Databases",
        patterns=[r"\bpostgres(?:ql)?\b", r"\bpsql\b"]
    ),
    SkillDefinition(
        name="MongoDB",
        category="Databases",
        patterns=[r"\bmongo(?:db)?\b"]
    ),
    SkillDefinition(
        name="SQLite",
        category="Databases",
        patterns=[r"\bsqlite(?:3)?\b"]
    ),

    # ------------------ Tools ------------------
    SkillDefinition(
        name="Git",
        category="Tools",
        patterns=[r"\bgit\b(?!\s*(?:hub|lab))"]
    ),
    SkillDefinition(
        name="GitHub",
        category="Tools",
        patterns=[r"\bgithub\b"]
    ),
    SkillDefinition(
        name="Docker",
        category="Tools",
        patterns=[r"\bdocker\b", r"\bcontainerization\b"]
    ),
    SkillDefinition(
        name="Linux",
        category="Tools",
        patterns=[r"\blinux\b", r"\bubuntu\b", r"\bdebian\b", r"\bcentos\b"]
    ),
    SkillDefinition(
        name="VS Code",
        category="Tools",
        patterns=[r"\bvs\s*code\b", r"\bvisual\s*studio\s*code\b"]
    ),

    # ------------------ Computer Science ------------------
    SkillDefinition(
        name="Data Structures",
        category="Computer Science",
        patterns=[r"\bdata\s*structures?\b", r"\bdsa\b"]
    ),
    SkillDefinition(
        name="Algorithms",
        category="Computer Science",
        patterns=[r"\balgorithms?\b"]
    ),
    SkillDefinition(
        name="OOP",
        category="Computer Science",
        patterns=[r"\boop\b", r"\bobject[\s\-]oriented(?:\s+programming)?\b"]
    ),
    SkillDefinition(
        name="DBMS",
        category="Computer Science",
        patterns=[r"\bdbms\b", r"\bdatabase\s*management(?:\s*systems?)?\b", r"\brdbms\b"]
    ),
    SkillDefinition(
        name="Operating Systems",
        category="Computer Science",
        patterns=[r"\boperating\s*systems?\b", r"\bos\s+concepts?\b", r"\bos\s+principles?\b", r"\bOS\b"]
    ),
    SkillDefinition(
        name="Computer Networks",
        category="Computer Science",
        patterns=[r"\bcomputer\s*networks?\b", r"\bnetworking\b", r"\btcp/ip\b"]
    ),
    SkillDefinition(
        name="Software Engineering",
        category="Computer Science",
        patterns=[r"\bsoftware\s*engineering\b", r"\bswe\b", r"\bsdlc\b"]
    ),

    # ------------------ Data and AI ------------------
    SkillDefinition(
        name="NumPy",
        category="Data and AI",
        patterns=[r"\bnumpy\b"]
    ),
    SkillDefinition(
        name="Pandas",
        category="Data and AI",
        patterns=[r"\bpandas\b"]
    ),
    SkillDefinition(
        name="Matplotlib",
        category="Data and AI",
        patterns=[r"\bmatplotlib\b", r"\bseaborn\b"]
    ),
    SkillDefinition(
        name="Machine Learning",
        category="Data and AI",
        patterns=[r"\bmachine\s*learning\b", r"\bml\b(?!\s*engineer)"]
    ),
    SkillDefinition(
        name="Deep Learning",
        category="Data and AI",
        patterns=[r"\bdeep\s*learning\b", r"\bdl\b"]
    ),
    SkillDefinition(
        name="Natural Language Processing",
        category="Data and AI",
        patterns=[r"\bnatural\s*language\s*processing\b", r"\bnlp\b"]
    ),

    # ------------------ Additional Extended Skills ------------------
    SkillDefinition(
        name="AWS",
        category="Tools",
        patterns=[r"\baws\b", r"\bamazon\s*web\s*services\b"]
    ),
    SkillDefinition(
        name="Redis",
        category="Databases",
        patterns=[r"\bredis\b"]
    ),
    SkillDefinition(
        name="GraphQL",
        category="Backend",
        patterns=[r"\bgraphql\b"]
    ),
    SkillDefinition(
        name="CI/CD",
        category="Tools",
        patterns=[r"\bci/cd\b", r"\bcontinuous\s*integration\b"]
    )
]

# Role-specific supplementary focus skills (Used for extra recommendations, not to fabricate missing job requirements)
TARGET_ROLES_FOCUS = {
    "Frontend Developer": ["React", "JavaScript", "TypeScript", "HTML", "CSS", "Tailwind CSS", "Git"],
    "Backend Developer": ["Python", "Node.js", "FastAPI", "SQL", "PostgreSQL", "Docker", "REST API", "Git"],
    "Full-Stack Developer": ["React", "Node.js", "JavaScript", "TypeScript", "SQL", "REST API", "Docker", "Git"],
    "Python Developer": ["Python", "FastAPI", "Django", "SQL", "Git", "Docker", "Algorithms"],
    "Software Development Intern": ["Data Structures", "Algorithms", "OOP", "Git", "Python", "SQL", "Software Engineering"],
    "Data Analyst": ["Python", "SQL", "Pandas", "NumPy", "Matplotlib", "DBMS", "Git"]
}
