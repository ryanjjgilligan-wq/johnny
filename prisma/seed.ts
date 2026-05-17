import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Reusable Unsplash photo pools (dog-friendly backyards & lawns)
const yardPhotoPool = [
  "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1200&q=80",
  "https://images.unsplash.com/photo-1568355099915-0e4e3d39b4ad?w=1200&q=80",
  "https://images.unsplash.com/photo-1605547800101-7bb1a55e0caf?w=1200&q=80",
  "https://images.unsplash.com/photo-1564540586988-aa4e53c3d799?w=1200&q=80",
  "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=1200&q=80",
  "https://images.unsplash.com/photo-1601758125946-6ec2ef64daf8?w=1200&q=80",
  "https://images.unsplash.com/photo-1597633425046-08f5110420b5?w=1200&q=80",
  "https://images.unsplash.com/photo-1583511655826-05700d52f4d9?w=1200&q=80",
  "https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=1200&q=80",
  "https://images.unsplash.com/photo-1530041539828-114de669390e?w=1200&q=80",
  "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=1200&q=80",
  "https://images.unsplash.com/photo-1568393691080-c1cf16f01406?w=1200&q=80",
  "https://images.unsplash.com/photo-1546238232-20216dec9f72?w=1200&q=80",
  "https://images.unsplash.com/photo-1571566882372-1598d88abd90?w=1200&q=80",
  "https://images.unsplash.com/photo-1542204165-65bf26472b9b?w=1200&q=80",
  "https://images.unsplash.com/photo-1545152783-3b6f2c33f8d2?w=1200&q=80",
  "https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=1200&q=80",
  "https://images.unsplash.com/photo-1559066653-edfd1e6bd649?w=1200&q=80",
  "https://images.unsplash.com/photo-1626247214064-d3c98f4d4b9d?w=1200&q=80",
  "https://images.unsplash.com/photo-1591389703635-e15a07b842d7?w=1200&q=80",
];

function pickPhotos(seed: number, count = 5): string[] {
  const out: string[] = [];
  for (let i = 0; i < count; i++) {
    out.push(yardPhotoPool[(seed + i * 3) % yardPhotoPool.length]);
  }
  return out;
}

const hosts = [
  { name: "Sarah Chen", email: "sarah@barkyard.dev", image: "https://i.pravatar.cc/200?img=47", bio: "Dog mom of two goldens. I built a fully fenced yard with shade and a splash pad — perfect for hot days." },
  { name: "Marcus Reed", email: "marcus@barkyard.dev", image: "https://i.pravatar.cc/200?img=12", bio: "Landscape architect. My yard has full agility equipment and tons of room to zoom." },
  { name: "Priya Patel", email: "priya@barkyard.dev", image: "https://i.pravatar.cc/200?img=32", bio: "I host because I know how stressful dog parks can be. My yard is calm, quiet, and totally private." },
  { name: "Jake Morrison", email: "jake@barkyard.dev", image: "https://i.pravatar.cc/200?img=15", bio: "Former vet tech. Pool, shade, and a hose are always ready. Small-dog friendly." },
  { name: "Elena Rodriguez", email: "elena@barkyard.dev", image: "https://i.pravatar.cc/200?img=49", bio: "Three border collies live here. Yard is high-fenced and built for high-energy dogs." },
  { name: "Tom Whittaker", email: "tom@barkyard.dev", image: "https://i.pravatar.cc/200?img=11", bio: "Lakeside yard with water access. Best for water-loving pups." },
];

const guests = [
  { name: "Amelia Park", email: "amelia@barkyard.dev", image: "https://i.pravatar.cc/200?img=44" },
  { name: "Diego Alvarez", email: "diego@barkyard.dev", image: "https://i.pravatar.cc/200?img=33" },
  { name: "Hannah Brooks", email: "hannah@barkyard.dev", image: "https://i.pravatar.cc/200?img=48" },
  { name: "Kenji Tanaka", email: "kenji@barkyard.dev", image: "https://i.pravatar.cc/200?img=8" },
];

type YardSeed = {
  title: string;
  description: string;
  neighborhood: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
  pricePerHour: number;
  sqft: number;
  fenceHeight: number;
  maxDogs: number;
  amenities: string[];
  rules: string;
};

