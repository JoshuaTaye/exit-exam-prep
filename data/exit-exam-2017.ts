// Exit Exam 2017 — Software Engineering Exit Exam.
// Full 99-question past paper with verified answer keys and thorough explanations
// (including why each distractor is wrong). This is a fixed past-paper kept
// independent of the blueprint-driven question bank so it never affects the
// adaptive mastery analytics — it lives in its own section.

export type Choice = "A" | "B" | "C" | "D";

export interface ExitExam2017Question {
  num: number;
  category: string;
  stem: string;
  options: Record<Choice, string>;
  answer: Choice;
  explanation: string;
}

export const EXIT_EXAM_2017_CATEGORIES = [
  "Software Engineering",
  "Programming",
  "Databases",
  "Networking",
  "Operating Systems",
  "Web Development",
  "Security",
  "AI & ML",
  "Algorithms & Data Structures",
  "Testing",
  "Architecture & Design",
  "Mobile",
] as const;

export const EXIT_EXAM_2017_QUESTIONS: ExitExam2017Question[] = [
  {
    num: 1,
    category: "Software Engineering",
    stem: "What is the first step in managing a change to software requirements?",
    options: {
      A: "Communicate the change to stakeholders",
      B: "Assess the impact of the change",
      C: "Establish a change management process",
      D: "Implement the change immediately",
    },
    answer: "B",
    explanation:
      "Once a change request arrives, the first action in the change-management workflow is to analyse and assess its impact — on scope, cost, schedule and dependent requirements — so an informed decision can be made. (A) Communicating comes after you understand the impact. (C) Establishing the process is a one-time setup done before any requests exist, not a step taken per change. (D) Implementing immediately skips analysis and is exactly what disciplined change control prevents.",
  },
  {
    num: 2,
    category: "Programming",
    stem: "In the context of debugging, what is the purpose of a breakpoint?",
    options: {
      A: "To indicate the start of a loop",
      B: "To pause the execution of a program",
      C: "To mark the end of a function",
      D: "To indicate an error in the code",
    },
    answer: "B",
    explanation:
      "A breakpoint tells the debugger to halt execution at a chosen line so you can inspect variables, the call stack and program state. (A) and (C) describe control-flow constructs, not debugger features. (D) A breakpoint does not signal an error; it is a deliberate, developer-placed pause point.",
  },
  {
    num: 3,
    category: "Databases",
    stem: 'Which of the following SQL statements is used to select all columns and records from a table named "Students"?',
    options: {
      A: "SELECT ALL FROM Students;",
      B: "SELECT Fields FROM Students;",
      C: "SELECT * From Students;",
      D: "SELECT Students;",
    },
    answer: "C",
    explanation:
      "The wildcard * means 'all columns', so SELECT * FROM Students; returns every column for every row. (A) ALL is a valid keyword but not a column selector (it is used like SELECT ALL column...). (B) 'Fields' is treated as a column name, which does not exist. (D) Has no FROM clause and is not valid SQL.",
  },
  {
    num: 4,
    category: "Web Development",
    stem: "Which one of the following Application Layer Protocol is used in Web Development is a Query-based API that allows clients to request only needed data?",
    options: { A: "HTTP", B: "GraphQL", C: "HTTPS", D: "REST" },
    answer: "B",
    explanation:
      "GraphQL is a query language/API where the client specifies exactly which fields it wants, avoiding over- and under-fetching. (A) HTTP is the underlying transport protocol, not a query API. (C) HTTPS is just HTTP secured with TLS. (D) REST returns fixed resource representations, so clients often receive more (or fewer) fields than they need.",
  },
  {
    num: 5,
    category: "Networking",
    stem: "Which of the following OSI model layer handles issues such as network transparency and resource allocation?",
    options: { A: "Transport", B: "Network", C: "Application", D: "Data link" },
    answer: "C",
    explanation:
      "The Application layer provides services to the end user, including network transparency (hiding the physical location of resources) and resource allocation. (A) Transport handles end-to-end process delivery and reliability. (B) Network handles routing/logical addressing. (D) Data link handles node-to-node framing and MAC addressing.",
  },
  {
    num: 6,
    category: "Programming",
    stem: "Which one of the following classes represents a top-level window with a title and border decorations?",
    options: { A: "Container", B: "Panel", C: "Frame", D: "Window" },
    answer: "C",
    explanation:
      "In Java AWT, Frame is a top-level window that includes a title bar and border decorations. (D) Window is a bare top-level window with NO title bar or border. (A) Container is the abstract base that holds components but is not itself a window. (B) Panel is a container meant to be nested inside another window, not a standalone window.",
  },
  {
    num: 7,
    category: "Software Engineering",
    stem: "Which one of the following is the main purpose of conducting interviews in requirements elicitation?",
    options: {
      A: "To gather a wide variety of user opinions through surveys",
      B: "To gather in-depth insights from individual stakeholders",
      C: "To develop detailed documentation of the system",
      D: "To design and prototype the software system",
    },
    answer: "B",
    explanation:
      "Interviews are a one-on-one technique used to draw out deep, detailed insight from individual stakeholders, including tacit needs. (A) Gathering many opinions broadly is the goal of surveys/questionnaires, not interviews. (C) Documentation and (D) design/prototyping are later activities, not the purpose of the elicitation interview itself.",
  },
  {
    num: 8,
    category: "Programming",
    stem: "What is the correct declaration of an integer array of 5 elements in C++?",
    options: {
      A: "int[] arr = {1, 2, 3, 4, 5};",
      B: "int arr(5);",
      C: "int arr[5] = 1, 2, 3, 4, 5;",
      D: "int arr[5];",
    },
    answer: "D",
    explanation:
      "int arr[5]; declares an integer array with 5 elements — valid C++ syntax. (A) Uses Java/C# style int[] arr, which is invalid in C++. (B) int arr(5); declares a single int initialised to 5, not an array. (C) Is missing the required braces — an initializer list must be written as = {1, 2, 3, 4, 5}.",
  },
  {
    num: 9,
    category: "Testing",
    stem: "Which one of the following Types of Agile testing Ensures new code changes does not break existing functionality?",
    options: {
      A: "Regression Testing",
      B: "Exploratory Testing",
      C: "User Acceptance Testing (UAT)",
      D: "Smoke Testing",
    },
    answer: "A",
    explanation:
      "Regression testing re-runs existing tests after a change to confirm previously working features still work. (B) Exploratory testing is unscripted investigation to discover new defects. (C) UAT validates the system against business needs with end users. (D) Smoke testing is a shallow check that the build is stable enough to test further, not a full re-verification of existing functionality.",
  },
  {
    num: 10,
    category: "Software Engineering",
    stem: "Which of the following tools of software engineering enable tracking changes made to software configuration files during installation and configuration?",
    options: {
      A: "Version control systems",
      B: "Document generation tools",
      C: "Package managers",
      D: "Installation tools",
    },
    answer: "A",
    explanation:
      "Version control systems (e.g., Git) record every change to files over time, with history, diffs and the ability to revert. (B) Document generation tools produce docs from source, they don't track config history. (C) Package managers install/update dependencies. (D) Installation tools deploy software but do not maintain a change history of configuration files.",
  },
  {
    num: 11,
    category: "Software Engineering",
    stem: "Which risk response strategy involves transferring the impact of a risk to a third party, such as through insurance or outsourcing?",
    options: {
      A: "Risk Mitigation",
      B: "Risk Acceptance",
      C: "Risk Transference",
      D: "Risk Avoidance",
    },
    answer: "C",
    explanation:
      "Risk transference shifts the consequence/ownership of a risk to a third party — exactly what insurance or outsourcing does. (A) Mitigation reduces the probability or impact but keeps the risk. (B) Acceptance takes no action and absorbs the risk. (D) Avoidance changes the plan to eliminate the risk entirely.",
  },
  {
    num: 12,
    category: "Operating Systems",
    stem: "Which one of the following types of operating systems kernel is a Minimalist kernel that delegates resource management to applications?",
    options: { A: "Microkernel", B: "Exokernel", C: "Hybrid Kernel", D: "Monolithic Kernel" },
    answer: "B",
    explanation:
      "An exokernel is a minimalist kernel that only securely multiplexes hardware and delegates resource management (memory, scheduling policy) up to the applications/library OSes. (A) A microkernel keeps the core small but pushes services to user-space servers, not to the applications themselves. (C) Hybrid kernels blend microkernel and monolithic designs. (D) Monolithic kernels run all services in kernel space — the opposite of minimalist.",
  },
  {
    num: 13,
    category: "Web Development",
    stem: "Which one of the following Performance Optimization Techniques helps to Distribute content across global servers to reduce latency?",
    options: { A: "Load Balancing", B: "Content Delivery Network", C: "Lazy Loading", D: "Caching" },
    answer: "B",
    explanation:
      "A Content Delivery Network (CDN) places copies of content on geographically distributed edge servers so users are served from a nearby location, cutting latency. (A) Load balancing spreads traffic across servers, usually within a region, for throughput/availability. (C) Lazy loading defers loading resources until needed. (D) Caching stores reusable responses but is not inherently a globally distributed network.",
  },
  {
    num: 14,
    category: "Databases",
    stem: "Which Normal Form eliminates partial dependencies?",
    options: {
      A: "Third Normal Form (3NF)",
      B: "Second Normal Form (2NF)",
      C: "First Normal Form (1NF)",
      D: "Boyce-Codd Normal Form (BCNF)",
    },
    answer: "B",
    explanation:
      "2NF requires that every non-key attribute depends on the WHOLE composite primary key, thereby removing partial dependencies. (C) 1NF only requires atomic values. (A) 3NF removes transitive dependencies (non-key depending on non-key). (D) BCNF is a stricter form addressing certain anomalies 3NF misses — both build on 2NF but neither defines the removal of partial dependencies.",
  },
  {
    num: 15,
    category: "Programming",
    stem:
      'What will be the output of the following code?\n\nint day = 2;\nswitch (day) {\n  case 1: cout << "Monday"; break;\n  case 2: cout << "Tuesday"; break;\n  case 3: cout << "Wednesday"; break;\n  default: cout << "Invalid day"; break;\n}',
    options: { A: "Wednesday", B: "Tuesday", C: "Monday", D: "Invalid day" },
    answer: "B",
    explanation:
      'day is 2, so control jumps to case 2 and prints "Tuesday", then break exits the switch. (C) Monday is case 1, (A) Wednesday is case 3, and (D) "Invalid day" only runs in default when no case matches — none of which applies here.',
  },
  {
    num: 16,
    category: "Architecture & Design",
    stem: "Which architectural style is most suitable for a large-scale software system with independent, scalable components?",
    options: {
      A: "Microservices Architecture",
      B: "Layered Architecture",
      C: "Client-Server Architecture",
      D: "Monolithic Architecture",
    },
    answer: "A",
    explanation:
      "Microservices decompose a system into small, independently deployable and independently scalable services — ideal for large-scale systems. (D) A monolith is deployed and scaled as one unit. (B) Layered architecture organises code into tiers but is still typically deployed together. (C) Client-server defines a request/response relationship, not independent scaling of internal components.",
  },
  {
    num: 17,
    category: "Software Engineering",
    stem: "What should a programmer do when they encounter an error they do not understand?",
    options: {
      A: "Panic and quit the project.",
      B: "Assume they are not smart enough to fix it.",
      C: "Search for solutions in documentation, forums, or ask for help.",
      D: "Ignore the error and hope it goes away.",
    },
    answer: "C",
    explanation:
      "Professional practice is to investigate methodically: read the documentation, search forums/Stack Overflow, and ask colleagues. (A), (B) and (D) are all unproductive responses — quitting, self-doubt, and ignoring errors none of which resolves the problem and (D) can let defects ship.",
  },
  {
    num: 18,
    category: "Security",
    stem: "Among the listed Encryption Technology which one is used to secure database storage?",
    options: { A: "SHA-256", B: "Hashing Algorithm", C: "AES", D: "RSA" },
    answer: "C",
    explanation:
      "AES is a fast symmetric cipher and the standard choice for encrypting data at rest, such as database storage (it can be decrypted with the key when the data is read back). (A) SHA-256 and (B) hashing are one-way functions — you cannot recover the original data, so they are not used to 'store and retrieve' encrypted data. (D) RSA is asymmetric and far too slow for bulk data; it is used for key exchange and signatures, not encrypting large stored datasets.",
  },
  {
    num: 19,
    category: "Databases",
    stem: "Imagine you want to design a database to store information about orders in online shopping. Which tables and relationships would be most appropriate?",
    options: {
      A: "One table with all products details (number, name, type, customers, etc.)",
      B: "Multiple tables with redundant data entries for faster searching",
      C: "Separate tables for Products (number, name) and Customers (name), with relationships",
      D: "Separate tables for Products (number), Customers (name), with no relationships",
    },
    answer: "C",
    explanation:
      "Good relational design uses separate, normalized tables for each entity (Products, Customers, Orders) linked by relationships (foreign keys). (A) One giant table causes massive redundancy and update anomalies. (B) Deliberate redundancy violates normalization and risks inconsistency. (D) Separate tables with NO relationships cannot represent which customer placed which order.",
  },
  {
    num: 20,
    category: "Programming",
    stem: "Which of the following function checks if the end of the file has been reached in C++ file handling?",
    options: { A: "getline()", B: "eof()", C: "close()", D: "seekg()" },
    answer: "B",
    explanation:
      "eof() returns true once the end-of-file marker has been reached on a stream. (A) getline() reads a line of input. (C) close() closes the file stream. (D) seekg() moves the read (get) position within the file — it positions the cursor but does not test for end of file.",
  },
  {
    num: 21,
    category: "Security",
    stem: "Which of the following is required by data privacy laws like GDPR and CCPA?",
    options: {
      A: "Users must be informed about how their data is being used",
      B: "Developers are allowed to collect data without user consent",
      C: "User data must only be stored for 6 months",
      D: "Users must provide anonymous data for app functionality",
    },
    answer: "A",
    explanation:
      "Transparency is a core principle of GDPR/CCPA: users must be informed about what data is collected and how it is used. (B) is the opposite — consent (or another lawful basis) is required. (C) There is no universal 6-month limit; data should be kept only as long as necessary, which varies. (D) Laws do not require users to supply anonymous data.",
  },
  {
    num: 22,
    category: "Software Engineering",
    stem: "Which software engineering practice focuses on identifying and mitigating potential risks during the development process?",
    options: {
      A: "Deployment planning",
      B: "Risk management",
      C: "Version control",
      D: "User interface design",
    },
    answer: "B",
    explanation:
      "Risk management is explicitly the discipline of identifying, analysing, prioritising and mitigating risks throughout development. (A) Deployment planning concerns releasing the product. (C) Version control tracks code changes. (D) UI design concerns user-facing interaction — none of these is centred on risk.",
  },
  {
    num: 23,
    category: "Algorithms & Data Structures",
    stem: "Ethiopian airline wants to optimize flight scheduling to minimize delays. Which algorithm design approach is BEST suited with this task?",
    options: {
      A: "Sorting flight data by departure time.",
      B: "Implementing a simple linear search for flight numbers.",
      C: "Designing a graph-based algorithm to model flight connections and dependencies.",
      D: "Randomly assigning flight departure times.",
    },
    answer: "C",
    explanation:
      "Flights, airports and their dependencies form a network, so a graph-based model (nodes = airports/flights, edges = connections/constraints) lets you optimise scheduling and minimise delays. (A) Sorting alone cannot capture dependencies. (B) Linear search just finds a record; it does not optimise scheduling. (D) Random assignment is not an optimisation approach at all.",
  },
  {
    num: 24,
    category: "Architecture & Design",
    stem: "Which one of the following is a critical feature when designing for system scalability in a large-scale software system?",
    options: {
      A: "Using a monolithic codebase for simplicity",
      B: "Limiting API access to avoid traffic",
      C: "Horizontal scaling through independent services",
      D: "Using a single database for all services",
    },
    answer: "C",
    explanation:
      "Horizontal scaling — adding more instances of independent services — is the key enabler of large-scale scalability. (A) A monolith becomes a scaling bottleneck. (B) Limiting API access throttles usage rather than scaling to meet it. (D) A single shared database is a classic single point of contention that hinders scaling.",
  },
  {
    num: 25,
    category: "Software Engineering",
    stem: "Given a complex software development project, how would you design a Work Breakdown Structure (WBS) to ensure efficient task allocation?",
    options: {
      A: "Focus only on the coding phase while ignoring testing and deployment.",
      B: "Create a hierarchical breakdown of tasks based on project deliverables.",
      C: "Assign all tasks to a single team to ensure consistency.",
      D: "Divide the work into as many random tasks as possible.",
    },
    answer: "B",
    explanation:
      "A WBS is by definition a deliverable-oriented hierarchical decomposition of the project work into manageable pieces. (A) Ignoring testing/deployment leaves major work out of the plan. (C) Concentrating all work on one team is an allocation decision, not a WBS, and harms parallelism. (D) Random tasks are not a structured, traceable breakdown.",
  },
  {
    num: 26,
    category: "Security",
    stem: "Which of the following is the primary security concern in choosing a web-based solution for a business?",
    options: {
      A: "The server of the websites.",
      B: "The choice of JavaScript framework.",
      C: "The number of images used on the website.",
      D: "Protection against cyber threats like SQL Injection and XSS.",
    },
    answer: "D",
    explanation:
      "The primary security concern is defending against common web attacks such as SQL Injection and Cross-Site Scripting (XSS). (A) The server choice and (B) the framework are architectural decisions with security implications but are not the core security concern. (C) The number of images is a performance/aesthetic matter, not a security one.",
  },
  {
    num: 27,
    category: "Software Engineering",
    stem: "Imagine you have been assigned to schedule a software development project with multiple dependencies. What approach would you take to create an effective timeline?",
    options: {
      A: "Use a Gantt chart and critical path method to plan dependencies",
      B: "Ignore dependencies and focus only on coding speed",
      C: "Allow developers to choose their own timelines without oversight",
      D: "Assign equal deadlines to all tasks regardless of complexity",
    },
    answer: "A",
    explanation:
      "Gantt charts visualise tasks over time and the Critical Path Method (CPM) identifies the dependency chain that determines the minimum project duration — exactly what's needed when tasks depend on each other. (B) Ignoring dependencies causes blocked work. (C) No oversight leads to misaligned schedules. (D) Equal deadlines ignore that tasks differ in size and complexity.",
  },
  {
    num: 28,
    category: "Operating Systems",
    stem: "Which one of the following deadlock condition occurs when a resource can only be used by one process at a time?",
    options: { A: "Circular Wait", B: "Hold and Wait", C: "Mutual Exclusion", D: "No Preemption" },
    answer: "C",
    explanation:
      "Mutual exclusion is the Coffman condition stating that a resource is non-shareable — only one process can hold it at a time. (B) Hold and wait: a process holds resources while waiting for more. (D) No preemption: resources cannot be forcibly taken away. (A) Circular wait: a closed chain of processes each waiting on the next. All four must hold for deadlock, but only mutual exclusion describes single-process-at-a-time use.",
  },
  {
    num: 29,
    category: "Security",
    stem: "Which one of the following Malware Type Encrypts user files and demands payment?",
    options: { A: "Viruses", B: "Ransomware", C: "Rootkits", D: "Worms" },
    answer: "B",
    explanation:
      "Ransomware encrypts the victim's files and demands payment (a ransom) for the decryption key. (A) A virus attaches to files and spreads when executed. (C) A rootkit hides itself and grants stealthy privileged access. (D) A worm self-replicates across networks. Only ransomware is defined by the encrypt-and-extort behaviour.",
  },
  {
    num: 30,
    category: "AI & ML",
    stem: "Which one of the following types of Machine Learning Learns from labeled data?",
    options: {
      A: "Semi-Supervised Learning",
      B: "Unsupervised Learning",
      C: "Reinforcement Learning",
      D: "Supervised Learning",
    },
    answer: "D",
    explanation:
      "Supervised learning trains on labeled examples (input → known output) to learn a mapping. (B) Unsupervised learning uses unlabeled data to find structure. (A) Semi-supervised uses a small amount of labeled plus much unlabeled data — not purely labeled. (C) Reinforcement learning learns from reward signals through interaction, not from a labeled dataset.",
  },
  {
    num: 31,
    category: "Testing",
    stem: "Which one of the following levels of Software Testing test interactions between modules?",
    options: {
      A: "System Testing",
      B: "Unit Testing",
      C: "Integration Testing",
      D: "User Acceptance Testing",
    },
    answer: "C",
    explanation:
      "Integration testing specifically verifies that combined modules interact and work correctly together. (B) Unit testing isolates and tests a single module/component. (A) System testing validates the complete, integrated system as a whole. (D) UAT confirms the system meets user/business requirements. Only integration testing targets inter-module interactions.",
  },
  {
    num: 32,
    category: "Networking",
    stem: "Suppose you are designing a data center network that requires minimal latency and high redundancy. Which topology would best meet the requirement?",
    options: { A: "Bus", B: "Mesh", C: "Star", D: "Hybrid" },
    answer: "B",
    explanation:
      "A mesh topology connects nodes with many direct paths, giving multiple redundant routes (high redundancy) and short direct paths (low latency). (A) Bus shares a single backbone — a single point of failure with contention. (C) Star routes everything through one central device, a bottleneck/single point of failure. (D) Hybrid mixes topologies but is not specifically optimised for both minimal latency and high redundancy the way full mesh is.",
  },
  {
    num: 33,
    category: "Testing",
    stem: "Which one of the following Static software Testing type is a formal and well-defined type of static test which was first introduced in 1972 in IBM by Michael Fagan?",
    options: { A: "Inspection", B: "Technical review", C: "Walk-through", D: "Informal review" },
    answer: "A",
    explanation:
      "The Fagan Inspection, introduced by Michael Fagan at IBM in 1972, is the formal, well-defined static review technique with defined roles and entry/exit criteria. (B) Technical review and (C) walk-through are less formal review types. (D) Informal review has no defined process at all — the opposite of formal.",
  },
  {
    num: 34,
    category: "AI & ML",
    stem: "Which one of the following types of machine learning algorithms is best suited for demand forecasting and Predictive maintenance problems?",
    options: { A: "Time-Series Forecasting", B: "Regression", C: "Classification", D: "Clustering" },
    answer: "A",
    explanation:
      "Demand forecasting and predictive maintenance both involve predicting future values from data ordered over time, which is exactly what time-series forecasting models (ARIMA, LSTMs, etc.) are built for. (B) Regression predicts a continuous value but does not inherently model temporal dependence. (C) Classification predicts discrete categories. (D) Clustering groups unlabeled data and makes no forecasts.",
  },
  {
    num: 35,
    category: "Web Development",
    stem: "Which method is used in JavaScript to change the content of an HTML element dynamically?",
    options: {
      A: "document.write()",
      B: "window.alert()",
      C: "document.getElementById().innerHTML",
      D: "console.log()",
    },
    answer: "C",
    explanation:
      "Selecting an element and setting its .innerHTML replaces that element's content in the DOM dynamically. (A) document.write() writes to the document stream and can overwrite the whole page if called after load. (B) window.alert() shows a popup. (D) console.log() prints to the developer console — none of these updates an element's content in place.",
  },
  {
    num: 36,
    category: "Programming",
    stem: "Which one of the following statement is TRUE?",
    options: {
      A: "An overriding method can declare that it throws checked exceptions that are not thrown by the method it is overriding.",
      B: "Private methods cannot be overridden in subclasses.",
      C: "The parameter list of an overriding method can be a subset of the parameter list of the method that it is overriding.",
      D: "A subclass can override any method in a superclass.",
    },
    answer: "B",
    explanation:
      "Private methods are not visible to subclasses, so they cannot be overridden (a subclass method with the same name merely hides/redefines it). (A) An overriding method may NOT broaden checked exceptions — it can only throw the same or narrower ones. (C) An override must have an identical parameter list, not a subset (a different list is overloading, not overriding). (D) final and static methods (and private ones) cannot be overridden, so 'any method' is false.",
  },
  {
    num: 37,
    category: "Web Development",
    stem: "Which of the following CSS style properties are inherited, meaning they are transmitted from parent to child elements?",
    options: { A: "Margins style", B: "Height style", C: "Borders style", D: "Colors style" },
    answer: "D",
    explanation:
      "Text-related properties such as color are inherited by child elements by default. (A) margin, (B) height and (C) border are box-model layout properties that are NOT inherited — each element gets its own initial value unless explicitly set.",
  },
  {
    num: 38,
    category: "Software Engineering",
    stem: "What is the primary method used to estimate the maintenance effort for software systems?",
    options: {
      A: "Lines of Code (LOC)",
      B: "Number of security patches required",
      C: "Function Points (FP)",
      D: "Annual Maintenance Cost (AMC)",
    },
    answer: "C",
    explanation:
      "Function Points measure software functionality independent of language and are the standard size metric fed into effort-estimation models (including for maintenance). (A) LOC is language-dependent and a cruder proxy. (B) Number of patches is a reactive count, not an estimation method. (D) Annual Maintenance Cost is an output/result (money), not a method for estimating the effort.",
  },
  {
    num: 39,
    category: "Databases",
    stem: "What is the purpose of a foreign key in database design?",
    options: {
      A: "To improve indexing performance.",
      B: "To enforce referential integrity between related tables.",
      C: "To store duplicate records.",
      D: "To uniquely identify a record within a table.",
    },
    answer: "B",
    explanation:
      "A foreign key links a column to the primary key of another table and enforces referential integrity, ensuring a child row cannot reference a non-existent parent. (A) Indexing performance is a side benefit, not the purpose. (C) Foreign keys do not store duplicates. (D) Uniquely identifying a row within its own table is the job of the PRIMARY key.",
  },
  {
    num: 40,
    category: "Networking",
    stem: "Which of the following layer in the TCP/IP model provides a logical connection between a source host and a destination host?",
    options: { A: "Data link", B: "Network", C: "Transport", D: "Application" },
    answer: "B",
    explanation:
      "The Network (Internet) layer, via IP and logical addressing/routing, provides host-to-host (source-to-destination) delivery across interconnected networks. (A) Data link only provides node-to-node delivery over one physical link. (C) Transport provides process-to-process (port-to-port) delivery, a level above host-to-host. (D) Application deals with end-user services, not host addressing.",
  },
  {
    num: 41,
    category: "Algorithms & Data Structures",
    stem: "Which one of the following algorithm would you use to check if a number is even or odd?",
    options: { A: "If-else statement", B: "Merge sort", C: "Sorting algorithm", D: "Binary search" },
    answer: "A",
    explanation:
      "Testing even/odd is a simple conditional: compute n % 2 and branch with an if-else. (B) Merge sort and (C) sorting algorithms order collections — irrelevant to a single number's parity. (D) Binary search finds an element in a sorted collection — also irrelevant here.",
  },
  {
    num: 42,
    category: "AI & ML",
    stem: "Which of the following is a type of AI agent that maintains an internal model of the world, which is updated by percepts as they are received?",
    options: {
      A: "Simple reflex agent",
      B: "Learning agent",
      C: "Model-based agent",
      D: "Utility-based agent",
    },
    answer: "C",
    explanation:
      "A model-based (reflex) agent keeps an internal state/model of the world that it updates with each new percept to handle partial observability. (A) A simple reflex agent acts only on the current percept with no memory. (B) A learning agent improves its behaviour over time but is defined by learning, not world-modelling. (D) A utility-based agent chooses actions to maximise a utility function; it may use a model but is characterised by utility maximisation.",
  },
  {
    num: 43,
    category: "Security",
    stem: "A software company wants to implement a new data security policy for newly developed system. The most effective way to ensure employee awareness and compliance is to:",
    options: {
      A: "Rely on employees to read and understand the policy on their own time.",
      B: "Delegate responsibility for policy enforcement to IT security personnel.",
      C: "Provide comprehensive training on the policy and its importance.",
      D: "Distribute the policy document via email and require a signature for receipt.",
    },
    answer: "C",
    explanation:
      "Comprehensive training builds genuine understanding and behavioural change, which is the most effective route to awareness and compliance. (A) Self-reading is unreliable. (B) Delegating enforcement to IT does not make the workforce aware. (D) A signed receipt proves delivery but not comprehension or compliance.",
  },
  {
    num: 44,
    category: "Algorithms & Data Structures",
    stem: "Which sorting algorithm has the worst-case time complexity of O(n^2)?",
    options: { A: "Merge Sort", B: "Bubble Sort", C: "Quick Sort", D: "Heap Sort" },
    answer: "B",
    explanation:
      "Bubble Sort is O(n²) in its worst (and average) case — the canonical quadratic sort. (A) Merge Sort and (D) Heap Sort are O(n log n) in the worst case. (C) Quick Sort's AVERAGE case is O(n log n); its worst case is also O(n²), but Bubble Sort is the unambiguous, always-quadratic answer intended here, whereas good pivot choice keeps Quick Sort near O(n log n).",
  },
  {
    num: 45,
    category: "AI & ML",
    stem: "Why learning Artificial Intelligence is so important in today's world?",
    options: {
      A: "Learning AI once is enough to know all future developments.",
      B: "AI technologies have no impact on human beings.",
      C: "AI is a rapidly evolving field, requiring continuous learning to stay updated.",
      D: "AI has limited applications, so further learning is necessary.",
    },
    answer: "C",
    explanation:
      "AI advances quickly, so continuous learning is needed to keep current — the genuine reason it's important to study. (A) Learning once is never enough in a fast-moving field. (B) AI has enormous impact on people, so this is false. (D) Is self-contradictory and understates AI's broad applicability.",
  },
  {
    num: 46,
    category: "Web Development",
    stem: "Which one of the following is used for State management in web applications development?",
    options: { A: "React Router", B: "Redux", C: "Axios", D: "Content Delivery Network" },
    answer: "B",
    explanation:
      "Redux is a predictable state container used to manage application state centrally. (A) React Router handles client-side navigation/routing. (C) Axios is an HTTP client for making requests. (D) A CDN serves static assets — none of these is a state-management library.",
  },
  {
    num: 47,
    category: "Programming",
    stem: "Which of the following is the correct way to declare a function that takes two integers and returns their sum?",
    options: {
      A: "sum(int a, int b) { return a + b; }",
      B: "int sum(a, b) { return a + b; }",
      C: "sum(int a, int b) { return a + b; }",
      D: "int sum(int a, int b) { return a + b; }",
    },
    answer: "D",
    explanation:
      "int sum(int a, int b) { return a + b; } specifies the return type (int) and types both parameters — correct in C/C++/Java. (A) and (C) are identical and both omit the return type. (B) omits the parameter types (a, b have no type). Only (D) is fully and correctly typed.",
  },
  {
    num: 48,
    category: "Operating Systems",
    stem: "Which one of the following deadlock condition occurs when a process holding at least one resource is waiting to acquire additional resources held by other processes?",
    options: { A: "Hold and Wait", B: "No Preemption", C: "Mutual Exclusion", D: "Circular Wait" },
    answer: "A",
    explanation:
      "Hold and wait describes exactly this: a process holds at least one resource while waiting for additional resources held by others. (C) Mutual exclusion means a resource is non-shareable. (B) No preemption means held resources can't be forcibly reclaimed. (D) Circular wait is a closed loop of processes each waiting on the next.",
  },
  {
    num: 49,
    category: "Mobile",
    stem: "Among the listed component of Android Application which one helps to declare permissions such as accessing sensitive data (GPS, Camera, and Storage)?",
    options: { A: "Views and ViewGroups", B: "Content Provider", C: "Intents", D: "AndroidManifest.xml" },
    answer: "D",
    explanation:
      "Permissions (and app components, etc.) are declared in the AndroidManifest.xml using <uses-permission> entries. (A) Views/ViewGroups build the UI. (B) A Content Provider shares data between apps. (C) Intents request actions/navigation between components — none of these declares permissions.",
  },
  {
    num: 50,
    category: "Software Engineering",
    stem: "Which one of the following is a code smell in software?",
    options: {
      A: "Frequent code reviews",
      B: "Consistent naming conventions",
      C: "High code test coverage",
      D: "Long method length",
    },
    answer: "D",
    explanation:
      "A long method is a classic code smell — a surface indicator that the code may be hard to read, maintain or test. (A) Frequent reviews, (B) consistent naming and (C) high test coverage are all positive, healthy practices, the opposite of smells.",
  },
  {
    num: 51,
    category: "Networking",
    stem: "Which of the following topology, the central server will provide the connectivity for all pair of nodes willing to communicate with each other?",
    options: { A: "Bus", B: "Mesh", C: "Star", D: "Ring" },
    answer: "C",
    explanation:
      "In a star topology every node connects to a central hub/switch, which relays communication between any pair of nodes. (A) Bus uses a shared backbone cable, not a central node. (B) Mesh connects nodes directly to each other. (D) Ring connects each node to two neighbours in a loop — none routes everything through a single central device.",
  },
  {
    num: 52,
    category: "Algorithms & Data Structures",
    stem: "Write a program to find the sum of the first n natural numbers (1 to n). What is the correct formula to calculate this sum?",
    options: {
      A: "n * (n + 1) / 2",
      B: "n * (n + 2) / 2",
      C: "n * (n - 1) / 2",
      D: "n + (n - 1) / 2",
    },
    answer: "A",
    explanation:
      "The sum 1 + 2 + … + n equals n(n + 1)/2 (Gauss's formula). Check n = 3: 3·4/2 = 6 = 1+2+3. ✓ (C) n(n−1)/2 gives 3 (too small). (B) n(n+2)/2 gives 7.5 (wrong). (D) n + (n−1)/2 gives 4 (wrong).",
  },
  {
    num: 53,
    category: "Programming",
    stem: "Which of the following is not user defined data type?",
    options: { A: "Structure", B: "Union", C: "Enumeration", D: "Integer" },
    answer: "D",
    explanation:
      "Integer (int) is a built-in/primitive data type provided by the language, not user-defined. (A) Structure, (B) Union and (C) Enumeration are all user-defined types the programmer creates to group or name values.",
  },
  {
    num: 54,
    category: "Algorithms & Data Structures",
    stem: "Which of the following is correct regarding the difference between breadth first search and depth first search?",
    options: {
      A: "Breadth first search requires less memory compared to depth first search.",
      B: "Breadth first search is slower than depth first search",
      C: "Breadth first search is more faster than depth first search",
      D: "Depth first search is useful in finding shortest path, while breadth first search is not.",
    },
    answer: "A",
    explanation:
      "Note: this item is poorly worded. The reliable, well-established facts are that DFS generally uses LESS memory than BFS (DFS stores only the current path, O(depth); BFS stores an entire frontier, O(width)), and that BFS — not DFS — finds the shortest path in an unweighted graph. So (D) is reversed and false, and (B)/(C) are false because both run in O(V+E) time (neither is inherently faster). Among the four, the intended key is (A), which targets the memory difference; in the special case of a deep, narrow graph BFS's frontier can be smaller, but in general remember: DFS = less memory, BFS = shortest path.",
  },
  {
    num: 55,
    category: "Software Engineering",
    stem: "What is the primary focus of refactoring in software development?",
    options: {
      A: "Rewriting the entire software to improve its performance",
      B: "Enhancing the external user interface",
      C: "Adding new functionalities",
      D: "Improving internal code structure without changing external behavior",
    },
    answer: "D",
    explanation:
      "Refactoring improves the internal structure (readability, maintainability) of code while preserving its observable external behaviour. (A) Refactoring is incremental, not a full rewrite, and isn't primarily about performance. (B) It does not change the UI. (C) Adding features is enhancement, not refactoring — by definition behaviour stays the same.",
  },
  {
    num: 56,
    category: "Operating Systems",
    stem: "Which one of the following process Synchronization Mechanism Ensures only one process accesses a shared resource at a time?",
    options: {
      A: "Mutex (Mutual Exclusion Locks)",
      B: "Semaphores",
      C: "Read-Write Locks",
      D: "Monitors and Condition Variables",
    },
    answer: "A",
    explanation:
      "A mutex is a lock designed precisely to enforce mutual exclusion — only one thread/process may hold it and access the resource at a time. (B) A semaphore is more general and can allow N concurrent accessors (a counting semaphore). (C) Read-write locks deliberately allow many simultaneous readers. (D) Monitors coordinate access but are a higher-level construct; the direct one-at-a-time primitive is the mutex.",
  },
  {
    num: 57,
    category: "Software Engineering",
    stem: "Which of the following models is NOT considered as the state-of-the-art software process model?",
    options: { A: "Extreme Programming (XP)", B: "Waterfall model", C: "Agile Model", D: "Spiral model" },
    answer: "B",
    explanation:
      "The Waterfall model is the classic, rigid, sequential approach now considered outdated for most projects — not state of the art. (A) XP and (C) Agile are modern iterative/adaptive approaches. (D) The Spiral model is a risk-driven iterative model still regarded as advanced. Waterfall is the odd one out.",
  },
  {
    num: 58,
    category: "Software Engineering",
    stem: "Which of the following project management tool is used for scope management?",
    options: {
      A: "Critical path analysis",
      B: "Gantt Chart",
      C: "Net present value",
      D: "Work breakdown structures",
    },
    answer: "D",
    explanation:
      "A Work Breakdown Structure decomposes the total project scope into all deliverables/work packages, making it the core scope-management tool. (A) Critical path analysis and (B) Gantt charts are schedule/time-management tools. (C) Net present value is a financial/cost technique. Only the WBS defines and organises scope.",
  },
  {
    num: 59,
    category: "Software Engineering",
    stem: "Which of the following activity is not conducted in software planning?",
    options: {
      A: "Organizational and Resource Planning",
      B: "Managing Stage Boundaries",
      C: "Cost Estimation and Budgeting",
      D: "Project Plan Development and Execution",
    },
    answer: "B",
    explanation:
      "'Managing Stage Boundaries' is a process carried out DURING project execution (e.g., in PRINCE2, at the end of each stage), not part of up-front software planning. (A) Resource planning, (C) cost estimation/budgeting and (D) developing the project plan are all planning activities. Managing stage boundaries belongs to execution/control.",
  },
  {
    num: 60,
    category: "Programming",
    stem: "Which one of the following object oriented feature restricts direct access to certain details, ensuring data security and integrity?",
    options: { A: "Polymorphism", B: "Encapsulation", C: "Inheritance", D: "Abstraction" },
    answer: "B",
    explanation:
      "Encapsulation bundles data with methods and uses access modifiers (private) to restrict direct access, protecting data integrity (data hiding). (A) Polymorphism lets one interface represent many types. (C) Inheritance reuses and extends behaviour. (D) Abstraction hides complexity by exposing only essential features, but the access-restriction/data-hiding mechanism is specifically encapsulation.",
  },
  {
    num: 61,
    category: "Web Development",
    stem: "Which one of the following is the purpose of AJAX in web development?",
    options: {
      A: "To handle server-side database interactions",
      B: "To create static HTML pages",
      C: "To make asynchronous requests to the server and update the page dynamically",
      D: "To apply styles to HTML elements",
    },
    answer: "C",
    explanation:
      "AJAX (Asynchronous JavaScript and XML) lets the browser exchange data with the server in the background and update parts of the page without a full reload. (A) Server-side DB work is done by back-end code, not AJAX. (B) AJAX produces dynamic, not static, pages. (D) Styling is the role of CSS.",
  },
  {
    num: 62,
    category: "Software Engineering",
    stem: "Which one of the following incident requires immediate action (e.g., system failure)?",
    options: { A: "High", B: "Low", C: "Medium", D: "Critical" },
    answer: "D",
    explanation:
      "A Critical incident (e.g., full system failure/outage) demands immediate action and is the top severity. (A) High is serious but ranks below Critical. (C) Medium and (B) Low are lower-priority issues that can be scheduled rather than handled instantly.",
  },
  {
    num: 63,
    category: "Security",
    stem: "Which one of the following types of firewall Tracks active connections and allows only legitimate traffic?",
    options: {
      A: "Proxy Firewall",
      B: "Cloud-Based Firewall",
      C: "Stateful Inspection Firewall",
      D: "Packet Filtering Firewall",
    },
    answer: "C",
    explanation:
      "A stateful inspection firewall maintains a state table of active connections and permits packets only if they belong to a valid, established session. (D) A packet-filtering firewall is stateless — it judges each packet in isolation by header rules. (A) A proxy firewall mediates at the application layer on behalf of clients. (B) 'Cloud-based' describes deployment location, not the connection-tracking technique.",
  },
  {
    num: 64,
    category: "Web Development",
    stem: "What is the primary role of CSS in web development?",
    options: {
      A: "To structure the webpage content",
      B: "To style and layout the webpage elements",
      C: "To add interactivity to the page",
      D: "To interact with the server",
    },
    answer: "B",
    explanation:
      "CSS (Cascading Style Sheets) controls the presentation — styling and layout — of HTML elements. (A) Structuring content is the role of HTML. (C) Interactivity is provided by JavaScript. (D) Server interaction is handled by back-end code/APIs.",
  },
  {
    num: 65,
    category: "Software Engineering",
    stem: "What is the first step in developing a medium-scale application that solves real world problems?",
    options: {
      A: "Writing code immediately",
      B: "Choosing a programming language randomly",
      C: "Copying code from online sources",
      D: "Analyzing requirements and designing system architecture",
    },
    answer: "D",
    explanation:
      "Sound engineering begins by understanding the problem — analysing requirements and designing the architecture — before any code is written. (A) Coding immediately skips planning and risks building the wrong thing. (B) Random language choice ignores fit-for-purpose. (C) Copying code is not a development methodology and creates quality/legal risks.",
  },
  {
    num: 66,
    category: "Security",
    stem: "Which one of the following Vulnerability Injects JavaScript to steal user data?",
    options: {
      A: "Insecure Deserialization",
      B: "Cross-Site Scripting (XSS)",
      C: "Spyware",
      D: "Buffer Overflow",
    },
    answer: "B",
    explanation:
      "Cross-Site Scripting (XSS) injects malicious JavaScript into pages viewed by other users, which can steal cookies/session data. (A) Insecure deserialization abuses untrusted serialized objects, not script injection into pages. (C) Spyware is malware on a device, not a web-injection vulnerability. (D) A buffer overflow corrupts memory in native code — a different class of flaw.",
  },
  {
    num: 67,
    category: "Algorithms & Data Structures",
    stem: "Suppose you are developing an application that involves real-time data analysis and requires efficient insertion and deletion of data. Which of the following data structures would be best suited for this application?",
    options: { A: "Stack", B: "Queue", C: "Binary tree", D: "Hash table" },
    answer: "D",
    explanation:
      "A hash table offers average-case O(1) insertion, deletion and lookup, making it ideal when fast, frequent inserts/deletes are needed. (A) A stack restricts access to LIFO order. (B) A queue restricts access to FIFO order. (C) A (balanced) binary tree gives O(log n) operations — slower on average than a hash table and unordered access isn't its strength here.",
  },
  {
    num: 68,
    category: "Operating Systems",
    stem: "Which one of the following Process Scheduling Algorithms Executes processes in order of arrival?",
    options: {
      A: "Round Robin (RR)",
      B: "First-Come, First-Served (FCFS)",
      C: "Priority Scheduling",
      D: "Shortest Job Next (SJN)",
    },
    answer: "B",
    explanation:
      "FCFS schedules processes strictly in the order they arrive in the ready queue. (A) Round Robin gives each process a time slice cyclically. (C) Priority scheduling runs the highest-priority process first. (D) SJN runs the process with the smallest burst time first — none of these follows pure arrival order.",
  },
  {
    num: 69,
    category: "Architecture & Design",
    stem: "Which of the following Software Architectural Styles is typically used in systems where high responsiveness and real-time processing are needed?",
    options: {
      A: "Monolithic Architecture",
      B: "Microservices Architecture",
      C: "Event-Driven Architecture",
      D: "Serverless Architecture",
    },
    answer: "C",
    explanation:
      "Event-driven architecture reacts to events asynchronously as they occur, making it well suited to high-responsiveness, real-time processing. (A) Monolithic is a deployment style with no special real-time advantage. (B) Microservices aid scalability/independence but aren't specifically about real-time events. (D) Serverless concerns execution/billing model, not real-time event reaction per se.",
  },
  {
    num: 70,
    category: "Networking",
    stem: "Which of the following is not the function of OSI model presentation layer?",
    options: { A: "Encryption", B: "Compression", C: "Translation", D: "Synchronization" },
    answer: "D",
    explanation:
      "The presentation layer handles data representation: (A) encryption/decryption, (B) compression, and (C) translation between formats (e.g., character encoding). (D) Synchronization (dialog/checkpointing) is a function of the SESSION layer, not the presentation layer.",
  },
  {
    num: 71,
    category: "Security",
    stem: "Which one of the following is a Security Concern in Mobile Networks where attackers steal session cookies?",
    options: {
      A: "Man-in-the-Middle (MitM) attacks",
      B: "SQL Injection",
      C: "Session hijacking",
      D: "Ransomware",
    },
    answer: "C",
    explanation:
      "Session hijacking is precisely the theft of session identifiers/cookies to impersonate a logged-in user. (A) A MitM attack intercepts traffic and can lead to cookie theft, but it describes the interception position, not the act of stealing the session. (B) SQL injection targets databases. (D) Ransomware encrypts files for extortion — unrelated to session cookies.",
  },
  {
    num: 72,
    category: "Software Engineering",
    stem: "Which one of the following is a type of software defect?",
    options: {
      A: "Repeated code segments in the program",
      B: "Null reference error in a function",
      C: "An unhandled exception in the code",
      D: "Performance degradation due to excessive memory usage",
    },
    answer: "B",
    explanation:
      "A null reference (null-pointer) error is a clear functional defect/bug — the program accesses an object that doesn't exist and fails. (A) Repeated code is a code smell/maintainability issue, not a defect that produces wrong behaviour. (C) An unhandled exception is usually a symptom/result of an underlying defect rather than the defect type itself. (D) Performance degradation is a non-functional quality issue, not a discrete functional defect.",
  },
  {
    num: 73,
    category: "Security",
    stem: "Which one of the following Core Objectives of Cryptography Verifies the identity of communicating parties?",
    options: { A: "Integrity", B: "Authentication", C: "Confidentiality", D: "Non-repudiation" },
    answer: "B",
    explanation:
      "Authentication verifies that the communicating parties are who they claim to be. (A) Integrity ensures data wasn't altered. (C) Confidentiality keeps data secret from unauthorised parties. (D) Non-repudiation prevents a party from denying an action they performed — related to identity but specifically about undeniable proof, not verifying identity up front.",
  },
  {
    num: 74,
    category: "Architecture & Design",
    stem: "Which of the following design pattern is used when the algorithm for creating a complex object should be independent of the parts that make up the object and how they are assembled?",
    options: { A: "Singleton pattern", B: "Builder pattern", C: "Factory Method pattern", D: "Prototype pattern" },
    answer: "B",
    explanation:
      "The Builder pattern separates the construction of a complex object from its representation, so the same construction process can build different representations — exactly the described intent. (A) Singleton ensures a single instance. (C) Factory Method defers which class to instantiate to subclasses. (D) Prototype creates new objects by cloning an existing instance.",
  },
  {
    num: 75,
    category: "AI & ML",
    stem: "Suppose you have entity, Samuel. Samuel is a player, his age is 25, his height is 1.98, his club is Manchester, and he lives in England, Manchester. Which of the following knowledge representation is best to represent it?",
    options: {
      A: "Logical representation",
      B: "Semantic network Representation",
      C: "Rule based representation",
      D: "Frame representation",
    },
    answer: "D",
    explanation:
      "A frame represents an object as a set of attribute–value slots (player, age=25, height=1.98, club=Manchester, …) — perfect for describing a single entity's properties. (A) Logical representation uses formal logic statements. (B) Semantic networks emphasise relationships between concepts as a graph. (C) Rule-based representation encodes IF–THEN knowledge, not an entity's attribute set.",
  },
  {
    num: 76,
    category: "Programming",
    stem: "What is the primary purpose of an Integrated Development Environment (IDE)?",
    options: {
      A: "To write and debug code",
      B: "To run mobile applications",
      C: "To store user data",
      D: "To manage hardware resources",
    },
    answer: "A",
    explanation:
      "An IDE integrates an editor, compiler/build tools and a debugger to help developers write and debug code productively. (B) Running mobile apps is the job of an emulator/device. (C) Storing user data is a database's role. (D) Managing hardware resources is the operating system's job.",
  },
  {
    num: 77,
    category: "Software Engineering",
    stem: "Software engineering principles like KISS (Keep It Simple, Stupid) focus on achieving which one of the following?",
    options: {
      A: "Faster development speed at the cost of quality",
      B: "Improved code maintainability and reusability",
      C: "Increased software complexity",
      D: "More visually appealing user interfaces",
    },
    answer: "B",
    explanation:
      "KISS keeps designs simple, which improves readability, maintainability and reuse. (A) It does not trade away quality for speed. (C) It REDUCES complexity, the opposite of increasing it. (D) It targets internal simplicity, not UI aesthetics.",
  },
  {
    num: 78,
    category: "Algorithms & Data Structures",
    stem: "Which of the following sorting algorithms follows the DIVIDE and CONQUER approach?",
    options: { A: "Merge Sort", B: "Bubble Sort", C: "Selection Sort", D: "Insertion Sort" },
    answer: "A",
    explanation:
      "Merge Sort divides the array into halves, recursively sorts each half, and merges them — a textbook divide-and-conquer algorithm. (B) Bubble, (C) Selection and (D) Insertion sorts are iterative, comparison-based methods that build the sorted result in place without dividing the problem into subproblems.",
  },
  {
    num: 79,
    category: "Web Development",
    stem: "Which one of the following Application Layer Protocol used in Web Development Enables real-time, two-way communication between client and server?",
    options: { A: "REST", B: "WebSocket", C: "GraphQL", D: "HTTP" },
    answer: "B",
    explanation:
      "WebSocket provides a persistent, full-duplex (two-way) connection enabling real-time communication between client and server. (A) REST and (D) HTTP are request/response and stateless — the server can't push freely. (C) GraphQL is a query API typically over HTTP and is not inherently a real-time, bidirectional channel (without subscriptions over a socket).",
  },
  {
    num: 80,
    category: "AI & ML",
    stem: "Which one of the following types of Machine Learning Discovers patterns from unlabeled data?",
    options: {
      A: "Unsupervised Learning",
      B: "Reinforcement Learning",
      C: "Supervised Learning",
      D: "Semi-Supervised Learning",
    },
    answer: "A",
    explanation:
      "Unsupervised learning finds structure/patterns (clusters, associations) in unlabeled data. (C) Supervised learning needs labeled data. (D) Semi-supervised uses some labels plus unlabeled data. (B) Reinforcement learning learns from rewards via interaction, not by mining patterns in a static unlabeled dataset.",
  },
  {
    num: 81,
    category: "Software Engineering",
    stem: "Which metric measures the time between two consecutive failures in a system?",
    options: {
      A: "Defect Density",
      B: "Mean Time to Repair",
      C: "Test Coverage",
      D: "Mean Time Between Failures",
    },
    answer: "D",
    explanation:
      "Mean Time Between Failures (MTBF) is defined as the average time elapsed between consecutive failures — a reliability metric. (B) Mean Time To Repair (MTTR) measures how long it takes to fix a failure, not the interval between failures. (A) Defect density is defects per size unit. (C) Test coverage measures how much code is exercised by tests.",
  },
  {
    num: 82,
    category: "Software Engineering",
    stem: "A software developer has completed coding a new feature for a project. Before integrating it with the main codebase, what is the MOST important step to ensure quality?",
    options: {
      A: "Reviewing the code for potential errors and adherence to coding standards.",
      B: "Writing extensive user documentation for the new feature.",
      C: "Deploying the code directly to the production environment for testing.",
      D: "Updating marketing materials to showcase the new feature.",
    },
    answer: "A",
    explanation:
      "A code review (often with tests) before merging catches errors and enforces standards — the key quality gate prior to integration. (B) Documentation is valuable but secondary to verifying correctness. (C) Deploying straight to production to test is reckless and risks live failures. (D) Marketing is unrelated to code quality.",
  },
  {
    num: 83,
    category: "AI & ML",
    stem: "Which one of the following types of machine learning algorithms is best suited for Email spam detection problem?",
    options: { A: "Clustering", B: "Time-Series Forecasting", C: "Regression", D: "Classification" },
    answer: "D",
    explanation:
      "Spam detection assigns each email to one of two discrete classes (spam / not spam), which is a classification task. (A) Clustering groups unlabeled data without predefined classes. (B) Time-series forecasting predicts future values over time. (C) Regression predicts a continuous number, not a category.",
  },
  {
    num: 84,
    category: "Software Engineering",
    stem: "Which one of the following is a key characteristic of a well-written functional requirement?",
    options: {
      A: "It should focus only on performance issues",
      B: "It should be vague to allow flexibility during development",
      C: "It should be testable and measurable",
      D: "It should describe the system architecture",
    },
    answer: "C",
    explanation:
      "A good functional requirement is testable and measurable so you can objectively verify it is met. (A) Performance is a non-functional concern. (B) Vagueness is a defect in a requirement, leading to ambiguity. (D) Architecture is a design artifact, not a requirement statement.",
  },
  {
    num: 85,
    category: "Software Engineering",
    stem: "Non-functional requirements typically focus on which of the following?",
    options: {
      A: "Specific programming languages and frameworks to be used",
      B: "Performance, security, usability, and scalability of the system",
      C: "System behaviors like authentication and user interactions",
      D: "Technical specifications for hardware",
    },
    answer: "B",
    explanation:
      "Non-functional requirements describe quality attributes — performance, security, usability, scalability, etc. — i.e., HOW well the system performs. (C) Specific behaviours/features like authentication are FUNCTIONAL requirements (what the system does). (A) Language/framework choices are implementation/design decisions. (D) Hardware specs are constraints, not the focus of NFRs.",
  },
  {
    num: 86,
    category: "Networking",
    stem: "What method can be used by two computers to ensure that packets are not dropped because too much data is being sent too quickly?",
    options: { A: "Encapsulation", B: "Access method", C: "Flow control", D: "Response timeout" },
    answer: "C",
    explanation:
      "Flow control regulates the rate of transmission so a fast sender doesn't overwhelm a slower receiver, preventing buffer overflow and dropped packets. (A) Encapsulation wraps data with headers per layer. (B) Access method governs how devices share the medium. (D) Response timeout triggers retransmission after no reply — it reacts to loss rather than preventing overload.",
  },
  {
    num: 87,
    category: "Software Engineering",
    stem: "Which one of the following type of maintenance is used to refer to maintenance for fault repair?",
    options: {
      A: "Adaptive maintenance",
      B: "Function Points (FP)",
      C: "Corrective maintenance",
      D: "Perfective maintenance",
    },
    answer: "C",
    explanation:
      "Corrective maintenance fixes defects/faults discovered in the software. (A) Adaptive maintenance adjusts the software to a changed environment (new OS/hardware). (D) Perfective maintenance improves performance or adds enhancements. (B) Function Points is a size metric, not a maintenance type at all.",
  },
  {
    num: 88,
    category: "Programming",
    stem: "Which loop is guaranteed to execute at least once, even if the condition is false?",
    options: { A: "while loop", B: "do-while loop", C: "For each loop", D: "for loop" },
    answer: "B",
    explanation:
      "A do-while loop checks its condition AFTER the body runs, so the body always executes at least once. (A) while and (D) for evaluate the condition BEFORE the first iteration, so they may run zero times. (C) for-each iterates over a collection and runs zero times if the collection is empty.",
  },
  {
    num: 89,
    category: "Databases",
    stem: "How do you add new department column to Students table?",
    options: {
      A: "MODIFY TABLE Students ADD department VARCHAR(255);",
      B: "INSERT INTO Students ADD COLUMN department VARCHAR(255);",
      C: "ALTER TABLE Students ADD COLUMN department VARCHAR(255);",
      D: "UPDATE TABLE Students ADD COLUMN department VARCHAR(255);",
    },
    answer: "C",
    explanation:
      "ALTER TABLE ... ADD COLUMN is the correct DDL to add a new column to an existing table. (A) MODIFY TABLE is not valid SQL (MODIFY is used with ALTER to change an existing column, not add). (B) INSERT INTO adds rows, not columns. (D) UPDATE changes data in existing rows, not the schema.",
  },
  {
    num: 90,
    category: "Architecture & Design",
    stem: "Which one of the following Object-Oriented Software Design Principle refers that software entity should be open for extension but closed for modification?",
    options: {
      A: "Interface Segregation Principle (ISP)",
      B: "Single Responsibility Principle (SRP)",
      C: "Liskov Substitution Principle (LSP)",
      D: "Open/Closed Principle (OCP)",
    },
    answer: "D",
    explanation:
      "The Open/Closed Principle states entities should be open for extension but closed for modification — you add new behaviour without altering existing tested code. (A) ISP says clients shouldn't depend on interfaces they don't use. (B) SRP says a class should have one reason to change. (C) LSP says subtypes must be substitutable for their base types. Only OCP matches the wording.",
  },
  {
    num: 91,
    category: "Software Engineering",
    stem: "What is the primary goal of requirement engineering in software development?",
    options: {
      A: "To write the code",
      B: "To create the user interface",
      C: "To define and manage stakeholder requirements",
      D: "To design the software architecture",
    },
    answer: "C",
    explanation:
      "Requirements engineering is about eliciting, analysing, specifying, validating and managing stakeholder requirements. (A) Writing code is implementation. (B) UI creation is design/implementation. (D) Architecture design is a later activity that builds on requirements — not the goal of requirements engineering itself.",
  },
  {
    num: 92,
    category: "Programming",
    stem: "What is the main purpose of debugging?",
    options: {
      A: "To remove all comments in the code.",
      B: "To add more features without testing.",
      C: "To make the code more complex.",
      D: "To identify and fix errors in the code.",
    },
    answer: "D",
    explanation:
      "Debugging is the process of locating and fixing errors (bugs) so the program behaves correctly. (A) Removing comments is unrelated and usually harmful. (B) Adding features is development, not debugging, and skipping testing is bad practice. (C) Debugging aims to simplify/correct, never to increase complexity.",
  },
  {
    num: 93,
    category: "Mobile",
    stem: "Which component of Android Application refers to a reusable UI component within an activity?",
    options: { A: "Broadcast Receivers", B: "Fragments", C: "Activities", D: "Content Providers" },
    answer: "B",
    explanation:
      "A Fragment is a modular, reusable portion of UI (with its own lifecycle) that lives within an Activity. (C) An Activity is a full screen, not a reusable sub-component. (A) Broadcast Receivers respond to system/app-wide events. (D) Content Providers manage shared data access — neither is a UI component.",
  },
  {
    num: 94,
    category: "Security",
    stem: "Which one of the following Authentication Method uses cryptographic certificates for secure authentication?",
    options: {
      A: "Multi-Factor Authentication (MFA)",
      B: "OTP",
      C: "Public Key Infrastructure (PKI)",
      D: "Biometric Authentication",
    },
    answer: "C",
    explanation:
      "PKI uses digital certificates (binding a public key to an identity, issued by a CA) for secure authentication. (A) MFA combines multiple factors but isn't defined by certificates. (B) OTP uses one-time passcodes. (D) Biometric authentication uses physical traits (fingerprint, face) — none of these is certificate-based the way PKI is.",
  },
  {
    num: 95,
    category: "Security",
    stem: "Which one of the following is a Security Concern in Mobile Networks where attackers steal session cookies?",
    options: {
      A: "Man-in-the-Middle (MitM) attacks",
      B: "SQL Injection",
      C: "Session hijacking",
      D: "Ransomware",
    },
    answer: "C",
    explanation:
      "Session hijacking is the theft/abuse of a user's session identifier (cookie) to impersonate them. (A) A MitM attack intercepts traffic and may enable cookie theft, but it names the interception technique, not the session-stealing concern itself. (B) SQL injection targets databases. (D) Ransomware encrypts files for extortion — unrelated to session cookies.",
  },
  {
    num: 96,
    category: "Architecture & Design",
    stem: "Which of the following design pattern is used when the algorithm for creating a complex object should be independent of the parts that make up the object and how they are assembled?",
    options: { A: "Singleton pattern", B: "Builder pattern", C: "Factory Method pattern", D: "Prototype pattern" },
    answer: "B",
    explanation:
      "The Builder pattern separates the construction of a complex object from its representation so the same step-by-step process can assemble different results. (A) Singleton guarantees one instance. (C) Factory Method lets subclasses decide which class to instantiate. (D) Prototype clones an existing object to create new ones.",
  },
  {
    num: 97,
    category: "Security",
    stem: "Which one of the following Core Objectives of Cryptography Verifies the identity of communicating parties?",
    options: { A: "Integrity", B: "Authentication", C: "Confidentiality", D: "Non-repudiation" },
    answer: "B",
    explanation:
      "Authentication confirms that communicating parties are who they claim to be. (A) Integrity ensures data is unaltered. (C) Confidentiality keeps data secret. (D) Non-repudiation prevents denial of an action — about undeniable proof rather than verifying identity at the outset.",
  },
  {
    num: 98,
    category: "Software Engineering",
    stem: "Which one of the following is a type of software defect?",
    options: {
      A: "Repeated code segments in the program",
      B: "Null reference error in a function",
      C: "An unhandled exception in the code",
      D: "Performance degradation due to excessive memory usage",
    },
    answer: "B",
    explanation:
      "A null reference (null-pointer) error is a concrete functional defect — the code dereferences something that isn't there and fails. (A) Repeated code is a maintainability code smell, not a behavioural defect. (C) An unhandled exception is typically a symptom of an underlying defect rather than the defect type. (D) Performance degradation is a non-functional quality issue.",
  },
  {
    num: 99,
    category: "Networking",
    stem: "Which of the following is not the function of OSI model presentation layer?",
    options: { A: "Encryption", B: "Compression", C: "Translation", D: "Synchronization" },
    answer: "D",
    explanation:
      "The presentation layer is responsible for (A) encryption, (B) compression and (C) translation/format conversion of data. (D) Synchronization (dialog control and checkpointing) is a function of the SESSION layer, so it is NOT a presentation-layer function.",
  },
];
