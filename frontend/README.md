# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

```
Directory structure:
└── Dhritiman1511-home-service-frontend/
    ├── README.md
    ├── eslint.config.js
    ├── index.html
    ├── package.json
    ├── postcss.config.js
    ├── tailwind.config.js
    ├── vercel.json
    ├── vite.config.js
    ├── public/
    └── src/
        ├── App.jsx
        ├── index.css
        ├── main.jsx
        ├── assets/
        ├── components/
        │   ├── BookingForm.jsx
        │   ├── Footer.jsx
        │   ├── Navbar.jsx
        │   ├── Notification.jsx
        │   ├── RoleBasedRedirect.jsx
        │   └── ServiceCard.jsx
        ├── context/
        │   ├── AuthContext.jsx
        │   ├── ProviderContext.jsx
        │   ├── RoleContext.jsx
        │   └── UserContext.jsx
        ├── pages/
        │   ├── AdminDashboard.jsx
        │   ├── BookingDetails.jsx
        │   ├── BookingHistory.jsx
        │   ├── HomePage.jsx
        │   ├── Login.jsx
        │   ├── Register.jsx
        │   ├── ServiceBookings.jsx
        │   ├── ServiceDetails.jsx
        │   ├── ServiceList.jsx
        │   ├── ServiceProviderDashboard.jsx
        │   ├── UserDashboard.jsx
        │   ├── adminComponents/
        │   │   ├── BookingForm.jsx
        │   │   ├── BookingList.jsx
        │   │   ├── CategoryForm.jsx
        │   │   ├── CategoryList.jsx
        │   │   ├── ServiceForm.jsx
        │   │   ├── ServiceFormPage.jsx
        │   │   ├── ServiceList.jsx
        │   │   ├── ServiceProviderList.jsx
        │   │   └── UserList.jsx
        │   └── userComponents/
        │       ├── CustomerReviews.jsx
        │       ├── Hero.jsx
        │       ├── PaymentPage.jsx
        │       ├── PopularServices.jsx
        │       └── WhyCallOnce.jsx
        ├── services/
        │   ├── adminService.jsx
        │   ├── authService.jsx
        │   ├── bookingService.jsx
        │   ├── categoryService.jsx
        │   ├── paymentService.jsx
        │   ├── reviewService.jsx
        │   ├── serviceProviderService.jsx
        │   └── serviceService.jsx
        └── utils/
            └── cookieUtils.js

```