const yards: YardSeed[] = [
  // Seattle
  {
    title: "Fenced Half-Acre with Splash Pad",
    description: "A sun-drenched half-acre yard with a built-in splash pad your pup will not want to leave. Fully enclosed with 6ft cedar fencing on all sides, plus a covered patio for owners. Two large shade trees keep things cool even in August.",
    neighborhood: "Ballard",
    city: "Seattle",
    state: "WA",
    lat: 47.6685,
    lng: -122.3848,
    pricePerHour: 18,
    sqft: 21000,
    fenceHeight: 6,
    maxDogs: 4,
    amenities: ["fully_fenced", "shade", "water_access", "multiple_dogs", "off_leash", "small_dogs"],
    rules: "Please clean up after your dog. Bring your own toys. Fresh water provided.",
  },
  {
    title: "Shaded Garden Yard near Greenlake",
    description: "Quiet garden retreat tucked behind a craftsman home, three blocks from Greenlake. Mature maples shade the entire space — perfect for senior dogs or sensitive breeds. Soft grass throughout.",
    neighborhood: "Green Lake",
    city: "Seattle",
    state: "WA",
    lat: 47.6815,
    lng: -122.3286,
    pricePerHour: 14,
    sqft: 4800,
    fenceHeight: 5,
    maxDogs: 2,
    amenities: ["fully_fenced", "shade", "small_dogs"],
    rules: "Small to medium dogs only. No diggers please — gardens are dear to my heart.",
  },
  {
    title: "Agility Park with Full Course",
    description: "Built for athletes. Includes 6 weave poles, A-frame, tunnel, pause table, and three jumps. Open field at the back for fetch and zoomies. Astroturf in high-traffic areas.",
    neighborhood: "Magnolia",
    city: "Seattle",
    state: "WA",
    lat: 47.6498,
    lng: -122.3995,
    pricePerHour: 26,
    sqft: 14000,
    fenceHeight: 6,
    maxDogs: 3,
    amenities: ["fully_fenced", "agility", "off_leash", "multiple_dogs", "shade"],
    rules: "Equipment use at your own risk. Dogs must be reliable on recall.",
  },
  {
    title: "Cozy Suburban Yard for Small Pups",
    description: "A friendly, easy-going yard designed with little dogs in mind. 4ft picket fence, soft turf, low-height ramps, and plenty of toys. Bonus: a cuddle bench for owners.",
    neighborhood: "West Seattle",
    city: "Seattle",
    state: "WA",
    lat: 47.5707,
    lng: -122.3868,
    pricePerHour: 11,
    sqft: 2200,
    fenceHeight: 4,
    maxDogs: 2,
    amenities: ["fully_fenced", "small_dogs", "shade"],
    rules: "Dogs under 25 lbs please. Owners stay on-site.",
  },
  // Portland
  {
    title: "Wooded Acre with Stream Access",
    description: "A magical wooded acre with a year-round creek your dog can splash through. Trail loops through the property. Mostly natural ground — expect happy, muddy dogs.",
    neighborhood: "Sellwood",
    city: "Portland",
    state: "OR",
    lat: 45.4642,
    lng: -122.6543,
    pricePerHour: 22,
    sqft: 43000,
    fenceHeight: 6,
    maxDogs: 5,
    amenities: ["fully_fenced", "water_access", "shade", "multiple_dogs", "off_leash"],
    rules: "Towels provided. Please rinse muddy paws at the outdoor station before leaving.",
  },
  {
    title: "Pool Yard with Covered Patio",
    description: "Heated saltwater pool with a doggy ramp, fenced separately for safety. Spacious lawn around the pool, plus a covered patio with seating and a beverage fridge for humans.",
    neighborhood: "Laurelhurst",
    city: "Portland",
    state: "OR",
    lat: 45.5275,
    lng: -122.6225,
    pricePerHour: 32,
    sqft: 9500,
    fenceHeight: 6,
    maxDogs: 3,
    amenities: ["fully_fenced", "pool", "shade", "water_access"],
    rules: "Dogs in pool only with owner supervision. Bring a towel.",
  },
  {
    title: "Urban Backyard Escape",
    description: "Walled urban retreat tucked behind a Mississippi Ave bungalow. Compact but immaculate, with artificial turf, raised planter beds, and a serene fountain.",
    neighborhood: "Mississippi",
    city: "Portland",
    state: "OR",
    lat: 45.5538,
    lng: -122.6755,
    pricePerHour: 13,
    sqft: 1800,
    fenceHeight: 7,
    maxDogs: 2,
    amenities: ["fully_fenced", "shade", "small_dogs"],
    rules: "No more than 2 dogs at a time. Owners must remain on-site.",
  },
  {
    title: "Open Pasture for Zoomies",
    description: "Wide open pasture on the edge of town. Perfect for sighthounds, herding breeds, and any dog that needs to truly run. Field is fully fenced with welded wire.",
    neighborhood: "Multnomah",
    city: "Portland",
    state: "OR",
    lat: 45.4621,
    lng: -122.7148,
    pricePerHour: 20,
    sqft: 60000,
    fenceHeight: 5,
    maxDogs: 4,
    amenities: ["fully_fenced", "off_leash", "multiple_dogs"],
    rules: "Heads up — limited shade. Best for mornings and evenings in summer.",
  },
  // Austin
  {
    title: "Hill Country Yard with Pool",
    description: "Texas hill country views, a chilled saltwater pool, and a shaded oak grove. Built for hot days — misters and a kiddie pool too.",
    neighborhood: "Westlake",
    city: "Austin",
    state: "TX",
    lat: 30.2849,
    lng: -97.8214,
    pricePerHour: 28,
    sqft: 16000,
    fenceHeight: 6,
    maxDogs: 3,
    amenities: ["fully_fenced", "pool", "shade", "water_access", "multiple_dogs"],
    rules: "Please rinse off any sunscreen before pool play. Towels by the back door.",
  },
  {
    title: "South Austin Doggy Oasis",
    description: "A friendly local spot near Zilker. Soft St. Augustine grass, ample shade, a sandbox for diggers, and a shaded owner deck with hammock.",
    neighborhood: "Zilker",
    city: "Austin",
    state: "TX",
    lat: 30.2615,
    lng: -97.7711,
    pricePerHour: 16,
    sqft: 7500,
    fenceHeight: 6,
    maxDogs: 3,
    amenities: ["fully_fenced", "shade", "multiple_dogs", "small_dogs"],
    rules: "Fill in dig holes before you leave. Sandbox is fair game!",
  },
  {
    title: "East Side Modern Yard",
    description: "Sleek modern home with a designer backyard. Concrete and turf landscape, sculptural shade sail, and a long water trough dogs love to drink from.",
    neighborhood: "East Austin",
    city: "Austin",
    state: "TX",
    lat: 30.2672,
    lng: -97.7204,
    pricePerHour: 19,
    sqft: 4200,
    fenceHeight: 7,
    maxDogs: 3,
    amenities: ["fully_fenced", "shade", "water_access", "off_leash"],
    rules: "No chewing on the shade sail rope, please.",
  },
  {
    title: "Lakeside Yard with Dock Access",
    description: "Direct access to a quiet inlet on Lake Austin. Floating dog ramp, plenty of fetch room on the lawn, and a rinse-off station. Water dogs paradise.",
    neighborhood: "Tarrytown",
    city: "Austin",
    state: "TX",
    lat: 30.2972,
    lng: -97.7733,
    pricePerHour: 34,
    sqft: 11000,
    fenceHeight: 5,
    maxDogs: 3,
    amenities: ["fully_fenced", "water_access", "pool", "shade", "off_leash"],
    rules: "Owners must supervise water access. Life jackets available to borrow.",
  },
];

