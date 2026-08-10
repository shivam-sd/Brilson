## 🔗 API Endpoints


## Authentication Routes

POST   /api/users/register        - User registration
POST   /api/users/login           - User login
POST   /api/users/logout          - User logout
POST   /api/users/send-otp        - Send OTP
POST   /api/users/verify-otp      - Verify OTP

POST   /api/auth/forgot-password      - Forggot password
POST   /api/auth//verify-reset-otp      - reset otp verify
POST   /api/auth/reset-password      - Reset Password

GET   /api/users/loggedIn/user    - Get LoggdIn Users
GET   /api/users/my-active-card   - Current User Activate Cards 
GET   /api/users/balance          - Users Referral Balance Amount



## Admin Authentiation Routes

POST /api/admin/register      - Admin Register Only for postman
POST /api/admin/login         - Admin Login

 
## Admin Authorization Routes

POST /api/admin/add/products", createProduct      - (Admin) product add 
POST /api/admin/update/pricing/:id                   - (Admin) update pricing of product
PUT /api/admin/update/products/:id  - (Admin) product update 
PUT /api/orders/update/orderStatus   -- (Admin) OrderStatus change
DELETE /api/admin/delete/products/:id", deleteProduct   - (Admin) product delete
GET /api/admin/all/products", getAllProduct          - (Admin) see all products
GET /api/admin/find/products/:id" , findProductById    - (Admin) Check Single Product

POST /api/admin/ismlm/product    - (Admin) add product as mlm product


## Cart Apis Endpoints

GET /api/cart/user    --   ( get cart items)
POST /api/cart/add    --    ( add items in carts)
PUT /api/cart/update/:cartId    -- ( update cart items => quntity)
DELETE /api/cart/remove/:cartId     -- ( remove items from cart )
DELETE /api/cart/clear               -- ( clear cart )


## referal code validate

GET /api/validate/:refCode   -- (validate referal code)


## Order apis endpoints

POST /api/orders/create
GET /api/orders/
POST /api/orders/update/paymentStatus
GET /api/allorders

GET /api/order/details/:orderId



## Payments Apis endpoints

// RAZORPAY
POST /api/payment/create      -- razorpay order of payment create
POST /api/payment/verify        -- razorpay payment verify success or failed

// payment webhook call automatically form razorpay dashboard
POST /api/payment/webhook       -- webhook check the final paid or fail


// CASHFREE
POST /api/payment/cashfree/create      -- cashfree payment create
POST /api/payment/cashfree/verify      -- cashfree payment verify


// PAYU
POST /api/payment/payu/create           -- payu payment create
POST /api/payment/payu/verify           -- payu payment verify 


// ADMIN PAYMENT GATEWAY ISACTIVE OR NOT
PUT /api/payment/isactive/gateway/update     -- change payment getways
GET /api/payment/isactive/gateway            -- get witch payment getway is active



## NFC CARD ROUTES 

POST   /api/cards/bulk                     - Admin bulk create NFC cards
POST   /api/card/activate                  - Activate NFC card with activation code
GET    /api/card/:slug                     - Get public card profile by slug
GET    /api/all/cards                      - Get all card profiles (Admin only)
PUT    /api/card/:id/editCountryCode       - Update business phone country code
PUT    /api/card/:id/editWaCountryCode     - Update WhatsApp number country code
PUT    /api/card/:id/edit                  - Edit complete card profile
GET    /api/claim-card-profile             - Claim unclaimed card profile
GET    /api/check/card/:activationCode     - Check card activation status
PATCH  /api/cards/:id/downloaded           - Mark card as downloaded (increment count)
GET    /api/cards                          - Get all users with their cards (Admin)
GET    /api/cards/user/:userId             - Get specific user's cards (Admin)
GET    /api/user/referral                  - Get user's referral details



## PARKING TAG Management routes 


POST   /api/tags/bulk                      - Admin bulk create parking tags
POST   /api/tags/activate                  - Activate parking tag with activation code
GET    /api/check/tag/:activationCode      - Check parking tag activation status
GET    /api/claim-tag-profile              - Claim unclaimed parking tag profile
GET    /api/tag/:slug                      - Get public parking tag profile by slug
GET    /api/tag/profile/:slug              - Get public parking tag profile by slug (alternative)
PUT    /api/tag/:id/edit                   - Edit complete parking tag profile
GET    /api/all/tags                       - Get all parking tag profiles (Admin)
PATCH  /api/tags/:id/downloaded            - Mark parking tag as downloaded (increment count)
GET    /api/tags/user/:userId              - Get specific user's parking tags (Admin)




## Google Reviews Management APis

POST   /api/google-review/card/bulk           - Admin bulk create Google Review cards
POST   /api/google-review/activate            - Activate Google Review with activation code
PUT    /api/google-reviews/:id/edit           - Edit Google Review profile
GET    /api/check/google-reviews/:activationCode - Check Google Review activation status
PATCH  /api/google-review/:id/downloaded      - Mark Google Review as downloaded
GET    /api/google-review/profile/:slug       - Get single Google Review profile
GET    /api/all/google-reviews                - Get all Google Review profiles (Admin)
GET    /api/google-reviews/user/:userId       - Get specific user's Google Reviews (Admin)



## Category Management Apis 

POST   /api/category/category/                    - Create new category (Admin)
GET    /api/category/active              - Get all active categories
DELETE /api/category/delete/:id          - Delete category by ID (Admin)



## Badge Management APis

POST  /api/badges/                    - Create new badge (Admin)
GET    /api/badges/active              - Get all active badges
DELETE /api/badges/delete/:id          - Delete badge by ID (Admin)


## Sales Overview

GET /api/admin/sales/overview    -- sales grapgh


## Admin Invoice

