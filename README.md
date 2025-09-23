# Setu Studios - Bridge to Launch

A comprehensive startup development platform that provides end-to-end services from idea analysis to product launch.

## Features

- **Idea Analysis**: AI-powered startup idea analysis using Gemini AI
- **Service Packages**: Pre-defined service packages for different startup needs
- **Order Management**: Complete order processing and tracking system
- **Email Notifications**: Automated email notifications for orders
- **Responsive Design**: Modern, mobile-first UI built with React and Tailwind CSS

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Framer Motion
- **Backend**: Supabase (Database & Authentication)
- **AI**: Google Gemini API
- **Email**: EmailJS
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Supabase account
- Google Gemini API key
- EmailJS account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/studlyf-nirvaha/setustudios.git
   cd setustudios
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Copy the environment template
   cp .env.example .env
   
   # Edit .env with your actual credentials
   nano .env
   ```

4. **Configure Environment Variables**
   
   Update the `.env` file with your actual credentials:
   ```env
   # Supabase Configuration
   VITE_SUPABASE_URL=your_supabase_url_here
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   
   # Gemini AI API Configuration
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   
   # EmailJS Configuration
   VITE_EMAILJS_SERVICE_ID=your_emailjs_service_id_here
   VITE_EMAILJS_TEMPLATE_CUSTOMER=your_customer_template_id_here
   VITE_EMAILJS_TEMPLATE_ADMIN=your_admin_template_id_here
   VITE_EMAILJS_PUBLIC_KEY=your_emailjs_public_key_here
   
   # Admin Email Configuration
   VITE_ADMIN_EMAIL=your_admin_email_here
   ```

5. **Database Setup**
   
   Run the SQL scripts in the following order:
   ```bash
   # 1. Create Supabase Auth tables
   psql -h your-supabase-host -U postgres -d postgres -f database-schema-supabase-auth.sql
   
   # 2. Create main application tables
   psql -h your-supabase-host -U postgres -d postgres -f database-schema.sql
   
   # 3. Create orders tables
   psql -h your-supabase-host -U postgres -d postgres -f database-schema-orders.sql
   ```

6. **Start Development Server**
   ```bash
   npm run dev
   ```

7. **Build for Production**
   ```bash
   npm run build
   ```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── AnimatedCard.tsx
│   ├── Layout.tsx
│   └── Notification.tsx
├── config/             # Configuration files
│   └── supabase.ts
├── contexts/           # React contexts
│   ├── AuthContext.tsx
│   ├── CartContext.tsx
│   ├── NotificationContext.tsx
│   └── ThemeContext.tsx
├── pages/              # Page components
│   ├── Cart.tsx
│   ├── Home.tsx
│   ├── IdeaAnalyzer.tsx
│   ├── Packages.tsx
│   └── Services.tsx
└── services/           # API and external services
    ├── database.ts
    ├── email.ts
    ├── gemini.ts
    └── orders.ts
```

## Security

- All sensitive data (API keys, credentials) are stored in environment variables
- The `.env` file is excluded from version control
- Never commit actual credentials to the repository
- Use the provided `.env.example` as a template

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email admin@setustudios.com or create an issue in the repository.

## Deployment

See `DEPLOYMENT_GUIDE.md` for detailed deployment instructions.
