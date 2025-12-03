import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Clear existing data
  await prisma.photo.deleteMany()
  await prisma.carpark.deleteMany()

  // Sample Singapore carparks with motorcycle parking
  const carparks = [
    // Orchard/CBD area
    {
      name: "Orchard Central Motorcycle Parking",
      address: "181 Orchard Road, Singapore 238896",
      lat: 1.3007,
      lng: 103.8398,
      type: "MALL",
      motorcycleAllowed: true,
      carAllowed: false,
      totalMotoLots: 50,
      covered: true,
      pricingNotes: "$0.50 per hour",
      openingHours: "24/7"
    },
    {
      name: "Tangs Plaza Basement Motorcycle Lot",
      address: "310 Orchard Road, Singapore 238864",
      lat: 1.3049,
      lng: 103.8328,
      type: "MALL",
      motorcycleAllowed: true,
      carAllowed: true,
      totalMotoLots: 30,
      covered: true,
      pricingNotes: "$0.40 per hour for motorcycles",
      openingHours: "10:00 AM - 10:00 PM"
    },
    {
      name: "Somerset 313 Motorcycle Parking",
      address: "313 Orchard Road, Singapore 238895",
      lat: 1.3011,
      lng: 103.8383,
      type: "MALL",
      motorcycleAllowed: true,
      carAllowed: true,
      totalMotoLots: 25,
      covered: true,
      pricingNotes: "$0.30 per hour",
      entranceNotes: "Entrance via side alley"
    },

    // Heartlands - Yishun
    {
      name: "Yishun MRT Motorcycle Parking",
      address: "301 Yishun Ave 2, Singapore 769093",
      lat: 1.4294,
      lng: 103.8354,
      type: "PUBLIC",
      motorcycleAllowed: true,
      carAllowed: true,
      totalMotoLots: 40,
      covered: false,
      pricingNotes: "$0.20 per hour for motorcycles",
      openingHours: "24/7"
    },
    {
      name: "Northpoint City Motorcycle Lot",
      address: "930 Yishun Ave 2, Singapore 769098",
      lat: 1.4296,
      lng: 103.8363,
      type: "MALL",
      motorcycleAllowed: true,
      carAllowed: true,
      totalMotoLots: 60,
      covered: true,
      pricingNotes: "$0.50 per hour"
    },

    // Jurong East
    {
      name: "Jurong East MRT Motorcycle Parking",
      address: "10 Jurong East Street 12, Singapore 609690",
      lat: 1.3333,
      lng: 103.7423,
      type: "PUBLIC",
      motorcycleAllowed: true,
      carAllowed: true,
      totalMotoLots: 35,
      covered: false,
      pricingNotes: "$0.15 per hour",
      openingHours: "24/7"
    },
    {
      name: "Westgate Motorcycle Lot",
      address: "3 Gateway Drive, Singapore 608532",
      lat: 1.3341,
      lng: 103.7427,
      type: "MALL",
      motorcycleAllowed: true,
      carAllowed: true,
      totalMotoLots: 45,
      covered: true,
      pricingNotes: "$0.40 per hour"
    },
    {
      name: "JEM Motorcycle Parking",
      address: "50 Jurong Gateway Road, Singapore 608549",
      lat: 1.3329,
      lng: 103.7436,
      type: "MALL",
      motorcycleAllowed: true,
      carAllowed: true,
      totalMotoLots: 60,
      covered: true,
      pricingNotes: "$0.50 per hour"
    },
    {
      name: "IMM Building Motorcycle Lot",
      address: "2 Jurong East Street 21, Singapore 609601",
      lat: 1.3349,
      lng: 103.7466,
      type: "MALL",
      motorcycleAllowed: true,
      carAllowed: true,
      totalMotoLots: 100,
      covered: true,
      pricingNotes: "$0.40 per hour"
    },

    // Bukit Batok
    {
      name: "Bukit Batok MRT Motorcycle Parking",
      address: "Bukit Batok Central, Singapore 659002",
      lat: 1.3489,
      lng: 103.7495,
      type: "PUBLIC",
      motorcycleAllowed: true,
      carAllowed: true,
      totalMotoLots: 40,
      covered: false,
      pricingNotes: "$0.65 per 30 min",
      openingHours: "24/7"
    },
    {
      name: "West Mall Motorcycle Parking",
      address: "1 Bukit Batok Central Link, Singapore 658713",
      lat: 1.3496,
      lng: 103.7497,
      type: "MALL",
      motorcycleAllowed: true,
      carAllowed: true,
      totalMotoLots: 50,
      covered: true,
      pricingNotes: "$0.50 per hour"
    },
    {
      name: "Bukit Batok West Ave 6 HDB Carpark",
      address: "Blk 288 Bukit Batok West Ave 6, Singapore 650288",
      lat: 1.3502,
      lng: 103.7423,
      type: "HDB",
      motorcycleAllowed: true,
      carAllowed: true,
      totalMotoLots: 25,
      covered: false,
      pricingNotes: "$0.65 per 30 min"
    },
    {
      name: "Bukit Batok East Ave 3 HDB Carpark",
      address: "Blk 267 Bukit Batok East Ave 3, Singapore 650267",
      lat: 1.3516,
      lng: 103.7548,
      type: "HDB",
      motorcycleAllowed: true,
      carAllowed: true,
      totalMotoLots: 20,
      covered: false,
      pricingNotes: "$0.65 per 30 min"
    },
    {
      name: "Le Quest Mall Motorcycle Parking",
      address: "4 Bukit Batok Street 41, Singapore 657991",
      lat: 1.3434,
      lng: 103.7459,
      type: "MALL",
      motorcycleAllowed: true,
      carAllowed: true,
      totalMotoLots: 30,
      covered: true,
      pricingNotes: "$0.50 per hour"
    },

    // Bukit Panjang
    {
      name: "Bukit Panjang MRT Motorcycle Parking",
      address: "Bukit Panjang Road, Singapore 679912",
      lat: 1.3784,
      lng: 103.7618,
      type: "PUBLIC",
      motorcycleAllowed: true,
      carAllowed: false,
      totalMotoLots: 30,
      covered: true,
      pricingNotes: "$0.65 per 30 min"
    },
    {
      name: "Hillion Mall Motorcycle Parking",
      address: "17 Petir Road, Singapore 678278",
      lat: 1.3779,
      lng: 103.7632,
      type: "MALL",
      motorcycleAllowed: true,
      carAllowed: true,
      totalMotoLots: 45,
      covered: true,
      pricingNotes: "$0.50 per hour"
    },
    {
      name: "Junction 10 Motorcycle Parking",
      address: "1 Woodlands Road, Singapore 677899",
      lat: 1.3788,
      lng: 103.7628,
      type: "MALL",
      motorcycleAllowed: true,
      carAllowed: true,
      totalMotoLots: 35,
      covered: true,
      pricingNotes: "$0.50 per hour"
    },

    // Choa Chu Kang
    {
      name: "Choa Chu Kang MRT Motorcycle Parking",
      address: "Choa Chu Kang Ave 4, Singapore 689811",
      lat: 1.3853,
      lng: 103.7445,
      type: "PUBLIC",
      motorcycleAllowed: true,
      carAllowed: true,
      totalMotoLots: 50,
      covered: false,
      pricingNotes: "$0.65 per 30 min"
    },
    {
      name: "Lot One Shoppers' Mall Motorcycle Parking",
      address: "21 Choa Chu Kang Ave 4, Singapore 689812",
      lat: 1.3850,
      lng: 103.7441,
      type: "MALL",
      motorcycleAllowed: true,
      carAllowed: true,
      totalMotoLots: 70,
      covered: true,
      pricingNotes: "$0.50 per hour"
    },

    // Clementi
    {
      name: "Clementi MRT Motorcycle Parking",
      address: "Clementi Ave 3, Singapore 129905",
      lat: 1.3150,
      lng: 103.7653,
      type: "PUBLIC",
      motorcycleAllowed: true,
      carAllowed: true,
      totalMotoLots: 40,
      covered: false,
      pricingNotes: "$0.65 per 30 min"
    },
    {
      name: "Clementi Mall Motorcycle Parking",
      address: "3155 Commonwealth Ave West, Singapore 129588",
      lat: 1.3149,
      lng: 103.7643,
      type: "MALL",
      motorcycleAllowed: true,
      carAllowed: true,
      totalMotoLots: 55,
      covered: true,
      pricingNotes: "$0.50 per hour"
    },

    // Woodlands
    {
      name: "Woodlands MRT Motorcycle Parking",
      address: "30 Woodlands Ave 2, Singapore 738343",
      lat: 1.4369,
      lng: 103.7864,
      type: "PUBLIC",
      motorcycleAllowed: true,
      carAllowed: true,
      totalMotoLots: 60,
      covered: false,
      pricingNotes: "$0.65 per 30 min"
    },
    {
      name: "Causeway Point Motorcycle Parking",
      address: "1 Woodlands Square, Singapore 738099",
      lat: 1.4360,
      lng: 103.7858,
      type: "MALL",
      motorcycleAllowed: true,
      carAllowed: true,
      totalMotoLots: 80,
      covered: true,
      pricingNotes: "$0.50 per hour"
    },

    // Tampines
    {
      name: "Tampines MRT Motorcycle Parking",
      address: "Tampines Central 5, Singapore 529510",
      lat: 1.3535,
      lng: 103.9447,
      type: "PUBLIC",
      motorcycleAllowed: true,
      carAllowed: true,
      totalMotoLots: 50,
      covered: false,
      pricingNotes: "$0.65 per 30 min"
    },
    {
      name: "Tampines Mall Motorcycle Parking",
      address: "4 Tampines Central 5, Singapore 529510",
      lat: 1.3532,
      lng: 103.9450,
      type: "MALL",
      motorcycleAllowed: true,
      carAllowed: true,
      totalMotoLots: 70,
      covered: true,
      pricingNotes: "$0.50 per hour"
    },
    {
      name: "Tampines 1 Motorcycle Parking",
      address: "10 Tampines Central 1, Singapore 529536",
      lat: 1.3542,
      lng: 103.9433,
      type: "MALL",
      motorcycleAllowed: true,
      carAllowed: true,
      totalMotoLots: 45,
      covered: true,
      pricingNotes: "$0.50 per hour"
    },

    // Bedok
    {
      name: "Bedok MRT Motorcycle Parking",
      address: "Bedok North Road, Singapore 469658",
      lat: 1.3240,
      lng: 103.9300,
      type: "PUBLIC",
      motorcycleAllowed: true,
      carAllowed: true,
      totalMotoLots: 40,
      covered: false,
      pricingNotes: "$0.65 per 30 min"
    },
    {
      name: "Bedok Mall Motorcycle Parking",
      address: "311 New Upper Changi Road, Singapore 467360",
      lat: 1.3244,
      lng: 103.9297,
      type: "MALL",
      motorcycleAllowed: true,
      carAllowed: true,
      totalMotoLots: 60,
      covered: true,
      pricingNotes: "$0.50 per hour"
    },

    // Bishan
    {
      name: "Bishan MRT Motorcycle Parking",
      address: "Bishan Place, Singapore 579838",
      lat: 1.3513,
      lng: 103.8489,
      type: "PUBLIC",
      motorcycleAllowed: true,
      carAllowed: true,
      totalMotoLots: 35,
      covered: false,
      pricingNotes: "$0.65 per 30 min"
    },
    {
      name: "Junction 8 Motorcycle Parking",
      address: "9 Bishan Place, Singapore 579837",
      lat: 1.3508,
      lng: 103.8485,
      type: "MALL",
      motorcycleAllowed: true,
      carAllowed: true,
      totalMotoLots: 50,
      covered: true,
      pricingNotes: "$0.50 per hour"
    },

    // Hougang
    {
      name: "Hougang MRT Motorcycle Parking",
      address: "Hougang Ave 1, Singapore 538832",
      lat: 1.3712,
      lng: 103.8923,
      type: "PUBLIC",
      motorcycleAllowed: true,
      carAllowed: true,
      totalMotoLots: 30,
      covered: false,
      pricingNotes: "$0.65 per 30 min"
    },
    {
      name: "Hougang Mall Motorcycle Parking",
      address: "90 Hougang Ave 10, Singapore 538766",
      lat: 1.3722,
      lng: 103.8939,
      type: "MALL",
      motorcycleAllowed: true,
      carAllowed: true,
      totalMotoLots: 45,
      covered: true,
      pricingNotes: "$0.50 per hour"
    },

    // Sengkang
    {
      name: "Sengkang MRT Motorcycle Parking",
      address: "Sengkang Square, Singapore 545025",
      lat: 1.3916,
      lng: 103.8955,
      type: "PUBLIC",
      motorcycleAllowed: true,
      carAllowed: true,
      totalMotoLots: 45,
      covered: false,
      pricingNotes: "$0.65 per 30 min"
    },
    {
      name: "Compass One Motorcycle Parking",
      address: "1 Sengkang Square, Singapore 545078",
      lat: 1.3923,
      lng: 103.8948,
      type: "MALL",
      motorcycleAllowed: true,
      carAllowed: true,
      totalMotoLots: 60,
      covered: true,
      pricingNotes: "$0.50 per hour"
    },

    // Punggol
    {
      name: "Punggol MRT Motorcycle Parking",
      address: "Punggol Central, Singapore 828761",
      lat: 1.4052,
      lng: 103.9023,
      type: "PUBLIC",
      motorcycleAllowed: true,
      carAllowed: true,
      totalMotoLots: 50,
      covered: false,
      pricingNotes: "$0.65 per 30 min"
    },
    {
      name: "Waterway Point Motorcycle Parking",
      address: "83 Punggol Central, Singapore 828761",
      lat: 1.4062,
      lng: 103.9019,
      type: "MALL",
      motorcycleAllowed: true,
      carAllowed: true,
      totalMotoLots: 80,
      covered: true,
      pricingNotes: "$0.50 per hour"
    },

    // Other locations
    {
      name: "Changi Airport Terminal 2 Motorcycle Parking",
      address: "60 Airport Boulevard, Singapore 819643",
      lat: 1.3554,
      lng: 103.9869,
      type: "PUBLIC",
      motorcycleAllowed: true,
      carAllowed: true,
      totalMotoLots: 80,
      covered: true,
      pricingNotes: "$1.00 per hour",
      openingHours: "24/7"
    },
    {
      name: "Marina Bay Sands Motorcycle Lot",
      address: "10 Bayfront Ave, Singapore 018956",
      lat: 1.2834,
      lng: 103.8607,
      type: "OTHER",
      motorcycleAllowed: true,
      carAllowed: true,
      totalMotoLots: 70,
      covered: true,
      pricingNotes: "$1.50 per hour",
      entranceNotes: "Basement level 2"
    },
    {
      name: "Sentosa Island Motorcycle Parking",
      address: "Sentosa Island, Singapore 098269",
      lat: 1.2494,
      lng: 103.8303,
      type: "PUBLIC",
      motorcycleAllowed: true,
      carAllowed: true,
      totalMotoLots: 55,
      covered: false,
      seasonOnly: true,
      pricingNotes: "$0.30 per hour (seasonal)",
      openingHours: "8:00 AM - 8:00 PM"
    },

    // HDB carparks with motorcycle lots
    {
      name: "Block 123 Toa Payoh Motorcycle Lot",
      address: "123 Lor 2 Toa Payoh, Singapore 310123",
      lat: 1.3386,
      lng: 103.8497,
      type: "HDB",
      motorcycleAllowed: true,
      carAllowed: true,
      totalMotoLots: 20,
      covered: false,
      pricingNotes: "$0.10 per hour for residents",
      openingHours: "24/7"
    },
    {
      name: "Ang Mo Kio Ave 3 Motorcycle Parking",
      address: "456 Ang Mo Kio Ave 3, Singapore 560456",
      lat: 1.3691,
      lng: 103.8496,
      type: "HDB",
      motorcycleAllowed: true,
      carAllowed: true,
      totalMotoLots: 25,
      covered: false,
      pricingNotes: "$0.12 per hour",
      openingHours: "24/7"
    },

    // Office buildings
    {
      name: "One Raffles Place Motorcycle Lot",
      address: "1 Raffles Place, Singapore 048616",
      lat: 1.2849,
      lng: 103.8513,
      type: "OFFICE",
      motorcycleAllowed: true,
      carAllowed: true,
      totalMotoLots: 40,
      covered: true,
      pricingNotes: "$1.20 per hour",
      openingHours: "7:00 AM - 7:00 PM"
    }
  ]

  // Insert carparks
  for (const carparkData of carparks) {
    await prisma.carpark.create({
      data: carparkData
    })
  }

  // Add some sample photos
  const carparksWithPhotos = await prisma.carpark.findMany({
    where: {
      type: { in: ["MALL", "OFFICE"] }
    },
    take: 3
  })

  for (const carpark of carparksWithPhotos) {
    await prisma.photo.create({
      data: {
        carparkId: carpark.id,
        url: `https://picsum.photos/400/300?random=${Math.floor(Math.random() * 1000)}`,
        caption: `${carpark.name} entrance view`
      }
    })
  }

  console.log('Database seeded successfully!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
