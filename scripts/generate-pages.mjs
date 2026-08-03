/**
 * One-shot static page generator for Datis P0/P1 templates.
 * Run: node scripts/generate-pages.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

function ensureDir(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function write(rel, html) {
  const full = path.join(root, rel);
  ensureDir(full);
  fs.writeFileSync(full, html, "utf8");
  console.log("wrote", rel);
}

function nav(prefix, active) {
  const home = prefix + "index.html";
  const explore = prefix + "index.html#explore";
  const products = prefix + "products.html";
  const knowledge = prefix + "knowledge.html";
  const events = prefix + "events.html";
  const contact = prefix + "contact.html";
  const fav = prefix + "assets/img/fav.png";
  const logo = prefix + "assets/img/logo-1.png";
  const css = prefix + "css/style.css";

  const item = (key, href, icon, label) => {
    const isActive = active === key ? " active" : "";
    return `<li class="nav-item">
							<a class="nav-link${isActive}" href="${href}">
								<span class="mobile-nav-icon d-lg-none" aria-hidden="true"><i class="bi ${icon}"></i></span>
								<span class="mobile-nav-text">${label}</span>
								<i class="bi bi-chevron-left mobile-nav-arrow d-lg-none" aria-hidden="true"></i>
							</a>
						</li>`;
  };

  return { home, explore, products, knowledge, events, contact, fav, logo, css, item, prefix };
}

function chromeHead(meta) {
  const { title, description, fav, css } = meta;
  return `<!doctype html>
<html lang="fa" dir="rtl">
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<meta name="description" content="${description}" />
		<title>${title}</title>
		<link rel="icon" type="image/png" href="${fav}" />
		<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.rtl.min.css" rel="stylesheet" />
		<link href="https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css" rel="stylesheet" />
		<link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" rel="stylesheet" />
		<link href="${css}" rel="stylesheet" />
	</head>
	<body class="page-inner">`;
}

function chromeNav(n) {
  return `
		<nav class="navbar navbar-expand-lg fixed-top scrolled" id="mainNav">
			<div class="container">
				<a class="navbar-brand" href="${n.home}" aria-label="داتیس اگروکمیکالز">
					<img src="${n.logo}" alt="داتیس اگروکمیکالز" class="navbar-logo" />
				</a>
				<button class="navbar-toggler" type="button" aria-controls="navbarNav" aria-expanded="false" aria-label="باز کردن منو">
					<span class="navbar-toggler-icon"></span>
				</button>
				<div class="collapse navbar-collapse mobile-nav-panel" id="navbarNav">
					<div class="mobile-nav-head d-lg-none">
						<img src="${n.logo}" alt="داتیس اگروکمیکالز" class="mobile-nav-logo" />
						<p class="mobile-nav-tagline">راهکارهای نوین کشاورزی</p>
					</div>
					<div class="mobile-nav-scroll">
						<ul class="navbar-nav mx-auto mb-2 mb-lg-0 mobile-nav-list">
						${n.item("home", n.home, "bi-house-door", "خانه")}
						${n.item("explore", n.explore, "bi-compass", "راهنمای انتخاب")}
						${n.item("products", n.products, "bi-box-seam", "محصولات")}
						${n.item("knowledge", n.knowledge, "bi-play-circle", "آموزش‌ها")}
						${n.item("events", n.events, "bi-calendar-event", "رویدادها")}
						${n.item("contact", n.contact, "bi-telephone", "تماس")}
						</ul>
					</div>
					<div class="d-flex align-items-center gap-2 mobile-nav-cta navbar-cta">
						<button type="button" class="btn btn-primary btn-sm rounded-pill px-3 navbar-consult-btn" data-bs-toggle="modal" data-bs-target="#consultModal">
							<i class="bi bi-headset me-1"></i>دریافت مشاوره
						</button>
					</div>
				</div>
			</div>
		</nav>`;
}

function chromeFooter(n) {
  return `
		<footer id="footer" class="footer">
			<div class="footer-curve" aria-hidden="true">
				<svg viewBox="0 0 1440 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M0,64 C240,120 480,0 720,64 C960,128 1200,32 1440,80 L1440,120 L0,120 Z" />
				</svg>
			</div>
			<div class="footer-glow footer-glow--1" aria-hidden="true"></div>
			<div class="footer-glow footer-glow--2" aria-hidden="true"></div>
			<div class="container footer-inner">
				<div class="footer-top row g-4 g-xl-5 align-items-start">
					<div class="col-lg-5">
						<a class="footer-brand" href="${n.home}">
							<img src="${n.logo}" alt="داتیس اگروکمیکالز" class="footer-logo" />
						</a>
						<p class="footer-about">تأمین‌کننده پیشرو کودهای تخصصی و راهکارهای نوین تغذیه گیاهی در ایران و خاورمیانه.</p>
						<div class="footer-social">
							<a href="#" class="footer-social-link" aria-label="تلگرام"><i class="bi bi-telegram"></i></a>
							<a href="#" class="footer-social-link" aria-label="اینستاگرام"><i class="bi bi-instagram"></i></a>
							<a href="#" class="footer-social-link" aria-label="لینکدین"><i class="bi bi-linkedin"></i></a>
							<a href="#" class="footer-social-link" aria-label="آپارات"><i class="bi bi-play-btn"></i></a>
						</div>
					</div>
					<div class="col-6 col-md-4 col-lg-2">
						<h6 class="footer-heading">دسترسی سریع</h6>
						<ul class="footer-links">
							<li><a href="${n.products}">محصولات</a></li>
							<li><a href="${n.knowledge}">آموزش‌ها</a></li>
							<li><a href="${n.events}">رویدادها</a></li>
							<li><a href="${n.prefix}about.html">درباره ما</a></li>
						</ul>
					</div>
					<div class="col-6 col-md-4 col-lg-2">
						<h6 class="footer-heading">همکاری</h6>
						<ul class="footer-links">
							<li><a href="${n.prefix}partnership.html">همکاری با داتیس</a></li>
							<li><a href="${n.prefix}distributors.html">توزیع‌کنندگان</a></li>
							<li><a href="${n.prefix}downloads.html">دانلودها</a></li>
						</ul>
					</div>
					<div class="col-md-4 col-lg-3">
						<h6 class="footer-heading">تماس</h6>
						<ul class="footer-contact">
							<li>
								<span class="footer-contact-icon"><i class="bi bi-geo-alt"></i></span>
								<span class="footer-contact-text">تهران، امانیه، خیابان ولیعصر، خیابان شهید مهری، پلاک ۲۰</span>
							</li>
							<li>
								<span class="footer-contact-icon"><i class="bi bi-envelope"></i></span>
								<a href="mailto:info@datisac.com">info@datisac.com</a>
							</li>
							<li>
								<span class="footer-contact-icon"><i class="bi bi-telephone"></i></span>
								<a href="tel:+982126210121">۰۲۱-۲۶۲۱۰۱۲۱</a>
							</li>
						</ul>
					</div>
				</div>
				<div class="footer-newsletter">
					<div class="footer-newsletter-text">
						<h6 class="footer-heading mb-2">خبرنامه داتیس</h6>
						<p>تازه‌ترین اخبار و رویدادها را در ایمیل خود دریافت کنید.</p>
					</div>
					<form id="newsletterForm" class="newsletter" novalidate>
						<div class="newsletter-group">
							<input type="email" class="form-control" id="newsletterEmail" placeholder="ایمیل شما" aria-label="ایمیل" required />
							<button class="btn btn-primary" type="submit">عضویت</button>
						</div>
						<div class="newsletter-msg" id="newsletterMsg"></div>
					</form>
				</div>
				<div class="footer-bottom">
					<small>
						<a href="https://mirka.agency" class="footer-credit" target="_blank" rel="noopener noreferrer">💎درخشان با میرکا</a>
					</small>
					<div class="footer-legal">
						<a href="${n.prefix}privacy.html">حریم خصوصی</a>
						<span class="footer-dot" aria-hidden="true"></span>
						<a href="${n.prefix}terms.html">شرایط استفاده</a>
					</div>
				</div>
			</div>
		</footer>

		<button id="backToTop" class="back-to-top" aria-label="بازگشت به بالا"><i class="bi bi-arrow-up"></i></button>

		<div class="modal fade" id="consultModal" tabindex="-1" aria-labelledby="consultModalLabel" aria-hidden="true">
			<div class="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
				<div class="modal-content consult-modal-content">
					<div class="modal-header consult-modal-header">
						<div>
							<span class="cta-eyebrow consult-modal-eyebrow"><i class="bi bi-headset"></i> مشاوره رایگان</span>
							<h5 class="modal-title" id="consultModalLabel">دریافت مشاوره تخصصی</h5>
							<p class="consult-modal-desc mb-0">فرم زیر را تکمیل کنید؛ کارشناسان داتیس در کوتاه‌ترین زمان با شما تماس می‌گیرند.</p>
						</div>
						<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="بستن"></button>
					</div>
					<div class="modal-body">
						<div class="cta-form-card consult-modal-form">
							<form id="consultModalForm" class="consult-form" novalidate data-success-target="consultModalSuccess">
								<div class="row g-3">
									<div class="col-md-6">
										<label for="mCName" class="form-label">نام و نام خانوادگی</label>
										<input type="text" class="form-control" id="mCName" placeholder="نام شما" required />
										<div class="invalid-feedback">لطفاً نام خود را وارد کنید.</div>
									</div>
									<div class="col-md-6">
										<label for="mCPhone" class="form-label">شماره تماس</label>
										<input type="tel" class="form-control" id="mCPhone" placeholder="۰۹۱۲۳۴۵۶۷۸۹" required />
										<div class="invalid-feedback">لطفاً شماره تماس معتبر وارد کنید.</div>
									</div>
									<div class="col-md-6">
										<label for="mCInterest" class="form-label">زمینه مورد نظر</label>
										<select class="form-select" id="mCInterest">
											<option value="" selected>انتخاب کنید…</option>
											<option>کودهای محلول در آب</option>
											<option>بایواستیمولانت‌ها</option>
											<option>ریزمغذی‌ها</option>
											<option>کودهای کندرها</option>
											<option>مشاوره عمومی</option>
										</select>
									</div>
									<div class="col-md-6">
										<label for="mCMethod" class="form-label">نوع کشت</label>
										<select class="form-select" id="mCMethod">
											<option value="" selected>انتخاب کنید…</option>
											<option>گلخانه</option>
											<option>فضای باز</option>
											<option>آبیاری قطره‌ای</option>
											<option>درختان میوه</option>
										</select>
									</div>
									<div class="col-12">
										<label for="mCMsg" class="form-label">توضیحات (اختیاری)</label>
										<textarea class="form-control" id="mCMsg" rows="2" placeholder="کمی درباره نیاز خود بنویسید…"></textarea>
									</div>
									<div class="col-12 d-grid d-sm-flex justify-content-sm-end">
										<button type="submit" class="btn btn-primary btn-md rounded-pill px-4">
											<i class="bi bi-send me-2"></i>ثبت درخواست مشاوره
										</button>
									</div>
								</div>
							</form>
							<div id="consultModalSuccess" class="cta-success d-none" role="alert">
								<i class="bi bi-check-circle"></i> درخواست شما با موفقیت ثبت شد. به‌زودی با شما تماس می‌گیریم.
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
		<script src="${n.prefix}js/main.js"></script>
	</body>
</html>`;
}

function pageHero(crumbs, title, desc) {
  const crumbHtml = crumbs
    .map((c, i) => {
      if (i === crumbs.length - 1) return `<li aria-current="page">${c.label}</li>`;
      return `<li><a href="${c.href}">${c.label}</a></li><li class="sep" aria-hidden="true">/</li>`;
    })
    .join("");
  return `
		<header class="page-hero">
			<div class="container">
				<ol class="breadcrumb-nav">${crumbHtml}</ol>
				<h1 class="page-hero-title">${title}</h1>
				${desc ? `<p class="page-hero-desc">${desc}</p>` : ""}
			</div>
		</header>`;
}

function page(relPath, opts) {
  const depth = relPath.split("/").length - 1;
  const prefix = depth === 0 ? "./" : "../".repeat(depth);
  const n = nav(prefix, opts.active || "");
  const head = chromeHead({
    title: opts.title,
    description: opts.description || "داتیس اگروکمیکالز — راهکارهای نوین تغذیه گیاهی",
    fav: n.fav,
    css: n.css,
  });
  const html = `${head}
		${chromeNav(n)}
		${opts.hero || ""}
		${opts.body}
		${chromeFooter(n)}`;
  write(relPath, html);
}

function productCard(n, href, img, tag, title, text) {
  return `<div class="col-md-6 col-lg-3">
						<article class="product-card">
							<div class="product-media">
								${tag ? `<span class="product-tag">${tag}</span>` : ""}
								<img src="${img}" alt="${title}" loading="lazy" />
							</div>
							<div class="product-body">
								<h5>${title}</h5>
								<p>${text}</p>
								<a href="${href}" class="product-link">جزئیات محصول <i class="bi bi-arrow-left"></i></a>
							</div>
						</article>
					</div>`;
}

const img = (n, name) => n.prefix + "assets/img/" + name;

// ——— ABOUT (identity + factory + quality) ———
{
  const prefix = "";
  const n = nav("./", "home");
  page("about.html", {
    active: "home",
    title: "درباره ما | داتیس",
    description: "هویت برند، کارخانه و کیفیت داتیس اگروکمیکالز",
    hero: `${pageHero(
      [
        { href: n.home, label: "خانه" },
        { href: "#", label: "درباره ما" },
      ],
      "درباره داتیس",
      "هویت برند، کارخانه و تولید، کیفیت و گواهی‌ها — همه در یک صفحه."
    )}
				<div class="container" style="margin-top:-1.5rem;position:relative;z-index:1;padding-bottom:1.5rem">
					<div class="d-flex flex-wrap gap-2">
						<a href="#identity" class="btn btn-sm btn-outline-primary rounded-pill">هویت برند</a>
						<a href="#factory" class="btn btn-sm btn-outline-primary rounded-pill">کارخانه</a>
						<a href="#quality" class="btn btn-sm btn-outline-primary rounded-pill">کیفیت</a>
						<a href="${prefix}downloads.html" class="btn btn-sm btn-primary rounded-pill">دانلود مدارک</a>
					</div>
				</div>`,
    body: `
		<section class="page-section" id="identity">
			<div class="container">
				<div class="row g-4 g-lg-5 align-items-start">
					<div class="col-lg-7">
						<span class="eyebrow">هویت برند</span>
						<h2 class="section-title">تغذیه دقیق، برداشت پایدار</h2>
						<p class="section-desc mb-4">داتیس با تمرکز بر کیفیت فرمولاسیون، همراهی کارشناسی و شبکه توزیع گسترده، به کشاورزان و شرکای تجاری کمک می‌کند عملکرد مزرعه را پایدار و قابل پیش‌بینی کنند.</p>
						<ul class="info-list">
							<li><i class="bi bi-check-circle-fill"></i><span>بیش از ۱۰ کشور تحت پوشش در منطقه</span></li>
							<li><i class="bi bi-check-circle-fill"></i><span>پرتفوی متنوع کودهای محلول، ریزمغذی و بایواستیمولانت</span></li>
							<li><i class="bi bi-check-circle-fill"></i><span>پشتیبانی فنی و آموزش میدانی برای شرکای فروش</span></li>
						</ul>
					</div>
					<div class="col-lg-5">
						<div class="content-card">
							<h4>چشم‌انداز</h4>
							<p>تبدیل شدن به مرجع قابل اعتماد تغذیه گیاهی در خاورمیانه با تکیه بر علم، کیفیت و همراهی بلندمدت.</p>
							<h4 class="mt-4">مأموریت</h4>
							<p class="mb-0">ارائه راهکارهای تخصصی، ایمن و کارآمد برای هر محصول کشاورزی و هر سیستم کشت.</p>
						</div>
					</div>
				</div>
			</div>
		</section>
		<section class="page-section page-section-soft" id="factory">
			<div class="container">
				<span class="eyebrow">تولید</span>
				<h2 class="section-title">کارخانه و تولید</h2>
				<p class="section-desc mb-4">از فرمولاسیون تا بسته‌بندی؛ تمرکز بر کیفیت پایدار.</p>
				<div class="row g-4">
					<div class="col-md-4"><div class="content-card"><h5>خطوط تولید</h5><p class="mb-0">تولید کودهای محلول، مخلوط‌های تخصصی و بسته‌بندی متنوع.</p></div></div>
					<div class="col-md-4"><div class="content-card"><h5>کنترل کیفیت</h5><p class="mb-0">آزمایش مواد اولیه و محصول نهایی قبل از ارسال.</p></div></div>
					<div class="col-md-4"><div class="content-card"><h5>ظرفیت</h5><p class="mb-0">پاسخ‌گویی به تقاضای داخلی و صادرات منطقه‌ای.</p></div></div>
				</div>
			</div>
		</section>
		<section class="page-section" id="quality">
			<div class="container">
				<span class="eyebrow">استاندارد</span>
				<h2 class="section-title">کیفیت و گواهی‌ها</h2>
				<p class="section-desc mb-4">تعهد به استانداردهای ایمنی، خلوص و عملکرد محصول.</p>
				<ul class="info-list mb-4">
					<li><i class="bi bi-patch-check-fill"></i><span>کنترل کیفی مواد اولیه و بچ‌های تولیدی</span></li>
					<li><i class="bi bi-patch-check-fill"></i><span>مستندسازی SDS / TDS برای محصولات</span></li>
					<li><i class="bi bi-patch-check-fill"></i><span>هم‌راستایی با الزامات ثبت و ایمنی کشاورزی</span></li>
				</ul>
				<div class="d-flex flex-wrap gap-2">
					<a href="${prefix}downloads.html#sds" class="btn btn-outline-primary rounded-pill">برگه‌های SDS</a>
					<a href="${prefix}downloads.html#tds" class="btn btn-outline-primary rounded-pill">برگه‌های TDS</a>
					<a href="${prefix}downloads.html" class="btn btn-primary rounded-pill">مرکز دانلود مدارک</a>
					<a href="${prefix}contact.html" class="btn btn-outline-primary rounded-pill">تماس با ما</a>
				</div>
			</div>
		</section>`,
  });
}

// ——— PRODUCTS ———
page("products.html", {
  active: "products",
  title: "محصولات | داتیس",
  description: "کاتالوگ محصولات تخصصی تغذیه گیاهی داتیس",
  hero: pageHero(
    [
      { href: "index.html", label: "خانه" },
      { href: "#", label: "محصولات" },
    ],
    "محصولات داتیس",
    "محصول مناسب را بر اساس خانواده، نوع کشت یا نیاز مزرعه خود بیابید."
  ),
  body: (() => {
    const p = "";
    return `
		<section class="page-section">
			<div class="container">
				<div class="filter-bar">
					<input type="search" class="form-control" placeholder="جستجوی محصول…" aria-label="جستجو" />
					<select class="form-select" aria-label="خانواده محصول">
						<option selected>همه خانواده‌ها</option>
						<option>کودهای محلول</option>
						<option>بایواستیمولانت</option>
						<option>ریزمغذی</option>
					</select>
					<select class="form-select" aria-label="نوع کشت">
						<option selected>همه انواع کشت</option>
						<option>گلخانه</option>
						<option>فضای باز</option>
						<option>قطره‌ای</option>
					</select>
				</div>
				<div class="row g-4">
					${productCard({ prefix: p }, "product-details.html", p + "assets/img/prod-potassium.png", "پرفروش", "پتاسیم نیترات محلول", "کود کاملاً محلول برای کوددهی قطره‌ای.")}
					${productCard({ prefix: p }, "product-details.html", p + "assets/img/prod-npk.png", "", "کود NPK محلول", "فرمولاسیون متعادل برای رشد رویشی و زایشی.")}
					${productCard({ prefix: p }, "product-details.html", p + "assets/img/prod-biostimulant.png", "جدید", "بایواستیمولانت آمینواسید", "افزایش تحمل تنش و بهبود جذب مواد مغذی.")}
					${productCard({ prefix: p }, "product-details.html", p + "assets/img/prod-micro.png", "", "ریزمغذی کلاته", "تأمین عناصر کم‌مصرف با قابلیت جذب بالا.")}
				</div>
				<div class="mt-4 d-flex flex-wrap gap-2">
					<a href="product-category.html" class="btn btn-outline-primary rounded-pill">خانواده کودهای محلول</a>
					<a href="downloads.html#catalog" class="btn btn-primary rounded-pill">دانلود کاتالوگ</a>
				</div>
			</div>
		</section>`;
  })(),
});

// NOTE: product-details.html is hand-maintained (SEO content, related products/crops/knowledge, comments, quote/consult modals).
// Do not overwrite via generator.

// NOTE: product-category.html is hand-maintained (SEO box + simple filter + pagination).
// Do not overwrite via generator.

// ——— KNOWLEDGE ———
// NOTE: knowledge.html + knowledge-details.html are hand-maintained.
// knowledge-details includes crop/method anchors and merged video library (#videos).
// Do not recreate knowledge-videos.html or overwrite knowledge-details via generator.

page("faq.html", {
  active: "knowledge",
  title: "سوالات متداول | داتیس",
  description: "پاسخ به پرسش‌های رایج درباره محصولات و تغذیه گیاهی",
  hero: pageHero(
    [
      { href: "index.html", label: "خانه" },
      { href: "#", label: "سوالات متداول" },
    ],
    "سوالات متداول",
    "پاسخ‌های کوتاه به پرسش‌های رایج کشاورزان و شرکای فروش."
  ),
  body: `
		<section class="page-section">
			<div class="container" style="max-width:48rem">
				<div class="accordion" id="faqAcc">
					<div class="accordion-item">
						<h2 class="accordion-header"><button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#f1">چگونه محصول مناسب را انتخاب کنم؟</button></h2>
						<div id="f1" class="accordion-collapse collapse show" data-bs-parent="#faqAcc"><div class="accordion-body">از <a href="index.html#explore">راهنمای انتخاب</a> یا صفحه <a href="products.html">محصولات</a> استفاده کنید، یا فرم مشاوره را تکمیل نمایید.</div></div>
					</div>
					<div class="accordion-item">
						<h2 class="accordion-header"><button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#f2">SDS و TDS را از کجا دریافت کنم؟</button></h2>
						<div id="f2" class="accordion-collapse collapse" data-bs-parent="#faqAcc"><div class="accordion-body">از بخش <a href="downloads.html">دانلودها</a> یا صفحه هر محصول.</div></div>
					</div>
					<div class="accordion-item">
						<h2 class="accordion-header"><button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#f3">چگونه نماینده فروش شوم؟</button></h2>
						<div id="f3" class="accordion-collapse collapse" data-bs-parent="#faqAcc"><div class="accordion-body">فرم <a href="partnership.html">همکاری با داتیس</a> را ارسال کنید.</div></div>
					</div>
				</div>
			</div>
		</section>`,
});

// ——— BLOG & EVENTS ———
page("blog.html", {
  active: "events",
  title: "اخبار و مقالات | داتیس",
  description: "آخرین اخبار و مقالات داتیس اگروکمیکالز",
  hero: pageHero(
    [
      { href: "index.html", label: "خانه" },
      { href: "#", label: "بلاگ" },
    ],
    "اخبار و مقالات",
    "تازه‌های صنعت، معرفی محصولات و روایت‌های میدانی."
  ),
  body: `
		<section class="page-section">
			<div class="container">
				<div class="row g-4">
					<div class="col-md-6 col-lg-4">
						<article class="blog-card">
							<a href="blog-details.html" class="blog-card-media">
								<img src="assets/img/illustrations/lab-quality.jpg" alt="خط تولید کودهای محلول داتیس" loading="lazy" width="640" height="400" />
							</a>
							<div class="blog-card-body">
								<span class="content-meta">
									<span>۱۶ تیر</span>
									<span>اخبار</span>
									<span class="blog-read-time"><i class="bi bi-clock" aria-hidden="true"></i> ۴ دقیقه مطالعه</span>
								</span>
								<h2 class="h5">راه‌اندازی خط تولید جدید کودهای محلول</h2>
								<p>افزایش ظرفیت تولید برای پاسخ به تقاضای بازار منطقه.</p>
								<a href="blog-details.html" class="product-link">ادامه مطلب <i class="bi bi-arrow-left"></i></a>
							</div>
						</article>
					</div>
					<div class="col-md-6 col-lg-4">
						<article class="blog-card">
							<a href="knowledge-details.html" class="blog-card-media">
								<img src="assets/img/illustrations/irrigation.jpg" alt="کودآبیاری در فصل گرم" loading="lazy" width="640" height="400" />
							</a>
							<div class="blog-card-body">
								<span class="content-meta">
									<span>۱۰ تیر</span>
									<span>آموزش</span>
									<span class="blog-read-time"><i class="bi bi-clock" aria-hidden="true"></i> ۶ دقیقه مطالعه</span>
								</span>
								<h2 class="h5">نکات فصل گرم برای کودآبیاری</h2>
								<p>تنظیم برنامه تغذیه در دماهای بالا.</p>
								<a href="knowledge-details.html" class="product-link">مشاهده آموزش <i class="bi bi-arrow-left"></i></a>
							</div>
						</article>
					</div>
					<div class="col-md-6 col-lg-4">
						<article class="blog-card">
							<a href="event-details.html" class="blog-card-media">
								<img src="assets/img/illustrations/orchard.jpg" alt="نمایشگاه کشاورزی تهران" loading="lazy" width="640" height="400" />
							</a>
							<div class="blog-card-body">
								<span class="content-meta">
									<span>۵ تیر</span>
									<span>رویداد</span>
									<span class="blog-read-time"><i class="bi bi-clock" aria-hidden="true"></i> ۳ دقیقه مطالعه</span>
								</span>
								<h2 class="h5">حضور در نمایشگاه کشاورزی تهران</h2>
								<p>معرفی راهکارهای جدید تغذیه گیاهی.</p>
								<a href="event-details.html" class="product-link">جزئیات رویداد <i class="bi bi-arrow-left"></i></a>
							</div>
						</article>
					</div>
				</div>
			</div>
		</section>`,
});

// blog-details.html is hand-maintained (SEO, sidebar, comments, pager). Do not overwrite via generator.

page("events.html", {
  active: "events",
  title: "رویدادها | داتیس",
  description: "نمایشگاه‌ها، وبینارها و رویدادهای داتیس",
  hero: pageHero(
    [
      { href: "index.html", label: "خانه" },
      { href: "#", label: "رویدادها" },
    ],
    "رویدادها و اخبار",
    "نمایشگاه‌ها، روزهای مزرعه و وبینارهای تخصصی."
  ),
  body: `
		<section class="page-section">
			<div class="container">
				<div class="row g-4">
					<div class="col-md-6 col-lg-4">
						<article class="event-card event-card--with-image">
							<a href="event-details.html" class="event-card-media">
								<img src="assets/img/illustrations/orchard.jpg" alt="نمایشگاه کشاورزی تهران" loading="lazy" width="640" height="400" />
								<div class="event-date"><span class="day">۲۲</span><span class="month">تیر</span></div>
							</a>
							<div class="event-body">
								<span class="event-tag">نمایشگاه</span>
								<h5>حضور داتیس در نمایشگاه کشاورزی تهران</h5>
								<p>معرفی جدیدترین راهکارهای تغذیه گیاهی.</p>
								<a href="event-details.html" class="product-link">جزئیات <i class="bi bi-arrow-left"></i></a>
							</div>
						</article>
					</div>
					<div class="col-md-6 col-lg-4">
						<article class="event-card event-card--with-image">
							<a href="event-details.html" class="event-card-media">
								<img src="assets/img/illustrations/crops-close.jpg" alt="وبینار تغذیه گلخانه‌ای" loading="lazy" width="640" height="400" />
								<div class="event-date"><span class="day">۰۵</span><span class="month">مرداد</span></div>
							</a>
							<div class="event-body">
								<span class="event-tag">وبینار</span>
								<h5>وبینار تغذیه گلخانه‌ای</h5>
								<p>جلسه آنلاین با کارشناسان فنی داتیس.</p>
								<a href="event-details.html" class="product-link">جزئیات <i class="bi bi-arrow-left"></i></a>
							</div>
						</article>
					</div>
				</div>
			</div>
		</section>`,
});

// event-details.html is hand-maintained (gallery + optional video). Do not overwrite via generator.

function formPage(rel, active, title, desc, heroTitle, heroDesc, formId, fieldsExtra = "") {
  const depth = rel.split("/").length - 1;
  const p = depth === 0 ? "" : "../".repeat(depth);
  page(rel, {
    active,
    title,
    description: desc,
    hero: pageHero(
      [
        { href: `${p}index.html`, label: "خانه" },
        { href: "#", label: heroTitle },
      ],
      heroTitle,
      heroDesc
    ),
    body: `
		<section class="page-section">
			<div class="container">
				<div class="row justify-content-center">
					<div class="col-lg-8">
						<div class="form-page-card">
							<form id="${formId}" class="consult-form" novalidate data-success-target="${formId}Success">
								<div class="row g-3">
									<div class="col-md-6">
										<label class="form-label" for="${formId}Name">نام و نام خانوادگی</label>
										<input class="form-control" id="${formId}Name" required placeholder="نام شما" />
										<div class="invalid-feedback">لطفاً نام را وارد کنید.</div>
									</div>
									<div class="col-md-6">
										<label class="form-label" for="${formId}Phone">شماره تماس</label>
										<input class="form-control" id="${formId}Phone" type="tel" required placeholder="۰۹۱۲۳۴۵۶۷۸۹" />
										<div class="invalid-feedback">شماره تماس معتبر وارد کنید.</div>
									</div>
									<div class="col-md-6">
										<label class="form-label" for="${formId}Company">نام شرکت / مزرعه</label>
										<input class="form-control" id="${formId}Company" placeholder="اختیاری" />
									</div>
									<div class="col-md-6">
										<label class="form-label" for="${formId}City">شهر / استان</label>
										<input class="form-control" id="${formId}City" required placeholder="مثلاً اصفهان" />
										<div class="invalid-feedback">شهر یا استان را وارد کنید.</div>
									</div>
									${fieldsExtra}
									<div class="col-12">
										<label class="form-label" for="${formId}Msg">توضیحات</label>
										<textarea class="form-control" id="${formId}Msg" rows="3" placeholder="نیاز یا درخواست خود را بنویسید…"></textarea>
									</div>
									<div class="col-12">
										<button type="submit" class="btn btn-primary rounded-pill px-4"><i class="bi bi-send me-2"></i>ارسال درخواست</button>
									</div>
								</div>
							</form>
							<div id="${formId}Success" class="cta-success d-none mt-3" role="alert"><i class="bi bi-check-circle"></i> درخواست شما ثبت شد. به‌زودی تماس می‌گیریم.</div>
						</div>
					</div>
				</div>
			</div>
		</section>`,
  });
}

page("distributors.html", {
  active: "contact",
  title: "توزیع‌کنندگان | داتیس",
  description: "فهرست نمایندگان و توزیع‌کنندگان داتیس",
  hero: pageHero(
    [
      { href: "index.html", label: "خانه" },
      { href: "#", label: "توزیع‌کنندگان" },
    ],
    "یافتن توزیع‌کننده",
    "نمایندگان منتخب در استان‌های مختلف (نمونه نمایشی)."
  ),
  body: `
		<section class="page-section">
			<div class="container">
				<div class="filter-bar">
					<select class="form-select" aria-label="استان"><option selected>همه استان‌ها</option><option>تهران</option><option>اصفهان</option><option>فارس</option></select>
				</div>
				<div class="row g-3">
					<div class="col-md-6"><div class="download-row"><div><strong>نمایندگی تهران</strong><div class="text-muted small">۰۲۱-۲۶۲۱۰۱۲۱</div></div><span class="badge text-bg-light">تهران</span></div></div>
					<div class="col-md-6"><div class="download-row"><div><strong>پخش اصفهان</strong><div class="text-muted small">۰۳۱-۳۱۲۳۴۵۶۷</div></div><span class="badge text-bg-light">اصفهان</span></div></div>
					<div class="col-md-6"><div class="download-row"><div><strong>عامل فروش فارس</strong><div class="text-muted small">۰۷۱-۳۱۲۳۴۵۶۷</div></div><span class="badge text-bg-light">فارس</span></div></div>
				</div>
				<div class="mt-4"><a href="partnership.html#apply" class="btn btn-primary rounded-pill">درخواست همکاری</a></div>
			</div>
		</section>`,
});

// partnership.html is hand-maintained (unified B2B / sales-rep / distributor landing).

formPage(
  "consultation.html",
  "contact",
  "درخواست مشاوره و قیمت | داتیس",
  "درخواست مشاوره تخصصی یا قیمت محصولات داتیس — یک فرم با موضوع قابل انتخاب",
  "درخواست مشاوره و قیمت",
  "موضوع درخواست را انتخاب کنید؛ کارشناسان داتیس برای مشاوره تغذیه یا اعلام قیمت با شما تماس می‌گیرند.",
  "requestForm",
  `<div class="col-12"><label class="form-label" for="requestFormSubject">موضوع درخواست</label><select class="form-select" id="requestFormSubject" required><option value="" selected disabled>انتخاب کنید…</option><option value="consultation">مشاوره تخصصی تغذیه</option><option value="quote">درخواست قیمت (RFQ)</option></select><div class="invalid-feedback">موضوع درخواست را انتخاب کنید.</div></div>
   <div class="col-md-6"><label class="form-label" for="requestFormProduct">محصول / زمینه</label><select class="form-select" id="requestFormProduct"><option value="" selected>انتخاب کنید…</option><option>پتاسیم نیترات</option><option>NPK محلول</option><option>بایواستیمولانت</option><option>ریزمغذی</option><option>مشاوره عمومی</option><option>سایر</option></select></div>
   <div class="col-md-6"><label class="form-label" for="requestFormMethod">نوع کشت</label><select class="form-select" id="requestFormMethod"><option value="" selected>انتخاب کنید…</option><option>گلخانه</option><option>فضای باز</option><option>آبیاری قطره‌ای</option><option>درختان میوه</option></select></div>
   <div class="col-md-6"><label class="form-label" for="requestFormQty">حجم تقریبی</label><input class="form-control" id="requestFormQty" placeholder="مثلاً ۵ تن (برای درخواست قیمت)" /></div>`
);

page("contact.html", {
  active: "contact",
  title: "تماس و پشتیبانی | داتیس",
  description: "تماس و پشتیبانی فنی داتیس — دفتر مرکزی، کارخانه و فرم پیام",
  hero: pageHero(
    [
      { href: "index.html", label: "خانه" },
      { href: "#", label: "تماس" },
    ],
    "تماس و پشتیبانی",
    "دفتر مرکزی، پشتیبانی فنی، کارخانه و فرم پیام."
  ),
  body: `
		<section class="page-section" id="contact-form">
			<div class="container">
				<div class="row g-4">
					<div class="col-lg-5">
						<div class="content-card">
							<ul class="footer-contact">
								<li><span class="footer-contact-icon"><i class="bi bi-geo-alt"></i></span><span>تهران، امانیه، خیابان ولیعصر، خیابان شهید مهری، پلاک ۲۰</span></li>
								<li><span class="footer-contact-icon"><i class="bi bi-telephone"></i></span><a href="tel:+982126210121">۰۲۱-۲۶۲۱۰۱۲۱</a></li>
								<li><span class="footer-contact-icon"><i class="bi bi-envelope"></i></span><a href="mailto:info@datisac.com">info@datisac.com</a></li>
							</ul>
							<a href="#support" class="btn btn-outline-primary btn-sm rounded-pill mt-2">پشتیبانی فنی</a>
						</div>
					</div>
					<div class="col-lg-7">
						<div class="form-page-card">
							<form id="contactForm" class="consult-form" novalidate data-success-target="contactFormSuccess">
								<div class="row g-3">
									<div class="col-md-6"><label class="form-label" for="contactFormName">نام</label><input class="form-control" id="contactFormName" required /><div class="invalid-feedback">نام را وارد کنید.</div></div>
									<div class="col-md-6"><label class="form-label" for="contactFormPhone">تلفن</label><input class="form-control" id="contactFormPhone" type="tel" required /><div class="invalid-feedback">تلفن معتبر وارد کنید.</div></div>
									<div class="col-12"><label class="form-label" for="contactFormMsg">پیام</label><textarea class="form-control" id="contactFormMsg" rows="4" required></textarea><div class="invalid-feedback">پیام را بنویسید.</div></div>
									<div class="col-12"><button class="btn btn-primary rounded-pill px-4" type="submit">ارسال پیام</button></div>
								</div>
							</form>
							<div id="contactFormSuccess" class="cta-success d-none mt-3"><i class="bi bi-check-circle"></i> پیام شما ارسال شد.</div>
						</div>
					</div>
				</div>
			</div>
		</section>
		<section class="page-section page-section-soft" id="support">
			<div class="container">
				<span class="eyebrow">پشتیبانی</span>
				<h2 class="section-title">پشتیبانی فنی</h2>
				<p class="section-desc mb-4">سوال فنی دارید؟ تیم کارشناسی داتیس آماده راهنمایی است.</p>
				<div class="row g-4">
					<div class="col-md-4"><div class="content-card text-center"><i class="bi bi-whatsapp display-6 text-primary"></i><h5 class="mt-2">واتساپ</h5><p class="mb-0">پاسخ سریع کارشناسی</p></div></div>
					<div class="col-md-4"><div class="content-card text-center"><i class="bi bi-telephone display-6 text-primary"></i><h5 class="mt-2">تلفن</h5><p class="mb-0"><a href="tel:+982126210121">۰۲۱-۲۶۲۱۰۱۲۱</a></p></div></div>
					<div class="col-md-4"><div class="content-card text-center"><i class="bi bi-journal-text display-6 text-primary"></i><h5 class="mt-2">دانش‌نامه</h5><p class="mb-0"><a href="knowledge.html">مرکز آموزش</a></p></div></div>
				</div>
				<div class="mt-4"><a href="consultation.html" class="btn btn-primary rounded-pill">ثبت درخواست پشتیبانی</a></div>
			</div>
		</section>`,
});

page("downloads.html", {
  active: "products",
  title: "مرکز دانلود | داتیس",
  description: "کاتالوگ، SDS و TDS محصولات داتیس",
  hero: pageHero(
    [
      { href: "index.html", label: "خانه" },
      { href: "#", label: "دانلودها" },
    ],
    "مرکز دانلود",
    "کاتالوگ، برگه‌های ایمنی (SDS) و مشخصات فنی (TDS) در یک صفحه."
  ),
  body: `
		<section class="page-section" id="catalog">
			<div class="container">
				<span class="eyebrow">کاتالوگ</span>
				<h2 class="section-title">کاتالوگ محصولات ۲۰۲۵</h2>
				<p class="section-desc mb-4">مشخصات فنی، راهنمای کاربرد و معرفی کامل محصولات.</p>
				<a href="assets/catalog.pdf" class="btn btn-primary rounded-pill px-4" download="datis-catalog.pdf" target="_blank" rel="noopener noreferrer"><i class="bi bi-download me-2"></i>دانلود کاتالوگ PDF</a>
			</div>
		</section>
		<section class="page-section page-section-soft" id="sds">
			<div class="container">
				<span class="eyebrow">ایمنی</span>
				<h2 class="section-title">برگه‌های ایمنی (SDS)</h2>
				<div class="filter-bar"><input class="form-control" type="search" placeholder="جستجوی نام محصول…" aria-label="جستجو" /></div>
				<div class="download-row"><div><strong>پتاسیم نیترات — SDS</strong></div><a class="btn btn-sm btn-outline-primary rounded-pill" href="assets/catalog.pdf" target="_blank" rel="noopener">دانلود</a></div>
				<div class="download-row"><div><strong>NPK محلول — SDS</strong></div><a class="btn btn-sm btn-outline-primary rounded-pill" href="assets/catalog.pdf" target="_blank" rel="noopener">دانلود</a></div>
			</div>
		</section>
		<section class="page-section" id="tds">
			<div class="container">
				<span class="eyebrow">فنی</span>
				<h2 class="section-title">برگه‌های فنی (TDS)</h2>
				<div class="download-row"><div><strong>پتاسیم نیترات — TDS</strong></div><a class="btn btn-sm btn-outline-primary rounded-pill" href="product-details.html">صفحه محصول</a></div>
				<div class="download-row"><div><strong>کاتالوگ جامع — مشخصات</strong></div><a class="btn btn-sm btn-primary rounded-pill" href="assets/catalog.pdf" target="_blank" rel="noopener">دانلود PDF</a></div>
				<div class="mt-4"><a href="about.html#quality" class="btn btn-outline-primary rounded-pill">بخش کیفیت</a></div>
			</div>
		</section>`,
});

page("privacy.html", {
  active: "home",
  title: "حریم خصوصی | داتیس",
  description: "سیاست حفظ حریم خصوصی داتیس اگروکمیکالز",
  hero: pageHero(
    [
      { href: "index.html", label: "خانه" },
      { href: "#", label: "حریم خصوصی" },
    ],
    "حریم خصوصی",
    "نحوه جمع‌آوری و استفاده از اطلاعات کاربران (متن نمایشی)."
  ),
  body: `
		<section class="page-section"><div class="container article-body">
			<p>ما اطلاعات تماس ارسال‌شده از طریق فرم‌ها را صرفاً برای پاسخ‌گویی به درخواست شما و بهبود خدمات استفاده می‌کنیم و به اشخاص ثالث نمی‌فروشیم.</p>
			<p>در صورت نیاز به حذف یا اصلاح اطلاعات، با <a href="mailto:info@datisac.com">info@datisac.com</a> تماس بگیرید.</p>
		</div></section>`,
});

page("terms.html", {
  active: "home",
  title: "شرایط استفاده | داتیس",
  description: "شرایط استفاده از وب‌سایت داتیس",
  hero: pageHero(
    [
      { href: "index.html", label: "خانه" },
      { href: "#", label: "شرایط استفاده" },
    ],
    "شرایط استفاده",
    "قوانین استفاده از محتوای وب‌سایت (متن نمایشی)."
  ),
  body: `
		<section class="page-section"><div class="container article-body">
			<p>محتوای این وب‌سایت جنبه اطلاع‌رسانی دارد. توصیه‌های فنی جایگزین مشاوره کارشناسی حضوری نیست و مصرف محصولات باید مطابق برچسب و توصیه کارشناس باشد.</p>
			<p>کلیه حقوق مادی و معنوی متعلق به داتیس اگروکمیکالز است.</p>
		</div></section>`,
});

page("404.html", {
  active: "home",
  title: "صفحه پیدا نشد | داتیس",
  description: "خطای ۴۰۴",
  hero: "",
  body: `
		<section class="page-404">
			<div class="container">
				<div class="page-404-code">۴۰۴</div>
				<h1 class="page-hero-title">صفحه پیدا نشد</h1>
				<p class="page-hero-desc mx-auto">این آدرس وجود ندارد یا جابه‌جا شده است.</p>
				<div class="d-flex flex-wrap gap-2 justify-content-center mt-3">
					<a href="index.html" class="btn btn-primary rounded-pill px-4">بازگشت به خانه</a>
					<a href="products.html" class="btn btn-outline-primary rounded-pill px-4">محصولات</a>
					<a href="contact.html" class="btn btn-outline-primary rounded-pill px-4">تماس</a>
				</div>
			</div>
		</section>`,
});

console.log("Done.");
