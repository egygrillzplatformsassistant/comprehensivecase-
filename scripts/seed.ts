import "dotenv/config";
import { db } from "../src/db";
import {
  departments,
  bundles,
  featuredOffer,
  siteTexts,
} from "../src/db/schema";

const TEXTS: Array<{
  key: string;
  group: string;
  label: string;
  en: string;
  ar: string;
}> = [
  // Language gate
  { key: "gate.tagline", group: "Language Gate", label: "Gate tagline", en: "Ain Shams Dentistry — Case Packages for Batch 2026", ar: "أسنان عين شمس — باكدجات العيّنات لدفعة 2026" },
  { key: "gate.title", group: "Language Gate", label: "Gate headline", en: "One link. Every case. Done & delivered.", ar: "رابط واحد… وكل عيّناتك جاهزة ومتسلّمة" },
  { key: "gate.choose", group: "Language Gate", label: "Gate sub-label", en: "Choose your language to continue", ar: "اختار لغتك عشان تكمل" },
  // Navbar
  { key: "nav.brandTop", group: "Navbar", label: "Brand line 1", en: "ASU DENTISTRY", ar: "أسنان عين شمس" },
  { key: "nav.brandBottom", group: "Navbar", label: "Brand line 2", en: "Case Packages • Batch ’26", ar: "باكدجات العيّنات • دفعة ’26" },
  { key: "nav.cta", group: "Navbar", label: "Nav button", en: "Order now", ar: "اطلب دلوقتي" },
  // Hero
  { key: "hero.badge", group: "Hero", label: "Hero badge", en: "Exclusive for 5th-Year • Batch 2026", ar: "حصري لسنة خامسة • دفعة 2026" },
  { key: "hero.kicker", group: "Hero", label: "Hero kicker", en: "COMPREHENSIVE CASES, HANDLED", ar: "عيّناتك الشاملة… علينا" },
  { key: "hero.title1", group: "Hero", label: "Hero title part 1", en: "Studio-quality cases.", ar: "عيّنات بجودة استوديو،" },
  { key: "hero.title2", group: "Hero", label: "Hero title part 2 (gradient)", en: "Student-budget prices.", ar: "وبأسعار على قدّ الطالب." },
  { key: "hero.sub", group: "Hero", label: "Hero subtitle", en: "Photography, editing and presentation-ready packages for every department — priced for students, not studios. Pick your bundles, send your details, done.", ar: "تصوير وتعديل وباكدجات جاهزة للتقديم لكل الأقسام — بأسعار طلبة مش استوديوهات. اختار الباكدجات، سيب بياناتك، وخلاص." },
  { key: "hero.ctaPrimary", group: "Hero", label: "Hero main button", en: "See the deals", ar: "شوف العروض" },
  { key: "hero.ctaSecondary", group: "Hero", label: "Hero second button", en: "How it works", ar: "إزاي نطلب؟" },
  { key: "hero.chip1", group: "Hero", label: "Hero chip 1", en: "From 400 EGP only", ar: "تبدأ من 400 ج.م بس" },
  { key: "hero.chip2", group: "Hero", label: "Hero chip 2", en: "Delivery in 24–48h", ar: "التسليم خلال 24–48 ساعة" },
  { key: "hero.chip3", group: "Hero", label: "Hero chip 3", en: "Free minor revisions", ar: "تعديلات بسيطة مجانًا" },
  { key: "hero.stat1num", group: "Hero", label: "Stat 1 number", en: "800+", ar: "+800" },
  { key: "hero.stat1", group: "Hero", label: "Stat 1 label", en: "cases delivered", ar: "عيّنة اتسلّمت" },
  { key: "hero.stat2num", group: "Hero", label: "Stat 2 number", en: "24h", ar: "24 ساعة" },
  { key: "hero.stat2", group: "Hero", label: "Stat 2 label", en: "avg. turnaround", ar: "متوسط التسليم" },
  { key: "hero.stat3num", group: "Hero", label: "Stat 3 number", en: "4.9/5", ar: "4.9/5" },
  { key: "hero.stat3", group: "Hero", label: "Stat 3 label", en: "batch rating", ar: "تقييم الدفعة" },
  // Steps
  { key: "steps.title", group: "Steps", label: "Steps title", en: "Ordering takes 60 seconds", ar: "الطلب بياخد 60 ثانية" },
  { key: "steps.1t", group: "Steps", label: "Step 1 title", en: "Pick your bundles", ar: "اختار الباكدجات" },
  { key: "steps.1d", group: "Steps", label: "Step 1 text", en: "Mix any packages from any department.", ar: "اجمع أي باكدجات من أي قسم." },
  { key: "steps.2t", group: "Steps", label: "Step 2 title", en: "Fill 3 fields", ar: "املأ 3 خانات" },
  { key: "steps.2d", group: "Steps", label: "Step 2 text", en: "Name, section & phone — that’s it.", ar: "اسم وسكشن ورقم موبايل… بس." },
  { key: "steps.3t", group: "Steps", label: "Step 3 title", en: "We confirm on WhatsApp", ar: "نأكد معاك واتساب" },
  { key: "steps.3d", group: "Steps", label: "Step 3 text", en: "Fast slot booking & delivery date.", ar: "نحجز معاد التصوير والتسليم فورًا." },
  // Featured offer labels
  { key: "featured.sectionLabel", group: "Featured Offer", label: "Eyebrow label", en: "THE OFFER", ar: "العرض" },
  { key: "featured.includes", group: "Featured Offer", label: "Includes list title", en: "What’s inside", ar: "اللي هتاخده" },
  { key: "featured.cta", group: "Featured Offer", label: "Offer button", en: "Grab this offer", ar: "احجز العرض" },
  { key: "featured.selected", group: "Featured Offer", label: "Offer added state", en: "Offer added to your order", ar: "العرض اتضاف لطلبك" },
  { key: "featured.save", group: "Featured Offer", label: "Save word", en: "SAVE", ar: "وفّر" },
  // Highlights
  { key: "highlights.title", group: "Highlights Section", label: "Section title", en: "Batch favorites", ar: "اللي الدفعة بتحبّه" },
  { key: "highlights.sub", group: "Highlights Section", label: "Section subtitle", en: "Cross-department bundles with the biggest savings. The more you bundle, the cheaper it gets.", ar: "باكدجات بتجمع الأقسام بأكبر توفير. كل ما تجمع أكتر… كل ما توفّر أكتر." },
  // Departments
  { key: "departments.title", group: "Departments Section", label: "Section title", en: "Pick by department", ar: "اختار حسب القسم" },
  { key: "departments.sub", group: "Departments Section", label: "Section subtitle", en: "Same student prices across every department — 400 / 500 / full package. No hidden fees, ever.", ar: "نفس أسعار الطلبة في كل الأقسام — 400 / 500 / الباكدج الكاملة. من غير أي مصاريف مخفية." },
  { key: "departments.from", group: "Departments Section", label: "“From” before min price", en: "from", ar: "تبدأ من" },
  { key: "departments.tapHint", group: "Departments Section", label: "Hint under option rows", en: "Tap an option to add it — tap the arrow for details", ar: "اضغط على الخيار عشان تضيفه — والسهم يوريك التفاصيل" },
  // Bundle cards
  { key: "bundle.select", group: "Bundle Cards", label: "Select button", en: "Add to order", ar: "ضيفها للطلب" },
  { key: "bundle.selected", group: "Bundle Cards", label: "Selected button", en: "In your order ✓", ar: "في طلبك ✓" },
  { key: "bundle.save", group: "Bundle Cards", label: "Save word", en: "SAVE", ar: "وفّر" },
  // Cart bar
  { key: "cart.singular", group: "Cart Bar", label: "1 bundle selected", en: "bundle selected", ar: "باكدج مختارة" },
  { key: "cart.plural", group: "Cart Bar", label: "N bundles selected", en: "bundles selected", ar: "باكدج مختارة" },
  { key: "cart.total", group: "Cart Bar", label: "Total word", en: "Total", ar: "الإجمالي" },
  { key: "cart.cta", group: "Cart Bar", label: "Cart button", en: "Finish order", ar: "كمّل الطلب" },
  // Order form
  { key: "form.title", group: "Order Form", label: "Form title", en: "Almost done — your details", ar: "باقي خطوة — اكتب بياناتك" },
  { key: "form.sub", group: "Order Form", label: "Form subtitle", en: "We’ll contact you on this number to confirm your shoot.", ar: "هنكلمك على الرقم ده عشان نأكد التصوير." },
  { key: "form.summary", group: "Order Form", label: "Summary label", en: "Your bundles", ar: "الباكدجات بتاعتك" },
  { key: "form.name", group: "Order Form", label: "Name label", en: "Full name", ar: "الاسم بالكامل" },
  { key: "form.namePh", group: "Order Form", label: "Name placeholder", en: "e.g. Mariam Ahmed", ar: "مثال: مريم أحمد" },
  { key: "form.section", group: "Order Form", label: "Section label", en: "Section number", ar: "رقم السكشن" },
  { key: "form.sectionPh", group: "Order Form", label: "Section placeholder", en: "e.g. 12", ar: "مثال: 12" },
  { key: "form.phone", group: "Order Form", label: "Phone label", en: "Phone number (WhatsApp)", ar: "رقم الموبايل (واتساب)" },
  { key: "form.phonePh", group: "Order Form", label: "Phone placeholder", en: "01xxxxxxxxx", ar: "01xxxxxxxxx" },
  { key: "form.submit", group: "Order Form", label: "Submit button", en: "Send order", ar: "ابعت الطلب" },
  { key: "form.sending", group: "Order Form", label: "Sending state", en: "Sending…", ar: "بنبعت…" },
  { key: "form.note", group: "Order Form", label: "Form note", en: "No payment now — pay only after we confirm.", ar: "مفيش دفع دلوقتي — الدفع بعد التأكيد بس." },
  { key: "form.successTitle", group: "Order Form", label: "Success title", en: "Order received", ar: "طلبك وصل" },
  { key: "form.successBody", group: "Order Form", label: "Success text", en: "Thanks! We’ll WhatsApp you shortly to confirm your shoot. Keep your order number:", ar: "شكرًا! هنبعتلك واتساب نأكد التصوير. احتفظ برقم طلبك:" },
  { key: "form.another", group: "Order Form", label: "Make another order", en: "Done — back to packages", ar: "تمام — ارجع للباكدجات" },
  { key: "form.errRequired", group: "Order Form", label: "Required fields error", en: "Please fill all fields correctly.", ar: "لو سمحت املا كل البيانات صح." },
  { key: "form.errPhone", group: "Order Form", label: "Phone error", en: "Enter a valid Egyptian mobile (11 digits, starts with 01).", ar: "اكتب رقم موبايل مصري صح (11 رقم ويبدأ بـ01)." },
  { key: "form.errGeneric", group: "Order Form", label: "Generic error", en: "Something went wrong — try again.", ar: "حصلت مشكلة — جرب تاني." },
  // Footer
  { key: "footer.tag", group: "Footer", label: "Footer tagline", en: "Built by students, priced for students.", ar: "معمول طالب لطالب… وبسعر طالب." },
  { key: "footer.contact", group: "Footer", label: "Footer contact line", en: "Questions? WhatsApp us anytime.", ar: "عندك سؤال؟ كلمنا واتساب في أي وقت." },
  // Ticker strip
  { key: "ticker.1", group: "Ticker Strip", label: "Ticker item 1", en: "STUDENT PRICES ONLY", ar: "أسعار طلبة بس" },
  { key: "ticker.2", group: "Ticker Strip", label: "Ticker item 2", en: "FROM 400 EGP", ar: "تبدأ من 400 ج.م" },
  { key: "ticker.3", group: "Ticker Strip", label: "Ticker item 3", en: "24H DELIVERY", ar: "تسليم خلال 24 ساعة" },
  { key: "ticker.4", group: "Ticker Strip", label: "Ticker item 4", en: "FREE REVISIONS", ar: "تعديلات مجانية" },
  { key: "ticker.5", group: "Ticker Strip", label: "Ticker item 5", en: "DON’T OVERPAY STUDIOS", ar: "متدفعش زيادة في استوديو" },
  { key: "ticker.6", group: "Ticker Strip", label: "Ticker item 6", en: "PAY AFTER CONFIRMATION", ar: "الدفع بعد التأكيد" },
];

