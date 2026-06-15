// Authored study notes — one entry per learning-outcome topic, in the SAME
// order as the topics in data/blueprint.json for each course. Content is
// hand-written (no runtime generation). The seed maps these onto Topic rows.

export interface NoteContent {
  overview: string;
  keyConcepts: string[];
  definitions: { term: string; definition: string }[];
  examples: { title: string; body: string }[];
  diagram?: string;
  examTips: string[];
  commonMistakes: string[];
}

export const NOTES: Record<number, NoteContent[]> = {
  // ---------------- Course 1: Fundamentals of Programming ----------------
  1: [
    {
      overview:
        "Programming turns a problem statement into instructions a computer can execute. The program development life cycle moves from understanding the problem, to designing an algorithm, to coding, testing, and maintenance.",
      keyConcepts: [
        "Stages: problem definition → algorithm design → coding → compilation → testing → maintenance",
        "Source code is human-readable; the compiler/interpreter turns it into machine code",
        "Pseudocode and flowcharts express algorithms before coding",
        "Syntax errors break compilation; logic errors produce wrong results",
      ],
      definitions: [
        { term: "Algorithm", definition: "A finite, ordered set of unambiguous steps that solves a problem." },
        { term: "Compiler", definition: "A program that translates whole source code into machine code before execution." },
        { term: "Interpreter", definition: "Executes source code line by line without producing a separate executable." },
        { term: "IDE", definition: "Integrated Development Environment — editor, compiler, and debugger in one tool." },
      ],
      examples: [
        { title: "Flowchart vs pseudocode", body: "Pseudocode: READ n; IF n>0 PRINT 'positive'. A flowchart shows the same logic with a decision diamond." },
      ],
      examTips: ["Know the exact order of the development life-cycle stages.", "Distinguish compiler vs interpreter and syntax vs logic errors."],
      commonMistakes: ["Confusing a syntax error (won't compile) with a logic error (compiles but wrong output).", "Thinking interpreters create an .exe file."],
    },
    {
      overview:
        "Programming constructs are the building blocks of control flow: sequence, selection (if/switch), and iteration (for/while/do-while). Operators and expressions combine values to drive these constructs.",
      keyConcepts: [
        "Three control structures: sequence, selection, iteration",
        "do-while executes the body at least once; while/for may execute zero times",
        "Operator precedence and associativity decide evaluation order",
        "Relational/logical operators produce boolean results used by conditions",
      ],
      definitions: [
        { term: "Iteration", definition: "Repeated execution of a block until a condition is met." },
        { term: "Short-circuit evaluation", definition: "&& and || stop evaluating once the result is known." },
        { term: "Jump statement", definition: "break, continue, return, goto — alter normal flow." },
      ],
      examples: [
        { title: "do-while guarantee", body: "do { read input } while(input != 'q'); always reads at least once before checking." },
        { title: "Precedence", body: "2 + 3 * 4 == 14 because * binds tighter than +." },
      ],
      examTips: ["Remember do-while is the only loop guaranteed to run once.", "Watch for off-by-one errors in loop bounds."],
      commonMistakes: ["Assuming a while loop always runs at least once.", "Using = (assignment) instead of == (comparison) in conditions."],
    },
    {
      overview:
        "Problem solving applies systematic techniques — decomposition, pattern recognition, abstraction — to design correct, efficient solutions, often using recursion or iterative refinement.",
      keyConcepts: [
        "Decomposition breaks a big problem into smaller sub-problems",
        "Recursion solves a problem in terms of smaller instances and needs a base case",
        "Top-down (stepwise refinement) vs bottom-up design",
        "Trade-offs between readability, time, and space",
      ],
      definitions: [
        { term: "Base case", definition: "The terminating condition of a recursion that returns directly without recursing." },
        { term: "Stepwise refinement", definition: "Repeatedly breaking a solution into more detailed steps." },
      ],
      examples: [
        { title: "Factorial base case", body: "factorial(0) returns 1; factorial(n) returns n * factorial(n-1)." },
      ],
      examTips: ["Every recursion question hinges on the base case — identify it first.", "Trace small inputs by hand for recursion output questions."],
      commonMistakes: ["Forgetting the base case → infinite recursion / stack overflow.", "Wrong base case value (e.g. factorial(0)=0)."],
    },
    {
      overview:
        "Modular programming divides code into reusable functions/modules with clear interfaces. User-defined types (structs/records), file streams, and vectors/arrays let programs model and persist real data.",
      keyConcepts: [
        "Functions: parameters, return values, scope, pass-by-value vs pass-by-reference",
        "User-defined types: struct/record, enum, typedef",
        "File streams: read, write, append modes; text vs binary",
        "Vectors/dynamic arrays grow at runtime, unlike fixed arrays",
      ],
      definitions: [
        { term: "Pass-by-reference", definition: "Passing a reference so changes inside the function affect the original variable." },
        { term: "Scope", definition: "The region of code where a name is visible (local, global, block)." },
        { term: "Append mode", definition: "Opening a file so writes are added at the end without erasing existing content." },
      ],
      examples: [
        { title: "fstream", body: "In C++ fstream supports both reading and writing; ifstream is read-only, ofstream write-only." },
        { title: "Pass-by-reference", body: "void inc(int &x){x++;} modifies the caller's variable." },
      ],
      examTips: ["Memorize the C++ stream classes and which support read/write.", "Know append vs write (truncate) file modes."],
      commonMistakes: ["Thinking pass-by-reference modifies a copy.", "Confusing fstream (read+write) with ifstream/ofstream."],
    },
    {
      overview:
        "Building medium-scale applications requires disciplined development, systematic debugging, and testing to ensure correctness before release.",
      keyConcepts: [
        "Debugging: breakpoints, watches, step over/into",
        "Testing levels: unit, integration, system",
        "Defensive programming and input validation",
        "Version control to manage change",
      ],
      definitions: [
        { term: "Unit test", definition: "A test of the smallest testable part (a function/method) in isolation." },
        { term: "Regression", definition: "A previously working feature broken by a new change." },
      ],
      examples: [
        { title: "Breakpoint", body: "Set a breakpoint to pause execution and inspect variable values at that line." },
      ],
      examTips: ["Match the testing level to its scope (unit < integration < system).", "Know that debugging finds the cause; testing finds the symptom."],
      commonMistakes: ["Confusing integration testing with system testing.", "Believing testing proves the absence of all bugs."],
    },
  ],

  // ---------------- Course 2: Data Structures & Algorithms ----------------
  2: [
    {
      overview:
        "Data structures organize data so it can be stored, retrieved, and modified efficiently. The right structure depends on the access pattern (random vs sequential) and operations needed.",
      keyConcepts: [
        "Linear vs non-linear structures",
        "Contiguous (arrays) vs linked storage",
        "Abstract Data Type (ADT) separates interface from implementation",
        "Memory locality affects real performance",
      ],
      definitions: [
        { term: "ADT", definition: "A model defining operations on data independent of implementation (e.g. Stack ADT)." },
        { term: "Random access", definition: "Reaching any element in O(1), as in arrays by index." },
      ],
      examples: [
        { title: "Array vs linked list", body: "Arrays give O(1) indexing but costly insertion; linked lists give O(1) insertion but O(n) access." },
      ],
      examTips: ["Match the structure to the dominant operation.", "Know which structures support random access."],
      commonMistakes: ["Assuming linked lists allow O(1) random access.", "Confusing logical structure with physical storage."],
    },
    {
      overview:
        "Algorithm design and analysis evaluates correctness and efficiency. Common paradigms include divide-and-conquer, greedy, and dynamic programming.",
      keyConcepts: [
        "Divide and conquer (merge sort), greedy (Dijkstra), dynamic programming (knapsack)",
        "Asymptotic analysis with Big-O, Big-Ω, Big-Θ",
        "Best/average/worst case",
        "Recurrence relations describe recursive cost",
      ],
      definitions: [
        { term: "Big-O", definition: "An upper bound on growth rate of running time as input size grows." },
        { term: "Dynamic programming", definition: "Solving overlapping sub-problems once and reusing stored results." },
      ],
      examples: [
        { title: "Merge sort", body: "Divides the array, sorts halves, merges — O(n log n) in all cases." },
      ],
      examTips: ["Big-O describes the worst-case upper bound, not exact time.", "Recognize the paradigm behind classic algorithms."],
      commonMistakes: ["Treating Big-O as exact running time.", "Confusing greedy with dynamic programming."],
    },
    {
      overview:
        "Core data structures — lists, stacks, queues, trees, and graphs — each support specific operations with characteristic complexity.",
      keyConcepts: [
        "Stack: LIFO (push/pop); Queue: FIFO (enqueue/dequeue)",
        "Binary search tree: ordered, O(log n) average search",
        "Graphs: vertices + edges; directed/undirected, weighted",
        "Heaps support priority queues",
      ],
      definitions: [
        { term: "Stack", definition: "LIFO structure; the last element pushed is the first popped." },
        { term: "BST", definition: "Binary tree where left < node < right, enabling ordered search." },
        { term: "Graph", definition: "A set of vertices connected by edges, modeling relationships." },
      ],
      examples: [
        { title: "Stack use", body: "Function call management and expression evaluation use a stack." },
        { title: "Queue use", body: "CPU scheduling and BFS use a queue." },
      ],
      diagram: "Stack (LIFO):  top -> [3][2][1]   push/pop at top\nQueue (FIFO):  front [1][2][3] rear   dequeue front, enqueue rear",
      examTips: ["Map each structure to a real use (stack=recursion, queue=BFS).", "Know average vs worst case for BST operations."],
      commonMistakes: ["Mixing up LIFO (stack) and FIFO (queue).", "Assuming a BST is always balanced (worst case O(n))."],
    },
    {
      overview:
        "Searching and sorting efficiency is measured both empirically (timing) and theoretically (Big-O). Algorithm choice depends on data size, order, and stability needs.",
      keyConcepts: [
        "Linear search O(n); binary search O(log n) on sorted data",
        "Bubble/insertion/selection sort O(n²); merge/heap/quick O(n log n)",
        "Stability of a sort preserves equal-key order",
        "Quicksort worst case O(n²) with bad pivots",
      ],
      definitions: [
        { term: "Binary search", definition: "Repeatedly halving a sorted range to locate a key in O(log n)." },
        { term: "Stable sort", definition: "A sort that keeps the relative order of equal elements." },
      ],
      examples: [
        { title: "Binary search precondition", body: "Binary search requires the array to be sorted first." },
      ],
      examTips: ["Binary search only works on sorted data.", "Memorize the Big-O table for common sorts."],
      commonMistakes: ["Applying binary search to unsorted data.", "Believing quicksort is always O(n log n)."],
    },
    {
      overview:
        "Designing algorithms for real problems means modeling the problem, choosing structures, and balancing time vs space to meet constraints.",
      keyConcepts: [
        "Problem modeling: inputs, outputs, constraints",
        "Time–space trade-offs (caching, precomputation)",
        "Graph algorithms for routing/scheduling",
        "Verifying correctness with invariants",
      ],
      definitions: [
        { term: "Loop invariant", definition: "A condition true before and after each loop iteration, used to prove correctness." },
        { term: "Time–space trade-off", definition: "Using more memory to reduce time, or vice versa." },
      ],
      examples: [
        { title: "Shortest path", body: "Dijkstra's algorithm finds shortest paths from a source in a weighted graph." },
      ],
      examTips: ["Identify the underlying classic problem (shortest path, scheduling).", "State constraints before choosing an approach."],
      commonMistakes: ["Optimizing prematurely before modeling correctly.", "Ignoring edge cases (empty input, single element)."],
    },
  ],

  // ---------------- Course 3: Object-Oriented Programming ----------------
  3: [
    {
      overview:
        "Object-oriented programming models software as collaborating objects that bundle state (fields) and behavior (methods). Classes are blueprints; objects are instances.",
      keyConcepts: [
        "Four pillars: encapsulation, inheritance, polymorphism, abstraction",
        "Class vs object vs instance",
        "Constructors initialize object state",
        "Messages = method calls between objects",
      ],
      definitions: [
        { term: "Class", definition: "A template defining fields and methods for objects." },
        { term: "Object", definition: "A runtime instance of a class with its own state." },
        { term: "Abstraction", definition: "Exposing essential features while hiding details." },
      ],
      examples: [
        { title: "Class/object", body: "class Car {...}; Car myCar = new Car(); myCar is an object of class Car." },
      ],
      examTips: ["Memorize the four OOP pillars and a one-line definition of each.", "Distinguish class (definition) from object (instance)."],
      commonMistakes: ["Using 'class' and 'object' interchangeably.", "Listing only three pillars (forgetting abstraction)."],
    },
    {
      overview:
        "Inheritance enables reuse via 'is-a' relationships; encapsulation hides internal state; polymorphism lets one interface serve many types; exceptions and I/O manage errors and data flow.",
      keyConcepts: [
        "Inheritance: subclass extends superclass",
        "Method overriding (runtime) vs overloading (compile-time) polymorphism",
        "Encapsulation via private fields + getters/setters",
        "try/catch/finally for exception handling",
      ],
      definitions: [
        { term: "Overriding", definition: "Subclass redefines an inherited method with the same signature." },
        { term: "Overloading", definition: "Same method name with different parameter lists in one class." },
        { term: "Polymorphism", definition: "Treating objects of different types through a common interface." },
      ],
      examples: [
        { title: "Override vs overload", body: "Overriding: Dog.speak() replaces Animal.speak(). Overloading: add(int,int) vs add(double,double)." },
      ],
      examTips: ["Overriding = runtime, same signature; overloading = compile-time, different params.", "finally runs whether or not an exception is thrown."],
      commonMistakes: ["Confusing overriding with overloading.", "Thinking 'finally' is skipped after an exception."],
    },
    {
      overview:
        "Event-driven GUI programming builds interfaces from components (buttons, fields) that respond to user events through listeners/handlers, usually in an IDE's visual builder.",
      keyConcepts: [
        "Components/widgets and containers",
        "Event–listener (observer) model",
        "Event loop dispatches events to handlers",
        "Layout managers position components",
      ],
      definitions: [
        { term: "Event listener", definition: "Code registered to run when a specific event (e.g. click) occurs." },
        { term: "Container", definition: "A component that holds and lays out other components." },
      ],
      examples: [
        { title: "Button click", body: "button.addActionListener(e -> handleClick()) runs handleClick on each click." },
      ],
      examTips: ["GUIs are event-driven: control flow is driven by user actions, not top-to-bottom.", "Know the listener/observer pattern."],
      commonMistakes: ["Expecting sequential execution in event-driven code.", "Forgetting to register the listener."],
    },
    {
      overview:
        "OO design produces maintainable software using principles (SOLID), UML modeling, and design patterns to structure responsibilities and relationships.",
      keyConcepts: [
        "UML class diagrams show relationships (association, aggregation, inheritance)",
        "SOLID principles guide good design",
        "Design patterns (Singleton, Factory, Observer)",
        "Composition often preferred over inheritance",
      ],
      definitions: [
        { term: "Design pattern", definition: "A reusable solution to a recurring design problem." },
        { term: "Coupling", definition: "Degree of interdependence between modules; low coupling is desirable." },
        { term: "Cohesion", definition: "How focused a module's responsibilities are; high cohesion is desirable." },
      ],
      examples: [
        { title: "Singleton", body: "Ensures a class has only one instance with a global access point." },
      ],
      examTips: ["Aim for low coupling, high cohesion.", "Recognize patterns by their intent."],
      commonMistakes: ["Overusing inheritance where composition fits.", "Swapping the definitions of coupling and cohesion."],
    },
  ],

  // ---------------- Course 4: Web Programming ----------------
  4: [
    {
      overview:
        "Web applications run over HTTP between clients (browsers) and servers. Understanding request/response, statelessness, and the client–server model underpins all web design.",
      keyConcepts: [
        "HTTP request/response cycle; methods GET, POST, PUT, DELETE",
        "HTTP is stateless; sessions/cookies add state",
        "Status codes: 2xx success, 3xx redirect, 4xx client, 5xx server",
        "URLs, DNS, and the client–server architecture",
      ],
      definitions: [
        { term: "HTTP", definition: "HyperText Transfer Protocol — stateless protocol for web communication." },
        { term: "Cookie", definition: "Small data stored by the browser to maintain state across requests." },
        { term: "Stateless", definition: "Each request is independent; the server keeps no memory of prior requests by default." },
      ],
      examples: [
        { title: "GET vs POST", body: "GET requests data (params in URL); POST submits data in the body (e.g. forms)." },
      ],
      examTips: ["Know status code categories and common codes (200, 301, 404, 500).", "HTTP is stateless — state needs cookies/sessions."],
      commonMistakes: ["Thinking HTTP keeps state on its own.", "Using GET for sensitive data submission."],
    },
    {
      overview:
        "Modern web development uses frameworks, package managers, and build tools to structure code, manage dependencies, and improve productivity and maintainability.",
      keyConcepts: [
        "Frontend frameworks (React, Angular, Vue) and the component model",
        "Backend frameworks and MVC architecture",
        "Package managers and build/bundling tools",
        "Responsive design and progressive enhancement",
      ],
      definitions: [
        { term: "MVC", definition: "Model-View-Controller — separates data, presentation, and control logic." },
        { term: "Framework", definition: "A reusable structure providing conventions and tools for building apps." },
      ],
      examples: [
        { title: "MVC flow", body: "Controller handles a request, updates the Model, selects a View to render." },
      ],
      examTips: ["Know what each MVC layer is responsible for.", "Distinguish a library (you call it) from a framework (it calls you)."],
      commonMistakes: ["Putting business logic in the View.", "Confusing framework with library."],
    },
    {
      overview:
        "HTML structures content, CSS styles it, and JavaScript adds behavior. AJAX enables asynchronous updates, while server-side scripting generates dynamic responses.",
      keyConcepts: [
        "HTML semantics + the DOM tree",
        "CSS selectors, the box model, specificity",
        "JavaScript events and DOM manipulation",
        "AJAX/fetch for asynchronous requests without page reload",
      ],
      definitions: [
        { term: "DOM", definition: "Document Object Model — tree representation of a page the script can modify." },
        { term: "AJAX", definition: "Asynchronous JavaScript and XML — update parts of a page without full reload." },
        { term: "Box model", definition: "content → padding → border → margin layout of every element." },
      ],
      examples: [
        { title: "fetch", body: "fetch('/api/data').then(r=>r.json()) loads data asynchronously and updates the DOM." },
      ],
      examTips: ["AJAX's key benefit is updating without a full page reload.", "Know CSS box-model order and specificity rules."],
      commonMistakes: ["Thinking AJAX requires XML (JSON is typical now).", "Miscounting the CSS box model order."],
    },
    {
      overview:
        "Dynamic pages combine server-side scripting with databases to generate content per request, using SQL queries and safe parameterization.",
      keyConcepts: [
        "Server-side languages (PHP, Node, Python) query databases",
        "Connecting via drivers/ORMs; connection pooling",
        "Parameterized queries prevent SQL injection",
        "Sessions tie database state to a user",
      ],
      definitions: [
        { term: "ORM", definition: "Object-Relational Mapping — maps database rows to objects in code." },
        { term: "SQL injection", definition: "Attack inserting malicious SQL via unsanitized input." },
      ],
      examples: [
        { title: "Parameterized query", body: "SELECT * FROM users WHERE id = ? binds input safely, blocking injection." },
      ],
      examTips: ["Always use parameterized queries to stop SQL injection.", "Know the role of a database driver/connector."],
      commonMistakes: ["Concatenating user input directly into SQL.", "Leaving database connections unclosed."],
    },
  ],

  // ---------------- Course 5: Mobile Application Development ----------------
  5: [
    {
      overview:
        "Mobile computing builds apps for resource-constrained devices. Android apps are built from core components with a defined lifecycle managed by the OS.",
      keyConcepts: [
        "Android components: Activity, Service, BroadcastReceiver, ContentProvider",
        "Activity lifecycle: onCreate → onStart → onResume → onPause → onStop → onDestroy",
        "Intents enable communication between components",
        "Constraints: battery, memory, screen size, connectivity",
      ],
      definitions: [
        { term: "Activity", definition: "A single screen with a user interface in an Android app." },
        { term: "Intent", definition: "A messaging object to request an action from another component." },
        { term: "Manifest", definition: "AndroidManifest.xml declaring components, permissions, and metadata." },
      ],
      examples: [
        { title: "Explicit intent", body: "new Intent(this, DetailActivity.class) launches a specific activity." },
      ],
      examTips: ["Memorize the Activity lifecycle order.", "Know the four core Android components."],
      commonMistakes: ["Mixing up the order of lifecycle callbacks.", "Confusing Service (background) with Activity (UI)."],
    },
    {
      overview:
        "Mobile development uses an IDE (Android Studio) with emulators, SDK tools, and a build system to create, run, and debug apps.",
      keyConcepts: [
        "Android Studio + Gradle build system",
        "Emulators and physical-device debugging (ADB)",
        "Layouts in XML; views and view groups",
        "Resource management (drawables, strings, dimens)",
      ],
      definitions: [
        { term: "Gradle", definition: "The build automation tool that compiles and packages Android apps." },
        { term: "Emulator", definition: "A virtual device for testing apps without physical hardware." },
      ],
      examples: [
        { title: "Layout", body: "A ConstraintLayout positions views relative to each other and the parent." },
      ],
      examTips: ["Know the role of Gradle and the manifest.", "UI layouts are typically defined in XML."],
      commonMistakes: ["Confusing the SDK with the IDE.", "Hard-coding strings instead of using resources."],
    },
    {
      overview:
        "Mobile security addresses risks from networks, storage, and permissions. Apps must protect data in transit and at rest and request least-privilege permissions.",
      keyConcepts: [
        "Permission model (runtime permissions)",
        "Encrypting data at rest and using TLS in transit",
        "Insecure storage and over-broad permissions are top risks",
        "Network threats on public Wi-Fi (MITM)",
      ],
      definitions: [
        { term: "Least privilege", definition: "Granting only the minimum permissions an app needs." },
        { term: "MITM", definition: "Man-in-the-middle attack intercepting communication between two parties." },
      ],
      examples: [
        { title: "TLS", body: "Use HTTPS/TLS so credentials are not sent in plaintext over the network." },
      ],
      examTips: ["Apply least privilege to permissions.", "Encrypt sensitive data both in transit and at rest."],
      commonMistakes: ["Requesting unnecessary permissions.", "Storing secrets in plaintext on the device."],
    },
    {
      overview:
        "Legal and ethical considerations govern data privacy, user consent, intellectual property, and app-store policies for mobile frameworks.",
      keyConcepts: [
        "User consent and transparent data collection",
        "Privacy regulations and data minimization",
        "Licensing of frameworks/libraries",
        "Accessibility and inclusive design",
      ],
      definitions: [
        { term: "Data minimization", definition: "Collecting only the personal data strictly necessary." },
        { term: "Informed consent", definition: "Users agree to data use after being clearly told what happens." },
      ],
      examples: [
        { title: "Consent", body: "Prompt before accessing location and explain why it is needed." },
      ],
      examTips: ["Privacy: collect the minimum data and get clear consent.", "Check library licenses before shipping."],
      commonMistakes: ["Collecting more data than needed.", "Ignoring open-source license obligations."],
    },
  ],

  // ---------------- Course 6: Fundamentals of Databases ----------------
  6: [
    {
      overview:
        "A database stores related data managed by a DBMS. The relational model organizes data into tables with keys; normalization and optimization keep data consistent and queries fast.",
      keyConcepts: [
        "Relational model: tables, rows, columns, keys",
        "DBMS provides ACID transactions, concurrency, recovery",
        "Data models: hierarchical, network, relational, NoSQL",
        "Query optimization uses indexes and statistics",
      ],
      definitions: [
        { term: "Primary key", definition: "A column (or set) uniquely identifying each row in a table." },
        { term: "Foreign key", definition: "A column referencing a primary key in another table to link data." },
        { term: "DBMS", definition: "Database Management System — software to define, store, and query data." },
      ],
      examples: [
        { title: "Keys", body: "Orders.customer_id is a foreign key referencing Customers.id (primary key)." },
      ],
      examTips: ["Primary key = unique + not null; foreign key links tables.", "Know the relational model terminology."],
      commonMistakes: ["Confusing primary and foreign keys.", "Thinking a primary key can be NULL."],
    },
    {
      overview:
        "SQL is the standard language to define and manipulate relational data: DDL creates structure, DML manipulates rows, and queries retrieve and aggregate data.",
      keyConcepts: [
        "DDL (CREATE, ALTER, DROP) vs DML (INSERT, UPDATE, DELETE) vs DQL (SELECT)",
        "Joins combine rows from multiple tables",
        "GROUP BY + aggregate functions (COUNT, SUM, AVG)",
        "WHERE filters rows; HAVING filters groups",
      ],
      definitions: [
        { term: "INNER JOIN", definition: "Returns rows with matching keys in both tables." },
        { term: "Aggregate function", definition: "Computes a single value over a set of rows (e.g. SUM)." },
      ],
      examples: [
        { title: "Join + group", body: "SELECT c.name, COUNT(*) FROM customers c JOIN orders o ON o.customer_id=c.id GROUP BY c.name;" },
      ],
      examTips: ["WHERE filters before grouping; HAVING filters after.", "Know DDL vs DML categories."],
      commonMistakes: ["Using WHERE on aggregates instead of HAVING.", "Forgetting the join condition (Cartesian product)."],
    },
    {
      overview:
        "Database design models requirements into schemas using ER modeling and normalization to reduce redundancy and anomalies.",
      keyConcepts: [
        "ER model: entities, attributes, relationships, cardinality",
        "Normalization 1NF → 2NF → 3NF → BCNF",
        "Functional dependencies drive normalization",
        "Denormalization trades redundancy for read speed",
      ],
      definitions: [
        { term: "Normalization", definition: "Organizing tables to minimize redundancy and avoid update anomalies." },
        { term: "3NF", definition: "No transitive dependency: non-key attributes depend only on the key." },
        { term: "Functional dependency", definition: "X → Y means X uniquely determines Y." },
      ],
      examples: [
        { title: "2NF", body: "Remove partial dependencies on part of a composite key by splitting tables." },
      ],
      examTips: ["Memorize what each normal form removes (1NF repeating groups, 2NF partial, 3NF transitive).", "ER cardinality: 1:1, 1:N, M:N."],
      commonMistakes: ["Confusing 2NF and 3NF.", "Over-normalizing where performance matters."],
    },
    {
      overview:
        "Data security and integrity protect against loss, corruption, and unauthorized access using access control, backups, constraints, and transactions.",
      keyConcepts: [
        "Access control and privileges (GRANT/REVOKE)",
        "Constraints (NOT NULL, UNIQUE, CHECK, FK) enforce integrity",
        "Transactions and ACID guarantee consistency",
        "Backup/recovery and encryption protect data",
      ],
      definitions: [
        { term: "ACID", definition: "Atomicity, Consistency, Isolation, Durability — transaction guarantees." },
        { term: "Transaction", definition: "A unit of work that fully completes or fully rolls back." },
      ],
      examples: [
        { title: "Atomicity", body: "A money transfer debits and credits together or not at all." },
      ],
      examTips: ["Memorize ACID and what each letter guarantees.", "Constraints enforce integrity at the database level."],
      commonMistakes: ["Forgetting one of the ACID properties.", "Relying only on application code for integrity."],
    },
  ],

  // ---------------- Course 7: Operating Systems ----------------
  7: [
    {
      overview:
        "An operating system manages hardware and software resources, providing abstractions (processes, files, memory) and services to programs and users.",
      keyConcepts: [
        "Roles: process, memory, file, device, and security management",
        "Kernel mode vs user mode",
        "System calls are the interface to OS services",
        "Monolithic vs microkernel architectures",
      ],
      definitions: [
        { term: "Kernel", definition: "The core OS component running in privileged mode managing resources." },
        { term: "System call", definition: "A controlled entry point for programs to request OS services." },
      ],
      examples: [
        { title: "Mode switch", body: "A read() call switches from user mode to kernel mode to access the disk." },
      ],
      examTips: ["Know the difference between user and kernel mode.", "List the OS resource-management roles."],
      commonMistakes: ["Thinking user programs access hardware directly.", "Confusing a system call with a normal function call."],
    },
    {
      overview:
        "Deadlock, memory, I/O, storage, and file management are core OS responsibilities. Deadlock arises when processes wait on each other's resources.",
      keyConcepts: [
        "Four deadlock conditions: mutual exclusion, hold-and-wait, no preemption, circular wait",
        "Memory: paging, segmentation, virtual memory",
        "Page faults and replacement policies",
        "File systems and allocation methods",
      ],
      definitions: [
        { term: "Deadlock", definition: "A state where processes each wait for resources the others hold." },
        { term: "Virtual memory", definition: "Using disk to extend apparent RAM via paging." },
        { term: "Thrashing", definition: "Excessive paging that collapses throughput." },
      ],
      examples: [
        { title: "Circular wait", body: "P1 holds A wants B; P2 holds B wants A → deadlock." },
      ],
      examTips: ["Memorize the four Coffman deadlock conditions.", "Breaking any one condition prevents deadlock."],
      commonMistakes: ["Listing only three deadlock conditions.", "Confusing paging with segmentation."],
    },
    {
      overview:
        "OS security and protection control access to resources via authentication, authorization, and isolation between processes and users.",
      keyConcepts: [
        "Protection domains and access control lists",
        "Principle of least privilege",
        "Process isolation and memory protection",
        "Authentication vs authorization",
      ],
      definitions: [
        { term: "Authorization", definition: "Deciding what an authenticated subject is allowed to do." },
        { term: "Access control list", definition: "A list of permissions attached to a resource." },
      ],
      examples: [
        { title: "Isolation", body: "Memory protection stops one process from reading another's address space." },
      ],
      examTips: ["Authentication = who you are; authorization = what you may do.", "Least privilege limits damage from compromise."],
      commonMistakes: ["Swapping authentication and authorization.", "Assuming root/admin should run everything."],
    },
    {
      overview:
        "Process management schedules execution and coordinates concurrent processes/threads, using synchronization to avoid race conditions.",
      keyConcepts: [
        "Process states: new, ready, running, waiting, terminated",
        "Threads share memory within a process",
        "Race conditions and critical sections",
        "Synchronization: mutex, semaphore, monitor",
      ],
      definitions: [
        { term: "Race condition", definition: "Outcome depends on the timing of concurrent accesses to shared data." },
        { term: "Semaphore", definition: "An integer signaling primitive controlling access to resources." },
        { term: "Critical section", definition: "Code that accesses shared data and must run exclusively." },
      ],
      examples: [
        { title: "Mutex", body: "Lock before, unlock after the critical section to ensure mutual exclusion." },
      ],
      examTips: ["Know the process state diagram.", "Semaphore vs mutex: mutex is binary ownership; semaphore counts."],
      commonMistakes: ["Confusing process and thread (threads share memory).", "Forgetting to release a lock → deadlock."],
    },
    {
      overview:
        "OS core functions rely on algorithms — CPU scheduling, page replacement, disk scheduling — each with trade-offs measured by metrics like turnaround and throughput.",
      keyConcepts: [
        "CPU scheduling: FCFS, SJF, Round Robin, Priority",
        "Page replacement: FIFO, LRU, Optimal",
        "Disk scheduling: FCFS, SSTF, SCAN",
        "Metrics: waiting time, turnaround, throughput, response",
      ],
      definitions: [
        { term: "Round Robin", definition: "Preemptive scheduling giving each process a fixed time quantum." },
        { term: "LRU", definition: "Least Recently Used page-replacement policy." },
      ],
      examples: [
        { title: "SJF", body: "Shortest Job First minimizes average waiting time but can starve long jobs." },
      ],
      examTips: ["Match algorithm to metric (SJF minimizes avg wait).", "Round Robin needs a time quantum and is preemptive."],
      commonMistakes: ["Calling SJF non-preemptive only (it has both forms).", "Confusing FIFO page replacement with FCFS scheduling."],
    },
  ],

  // ---------------- Course 8: Software Engineering ----------------
  8: [
    {
      overview:
        "Software engineering applies systematic, disciplined methods to develop quality software within cost and schedule, addressing the whole life cycle.",
      keyConcepts: [
        "SDLC phases: requirements, design, implementation, testing, deployment, maintenance",
        "Functional vs non-functional requirements",
        "Quality attributes: reliability, maintainability, usability",
        "Verification vs validation",
      ],
      definitions: [
        { term: "Verification", definition: "Are we building the product right? (meets specification)." },
        { term: "Validation", definition: "Are we building the right product? (meets user needs)." },
        { term: "Non-functional requirement", definition: "A constraint on how the system performs (e.g. performance, security)." },
      ],
      examples: [
        { title: "Requirement types", body: "'Login must work' is functional; 'respond within 2s' is non-functional." },
      ],
      examTips: ["Verification vs validation is a frequent exam distinction.", "Classify requirements as functional vs non-functional."],
      commonMistakes: ["Swapping verification and validation.", "Treating performance as a functional requirement."],
    },
    {
      overview:
        "Software processes structure development. Models range from plan-driven (waterfall) to iterative and agile, each fitting different risk and change profiles.",
      keyConcepts: [
        "Waterfall: sequential, heavy upfront planning",
        "Iterative/incremental and spiral (risk-driven)",
        "Agile (Scrum, XP): iterative, change-friendly",
        "Choosing a model by requirements stability",
      ],
      definitions: [
        { term: "Waterfall", definition: "A linear, phase-by-phase process with little backtracking." },
        { term: "Agile", definition: "Iterative development emphasizing collaboration and responding to change." },
        { term: "Spiral model", definition: "Risk-driven iterative model combining prototyping and waterfall." },
      ],
      examples: [
        { title: "Scrum", body: "Work in sprints with a backlog, daily standups, and a review/retrospective." },
      ],
      examTips: ["Match the model to requirement volatility (agile for changing needs).", "Spiral is the risk-driven model."],
      commonMistakes: ["Thinking waterfall handles changing requirements well.", "Confusing incremental with iterative."],
    },
    {
      overview:
        "Software systems rely on data communication and networks; engineers must understand basic networking and system security to design and configure small networks.",
      keyConcepts: [
        "Client–server vs peer-to-peer",
        "Basic LAN setup and configuration",
        "Security in the SDLC (secure design)",
        "Data communication fundamentals",
      ],
      definitions: [
        { term: "LAN", definition: "Local Area Network connecting devices in a limited area." },
        { term: "Secure by design", definition: "Building security in from the start, not bolting it on later." },
      ],
      examples: [
        { title: "Small network", body: "A switch connects office PCs; a router provides internet access and NAT." },
      ],
      examTips: ["Security must be designed in, not added at the end.", "Know basic LAN components."],
      commonMistakes: ["Treating security as a final-step add-on.", "Confusing a switch with a router."],
    },
    {
      overview:
        "Professional practice requires ethics, accountability, and adherence to norms and standards (e.g. ACM/IEEE codes) throughout software work.",
      keyConcepts: [
        "Professional codes of ethics (ACM/IEEE)",
        "Public interest, honesty, and confidentiality",
        "Intellectual property and licensing",
        "Accountability for quality and safety",
      ],
      definitions: [
        { term: "Code of ethics", definition: "Principles guiding professional conduct and decision-making." },
        { term: "Intellectual property", definition: "Legal rights over creations like software and designs." },
      ],
      examples: [
        { title: "Public interest", body: "An engineer reports a safety defect even under schedule pressure." },
      ],
      examTips: ["The public interest takes priority in professional codes.", "Respect IP and confidentiality."],
      commonMistakes: ["Prioritizing employer convenience over public safety.", "Ignoring licensing terms."],
    },
  ],

  // ---------------- Course 9: Software Project Management ----------------
  9: [
    {
      overview:
        "Software project management plans, organizes, and controls projects to deliver on scope, schedule, cost, and quality, managing people and risk.",
      keyConcepts: [
        "Project constraints triangle: scope, time, cost (quality at center)",
        "Stakeholder and team management",
        "Estimation and planning",
        "Monitoring and control",
      ],
      definitions: [
        { term: "Scope", definition: "The defined boundaries of what the project will deliver." },
        { term: "Stakeholder", definition: "Anyone affected by or able to affect the project." },
      ],
      examples: [
        { title: "Triple constraint", body: "Adding scope without more time/cost usually lowers quality." },
      ],
      examTips: ["Know the scope-time-cost triangle.", "Identify stakeholders early."],
      commonMistakes: ["Ignoring the trade-offs in the triple constraint.", "Forgetting non-obvious stakeholders."],
    },
    {
      overview:
        "Planning decomposes work (WBS), schedules tasks with dependencies, and estimates cost using techniques like critical path and effort estimation.",
      keyConcepts: [
        "WBS breaks deliverables into manageable tasks",
        "Gantt charts visualize schedule",
        "Critical path determines minimum duration",
        "Estimation: expert judgment, COCOMO, function points",
      ],
      definitions: [
        { term: "WBS", definition: "Work Breakdown Structure — hierarchical decomposition of project work." },
        { term: "Critical path", definition: "Longest dependent task sequence setting the shortest project duration." },
      ],
      examples: [
        { title: "Critical path", body: "Tasks with zero slack lie on the critical path; delaying them delays the project." },
      ],
      examTips: ["The critical path has zero slack and sets minimum duration.", "WBS is deliverable-oriented decomposition."],
      commonMistakes: ["Thinking the critical path is the shortest path.", "Confusing a Gantt chart with a network diagram."],
    },
    {
      overview:
        "Managers use tools and techniques — tracking software, earned value, communication plans — and leadership skills to keep projects on course.",
      keyConcepts: [
        "Earned Value Management (EVM) for progress vs plan",
        "Tracking tools (Jira, MS Project)",
        "Communication and team leadership",
        "Change control",
      ],
      definitions: [
        { term: "Earned Value", definition: "Budgeted cost of work actually performed, used to measure progress." },
        { term: "Change control", definition: "A formal process to evaluate and approve changes to scope." },
      ],
      examples: [
        { title: "EVM", body: "SPI = EV/PV < 1 indicates the project is behind schedule." },
      ],
      examTips: ["EVM indices: SPI<1 behind schedule, CPI<1 over budget.", "Use formal change control to avoid scope creep."],
      commonMistakes: ["Allowing uncontrolled scope creep.", "Misreading SPI/CPI direction."],
    },
    {
      overview:
        "Project documentation captures plans for management, risk, and quality — turning intentions into trackable, accountable artifacts.",
      keyConcepts: [
        "Project management plan and quality plan",
        "Risk management: identify, analyze, respond, monitor",
        "Risk responses: avoid, transfer, mitigate, accept",
        "Quality assurance vs quality control",
      ],
      definitions: [
        { term: "Risk", definition: "An uncertain event that may affect project objectives." },
        { term: "Quality assurance", definition: "Process-focused activities preventing defects." },
        { term: "Quality control", definition: "Product-focused activities detecting defects." },
      ],
      examples: [
        { title: "Risk response", body: "Buying insurance is transfer; adding tests is mitigation." },
      ],
      examTips: ["Memorize the four risk response strategies.", "QA prevents (process); QC detects (product)."],
      commonMistakes: ["Confusing QA with QC.", "Treating risk management as one-time, not continuous."],
    },
  ],

  // ---------------- Course 10: Fundamentals of Networking ----------------
  10: [
    {
      overview:
        "Computer networks connect devices to share data and resources. Core ideas include topologies, transmission media, protocols, and addressing.",
      keyConcepts: [
        "Topologies: bus, star, ring, mesh",
        "LAN, MAN, WAN scopes",
        "Protocols and standards (IEEE 802)",
        "Bandwidth, latency, throughput",
      ],
      definitions: [
        { term: "Protocol", definition: "Agreed rules governing data exchange between devices." },
        { term: "Bandwidth", definition: "Maximum data rate of a link, often in bits per second." },
        { term: "Topology", definition: "The physical/logical arrangement of network nodes." },
      ],
      examples: [
        { title: "Star topology", body: "All nodes connect to a central switch; a node failure doesn't down the network." },
      ],
      examTips: ["Know advantages/disadvantages of each topology.", "Distinguish bandwidth (capacity) from throughput (actual)."],
      commonMistakes: ["Confusing bandwidth with latency.", "Mixing up bus and star failure behavior."],
    },
    {
      overview:
        "Layered models (OSI 7 layers, TCP/IP 4 layers) structure networking so each layer has a defined responsibility and interface.",
      keyConcepts: [
        "OSI layers: Physical, Data Link, Network, Transport, Session, Presentation, Application",
        "TCP/IP model maps to OSI",
        "Encapsulation adds headers down the stack",
        "Key protocols per layer (IP=Network, TCP/UDP=Transport)",
      ],
      definitions: [
        { term: "Encapsulation", definition: "Wrapping data with layer headers as it moves down the stack." },
        { term: "Router", definition: "A Network-layer device forwarding packets between networks using IP." },
        { term: "Switch", definition: "A Data-Link-layer device forwarding frames within a LAN using MAC addresses." },
      ],
      examples: [
        { title: "Layer roles", body: "TCP (Transport) ensures reliable delivery; IP (Network) handles addressing/routing." },
      ],
      diagram: "OSI:  7 Application | 6 Presentation | 5 Session | 4 Transport | 3 Network | 2 Data Link | 1 Physical",
      examTips: ["Memorize OSI layer order and a device/protocol per layer.", "TCP is reliable/connection-oriented; UDP is fast/connectionless."],
      commonMistakes: ["Placing a router at the wrong layer.", "Mixing up TCP and UDP characteristics."],
    },
    {
      overview:
        "Designing network services matches requirements (capacity, reliability, security) to architecture: addressing, subnetting, and service selection.",
      keyConcepts: [
        "IP addressing and subnetting (CIDR)",
        "DHCP, DNS, NAT services",
        "Redundancy and reliability planning",
        "Matching services to requirements",
      ],
      definitions: [
        { term: "Subnetting", definition: "Dividing an IP network into smaller subnetworks." },
        { term: "DNS", definition: "Domain Name System mapping names to IP addresses." },
        { term: "NAT", definition: "Network Address Translation mapping private to public IPs." },
      ],
      examples: [
        { title: "Subnet", body: "A /24 network has 256 addresses, 254 usable for hosts." },
      ],
      examTips: ["Know what DNS, DHCP, and NAT each do.", "Be able to compute hosts per subnet from the prefix."],
      commonMistakes: ["Confusing DNS (names) with DHCP (address assignment).", "Off-by-two errors in usable host counts."],
    },
  ],

  // ---------------- Course 11: Information Security ----------------
  11: [
    {
      overview:
        "Information security protects the confidentiality, integrity, and availability (CIA triad) of data against threats such as malware and attacks.",
      keyConcepts: [
        "CIA triad: confidentiality, integrity, availability",
        "Malware types: virus, worm, trojan, ransomware",
        "Threat, vulnerability, and risk relationships",
        "Mitigation: patching, least privilege, defense in depth",
      ],
      definitions: [
        { term: "Vulnerability", definition: "A weakness that a threat can exploit." },
        { term: "Worm", definition: "Self-replicating malware that spreads without user action." },
        { term: "Trojan", definition: "Malware disguised as legitimate software." },
      ],
      examples: [
        { title: "Worm vs virus", body: "A worm spreads itself across networks; a virus needs a host file and user action." },
      ],
      examTips: ["Memorize the CIA triad.", "Distinguish virus, worm, and trojan precisely."],
      commonMistakes: ["Confusing threat, vulnerability, and risk.", "Calling every malware a 'virus'."],
    },
    {
      overview:
        "Cryptography secures data using encryption; cryptanalysis studies breaking it. Symmetric and asymmetric schemes serve different needs.",
      keyConcepts: [
        "Symmetric (AES) vs asymmetric (RSA) encryption",
        "Public/private key pairs",
        "Hash functions for integrity (not encryption)",
        "Digital signatures and certificates",
      ],
      definitions: [
        { term: "Symmetric encryption", definition: "One shared secret key for encrypt and decrypt." },
        { term: "Asymmetric encryption", definition: "A public key encrypts; the matching private key decrypts." },
        { term: "Hash function", definition: "A one-way function producing a fixed-size digest of data." },
      ],
      examples: [
        { title: "RSA use", body: "Encrypt with the recipient's public key; only their private key decrypts." },
      ],
      examTips: ["Symmetric = same key (fast); asymmetric = key pair (key exchange).", "Hashing is one-way and not encryption."],
      commonMistakes: ["Calling hashing 'encryption'.", "Swapping which key encrypts vs decrypts in asymmetric crypto."],
    },
    {
      overview:
        "Authentication verifies identity; access control enforces what authenticated subjects may do, using factors, models, and policies.",
      keyConcepts: [
        "Authentication factors: something you know/have/are",
        "Multi-factor authentication (MFA)",
        "Access control models: DAC, MAC, RBAC",
        "Principle of least privilege",
      ],
      definitions: [
        { term: "MFA", definition: "Using two or more independent factors to authenticate." },
        { term: "RBAC", definition: "Role-Based Access Control granting permissions via roles." },
      ],
      examples: [
        { title: "MFA", body: "Password (know) + phone code (have) is two-factor authentication." },
      ],
      examTips: ["Know the three authentication factor categories.", "RBAC assigns permissions to roles, not individuals."],
      commonMistakes: ["Counting two passwords as multi-factor.", "Confusing authentication with authorization."],
    },
    {
      overview:
        "Firewalls and intrusion detection systems defend networks by filtering traffic and detecting malicious activity at the perimeter and inside.",
      keyConcepts: [
        "Firewall types: packet-filter, stateful, application/proxy",
        "IDS (detect) vs IPS (detect and prevent)",
        "Signature-based vs anomaly-based detection",
        "Defense in depth",
      ],
      definitions: [
        { term: "Stateful firewall", definition: "Tracks connection state to allow/deny packets in context." },
        { term: "IDS", definition: "Intrusion Detection System that alerts on suspicious activity." },
        { term: "IPS", definition: "Intrusion Prevention System that can block detected threats." },
      ],
      examples: [
        { title: "IDS vs IPS", body: "An IDS raises an alert; an IPS drops the malicious packets in-line." },
      ],
      examTips: ["IDS detects/alerts; IPS prevents/blocks.", "Stateful firewalls track connections, packet filters don't."],
      commonMistakes: ["Confusing IDS with IPS.", "Thinking a packet filter understands connection state."],
    },
  ],

  // ---------------- Course 12: Artificial Intelligence ----------------
  12: [
    {
      overview:
        "AI builds agents that perceive and act rationally. Many problems are framed as search over states with a defined start, actions, goal test, and cost.",
      keyConcepts: [
        "Search problem: states, actions, transition, goal test, path cost",
        "Rational agent maximizes expected performance",
        "Environment types: observable, deterministic, static",
        "Problem formulation precedes solving",
      ],
      definitions: [
        { term: "State space", definition: "All states reachable from the initial state via actions." },
        { term: "Rational agent", definition: "An agent that acts to maximize its expected performance measure." },
        { term: "Goal test", definition: "A check determining whether a state is a goal." },
      ],
      examples: [
        { title: "8-puzzle", body: "States are tile arrangements; actions slide a tile; goal is the ordered configuration." },
      ],
      examTips: ["Be able to list the components of a search problem.", "Know agent/environment property terms."],
      commonMistakes: ["Forgetting the cost or goal test in problem formulation.", "Confusing rationality with omniscience."],
    },
    {
      overview:
        "Search algorithms explore the state space. Uninformed methods (BFS, DFS, UCS) ignore goal distance; informed methods (Greedy, A*) use heuristics.",
      keyConcepts: [
        "BFS complete & optimal (unit cost); DFS low memory, not optimal",
        "UCS expands lowest path cost",
        "A* uses f(n)=g(n)+h(n) with an admissible heuristic",
        "Admissible heuristics never overestimate",
      ],
      definitions: [
        { term: "Heuristic", definition: "An estimate of cost from a node to the goal." },
        { term: "Admissible heuristic", definition: "One that never overestimates the true cost, ensuring A* optimality." },
        { term: "A*", definition: "Best-first search minimizing g(n)+h(n)." },
      ],
      examples: [
        { title: "A* optimality", body: "With an admissible (and consistent) heuristic, A* returns an optimal path." },
      ],
      examTips: ["A* is optimal when the heuristic is admissible/consistent.", "Compare BFS/DFS on completeness, optimality, memory."],
      commonMistakes: ["Thinking DFS is optimal.", "Using a heuristic that overestimates and expecting optimal A*."],
    },
    {
      overview:
        "Analyzing search means reasoning about time/space complexity and branching, while probabilistic models like Bayes nets capture conditional independence.",
      keyConcepts: [
        "Complexity in terms of branching factor b and depth d",
        "Trade-offs: completeness, optimality, time, space",
        "Bayesian networks encode conditional independence",
        "Inference computes posterior probabilities",
      ],
      definitions: [
        { term: "Branching factor", definition: "Average number of successors per node." },
        { term: "Bayesian network", definition: "A DAG encoding variables and their conditional dependencies." },
        { term: "Conditional independence", definition: "X is independent of Y given Z if knowing Z makes Y irrelevant to X." },
      ],
      examples: [
        { title: "BFS cost", body: "BFS time and space are O(b^d), which limits its scalability." },
      ],
      examTips: ["Express search cost with b and d.", "Bayes nets compactly represent conditional independence."],
      commonMistakes: ["Ignoring BFS's exponential memory.", "Reading a Bayes net edge as plain correlation."],
    },
  ],

  // ---------------- Course 13: Machine Learning ----------------
  13: [
    {
      overview:
        "Machine learning builds models that learn patterns from data. Paradigms include supervised, unsupervised, and reinforcement learning.",
      keyConcepts: [
        "Supervised (labeled), unsupervised (unlabeled), reinforcement (reward)",
        "Train/validation/test split",
        "Bias–variance trade-off; over/underfitting",
        "Generalization is the goal",
      ],
      definitions: [
        { term: "Supervised learning", definition: "Learning a mapping from inputs to known output labels." },
        { term: "Overfitting", definition: "Modeling noise in training data, hurting generalization." },
        { term: "Bias–variance trade-off", definition: "Balancing underfitting (high bias) and overfitting (high variance)." },
      ],
      examples: [
        { title: "Overfitting sign", body: "High training accuracy but low test accuracy indicates overfitting." },
      ],
      examTips: ["Classify tasks by paradigm (labeled→supervised).", "High variance = overfitting; high bias = underfitting."],
      commonMistakes: ["Calling clustering supervised.", "Evaluating on the training set."],
    },
    {
      overview:
        "Formulating an ML problem means choosing the task type, defining inputs/outputs and features, and selecting an evaluation metric aligned to the goal.",
      keyConcepts: [
        "Classification vs regression vs clustering",
        "Feature selection and engineering",
        "Metrics: accuracy, precision, recall, F1, RMSE",
        "Data quality and labeling",
      ],
      definitions: [
        { term: "Classification", definition: "Predicting a discrete class label." },
        { term: "Regression", definition: "Predicting a continuous numeric value." },
        { term: "Precision/Recall", definition: "Precision = TP/(TP+FP); Recall = TP/(TP+FN)." },
      ],
      examples: [
        { title: "Metric choice", body: "For imbalanced data, prefer precision/recall/F1 over plain accuracy." },
      ],
      examTips: ["Pick the metric that matches the goal (recall when misses are costly).", "Discrete output → classification; numeric → regression."],
      commonMistakes: ["Using accuracy on imbalanced data.", "Confusing precision with recall."],
    },
    {
      overview:
        "Applying ML algorithms selects and trains a model appropriate to the task, tuning hyperparameters and validating performance.",
      keyConcepts: [
        "Algorithms: linear/logistic regression, decision trees, SVM, k-NN, neural nets",
        "Hyperparameter tuning and cross-validation",
        "Regularization to control overfitting",
        "Ensembles (bagging, boosting, random forests)",
      ],
      definitions: [
        { term: "Cross-validation", definition: "Rotating train/validation splits to estimate generalization." },
        { term: "Regularization", definition: "Penalizing complexity (L1/L2) to reduce overfitting." },
      ],
      examples: [
        { title: "k-NN", body: "Classifies a point by majority vote of its k nearest neighbors." },
      ],
      examTips: ["Use cross-validation to estimate real performance.", "Regularization combats overfitting."],
      commonMistakes: ["Tuning hyperparameters on the test set.", "Ignoring feature scaling for distance-based methods."],
    },
    {
      overview:
        "Deploying ML applications turns trained models into reliable, maintainable products with monitoring, retraining, and ethical safeguards.",
      keyConcepts: [
        "Model serving and inference pipelines",
        "Monitoring for data/model drift",
        "Retraining and versioning",
        "Fairness, bias, and explainability",
      ],
      definitions: [
        { term: "Model drift", definition: "Degraded performance as live data diverges from training data." },
        { term: "Explainability", definition: "Ability to interpret why a model made a prediction." },
      ],
      examples: [
        { title: "Drift", body: "A spam filter's accuracy drops as spammers change tactics → retrain." },
      ],
      examTips: ["Monitor for drift and plan retraining.", "Address bias and explainability before deployment."],
      commonMistakes: ["Assuming a deployed model stays accurate forever.", "Ignoring fairness/bias in predictions."],
    },
  ],
};
