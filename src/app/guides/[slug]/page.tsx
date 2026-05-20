import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface Props {
  params: Promise<{ slug: string }>
}

const articles: Record<string, {
  title: string
  description: string
  emoji: string
  tag: string
  readTime: string
  content: React.ReactNode
}> = {
  'what-to-pack-for-college': {
    title: 'What to Pack for Your First Year of College',
    description: 'The complete packing list for incoming freshmen — from bedding and bathroom essentials to tech gear and school supplies.',
    emoji: '🎓',
    tag: 'Packing',
    readTime: '8 min read',
    content: null,
  },
  'how-to-split-dorm-costs': {
    title: 'How to Split Dorm Costs with Your Roommate',
    description: 'A simple system for figuring out who buys what, how to avoid duplicate purchases, and how to keep things fair.',
    emoji: '🤝',
    tag: 'Roommates',
    readTime: '5 min read',
    content: null,
  },
  'dorm-room-setup-ideas': {
    title: 'Dorm Room Setup Ideas: Make the Most of a Small Space',
    description: 'Practical tips for maximizing a tiny dorm room — storage hacks, furniture layout, and how to make it feel like home.',
    emoji: '🛋️',
    tag: 'Setup',
    readTime: '6 min read',
    content: null,
  },
  'move-in-day-checklist': {
    title: 'The College Move-In Day Checklist',
    description: 'Everything you need to do before, during, and after move-in day — so nothing gets left behind and nothing goes wrong.',
    emoji: '📦',
    tag: 'Move-In',
    readTime: '5 min read',
    content: null,
  },
}

export async function generateStaticParams() {
  return Object.keys(articles).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const article = articles[slug]
  if (!article) return {}
  return {
    title: article.title,
    description: article.description,
    alternates: { canonical: `https://roomdapp.com/guides/${slug}` },
    openGraph: {
      title: `${article.title} — Roomd`,
      description: article.description,
      url: `https://roomdapp.com/guides/${slug}`,
    },
  }
}

