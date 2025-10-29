import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 12);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@climateplatform.com' },
    update: {},
    create: {
      email: 'admin@climateplatform.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      company: 'Climate Platform',
      role: 'ADMIN',
    },
  });

  console.log('✅ Admin user created:', adminUser.email);

  // Create demo user
  const demoPassword = await bcrypt.hash('demo123', 12);
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      email: 'demo@example.com',
      password: demoPassword,
      firstName: 'Demo',
      lastName: 'User',
      company: 'Demo Company',
      role: 'USER',
    },
  });

  console.log('✅ Demo user created:', demoUser.email);

  // Create climate benchmarks
  const benchmarks = [
    // Power sector benchmarks
    {
      sector: 'power',
      technology: 'renewables',
      scenario: 'nze_2050',
      year: 2030,
      targetValue: 70,
      unit: '%',
      source: 'IEA Net Zero by 2050',
      description: 'Share of renewable electricity generation by 2030',
    },
    {
      sector: 'power',
      technology: 'renewables',
      scenario: 'nze_2050',
      year: 2050,
      targetValue: 95,
      unit: '%',
      source: 'IEA Net Zero by 2050',
      description: 'Share of renewable electricity generation by 2050',
    },
    {
      sector: 'power',
      technology: 'coal',
      scenario: 'nze_2050',
      year: 2030,
      targetValue: 5,
      unit: '%',
      source: 'IEA Net Zero by 2050',
      description: 'Share of coal in electricity generation by 2030',
    },
    {
      sector: 'power',
      technology: 'coal',
      scenario: 'nze_2050',
      year: 2050,
      targetValue: 0,
      unit: '%',
      source: 'IEA Net Zero by 2050',
      description: 'Share of coal in electricity generation by 2050',
    },
    // Automotive sector benchmarks
    {
      sector: 'automotive',
      technology: 'electric',
      scenario: 'nze_2050',
      year: 2030,
      targetValue: 50,
      unit: '%',
      source: 'IEA Net Zero by 2050',
      description: 'Share of electric vehicle sales by 2030',
    },
    {
      sector: 'automotive',
      technology: 'electric',
      scenario: 'nze_2050',
      year: 2050,
      targetValue: 100,
      unit: '%',
      source: 'IEA Net Zero by 2050',
      description: 'Share of electric vehicle sales by 2050',
    },
    {
      sector: 'automotive',
      technology: 'ice',
      scenario: 'nze_2050',
      year: 2030,
      targetValue: 50,
      unit: '%',
      source: 'IEA Net Zero by 2050',
      description: 'Share of internal combustion engine vehicle sales by 2030',
    },
    {
      sector: 'automotive',
      technology: 'ice',
      scenario: 'nze_2050',
      year: 2050,
      targetValue: 0,
      unit: '%',
      source: 'IEA Net Zero by 2050',
      description: 'Share of internal combustion engine vehicle sales by 2050',
    },
    // Steel sector benchmarks
    {
      sector: 'steel',
      technology: 'hydrogen',
      scenario: 'nze_2050',
      year: 2030,
      targetValue: 15,
      unit: '%',
      source: 'IEA Net Zero by 2050',
      description: 'Share of hydrogen-based steel production by 2030',
    },
    {
      sector: 'steel',
      technology: 'hydrogen',
      scenario: 'nze_2050',
      year: 2050,
      targetValue: 70,
      unit: '%',
      source: 'IEA Net Zero by 2050',
      description: 'Share of hydrogen-based steel production by 2050',
    },
  ];

  for (const benchmark of benchmarks) {
    await prisma.climateBenchmark.upsert({
      where: {
        sector_technology_scenario_year: {
          sector: benchmark.sector,
          technology: benchmark.technology,
          scenario: benchmark.scenario,
          year: benchmark.year,
        },
      },
      update: {},
      create: benchmark,
    });
  }

  console.log('✅ Climate benchmarks created:', benchmarks.length);

  // Create sample assessment
  const sampleAssessment = await prisma.assessment.create({
    data: {
      userId: demoUser.id,
      companyName: 'Green Energy Corp',
      sector: 'Energy',
      revenue: 50000000,
      employees: 250,
      geography: 'Europe',
      status: 'COMPLETED',
      currentStep: 5,
      totalSteps: 5,
      assessmentData: {
        step1: {
          businessModel: 'Renewable energy generation',
          primaryRevenue: 'Electricity sales',
          geographicalPresence: ['Germany', 'Netherlands', 'Denmark'],
        },
        step2: {
          physicalRisks: {
            extremeWeather: 'medium',
            seaLevelRise: 'low',
            temperatureChanges: 'high',
          },
        },
        step3: {
          transitionRisks: {
            carbonPricing: 'medium',
            regulatoryChanges: 'high',
            technologyDisruption: 'low',
          },
        },
        step4: {
          opportunities: {
            newMarkets: 'high',
            resourceEfficiency: 'medium',
            cleanTechnology: 'high',
          },
        },
        step5: {
          financialImpacts: {
            revenueAtRisk: 15,
            costIncrease: 8,
            capitalRequirement: 25000000,
          },
        },
      },
      riskScores: {
        physical: 65,
        transition: 45,
        overall: 55,
      },
      recommendations: [
        'Diversify renewable energy portfolio',
        'Invest in energy storage solutions',
        'Develop climate adaptation strategies',
      ],
      completedAt: new Date(),
    },
  });

  console.log('✅ Sample assessment created:', sampleAssessment.id);

  console.log('🎉 Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });