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
<img width="1438" height="813" alt="image" src="https://github.com/user-attachments/assets/00777131-0eb0-40f4-ae2e-37443965d3ba" />

**🔹 Customer Dashboard**
<img width="1440" height="781" alt="image" src="https://github.com/user-attachments/assets/f36d3a2d-23d5-44f8-afab-5394ae06b921" />

**🔹 Medicine Catalog**
<img width="1440" height="780" alt="image" src="https://github.com/user-attachments/assets/f35deef1-d464-4880-8bbd-cb592c148468" />

**🔹 Prescription Upload**
<img width="1440" height="780" alt="image" src="https://github.com/user-attachments/assets/c765b34f-83e8-40d0-9aaf-8a8ec08602d5" />

**🔹 Pharmacist Dashboard**
<img width="1440" height="779" alt="image" src="https://github.com/user-attachments/assets/ad5a14b5-ac32-4932-b7cf-fbcbfb52b7ab" />

**🔹 Order Management**
<img width="1440" height="780" alt="image" src="https://github.com/user-attachments/assets/f5d3f9ad-f392-4652-a23b-5c3abf4367b4" />
<img width="1440" height="779" alt="image" src="https://github.com/user-attachments/assets/a1c225e0-03d9-44dc-ab5f-535e188729d4" />

**🔹 Real-Time Delivery Tracking**
<img width="1440" height="778" alt="image" src="https://github.com/user-attachments/assets/a18a32da-14f8-4796-9b3a-85d1899267a6" />
<img width="1440" height="779" alt="image" src="https://github.com/user-attachments/assets/7fac573e-4313-49ea-a341-38a1dcca60c4" />


**🔹 Delivery Personnel Dashboard**
<img width="1440" height="778" alt="image" src="https://github.com/user-attachments/assets/d0810a1d-25e9-470f-bc0b-1484566bde47" />

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
  - Pharmacist: pharmacist@mediflow.com
  - Delivery driver: driver@mediflow.com
  - Customer: john@example.com
  - (All with password: password123)

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
