import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // Create a test user
  const hashedPassword = await bcrypt.hash("password123", 10);

  const user = await prisma.user.upsert({
    where: { email: "vivekkumarjnv054@gmail.com" },
    update: {},
    create: {
      email: "vivekkumarjnv054@gmail.com",
      name: "Vivek Kumar",
      password: hashedPassword,
      emailVerified: new Date(),
    },
  });

  console.log("✅ Created user:", user.email);

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { userId_name: { userId: user.id, name: "Work" } },
      update: {},
      create: {
        userId: user.id,
        name: "Work",
        color: "blue",
      },
    }),
    prisma.category.upsert({
      where: { userId_name: { userId: user.id, name: "Personal" } },
      update: {},
      create: {
        userId: user.id,
        name: "Personal",
        color: "green",
      },
    }),
    prisma.category.upsert({
      where: { userId_name: { userId: user.id, name: "Learning" } },
      update: {},
      create: {
        userId: user.id,
        name: "Learning",
        color: "purple",
      },
    }),
    prisma.category.upsert({
      where: { userId_name: { userId: user.id, name: "Health" } },
      update: {},
      create: {
        userId: user.id,
        name: "Health",
        color: "red",
      },
    }),
  ]);

  console.log("✅ Created categories:", categories.length);

  // Helper function to get random date
  const getRandomDate = (daysOffset: number) => {
    const date = new Date();
    date.setDate(date.getDate() + daysOffset);
    return date;
  };

  // Create 20 realistic tasks
  const tasks = [
    // High Priority - Work
    {
      title: "Complete Q4 financial report",
      description:
        "Prepare and finalize the quarterly financial report for stakeholders",
      priority: "high",
      deadline: getRandomDate(2),
      completed: false,
      categoryId: categories[0].id,
      estimatedDuration: 180, // 3 hours in minutes
    },
    {
      title: "Review and approve marketing campaign",
      description:
        "Review the new product launch marketing materials and provide feedback",
      priority: "high",
      deadline: getRandomDate(1),
      completed: false,
      categoryId: categories[0].id,
      estimatedDuration: 90,
    },
    {
      title: "Client presentation preparation",
      description:
        "Create slides and talking points for the upcoming client meeting",
      priority: "high",
      deadline: getRandomDate(3),
      completed: false,
      categoryId: categories[0].id,
      estimatedDuration: 120,
    },

    // Medium Priority - Work
    {
      title: "Update project documentation",
      description:
        "Update the README and API documentation for the latest release",
      priority: "medium",
      deadline: getRandomDate(7),
      completed: false,
      categoryId: categories[0].id,
      estimatedDuration: 60,
    },
    {
      title: "Code review for PR #234",
      description: "Review the authentication refactor pull request",
      priority: "medium",
      deadline: getRandomDate(5),
      completed: true,
      categoryId: categories[0].id,
      estimatedDuration: 45,
    },
    {
      title: "Team standup meeting",
      description: "Daily team sync to discuss progress and blockers",
      priority: "medium",
      deadline: getRandomDate(0),
      completed: true,
      categoryId: categories[0].id,
      estimatedDuration: 15,
    },
    {
      title: "Refactor authentication module",
      description: "Improve code quality and add better error handling",
      priority: "medium",
      deadline: getRandomDate(10),
      completed: false,
      categoryId: categories[0].id,
      estimatedDuration: 240,
    },

    // Low Priority - Work
    {
      title: "Organize project files",
      description: "Clean up and reorganize the shared drive folders",
      priority: "low",
      deadline: getRandomDate(14),
      completed: false,
      categoryId: categories[0].id,
      estimatedDuration: 30,
    },
    {
      title: "Update team wiki",
      description: "Add new onboarding documentation for new team members",
      priority: "low",
      deadline: getRandomDate(20),
      completed: false,
      categoryId: categories[0].id,
      estimatedDuration: 60,
    },

    // Personal Tasks
    {
      title: "Grocery shopping",
      description: "Buy groceries for the week - milk, eggs, bread, vegetables",
      priority: "medium",
      deadline: getRandomDate(1),
      completed: false,
      categoryId: categories[1].id,
      estimatedDuration: 60,
    },
    {
      title: "Schedule dentist appointment",
      description: "Call the dentist office and book a checkup appointment",
      priority: "high",
      deadline: getRandomDate(2),
      completed: false,
      categoryId: categories[1].id,
      estimatedDuration: 15,
    },
    {
      title: "Pay utility bills",
      description: "Pay electricity, water, and internet bills before due date",
      priority: "high",
      deadline: getRandomDate(3),
      completed: true,
      categoryId: categories[1].id,
      estimatedDuration: 20,
    },
    {
      title: "Plan weekend trip",
      description: "Research and book accommodation for the mountain trip",
      priority: "low",
      deadline: getRandomDate(15),
      completed: false,
      categoryId: categories[1].id,
      estimatedDuration: 90,
    },

    // Learning Tasks
    {
      title: "Complete React Advanced Patterns course",
      description:
        "Finish modules 8-10 on compound components and render props",
      priority: "medium",
      deadline: getRandomDate(7),
      completed: false,
      categoryId: categories[2].id,
      estimatedDuration: 180,
    },
    {
      title: 'Read "Clean Code" chapters 5-7',
      description: "Continue reading the clean code book and take notes",
      priority: "low",
      deadline: getRandomDate(10),
      completed: false,
      categoryId: categories[2].id,
      estimatedDuration: 120,
    },
    {
      title: "Practice LeetCode problems",
      description: "Solve 5 medium difficulty algorithm problems",
      priority: "medium",
      deadline: getRandomDate(5),
      completed: true,
      categoryId: categories[2].id,
      estimatedDuration: 90,
    },

    // Health Tasks
    {
      title: "Morning workout routine",
      description: "30 minutes cardio and strength training",
      priority: "high",
      deadline: getRandomDate(0),
      completed: true,
      categoryId: categories[3].id,
      estimatedDuration: 30,
    },
    {
      title: "Meal prep for the week",
      description: "Prepare healthy meals for Monday through Friday",
      priority: "medium",
      deadline: getRandomDate(1),
      completed: false,
      categoryId: categories[3].id,
      estimatedDuration: 120,
    },
    {
      title: "Evening meditation",
      description: "15 minutes of mindfulness meditation before bed",
      priority: "low",
      deadline: getRandomDate(0),
      completed: false,
      categoryId: categories[3].id,
      estimatedDuration: 15,
    },
    {
      title: "Track daily water intake",
      description: "Drink at least 8 glasses of water throughout the day",
      priority: "medium",
      deadline: getRandomDate(0),
      completed: true,
      categoryId: categories[3].id,
      estimatedDuration: 5,
    },
  ];

  const createdTasks = await Promise.all(
    tasks.map((task, index) =>
      prisma.task.create({
        data: {
          ...task,
          userId: user.id,
          order: index,
        },
      })
    )
  );

  console.log("✅ Created tasks:", createdTasks.length);

  // Create some subtasks for a few tasks
  const subtasks = [
    {
      taskId: createdTasks[0].id,
      title: "Gather financial data",
      completed: true,
      order: 0,
    },
    {
      taskId: createdTasks[0].id,
      title: "Create charts and graphs",
      completed: true,
      order: 1,
    },
    {
      taskId: createdTasks[0].id,
      title: "Write executive summary",
      completed: false,
      order: 2,
    },
    {
      taskId: createdTasks[0].id,
      title: "Review with CFO",
      completed: false,
      order: 3,
    },

    {
      taskId: createdTasks[2].id,
      title: "Research competitor products",
      completed: true,
      order: 0,
    },
    {
      taskId: createdTasks[2].id,
      title: "Create presentation outline",
      completed: false,
      order: 1,
    },
    {
      taskId: createdTasks[2].id,
      title: "Design slides",
      completed: false,
      order: 2,
    },

    {
      taskId: createdTasks[13].id,
      title: "Watch module 8 videos",
      completed: true,
      order: 0,
    },
    {
      taskId: createdTasks[13].id,
      title: "Complete module 8 exercises",
      completed: false,
      order: 1,
    },
    {
      taskId: createdTasks[13].id,
      title: "Watch module 9 videos",
      completed: false,
      order: 2,
    },
  ];

  await Promise.all(
    subtasks.map((subtask) =>
      prisma.subtask.create({
        data: subtask,
      })
    )
  );

  console.log("✅ Created subtasks:", subtasks.length);

  // Create some focus sessions for completed tasks
  const now = new Date();
  const focusSessions = [
    // Sessions for "Code review for PR #234" (completed)
    {
      userId: user.id,
      taskId: createdTasks[4].id,
      duration: 2700, // 45 minutes in seconds
      startedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      endedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000 + 2700 * 1000),
      notes: "Reviewed authentication changes, looks good overall",
      completed: true,
    },

    // Sessions for "Team standup meeting" (completed)
    {
      userId: user.id,
      taskId: createdTasks[5].id,
      duration: 900, // 15 minutes
      startedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      endedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000 + 900 * 1000),
      notes: "Discussed sprint progress and upcoming deadlines",
      completed: true,
    },

    // Sessions for "Pay utility bills" (completed)
    {
      userId: user.id,
      taskId: createdTasks[11].id,
      duration: 1200, // 20 minutes
      startedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      endedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000 + 1200 * 1000),
      notes: "Paid all bills online, saved confirmation numbers",
      completed: true,
    },

    // Sessions for "Practice LeetCode problems" (completed)
    {
      userId: user.id,
      taskId: createdTasks[15].id,
      duration: 5400, // 90 minutes
      startedAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
      endedAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000 + 5400 * 1000),
      notes: "Solved binary tree and dynamic programming problems",
      completed: true,
    },

    // Sessions for "Morning workout routine" (completed)
    {
      userId: user.id,
      taskId: createdTasks[16].id,
      duration: 1800, // 30 minutes
      startedAt: new Date(now.getTime() - 6 * 60 * 60 * 1000), // 6 hours ago
      endedAt: new Date(now.getTime() - 5.5 * 60 * 60 * 1000),
      notes: "Great workout session, feeling energized!",
      completed: true,
    },

    // Sessions for "Track daily water intake" (completed)
    {
      userId: user.id,
      taskId: createdTasks[19].id,
      duration: 300, // 5 minutes
      startedAt: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
      endedAt: new Date(now.getTime() - 1.95 * 60 * 60 * 1000),
      notes: "Tracked water intake in app",
      completed: true,
    },

    // Additional sessions spread over the past week
    {
      userId: user.id,
      taskId: createdTasks[0].id,
      duration: 3600, // 1 hour
      startedAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
      endedAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000 + 3600 * 1000),
      notes: "Started gathering financial data for Q4 report",
      completed: true,
    },

    {
      userId: user.id,
      taskId: createdTasks[13].id,
      duration: 2700, // 45 minutes
      startedAt: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000),
      endedAt: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000 + 2700 * 1000),
      notes: "Completed module 8 videos, very informative",
      completed: true,
    },
  ];

  await Promise.all(
    focusSessions.map((session) =>
      prisma.focusSession.create({
        data: session,
      })
    )
  );

  console.log("✅ Created focus sessions:", focusSessions.length);

  console.log("🎉 Database seeding completed successfully!");
  console.log("\n📊 Summary:");
  console.log(`   - Users: 1`);
  console.log(`   - Categories: ${categories.length}`);
  console.log(`   - Tasks: ${createdTasks.length}`);
  console.log(`   - Subtasks: ${subtasks.length}`);
  console.log(`   - Focus Sessions: ${focusSessions.length}`);
  console.log("\n🔐 Test User Credentials:");
  console.log(`   Email: vivekkumarjnv054@gmail.com`);
  console.log(`   Password: password123`);
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
