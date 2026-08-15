export type Language = "vi" | "en";

export const translations = {
  vi: {
    // Site
    siteName: "AI Books",
    siteTagline: "Tri thức AI cho mọi thế hệ",
    
    // Header
    books: "Sách",
    allBooks: "Tất cả sách",
    categories: "Danh mục",
    search: "Tìm kiếm",
    orderBooks: "Đặt sách",
    
    // Filter
    filterByCategory: "Lọc theo danh mục",
    allCategories: "Tất cả danh mục",
    showing: "Hiển thị",
    booksFound: "cuốn sách",
    
    // Homepage
    heroTitle: "AI không chỉ dành cho kỹ sư.",
    heroSubtitle: "Thư viện được tuyển chọn kỹ lưỡng, được thiết kế để mang trí tuệ nhân tạo đến với học sinh tiểu học, trung học, sinh viên đại học, lập trình viên và kỹ sư AI.",
    exploreBooks: "Khám phá sách",
    viewNewReleases: "Xem sách mới",
    viewBook: "Xem sách",
    
    // Categories
    "ai-for-kids": "AI cho Trẻ em",
    "ai-for-middle-school": "AI cho THCS",
    "ai-for-high-school": "AI cho THPT",
    "chuyen-nganh-ai": "Chuyên ngành AI",
    "computer-vision": "Computer Vision",
    "data-algorithms": "Dữ liệu & Thuật toán",
    
    // Early Buyer
    earlyBuyerTitle: "50 Độc giả Đầu tiên",
    earlyBuyerSubtitle: "Nhận giảm giá 10% cho mỗi cuốn sách",
    earlyBuyerDescription: "50 khách hàng đầu tiên mua mỗi cuốn sách sẽ nhận được giảm giá 10%",
    offersClaimed: "ưu đãi đã sử dụng",
    spotsRemaining: "ưu đãi còn lại",
    orderNow: "Đặt hàng ngay",
    
    // Book
    authors: "Tác giả",
    publisher: "Nhà xuất bản",
    year: "Năm",
    targetAudience: "Đối tượng",
    
    // Checkout
    recipientInfo: "Thông tin người nhận",
    fullName: "Họ và tên",
    phoneNumber: "Số điện thoại",
    shippingAddress: "Địa chỉ giao hàng",
    provinceCity: "Tỉnh/Thành phố",
    note: "Ghi chú",
    quantity: "Số lượng",
    orderSummary: "Tóm tắt đơn hàng",
    bookPrice: "Giá sách",
    discount: "Giảm giá",
    total: "Tổng cộng",
    confirmOrder: "Xác nhận đơn hàng",
    
    // Promotions
    qualifyDiscount: "🎉 Bạn đủ điều kiện giảm giá 10% cho đơn hàng này.",
    welcomeBack: "Chào mừng trở lại.",
    returningOffer: "Ưu đãi khách hàng quay lại: -10%",
    
    // Footer
    explore: "Khám phá",
    information: "Thông tin",
    about: "Giới thiệu",
    contact: "Liên hệ",
    shippingPolicy: "Chính sách giao hàng",
    privacyPolicy: "Chính sách bảo mật",
    getUpdates: "Nhận thông tin mới",
    subscribe: "Đăng ký",
  },
  en: {
    // Site
    siteName: "AI Books",
    siteTagline: "AI Knowledge for Every Generation",
    
    // Header
    books: "Books",
    allBooks: "All Books",
    categories: "Categories",
    search: "Search",
    orderBooks: "Order Books",
    
    // Filter
    filterByCategory: "Filter by Category",
    allCategories: "All Categories",
    showing: "Showing",
    booksFound: "books found",
    
    // Homepage
    heroTitle: "AI is not only for engineers.",
    heroSubtitle: "A curated library designed to bring artificial intelligence to learners from primary school and secondary school to university students, developers, and AI engineers.",
    exploreBooks: "Explore Books",
    viewNewReleases: "View New Releases",
    viewBook: "View Book",
    
    // Categories
    "ai-for-kids": "AI for Kids",
    "ai-for-middle-school": "AI for Middle School",
    "ai-for-high-school": "AI for High School",
    "chuyen-nganh-ai": "AI Specialization",
    "computer-vision": "Computer Vision",
    "data-algorithms": "Data & Algorithms",
    
    // Early Buyer
    earlyBuyerTitle: "First 50 Readers",
    earlyBuyerSubtitle: "Get 10% off per book",
    earlyBuyerDescription: "First 50 customers for each book receive 10% discount",
    offersClaimed: "offers claimed",
    spotsRemaining: "spots remaining",
    orderNow: "Order Now",
    
    // Book
    authors: "Authors",
    publisher: "Publisher",
    year: "Year",
    targetAudience: "Target Audience",
    
    // Checkout
    recipientInfo: "Recipient Information",
    fullName: "Full Name",
    phoneNumber: "Phone Number",
    shippingAddress: "Shipping Address",
    provinceCity: "Province/City",
    note: "Note",
    quantity: "Quantity",
    orderSummary: "Order Summary",
    bookPrice: "Book price",
    discount: "Discount",
    total: "Total",
    confirmOrder: "Confirm Order",
    
    // Promotions
    qualifyDiscount: "🎉 You qualify for 10% off this order.",
    welcomeBack: "Welcome back.",
    returningOffer: "Returning customer offer: -10%",
    
    // Footer
    explore: "Explore",
    information: "Information",
    about: "About",
    contact: "Contact",
    shippingPolicy: "Shipping Policy",
    privacyPolicy: "Privacy Policy",
    getUpdates: "Get Updates",
    subscribe: "Subscribe",
  },
};

export function getTranslation(lang: Language, key: keyof typeof translations.en): string {
  return translations[lang][key] || translations.en[key] || key;
}
