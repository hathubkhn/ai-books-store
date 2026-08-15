# Visual Guide - Bilingual Support & Category Filter

## 🌐 Language Switcher

### Location
The language switcher appears in the **header** next to the search icon.

```
┌─────────────────────────────────────────────────────┐
│ AI Books        Books Categories    🌐 VI  🔍  📚  │
└─────────────────────────────────────────────────────┘
                                       ↑
                              Language Switcher
```

### Behavior
- **Desktop & Mobile**: Globe icon (🌐) with current language (VI/EN)
- **Click**: Instantly switches between Vietnamese and English
- **Persistence**: Language preference saved in localStorage
- **Effect**: All UI text changes immediately (no page reload)

---

## 📚 Books Page with Category Filter

### Desktop Layout (≥1024px)

```
┌────────────────────────────────────────────────────────────┐
│                    Header                                   │
└────────────────────────────────────────────────────────────┘
┌────────────────────────────────────────────────────────────┐
│  All Books                                                  │
├──────────────────┬─────────────────────────────────────────┤
│                  │                                          │
│  📁 Filter       │  Showing 18 books found                 │
│                  │                                          │
│  [All Categories]│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐  │
│  [ AI for Kids  ]│  │ Book │ │ Book │ │ Book │ │ Book │  │
│  [Middle School ]│  │   1  │ │   2  │ │   3  │ │   4  │  │
│  [High School   ]│  └──────┘ └──────┘ └──────┘ └──────┘  │
│  [Chuyên Ngành  ]│                                         │
│  [Data & Algos  ]│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐  │
│                  │  │ Book │ │ Book │ │ Book │ │ Book │  │
│  (Sticky)        │  │   5  │ │   6  │ │   7  │ │   8  │  │
│                  │  └──────┘ └──────┘ └──────┘ └──────┘  │
│                  │                                          │
└──────────────────┴─────────────────────────────────────────┘
```

### Mobile Layout (<1024px)

```
┌────────────────────────────────────┐
│            Header                   │
└────────────────────────────────────┘
┌────────────────────────────────────┐
│  All Books                          │
├────────────────────────────────────┤
│  Filter by Category:                │
│  ┌─────────────────────────────┐  │
│  │ All Categories          ▾   │  │
│  └─────────────────────────────┘  │
│                                     │
│  Showing 18 books found            │
│                                     │
│  ┌──────────┐  ┌──────────┐       │
│  │  Book 1  │  │  Book 2  │       │
│  └──────────┘  └──────────┘       │
│                                     │
│  ┌──────────┐  ┌──────────┐       │
│  │  Book 3  │  │  Book 4  │       │
│  └──────────┘  └──────────┘       │
└────────────────────────────────────┘
```

---

## 🔄 Translation Examples

### Header Navigation

| English         | Vietnamese       |
|----------------|------------------|
| Books          | Sách             |
| Categories     | Danh mục         |
| Search         | Tìm kiếm         |
| Order Books    | Đặt sách         |

### Category Filter

| English              | Vietnamese           |
|---------------------|----------------------|
| Filter by Category   | Lọc theo danh mục    |
| All Categories       | Tất cả danh mục      |
| Showing 18 books found | Hiển thị 18 cuốn sách |

### Homepage

| English                          | Vietnamese                        |
|---------------------------------|-----------------------------------|
| AI is not only for engineers.   | AI không chỉ dành cho kỹ sư.    |
| Explore Books                    | Khám phá sách                     |
| View New Releases               | Xem sách mới                      |

---

## 🎯 Filter Interaction Flow

### Desktop
1. User lands on `/books` page
2. Sees category sidebar on the left (sticky)
3. Clicks a category button
4. Books instantly filter to show only that category
5. Count updates: "Showing X books found"
6. Selected category highlighted in orange (accent color)

### Mobile
1. User lands on `/books` page
2. Sees dropdown at the top
3. Taps dropdown and selects a category
4. Books instantly filter
5. Count updates

---

## 💡 Key Features

### Language Switching
✅ **Instant**: No page reload required
✅ **Persistent**: Remembered across sessions
✅ **Global**: Affects all UI text
✅ **Accessible**: Clear visual indicator (globe icon + language code)

### Category Filtering
✅ **Fast**: Client-side filtering for instant results
✅ **Responsive**: Different layouts for desktop/mobile
✅ **Sticky**: Desktop sidebar follows scroll
✅ **Visual Feedback**: Selected category clearly highlighted
✅ **Dynamic Count**: Shows number of books in current view

---

## 🚀 Quick Test Steps

### Test Language Switching
1. Go to `http://localhost:3001/`
2. Look for globe icon in header (top right area)
3. Click it - should show "EN" (currently Vietnamese)
4. All text should change to English
5. Refresh page - should stay in English
6. Click again - back to Vietnamese

### Test Category Filter (Desktop)
1. Go to `http://localhost:3001/books`
2. See sidebar on left with category list
3. Click "AI for Kids"
4. Only books in that category show
5. Count updates (e.g., "Showing 3 books found")
6. Click "All Categories"
7. All books show again

### Test Category Filter (Mobile)
1. Resize browser to mobile width (<1024px)
2. Go to `http://localhost:3001/books`
3. See dropdown at top instead of sidebar
4. Select a category
5. Books filter instantly
6. Count updates

---

## 📱 Responsive Breakpoints

| Screen Size | Layout                  | Filter UI      |
|------------|-------------------------|----------------|
| < 1024px   | Single column          | Dropdown       |
| ≥ 1024px   | Sidebar + main content | Sticky sidebar |

---

## 🎨 Visual Design

### Category Filter Buttons (Desktop)
- **Unselected**: Light gray background (`bg-surface`)
- **Hover**: Slightly lighter (`bg-surface-light`)
- **Selected**: Orange background (`bg-accent`), white text
- **Width**: Full width (256px sidebar)
- **Spacing**: 8px between buttons

### Dropdown (Mobile)
- **Style**: Standard input field styling
- **Full width**: Spans container width
- **Clear label**: "Filter by Category" above

### Book Count
- **Color**: Secondary foreground color
- **Position**: Above book grid
- **Text**: "Showing X books found" (translated)

---

**Ready to test!** 🎉

Visit `http://localhost:3001/books` to see the new category filter and use the language switcher in the header to test bilingual support.
