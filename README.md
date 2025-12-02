# TaskWise - Intelligent Task Management

TaskWise is a premium, intelligent task management application designed to help you master your workflow and amplify your focus. Built with modern web technologies, it combines powerful task organization with gamification and focus tools to boost productivity.

![TaskWise Hero](https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&q=80&w=2072&ixlib=rb-4.0.3)

## 🚀 Features

- **Smart Task Management**: Organize tasks with priorities, deadlines, and drag-and-drop reordering.
- **Focus Mode**: Built-in Pomodoro timer with "Zen Mode" to block distractions and track deep work.
- **Gamification**: Earn XP, level up, and maintain streaks as you complete tasks and focus sessions.
- **Analytics Dashboard**: Visualize your productivity with detailed charts on focus hours and task completion.
- **Calendar View**: Plan your month and week with an intuitive calendar interface.
- **Premium UI**: A stunning "Neon" aesthetic with glassmorphism, mesh gradients, and smooth animations.
- **Dark Mode**: Fully supported dark mode for late-night productivity sessions.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) & [Framer Motion](https://www.framer.com/motion/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) with [Prisma ORM](https://www.prisma.io/)
- **Auth**: [NextAuth.js](https://next-auth.js.org/)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/) & [Lucide Icons](https://lucide.dev/)
- **Charts**: [Recharts](https://recharts.org/)

## 🏁 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (local or cloud)

### Installation

1.  **Clone the repository**

    ```bash
    git clone https://github.com/yourusername/taskwise.git
    cd taskwise
    ```

2.  **Install dependencies**

    ```bash
    npm install
    ```

3.  **Set up Environment Variables**

    Create a `.env` file in the root directory and add the following:

    ```env
    DATABASE_URL="postgresql://user:password@localhost:5432/taskwise?schema=public"
    NEXTAUTH_SECRET="your-super-secret-key"
    NEXTAUTH_URL="http://localhost:3000"
    ```

4.  **Initialize Database**

    ```bash
    npx prisma generate
    npx prisma db push
    ```

5.  **Run Development Server**

    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) to see the app.

## 🚀 Deployment

The easiest way to deploy TaskWise is using [Vercel](https://vercel.com).

1.  Push your code to a GitHub repository.
2.  Import the project in Vercel.
3.  Add your **Environment Variables** (`DATABASE_URL`, `NEXTAUTH_SECRET`, etc.) in the Vercel project settings.
4.  Click **Deploy**.

For more details, check out the [Next.js Deployment Documentation](https://nextjs.org/docs/deployment).

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