const DEPTS = [
  { slug: "endo", nameEn: "Endodontics (Endo)", nameAr: "علاج الجذور – إندو", icon: "syringe", sortOrder: 1 },
  { slug: "crown", nameEn: "Crown & Bridge", nameAr: "التيجان والجسور – كراون", icon: "crown", sortOrder: 2 },
  { slug: "medicine", nameEn: "Oral Medicine", nameAr: "طب الفم – ميديسن", icon: "stethoscope", sortOrder: 3 },
  { slug: "operative", nameEn: "Operative Dentistry", nameAr: "الحشو التجميلي – أوبريتف", icon: "layers", sortOrder: 4 },
];

function tier(
  deptId: number,
  sort: number,
  tierNameEn: string,
  tierNameAr: string,
  price: number,
  oldPrice: number,
  badgeEn: string,
  badgeAr: string,
  featEn: string[],
  featAr: string[],
) {
  return {
    departmentId: deptId,
    highlighted: false,
    nameEn: tierNameEn,
    nameAr: tierNameAr,
    descEn: "Per comprehensive case",
    descAr: "لكل عيّنة شاملة",
    badgeEn,
    badgeAr,
    price,
    oldPrice,
    sortOrder: sort,
    featuresEn: featEn.join("\n"),
    featuresAr: featAr.join("\n"),
    active: true,
  };
}

