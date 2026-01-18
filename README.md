**[HM081] [Team AlgoCrew]**
# **MediFlow - Pharmacy Management & Medicine Delivery System**

## **📌 Purpose of the Website**
MediFlow is a full-stack web platform designed to streamline the entire pharmacy workflow - from prescription submission to medicine delivery. It connects customers, pharmacists, and delivery personnel in a seamless digital ecosystem.

### **How It Works?**
- Customers can register, upload prescriptions, browse medicines, and place orders.
- Pharmacists verify prescriptions, manage inventory, and process orders.
- Delivery personnel receive assignments and provide real-time location tracking.
- Customers can track their orders in real-time on an interactive map.

### **How It Helps?**
- Digitizes the entire prescription-to-delivery workflow.
- Ensures prescription verification by licensed pharmacists before dispensing.
- Provides real-time delivery tracking for transparency.
- Enables smart refill profiles so customers never run out of essential medicines.

---

## **🌟 Features**

-  **Prescription Upload & Verification** - Customers upload prescriptions; pharmacists verify before processing.
-  **Medicine Catalog** - Browse and search medicines with detailed information.
-  **Shopping Cart** - Add medicines to cart and checkout seamlessly.
-  **Order Management** - Full order lifecycle from placement to delivery.
-  **Real-Time Delivery Tracking** - Track delivery personnel on an interactive map.
-  **Inventory Management** - Pharmacists can manage stock, batch numbers, and expiry dates.
-  **Smart Refill Profiles** - Set up recurring medicine orders with customizable frequency.
-  **Role-Based Dashboards** - Separate dashboards for Customers, Pharmacists, and Delivery Personnel.
-  **Secure Authentication** - JWT-based authentication with role-based access control.

---

## **🖼️ Screenshots**
Here are some screenshots showcasing the MediFlow platform:

**🔹 Home Page**
<!-- Add screenshot: ![Home Page](path/to/home-screenshot.png) -->

**🔹 Customer Dashboard**
<!-- Add screenshot: ![Customer Dashboard](path/to/customer-dashboard.png) -->

**🔹 Medicine Catalog**
<!-- Add screenshot: ![Medicine Catalog](path/to/medicines-page.png) -->

**🔹 Prescription Upload**
<!-- Add screenshot: ![Prescription Upload](path/to/prescription-upload.png) -->

**🔹 Pharmacist Dashboard**
<!-- Add screenshot: ![Pharmacist Dashboard](path/to/pharmacist-dashboard.png) -->

**🔹 Order Management**
<!-- Add screenshot: ![Order Management](path/to/order-management.png) -->

**🔹 Real-Time Delivery Tracking**
<!-- Add screenshot: ![Delivery Tracking](path/to/delivery-tracking.png) -->

**🔹 Delivery Personnel Dashboard**
<!-- Add screenshot: ![Delivery Dashboard](path/to/delivery-dashboard.png) -->

---

## 🌍 Deployed URL
🔗 **[Access the Live Platform](https://algocrew.vercel.app/)**
<!-- Add your deployed URL here -->

---

## 🎥 Demo Video
📽️ [Watch the Demo]()

<!-- Add your demo video URL here -->

---

## **🛠️ Tech Stack & APIs Used**

- **Frontend:** Next.js 16, React 19, Tailwind CSS 4
- **Backend:** Next.js API Routes
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** JWT (JSON Web Tokens) with bcrypt
- **State Management:** Zustand
- **UI Components:** Radix UI, Lucide Icons
- **Maps:** Leaflet & React-Leaflet (for real-time tracking)
- **Image Storage:** Cloudinary API
- **Charts:** Recharts
- **Form Handling:** React Hook Form with Zod validation

---

## **📊 System Architecture**

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│    Customer     │     │   Pharmacist    │     │    Delivery     │
│   Dashboard     │     │   Dashboard     │     │   Dashboard     │
└────────┬────────┘     └────────┬────────┘     └────────┬────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │    Next.js API Routes   │
                    │   (Authentication &     │
                    │    Business Logic)      │
                    └────────────┬────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │   PostgreSQL Database   │
                    │     (via Prisma ORM)    │
                    └─────────────────────────┘
```

---

## **👥 User Roles**

| Role | Capabilities |
|------|-------------|
| **Customer** | Browse medicines, upload prescriptions, place orders, track deliveries, manage refill profiles |
| **Pharmacist** | Verify prescriptions, manage inventory, process orders, assign deliveries |
| **Delivery** | View assignments, update delivery status, share real-time location |

---

## **🚀 Upcoming Features**

- **Payment Gateway Integration** - Online payment for orders.
- **Push Notifications** - Order status updates and refill reminders.
- **Medicine Interaction Checker** - AI-based drug interaction warnings.
- **Chat Support** - Real-time chat between customers and pharmacists.
- **Analytics Dashboard** - Detailed insights for pharmacists and admins.

---

## **📖 How to Run Locally**

1. **Clone the Repository**
   ```bash
   git clone https://github.com/adivedpathak/Team-AlgoCrew---HM081.git
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**
   Create a `.env` file with:
   ```
   DATABASE_URL="your-postgresql-connection-string"
   JWT_SECRET="your-jwt-secret"
   CLOUDINARY_CLOUD_NAME="your-cloudinary-name"
   CLOUDINARY_API_KEY="your-cloudinary-key"
   CLOUDINARY_API_SECRET="your-cloudinary-secret"
   ```

4. **Run Database Migrations**
   ```bash
   npx prisma migrate dev
   ```

5. **Seed the Database (Optional)**
   ```bash
   npx ts-node src/scripts/seed.ts
   ```

6. **Start the Development Server**
   ```bash
   npm run dev
   ```

7. **Open in Browser**
   Navigate to `http://localhost:3000`

8. **Credentials for Testing**
   **- Pharmacist:** pharmacist@mediflow.com
   ** - Delivery driver:** driver@mediflow.com
   **- Customer:** john@example.com
   **- All with password:** password123

---

## **📩 Contact Us**
If you have any questions, feedback, or issues, feel free to reach out.

### **👨‍💻 Team AlgoCrew**

**Aditya Vedpathak**
📧 aditya.vedpathak22@pccoepune.org
🔗 [GitHub](https://github.com/adivedpathak)

**Mandip Bhattarai**
📧 mandip.bhattarai22@pccoepune.org
🔗 [GitHub](https://github.com/mandipbhattarai)

**Ranjit Chaudhary**
📧 ranjit.chaudhary22@pccoepune.org
🔗 [GitHub](https://github.com/Ranjitdon)

**Nishant Bhakar**
📧 nishant.bhakar22@pccoepune.org
🔗 [GitHub](https://github.com/nishantbhakar)

---

## **📜 License**
This project is licensed under the **MIT License**.

---

🚀 **Thank You for Checking Out MediFlow!**
We hope this platform revolutionizes pharmacy management and improves healthcare accessibility. 💙