const reviewSnippets = [
  { rating: 5, comment: "Absolutely perfect. My pup didn't want to leave. The yard is even better than the photos." },
  { rating: 5, comment: "Best decision we made all month. Quiet, clean, and beautifully maintained." },
  { rating: 4, comment: "Loved it. Only note: the shade is great in the morning, less so by 4pm. Still booking again." },
  { rating: 5, comment: "Our reactive boy got an hour of true off-leash freedom. The host was wonderful too." },
  { rating: 5, comment: "Fenced perfectly. Felt totally safe letting our two beagles loose." },
  { rating: 4, comment: "Great spot. Water station was a lovely touch on a hot day." },
  { rating: 5, comment: "We've booked three times now. Always immaculate." },
];

async function main() {
  console.log("Seeding database…");

  // Wipe — order matters for relations
  await prisma.review.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.yard.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  // Hosts
  const hostUsers = await Promise.all(
    hosts.map((h) =>
      prisma.user.create({
        data: { ...h, isHost: true },
      }),
    ),
  );

  // Guests
  const guestUsers = await Promise.all(
    guests.map((g) =>
      prisma.user.create({
        data: { ...g, isHost: false },
      }),
    ),
  );

  // Yards
  for (let i = 0; i < yards.length; i++) {
    const y = yards[i];
    const host = hostUsers[i % hostUsers.length];
    const yard = await prisma.yard.create({
      data: {
        hostId: host.id,
        title: y.title,
        description: y.description,
        neighborhood: y.neighborhood,
        city: y.city,
        state: y.state,
        lat: y.lat,
        lng: y.lng,
        pricePerHour: y.pricePerHour,
        sqft: y.sqft,
        fenceHeight: y.fenceHeight,
        maxDogs: y.maxDogs,
        photos: JSON.stringify(pickPhotos(i * 5, 5)),
        amenities: JSON.stringify(y.amenities),
        rules: y.rules,
      },
    });

    // 2-3 reviews per yard
    const reviewCount = 2 + (i % 2);
    for (let r = 0; r < reviewCount; r++) {
      const guest = guestUsers[(i + r) % guestUsers.length];
      const snip = reviewSnippets[(i + r * 2) % reviewSnippets.length];
      await prisma.review.create({
        data: {
          yardId: yard.id,
          guestId: guest.id,
          rating: snip.rating,
          comment: snip.comment,
        },
      });
    }
  }

  console.log(`Seeded ${hosts.length} hosts, ${guests.length} guests, ${yards.length} yards.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
