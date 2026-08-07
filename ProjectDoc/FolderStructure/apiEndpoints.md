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
PUT /api/admin/update/products/:id", editProduct  - (Admin) product update 
DELETE /api/admin/delete/products/:id", deleteProduct   - (Admin) product delete
GET /api/admin/all/products", getAllProduct          - (Admin) see all products
GET /api/admin/find/products/:id" , findProductById    - (Admin) Check Single Product

POST /api/admin/ismlm/product    - (Admin) add product as mlm product

