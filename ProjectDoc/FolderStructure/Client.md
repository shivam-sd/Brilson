# Client Folder Structure


client
│
├── assets
│   └── Contains all static assets such as images, icons, fonts, and other media files.
│
├── public
│   └── Contains public static files served directly by the React application.
│
├── src
│   │
│   ├── Admin
│   │   ├── Components
│   │   │   └── Reusable UI components used across the Admin Dashboard.
│   │   │
│   │   ├── Components.jsx
│   │   │   └── Handles bulk card generation modules such as NFC Cards,
│   │   │       Parking Tags, Google Reviews, and related operations.
│   │   │
│   │   ├── LandingPage
│   │   │   └── Admin interface for creating and updating dynamic homepage
│   │   │       content (Hero Section, Features, etc.).
│   │   │
│   │   ├── ManageNFCCard
│   │   │   └── Contains all NFC Card management screens including
│   │   │       Create, Update, Delete, Download, QR Code generation,
│   │   │       Bulk Download, and Activation.
│   │   │
│   │   ├── ManageParkingTag
│   │   │   └── Contains Parking Tag management modules including
│   │   │       Create, Update, Delete, Activation, and Downloads.
│   │   │
│   │   ├── ProductsPage
│   │   │   └── Product Management System including Product Details,
│   │   │       Categories, Images, GST, Offers, Variants,
│   │   │       Create, Update, and Delete functionality.
│   │   │
│   │   └── Other Admin Files
│   │       └── Remaining files follow proper naming conventions and
│   │           are organized based on their respective functionality.
│   │
│   ├── Components
│   │   └── Reusable components shared across the website such as
│   │       Header, Footer, Checkout, BrilsonLoader, Buttons, Modals,
│   │       Cards, etc.
│   │
│   ├── lottie
│   │   └── Stores all Lottie animation JSON files used throughout
│   │       the application.
│   │
│   ├── Pages
│   │   │
│   │   ├── HomePage
│   │   │   └── Contains all customer-facing landing page sections.
│   │   │
│   │   ├── ContextAPI
│   │   │   └── Global state management using Redux Toolkit
│   │   │       (Cart, User, etc.).
│   │   │
│   │   ├── hooks
│   │   │   └── Custom React Hooks such as useCart.
│   │   │
│   │   ├── ForgotPassword
│   │   │   └── Forgot Password, Reset Password,
│   │   │       and OTP Verification screens.
│   │   │
│   │   ├── GoogleReviews
│   │   │   └── Google Review activation pages,
│   │   │       review popup, and related UI.
│   │   │
│   │   ├── ParkingTag
│   │   │   └── Parking Tag activation,
│   │   │       popup, and user-facing pages.
│   │   │
│   │   ├── ProfileComp
│   │   │   └── Business Owner Profile module.
│   │   │
│   │   │       Includes:
│   │   │       • Profile Sections
│   │   │       • Contact Information
│   │   │       • Business Details
│   │   │       • Social Links
│   │   │       • Save Contact (CSV / VCF)
│   │   │       • Products & Services
│   │   │       • QR Code Sharing
│   │   │
│   │   ├── EditProfileComp
│   │   │   └── Profile editing module including:
│   │   │       • Image Cropper
│   │   │       • Image Compression
│   │   │       • Product Management
│   │   │       • Service Management
│   │   │       • Business Information
│   │   │       • Other profile update features.
│   │   │
│   │   └── Other Pages
│   │       └── Remaining folders follow proper naming conventions
│   │           and contain feature-specific pages.
│   │
│   ├── utils
│   │   └── Utility functions, helper methods,
│   │       middleware-like logic, constants,
│   │       validations, and common reusable functions.
│   │
│   └── Remaining folders
│       └── Follow proper project naming conventions.
│
|
|----- env
|       |--  Environment variables configuration.
|
|
└── package.json
    └── Project dependencies and scripts.
