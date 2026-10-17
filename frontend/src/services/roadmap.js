/**
 * CareerPilot - Personalized Skill Roadmap Service
 * Provides predefined structured learning paths, ordered topics, hands-on practice projects,
 * estimated time frames, and browser LocalStorage progress synchronization.
 */

const ROADMAP_PROGRESS_KEY = 'careerpilot_roadmap_progress_v1';

export const ROADMAP_CATALOG = {
  // ------------------ Programming Languages ------------------
  'React': {
    relevance: 'React is the most requested frontend library for modern web applications and internships, enabling component reuse and reactive state.',
    topics: [
      'Components and JSX syntax',
      'Props, state, and event handling',
      'Hooks (useState, useEffect, useMemo, custom hooks)',
      'API integration and asynchronous data fetching',
      'Routing with React Router and reusable component architecture'
    ],
    project: 'Build a responsive weather dashboard consuming a public weather API with dynamic cards and search.',
    estimatedTime: '7–10 days'
  },
  'JavaScript': {
    relevance: 'JavaScript is the indispensable foundation of web development, essential for frontend interactivity and backend Node.js services.',
    topics: [
      'Modern ES6+ syntax (destructuring, arrow functions, template literals)',
      'DOM manipulation, selectors, and event bubbling',
      'Asynchronous JavaScript (Promises, async/await, Event Loop)',
      'Fetch API and handling JSON payloads',
      'Modular code organization and ES modules'
    ],
    project: 'Build an interactive Kanban task board with drag-and-drop or column movement and local persistence.',
    estimatedTime: '8–12 days'
  },
  'TypeScript': {
    relevance: 'TypeScript adds static type safety to JavaScript, significantly reducing runtime bugs in commercial codebases.',
    topics: [
      'Basic types, type inference, and interfaces',
      'Union types, intersection types, and type aliases',
      'Generics and generic constraints',
      'Utility types (Partial, Pick, Omit, Record)',
      'Configuring tsconfig.json and integrating with React or Node.js'
    ],
    project: 'Refactor a JavaScript utility or build a strictly-typed shopping cart module with automated unit tests.',
    estimatedTime: '5–8 days'
  },
  'Python': {
    relevance: 'Python is a core language for backend engineering, automation scripts, data science, and AI pipelines.',
    topics: [
      'Core syntax, list comprehensions, and data structures (lists, dicts, sets)',
      'Functions, arguments (*args, **kwargs), and lambda expressions',
      'Object-Oriented Programming (classes, inheritance, magic methods)',
      'Virtual environments, pip package management, and modules',
      'Working with files, JSON, context managers (with statement), and error handling'
    ],
    project: 'Build a CLI expense tracker that saves records to a local JSON file and calculates spending summaries.',
    estimatedTime: '7–10 days'
  },
  'Java': {
    relevance: 'Java powers enterprise architectures, scalable banking systems, and Android software worldwide.',
    topics: [
      'Java syntax, primitive types, and control flow',
      'OOP principles: Encapsulation, Inheritance, Polymorphism, Abstraction',
      'Java Collections Framework (ArrayList, HashMap, HashSet)',
      'Exception handling, Streams API, and Lambdas',
      'Basic Maven/Gradle build configuration and unit testing with JUnit'
    ],
    project: 'Build a console-based student grade management system utilizing OOP classes and Collections.',
    estimatedTime: '10–14 days'
  },
  'C++': {
    relevance: 'C++ is vital for performance-critical systems, gaming engines, operating system modules, and competitive programming.',
    topics: [
      'Pointers, references, and memory layout',
      'Object-Oriented C++ (constructors, destructors, operator overloading)',
      'Resource Acquisition Is Initialization (RAII) and Smart Pointers (unique_ptr, shared_ptr)',
      'Standard Template Library (STL): vectors, maps, algorithms',
      'Templates and basic generic programming'
    ],
    project: 'Implement an in-memory key-value cache with LRU (Least Recently Used) eviction policy using C++ STL.',
    estimatedTime: '10–15 days'
  },
  'C': {
    relevance: 'C teaches foundational computer architecture, manual memory management, and low-level hardware interaction.',
    topics: [
      'Data types, operators, and control structures',
      'Pointers and pointer arithmetic',
      'Dynamic memory allocation (malloc, calloc, realloc, free)',
      'Structs, unions, and file I/O operations',
      'Compiling with GCC and debugging with GDB'
    ],
    project: 'Implement a custom doubly-linked list with dynamic node insertion, deletion, and memory leak checks.',
    estimatedTime: '10–14 days'
  },
  'SQL': {
    relevance: 'SQL is the universal language for querying, updating, and modeling relational databases across every tech stack.',
    topics: [
      'SELECT, WHERE filtering, ORDER BY, and LIMIT',
      'Aggregate functions (COUNT, SUM, AVG) and GROUP BY / HAVING',
      'Table joins (INNER JOIN, LEFT JOIN, FULL OUTER JOIN)',
      'Subqueries, Common Table Expressions (WITH clauses), and views',
      'Database schema constraints (PRIMARY KEY, FOREIGN KEY) and Indexing'
    ],
    project: 'Design an e-commerce database schema and write 10 complex queries analyzing customer spending and top products.',
    estimatedTime: '5–7 days'
  },

  // ------------------ Frontend ------------------
  'HTML': {
    relevance: 'Semantic HTML is the backbone of web accessibility, search engine indexing, and page structure.',
    topics: [
      'Semantic tags (header, nav, main, article, section, footer)',
      'Forms, inputs, validation attributes, and labels',
      'Media elements (img, picture, video, audio)',
      'Web accessibility (ARIA landmarks, alt attributes, tab navigation)',
      'Meta tags and OpenGraph configurations'
    ],
    project: 'Create an accessible, semantic portfolio landing page adhering to WCAG standards.',
    estimatedTime: '3–5 days'
  },
  'CSS': {
    relevance: 'Modern CSS creates intuitive, visually engaging, responsive layouts across devices and screen resolutions.',
    topics: [
      'CSS Box Model (margin, border, padding, content)',
      'Flexbox for 1-dimensional responsive layouts',
      'CSS Grid for 2-dimensional page templates',
      'Responsive design with media queries and clamp()',
      'CSS variables (custom properties) and smooth micro-transitions'
    ],
    project: 'Build a multi-card responsive product showcase layout without external UI libraries.',
    estimatedTime: '5–7 days'
  },
  'Tailwind CSS': {
    relevance: 'Tailwind CSS is an industry-standard utility-first CSS framework for rapid, consistent UI prototyping and production.',
    topics: [
      'Utility-first mindset vs traditional CSS classes',
      'Spacing, typography, and flex/grid utilities',
      'Responsive modifiers (sm:, md:, lg:) and hover/focus states',
      'Theme customization in tailwind.config.js',
      'Extracting reusable components with @apply or React components'
    ],
    project: 'Replicate a modern SaaS pricing table with responsive toggles using Tailwind utility classes.',
    estimatedTime: '3–5 days'
  },
  'Bootstrap': {
    relevance: 'Bootstrap accelerates administrative dashboard and responsive grid development with prebuilt UI components.',
    topics: [
      '12-column responsive grid system and breakpoints',
      'Core UI components (cards, navbar, modals, badges, dropdowns)',
      'Utility classes for spacing, borders, and colors',
      'Form controls and responsive input groups',
      'Customizing themes and Sass variables'
    ],
    project: 'Build an administrative analytics dashboard prototype with responsive charts and modal dialogs.',
    estimatedTime: '3–5 days'
  },
  'Angular': {
    relevance: 'Angular is a full-featured enterprise frontend framework featuring two-way data binding and dependency injection.',
    topics: [
      'Angular CLI, TypeScript setup, and modules',
      'Component lifecycle hooks and templates',
      'Services and Dependency Injection',
      'Reactive Forms and form validation',
      'Routing, guards, and RxJS Observables'
    ],
    project: 'Build an employee directory app with search, filtering, and detail navigation using Angular services.',
    estimatedTime: '10–14 days'
  },
  'Vue': {
    relevance: 'Vue is a progressive, developer-friendly framework favored for high performance and approachable syntax.',
    topics: [
      'Vue 3 Composition API and <script setup>',
      'Reactive state with ref() and reactive()',
      'Computed properties, watchers, and v-model bindings',
      'Component props, emits, and slots',
      'State management using Pinia and Vue Router'
    ],
    project: 'Build a personal habit tracker single-page app with reactive progress bars using Vue 3.',
    estimatedTime: '7–10 days'
  },

  // ------------------ Backend ------------------
  'Node.js': {
    relevance: 'Node.js enables building fast, scalable network applications and asynchronous REST servers using JavaScript.',
    topics: [
      'Node.js runtime, V8 engine, and event-driven architecture',
      'Built-in modules (fs, path, http, events)',
      'NPM package management and package.json scripts',
      'Streams, Buffers, and non-blocking I/O handling',
      'Debugging and environment variables with dotenv'
    ],
    project: 'Build a file organizer CLI utility that sorts local files into categorized subfolders by extension.',
    estimatedTime: '6–8 days'
  },
  'Express.js': {
    relevance: 'Express.js is the minimalist, flexible standard web framework for Node.js REST API servers.',
    topics: [
      'Express app setup, routing, and HTTP methods',
      'Middleware architecture (custom, logging, and error-handling)',
      'Request handling (req.params, req.query, req.body)',
      'Input validation and sanitization',
      'JWT (JSON Web Token) authentication flow'
    ],
    project: 'Build a secure RESTful bookmarks API with user login, JWT tokens, and CRUD operations.',
    estimatedTime: '6–9 days'
  },
  'FastAPI': {
    relevance: 'FastAPI is a leading Python web framework known for asynchronous performance, automatic OpenAPI docs, and type hints.',
    topics: [
      'Path parameters, query parameters, and request bodies',
      'Data validation and serialization using Pydantic models',
      'Dependency injection system for database sessions',
      'Asynchronous route handlers (async/await)',
      'Automated Swagger UI and ReDoc documentation'
    ],
    project: 'Develop a high-performance REST API for a local book store with search filtering and auto-generated docs.',
    estimatedTime: '5–8 days'
  },
  'Django': {
    relevance: 'Django provides a battle-tested, batteries-included Python framework for scalable data-driven web applications.',
    topics: [
      'Django MVT (Model-View-Template) pattern',
      'Django ORM models, migrations, and relationships',
      'Built-in Admin dashboard configuration',
      'Django Forms and authentication views',
      'Django REST Framework (DRF) basics for serializers'
    ],
    project: 'Build a multi-user blog application with user registration, draft states, and admin controls.',
    estimatedTime: '10–14 days'
  },
  'Flask': {
    relevance: 'Flask offers a lightweight, unopinionated Python framework ideal for microservices and flexible prototypes.',
    topics: [
      'Flask routing and view functions',
      'Jinja2 templating and static files',
      'Request context and response objects',
      'Application factory pattern and Blueprints',
      'Database integration with Flask-SQLAlchemy'
    ],
    project: 'Build a lightweight URL shortener service with click analytics and SQLite storage.',
    estimatedTime: '5–7 days'
  },
  'REST API': {
    relevance: 'RESTful API principles dictate standard client-server communication across mobile, web, and cloud architectures.',
    topics: [
      'HTTP methods (GET, POST, PUT, PATCH, DELETE) and idempotency',
      'HTTP status code standards (200, 201, 400, 401, 403, 404, 500)',
      'REST resource modeling and URI naming conventions',
      'Pagination, filtering, and error response formats',
      'API documentation standards (OpenAPI / Swagger)'
    ],
    project: 'Draft an OpenAPI specification and build a working notes API adhering strictly to REST conventions.',
    estimatedTime: '4–6 days'
  },

  // ------------------ Databases ------------------
  'PostgreSQL': {
    relevance: 'PostgreSQL is the gold standard open-source relational database, known for extensibility and reliability.',
    topics: [
      'Schema design, data types, and primary/foreign keys',
      'Indexing strategies (B-tree, GIN) and EXPLAIN query analysis',
      'ACID transactions and isolation levels',
      'JSONB data types and semi-structured queries',
      'Connecting via Python (psycopg2/asyncpg) or Node (pg)'
    ],
    project: 'Set up a local PostgreSQL database with indexed tables and benchmark query performance with EXPLAIN ANALYZE.',
    estimatedTime: '6–9 days'
  },
  'MySQL': {
    relevance: 'MySQL is one of the most widely adopted relational databases in enterprise and web production stacks.',
    topics: [
      'Relational table normalization (1NF through 3NF)',
      'CRUD operations and transactional statements (START TRANSACTION, COMMIT)',
      'Stored procedures and triggers overview',
      'User permissions and grant administration',
      'Database backups with mysqldump'
    ],
    project: 'Build an inventory tracking database schema with relational tables and stock update triggers.',
    estimatedTime: '5–8 days'
  },
  'MongoDB': {
    relevance: 'MongoDB is a leading NoSQL document store favored for agile iteration and semi-structured document payloads.',
    topics: [
      'NoSQL document architecture vs relational tables',
      'BSON data types and MongoDB shell commands',
      'CRUD operations (find, insertOne, updateMany, delete)',
      'Aggregation pipeline ($match, $group, $sort, $project)',
      'Mongoose ODM for Node.js schema modeling'
    ],
    project: 'Build a customer feedback collector API backed by MongoDB with category aggregation analytics.',
    estimatedTime: '5–8 days'
  },
  'SQLite': {
    relevance: 'SQLite provides zero-configuration, serverless embedded storage ideal for mobile, desktop, and testing environments.',
    topics: [
      'SQLite file architecture and embedded nature',
      'Creating local tables and running ACID transactions',
      'Integrating SQLite with Python (sqlite3) or Node.js',
      'Database schema migration patterns',
      'PRAGMA commands and database vacuuming'
    ],
    project: 'Integrate an embedded SQLite database into a local desktop or CLI notes manager with automated backups.',
    estimatedTime: '3–5 days'
  },
  'Redis': {
    relevance: 'Redis is an ultrafast in-memory data store used for caching, session stores, rate limiting, and pub/sub queues.',
    topics: [
      'In-memory key-value concepts and TTL (Time to Live) expiration',
      'Redis data structures: Strings, Lists, Sets, Hashes, Sorted Sets',
      'Implementing cache-aside pattern in front of a relational DB',
      'Rate-limiting algorithms (Token bucket / Sliding window)',
      'Pub/Sub messaging concepts'
    ],
    project: 'Build an API route rate-limiter or cache layer that reduces database query load by 90%.',
    estimatedTime: '4–6 days'
  },

  // ------------------ Tools ------------------
  'Git': {
    relevance: 'Git is the ubiquitous version control system required for every professional software development team.',
    topics: [
      'Initializing repositories, staging, and committing (git status, diff, commit)',
      'Branching workflows, switching branches, and merging',
      'Resolving merge conflicts calmly and cleanly',
      'Git log, git stash, and resetting commits (soft vs hard)',
      'Interactive rebasing (git rebase -i) and cherry-picking'
    ],
    project: 'Create a local multi-branch Git playground, simulate a merge conflict between two branches, and resolve it.',
    estimatedTime: '4–6 days'
  },
  'GitHub': {
    relevance: 'GitHub is the center of open-source collaboration, pull request code reviews, issue tracking, and CI/CD.',
    topics: [
      'Remote repository management (git push, pull, remote add)',
      'Pull Requests (PRs), code reviews, and commenting',
      'Forking workflows and sync with upstream',
      'GitHub Issues, Project boards, and Markdown templates',
      'GitHub Actions basics for automated testing'
    ],
    project: 'Publish an open-source project repository with a professional README, PR template, and a GitHub Action test workflow.',
    estimatedTime: '3–5 days'
  },
  'Docker': {
    relevance: 'Docker containerizes applications to guarantee identical behavior across developer laptops and production servers.',
    topics: [
      'Containers vs Virtual Machines',
      'Writing efficient Dockerfiles (FROM, COPY, RUN, CMD, EXPOSE)',
      'Image layers and multi-stage builds for minimal image size',
      'Docker CLI commands (build, run, ps, logs, exec, stop)',
      'Docker Compose for multi-container services (App + Database)'
    ],
    project: 'Containerize a full-stack web app and database using a multi-service docker-compose.yml configuration.',
    estimatedTime: '6–9 days'
  },
  'Linux': {
    relevance: 'Linux powers the vast majority of cloud servers, containers, and development infrastructure.',
    topics: [
      'Filesystem hierarchy, navigation, and file inspection (ls, cd, cat, grep, find)',
      'Permissions (chmod, chown) and user management',
      'Process monitoring (ps, top, htop, kill) and systemctl services',
      'Pipes, redirects, and environment variables',
      'Writing basic Bash scripts for repetitive tasks'
    ],
    project: 'Write a Bash maintenance script that logs system resource usage and backs up a directory with a timestamp.',
    estimatedTime: '5–8 days'
  },
  'VS Code': {
    relevance: 'VS Code is the world’s most popular IDE, optimizing developer productivity with debuggers and extensions.',
    topics: [
      'Workspace configurations and settings.json',
      'Interactive step-debugging with launch.json breakpoints',
      'Keyboard shortcuts (multi-cursor, command palette, symbol search)',
      'Configuring code formatters (Prettier, Black) and linters (ESLint, Flake8)',
      'Git integration and diff inspection inside the editor'
    ],
    project: 'Configure a project workspace with customized launch.json step-debugging and automated formatting on save.',
    estimatedTime: '2–4 days'
  },
  'CI/CD': {
    relevance: 'Continuous Integration & Deployment automates testing and deployment to catch regressions before production.',
    topics: [
      'Core principles of CI/CD and deployment pipelines',
      'Writing workflow YAML files for GitHub Actions or GitLab CI',
      'Running automated test suites and linters on pull requests',
      'Building and publishing container images',
      'Automated deployment triggers to staging and production'
    ],
    project: 'Build an automated pipeline that runs linter checks, executes unit tests, and builds a container on every git push.',
    estimatedTime: '5–7 days'
  },
  'AWS': {
    relevance: 'Amazon Web Services is the dominant enterprise cloud provider for hosting web applications and data stores.',
    topics: [
      'Cloud computing fundamentals (IaaS, PaaS, SaaS)',
      'Identity and Access Management (IAM) users, roles, and policies',
      'Compute with Amazon EC2 and serverless with AWS Lambda',
      'Storage with Amazon S3 and database hosting with RDS',
      'Basic networking (VPC, security groups, public/private subnets)'
    ],
    project: 'Deploy a static website to an S3 bucket with public web hosting and configure an IAM policy.',
    estimatedTime: '8–12 days'
  },

  // ------------------ Computer Science ------------------
  'Data Structures': {
    relevance: 'Data structures form the foundational memory models required for writing efficient, scalable software.',
    topics: [
      'Arrays and Strings (memory layout and two-pointer techniques)',
      'Linked Lists (singly and doubly linked, cycle detection)',
      'Stacks and Queues (LIFO vs FIFO, implementation with arrays/nodes)',
      'Hash Tables and Hash Maps (collision resolution, O(1) lookups)',
      'Trees and Binary Search Trees (traversals: pre, in, post, level-order)'
    ],
    project: 'Implement a custom Stack, Queue, and Binary Search Tree from scratch with insert, search, and delete methods.',
    estimatedTime: '10–14 days'
  },
  'Algorithms': {
    relevance: 'Algorithmic problem-solving is the core technical evaluation criteria in software engineering interviews.',
    topics: [
      'Asymptotic notation and Big-O Time & Space complexity analysis',
      'Sorting and Searching (Binary search, Merge sort, Quick sort)',
      'Recursion and Backtracking strategies',
      'Breadth-First Search (BFS) and Depth-First Search (DFS) on graphs',
      'Introduction to Dynamic Programming (memoization and tabulation)'
    ],
    project: 'Solve and document 15 core algorithmic problems covering binary search, BFS/DFS, and two-pointer patterns.',
    estimatedTime: '12–18 days'
  },
  'OOP': {
    relevance: 'Object-Oriented Programming and SOLID principles ensure maintainable, modular enterprise codebases.',
    topics: [
      'The 4 Pillars: Encapsulation, Abstraction, Inheritance, Polymorphism',
      'Interfaces, Abstract Classes, and Composition over Inheritance',
      'SOLID Principles (Single Responsibility, Open/Closed, Liskov, Interface Segregation, Dependency Inversion)',
      'Design Patterns: Singleton, Factory, and Observer patterns',
      'Refactoring tightly coupled code into modular classes'
    ],
    project: 'Design an object-oriented simulation (e.g., parking lot or payment processor) applying SOLID principles.',
    estimatedTime: '6–9 days'
  },
  'DBMS': {
    relevance: 'Understanding database management internals enables building high-throughput systems without data corruption.',
    topics: [
      'Database architecture: Storage engines, buffers, and execution plans',
      'Database Normalization rules (1NF, 2NF, 3NF, BCNF) and denormalization trade-offs',
      'Transaction processing and ACID guarantees',
      'Concurrency control: locks, deadlocks, and two-phase locking',
      'Indexing structures (B+ Trees, Hash indexes)'
    ],
    project: 'Design and normalize a relational database schema for a ride-sharing service up to 3NF with ER diagrams.',
    estimatedTime: '7–10 days'
  },
  'Operating Systems': {
    relevance: 'Operating system principles demystify hardware execution, memory isolation, and thread concurrency.',
    topics: [
      'Processes vs Threads and Process Lifecycle',
      'CPU Scheduling algorithms (Round Robin, Priority, FCFS)',
      'Inter-Process Communication (IPC) and synchronization (mutex, semaphores)',
      'Memory management: Paging, segmentation, and virtual memory',
      'Deadlocks: Conditions, prevention, and Banker’s algorithm'
    ],
    project: 'Write a multi-threaded program demonstrating race conditions and resolve them using mutex locks.',
    estimatedTime: '8–12 days'
  },
  'Computer Networks': {
    relevance: 'Network knowledge is vital for debugging latency, security certificates, API connections, and microservices.',
    topics: [
      'OSI and TCP/IP 4-layer / 7-layer models',
      'TCP three-way handshake, reliable transmission, and UDP comparison',
      'DNS resolution process and IP addressing (IPv4/IPv6, subnets)',
      'HTTP/1.1 vs HTTP/2 vs HTTP/3 and WebSocket protocols',
      'HTTPS, TLS/SSL handshake, and public key encryption'
    ],
    project: 'Inspect HTTP requests, TLS handshakes, and DNS packets using Wireshark or write a simple TCP client-server in Python.',
    estimatedTime: '7–10 days'
  },
  'Software Engineering': {
    relevance: 'Software engineering practices ensure dependable product delivery through team collaboration and testing.',
    topics: [
      'Software Development Life Cycle (SDLC) models: Agile, Scrum, Kanban',
      'Writing effective Unit Tests, Integration Tests, and Mocking',
      'Test-Driven Development (TDD) principles',
      'Code reviews, technical specifications, and architecture diagrams',
      'Continuous refactoring, technical debt management, and semantic versioning'
    ],
    project: 'Develop a small module with 90%+ test coverage using TDD and document it with an architectural diagram.',
    estimatedTime: '5–8 days'
  },

  // ------------------ Data & AI ------------------
  'NumPy': {
    relevance: 'NumPy delivers vectorized mathematical operations and multidimensional arrays for numerical computing.',
    topics: [
      'N-dimensional array creation, shapes, and data types',
      'Array indexing, slicing, and boolean masking',
      'Vectorized arithmetic and broadcasting rules',
      'Linear algebra operations (dot products, matrix multiplication, transposes)',
      'Random sampling and statistical summaries'
    ],
    project: 'Implement a vectorized linear regression algorithm using only NumPy matrix operations.',
    estimatedTime: '4–6 days'
  },
  'Pandas': {
    relevance: 'Pandas is the leading Python library for data ingestion, cleaning, transformation, and analysis.',
    topics: [
      'Series and DataFrame data structures',
      'Reading and writing CSV, JSON, and Excel datasets',
      'Handling missing data (null values, dropna, fillna)',
      'Filtering, grouping (groupby), and aggregation functions',
      'Merging, joining, concatenating, and pivot tables'
    ],
    project: 'Clean a real-world messy dataset and produce an exploratory data report with summary metrics.',
    estimatedTime: '6–9 days'
  },
  'Matplotlib': {
    relevance: 'Matplotlib and Seaborn produce publication-quality charts to communicate insights and metric trends.',
    topics: [
      'Figure and Axes architecture in Matplotlib',
      'Line plots, bar charts, histograms, and scatter plots',
      'Customizing colors, labels, legends, ticks, and titles',
      'Creating multi-panel subplots (plt.subplots)',
      'Styling and statistical charts with Seaborn'
    ],
    project: 'Build a multi-chart visual report analyzing correlations and distributions in a sales or tech salaries dataset.',
    estimatedTime: '4–6 days'
  },
  'Machine Learning': {
    relevance: 'Machine Learning enables automated pattern recognition and predictive decision systems across industries.',
    topics: [
      'Supervised vs Unsupervised learning paradigms',
      'Data preprocessing, feature scaling, and train/test splits',
      'Core algorithms: Linear Regression, Logistic Regression, Decision Trees',
      'Evaluation metrics: Accuracy, Precision, Recall, F1-Score, ROC-AUC',
      'Hyperparameter tuning using GridSearchCV in Scikit-Learn'
    ],
    project: 'Train and evaluate a customer churn prediction classifier with cross-validation and feature importance analysis.',
    estimatedTime: '10–14 days'
  },
  'Deep Learning': {
    relevance: 'Deep Learning drives computer vision, speech recognition, and generative AI through neural network architectures.',
    topics: [
      'Artificial neurons, activation functions (ReLU, Sigmoid, Softmax)',
      'Forward propagation, loss functions, and backpropagation',
      'Stochastic Gradient Descent (SGD) and Adam optimizer',
      'Convolutional Neural Networks (CNNs) for vision tasks',
      'Building models with PyTorch or TensorFlow'
    ],
    project: 'Build and train a convolutional neural network on the MNIST or Fashion-MNIST dataset reaching 95%+ accuracy.',
    estimatedTime: '12–16 days'
  },
  'Natural Language Processing': {
    relevance: 'NLP empowers software to parse, understand, and extract structured insight from human language.',
    topics: [
      'Text tokenization, lowercasing, stop-word removal, and lemmatization',
      'Bag of Words and TF-IDF vectorization',
      'Word embeddings (Word2Vec, GloVe)',
      'Sentiment analysis and text classification',
      'Introduction to Transformer architectures and token embeddings'
    ],
    project: 'Build a spam SMS classifier or customer review sentiment analyzer using TF-IDF and a Naive Bayes/Logistic model.',
    estimatedTime: '8–12 days'
  },
  'GraphQL': {
    relevance: 'GraphQL lets clients request the exact data fields needed, preventing over-fetching in complex mobile and web apps.',
    topics: [
      'Schema Definition Language (SDL): Types, Queries, Mutations',
      'Resolvers and context objects in backend servers',
      'Arguments, variables, and aliases',
      'Handling relationships and N+1 query problems with DataLoader',
      'Consuming GraphQL APIs with Apollo Client or urql'
    ],
    project: 'Build a GraphQL server for a library catalog with authors, books, and relational resolvers.',
    estimatedTime: '5–8 days'
  }
};

