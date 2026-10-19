# URL Shortener and Management Platform

This project is a URL shortening and management platform that allows users
 to shorten URLs, track clicks, manage their account, and more.

## Prerequisites

Ensure that you have **Node.js** installed on your system before setting up the project.

## Backend Setup

1. Open a terminal and navigate to the backend project directory.
2. Install the required dependencies by running:
   ```bash
   npm install
   ```
3. Start the backend server with:
   ```bash
   npm run dev
   ```
   The backend will now be running locally.

## URL Shortener - Frontend

A modern, responsive React application for URL shortening with real-time analytics. This is a public-facing application that allows anyone to create, manage, and track shortened URLs without requiring authentication.

## Features

- **Public URL Shortening**: Create short URLs instantly without signing up
- **Real-time Dashboard**: View global statistics including total clicks and links
- **Analytics Dashboard**: Track clicks by date and device type
- **Link Management**: View, edit, and delete all shortened URLs
- **Search Functionality**: Search links by custom remarks
- **Expiration Support**: Set expiration dates for temporary links
- **Responsive Design**: Fully responsive UI that works on all devices
- **Modern UI/UX**: Clean, intuitive interface with smooth animations

## Tech Stack

- **Framework**: React 18
- **State Management**: Recoil
- **Routing**: React Router DOM v6
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast
- **Icons**: React Icons
- **Build Tool**: Vite
- **Styling**: CSS3 with custom styles

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Frontend
```

2. Install dependencies:
```bash
npm install
```

3. Update API URL in `src/api/hooks.js`:
```javascript
const API_URL = "your-backend-url/api/v1";
```

4. Start the development server:
```bash
npm run dev
```

5. Build for production:
```bash
npm run build
```

## Project Structure

```
Frontend/
├── public/
│   └── vite.svg
├── src/
│   ├── api/
│   │   ├── apiCall.js       # Axios wrapper
│   │   └── hooks.js         # Custom API hooks
│   ├── assets/
│   │   ├── index.js
│   │   ├── logo.png
│   │   └── smLogo.png
│   ├── components/
│   │   ├── DashboardComp.jsx
│   │   ├── DeletePopUp.jsx
│   │   ├── Loader.jsx
│   │   ├── Navbar.jsx
│   │   ├── Pagination.jsx
│   │   ├── SideBar.jsx
│   │   └── UrlPopUp.jsx
│   ├── pages/
│   │   ├── Analytics.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Links.jsx
│   │   └── NotFound.jsx
│   ├── recoil/
│   │   └── recoil.js        # State atoms
│   ├── styles/
│   │   └── *.css            # Component styles
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
├── vite.config.js
└── vercel.json
```

## Pages

### Dashboard (`/`)
- Display total clicks and total links
- Date-wise click analytics with visual charts
- Device breakdown (Mobile, Desktop, Tablet)

### Links (`/links`)
- View all shortened URLs in a paginated table
- Create new short URLs
- Edit existing links
- Delete links
- Search by remarks
- Copy short URLs to clipboard

### Analytics (`/analytics`)
- Detailed click logs with timestamps
- IP address tracking
- Device information
- Searchable and paginated

## Components

### Navbar
- Create new links button
- Search functionality
- Time-based greeting
- Responsive hamburger menu

### SideBar
- Navigation menu
- Logo and branding
- Active route highlighting

### UrlPopUp
- Modal for creating/editing URLs
- Destination URL input
- Custom remarks
- Expiration date settings

### DashboardComp
- Reusable chart component
- Bar chart visualization
- Data percentage display

## State Management (Recoil)

Atoms used throughout the application:
- `DASHBOARDDATA`: Global statistics
- `LINKSDATA`: All links data
- `ANALYTICSDATA`: Analytics logs
- `LINKSEARCH`: Search term for links
- `ANALYTICSEARCH`: Search term for analytics
- `NAVOPEN`: Mobile navigation state

## API Integration

All API calls are handled through custom hooks in `src/api/hooks.js`:

- `useGetDashboardData()`: Fetch global statistics
- `useCreateLink()`: Create new short URL
- `useEditLink()`: Edit existing link
- `useDeleteLink()`: Delete link
- `useGetLinks()`: Fetch links with pagination
- `useGetAnalytics()`: Fetch analytics data

## Styling

- Modern, clean design with a blue color scheme (#1B48DA)
- Fully responsive (Desktop, Tablet, Mobile)
- Smooth transitions and hover effects
- Gradient backgrounds for stats cards
- Custom scrollbars

## Key Features Explained

### URL Creation
1. Click "Create new" button
2. Enter destination URL
3. Add optional remarks for easy identification
4. Set optional expiration date
5. URL is shortened and immediately available

### Analytics Tracking
Every time someone visits a short URL:
- Visit timestamp is recorded
- User's IP address is logged
- Device type is detected (Mobile/Desktop/Tablet)
- All data is displayed in real-time on Analytics page

### Link Management
- **Edit**: Update destination URL, remarks, or expiration
- **Delete**: Remove any link from the system
- **Search**: Find links quickly by remarks
- **Copy**: One-click copy of short URLs

## Environment Setup

### Development
```bash
npm run dev
```
Runs on `http://localhost:5173`

