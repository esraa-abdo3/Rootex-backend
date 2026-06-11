# Hair Care E-commerce Platform | Full Stack Development

Developed a complete e-commerce platform for a hair care brand as a freelance project, handling both frontend and backend development, along with third-party integrations and business automation tools.

## Project Link:
https://rotex-front.vercel.app/

## Frontend Development (Next.js)

* Built the entire customer-facing website using Next.js.
* Developed responsive and user-friendly interfaces compatible with mobile, tablet, and desktop devices.
* Implemented multilingual support (Arabic / English).
* Created dynamic product listing pages with filtering and detailed product views.
* Developed a complete shopping cart experience, including quantity updates and item removal.
* Built a multi-step checkout process with client-side validations.
* Integrated different payment options within the checkout flow:

  * Credit/Debit Cards.
  * Mobile Wallets.
  * Cash on Delivery (COD).
* Implemented dynamic rendering of homepage sections based on data managed from the admin dashboard.
* Added Meta Pixel events on customer interactions, including:

  * PageView.
  * ViewContent.
  * AddToCart.
  * InitiateCheckout.
  * Purchase.
  * Lead events where applicable.
* Optimized performance and user experience using Next.js features.

## Backend Development (Node.js & Express.js)

* Designed and developed RESTful APIs using Node.js and Express.js.
* Implemented product management APIs:

  * Create products.
  * Update products.
  * Delete products.
  * Retrieve products.
  * Manage stock quantities.
* Developed order management APIs:

  * Create orders.
  * Retrieve all orders.
  * Update order statuses.
  * Filter and search orders.
* Implemented inventory validation to prevent ordering unavailable quantities.
* Integrated Paymob payment gateway APIs.
* Developed secure webhook handling to receive and process payment notifications from Paymob.
* Implemented payment status updates based on Paymob callbacks.
* Managed Cash on Delivery orders alongside online payment orders.
* Automated synchronization of order data to Google Sheets for reporting and operational purposes.
* Structured backend services to support future scalability and maintainability.

## Admin Dashboard Features

Developed a comprehensive admin dashboard to give the client full control over the platform without requiring technical knowledge.

### Content Management

* Manage homepage content.
* Control banners and promotional sections.
* Update text and images displayed on the website.
* Reorder and customize website sections dynamically.

### Product Management

* Add new products.
* Edit existing products.
* Delete products.
* Manage product stock levels.
* Organize product information and visibility.

### Order Management

* View all incoming orders.
* Track payment methods used.
* Update order statuses.
* Monitor customer information.
* Review order details and purchased items.

### Store Configuration

* Configure payment methods.
* Adjust website settings and display preferences.
* Control sections visibility and ordering.

## Payment Integration

Integrated Paymob payment solutions, including:

* Credit and Debit Card payments.
* Mobile Wallet payments.
* Cash on Delivery (COD).

Handled the complete payment lifecycle, including payment initiation, callback processing, webhook validation, and order status updates.

## Analytics & Tracking

* Integrated Meta Pixel across the platform.
* Configured conversion tracking events for marketing campaigns.
* Implemented customer journey tracking to support advertising optimization and reporting.

## Business Automation

* Connected the platform with Google Sheets.
* Automatically exported order details to spreadsheets.
* Simplified operational workflows and reporting for the business owner.

## Technologies Used

* Next.js
* Node.js
* Express.js
* JavaScript
* REST APIs
* Paymob Integration
* Meta Pixel
* Google Sheets API
* Responsive Web Design
