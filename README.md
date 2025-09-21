# CarSellMax - Car Selling Platform

A modern, clean car selling platform built with Next.js 15, TypeScript, Tailwind CSS, and shadcn/ui components.

## 🏗️ Project Structure

The project follows a clean, organized structure with three main contexts:

### 📱 Public Pages (`app/(public)/`)
- **Landing Page** (`/`) - Marketing site with hero, features, and CTA
- **Sell Car** (`/sell-car`) - Car listing form for sellers
- **About** (`/about`) - Company information and values
- **Contact** (`/contact`) - Contact form and information

### 👤 User Tenant (`app/(tenant)/`)
- **Dashboard** (`/dashboard`) - User's car listings and quotes overview
- **Cars** (`/cars`) - Manage car listings
- **Quotes** (`/quotes`) - View and manage offers
- **Profile** (`/profile`) - User profile and settings

### 🔧 Admin (`app/(admin)/`)
- **Dashboard** (`/admin`) - Platform overview and statistics
- **Users** (`/admin/users`) - Manage user accounts
- **Cars** (`/admin/cars`) - Review and approve car listings
- **Quotes** (`/admin/quotes`) - Monitor quote activity
- **Analytics** (`/admin/analytics`) - Platform performance metrics
- **Settings** (`/admin/settings`) - Site configuration

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd carsellmax
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **State Management**: React hooks (local state)
- **Authentication**: TBD (Supabase planned)
- **Database**: TBD (Supabase planned)

## 📁 Key Components

### Layouts
- `PublicLayout` - Marketing pages with header/footer
- `TenantLayout` - Authenticated user area with sidebar
- `AdminLayout` - Admin dashboard with navigation

### UI Components
- All shadcn/ui components (Button, Card, Input, Table, etc.)
- Custom form components
- Responsive navigation
- Mobile-friendly design

## 🎨 Design Features

- **Responsive Design** - Mobile-first approach
- **Modern UI** - Clean, professional interface
- **Accessibility** - ARIA labels and keyboard navigation
- **Dark Mode Ready** - Built with CSS variables
- **Performance** - Optimized with Next.js 15

## 🔄 Development Workflow

1. **Components**: Create reusable UI components in `components/ui/`
2. **Layouts**: Use appropriate layout wrapper for each context
3. **Pages**: Follow the routing structure for each section
4. **Styling**: Use Tailwind classes and CSS variables
5. **State**: Implement local state with React hooks

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: > 1024px

## 🚧 Future Enhancements

- [ ] Supabase integration for authentication
- [ ] Database schema and API routes
- [ ] Image upload functionality
- [ ] Real-time notifications
- [ ] Payment processing
- [ ] Email notifications
- [ ] Admin user management
- [ ] Analytics dashboard

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For support and questions, please contact the development team or create an issue in the repository.

---

**CarSellMax** - Making car selling simple, secure, and profitable.