### Production Build
```bash
npm run build
```
Creates optimized build in `dist/` folder

### Preview Production Build
```bash
npm run preview
```

## Deployment

Configured for Vercel deployment with `vercel.json`.

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Key Changes from Original

This is a **public version** without authentication:

- ✅ Removed login/register pages
- ✅ Removed user settings page
- ✅ Removed authentication guards
- ✅ Removed user profile display
- ✅ Public access to all features
- ✅ Simplified navigation (3 pages: Dashboard, Links, Analytics)

## Performance Optimizations

- Lazy loading of components
- Debounced search functionality
- Pagination for large datasets
- Optimized re-renders with Recoil
- Vite for fast builds

## Future Enhancements

- QR Code generation for short URLs
- Link preview before shortening
- Custom short URL slugs
- Export analytics data
- Dark mode theme

## License

ISC

## Author

Portfolio Project - Showcasing modern React development

---

**Note**: This is a public demonstration project. Consider adding rate limiting and spam prevention for production use. Setup

1. Open a terminal and navigate to the frontend project directory.
2. Install the required dependencies by running:
   ```bash
   npm install
   ```
3. Start the frontend with:
   ```bash
   npm run dev
   ```
   The frontend will now be accessible in your browser.

## Running Frontend with Local Backend

To connect the frontend to your local backend:

1. Go to the `/src/api/hooks.js` file in the frontend project.
2. Comment out the deployment URL and uncomment the local URL to ensure the frontend connects to your local backend server.

## Features Implemented

The platform includes the following features:

### 1. **URL Shortening**
   - Users can shorten long URLs into unique, shortened versions.
   - Shortened URLs are generated using a hash or random string (e.g., `https://<hostname>/<6-8 digit alphanumeric>`).
   - Expiration dates can be set for links, and they will automatically expire once the set date is reached.

### 2. **User Management**
   - User registration and login using email and password.
   - Passwords are securely hashed before being stored.
   - Users can update their profile information (name and email). If the email is updated, the user will be logged out.
   - Users can delete their account and all associated links and data.

### 3. **Dashboard**
   - Users can view a list of their shortened URLs, including:
     - Original URL.
     - Shortened URL.
     - Click analytics data.
   - Users can edit or delete their shortened URLs.

### 4. **Click Tracking**
   - Clicks on shortened URLs are tracked with metadata such as:
     - Timestamp.
     - IP address.
     - User agent (browser and OS details).
   - The collected click data is displayed on the user's dashboard.

### 5. **Link Management**
   - Users can manage their shortened links by:
     - Editing the original URL or its alias.
     - Deleting individual links.

### 6. **Analytics**
   - Detailed analytics are provided for each shortened link:
     - Device type (mobile, desktop, tablet).
     - Browser details.

### 7. **Responsive Design**
   - The platform is fully responsive, providing a seamless experience on both desktop and mobile devices.

### 8. **Pagination**
   - Pagination is implemented in both the Links and Analytics sections for easier navigation through multiple records.

## Demo Credentials

You can test the platform using the following demo credentials:

- **Email**: demo@mail.com  
- **Password**: testing

---

Now you're ready to explore the platform. Feel free to reach out if you have any questions or encounter issues!
```

---