GET /api/invoice/download/:orderId    -- invoice donwload from admin side

## different 

GET /api/invoices/all                 -- see all invoices
GET /api/invoices/download-zip          -- all invoice download in zip file


## Landing Page apis

## Home Page
GET /api/admin/home/content/           -- fetch home page content
POST /api/admin/home/content/create     -- add home page content    
PUT /api/admin/home/content/update       -- update home page content

## PowerFull Features
GET /api/admin/powerfull/features         -- fetch powerfull features data
GET /api/admin/powerfull/features/update    -- fetch updated powerfull featuues data
POST /api/admin/powerfull/features/create   -- add powerfull features data

## How To Use Apis
POST   /api/admin/howtouse/create            - Create How To Use section (Admin)
PUT    /api/admin/howtouse/update            - Update How To Use section (Admin)
GET    /api/admin/howtouse                   - Get How To Use sections (Public)


## Transform apis
POST   /api/admin/testimonials/create            - Create new testimonial (Admin)
PUT    /api/admin/testimonials/update            - Update existing testimonial (Admin)
GET    /api/admin/testimonials                   - Get all testimonials (Public)


## Transform Network
POST   /api/admin/transform/create            - Create Transform Network section (Admin)
PUT    /api/admin/transform/update            - Update Transform Network section (Admin)
GET    /api/admin/transform                   - Get Transform Network sections (Public)


## Footer Management Routes
POST   /api/admin/footer/create            - Create/Add footer content (Admin)
PUT    /api/admin/footer/update            - Update footer content (Admin)
GET    /api/admin/footer                   - Get footer content (Public)



## Profile Products Management Routes
POST   /api/profile-products/add                    - Add product to profile (User)
PUT    /api/profile-products/update/:productId      - Update profile product (User)
GET    /api/profile-products/all/get/:activationCode - Get all products by activation code (Public)
GET    /api/profile-products/get/single/:productId  - Get single product by ID (Public)
DELETE /api/profile-products/delete/:productId      - Delete profile product (User)


## Profile Portfolio Management Routes

POST   /api/profile-portfolio/add                    - Add portfolio item to profile (User)
PUT    /api/profile-portfolio/update/:portfolioId    - Update portfolio item (User)
GET    /api/profile-portfolio/all/get/:activationCode - Get all portfolio items by activation code (Public)
GET    /api/profile-portfolio/get/single/:portfolioId - Get single portfolio item by ID (Public)
DELETE /api/profile-portfolio/delete/:portfolioId    - Delete portfolio item (User)


## Profile Services Management Routes 

POST   /api/profile-services/add                    - Add service to profile (User)
PUT    /api/profile-services/update/:serviceId      - Update service (User)
GET    /api/profile-services/all/get/:activationCode - Get all services by activation code (Public)
GET    /api/profile-services/get/single/:serviceId  - Get single service by ID (Public)
DELETE /api/profile-services/delete/:serviceId      - Delete service (User)


## Profile Gallery Management Routes

POST   /api/profile-gallery/add                    - Add gallery image to profile (User)
PUT    /api/profile-gallery/update/:galleryId      - Update gallery image (User)
GET    /api/profile-gallery/all/get/:activationCode - Get all gallery images by activation code (Public)
GET    /api/profile-gallery/get/single/:galleryId  - Get single gallery image by ID (Public)
DELETE /api/profile-gallery/delete/:galleryId      - Delete gallery image (User)


##  Profile Logo Management Routes

POST   /api/profile-logo/add                    - Add profile logo (User)
PUT    /api/profile-logo/update                 - Update profile logo (User)
GET    /api/profile-logo/get/:activationCode    - Get profile logo by activation code (Public)


##  Payment Details Management Routes

POST   /api/profile/payment-details/add                    - Add payment details (User)
PUT    /api/profile/payment-details/update/:paymentId      - Update payment details (User)
GET    /api/profile/payment-details/get/:activationCode    - Get payment details by activation code (Public)


##  Location & Reviews Management Routes

POST   /api/profile/location/add                    - Add location & reviews (User)
PUT    /api/profile/location/update/:locationId      - Update location & reviews (User)
GET    /api/profile/location/get/:activationCode    - Get location & reviews by activation code (Public)


##  Profile Resume Management Routes

POST   /api/profile/resume/add                    - Add resume/CV to profile (User)
PUT    /api/profile/resume/update/:resumeId       - Update resume/CV (User)
GET    /api/profile/resume/get/:activationCode    - Get resume/CV by activation code (Public)


## Public Profile Share Routes

GET    /api/public/profile/:slug    -- Get public profile by slug (Public)


## About Page Management Routes

POST   /api/about/create-or-update       - Create or update About page content (Admin)
GET    /api/about/get                   - Get About page content (Public)


## Privacy Policy Management Routes

POST   /api/privacy-policy/create-or-update        -- Create or update Privacy Policy content (Admin)
GET    /api/privacy-policy/get                    -- Get Privacy Policy content (Public)


## Terms & Conditions Management Routes

POST   /api/terms-conditions/create-or-update      -- Create or update Terms & Conditions content (Admin)
GET    /api/terms-conditions/get                   -- Get Terms & Conditions content (Public)


##  Admin Dashboard Management Routes

GET    /api/admin/dashboard              -- Get admin dashboard statistics (Admin)
GET    /api/admin/dashboard/chart        -- Get dashboard chart data (Admin)


## Refund Policy Management Routes

POST   /api/admin/create-or-update/refund-policy     -- Create or update Refund Policy content (Admin)
GET    /api/admin/get/refund-policy                  -- Get Refund Policy content (Public)


##  Invoice Address Management Routes

POST   /api/invoice/address                    - Save or update invoice address (User)
GET    /api/invoice/address                    - Fetch invoice address (User)


