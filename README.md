# 🌤️ Weather App — Angular

تطبيق طقس مبني بـ **Angular 17** و **Bootstrap 5** (بـ CSS عادي، مش SCSS)، مصمم على تصميم Figma المرفق (خلفية بنفسجية داكنة/فاتحة، بيت 3D، كروت تفاصيل الطقس).

## المميزات
- 🔍 البحث عن مدينة (Autocomplete عبر OpenWeatherMap Geocoding API)
- 🌡️ درجة الحرارة الحالية + الأعلى/الأدنى
- 💧 نسبة الرطوبة (مع نقطة الندى)
- 💨 سرعة واتجاه الرياح (بوصلة SVG)
- ☁️ حالة الطقس
- 🌅 وقت الشروق والغروب
- 📅 توقعات الطقس بالساعة (8 نقاط) والأسبوع (5 أيام — حسب الـ free tier)
- 🌬️ جودة الهواء ومؤشر الأشعة فوق البنفسجية (UV)
- 📍 استخدام الموقع الحالي (Geolocation)
- ⭐ حفظ المدن المفضلة (localStorage)
- 🔄 Loading state و ❌ Error handling كاملين
- 🌙 / ☀️ Dark / Light Mode — **يُحفظ تلقائيًا** في localStorage
- 🌐 دعم كامل للعربية والإنجليزية مع **RTL**
- 📱 Responsive Design (Bootstrap grid)

## الإعداد

### 1) تثبيت الحزم
```bash
npm install
```

### 2) مفتاح OpenWeatherMap API (مجاني)
1. أنشئ حساب مجاني على https://openweathermap.org/api
2. انسخ الـ API Key من صفحة الحساب (قد يستغرق تفعيله حتى ساعتين)
3. افتح `src/environments/environment.ts` (و `environment.prod.ts`) وضع المفتاح:
```ts
export const environment = {
  production: false,
  openWeatherApiKey: 'YOUR_API_KEY_HERE',
  ...
};
```

> يستخدم التطبيق فقط الـ endpoints المجانية: `weather` (الحالي)، `forecast` (5 أيام / كل 3 ساعات)، `geo/1.0` (البحث)، `air_pollution` (جودة الهواء)، و `uvi` (اختياري — إذا لم يكن متاحًا على خطتك، سيظهر "N/A" بدل أن يفشل التطبيق).

### 3) تشغيل المشروع
```bash
ng serve
```
افتح المتصفح على `http://localhost:4200`

### 4) بناء نسخة الإنتاج
```bash
ng build --configuration production
```

## هيكلة المشروع
```
src/app/
├── core/
│   ├── i18n/            # خدمة الترجمة + RTL + translate pipe
│   ├── models/           # Interfaces (CurrentWeather, DailyForecastItem...)
│   ├── services/         # WeatherService, ThemeService, GeolocationService, SavedCitiesService
│   └── utils/            # تحويل أيقونات الطقس، مستوى UV/AQI، نقطة الندى
├── shared/components/    # مكونات قابلة لإعادة الاستخدام (بحث، كروت التفاصيل، بوصلة الرياح...)
└── features/
    ├── home/              # الشاشة الرئيسية
    └── saved-cities/      # شاشة المدن المحفوظة
```

## ملاحظات
- الـ Dark/Light mode واللغة يُحفظان في `localStorage` ويُستعادان تلقائيًا عند فتح التطبيق.
- الـ free tier من OpenWeatherMap يعطي توقعات حتى 5 أيام فقط (بفواصل 3 ساعات)، لذلك "Weekly Forecast" هنا هو تجميع لـ 5 أيام.
- صورة البيت مأخوذة من ملفات الـ Figma المرفقة (`src/assets/img/house.png`).
