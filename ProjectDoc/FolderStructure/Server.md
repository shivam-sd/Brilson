# Server Folder Structure


server
│
├── config
│   ├── razorpay.js
│   │   └── Razorpay payment gateway configuration.
│   │
│   ├── runTimeConfigLoader.js
│   │   └── Runtime configuration loader for dynamic settings.
│   │
│   └── whatsapp.js
│       └── WhatsApp integration configuration.
│
├── DB
│   └── DB.Connection.js
│       └── Database connection configuration (MongoDB).
│
├── models
│   │
│   ├── LandingPage
│   │   ├── Footer.model.js
│   │   │   └── Footer section schema.
│   │   │
│   │   ├── HomepageContent.model.js
│   │   │   └── Homepage dynamic content schema.
│   │   │
│   │   ├── HowToUse.model.js
│   │   │   └── How To Use section schema.
│   │   │
│   │   ├── PowerFullFeature.js
│   │   │   └── Powerful Features section schema.
│   │   │
│   │   ├── Testimonials.js
│   │   │   └── Testimonials section schema.
│   │   │
│   │   └── TransformNetwork.model.js
│   │       └── Transform Network section schema.
│   │
│   ├── ProfileModel
│   │   ├── Location&Reviews.model.js
│   │   │   └── Location and Reviews schema.
│   │   │
│   │   ├── PaymentDetails.Model.js
│   │   │   └── Payment details schema.
│   │   │
│   │   ├── ProfileCover.model.js
│   │   │   └── Profile cover photo schema.
│   │   │
│   │   ├── ProfileGalleryModel.js
│   │   │   └── Profile gallery images schema.
│   │   │
│   │   ├── ProfileLogo.Model.js
│   │   │   └── Profile logo schema.
│   │   │
│   │   ├── ProfilePortfolio.Model.js
│   │   │   └── Profile portfolio items schema.
│   │   │
│   │   ├── ProfileProduct.Model.js
│   │   │   └── Profile products schema.
│   │   │
│   │   ├── ProfileResume.js
│   │   │   └── Profile resume/CV schema.
│   │   │
│   │   └── ProfileServices.Model.js
│   │       └── Profile services schema.
│   │
│   ├── FooterSection
│   │   ├── AboutPageModel.model.js
│   │   │   └── About page schema.
│   │   │
│   │   ├── PrivacyPolicy.model.js
│   │   │   └── Privacy policy schema.
│   │   │
│   │   ├── RefundPolicy.Model.js
│   │   │   └── Refund policy schema.
│   │   │
│   │   └── Terms&Conditions.model.js
│   │       └── Terms & Conditions schema.
│   │
│   ├── AddGoogleReviews.model.js
│   │   └── Google Reviews activation schema.
│   │
│   ├── AddParkingTag.model.js
│   │   └── Parking Tag schema.
│   │
│   ├── Admin.model.js
│   │   └── Admin user schema.
│   │
│   ├── AdminPaymentGetway.model.js
│   │   └── Admin payment gateway settings schema.
│   │
│   ├── Badges.model.js
│   │   └── Badges/Achievements schema.
│   │
│   ├── CardProfile.js
│   │   └── NFC Card profile schema.
│   │
│   ├── Cart.model.js
│   │   └── Shopping cart schema.
│   │
│   ├── Cashfree.model.js
│   │   └── Cashfree payment gateway schema.
│   │
│   ├── Category.model.js
│   │   └── Product categories schema.
│   │
│   ├── Config.js
│   │   └── Application configuration schema.
│   │
│   ├── InvoiceAddress.model.js
│   │   └── Invoice address schema.
│   │
│   ├── Order.model.js
│   │   └── Orders schema.
│   │
│   ├── Payment.model.js
│   │   └── Payment transactions schema.
│   │
│   ├── PayU.model.js
│   │   └── PayU payment gateway schema.
│   │
│   ├── Product.model.js
│   │   └── Products schema with variants and offers.
│   │
│   ├── ServiceLayout.model.js
│   │   └── Service layout/section schema.
│   │
│   └── User.model.js
│       └── User schema (Business Owners, Customers).
│
├── controller
│   │
│   ├── AdminDashboardAPI
│   │   └── AdminDashboardAPI.controller.js
│   │       └── Admin dashboard analytics and statistics.
│   │
│   ├── FooterSection
│   │   ├── AboutPage.controller.js
│   │   │   └── About page CRUD operations.
│   │   │
│   │   ├── PrivacyPolicy.controller.js
│   │   │   └── Privacy policy management.
│   │   │
│   │   ├── RefundPolicy.controller.js
│   │   │   └── Refund policy management.
│   │   │
│   │   └── Terms&conditions.controller.js
│   │       └── Terms & Conditions management.
│   │
│   ├── GoogleReviews
│   │   ├── ActivateGoogleReview.controller.js
│   │   │   └── Activate Google Review for users.
│   │   │
│   │   ├── AdminBulkReviewCardCreate.controller.js
│   │   │   └── Admin bulk review card creation.
│   │   │
│   │   ├── CheckGoogleReviewStatus.controller.js
│   │   │   └── Check Google Review activation status.
│   │   │
│   │   ├── EditGoogleReviewCardProfile.controller.js
│   │   │   └── Edit Google Review card profile.
│   │   │
│   │   ├── getAllGoogleReviewProfile.controller.js
│   │   │   └── Get all Google Review profiles.
│   │   │
│   │   ├── getAllUsersWithTheirReviews.js
│   │   │   └── Get all users with their reviews.
│   │   │
│   │   ├── GetSimpleGoogleReviewProfile.js
│   │   │   └── Get simple Google Review profile.
│   │   │
│   │   └── MarkDownloadQRGoogleReview.js
│   │       └── Mark QR code download for Google Review.
│   │
│   ├── LandingPage
│   │   ├── Footer.controller.js
│   │   │   └── Footer section management.
│   │   │
│   │   ├── HomepageContent.controller.js
│   │   │   └── Homepage dynamic content management.
│   │   │
│   │   ├── HowToUseInfo.controller.js
│   │   │   └── How To Use section management.
│   │   │
│   │   ├── PowerfulFeatures.controller.js
│   │   │   └── Powerful Features section management.
│   │   │
│   │   ├── Testimonials.controller.js
│   │   │   └── Testimonials management.
│   │   │
│   │   └── TransformNetwork.controller.js
│   │       └── Transform Network section management.
│   │
│   ├── ParkingTag
│   │   ├── ActivateParkingTag.controller.js
│   │   │   └── Activate Parking Tag for users.
│   │   │
│   │   ├── AdminBulkTagCreate.controller.js
│   │   │   └── Admin bulk Parking Tag creation.
│   │   │
│   │   ├── CheckParkingTagStatus.controller.js
│   │   │   └── Check Parking Tag activation status.
│   │   │
│   │   ├── ClaimParkingTagProfile.controller.js
│   │   │   └── Claim Parking Tag profile.
│   │   │
│   │   ├── GetTagProfile.controller.js
│   │   │   └── Get Parking Tag profile.
│   │   │
│   │   ├── GetUserWithTheirParkingTag.controller.js
│   │   │   └── Get users with their Parking Tags.
│   │   │
│   │   └── MarkDownloadedTag.controller.js
│   │       └── Mark Parking Tag as downloaded.
│   │
│   ├── ProfileController
│   │   ├── Location&Reviews.controller.js
│   │   │   └── Location and reviews management.
│   │   │
│   │   ├── PaymentDetails.controller.js
│   │   │   └── Payment details management.
│   │   │
│   │   ├── ProfileCoverPhoto.controller.js
│   │   │   └── Profile cover photo management.
│   │   │
│   │   ├── ProfileGallery.controller.js
│   │   │   └── Profile gallery management.
│   │   │
│   │   ├── ProfileLogo.controller.js
│   │   │   └── Profile logo management.
│   │   │
│   │   ├── ProfilePortfolio.controller.js
│   │   │   └── Profile portfolio management.
│   │   │
│   │   ├── ProfileProducts.controller.js
│   │   │   └── Profile products management.
│   │   │
│   │   ├── ProfileServices.controller.js
│   │   │   └── Profile services management.
│   │   │
│   │   ├── ResumeProfileController.js
│   │   │   └── Resume profile management.
│   │   │
│   │   └── SharePublicProfile.controller.js
│   │       └── Share public profile functionality.
│   │
│   ├── ActivateCardAPI.controller.js
│   │   └── Activate NFC Card API.
│   │
│   ├── AddToCart.controller.js
│   │   └── Add products to cart.
│   │
│   ├── AdminController.js
│   │   └── Admin general operations.
│   │
│   ├── AdminBulkCardProfile.controller.js
│   │   └── Admin bulk card profile creation.
│   │
│   ├── adminInvoice.controller.js
│   │   └── Admin invoice management.
│   │
│   ├── AdminMLMProductCreate.controller.js
│   │   └── Admin MLM product creation.
│   │
│   ├── AdminPaymentGatewayController.js
│   │   └── Admin payment gateway settings.
│   │
│   ├── adminSells.controller.js
│   │   └── Admin sales analytics.
│   │
│   ├── auth.controller.js
│   │   └── Authentication (Login, Register, OTP, Forgot Password).
│   │
│   ├── Badges.controller.js
│   │   └── Badges management.
│   │
│   ├── Cashfree.controller.js
│   │   └── Cashfree payment integration.
│   │
│   ├── Category.controller.js
│   │   └── Product categories CRUD.
│   │
│   └── WalletBalance.controller.js
│       └── User wallet balance management.
│
├── routes
│   │
│   ├── AdminDashboardAPI
│   │   └── AdminDashboard.routes.js
│   │       └── Admin dashboard routes.
│   │
│   ├── FooterSection
│   │   ├── AboutPage.Routes.js
│   │   │   └── About page routes.
│   │   │
│   │   ├── PrivacyPolicy.route.js
│   │   │   └── Privacy policy routes.
│   │   │
│   │   ├── RefundPolicy.route.js
│   │   │   └── Refund policy routes.
│   │   │
│   │   └── Terms&Conditions.route.js
│   │       └── Terms & Conditions routes.
│   │
│   ├── LandingPage
│   │   ├── Footer.route.js
│   │   │   └── Footer routes.
│   │   │
│   │   ├── HomeContent.route.js
│   │   │   └── Homepage content routes.
│   │   │
│   │   ├── HowtoUse.route.js
│   │   │   └── How To Use routes.
│   │   │
│   │   ├── PowerfulFeatures.route.js
│   │   │   └── Powerful Features routes.
│   │   │
│   │   ├── Testimonials.route.js
│   │   │   └── Testimonials routes.
│   │   │
│   │   └── TransformNetwork.route.js
│   │       └── Transform Network routes.
│   │
│   ├── ProfileRoutes
│   │   ├── LocationReviews.route.js
│   │   │   └── Location & Reviews routes.
│   │   │
│   │   ├── PaymentDetails.route.js
│   │   │   └── Payment details routes.
│   │   │
│   │   ├── ProfileCover.route.js
│   │   │   └── Profile cover routes.
│   │   │
│   │   ├── ProfileGallery.js
│   │   │   └── Profile gallery routes.
│   │   │
│   │   ├── ProfileLogo.js
│   │   │   └── Profile logo routes.
│   │   │
│   │   ├── ProfilePortfolio.js
│   │   │   └── Profile portfolio routes.
│   │   │
│   │   ├── ProfileProducts.js
│   │   │   └── Profile products routes.
│   │   │
│   │   ├── ProfileResume.js
│   │   │   └── Profile resume routes.
│   │   │
│   │   ├── ProfileServices.js
│   │   │   └── Profile services routes.
│   │   │
│   │   └── sharePublicProfile.route.js
│   │       └── Share public profile routes.
│   │
│   ├── Admin.routes.js
│   │   └── Admin general routes.
│   │
│   ├── AdminConfig.js
│   │   └── Admin configuration routes.
│   │
│   ├── adminInvoices.routes.js
│   │   └── Admin invoices routes.
│   │
│   ├── adminSales.route.js
│   │   └── Admin sales routes.
│   │
│   ├── auth.routes.js
│   │   └── Authentication routes.
│   │
│   ├── badge.routes.js
│   │   └── Badges routes.
│   │
│   ├── CardBulkDownload.routes.js
│   │   └── Bulk card download routes.
│   │
│   ├── CardDownloadBulkParkingTag.routes.js
│   │   └── Bulk Parking Tag download routes.
│   │
│   ├── CardProfile.routes.js
│   │   └── Card profile routes.
│   │
│   ├── Cart.routes.js
│   │   └── Cart routes.
│   │
│   ├── category.routes.js
│   │   └── Category routes.
│   │
│   ├── GoogleReview.routes.js
│   │   └── Google Review routes.
│   │
│   ├── invoice.routes.js
│   │   └── Invoice routes.
│   │
│   ├── InvoiceAddress.routes.js
│   │   └── Invoice address routes.
│   │
│   ├── Order.routes.js
│   │   └── Order routes.
│   │
│   ├── ParkingTag.routes.js
│   │   └── Parking Tag routes.
│   │
│   ├── payment.routes.js
│   │   └── Payment routes.
│   │
│   ├── referral.routes.js
│   │   └── Referral routes.
│   │
│   ├── ServiceLayout.routes.js
│   │   └── Service layout routes.
│   │
│   └── User.routes.js
│       └── User routes.
│
├── middleware
│   ├── authAdminToken.js
│   │   └── Admin authentication middleware.
│   │
│   └── authUserToken.js
│       └── User authentication middleware.
│
├── utils
│   ├── createInvoicePdf.js
│   │   └── Generate invoice PDF files.
│   │
│   ├── crypto.js
│   │   └── Encryption/decryption utilities.
│   │
│   ├── deleteLocalFile.js
│   │   └── Delete local file utility.
│   │
│   ├── distributeActivationCommission.js
│   │   └── Distribute activation commission.
│   │
│   ├── distributeReferralReward.js
│   │   └── Distribute referral rewards.
│   │
│   ├── generateActivationCode.js
│   │   └── Generate activation codes.
│   │
│   ├── generateOTP.js
│   │   └── Generate OTP for verification.
│   │
│   ├── generateQR.js
│   │   └── Generate QR codes.
│   │
│   ├── generateReferralCode.js
│   │   └── Generate referral codes.
│   │
│   ├── generateSlug.js
│   │   └── Generate URL slugs.
│   │
│   ├── invoiceTemplate.js
│   │   └── Invoice HTML template.
│   │
│   ├── productPriceCalculation.js
│   │   └── Product price calculation utilities.
│   │
│   └── uploadInvoiceToCloudinary.js
│       └── Upload invoices to Cloudinary.
│
├── invoices
│   ├── INV-2026-73b970.pdf
│   ├── INV-2026-133acd.pdf
│   ├── INV-2026-195c51.pdf
│   └── INV-2026-195dfb.pdf
│       └── Generated invoice PDF files.
│
├── temp
│   └── Temporary files storage.
│
├── node_modules
│   └── Node.js dependencies.
│
├── .env
│   └── Environment variables configuration.
│
├── app.js
│   └── Express app configuration and middleware setup.
│
├── package-lock.json
│   └── Lock file for exact dependency versions.
│
└── package.json
    └── Project dependencies and scripts.