/**
 * Retrieve saved progress map from LocalStorage
 * @returns {Object} { [skillName]: 'Not Started' | 'Learning' | 'Completed' }
 */
export function getSavedRoadmapProgress() {
  try {
    const raw = localStorage.getItem(ROADMAP_PROGRESS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return typeof parsed === 'object' && parsed !== null ? parsed : {};
  } catch (err) {
    console.error('Failed to parse roadmap progress from localStorage:', err);
    return {};
  }
}

/**
 * Save progress map to LocalStorage
 * @param {Object} progressMap 
 */
export function saveRoadmapProgress(progressMap) {
  try {
    localStorage.setItem(ROADMAP_PROGRESS_KEY, JSON.stringify(progressMap));
  } catch (err) {
    console.error('Failed to save roadmap progress:', err);
  }
}

/**
 * Reset all roadmap progress
 */
export function clearRoadmapProgress() {
  try {
    localStorage.removeItem(ROADMAP_PROGRESS_KEY);
  } catch (err) {
    console.error('Failed to clear roadmap progress:', err);
  }
}

/**
 * Build rich roadmap item list from missing skills detected in analysis.
 * Preserves existing status if the skill was already in progress!
 * @param {Array} missingSkills List of skill objects { name, category, ... }
 * @param {string} targetRole 
 * @param {Object} currentProgress 
 * @returns {Array} Complete list of roadmap item objects
 */
export function buildRoadmapItems(missingSkills = [], targetRole = '', currentProgress = {}) {
  if (!Array.isArray(missingSkills)) return [];

  // Deduplicate by skill name
  const seen = new Set();
  const items = [];

  for (const skill of missingSkills) {
    const skillName = typeof skill === 'string' ? skill : skill.name;
    if (!skillName || seen.has(skillName)) continue;
    seen.add(skillName);

    const catalogEntry = ROADMAP_CATALOG[skillName] || {
      relevance: `${skillName} is a valuable technical qualification specified in the job posting to ensure effective contribution.`,
      topics: [
        `${skillName} Core syntax & terminology`,
        'Fundamental concepts and architecture',
        'Standard library utilities & best practices',
        'Practical integration with existing codebases',
        'Testing and debugging techniques'
      ],
      project: `Build a functional proof-of-concept project demonstrating core hands-on competency in ${skillName}.`,
      estimatedTime: '5–8 days'
    };

    // Preserve existing progress if available; default to 'Not Started'
    const status = currentProgress[skillName] || 'Not Started';

    items.push({
      skill: skillName,
      category: skill.category || 'Technical',
      relevance: catalogEntry.relevance,
      topics: catalogEntry.topics,
      project: catalogEntry.project,
      estimatedTime: catalogEntry.estimatedTime,
      status: status
    });
  }

  return items;
}