function WhatToPackContent() {
  return (
    <div className="prose-content">
      <p>
        Packing for your first year of college is exciting — and overwhelming. Most first-year students either pack way too much (and end up shipping half of it home) or forget the basics (and make an emergency Target run their first week). This guide cuts through the noise with a practical, category-by-category breakdown of what you actually need.
      </p>

      <h2>Bedding and Sleep</h2>
      <p>
        Your dorm bed uses a <strong>Twin XL mattress</strong> — not a regular twin. This is the single most common packing mistake. Buy Twin XL sheets, or you'll spend your first night wrestling with a fitted sheet that won't stay on.
      </p>
      <ul>
        <li><strong>2 sets of Twin XL sheets</strong> — one on the bed, one in the wash</li>
        <li><strong>Comforter or duvet</strong> with a washable cover</li>
        <li><strong>Pillow + 1 backup</strong> — you'll use both</li>
        <li><strong>Mattress topper</strong> — dorm mattresses are notoriously thin and uncomfortable</li>
        <li>Blanket for late-night study sessions on your chair</li>
      </ul>
      <p>
        Skip the decorative throw pillows. You have about 18 square feet of floor space — every inch counts.
      </p>

      <h2>Bathroom Essentials</h2>
      <p>
        If you're in a dorm with shared bathrooms, you'll need a <strong>shower caddy</strong> — a portable bin to carry your toiletries to and from the bathroom. Also get a pair of <strong>shower sandals</strong> (flip-flops you wear in the shower). This is non-negotiable.
      </p>
      <ul>
        <li>Shower caddy with drainage holes</li>
        <li>Shower sandals / flip-flops</li>
        <li>Microfiber towels (dry fast, pack small)</li>
        <li>Toiletries: shampoo, conditioner, body wash, toothbrush, toothpaste, floss, deodorant, face wash, moisturizer</li>
        <li>Hair dryer (check if your dorm prohibits them — most allow it)</li>
        <li>First aid kit: ibuprofen, antacids, band-aids, thermometer, cold medicine</li>
        <li>Feminine hygiene products or condoms — whatever applies</li>
      </ul>

      <h2>Clothing</h2>
      <p>
        Pack for one month of laundry cycles, not the whole semester. Seriously. You can do laundry — and having a smaller wardrobe means less to pack and more space in your closet.
      </p>
      <ul>
        <li>7–10 pairs of underwear and socks</li>
        <li>5–7 casual tops and bottoms</li>
        <li>1–2 "going out" outfits</li>
        <li>1 nice outfit for presentations or interviews</li>
        <li>Pajamas</li>
        <li>Workout clothes (even if you don't think you'll use them — you will eventually)</li>
        <li>Rain jacket or umbrella</li>
        <li>Layers for your climate: hoodie or fleece, coat if needed</li>
        <li>Comfortable walking shoes</li>
      </ul>
      <p>
        Leave your full winter coat at home until fall break if you're moving in August. Storage is limited.
      </p>

      <h2>Desk and School Supplies</h2>
      <p>
        Most of your work happens on a laptop. Your desk needs to support that — good lighting, a comfortable chair, and organization for the physical stuff.
      </p>
      <ul>
        <li><strong>Laptop</strong> — your most important piece of gear</li>
        <li>Laptop charger + cable management clips</li>
        <li>Power strip or surge protector (6+ outlets; check dorm rules on surge protectors)</li>
        <li>Desk lamp (LED, ideally with brightness control)</li>
        <li>Notebooks, pens, highlighters, sticky notes</li>
        <li>USB drive or external hard drive</li>
        <li>Backpack or laptop bag</li>
        <li>Planner or calendar (digital or paper — just pick one and actually use it)</li>
        <li>Headphones — both earbuds for walking and over-ear for focus</li>
      </ul>
      <p>
        Don't buy a printer. Use the library's printers. You will print less than you think, and printers take up a lot of space.
      </p>

      <h2>Kitchen and Food</h2>
      <p>
        Even if you have a meal plan, you'll want snacks and late-night food in your room. Most dorms allow microwaves and mini-fridges (often rented from the school).
      </p>
      <ul>
        <li>Mini-fridge (rent from school or bring your own — check policy)</li>
        <li>Microwave (some dorms provide one per floor)</li>
        <li>Reusable water bottle — you'll carry this everywhere</li>
        <li>Coffee maker or electric kettle</li>
        <li>Mugs, a bowl, a plate, cutlery</li>
        <li>Dish soap and a sponge</li>
        <li>Paper towels</li>
        <li>Snacks: protein bars, instant noodles, oatmeal packets, crackers, nut butter</li>
      </ul>

      <h2>Cleaning and Laundry</h2>
      <ul>
        <li>Laundry bag or hamper (collapsible saves space)</li>
        <li>Laundry detergent pods (much easier than liquid)</li>
        <li>Dryer sheets</li>
        <li>Hangers (20–30 is usually enough)</li>
        <li>All-purpose cleaning spray</li>
        <li>Disinfectant wipes</li>
        <li>Dust pan and brush (a tiny one fits under your bed)</li>
        <li>Vacuum (check if your hall has a shared one)</li>
      </ul>

      <h2>Tech and Comfort</h2>
      <ul>
        <li>Phone charger + extra cable</li>
        <li>Portable charger / power bank</li>
        <li>Extension cord</li>
        <li>Alarm clock or just use your phone</li>
        <li>Fan (dorms overheat; many don't have AC)</li>
        <li>String lights or a lamp — overhead dorm lighting is harsh</li>
        <li>TV or monitor (optional, but nice for watching movies with your roommate)</li>
        <li>Earplugs or white noise machine for sleeping</li>
      </ul>

      <h2>What to Leave at Home</h2>
      <p>
        Some things seem essential but aren't. Save the space.
      </p>
      <ul>
        <li>Your entire childhood bedroom — bring 2–3 meaningful photos, not 20</li>
        <li>Textbooks you haven't confirmed you need</li>
        <li>Full-size toiletries (buy them there — they take up suitcase space)</li>
        <li>Printer</li>
        <li>Excessive shoes (3–4 pairs max)</li>
        <li>Anything you haven't used in 6 months</li>
      </ul>

      <h2>The Move-In Strategy</h2>
      <p>
        Pack in labeled bins or bags by category, not by throwing everything into a suitcase. You'll unpack faster, and you won't lose things. Check your school's move-in day instructions — some schools assign time slots to reduce hallway congestion.
      </p>
      <p>
        Once you're there, resist the urge to arrange everything perfectly on day one. Spend the first week figuring out what you actually need, then set up your space around your real habits.
      </p>
    </div>
  )
}

function HowToSplitCostsContent() {
  return (
    <div className="prose-content">
      <p>
        Moving in with a roommate means figuring out who buys what — and doing it before anyone buys anything. The number-one source of roommate friction isn't messiness or noise. It's money: who paid for the dish soap, whose TV is that, and why does one person feel like they're subsidizing the other.
      </p>
      <p>
        Here's a simple system that prevents most of that.
      </p>

      <h2>Do This Before Move-In Day</h2>
      <p>
        The best time to talk about shared costs is before anyone spends anything. Reach out to your roommate a few weeks before move-in and go through these questions together:
      </p>
      <ul>
        <li>What shared items will we need? (Cleaning supplies, kitchen gear, a fan, a printer, etc.)</li>
        <li>Who already has what? (No need to buy two mini-fridges.)</li>
        <li>What's off-limits for sharing? (Some people don't want to share towels or certain food.)</li>
        <li>How do we want to split shared costs — 50/50, or based on use?</li>
      </ul>
      <p>
        Most roommate pairs go with 50/50 on true shared items (cleaning supplies, shared appliances) and keep personal items personal. That's usually the simplest approach.
      </p>

      <h2>The "Who Buys What" Divide</h2>
      <p>
        One reliable method: assign entire categories to one person instead of splitting every purchase.
      </p>
      <p>
        For example:
      </p>
      <ul>
        <li><strong>Roommate A</strong> buys: the mini-fridge, cleaning supplies for the semester, dish soap, paper towels</li>
        <li><strong>Roommate B</strong> buys: the microwave, laundry detergent for the semester, the floor lamp</li>
      </ul>
      <p>
        You estimate the total cost of each person's list, adjust if one list is significantly more expensive, and then you're done. No more tracking individual purchases. No Venmo requests for $4.67.
      </p>
      <p>
        This works best when both people are honest about what they already have and willing to do a rough cost comparison upfront.
      </p>

      <h2>Handling Shared Appliances</h2>
      <p>
        For bigger shared items — mini-fridge, TV, coffee maker — agree upfront on who owns it. The owner takes it when they move out. The other person doesn't contribute money; the owner just gets the item.
      </p>
      <p>
        Why not split ownership? Because "shared ownership" of a physical item gets messy at the end of the year. Who takes the TV home? Can one person sell it? What if one person transfers schools? Keep ownership simple: one person buys it, one person owns it.
      </p>
      <p>
        If both people want to share ownership of something, buy it together at a known price, write down what you each paid, and agree upfront on what happens to it at the end of the year (sell it and split proceeds, or one person buys the other out at half the resale value).
      </p>

      <h2>Recurring Costs</h2>
      <p>
        Some things run out and need replacing: dish soap, sponges, paper towels, toilet paper (if your dorm doesn't provide it), laundry detergent. These are the items that cause the most low-level resentment — someone always feels like they buy more than the other person.
      </p>
      <p>
        The fix: buy in bulk at the start of each semester and split the cost at the time of purchase. One person places the order on Amazon, the other Venmos them half. Then you don't have to think about it again for months.
      </p>
      <p>
        If one person cares more about a specific brand (nicer dish soap, better paper towels), that person pays for the upgrade. You split the cost of the standard version; they cover the difference.
      </p>

      <h2>Track It Simply</h2>
      <p>
        You don't need a spreadsheet. You need a shared list that both roommates can see. Add the item, the price, and who paid. Keep a running balance. Settle up once a month — don't let it accumulate all semester.
      </p>
      <p>
        Apps like Venmo, Splitwise, or even a shared notes document work fine. The key is that <em>both people know it exists</em> and check it regularly.
      </p>

      <h2>The Conversation You Don't Want to Skip</h2>
      <p>
        At some point, you need to actually talk about money with your roommate — even if it feels awkward. The conversation usually takes 15 minutes and prevents months of low-level resentment.
      </p>
      <p>
        Keep it practical, not personal: "Hey, I was thinking about how we handle shared supplies. Want to figure that out before we move in?" That's it. Most roommates are relieved someone brought it up.
      </p>
      <p>
        If your roommate is resistant to any system at all, that's a signal worth noting — and a reason to keep your valuable personal items clearly yours.
      </p>

      <h2>What Roomd Is For</h2>
      <p>
        Roomd is built specifically for this problem. You and your roommates create a shared room, add items to the checklist, and claim the ones you're responsible for buying. Everyone can see who's buying what in real time — no duplicate purchases, no "I thought you were getting that" moments.
      </p>
      <p>
        It takes about 5 minutes to set up and saves hours of back-and-forth texts.
      </p>
    </div>
  )
}

function DormRoomSetupContent() {
  return (
    <div className="prose-content">
      <p>
        A standard dorm room is roughly 180–250 square feet — and you're sharing it with another person. Making it livable requires some intentional thinking about layout, storage, and what you actually put in the space. The good news: thousands of students have solved this problem before you, and there are some reliable strategies that work.
      </p>

      <h2>Start with the Layout</h2>
      <p>
        Before you move anything in, find out the dimensions of your specific room. Most schools publish floor plans or room measurements on their housing pages. Know what you're working with.
      </p>
      <p>
        Then, talk to your roommate. The two biggest layout decisions — <strong>where the beds go</strong> and <strong>whether to loft them</strong> — affect the entire room. Decide together before move-in day, not during it.
      </p>
      <p>
        A few common configurations:
      </p>
      <ul>
        <li><strong>Lofted beds:</strong> Both beds go high (using the school's loftable bed frames), freeing up the entire floor below for desks, couches, or storage. This is the most popular option and dramatically increases usable floor space.</li>
        <li><strong>Bunked beds:</strong> One bed stacks on top of the other. Creates a full side of the room for each person, but the person on top has limited headspace.</li>
        <li><strong>Separated beds on opposite walls:</strong> More like two personal spaces. Works well when both people want clear personal areas.</li>
      </ul>
      <p>
        Ask your RA or housing office what furniture comes in the room and whether beds are adjustable before assuming anything.
      </p>

      <h2>The Under-Bed Storage Rule</h2>
      <p>
        If you loft your bed or raise it on risers, the space underneath becomes your primary storage area. Don't waste it.
      </p>
      <ul>
        <li>Use <strong>rolling storage bins</strong> that fit under the bed frame</li>
        <li>Vacuum storage bags for seasonal clothing (compress a winter coat to the size of a pillow)</li>
        <li>Flat storage boxes for shoes, books, or supplies you don't need daily</li>
        <li>A small dresser can fit under a lofted bed — this frees up floor space elsewhere</li>
      </ul>
      <p>
        Measure your bed height before buying any under-bed storage. There's nothing worse than ordering six bins and discovering they're 2 inches too tall.
      </p>

      <h2>Vertical Space is Your Friend</h2>
      <p>
        In a small room, floor space is precious — but wall space is often underused. Command strips (the removable adhesive kind) are dorm-legal at most schools and let you add storage without drilling holes.
      </p>
      <ul>
        <li><strong>Over-door organizers:</strong> Add pockets for shoes, toiletries, snacks, or supplies to the back of your door without touching the walls</li>
        <li><strong>Floating shelves:</strong> Mount above your desk for books, plants, and decorations</li>
        <li><strong>Wall-mounted hooks:</strong> For bags, headphones, and jackets — keeps stuff off chairs</li>
        <li><strong>Pegboard or grid panel:</strong> Mount above your desk for a customizable organization system</li>
        <li><strong>Hanging closet organizer:</strong> Adds multiple shelves to a single closet rod</li>
      </ul>

      <h2>The Desk Setup</h2>
      <p>
        You'll spend a lot of time at your desk. Make it a place you actually want to work.
      </p>
      <ul>
        <li><strong>Desk lamp:</strong> The overhead fluorescent lighting in most dorms is harsh. A good desk lamp with adjustable brightness makes a real difference.</li>
        <li><strong>Monitor or laptop stand:</strong> Raises your screen to eye level, reducing neck strain during long study sessions</li>
        <li><strong>Cable management:</strong> A power strip tucked behind your desk with velcroed cables looks 10x better and prevents the rat's nest</li>
        <li><strong>Small desk organizer:</strong> One bin for pens and pencils, one for notes and papers — enough to keep surfaces clear</li>
        <li><strong>Whiteboard or corkboard:</strong> Mount above your desk for to-do lists, deadlines, and reminders</li>
      </ul>

      <h2>Lighting Makes Everything Better</h2>
      <p>
        This is the most underrated dorm upgrade. Good lighting changes the entire feel of a room.
      </p>
      <ul>
        <li><strong>String lights or LED strips:</strong> Warm, ambient lighting along your lofted bed frame or along a wall transforms the room from "hospital cell" to "actual living space"</li>
        <li><strong>Floor lamp:</strong> If you have space, a corner floor lamp fills in the shadows that overhead lighting misses</li>
        <li><strong>Smart bulbs:</strong> Some students replace the overhead bulb with a smart bulb (if the fixture allows it) so they can control brightness and color from their phone</li>
      </ul>
      <p>
        Check your dorm's rules about what's allowed before buying lighting. Most standard string lights and LED strips are fine; anything that requires rewiring is not.
      </p>

      <h2>The Shared Space Problem</h2>
      <p>
        You and your roommate need to negotiate the shared areas — mainly the floor space between your beds and the general "hangout" zone.
      </p>
      <p>
        A small rug can define a shared space and make the room feel more intentional. A small couch or a couple of floor cushions gives you somewhere to sit that isn't your bed. A shared TV (if you both want one) can go on a shared dresser between your spaces.
      </p>
      <p>
        The main thing: agree early on what's shared and what's personal. Most roommate conflicts about space aren't really about space — they're about one person feeling like their stuff is being used or encroached on without permission.
      </p>

      <h2>Make It Feel Like Home (Without Overdoing It)</h2>
      <p>
        A few personal touches go a long way. A couple of photos, a plant, a poster or two — these make a dorm room feel lived-in. But be selective. A room crammed with decorations feels chaotic and makes cleaning harder.
      </p>
      <p>
        The rule of thumb: if you can't find a logical home for something, it probably shouldn't be there.
      </p>
      <p>
        Ask your school's housing office about wall rules before you buy a lot of decor. Some schools only allow Command strips; others let you use small nails. You don't want to lose your housing deposit over holes in the wall.
      </p>
    </div>
  )
}

function MoveInDayContent() {
  return (
    <div className="prose-content">
      <p>
        Move-in day is controlled chaos. Between the parking lot congestion, the elevator lines, the boxes that don't fit in the elevator, and the roommate introductions happening in real time — it's a lot. This checklist breaks it into three phases so nothing slips through.
      </p>

      <h2>Two Weeks Before Move-In</h2>
      <ul>
        <li><strong>Confirm your move-in time slot</strong> — most schools assign windows to stagger arrivals. Know yours.</li>
        <li><strong>Contact your roommate</strong> — coordinate who's bringing what (mini-fridge, microwave, TV) to avoid duplicates</li>
        <li><strong>Check the school's prohibited items list</strong> — candles, certain appliances, and halogen lamps are commonly banned</li>
        <li><strong>Order items that need to ship</strong> — mattress toppers, bedding, organizers. Don't wait until move-in week</li>
        <li><strong>Figure out parking</strong> — does the school offer temporary move-in day parking? Do you need a pass? Where's the closest unloading zone to your building?</li>
        <li><strong>Measure your room</strong> if the school publishes dimensions — confirm what furniture you're bringing will fit</li>
      </ul>

      <h2>The Week Before Move-In</h2>
      <ul>
        <li><strong>Pack smart</strong> — use labeled bins by category (bedding, bathroom, desk, clothes) not random suitcases. You'll unpack faster.</li>
        <li><strong>Pack an "open first" box</strong> — put your bedding, towel, shower caddy, phone charger, and a change of clothes in a clearly labeled bag or bin. These are the things you'll need the first night.</li>
        <li><strong>Confirm you have your ID and all required paperwork</strong> — some schools need a housing form or parking pass on arrival</li>
        <li><strong>Check the weather</strong> — if it's going to be 90°F on move-in day, wear lightweight clothes and bring water</li>
        <li><strong>Plan your route</strong> — if you're driving a long distance, know where you're parking and how far it is from your room</li>
        <li><strong>Photograph your room before and after setup</strong> — document any existing damage so you're not charged for it at move-out</li>
      </ul>

      <h2>Move-In Day Morning</h2>
      <ul>
        <li>Eat a real breakfast — you'll be carrying boxes for hours</li>
        <li>Bring more people than you think you need (parents, siblings, friends) — you want hands</li>
        <li>Bring a hand truck or dolly if you have one — many schools have loaners, but they run out fast</li>
        <li>Arrive at the start of your time slot, not the end</li>
        <li>Unload everything from the car first, then organize — don't stop to arrange your desk while your family is waiting downstairs with more boxes</li>
      </ul>

      <h2>Setting Up the Room</h2>
      <ul>
        <li><strong>Do the big furniture first:</strong> beds, desks, dressers. Everything else fits around these.</li>
        <li><strong>Make your bed immediately</strong> — it takes 10 minutes and means you have somewhere comfortable to sit and rest while you keep working</li>
        <li><strong>Set up your desk lamp and power strip</strong> — these are the functional core of your workspace</li>
        <li><strong>Unpack your bathroom caddy</strong> and take your first shower-walk to orient yourself</li>
        <li>Hang your clothes, organize your desk, put away food — in that order</li>
        <li>Don't stress about decorating perfectly on day one. You'll rearrange things once you know how you actually use the space.</li>
      </ul>

      <h2>During the First Week</h2>
      <ul>
        <li><strong>Learn the laundry room</strong> — where it is, the hours, whether it requires an app or quarters</li>
        <li><strong>Find your nearest dining hall</strong> and understand your meal plan</li>
        <li><strong>Walk your campus</strong> — find all your classrooms before the first day of classes</li>
        <li><strong>Introduce yourself to your RA</strong> — you'll need them at some point, and it's better to have a relationship</li>
        <li><strong>Test your key/fob/code</strong> for the building and your room — know what to do if it stops working</li>
        <li><strong>Set up your student ID, campus Wi-Fi, and any required apps</strong></li>
        <li>Buy anything you forgot — now that you're in the room, you'll know exactly what's missing</li>
      </ul>

      <h2>After You're Settled</h2>
      <ul>
        <li><strong>Document any room damage</strong> in writing to your RA or housing office — don't assume the check-in sheet covered everything</li>
        <li><strong>Set up your shared checklist</strong> with your roommate for supplies you'll share and need to restock</li>
        <li><strong>Register your bike</strong> if you brought one — most campuses require it</li>
        <li><strong>Know your building's quiet hours</strong> — your first conflict with your roommate is almost always over sleep schedules</li>
      </ul>

      <h2>One Last Thing</h2>
      <p>
        Move-in day is the beginning of something new, not a logistics problem to solve. Get the basics set up, say goodbye to your family when you're ready, and then go meet your floormates. The room will come together over the first few weeks. The point of day one is just to get there.
      </p>
    </div>
  )
}

const contentMap: Record<string, React.FC> = {
  'what-to-pack-for-college': WhatToPackContent,
  'how-to-split-dorm-costs': HowToSplitCostsContent,
  'dorm-room-setup-ideas': DormRoomSetupContent,
  'move-in-day-checklist': MoveInDayContent,
}

export default async function GuidePage({ params }: Props) {
  const { slug } = await params
  const article = articles[slug]
  if (!article) notFound()

  const ContentComponent = contentMap[slug]

  const otherSlugs = Object.keys(articles).filter((s) => s !== slug)

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100 sticky top-0 bg-white/80 backdrop-blur-md z-40">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🏠</span>
            <span className="font-black text-indigo-600 text-xl">Roomd</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-semibold text-gray-500 hover:text-gray-900">Log in</Link>
            <Link href="/signup" className="bg-indigo-600 text-white text-sm font-bold px-4 py-2 rounded-xl hover:bg-indigo-700 transition-colors">
              Get started free
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-400 mb-8 flex items-center gap-1.5">
          <Link href="/" className="hover:text-indigo-600 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/guides" className="hover:text-indigo-600 transition-colors">Guides</Link>
          <span>/</span>
          <span className="text-gray-700 font-medium truncate">{article.title}</span>
        </nav>

        {/* Article header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-bold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">{article.tag}</span>
            <span className="text-xs text-gray-400">{article.readTime}</span>
          </div>
          <h1 className="text-4xl font-black text-gray-900 leading-tight mb-4">{article.title}</h1>
          <p className="text-lg text-gray-500 leading-relaxed">{article.description}</p>
        </div>

        {/* Article body */}
        <article className="
          text-gray-700 leading-relaxed
          [&_p]:mb-5 [&_p]:text-base [&_p]:leading-7
          [&_h2]:text-2xl [&_h2]:font-black [&_h2]:text-gray-900 [&_h2]:mt-10 [&_h2]:mb-4
          [&_ul]:mb-5 [&_ul]:space-y-2 [&_ul]:pl-5 [&_ul]:list-disc
          [&_li]:text-base [&_li]:leading-6
          [&_strong]:font-bold [&_strong]:text-gray-900
          [&_em]:italic
        ">
          <ContentComponent />
        </article>

        {/* CTA */}
        <div className="mt-14 bg-indigo-50 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-black text-gray-900 mb-2">Coordinate with your roommates</h2>
          <p className="text-gray-500 mb-6 max-w-sm mx-auto">
            Create a free shared checklist, invite your roommates, and track who&apos;s buying what — all in one place.
          </p>
          <Link href="/signup" className="inline-block bg-indigo-600 text-white font-bold text-lg px-8 py-4 rounded-2xl hover:bg-indigo-700 transition-colors">
            Create your room — free
          </Link>
        </div>

        {/* Other guides */}
        <div className="mt-12">
          <h2 className="text-xl font-black text-gray-900 mb-4">More guides</h2>
          <div className="space-y-3">
            {otherSlugs.map((s) => {
              const a = articles[s]
              return (
                <Link
                  key={s}
                  href={`/guides/${s}`}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50/40 transition-all group"
                >
                  <span className="text-3xl flex-shrink-0">{a.emoji}</span>
                  <div>
                    <p className="font-bold text-gray-900 group-hover:text-indigo-700 transition-colors text-sm">{a.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{a.readTime}</p>
                  </div>
                </Link>
              )
            })}
          </div>
          <div className="text-center mt-4">
            <Link href="/guides" className="text-sm text-indigo-600 font-semibold hover:underline">
              View all guides →
            </Link>
          </div>
        </div>
      </main>

      <footer className="border-t border-gray-100 py-8 px-4 text-center text-sm text-gray-400 mt-8">
        <p>© {new Date().getFullYear()} Roomd. <Link href="/terms" className="hover:underline">Terms</Link> · <Link href="/privacy" className="hover:underline">Privacy</Link> · <a href="mailto:support@roomdapp.com" className="hover:underline">Support</a></p>
        <p className="mt-1 text-xs">As an Amazon Associate, Roomd earns from qualifying purchases.</p>
      </footer>
    </div>
  )
}
