# Planora - AI-Powered Daily Planner

A modern, responsive web application for personal productivity management with AI-powered insights, habit tracking, and intelligent task organization.

![Planora Dashboard](https://img.shields.io/badge/Planora-v1.0.0-blue)
![React](https://img.shields.io/badge/React-19.1.1-61dafb)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.17-38bdf8)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6)

## ✨ Features

### 🎯 **Task Management**
- **Kanban Board**: Drag-and-drop task organization with Todo, In Progress, and Completed columns
- **Priority Levels**: High, Medium, Low priority with visual indicators
- **Due Dates**: Set and track task deadlines with overdue notifications
- **Tags & Categories**: Organize tasks with custom tags
- **Smart Filtering**: Search and filter tasks by priority, status, and tags

### 🔄 **Habit Tracking**
- **Streak Counter**: Track daily, weekly, and monthly habit streaks
- **Progress Visualization**: Visual progress indicators and completion stats
- **Habit Completion**: Mark habits as complete with date tracking
- **Best Streak Records**: Maintain personal best streak records

### 📅 **Calendar Integration**
- **Monthly View**: Interactive calendar with task and habit indicators
- **Date Selection**: Click any date to view and manage events
- **Quick Add**: Add tasks and habits directly from calendar view
- **Event Indicators**: Visual dots showing tasks and habits for each day

### 🤖 **AI-Powered Insights**
- **Smart Suggestions**: AI recommendations for task prioritization
- **Overdue Alerts**: Automatic detection and suggestions for overdue tasks
- **Workload Analysis**: Suggestions when you have too many tasks
- **Productivity Insights**: Data-driven recommendations for better planning

### 🎨 **Modern UI/UX**
- **Dark/Light Theme**: Toggle between dark and light modes
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **Smooth Animations**: Framer Motion powered micro-interactions
- **Accessibility**: WCAG compliant with keyboard navigation support

### ⚙️ **Settings & Data Management**
- **Data Export/Import**: Backup and restore your data
- **Theme Customization**: Personalize your experience
- **Notification Settings**: Configure reminder preferences
- **Data Security**: Local storage with optional cloud sync

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/planora.git
   cd planora
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to see the application

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## 🛠️ Technology Stack

### Frontend
- **React 19**: Latest React with concurrent features
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Animation library for smooth interactions
- **React Router**: Client-side routing
- **React Query**: Data fetching and caching

### UI Components
- **Lucide React**: Beautiful, customizable icons
- **@dnd-kit**: Modern drag-and-drop functionality
- **date-fns**: Date manipulation utilities

### State Management
- **React Context API**: Global state management
- **Local Storage**: Data persistence
- **React Hooks**: Modern React patterns

## 📱 Features Overview

### Dashboard
- **Welcome Message**: Personalized greeting based on time of day
- **Quick Stats**: Overview of tasks, habits, and productivity metrics
- **Today's Overview**: Current day's tasks and habits at a glance
- **AI Insights**: Smart suggestions and productivity tips
- **Motivational Quotes**: Daily inspirational quotes

### Tasks Page
- **Kanban Board**: Visual task management with drag-and-drop
- **Task Cards**: Rich task information with priority indicators
- **Quick Actions**: Edit, delete, and complete tasks with ease
- **Search & Filter**: Find tasks quickly with advanced filtering

### Habits Page
- **Habit Grid**: Visual habit management with streak tracking
- **Progress Stats**: Detailed habit completion statistics
- **Frequency Management**: Daily, weekly, and monthly habit tracking
- **Streak Visualization**: Visual representation of habit streaks

### Calendar Page
- **Monthly Calendar**: Interactive calendar with event indicators
- **Date Navigation**: Easy month-to-month navigation
- **Event Management**: Add and manage tasks/habits for specific dates
- **Day Details**: Detailed view of selected date's events

### Settings Page
- **Theme Toggle**: Switch between dark and light modes
- **Data Management**: Export, import, and clear data
- **Notification Settings**: Configure app notifications
- **About Information**: App version and developer details

## 🎨 Design System

### Colors
- **Primary**: Purple/Blue gradient (#667eea to #8b5cf6)
- **Success**: Green (#10b981)
- **Warning**: Orange (#f59e0b)
- **Error**: Red (#ef4444)
- **Neutral**: Gray scale with dark mode support

### Typography
- **Font Family**: System fonts (San Francisco, Segoe UI, etc.)
- **Headings**: Bold weights with gradient text effects
- **Body**: Clean, readable text with proper contrast

### Components
- **Cards**: Rounded corners with subtle shadows
- **Buttons**: Gradient backgrounds with hover effects
- **Modals**: Centered overlays with smooth animations
- **Forms**: Clean input fields with focus states

## 🔧 Configuration

### Tailwind CSS
The app uses a custom Tailwind configuration with:
- Custom color palette
- Dark mode support
- Custom animations
- Responsive breakpoints

### Environment Variables
Create a `.env` file in the root directory:
```env
VITE_APP_NAME=Planora
VITE_APP_VERSION=1.0.0
```

## 📊 Data Structure

### Task Object
```javascript
{
  id: "string",
  title: "string",
  description: "string",
  status: "todo" | "in-progress" | "completed",
  priority: "low" | "medium" | "high",
  dueDate: "ISO string",
  createdAt: "ISO string",
  completedAt: "ISO string | null",
  tags: ["string"]
}
```

### Habit Object
```javascript
{
  id: "string",
  title: "string",
  description: "string",
  frequency: "daily" | "weekly" | "monthly",
  streak: "number",
  longestStreak: "number",
  createdAt: "ISO string",
  completedDates: ["YYYY-MM-DD"]
}
```

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Vercel will automatically detect the Vite configuration
3. Deploy with one click

### Netlify
1. Build the project: `npm run build`
2. Upload the `dist` folder to Netlify
3. Configure build settings if needed

### Other Platforms
The app can be deployed to any static hosting service that supports SPA routing.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines
- Follow React best practices
- Use TypeScript for type safety
- Write meaningful commit messages
- Test your changes thoroughly
- Update documentation as needed

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team**: For the amazing framework
- **Tailwind CSS**: For the utility-first CSS framework
- **Framer Motion**: For smooth animations
- **Lucide**: For beautiful icons
- **date-fns**: For date manipulation utilities

## 📞 Support

If you have any questions or need help:
- Create an issue on GitHub
- Check the documentation
- Review the code examples

---

**Made with ❤️ by the Planora Team**

*Transform your productivity with AI-powered planning*