async function main() {
  console.log("Seeding…");

  /* texts */
  for (const t of TEXTS) {
    await db
      .insert(siteTexts)
      .values({ key: t.key, group: t.group, label: t.label, valueEn: t.en, valueAr: t.ar })
      .onConflictDoNothing({ target: [siteTexts.key] });
  }
  console.log(`texts: ${TEXTS.length}`);

  /* departments */
  for (const d of DEPTS) {
    await db.insert(departments).values(d).onConflictDoNothing({ target: [departments.slug] });
  }

  const deptRows = await db.select().from(departments);
  const bySlug = new Map(deptRows.map((d) => [d.slug, d.id]));

  /* department bundles */
  const deptBundles = [];
  for (const slug of ["endo", "crown", "medicine", "operative"] as const) {
    const id = bySlug.get(slug);
    if (!id) continue;
    deptBundles.push(
      tier(id, 1, "Photography Only", "تصوير فقط", 400, 500, "CHEAPEST", "أرخص سعر",
        ["Full clinical photo set (all required views)", "Consistent lighting & framing", "Files named per faculty requirements", "Delivery in 24–48h"],
        ["جلسة تصوير كاملة لكل الزوايا المطلوبة", "إضاءة وتكوين ثابت ومنضبط", "تسمية الملفات حسب متطلبات الكلية", "التسليم خلال 24–48 ساعة"]),
      tier(id, 2, "Photography + Editing", "تصوير + تعديل", 500, 650, "MOST POPULAR", "الأكثر طلبًا",
        ["Everything in Photography Only", "Pro color grading & exposure fixes", "Background & mirror cleanup", "Crops, labels & annotations"],
        ["كل اللي في باكدج التصوير", "تظبيط ألوان وإضاءة احترافي", "تنضيف الخلفية والمراية", "قصّ وكتابة ملاحظات على الصور"]),
      tier(id, 3, "Photo + Edit + Presentation", "تصوير + تعديل + برزنتيشن", 650, 850, "ALL-IN-ONE", "كل حاجة مع بعض",
        ["Everything in Photo + Edit", "Presentation-ready slide deck", "Faculty template — just add your name", "Print-quality exports included"],
        ["كل اللي في تصوير + تعديل", "سلايدات جاهزة للتقديم", "على تمبلت الكلية — ضيف اسمك وبس", "نسخة بجودة طباعة كمان"]),
    );
  }
  for (const b of deptBundles) {
    await db.insert(bundles).values(b).onConflictDoNothing();
  }
  console.log(`department bundles: ${deptBundles.length}`);

  /* highlighted bundles */
  const high = [
    {
      highlighted: true, nameEn: "Double Deal — Any 2 Departments", nameAr: "عرض الاتنين — أي قسمين",
      descEn: "Photography + Editing for two comprehensive cases", descAr: "تصوير + تعديل لعيّنتين شاملتين",
      badgeEn: "HOT", badgeAr: "عرض سخن", price: 899, oldPrice: 1000, sortOrder: 1, active: true,
      featuresEn: "Any 2 departments, mix freely\nFull photography set for both\nPro editing for both cases\nOne shared delivery slot\nPay less than booking separately",
      featuresAr: "أي قسمين تختارهم بحرية\nتصوير كامل للعيّنتين\nتعديل احترافي للعيّنتين\nمعاد تسليم واحد\nأرخص من الحجز منفصلين",
    },
    {
      highlighted: true, nameEn: "Semester Pass — All 4 Departments", nameAr: "تصريح الترم — الـ4 أقسام كلهم",
      descEn: "Photography Only for one case in every department", descAr: "تصوير فقط لعيّنة في كل قسم",
      badgeEn: "BEST FOR LAZY ONES", badgeAr: "للناس اللي عايزة تخلّص",
      price: 1399, oldPrice: 1600, sortOrder: 2, active: true,
      featuresEn: "Endo + Crown + Medicine + Operative\nPhotography for 4 full cases\nPriority scheduling all semester\nFiles named per faculty requirements\nCheapest way to cover everything",
      featuresAr: "إندو + كراون + ميديسن + أوبريتف\nتصوير 4 عيّنات كاملة\nأولوية في الحجز طول الترم\nتسمية الملفات حسب متطلبات الكلية\nأرخص طريقة تغطي بيها كل حاجة",
    },
    {
      highlighted: true, nameEn: "Presentation-Ready Duo", nameAr: "ثنائي جاهز للتقديم",
      descEn: "Full package (shoot + edit + slides) for 2 cases", descAr: "الباكدج الكاملة لعيّنتين (تصوير + تعديل + سلايدات)",
      badgeEn: "SMART CHOICE", badgeAr: "الاختيار الذكي",
      price: 1199, oldPrice: 1300, sortOrder: 3, active: true,
      featuresEn: "Any 2 departments\nPhotography + editing + slide deck each\nFaculty template included\nUnlimited minor revisions\nDelivered exam-ready",
      featuresAr: "أي قسمين\nتصوير + تعديل + سلايدات لكل واحدة\nتمبلت الكلية معاك\nتعديلات بسيطة من غير حدود\nاتسلّم جاهز للامتحان",
    },
    {
      highlighted: true, nameEn: "The Mega Everything Pack", nameAr: "باكدج «كل حاجة» الكبيرة",
      descEn: "Full package for all 4 departments — never worry again", descAr: "الباكدج الكاملة للـ4 أقسام — ومتفكرش تاني",
      badgeEn: "BATCH FAVORITE", badgeAr: "اختيار الدفعة",
      price: 2299, oldPrice: 2600, sortOrder: 4, active: true,
      featuresEn: "All 4 departments, full package\nShoot + edit + presentation each\nVIP priority queue\nFree reshoot if anything is bounced\nOne invoice, zero stress",
      featuresAr: "الـ4 أقسام بالباكدج الكاملة\nتصوير + تعديل + برزنتيشن لكل واحدة\nأولوية VIP في كل حاجة\nإعادة تصوير مجانية لو حاجة اترفضت\nفاتورة واحدة… وصفر قلق",
    },
  ];
  for (const b of high) {
    await db.insert(bundles).values(b).onConflictDoNothing();
  }

  /* featured offer */
  const existingFeatured = await db.select().from(featuredOffer);
  if (existingFeatured.length === 0) {
    await db.insert(featuredOffer).values({
      enabled: true,
      badgeEn: "LIMITED BATCH OFFER",
      badgeAr: "عرض محدود للدفعة",
      titleEn: "The Full-Case Mega Deal",
      titleAr: "باكدج العيّنة الكاملة",
      descEn: "Everything for ANY department: pro photography + clean editing + presentation-ready slides — locked at the batch price. Don’t overpay a studio.",
      descAr: "كل حاجة لأي قسم: تصوير احترافي + تعديل نظيف + سلايدات جاهزة للتقديم — بسعر متقفل للدفعة. متدفعش أكتر في استوديو.",
      includesEn: "Complete photography set (all required views)\nPro editing: grading, cleanup, annotations\nPresentation-ready slide deck (faculty template)\nPriority 24h delivery\nFree reshoot if a shot is rejected",
      includesAr: "جلسة تصوير كاملة لكل الزوايا المطلوبة\nتعديل احترافي: ألوان، تنضيف، ملاحظات\nسلايدات جاهزة للتقديم على تمبلت الكلية\nتسليم أولوية خلال 24 ساعة\nإعادة تصوير مجانية لو صورة اترفضت",
      footnoteEn: "Bring 2 friends & everyone gets an extra 5% off.",
      footnoteAr: "هات صاحبين معاك… وكل واحد ياخد خصم إضافي 5% بعدك.",
      price: 599,
      oldPrice: 750,
    });
  }

  console.log("Seed complete ✅");
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
