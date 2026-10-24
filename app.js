/* MATE frontend: bilingual student meal planning, recipe search, budget and Maps. */
"use strict";

(() => {
  const { ingredients, recipes, places, photos } = window.MATE_DATA;
  const STORAGE_KEY = "mate-student-app-v3";
  const LEGACY_DEFAULT_BUDGET = 2000000;
  const NON_VEGETARIAN_INGREDIENTS = new Set(["chicken", "chicken-thigh", "pork", "minced-pork", "pork-ribs", "beef", "fish", "shrimp", "tuna", "squid", "salmon", "sausage", "fish-sauce", "oyster-sauce"]);
  const DEFAULT_STATE = {
    lang: "vi",
    user: null,
    token: "",
    preferences: {
      monthlyBudget: 0,
      budgetConfigured: false,
      people: 1,
      healthGoal: "balanced",
      tastes: ["Vietnamese"],
      preferredMealTypes: [],
      allergies: [],
      favoriteIngredients: [],
      favoriteDishes: [],
      customAvoidIngredients: [],
      cookingSetup: "full"
    },
    pantry: [],
    plan: {},
    availability: { 1: "busy", 2: "busy", 3: "busy", 4: "busy", 5: "busy", 6: "free", 0: "free" },
    expenses: [],
    drawHistory: [],
    appearance: { fontSize: "normal", fontScale: 110, fontScaleBaselineUpdated: true, theme: "sage", customColor: "", mascot: null },
    lastActiveAt: ""
  };

  const COPY = {
    vi: {
      brandTagline:"Ăn tốt, Sống tốt",workspace:"KHÔNG GIAN CỦA BẠN",navOverview:"Tổng quan",navPlanner:"Thực đơn",navRecipes:"Khám phá món",navPantry:"Tủ nguyên liệu",navBudget:"Chi tiêu",navNearby:"Quanh bạn",navBlindbox:"Túi mù món ngon",navSettings:"Cài đặt",sidebarTip:"Một lựa chọn nhỏ hôm nay, một tháng nhẹ ví hơn.",
      welcomeEyebrow:"THỨ HAI, NGÀY MỚI NHẸ NHÀNG",hello:"Chào bạn",welcomeSub:"Hôm nay ăn ngon, chi tiêu thông minh nhé.",heroKicker:"BẠN CỦA BỮA ĂN CÂN BẰNG",heroTitle:"Ăn ngon hơn.<br><em>Ví nhẹ lo hơn.</em>",heroText:"Kế hoạch nhỏ cho những ngày bận rộn và ngân sách sinh viên.",makePlan:"Lên thực đơn tuần",heroNote:"ngon · gọn · tiết kiệm",budgetThisMonth:"NGÂN SÁCH THÁNG",spentThisMonth:"ĐÃ CHI THÁNG NÀY",plannedMeals:"BỮA ĐÃ LÊN LỊCH",thisWeek:" bữa tuần này",mealVariety:"Đa dạng món ăn",planHint:"Thêm món để tuần này dễ thở hơn",timeSaved:"THỜI GIAN NẤU HÔM NAY",timeFriendly:"dành cho bạn",timeTip:"Có thể chuẩn bị trước",timeHint:"Chọn nhịp sống trong mục Thực đơn",spentHint:"Theo dõi để không bất ngờ cuối tháng",todaySection:"HÔM NAY CÓ GÌ",todaysMenu:"Gợi ý cho hôm nay",viewWeekPlan:"Xem kế hoạch tuần",quickActions:"Đi nhanh tới",findMeal:"Tìm món ăn",findMealHint:"Từ nguyên liệu đang có",blindboxShort:"Túi mù hôm nay",blindboxHint:"Bốc món ngẫu nhiên",findNearby:"Tìm quanh đây",findNearbyHint:"Chợ, siêu thị, quán ăn",checkBudget:"Xem ngân sách",checkBudgetHint:"Còn bao nhiêu cho bữa ăn",smartPick:"MATE CHỌN CHO BẠN",lowCostPick:"Ngon, no, vừa túi tiền",yourRhythm:"NHỊP SỐNG CỦA BẠN",weekAtGlance:"Tuần này nhìn nhanh",noMealToday:"Chưa có món cho hôm nay",addMealNow:"Thêm món cho hôm nay",chooseMeal:"Chọn món",noMealsYet:"Chưa lên lịch bữa nào",addPlan:"Thêm vào thực đơn",viewRecipe:"Xem công thức",perServing:"mỗi phần",minutes:"phút",missing:"Còn thiếu",allReady:"Đã có đủ nguyên liệu",allergyWarning:"Có nguyên liệu cần tránh theo hồ sơ của bạn.",budgetWarning:"Sắp chạm ngân sách tháng rồi. MATE gợi ý chọn món tiết kiệm nhé.",budgetExceeded:"Bạn đã vượt ngân sách tháng. Hãy xem lại các khoản chi.",budgetSafe:"Ngân sách của bạn vẫn ổn. Tiếp tục ghi lại chi tiêu nhé.",
      plannerEyebrow:"ĂN GÌ TUẦN NÀY?",plannerTitle:"Thực đơn của bạn",plannerSub:"Sắp xếp món theo lịch học, lịch làm và thời gian nấu.",clearWeek:"Xóa lịch tuần",generateWeek:"Gợi ý tuần này",busyDay:"Ngày bận",freeDay:"Ngày rảnh",planned:"Đã lên món",prepAhead:"CHUẨN BỊ TRƯỚC",batchCooking:"Nấu một lần, ăn vài bữa",mySchedule:"LỊCH CỦA TÔI",busyFreeDays:"Ngày bận & ngày rảnh",schedulePrompt:"Chọn nhịp sinh hoạt để MATE xếp món hợp lý.",monday:"Thứ Hai",tuesday:"Thứ Ba",wednesday:"Thứ Tư",thursday:"Thứ Năm",friday:"Thứ Sáu",saturday:"Thứ Bảy",sunday:"Chủ Nhật",setBusy:"Đánh dấu ngày bận",setFree:"Đánh dấu ngày rảnh",addMealForDay:"Thêm món",removeMeal:"Bỏ món",batchTip:"Món này có thể nấu thêm phần để dành cho ngày bận.",generatedPlan:"MATE đã xếp gợi ý cho 7 ngày dựa trên thời gian và ngân sách của bạn.",weekCleared:"Đã xóa thực đơn tuần này.",
      recipesEyebrow:"MÓN NGON CHO MỌI NGÀY",recipesTitle:"Khám phá món ăn",recipesSub:"Nhập món bạn muốn ăn hoặc những thứ đang có trong tủ.",surpriseMe:"Làm mình bất ngờ",recipeSearchPlaceholder:"Nhập món ăn hoặc nguyên liệu, ví dụ: trứng, cà chua...",search:"Tìm",filterAll:"Tất cả",filterBreakfast:"Bữa sáng",filterLunch:"Bữa trưa",filterDinner:"Bữa tối",filterSnack:"Ăn nhẹ",sortBy:"Sắp xếp:",sortRecommended:"Gợi ý",sortLowPrice:"Giá thấp trước",sortQuick:"Nấu nhanh trước",dietNote:"MATE sẽ ưu tiên món phù hợp với dị ứng và sở thích bạn đã chọn.",editPrefs:"Chỉnh sở thích",popularRecipes:"Món được yêu thích",resetFilters:"Xóa bộ lọc",noRecipesFound:"Chưa tìm thấy món phù hợp. Thử nguyên liệu hoặc tên món khác nhé.",recipeCount:"món gợi ý",cookingTime:"Thời gian nấu",estimatedPrice:"Chi phí ước tính",ingredientsLabel:"Nguyên liệu",stepsLabel:"Cách làm",shoppingNeed:"Nguyên liệu bạn cần mua",addRecipeToPlan:"Thêm vào thực đơn",searchMissingOnMaps:"Tìm nguyên liệu thiếu trên Maps",serves:"phần ăn",allergenContains:"Có thể chứa",noAllergenMatch:"Không phát hiện nguyên liệu bạn đã đánh dấu tránh trong danh mục này.",
      pantryEyebrow:"DÙNG HẾT ĐỒ ĐANG CÓ",pantryTitle:"Tủ nguyên liệu",pantrySub:"Thêm đồ bạn đang có để tìm món phù hợp và bớt lãng phí.",addIngredient:"Thêm nguyên liệu",ingredientsAvailable:"NGUYÊN LIỆU ĐANG CÓ",recipesPossible:"MÓN CÓ THỂ NẤU",useSoon:"NÊN DÙNG SỚM",pantrySearchPlaceholder:"Tìm trong danh sách nguyên liệu",catVegetable:"Rau củ",catProtein:"Đạm",catStaple:"Tinh bột",catSeasoning:"Gia vị",myIngredients:"ĐANG CÓ TRONG TỦ",pantryList:"Danh sách nguyên liệu",smartMatch:"GHÉP MÓN THÔNG MINH",cookFromPantry:"Nấu được từ tủ đồ",pantryMatchHint:"MATE tìm món có nhiều nguyên liệu bạn đang có nhất.",emptyPantry:"Tủ nguyên liệu của bạn đang trống.",addSomeIngredients:"Thêm vài nguyên liệu để MATE ghép món nhé.",addToPantry:"Thêm vào tủ",removeFromPantry:"Đã xóa khỏi tủ",expiringSoon:"Dùng sớm",quantity:"Số lượng",expiryDate:"Hạn dùng (không bắt buộc)",
      budgetEyebrow:"CHI TIÊU CÓ KẾ HOẠCH",budgetTitle:"Ngân sách ăn uống",budgetSub:"Ghi lại từng khoản nhỏ để cuối tháng vẫn thoải mái.",addExpense:"Thêm khoản chi",monthlyBudget:"NGÂN SÁCH THÁNG",editBudget:"Sửa ngân sách",spent:"Đã chi",left:"Còn lại",dailyAverage:"TRUNG BÌNH MỖI NGÀY",dailyAverageHint:"để giữ đúng kế hoạch tháng này",spendingHistory:"LỊCH SỬ CHI TIÊU",recentExpenses:"Khoản chi gần đây",thisMonth:"Tháng này",allTime:"Tất cả",whereMoneyGoes:"CHI VÀO ĐÂU",spendingByType:"Theo loại chi tiêu",spendingTip:"Mẹo nhỏ: nấu thêm một phần cho ngày mai giúp tiết kiệm cả thời gian và tiền.",expenseTitle:"Ghi lại khoản chi",expenseAmount:"Số tiền",expenseCategory:"Loại chi",expenseFood:"Ăn ngoài",expenseGroceries:"Nguyên liệu",expenseMarket:"Chợ / siêu thị",expenseOther:"Khác",expenseDate:"Ngày chi",expenseNote:"Ghi chú",saveExpense:"Lưu khoản chi",cancel:"Hủy",noExpenses:"Chưa có khoản chi nào được ghi lại.",budgetPrompt:"Nhập ngân sách ăn uống tháng của bạn",budgetSaved:"Đã cập nhật ngân sách.",expenseSaved:"Đã lưu khoản chi.",
      nearbyEyebrow:"MUA GẦN, ĂN NGON",nearbyTitle:"Quanh bạn có gì?",nearbySub:"Tìm nơi mua nguyên liệu hoặc quán ăn khi hôm nay không muốn nấu.",useMyLocation:"Dùng vị trí của tôi",nearbyPlaceholder:"Nhập khu vực, trường đại học hoặc tên đường",groceries:"Cửa hàng thực phẩm",markets:"Chợ",supermarkets:"Siêu thị",restaurants:"Quán ăn",cheapEats:"Món bình dân",placesNearYou:"GỢI Ý ĐỊA ĐIỂM",foodStores:"Cửa hàng thực phẩm",mapNotice:"MATE mở bản đồ Google Maps theo khu vực bạn tìm. Giá thực tế có thể khác nhau giữa các cửa hàng.",openGoogleMaps:"Mở Google Maps",priceEstimate:"Giá nguyên liệu trong MATE là ước tính để lập kế hoạch. Hãy kiểm tra giá trực tiếp tại cửa hàng.",locationPermission:"Cho phép vị trí trong trình duyệt để tìm quanh bạn, hoặc nhập khu vực vào ô tìm kiếm.",mapSearchResults:"Tìm trên Google Maps",mapQueryHint:"Chạm để xem địa điểm và chỉ đường trên Google Maps.",indicativePrice:"Giá tham khảo trong MATE",searchByIngredient:"Tìm cửa hàng bán nguyên liệu này",locationReady:"Đã dùng vị trí hiện tại của bạn.",locationFailed:"Chưa lấy được vị trí. Bạn có thể nhập khu vực thủ công.",
      blindEyebrow:"MỞ TÚI MÙ, GẶP MÓN NGON",blindTitle:"Hôm nay ăn gì?<br><em>Để MATE chọn!</em>",blindSub:"Flashcard gợi ý nguyên liệu bất ngờ từ những thứ bạn có sẵn.",drawCard:"Rút một thẻ",useMyPantry:"Chỉ dùng đồ trong tủ",ingredients:"nguyên liệu",recipes:"công thức",possibilities:"khả năng ngon",yourIngredient:"NGUYÊN LIỆU CỦA BẠN",drawPrompt:"Nhấn “Rút một thẻ” để bắt đầu",drawPlaceholder:"Khi rút được nguyên liệu, MATE sẽ tìm những món có thể nấu cùng nguyên liệu đó.",recentDraws:"NHỮNG LẦN RÚT GẦN ĐÂY",yourLuckyCards:"Thẻ may mắn của bạn",clearHistory:"Xóa lịch sử",drawAgain:"Rút thẻ khác",recipeIdeas:"MATE tìm được những món này",noRecipeForIngredient:"Chưa có món trong bộ công thức dùng nguyên liệu này. Thử rút thẻ khác nhé.",
      settingsEyebrow:"MATE THEO CÁCH BẠN",settingsTitle:"Cài đặt của bạn",settingsSub:"Cho MATE biết ngân sách, khẩu vị và nhịp sinh hoạt phù hợp.",foodPrefs:"Khẩu vị & sức khỏe",foodPrefsSub:"MATE dùng thông tin này để chọn món hợp hơn với bạn.",healthGoal:"Ưu tiên sức khỏe",healthBalanced:"Ăn uống cân bằng",healthProtein:"Tăng món giàu đạm",healthLight:"Món nhẹ nhàng",healthGoalHint:"Gợi ý chung, không thay thế tư vấn y tế",scheduleTab:"Lịch sinh hoạt",accountTab:"Tài khoản & dữ liệu",appearanceTab:"Giao diện",monthlyFoodBudget:"Ngân sách ăn uống mỗi tháng",budgetPersonalHint:"Chỉ dùng để tính gợi ý cá nhân",peopleEating:"Số người ăn",servingHint:"MATE sẽ nhân lượng nguyên liệu theo số người",tastePrefs:"Khẩu vị yêu thích",multiSelect:"Có thể chọn nhiều",vietnameseFood:"Món Việt",asianFood:"Món Á",westernFood:"Món Âu",vegetarian:"Chay",spicy:"Cay",quickMeals:"Nhanh gọn",avoidIngredients:"Nguyên liệu cần tránh",avoidHint:"MATE sẽ lọc món có chứa lựa chọn của bạn",peanuts:"Đậu phộng",seafood:"Hải sản",dairy:"Sữa",eggs:"Trứng",soy:"Đậu nành",gluten:"Gluten",cookingSetup:"Điều kiện nấu nướng",cookingSetupHint:"Chọn dụng cụ bạn có thể dùng",fullKitchen:"Bếp đầy đủ",basicKitchen:"Bếp cơ bản, nồi và chảo",microwaveOnly:"Lò vi sóng / nồi điện",noKitchen:"Không có bếp",saveChanges:"Lưu thay đổi",preferencesSaved:"Đã lưu sở thích của bạn.",schedulePrefsSub:"Ngày bận ưu tiên món nhanh; ngày rảnh dành cho món chuẩn bị trước.",accountManageSub:"Quản lý tài khoản, đồng bộ và dữ liệu cá nhân của bạn.",dataSyncTitle:"Dữ liệu được lưu trên máy chủ MATE",dataSyncText:"Thông tin tài khoản và hồ sơ được gửi đến máy chủ để đăng nhập và đồng bộ. Mật khẩu được băm an toàn và không hiển thị cho quản trị viên.",appearanceSub:"Chỉnh chữ và màu sắc để MATE dễ nhìn hơn với bạn.",fontSize:"Cỡ chữ",fontSizeHint:"Áp dụng trên toàn ứng dụng",fontNormal:"Vừa",fontLarge:"Lớn",fontXLarge:"Rất lớn",colorTheme:"Màu giao diện",colorThemeHint:"Màu xanh lá là màu chủ đạo MATE",privacy:"Quyền riêng tư",accountSignIn:"Đăng nhập hoặc tạo tài khoản để đồng bộ dữ liệu trên máy chủ MATE.",signIn:"Đăng nhập",createAccount:"Tạo tài khoản",signOut:"Đăng xuất",signedInAs:"Đang đăng nhập với",deleteAccount:"Xóa tài khoản và dữ liệu",deleteAccountConfirm:"Xóa vĩnh viễn tài khoản và dữ liệu đã đồng bộ? Hành động này không thể hoàn tác.",deleteAccountPassword:"Nhập mật khẩu để xác nhận xóa",accountDeleted:"Tài khoản và dữ liệu máy chủ đã được xóa.",dataSynced:"Đã đồng bộ dữ liệu lên máy chủ MATE.",
      footerTagline:"Ăn ngon, sống khôn — mỗi ngày một chút.",mascotTooltip:"Kéo mình đi, chạm để mở nhanh!",authLoginTitle:"Chào mừng bạn trở lại",authCreateTitle:"Tạo tài khoản MATE",authName:"Tên của bạn",authEmail:"Email",authPassword:"Mật khẩu",authPasswordHint:"Ít nhất 8 ký tự",authConsent:"Tôi đồng ý để thông tin tài khoản và hồ sơ được lưu trên máy chủ MATE để đăng nhập và đồng bộ.",authNeedAccount:"Chưa có tài khoản?",authHaveAccount:"Đã có tài khoản?",authContinue:"Tiếp tục",authCreating:"Đang tạo tài khoản…",authLoggingIn:"Đang đăng nhập…",authSuccess:"Đăng nhập thành công.",authCreated:"Tài khoản MATE của bạn đã được tạo.",authServerUnavailable:"Chưa kết nối được máy chủ. Hãy mở app bằng địa chỉ MATE trong trình duyệt khi máy chủ đang chạy.",authError:"Không thể hoàn tất. Vui lòng thử lại.",mascotOpened:"Chạm lại mascot để đóng menu nhanh.",quickMenuTitle:"Mở nhanh",
      mondayShort:"T2",tuesdayShort:"T3",wednesdayShort:"T4",thursdayShort:"T5",fridayShort:"T6",saturdayShort:"T7",sundayShort:"CN",accountGuest:"Khách ghé chơi",noDataYet:"Chưa có dữ liệu",recipeNoKitchen:"Không cần bếp",minutesShort:"ph",servingsShort:"phần",estimated:"ước tính",pricePerServing:"/ phần",errorGeneric:"Có lỗi nhỏ rồi. Vui lòng thử lại.",passwordNeeded:"Nhập mật khẩu để tiếp tục.",ingredientAdded:"Đã thêm nguyên liệu vào tủ.",planAdded:"Đã thêm món vào thực đơn.",planRemoved:"Đã bỏ món khỏi lịch.",dayBusy:"Ngày bận",dayFree:"Ngày rảnh",
      recipeModalTitle:"Công thức món ăn",searchResultsFor:"Kết quả cho",ingredientPickTitle:"Thêm đồ vào tủ nguyên liệu",ingredientPickSearch:"Tìm nguyên liệu",pickARecipe:"Chọn món",dayLabel:"Ngày",monthLabel:"tháng",budgetOver:"Vượt kế hoạch",budgetAlmost:"Gần chạm mức",budgetOkay:"Trong kế hoạch",noShoppingNeeded:"Bạn đã có các nguyên liệu chính trong tủ.",weekBudgetNote:"Ước tính theo khẩu phần đã chọn.",languageChanged:"Language changed to English.",languageChangedVi:"Đã chuyển sang tiếng Việt.",delete:"Xóa",open:"Mở",close:"Đóng",photoCredit:"Ảnh món ăn minh họa"
    },
    en: {
      brandTagline:"Eat Better, Live Better",workspace:"YOUR SPACE",navOverview:"Overview",navPlanner:"Meal plan",navRecipes:"Discover recipes",navPantry:"My pantry",navBudget:"Spending",navNearby:"Nearby",navBlindbox:"Surprise meal",navSettings:"Settings",sidebarTip:"One small choice today makes the month feel lighter.",welcomeEyebrow:"MONDAY, A FRESH START",hello:"Hello",welcomeSub:"Eat well and spend thoughtfully today.",heroKicker:"YOUR BALANCED-MEAL BUDDY",heroTitle:"Eat a little better.<br><em>Worry a little less.</em>",heroText:"A simple plan for busy days and a student budget.",makePlan:"Plan my week",heroNote:"tasty · simple · smart",budgetThisMonth:"MONTHLY BUDGET",spentThisMonth:"SPENT THIS MONTH",plannedMeals:"MEALS PLANNED",thisWeek:" meals this week",mealVariety:"A little variety goes a long way",planHint:"Add a meal to make this week easier",timeSaved:"TODAY'S COOKING TIME",timeFriendly:"made for you",timeTip:"Some prep can happen ahead",timeHint:"Set your weekly rhythm in Meal plan",spentHint:"Track it now, avoid surprises later",todaySection:"ON THE MENU",todaysMenu:"A little idea for today",viewWeekPlan:"See this week's plan",quickActions:"Jump right in",findMeal:"Find a meal",findMealHint:"From what you already have",blindboxShort:"Today's surprise",blindboxHint:"Pick a random ingredient",findNearby:"Find nearby",findNearbyHint:"Markets, groceries, restaurants",checkBudget:"Check my budget",checkBudgetHint:"See what's left for meals",smartPick:"MATE'S PICKS FOR YOU",lowCostPick:"Tasty, filling, student-friendly",yourRhythm:"YOUR WEEKLY RHYTHM",weekAtGlance:"Your week at a glance",noMealToday:"Nothing planned for today yet",addMealNow:"Pick today's meal",chooseMeal:"Choose a meal",noMealsYet:"No meals planned yet",addPlan:"Add to plan",viewRecipe:"View recipe",perServing:"per serving",minutes:"min",missing:"Missing",allReady:"You have the ingredients",allergyWarning:"This recipe includes an ingredient you asked to avoid.",budgetWarning:"You're getting close to this month's budget. Try a lower-cost meal.",budgetExceeded:"You've gone over this month's budget. Review recent spending.",budgetSafe:"Your budget is on track. Keep logging purchases.",
      plannerEyebrow:"WHAT'S FOR DINNER THIS WEEK?",plannerTitle:"Your meal plan",plannerSub:"Fit meals around classes, shifts and the time you have to cook.",clearWeek:"Clear this week",generateWeek:"Suggest my week",busyDay:"Busy day",freeDay:"Free day",planned:"Planned",prepAhead:"PREP AHEAD",batchCooking:"Cook once, enjoy it twice",mySchedule:"MY SCHEDULE",busyFreeDays:"Busy and free days",schedulePrompt:"Set your rhythm and MATE will plan around it.",monday:"Monday",tuesday:"Tuesday",wednesday:"Wednesday",thursday:"Thursday",friday:"Friday",saturday:"Saturday",sunday:"Sunday",setBusy:"Mark as busy",setFree:"Mark as free",addMealForDay:"Add a meal",removeMeal:"Remove meal",batchTip:"Make an extra portion for a busy day.",generatedPlan:"MATE suggested seven meals around your schedule and budget.",weekCleared:"This week's meal plan is clear.",
      recipesEyebrow:"EVERYDAY FOOD, MADE EASIER",recipesTitle:"Discover recipes",recipesSub:"Search for a dish or ingredients already in your kitchen.",surpriseMe:"Surprise me",recipeSearchPlaceholder:"Search dish or ingredient, e.g. eggs, tomatoes...",search:"Search",filterAll:"All",filterBreakfast:"Breakfast",filterLunch:"Lunch",filterDinner:"Dinner",filterSnack:"Snacks",sortBy:"Sort:",sortRecommended:"Recommended",sortLowPrice:"Lowest cost",sortQuick:"Quickest",dietNote:"MATE prioritizes meals that fit your preferences and avoid list.",editPrefs:"Edit preferences",popularRecipes:"Popular recipes",resetFilters:"Clear filters",noRecipesFound:"No matching recipes. Try another dish or ingredient.",recipeCount:"ideas",cookingTime:"Cooking time",estimatedPrice:"Estimated cost",ingredientsLabel:"Ingredients",stepsLabel:"How to make it",shoppingNeed:"Ingredients to pick up",addRecipeToPlan:"Add to meal plan",searchMissingOnMaps:"Find missing ingredients on Maps",serves:"servings",allergenContains:"May contain",noAllergenMatch:"No ingredients from your avoid list were found in this recipe.",
      pantryEyebrow:"USE WHAT YOU ALREADY HAVE",pantryTitle:"My pantry",pantrySub:"Add what's in your kitchen to find matching meals and reduce waste.",addIngredient:"Add ingredient",ingredientsAvailable:"INGREDIENTS ON HAND",recipesPossible:"MEALS YOU CAN MAKE",useSoon:"USE SOON",pantrySearchPlaceholder:"Search your pantry",catVegetable:"Vegetables",catProtein:"Protein",catStaples:"Staples",catStaple:"Staples",catSeasoning:"Seasonings",myIngredients:"WHAT'S IN MY KITCHEN",pantryList:"Ingredient list",smartMatch:"SMART MATCHES",cookFromPantry:"Make something from this",pantryMatchHint:"MATE finds recipes that use the most ingredients you already have.",emptyPantry:"Your pantry is empty for now.",addSomeIngredients:"Add a few ingredients and MATE will find a match.",addToPantry:"Add to pantry",removeFromPantry:"Removed from pantry",expiringSoon:"Use soon",quantity:"Quantity",expiryDate:"Use-by date (optional)",
      budgetEyebrow:"SPEND WITH A PLAN",budgetTitle:"Food budget",budgetSub:"Track the small purchases so the end of the month feels easier.",addExpense:"Add expense",monthlyBudget:"MONTHLY BUDGET",editBudget:"Edit budget",spent:"Spent",left:"Left",dailyAverage:"AVERAGE PER DAY",dailyAverageHint:"to stay on track this month",spendingHistory:"SPENDING HISTORY",recentExpenses:"Recent expenses",thisMonth:"This month",allTime:"All time",whereMoneyGoes:"WHERE IT GOES",spendingByType:"By spending type",spendingTip:"Tiny tip: cook an extra portion for tomorrow to save time and money.",expenseTitle:"Log an expense",expenseAmount:"Amount",expenseCategory:"Category",expenseFood:"Eating out",expenseGroceries:"Ingredients",expenseMarket:"Market / supermarket",expenseOther:"Other",expenseDate:"Date",expenseNote:"Note",saveExpense:"Save expense",cancel:"Cancel",noExpenses:"No expenses logged yet.",budgetPrompt:"Enter your monthly food budget",budgetSaved:"Budget updated.",expenseSaved:"Expense saved.",
      nearbyEyebrow:"SHOP CLOSE, EAT WELL",nearbyTitle:"What's around you?",nearbySub:"Find ingredients or a place to eat when you don't feel like cooking.",useMyLocation:"Use my location",nearbyPlaceholder:"Enter an area, university or street",groceries:"Grocery stores",markets:"Markets",supermarkets:"Supermarkets",restaurants:"Restaurants",cheapEats:"Affordable eats",placesNearYou:"PLACE SEARCH",foodStores:"Grocery stores",mapNotice:"MATE opens Google Maps for your search area. Prices vary by shop.",openGoogleMaps:"Open Google Maps",priceEstimate:"Ingredient prices in MATE are estimates for planning. Check the current price at the store.",locationPermission:"Allow browser location to search nearby, or type an area above.",mapSearchResults:"Search Google Maps",mapQueryHint:"Open Google Maps to see places and directions.",indicativePrice:"MATE price estimate",searchByIngredient:"Find shops selling this ingredient",locationReady:"Using your current location.",locationFailed:"Couldn't get your location. Enter an area manually.",
      blindEyebrow:"PICK A CARD, FIND A CRAVING",blindTitle:"What should we eat?<br><em>Let MATE pick!</em>",blindSub:"Ingredient flashcards make a meal idea from what you have.",drawCard:"Draw a card",useMyPantry:"Use pantry items only",ingredients:"ingredients",recipes:"recipes",possibilities:"ways to enjoy",yourIngredient:"YOUR INGREDIENT",drawPrompt:"Tap “Draw a card” to begin",drawPlaceholder:"Draw an ingredient and MATE will find meals you can make with it.",recentDraws:"RECENT PICKS",yourLuckyCards:"Your lucky cards",clearHistory:"Clear history",drawAgain:"Draw another",recipeIdeas:"MATE found these ideas",noRecipeForIngredient:"No recipe in this collection uses that ingredient yet. Try another card.",
      settingsEyebrow:"MATE, YOUR WAY",settingsTitle:"Your settings",settingsSub:"Set a budget, tastes and schedule that work for you.",foodPrefs:"Taste & health",foodPrefsSub:"MATE uses this to make more suitable meal suggestions.",healthGoal:"Health focus",healthBalanced:"Balanced meals",healthProtein:"More protein",healthLight:"Lighter meals",healthGoalHint:"General suggestions, not medical advice",scheduleTab:"Weekly rhythm",accountTab:"Account & data",appearanceTab:"Appearance",monthlyFoodBudget:"Monthly food budget",budgetPersonalHint:"Used to make your personal suggestions",peopleEating:"People eating",servingHint:"MATE scales ingredient quantities for your group",tastePrefs:"Favorite styles",multiSelect:"Choose as many as you like",vietnameseFood:"Vietnamese",asianFood:"Asian",westernFood:"Western",vegetarian:"Vegetarian",spicy:"Spicy",quickMeals:"Quick meals",avoidIngredients:"Ingredients to avoid",avoidHint:"MATE filters recipes containing your selections",peanuts:"Peanuts",seafood:"Seafood",dairy:"Dairy",eggs:"Eggs",soy:"Soy",gluten:"Gluten",cookingSetup:"Cooking setup",cookingSetupHint:"Choose the equipment available to you",fullKitchen:"Full kitchen",basicKitchen:"Basic stove, pot and pan",microwaveOnly:"Microwave / rice cooker",noKitchen:"No kitchen",saveChanges:"Save changes",preferencesSaved:"Your preferences are saved.",schedulePrefsSub:"Busy days favor quick meals; free days are good for prep-ahead cooking.",accountManageSub:"Manage your account, sync and personal data.",dataSyncTitle:"Data is stored on the MATE server",dataSyncText:"Account and profile details are sent to the server for sign-in and syncing. Passwords are securely hashed and aren't shown to the administrator.",appearanceSub:"Adjust text and colors to make MATE easier to read.",fontSize:"Text size",fontSizeHint:"Applies throughout the app",fontNormal:"Regular",fontLarge:"Large",fontXLarge:"Extra large",colorTheme:"Color theme",colorThemeHint:"Sage green is MATE's signature color",privacy:"Privacy",accountSignIn:"Sign in or create an account to sync your data to the MATE server.",signIn:"Sign in",createAccount:"Create account",signOut:"Sign out",signedInAs:"Signed in as",deleteAccount:"Delete account and data",deleteAccountConfirm:"Permanently delete your account and synced data? This can't be undone.",deleteAccountPassword:"Enter password to confirm deletion",accountDeleted:"Your account and server data were deleted.",dataSynced:"Your data synced to the MATE server.",
      footerTagline:"Eat well, live smart — a little every day.",mascotTooltip:"Drag me around, tap for shortcuts!",authLoginTitle:"Welcome back",authCreateTitle:"Create your MATE account",authName:"Your name",authEmail:"Email",authPassword:"Password",authPasswordHint:"At least 8 characters",authConsent:"I agree that my account and profile details are stored on the MATE server for sign-in and sync.",authNeedAccount:"New to MATE?",authHaveAccount:"Already have an account?",authContinue:"Continue",authCreating:"Creating account…",authLoggingIn:"Signing in…",authSuccess:"You're signed in.",authCreated:"Your MATE account is ready.",authServerUnavailable:"Couldn't connect to the server. Open MATE in a browser while the app server is running.",authError:"Something went wrong. Please try again.",mascotOpened:"Tap the mascot again to close shortcuts.",quickMenuTitle:"Quick actions",
      mondayShort:"Mon",tuesdayShort:"Tue",wednesdayShort:"Wed",thursdayShort:"Thu",fridayShort:"Fri",saturdayShort:"Sat",sundayShort:"Sun",accountGuest:"Guest",noDataYet:"No data yet",recipeNoKitchen:"No stove needed",minutesShort:"min",servingsShort:"servings",estimated:"estimated",pricePerServing:"/ serving",errorGeneric:"Something went wrong. Please try again.",passwordNeeded:"Enter your password to continue.",ingredientAdded:"Ingredient added to your pantry.",planAdded:"Meal added to your plan.",planRemoved:"Meal removed from the plan.",dayBusy:"Busy",dayFree:"Free",
      recipeModalTitle:"Recipe details",searchResultsFor:"Results for",ingredientPickTitle:"Add pantry ingredients",ingredientPickSearch:"Search ingredients",pickARecipe:"Choose a meal",dayLabel:"Day",monthLabel:"month",budgetOver:"Over budget",budgetAlmost:"Almost at limit",budgetOkay:"On track",noShoppingNeeded:"You have the main ingredients in your pantry.",weekBudgetNote:"Estimate based on your serving size.",languageChanged:"Language changed to English.",languageChangedVi:"Đã chuyển sang tiếng Việt.",delete:"Remove",open:"Open",close:"Close",photoCredit:"Illustrative meal photo"
    }
  };

  Object.assign(COPY.vi, {
    livePlacesTitle: "Cửa hàng gần bạn",
    livePlacesPrompt: "Tìm khu vực hoặc dùng vị trí của bạn",
    livePlacesLoading: "Đang tìm địa điểm gần bạn…",
    livePlacesLocating: "Đang xác định vị trí…",
    searchingForIngredients: "Đang tìm cửa hàng cho",
    livePlacesDisabled: "Danh sách địa điểm trực tiếp chưa được kết nối. Bạn vẫn có thể tìm qua Google Maps.",
    livePlacesEmpty: "Chưa tìm thấy địa điểm phù hợp. Thử khu vực hoặc loại cửa hàng khác nhé.",
    livePlacesError: "Chưa tải được địa điểm. Bạn vẫn có thể mở Google Maps để tìm.",
    placesAttribution: "Địa điểm từ Google Maps",
    currentLocation: "Vị trí hiện tại",
    clearSearch: "Xóa nội dung tìm kiếm",
    customColor: "Tự chọn màu"
  });
  Object.assign(COPY.en, {
    livePlacesTitle: "Nearby stores",
    livePlacesPrompt: "Search an area or use your location",
    livePlacesLoading: "Finding places near you…",
    livePlacesLocating: "Getting your location…",
    searchingForIngredients: "Finding shops for",
    livePlacesDisabled: "Live place results aren't connected yet. You can still search with Google Maps.",
    livePlacesEmpty: "No matching places found. Try another area or store type.",
    livePlacesError: "Couldn't load places. You can still open Google Maps to search.",
    placesAttribution: "Places from Google Maps",
    currentLocation: "Current location",
    clearSearch: "Clear search",
    customColor: "Choose a color"
  });

  Object.assign(COPY.vi, {
    favoriteIngredientsTitle: "Nguyên liệu bạn thích",
    favoriteIngredientsHint: "Nhập nguyên liệu để MATE ưu tiên món có dùng chúng",
    favoriteIngredientsPlaceholder: "Ví dụ: cà chua, đậu phụ",
    addPreferenceItem: "Thêm",
    customAvoidTitle: "Nguyên liệu khác cần tránh",
    customAvoidHint: "MATE sẽ loại món có nguyên liệu bạn nhập",
    customAvoidPlaceholder: "Nhập nguyên liệu cần tránh",
    removePreferenceItem: "Xóa",
    mapSetupHint: "Bản đồ tương tác cần cấu hình Maps Embed API key trong máy chủ MATE.",
    mapNotice: "Bản đồ hiển thị khu vực và địa điểm tìm được. Giá nguyên liệu có thể khác nhau giữa các cửa hàng."
  });
  Object.assign(COPY.en, {
    favoriteIngredientsTitle: "Ingredients you like",
    favoriteIngredientsHint: "Add ingredients to prioritize recipes that use them",
    favoriteIngredientsPlaceholder: "For example: tomato, tofu",
    addPreferenceItem: "Add",
    customAvoidTitle: "Other ingredients to avoid",
    customAvoidHint: "MATE filters out recipes that contain your entries",
    customAvoidPlaceholder: "Enter an ingredient to avoid",
    removePreferenceItem: "Remove",
    mapSetupHint: "Interactive maps need a Maps Embed API key configured on the MATE server.",
    mapNotice: "The map shows the search area and places. Ingredient prices can vary by store."
  });

  Object.assign(COPY.vi, {sesame:"Mè",shelfAll:"Tất cả nguyên liệu",useSoonFilter:"Nên dùng sớm",longKeepFilter:"Để được lâu",shelfDays:"ngày ước tính",unknownStorage:"Bảo quản theo nhãn sản phẩm",preferredMealTypes:"Ưu tiên loại bữa",preferredMealTypesHint:"Tích chọn để MATE xếp món đúng bữa",mealBreakfast:"Bữa sáng",mealLunch:"Bữa trưa",mealDinner:"Bữa tối",mealSnack:"Ăn nhẹ",favoriteDishesTitle:"Món hoặc nhóm món bạn thích",favoriteDishesHint:"Nhập tên món hoặc nhóm món để MATE ưu tiên gợi ý",favoriteDishesPlaceholder:"Ví dụ: phở, món cuốn, canh",favoriteDishMatchHint:"MATE sẽ ưu tiên công thức có tên phù hợp"});
  Object.assign(COPY.en, {sesame:"Sesame",shelfAll:"All ingredients",useSoonFilter:"Use soon",longKeepFilter:"Keeps longer",shelfDays:"days (estimate)",unknownStorage:"Follow package storage guidance",preferredMealTypes:"Preferred meal types",preferredMealTypesHint:"Select the meals MATE should prioritize",mealBreakfast:"Breakfast",mealLunch:"Lunch",mealDinner:"Dinner",mealSnack:"Snack",favoriteDishesTitle:"Dishes or categories you like",favoriteDishesHint:"Enter dish names or categories to prioritize",favoriteDishesPlaceholder:"For example: pho, salads, soup",favoriteDishMatchHint:"MATE will rank matching recipes higher"});
  Object.assign(COPY.vi, {healthGoalHint:"Chọn ưu tiên; MATE sẽ xếp món phù hợp lên trước và cập nhật ngay.",cookingSetupHint:"MATE chỉ gợi ý món phù hợp với thiết bị bạn có. Lựa chọn được tự lưu.",preferencesAutoSaved:"Đã lưu lựa chọn và cập nhật gợi ý món.",healthBadgeProtein:"Giàu đạm",healthBadgeBalanced:"Cân bằng",healthBadgeLight:"Món nhẹ",vegetarianBadge:"Chay",equipmentNoCook:"Không cần bếp",equipmentMicrowave:"Lò vi sóng / nồi điện",equipmentOven:"Cần lò nướng",equipmentBlender:"Cần máy xay",equipmentStove:"Bếp, nồi/chảo"});
  Object.assign(COPY.en, {healthGoalHint:"Choose a focus; MATE ranks matching meals first and updates suggestions right away.",cookingSetupHint:"MATE only suggests meals that fit your equipment. Your choice is saved automatically.",preferencesAutoSaved:"Saved. Meal suggestions are updated.",healthBadgeProtein:"High protein",healthBadgeBalanced:"Balanced",healthBadgeLight:"Light meal",vegetarianBadge:"Vegetarian",equipmentNoCook:"No cooking needed",equipmentMicrowave:"Microwave / rice cooker",equipmentOven:"Oven needed",equipmentBlender:"Blender needed",equipmentStove:"Stove, pot/pan"});
  Object.assign(COPY.vi, {dietNote:"MATE áp dụng thiết bị nấu, ưu tiên sức khỏe, món chay và nguyên liệu bạn cần tránh khi gợi ý món."});
  Object.assign(COPY.en, {dietNote:"MATE uses your cooking setup, health focus, vegetarian preference and avoided ingredients to shape suggestions."});
  function clone(value) { return JSON.parse(JSON.stringify(value)); }
  function normalizePreferences(value) {
    const preferences = { ...clone(DEFAULT_STATE.preferences), ...(value || {}) };
    // Older builds prefilled 2,000,000 ₫ without recording whether a person chose it.
    if (preferences.budgetConfigured !== true && Number(preferences.monthlyBudget) === LEGACY_DEFAULT_BUDGET) {
      preferences.monthlyBudget = 0;
    }
    preferences.budgetConfigured = preferences.budgetConfigured === true;
    ["preferredMealTypes", "favoriteDishes"].forEach((key) => {
      preferences[key] = Array.isArray(preferences[key]) ? preferences[key].filter((item) => typeof item === "string") : [];
    });
    return preferences;
  }

  function normalizeAppearance(value) {
    const appearance = { ...clone(DEFAULT_STATE.appearance), ...(value || {}) };
    const legacyScale = { normal: 110, large: 125, xlarge: 140 }[appearance.fontSize] || 110;
    const requestedScale = Number(value?.fontScale);
    const hasSavedScale = Number.isFinite(requestedScale) && requestedScale >= 85 && requestedScale <= 150;
    // Increase the old default once while preserving scales a user selected themselves.
    appearance.fontScale = hasSavedScale
      ? (!value?.fontScaleBaselineUpdated && requestedScale === 100 ? 110 : Math.round(requestedScale / 5) * 5)
      : legacyScale;
    appearance.fontScaleBaselineUpdated = true;
    return appearance;
  }

  function loadState() {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      if (!stored || typeof stored !== "object") return clone(DEFAULT_STATE);
      return {
        ...clone(DEFAULT_STATE), ...stored,
        preferences: normalizePreferences(stored.preferences),
        appearance: normalizeAppearance(stored.appearance)
      };
    } catch { return clone(DEFAULT_STATE); }
  }

  const state = loadState();
  let activePage = "overview";
  let recipeTypeFilter = "all";
  let recipeSort = "recommended";
  let pantryCategory = "all";
  let pantryShelfFilter = "all";
  let weekOffset = 0;
  let activePlace = "grocery";
  let nearbyCoordinates = null;
  let nearbyIngredientQuery = "";
  let authMode = "login";
  let syncTimer = null;
  let dragState = null;
  let selectedDayForPlan = "";
  let livePlacesRequestId = 0;
  let googleMapsEmbedKey = "";

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const translate = (key) => COPY[state.lang]?.[key] ?? COPY.vi[key] ?? key;
  const localized = (item) => item?.[state.lang] || item?.vi || item?.en || "";
  const ingredientById = (id) => ingredients.find((item) => item.id === id);

  const recipeById = (id) => recipes.find((item) => item.id === id);
  const escapeHTML = (value) => String(value ?? "").replace(/[&<>"']/g, (character) => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", "\"":"&quot;", "'":"&#39;" }[character]));
  const money = (amount) => `${new Intl.NumberFormat(state.lang === "vi" ? "vi-VN" : "en-US", { maximumFractionDigits: 0 }).format(Math.max(0, Number(amount) || 0))} ₫`;

  function currentWeekdayNames(style = "long") {
    const keys = style === "short"
      ? ["sundayShort","mondayShort","tuesdayShort","wednesdayShort","thursdayShort","fridayShort","saturdayShort"]
      : ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];
    return keys.map(translate);
  }

  function isoDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function parseIsoDate(value) {
    const [year, month, day] = String(value).split("-").map(Number);
    return new Date(year, (month || 1) - 1, day || 1);
  }

  function mondayOf(date) {
    const result = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const weekday = result.getDay();
    result.setDate(result.getDate() - ((weekday + 6) % 7));
    return result;
  }

  function formatDate(date, options = {}) {
    return new Intl.DateTimeFormat(state.lang === "vi" ? "vi-VN" : "en-US", options).format(date);
  }

  function imageMarkup(recipe, size = "") {
    const photoInfo = window.MATE_RECIPE_IMAGES?.[recipe.id] || null;
    const photo = photoInfo?.src || recipe.photo || photos.bowl;
    const icon = recipe.ingredients.map(([id]) => ingredientById(id)?.emoji).find(Boolean) || "🥗";
    const photoCredit = photoInfo?.creator
      ? `<a class="photo-credit" href="${escapeHTML(photoInfo.sourceUrl || photoInfo.licenseUrl || "#")}" target="_blank" rel="noopener noreferrer" title="${escapeHTML(`${photoInfo.title || ""} · ${photoInfo.creator} · ${photoInfo.license || ""}`)}">${escapeHTML(photoInfo.creator)} · ${escapeHTML(photoInfo.license || "")}</a>`
      : `<span class="photo-credit">${escapeHTML(translate("photoCredit"))}</span>`;
    return `<div class="recipe-image ${size}" style="--recipe-photo:url('${escapeHTML(photo)}')"><img src="${escapeHTML(photo)}" alt="${escapeHTML(localized(recipe.name))}" loading="lazy" onerror="this.remove();this.parentElement.classList.add('photo-fallback')"><span class="recipe-photo-fallback">${icon}</span>${photoCredit}</div>`;
  }

  function profilePayload() {
    return {
      preferences: state.preferences,
      availability: state.availability,
      pantry: state.pantry,
      plan: state.plan,
      expenses: state.expenses,
      drawHistory: state.drawHistory,
      appearance: state.appearance,
      lastActiveAt: new Date().toISOString()
    };
  }

  function persist(sync = true, rerender = true) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, token: state.token })); } catch { /* storage may be disabled in a private window */ }
    if (sync && state.user && state.token) scheduleSync();
    if (rerender) renderAll();
  }

  function scheduleSync() {
    clearTimeout(syncTimer);
    syncTimer = setTimeout(syncProfile, 500);
  }

  async function api(path, options = {}) {
    const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
    if (state.token) headers.Authorization = `Bearer ${state.token}`;
    const response = await fetch(path, { ...options, headers });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || translate("errorGeneric"));
    return data;
  }

  async function syncProfile() {
    if (!state.user || !state.token) return;
    try {
      await api("/api/profile", { method: "PUT", body: JSON.stringify({ profile: profilePayload() }) });
      updateAccountPanel();
    } catch (error) {
      if (error.message.includes("đăng nhập")) {
        state.user = null;
        state.token = "";
        persist(false);
      }
      console.warn("MATE sync paused:", error.message);
    }
  }

  function applyRemoteProfile(profile) {
    if (!profile || typeof profile !== "object") return;
    for (const key of ["preferences","pantry","plan","availability","expenses","drawHistory","appearance"]) {
      if (profile[key] !== undefined) state[key] = profile[key];
    }
    state.preferences = normalizePreferences(state.preferences);
    state.appearance = normalizeAppearance(state.appearance);
  }

  function applyLanguage() {
    document.documentElement.lang = state.lang;
    $$('[data-i18n]').forEach((element) => {
      const value = translate(element.dataset.i18n);
      if (value.includes("<br>") || value.includes("<em>")) element.innerHTML = value;
      else element.textContent = value;
    });
    $$('[data-placeholder]').forEach((element) => { element.placeholder = translate(element.dataset.placeholder); });
    $("#languageLabel").textContent = state.lang.toUpperCase();
    document.title = state.lang === "vi" ? "MATE — Ăn ngon, sống khôn" : "MATE — Eat smart, live well";
    updateHeader();
    renderAll();
  }

  function setPage(page) {
    const available = ["overview","planner","recipes","pantry","budget","nearby","blindbox","settings"];
    if (!available.includes(page)) page = "overview";
    activePage = page;
    $$(".page").forEach((section) => section.classList.toggle("active", section.id === `page-${page}`));
    $$(".nav-item[data-page]").forEach((button) => button.classList.toggle("active", button.dataset.page === page));
    const section = $(`#page-${page}`);
    $("#breadcrumb").textContent = state.lang === "vi" ? section?.dataset.titleVi : section?.dataset.titleEn;
    $("#sidebar").classList.remove("mobile-open");
    closeMascotMenu();
    renderPage(page);
    if (page === "nearby") refreshLivePlaces();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function goToPage(page) { setPage(page); }

  function currentMonthExpenses() {
    const currentMonth = new Date().toISOString().slice(0, 7);
    return state.expenses.filter((expense) => String(expense.date || "").slice(0, 7) === currentMonth);
  }

  function totalExpenses(expenses = currentMonthExpenses()) {
    return expenses.reduce((sum, expense) => sum + Number(expense.amount || 0), 0);
  }

  function getBudgetStatus() {
    const budget = Number(state.preferences.monthlyBudget || 0);
    const spent = totalExpenses();
    const ratio = budget > 0 ? spent / budget : spent > 0 ? 1 : 0;
    return { budget, spent, left: budget - spent, ratio, percent: Math.round(ratio * 100) };
  }

  function eligibleRecipes({ allowAllergy = false } = {}) {
    const excluded = state.preferences.allergies || [];
    const customAvoids = Array.isArray(state.preferences.customAvoidIngredients) ? state.preferences.customAvoidIngredients : [];
    const setup = state.preferences.cookingSetup || "full";
    const vegetarianOnly = (state.preferences.tastes || []).includes("vegetarian");
    const allowedEquipment = {
      basic: new Set(["stove", "pot", "pan", "rice-cooker", "no-cook"]),
      microwave: new Set(["microwave", "rice-cooker", "no-cook"]),
      "no-cook": new Set(["no-cook"])
    }[setup];
    return recipes.filter((recipe) => {
      if (!allowAllergy && recipe.allergens.some((allergen) => excluded.includes(allergen))) return false;
      if (!allowAllergy && recipeHasCustomIngredient(recipe, customAvoids)) return false;
      if (vegetarianOnly && !recipeIsVegetarian(recipe)) return false;
      const equipment = recipeEquipment(recipe);
      if (allowedEquipment && !equipment.every((item) => allowedEquipment.has(item))) return false;
      return true;
    });
  }

  function recipeEquipment(recipe) {
    if (Array.isArray(recipe.equipment) && recipe.equipment.length) return recipe.equipment;
    if ((recipe.tags || []).includes("no-cook")) return ["no-cook"];
    const method = String(recipe.method || "").toLocaleLowerCase();
    const equipmentByMethod = {
      microwave: ["microwave"], blend: ["blender"], bake: ["oven"],
      steam: ["stove", "pot"], soup: ["stove", "pot"], boil: ["stove", "pot"],
      porridge: ["stove", "pot"], braise: ["stove", "pot"], curry: ["stove", "pot"],
      rice: ["stove", "rice-cooker"], noodle: ["stove", "pot", "pan"], pan: ["stove", "pan"],
      salad: ["no-cook"]
    };
    if (equipmentByMethod[method]) return equipmentByMethod[method];
    const steps = Object.values(recipe.steps || {}).flat().join(" ").toLocaleLowerCase();
    if (/lò vi sóng|microwave/.test(steps)) return ["microwave"];
    if (/máy xay|blender|xay nhuyễn/.test(steps)) return ["blender"];
    if (/lò nướng|oven|nướng trong lò/.test(steps)) return ["oven"];
    if (/không cần nấu|không cần chế biến|không cần dùng bếp|no-cook/.test(steps)) return ["no-cook"];
    return ["stove", "pot", "pan"];
  }

  function recipeIsVegetarian(recipe) {
    return !(recipe.ingredients || []).some(([id]) => NON_VEGETARIAN_INGREDIENTS.has(id));
  }

  function recipeHealthTags(recipe) {
    const tags = new Set(recipe.tags || []);
    const records = (recipe.ingredients || []).map(([id]) => ingredientById(id)).filter(Boolean);
    const hasVegetable = records.some((ingredient) => ingredient.category === "vegetable");
    const hasProtein = records.some((ingredient) => ingredient.category === "protein");
    if (hasProtein) tags.add("high-protein");
    if (hasProtein && hasVegetable) tags.add("balanced");
    if (["soup", "salad", "steam", "no-cook"].includes(recipe.method)) tags.add("light");
    return tags;
  }

  function recipeEquipmentLabel(recipe) {
    const equipment = recipeEquipment(recipe);
    if (equipment.every((item) => item === "no-cook")) return translate("equipmentNoCook");
    if (equipment.every((item) => ["microwave", "rice-cooker", "no-cook"].includes(item))) return translate("equipmentMicrowave");
    if (equipment.includes("oven")) return translate("equipmentOven");
    if (equipment.includes("blender")) return translate("equipmentBlender");
    return translate("equipmentStove");
  }

  function recipeCost(recipe, people = state.preferences.people) {
    const scale = Math.max(1, Number(people) || 1) / Math.max(1, Number(recipe.servings) || 1);
    return Math.round(recipe.cost * scale / 500) * 500;
  }

  function preferenceScore(recipe) {
    const tastes = state.preferences.tastes || [];
    const healthTags = recipeHealthTags(recipe);
    let score = 0;
    if (tastes.includes(recipe.cuisine)) score += 2;
    if (tastes.includes("vegetarian") && recipeIsVegetarian(recipe)) score += 5;
    if (tastes.includes("quick") && (recipe.tags.includes("quick") || recipe.time <= 20)) score += 3;
    if (tastes.includes("spicy") && recipe.tags.includes("spicy")) score += 3;
    if (state.preferences.healthGoal === "protein" && healthTags.has("high-protein")) score += 5;
    if (state.preferences.healthGoal === "balanced" && healthTags.has("balanced")) score += 5;
    if (state.preferences.healthGoal === "light" && healthTags.has("light")) score += 5;
    const preferredMealTypes = Array.isArray(state.preferences.preferredMealTypes) ? state.preferences.preferredMealTypes : [];
    if (preferredMealTypes.includes(recipe.mealType)) score += 4;
    const favorites = Array.isArray(state.preferences.favoriteIngredients) ? state.preferences.favoriteIngredients : [];
    score += recipeIngredientTexts(recipe).filter((text) => favorites.some((favorite) => ingredientTextMatches(text, favorite))).length * 3;
    const favoriteDishes = Array.isArray(state.preferences.favoriteDishes) ? state.preferences.favoriteDishes : [];
    const cuisineLabels = { Vietnamese: ["Vietnamese", "Món Việt"], Asian: ["Asian", "Món Á", "Món châu Á"], Western: ["Western", "Món Âu", "món phương Tây"] };
    const tagLabels = {
      vegetarian: ["vegetarian", "chay", "món chay"], quick: ["quick", "nhanh", "nhanh gọn"],
      "high-protein": ["high-protein", "giàu đạm", "nhiều đạm"], light: ["light", "nhẹ", "món nhẹ"],
      balanced: ["balanced", "cân bằng"]
    };
    const mealLabels = { breakfast: ["breakfast", "bữa sáng", "sáng"], lunch: ["lunch", "bữa trưa", "trưa"], dinner: ["dinner", "bữa tối", "tối"], snack: ["snack", "ăn nhẹ", "bữa phụ"] };
    const recipeNames = [recipe.name.vi, recipe.name.en, ...recipeIngredientTexts(recipe), ...(cuisineLabels[recipe.cuisine] || [recipe.cuisine]), ...(mealLabels[recipe.mealType] || [recipe.mealType]), ...(recipe.tags || []).flatMap((tag) => tagLabels[tag] || [tag])];
    score += favoriteDishes.filter((favorite) => recipeNames.some((name) => ingredientTextMatches(name, favorite))).length * 5;
    return score;
  }

  function normalizeIngredientText(value) {
    return String(value || "").toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").trim();
  }

  function ingredientTextMatches(ingredientText, query) {
    const normalizedIngredient = normalizeIngredientText(ingredientText);
    const normalizedQuery = normalizeIngredientText(query);
    return normalizedQuery.length >= 2 && normalizedIngredient.includes(normalizedQuery);
  }

  function recipeIngredientTexts(recipe) {
    return recipe.ingredients.flatMap(([id]) => {
      const ingredient = ingredientById(id);
      return ingredient ? [id, ingredient.vi, ingredient.en] : [id];
    });
  }

  function recipeHasCustomIngredient(recipe, customItems) {
    return customItems.some((item) => recipeIngredientTexts(recipe).some((name) => ingredientTextMatches(name, item)));
  }

  function pantryIds() { return new Set(state.pantry.map((item) => typeof item === "string" ? item : item.id)); }

  function missingIngredients(recipe) {
    const pantry = pantryIds();
    return recipe.ingredients.filter(([id]) => !pantry.has(id));
  }

  function matchScore(recipe) {
    const pantry = pantryIds();
    const total = recipe.ingredients.length || 1;
    const have = recipe.ingredients.filter(([id]) => pantry.has(id)).length;
    return have / total;
  }

  function showToast(message, type = "success") {
    const region = $("#toastRegion");
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<span class="toast-icon">${type === "error" ? "!" : "✦"}</span><span>${escapeHTML(message)}</span>`;
    region.append(toast);
    requestAnimationFrame(() => toast.classList.add("show"));
    setTimeout(() => { toast.classList.remove("show"); setTimeout(() => toast.remove(), 260); }, 3300);
  }

  function updateHeader() {
    const name = state.user?.name || translate("accountGuest");
    const firstName = name.split(/\s+/)[0];
    $("#sidebarName").textContent = state.user ? name : translate("accountGuest");
    $("#sidebarEmail").textContent = state.user?.email || translate("accountSignIn");
    $("#topName").textContent = state.user ? firstName : translate("accountGuest");
    $("#welcomeName").textContent = state.user ? firstName : (state.lang === "vi" ? "MATE-er" : "MATE friend");
    const avatarText = (firstName || "M").charAt(0).toUpperCase();
    $("#sidebarAvatar").textContent = avatarText;
    $("#topAvatar").textContent = avatarText;
    $("#todayDate").textContent = formatDate(new Date(), { weekday: "long", day: "numeric", month: "long" });
    const section = $(`#page-${activePage}`);
    $("#breadcrumb").textContent = state.lang === "vi" ? section?.dataset.titleVi : section?.dataset.titleEn;
  }

  function selectedMealForDate(dateKey) {
    return state.plan[dateKey] || null;
  }

  function suggestedRecipe({ busy = false, exclude = [] } = {}) {
    let pool = eligibleRecipes().filter((recipe) => !exclude.includes(recipe.id));
    if (busy) pool = pool.filter((recipe) => recipe.time <= 20 || recipe.tags.includes("quick") || recipe.tags.includes("no-cook"));
    else pool = pool.filter((recipe) => recipe.tags.includes("meal-prep") || recipe.tags.includes("batch-cook") || recipe.time >= 18);
    if (!pool.length) pool = eligibleRecipes().filter((recipe) => !exclude.includes(recipe.id));
    const perDayLimit = Math.max(10000, Number(state.preferences.monthlyBudget || 0) / 30);
    const affordable = pool.filter((recipe) => recipeCost(recipe) <= perDayLimit * 1.25);
    pool = affordable.length ? affordable : pool;
    pool.sort((a, b) => preferenceScore(b) - preferenceScore(a) || matchScore(b) - matchScore(a) || recipeCost(a) - recipeCost(b));
    return pool[0] || recipes[0];
  }

  function renderOverview() {
    const budgetData = getBudgetStatus();
    const planned = Object.keys(state.plan).filter((key) => {
      const monday = isoDate(mondayOf(new Date()));
      const sunday = parseIsoDate(monday);
      sunday.setDate(sunday.getDate() + 6);
      return key >= monday && key <= isoDate(sunday);
    });
    const todayKey = isoDate(new Date());
    const todayPlan = selectedMealForDate(todayKey);
    const todayRecipe = todayPlan ? recipeById(todayPlan.recipeId) : suggestedRecipe({ busy: state.availability[new Date().getDay()] === "busy" });
    const plannedRecipe = todayPlan ? todayRecipe : null;
    $("#overviewBudget").textContent = money(budgetData.budget);
    $("#overviewSpent").textContent = money(budgetData.spent);
    $("#plannedMealCount").textContent = planned.length;
    $("#cookMinutes").textContent = todayRecipe?.time || 0;
    $("#budgetProgressBar").style.width = `${Math.min(100, budgetData.percent)}%`;
    $("#budgetPercent").textContent = `${budgetData.percent}%`;
    $("#budgetRemaining").textContent = budgetData.left >= 0
      ? `${money(budgetData.left)} ${state.lang === "vi" ? "còn lại" : "left"}`
      : `${money(Math.abs(budgetData.left))} ${translate("budgetOver")}`;
    $("#spentTrend").textContent = budgetData.spent ? `${currentMonthExpenses().length} ${state.lang === "vi" ? "khoản đã ghi" : "expenses logged"}` : translate("noDataYet");

    const card = $("#todayMealCard");
    if (!todayRecipe) {
      card.innerHTML = `<div class="today-empty"><span class="empty-illustration">🥣</span><strong>${escapeHTML(translate("noMealToday"))}</strong><button class="button button-outline" data-go="planner">${escapeHTML(translate("addMealNow"))} →</button></div>`;
    } else {
      const missing = missingIngredients(todayRecipe);
      const cost = recipeCost(todayRecipe);
      card.innerHTML = `<div class="today-card-image">${imageMarkup(todayRecipe)}</div><div class="today-card-info"><div class="today-card-top"><span class="meal-tag">${escapeHTML(localizedMealType(todayRecipe.mealType))}</span><span class="today-card-date">${escapeHTML(formatDate(new Date(), { day:"numeric", month:"short" }))}</span></div><h3>${escapeHTML(localized(todayRecipe.name))}</h3><div class="today-card-meta"><span>◷ ${todayRecipe.time} ${escapeHTML(translate("minutes"))}</span><span>◉ ${escapeHTML(money(cost))}</span></div><div class="today-card-bottom"><span class="missing-hint ${missing.length ? "" : "ready"}">${missing.length ? `${escapeHTML(translate("missing"))}: ${missing.length}` : escapeHTML(translate("allReady"))}</span><button class="round-arrow" data-recipe-details="${todayRecipe.id}" aria-label="${escapeHTML(translate("viewRecipe"))}">↗</button></div><button class="today-card-overlay" data-recipe-details="${todayRecipe.id}" aria-label="${escapeHTML(translate("viewRecipe"))}"></button></div>${plannedRecipe ? `<span class="today-planned-badge">✓ ${escapeHTML(translate("planned"))}</span>` : ""}`;
    }

    const picks = eligibleRecipes().slice().sort((a, b) => preferenceScore(b) - preferenceScore(a) || recipeCost(a) - recipeCost(b)).slice(0, 3);
    $("#smartPickList").innerHTML = picks.map((recipe, index) => `<button class="smart-pick" data-recipe-details="${recipe.id}"><span class="smart-pick-number">0${index + 1}</span><span class="smart-pick-emoji">${recipe.ingredients.map(([id]) => ingredientById(id)?.emoji).find(Boolean) || "🥗"}</span><span class="smart-pick-name"><strong>${escapeHTML(localized(recipe.name))}</strong><small>${recipe.time} ${escapeHTML(translate("minutes"))} · ${escapeHTML(money(recipeCost(recipe)))}</small></span><span class="smart-pick-arrow">↗</span></button>`).join("");
    const start = mondayOf(new Date());
    const names = currentWeekdayNames("short");
    $("#weekAtGlance").innerHTML = Array.from({ length: 7 }, (_, index) => {
      const date = new Date(start);
      date.setDate(date.getDate() + index);
      const dayKey = isoDate(date);
      const meal = selectedMealForDate(dayKey);
      const recipe = meal && recipeById(meal.recipeId);
      return `<button class="glance-day ${dayKey === todayKey ? "is-today" : ""} ${recipe ? "has-meal" : ""}" data-go="planner" title="${escapeHTML(recipe ? localized(recipe.name) : translate("addMealForDay"))}"><span>${escapeHTML(names[date.getDay()])}</span><i>${recipe ? recipe.ingredients.map(([id]) => ingredientById(id)?.emoji).find(Boolean) || "🍽️" : "·"}</i></button>`;
    }).join("");
    const status = $("#budgetAlert");
    if (budgetData.ratio >= 1) {
      status.className = "budget-alert is-danger";
      $("#budgetAlertText").textContent = translate("budgetExceeded");
    } else if (budgetData.ratio >= 0.8) {
      status.className = "budget-alert is-warning";
      $("#budgetAlertText").textContent = translate("budgetWarning");
    } else {
      status.className = "budget-alert is-safe";
      $("#budgetAlertText").textContent = translate("budgetSafe");
    }
  }

  function localizedMealType(type) {
    const types = {
      breakfast: state.lang === "vi" ? "Bữa sáng" : "Breakfast",
      lunch: state.lang === "vi" ? "Bữa trưa" : "Lunch",
      dinner: state.lang === "vi" ? "Bữa tối" : "Dinner",
      snack: state.lang === "vi" ? "Ăn nhẹ" : "Snack"
    };
    return types[type] || (state.lang === "vi" ? "Bữa ăn" : "Meal");
  }

  function renderRecipeGrid() {
    const input = $("#recipeSearch");
    const query = (input?.value || "").trim().toLocaleLowerCase(state.lang === "vi" ? "vi-VN" : "en-US");
    const safeRecipes = eligibleRecipes();
    let filtered = safeRecipes.filter((recipe) => {
      if (recipeTypeFilter !== "all" && recipe.mealType !== recipeTypeFilter) return false;
      if (!query) return true;
      const recipeText = [recipe.name.vi, recipe.name.en, ...recipe.ingredients.flatMap(([id]) => {
        const ingredient = ingredientById(id);
        return ingredient ? [ingredient.vi, ingredient.en] : [];
      })].join(" ").toLocaleLowerCase(state.lang === "vi" ? "vi-VN" : "en-US");
      return recipeText.includes(query);
    });
    if (recipeSort === "price") filtered.sort((a, b) => recipeCost(a) - recipeCost(b));
    if (recipeSort === "time") filtered.sort((a, b) => a.time - b.time);
    if (recipeSort === "recommended") filtered.sort((a, b) => preferenceScore(b) - preferenceScore(a) || matchScore(b) - matchScore(a) || recipeCost(a) - recipeCost(b));
    const heading = query ? `${translate("searchResultsFor")} “${query}”` : translate("popularRecipes");
    $("#recipeResultTitle").textContent = heading;
    $("#recipeCount").textContent = `${filtered.length} ${translate("recipeCount")}`;
    const grid = $("#recipeGrid");
    if (!filtered.length) {
      grid.innerHTML = `<div class="empty-state"><span>🥣</span><strong>${escapeHTML(translate("noRecipesFound"))}</strong><button class="text-button" data-go="pantry">${escapeHTML(translate("navPantry"))} →</button></div>`;
      return;
    }
    grid.innerHTML = filtered.map((recipe) => {
      const missing = missingIngredients(recipe);
      const isLowCost = recipeCost(recipe) <= 20000;
      const allergy = recipe.allergens.some((tag) => state.preferences.allergies.includes(tag));
      const score = Math.round(matchScore(recipe) * 100);
      const healthTagKey = { protein: "high-protein", balanced: "balanced", light: "light" }[state.preferences.healthGoal];
      const healthLabelKey = { protein: "healthBadgeProtein", balanced: "healthBadgeBalanced", light: "healthBadgeLight" }[state.preferences.healthGoal];
      const healthBadge = healthTagKey && recipeHealthTags(recipe).has(healthTagKey) ? `<span class="health-tag">${escapeHTML(translate(healthLabelKey))}</span>` : "";
      const vegetarianBadge = recipeIsVegetarian(recipe) ? `<span class="diet-tag">🌱 ${escapeHTML(translate("vegetarianBadge"))}</span>` : "";
      const equipmentBadge = `<span class="equipment-tag">${escapeHTML(recipeEquipmentLabel(recipe))}</span>`;
      return `<article class="recipe-card"><button class="recipe-card-click" data-recipe-details="${recipe.id}" aria-label="${escapeHTML(translate("viewRecipe"))}: ${escapeHTML(localized(recipe.name))}"></button>${imageMarkup(recipe)}<div class="recipe-card-content"><div class="recipe-card-tags"><span class="meal-tag">${escapeHTML(localizedMealType(recipe.mealType))}</span>${isLowCost ? `<span class="budget-tag">${state.lang === "vi" ? "Vừa túi tiền" : "Student budget"}</span>` : ""}${healthBadge}${vegetarianBadge}${equipmentBadge}</div><h3>${escapeHTML(localized(recipe.name))}</h3><div class="recipe-card-details"><span>◷ ${recipe.time} ${escapeHTML(translate("minutes"))}</span><strong>${escapeHTML(money(recipeCost(recipe)))}</strong></div><div class="recipe-card-foot"><span class="match-label ${score > 0 ? "has-match" : ""}">${score ? `${score}% ${state.lang === "vi" ? "đã có" : "on hand"}` : `${missing.length} ${state.lang === "vi" ? "nguyên liệu cần mua" : "to buy"}`}</span><button class="recipe-add-button" data-add-recipe="${recipe.id}" title="${escapeHTML(translate("addRecipeToPlan"))}">＋</button></div>${allergy ? `<div class="allergy-inline">⚠ ${escapeHTML(translate("allergyWarning"))}</div>` : ""}</div></article>`;
    }).join("");
  }

  function recipeDetailMarkup(recipe) {
    const portions = Math.max(1, Number(state.preferences.people) || 1);
    const scale = portions / recipe.servings;
    const missing = missingIngredients(recipe);
    const ingredientLines = recipe.ingredients.map(([id, amount, unit]) => {
      const ingredient = ingredientById(id);
      const displayName = ingredient ? localized(ingredient) : id;
      const scaledAmount = amount * scale;
      const amountText = Number.isInteger(scaledAmount) ? scaledAmount : scaledAmount.toFixed(1);
      const missingFlag = !pantryIds().has(id);
      return `<li class="detail-ingredient ${missingFlag ? "is-missing" : ""}"><span class="detail-ingredient-name"><i>${ingredient?.emoji || "•"}</i>${escapeHTML(displayName)}</span><span>${amountText} ${escapeHTML(unit)}${missingFlag ? `<small>${escapeHTML(translate("missing"))}</small>` : ""}</span></li>`;
    }).join("");
    const steps = recipe.steps[state.lang] || recipe.steps.vi;
    const warning = recipe.allergens.filter((allergen) => state.preferences.allergies.includes(allergen));
    return `<div class="recipe-detail"><div class="detail-photo">${imageMarkup(recipe, "detail-image")}</div><div class="detail-header"><div><span class="meal-tag">${escapeHTML(localizedMealType(recipe.mealType))}</span><h2 id="modalTitle">${escapeHTML(localized(recipe.name))}</h2><p>${recipe.time} ${escapeHTML(translate("minutes"))} <span>·</span> ${escapeHTML(translate("serves"))} ${portions} <span>·</span> ${escapeHTML(money(recipeCost(recipe)))}</p></div><span class="detail-emoji">${recipe.ingredients.map(([id]) => ingredientById(id)?.emoji).find(Boolean) || "🥗"}</span></div>${warning.length ? `<div class="allergy-warning-box">⚠ ${escapeHTML(translate("allergyWarning"))}</div>` : ""}<div class="detail-columns"><div><h3>${escapeHTML(translate("ingredientsLabel"))}</h3><ul class="detail-ingredients">${ingredientLines}</ul>${missing.length ? `<div class="missing-summary">${escapeHTML(translate("shoppingNeed"))}: <strong>${missing.length}</strong></div>` : `<div class="missing-summary is-ready">✓ ${escapeHTML(translate("noShoppingNeeded"))}</div>`}</div><div><h3>${escapeHTML(translate("stepsLabel"))}</h3><ol class="detail-steps">${steps.map((step, index) => `<li><span>${String(index + 1).padStart(2, "0")}</span><p>${escapeHTML(step)}</p></li>`).join("")}</ol><p class="recipe-safety-note">${escapeHTML(translate("noAllergenMatch"))}</p></div></div><div class="modal-actions"><button class="button button-outline" data-find-missing="${recipe.id}"><span>⌖</span><span>${escapeHTML(translate("searchMissingOnMaps"))}</span></button><button class="button button-primary" data-add-recipe="${recipe.id}"><span>＋</span><span>${escapeHTML(translate("addRecipeToPlan"))}</span></button></div></div>`;
  }

  function openModal(content, title = "") {
    $("#modalContent").innerHTML = content;
    if (title && !$("#modalTitle", $("#modalContent"))) {
      $("#modalContent").insertAdjacentHTML("afterbegin", `<h2 id="modalTitle" class="visually-hidden">${escapeHTML(title)}</h2>`);
    }
    $("#modalBackdrop").hidden = false;
    document.body.classList.add("modal-open");
  }

  function closeModal() {
    $("#modalBackdrop").hidden = true;
    $("#modalContent").innerHTML = "";
    document.body.classList.remove("modal-open");
  }

  function showRecipe(recipeId) {
    const recipe = recipeById(recipeId);
    if (!recipe) return;
    openModal(recipeDetailMarkup(recipe), translate("recipeModalTitle"));
  }

  function weekDates(offset = weekOffset) {
    const first = mondayOf(new Date());
    first.setDate(first.getDate() + offset * 7);
    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(first);
      date.setDate(first.getDate() + index);
      return date;
    });
  }

  function renderPlanner() {
    const dates = weekDates();
    const weekdayLong = currentWeekdayNames("long");
    const weekdayShort = currentWeekdayNames("short");
    const first = dates[0];
    const last = dates[6];
    $("#weekLabel").textContent = `${formatDate(first, { day:"numeric", month:"short" })} — ${formatDate(last, { day:"numeric", month:"short", year:"numeric" })}`;
    const today = isoDate(new Date());
    $("#weekGrid").innerHTML = dates.map((date) => {
      const key = isoDate(date);
      const weekday = date.getDay();
      const mood = state.availability[weekday] || "busy";
      const entry = selectedMealForDate(key);
      const recipe = entry && recipeById(entry.recipeId);
      const label = weekdayLong[weekday];
      return `<article class="day-card ${key === today ? "is-today" : ""} ${mood === "free" ? "is-free" : "is-busy"}"><div class="day-card-heading"><div><span class="day-name">${escapeHTML(label)}</span><strong>${formatDate(date, { day:"numeric", month:"short" })}</strong></div><button class="day-status" data-toggle-day="${weekday}" title="${escapeHTML(mood === "busy" ? translate("setFree") : translate("setBusy"))}"><i></i>${escapeHTML(mood === "busy" ? translate("busyDay") : translate("freeDay"))}</button></div>${recipe ? `<div class="planned-meal-card"><div class="planned-meal-emoji">${recipe.ingredients.map(([id]) => ingredientById(id)?.emoji).find(Boolean) || "🍽️"}</div><div class="planned-meal-copy"><span>${escapeHTML(localizedMealType(recipe.mealType))}</span><strong>${escapeHTML(localized(recipe.name))}</strong><small>◷ ${recipe.time} ${escapeHTML(translate("minutes"))} · ${escapeHTML(money(recipeCost(recipe)))}</small></div><button class="remove-planned-meal" data-remove-plan="${key}" aria-label="${escapeHTML(translate("removeMeal"))}">×</button><button class="planned-meal-open" data-recipe-details="${recipe.id}" aria-label="${escapeHTML(translate("viewRecipe"))}"></button></div>` : `<div class="day-empty-meal"><span>${mood === "busy" ? "⚡" : "🌿"}</span><p>${escapeHTML(mood === "busy" ? (state.lang === "vi" ? "MATE sẽ ưu tiên món nhanh" : "Quick meals work best") : (state.lang === "vi" ? "Có thời gian thử món mới" : "A good day to prep ahead"))}</p></div>`}<button class="add-day-meal" data-add-day="${key}"><span>＋</span>${escapeHTML(translate("addMealForDay"))}</button></article>`;
    }).join("");
    renderPrepSuggestions();
    renderAvailabilitySettings();
    $("#weekGrid").dataset.weekdayLabels = weekdayShort.join(",");
  }

  function renderPrepSuggestions() {
    const prepRecipes = eligibleRecipes().filter((recipe) => recipe.tags.includes("meal-prep") || recipe.tags.includes("batch-cook"))
      .sort((a, b) => recipeCost(a) - recipeCost(b)).slice(0, 3);
    $("#prepSuggestions").innerHTML = prepRecipes.map((recipe) => `<button class="prep-recipe" data-recipe-details="${recipe.id}"><span class="prep-recipe-emoji">${recipe.ingredients.map(([id]) => ingredientById(id)?.emoji).find(Boolean) || "🥘"}</span><span><strong>${escapeHTML(localized(recipe.name))}</strong><small>${escapeHTML(translate("batchTip"))}</small></span><span class="prep-time">${recipe.time} ${escapeHTML(translate("minutesShort"))}</span></button>`).join("");
  }

  function renderAvailabilitySettings() {
    const names = currentWeekdayNames("long");
    const short = currentWeekdayNames("short");
    const settings = [1,2,3,4,5,6,0];
    $("#availabilitySettings").innerHTML = settings.map((weekday) => {
      const busy = state.availability[weekday] !== "free";
      return `<button class="availability-row ${busy ? "is-busy" : "is-free"}" data-toggle-day="${weekday}"><span class="availability-day">${escapeHTML(names[weekday])}<small>${escapeHTML(short[weekday])}</small></span><span class="availability-choice"><i></i><span>${escapeHTML(busy ? translate("busyDay") : translate("freeDay"))}</span></span><span class="availability-hint">${escapeHTML(busy ? (state.lang === "vi" ? "Món nhanh dưới 20 phút" : "Quick meals under 20 min") : (state.lang === "vi" ? "Nấu trước, nấu nhiều phần" : "Prep ahead, cook extra"))}</span></button>`;
    }).join("");
    $("#schedulePreferenceList").innerHTML = settings.map((weekday) => {
      const busy = state.availability[weekday] !== "free";
      return `<button class="schedule-preference-row ${busy ? "is-busy" : "is-free"}" data-toggle-day="${weekday}"><span>${escapeHTML(names[weekday])}</span><span class="schedule-recommendation">${escapeHTML(busy ? (state.lang === "vi" ? "Gợi ý món nhanh" : "Quick meal ideas") : (state.lang === "vi" ? "Gợi ý chuẩn bị trước" : "Prep-ahead ideas"))}</span><span class="switch ${busy ? "on" : ""}"><i></i></span></button>`;
    }).join("");
  }

  function toggleAvailability(weekday) {
    const current = state.availability[weekday] || "busy";
    state.availability[weekday] = current === "busy" ? "free" : "busy";
    persist();
  }

  function generateWeekPlan() {
    const dates = weekDates();
    const used = [];
    for (const date of dates) {
      const dayKey = isoDate(date);
      const recipe = suggestedRecipe({ busy: state.availability[date.getDay()] === "busy", exclude: used });
      if (!recipe) continue;
      state.plan[dayKey] = { recipeId: recipe.id, mealType: recipe.mealType, generatedAt: new Date().toISOString() };
      used.push(recipe.id);
    }
    persist();
    showToast(translate("generatedPlan"));
  }

  function clearWeekPlan() {
    const removeKeys = new Set(weekDates().map(isoDate));
    for (const key of Object.keys(state.plan)) if (removeKeys.has(key)) delete state.plan[key];
    persist();
    showToast(translate("weekCleared"));
  }

  function showPlanPicker(dateKey) {
    selectedDayForPlan = dateKey || isoDate(new Date());
    const date = parseIsoDate(selectedDayForPlan);
    const current = selectedMealForDate(selectedDayForPlan);
    const currentRecipe = current && recipeById(current.recipeId);
    const available = eligibleRecipes().slice().sort((a,b) => recipeCost(a) - recipeCost(b));
    const content = `<div class="picker-modal"><div class="picker-heading"><span class="picker-heading-icon">▦</span><div><p class="eyebrow">${escapeHTML(translate("pickARecipe"))}</p><h2 id="modalTitle">${escapeHTML(formatDate(date, { weekday:"long", day:"numeric", month:"long" }))}</h2></div></div>${currentRecipe ? `<div class="current-plan-note">${escapeHTML(translate("planned"))}: <strong>${escapeHTML(localized(currentRecipe.name))}</strong> · <button class="text-button" data-remove-plan="${escapeHTML(selectedDayForPlan)}">${escapeHTML(translate("removeMeal"))}</button></div>` : ""}<label class="search-field picker-search"><span class="search-icon">⌕</span><input id="planPickerSearch" type="search" placeholder="${escapeHTML(translate("recipeSearchPlaceholder"))}"></label><div class="plan-picker-list">${available.map((recipe) => `<button class="plan-picker-option" data-plan-choice="${recipe.id}"><span class="picker-food-emoji">${recipe.ingredients.map(([id]) => ingredientById(id)?.emoji).find(Boolean) || "🥗"}</span><span class="plan-picker-copy"><strong>${escapeHTML(localized(recipe.name))}</strong><small>${recipe.time} ${escapeHTML(translate("minutes"))} · ${escapeHTML(localizedMealType(recipe.mealType))}</small></span><span class="picker-price">${escapeHTML(money(recipeCost(recipe)))}</span><span class="picker-add">＋</span></button>`).join("")}</div></div>`;
    openModal(content, translate("pickARecipe"));
  }

  function addRecipeToPlan(recipeId, dateKey = "") {
    const recipe = recipeById(recipeId);
    if (!recipe) return;
    const key = dateKey || selectedDayForPlan || isoDate(new Date());
    state.plan[key] = { recipeId, mealType: recipe.mealType, addedAt: new Date().toISOString() };
    closeModal();
    persist();
    showToast(translate("planAdded"));
  }

  function removePlanForDate(dateKey) {
    delete state.plan[dateKey];
    closeModal();
    persist();
    showToast(translate("planRemoved"));
  }

  function pantryUseSoon(entry) {
    const ingredient = ingredientById(entry.id);
    const remaining = entry.expiry ? (Date.parse(entry.expiry) - Date.now()) / 86400000 : NaN;
    if (Number.isFinite(remaining)) return remaining <= 3;
    return ingredient?.storageGroup === "soon";
  }

  function renderPantry() {
    const query = ($("#pantrySearch")?.value || "").trim().toLocaleLowerCase(state.lang === "vi" ? "vi-VN" : "en-US");
    const list = state.pantry.map((entry) => typeof entry === "string" ? { id: entry, quantity: 1 } : entry);
    const filtered = list.filter((entry) => {
      const ingredient = ingredientById(entry.id);
      if (!ingredient) return false;
      if (pantryCategory !== "all" && ingredient.category !== pantryCategory) return false;
      if (pantryShelfFilter !== "all" && (ingredient.storageGroup || "long") !== pantryShelfFilter) return false;
      if (!query) return true;
      return `${ingredient.vi} ${ingredient.en}`.toLocaleLowerCase(state.lang === "vi" ? "vi-VN" : "en-US").includes(query);
    });
    const expiring = list.filter(pantryUseSoon).length;
    $("#pantryCount").textContent = list.length;
    $("#expiringCount").textContent = expiring;
    $("#possibleRecipes").textContent = eligibleRecipes().filter((recipe) => recipe.ingredients.some(([id]) => pantryIds().has(id))).length;
    if (!filtered.length) {
      $("#pantryList").innerHTML = `<div class="empty-state pantry-empty"><span>🥬</span><strong>${escapeHTML(translate(list.length ? "noRecipesFound" : "emptyPantry"))}</strong><small>${escapeHTML(translate("addSomeIngredients"))}</small><button class="button button-soft" data-open-pantry-picker>＋ ${escapeHTML(translate("addIngredient"))}</button></div>`;
    } else {
      $("#pantryList").innerHTML = filtered.map((entry) => {
        const ingredient = ingredientById(entry.id);
        const soon = pantryUseSoon(entry);
        const shelfLabel = soon ? translate("useSoonFilter") : translate("longKeepFilter");
        const storageText = ingredient.storageText ? localized(ingredient.storageText) : translate("unknownStorage");
        return `<div class="pantry-item"><span class="pantry-item-emoji">${ingredient.emoji}</span><span class="pantry-item-copy"><strong>${escapeHTML(localized(ingredient))}</strong><small>${escapeHTML(money(ingredient.price))} / ${escapeHTML(ingredient.unit)} · ${escapeHTML(storageText)} · ~${Number(ingredient.shelfLifeDays || 5)} ${escapeHTML(translate("shelfDays"))}</small></span><span class="pantry-item-quantity">${Number(entry.quantity || 1)} ×</span><span class="pantry-storage-badge ${soon ? "soon" : "long"}">${soon ? "⌛" : "▤"} ${escapeHTML(shelfLabel)}</span><button class="pantry-remove" data-remove-pantry="${ingredient.id}" aria-label="${escapeHTML(translate("delete"))}">×</button></div>`;
      }).join("");
    }
    renderPantryMatches();
  }

  function renderPantryMatches() {
    const available = eligibleRecipes().map((recipe) => {
      const missing = missingIngredients(recipe);
      const match = matchScore(recipe);
      return { recipe, missing, match };
    }).filter((item) => item.match > 0).sort((a, b) => a.missing.length - b.missing.length || b.match - a.match);
    const matchCount = $("#pantryMatchCount");
    if (matchCount) matchCount.textContent = state.lang === "vi" ? `${available.length} món` : `${available.length} meals`;
    if (!available.length) {
      $("#pantryMatchList").innerHTML = `<div class="pantry-match-empty"><span>✦</span><p>${escapeHTML(translate("pantryMatchHint"))}</p><button class="text-button" data-go="recipes">${escapeHTML(translate("navRecipes"))} →</button></div>`;
      return;
    }
    $("#pantryMatchList").innerHTML = available.map(({ recipe, missing, match }) => `<button class="pantry-match" data-recipe-details="${recipe.id}"><span class="pantry-match-emoji">${recipe.ingredients.map(([id]) => ingredientById(id)?.emoji).find(Boolean) || "🥗"}</span><span class="pantry-match-copy"><strong>${escapeHTML(localized(recipe.name))}</strong><small>${missing.length ? `${escapeHTML(translate("missing"))}: ${missing.map(([id]) => localized(ingredientById(id))).join(", ")}` : escapeHTML(translate("allReady"))}</small></span><span class="match-percent">${Math.round(match * 100)}%</span></button>`).join("");
  }

  function pantryPickerMarkup() {
    return `<div class="ingredient-picker"><div class="picker-heading"><span class="picker-heading-icon">🥬</span><div><p class="eyebrow">${escapeHTML(translate("myIngredients"))}</p><h2 id="modalTitle">${escapeHTML(translate("ingredientPickTitle"))}</h2></div></div><label class="search-field picker-search"><span class="search-icon">⌕</span><input id="ingredientPickerSearch" type="search" placeholder="${escapeHTML(translate("ingredientPickSearch"))}"></label><div class="ingredient-picker-list">${ingredients.map((ingredient) => `<button class="ingredient-picker-row" data-add-pantry="${ingredient.id}"><span>${ingredient.emoji}</span><strong>${escapeHTML(localized(ingredient))}</strong><small>${escapeHTML(money(ingredient.price))} / ${escapeHTML(ingredient.unit)} · ${escapeHTML(translate(ingredient.storageGroup === "soon" ? "useSoonFilter" : "longKeepFilter"))} · ~${Number(ingredient.shelfLifeDays || 5)} ${escapeHTML(translate("shelfDays"))}</small><i>${pantryIds().has(ingredient.id) ? "✓" : "+"}</i></button>`).join("")}</div><p class="price-disclaimer">✦ ${escapeHTML(translate("priceEstimate"))}</p></div>`;
  }

  function addIngredientToPantry(id) {
    if (pantryIds().has(id)) {
      showToast(translate("ingredientAdded"));
      return;
    }
    state.pantry.push({ id, quantity: 1, addedAt: new Date().toISOString() });
    closeModal();
    persist();
    showToast(translate("ingredientAdded"));
  }

  function removeIngredientFromPantry(id) {
    state.pantry = state.pantry.filter((entry) => (typeof entry === "string" ? entry : entry.id) !== id);
    persist();
  }

  function expenseCategoryLabel(category) {
    const labels = { food: "expenseFood", groceries: "expenseGroceries", market: "expenseMarket", other: "expenseOther" };
    return translate(labels[category] || "expenseOther");
  }

  function renderBudget() {
    const { budget, spent, left, ratio, percent } = getBudgetStatus();
    const bar = Math.min(100, percent);
    const tone = ratio >= 1 ? "danger" : ratio >= 0.65 ? "warning" : "safe";
    const budgetCard = $(".budget-main-card");
    budgetCard.dataset.budgetTone = tone;
    document.body.dataset.budgetTone = tone;
    $("#budgetLarge").textContent = money(budget);
    $("#budgetSpentLabel").textContent = money(spent);
    $("#budgetLeftLabel").textContent = money(Math.max(0, left));
    $("#budgetBigBar").style.width = `${bar}%`;
    $("#dailyAverage").textContent = money(Math.max(0, left) / Math.max(1, new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate() - new Date().getDate() + 1));
    const alert = $("#budgetAlert");
    alert.className = `budget-alert ${ratio >= 1 ? "is-danger" : ratio >= 0.8 ? "is-warning" : "is-safe"}`;
    $("#budgetAlertText").textContent = ratio >= 1 ? translate("budgetExceeded") : ratio >= 0.8 ? translate("budgetWarning") : translate("budgetSafe");
    const list = $("#expensePeriod").value === "all" ? [...state.expenses] : [...currentMonthExpenses()];
    list.sort((a, b) => String(b.date).localeCompare(String(a.date)));
    if (!list.length) {
      $("#expenseList").innerHTML = `<div class="empty-state expense-empty"><span>🧾</span><strong>${escapeHTML(translate("noExpenses"))}</strong><button class="button button-soft" data-open-expense>＋ ${escapeHTML(translate("addExpense"))}</button></div>`;
    } else {
      $("#expenseList").innerHTML = list.map((expense) => `<div class="expense-row"><span class="expense-icon ${escapeHTML(expense.category || "other")}">${expense.category === "food" ? "🍜" : expense.category === "groceries" ? "🥬" : expense.category === "market" ? "🛒" : "◉"}</span><span class="expense-copy"><strong>${escapeHTML(expense.note || expenseCategoryLabel(expense.category))}</strong><small>${escapeHTML(expenseCategoryLabel(expense.category))} · ${escapeHTML(formatDate(parseIsoDate(expense.date), { day:"numeric", month:"short" }))}</small></span><strong class="expense-amount">− ${escapeHTML(money(expense.amount))}</strong><button class="expense-delete" data-remove-expense="${escapeHTML(expense.id)}" aria-label="${escapeHTML(translate("delete"))}">×</button></div>`).join("");
    }
    const categories = ["food","groceries","market","other"].map((category) => ({ category, total: currentMonthExpenses().filter((expense) => expense.category === category).reduce((sum, expense) => sum + Number(expense.amount || 0), 0) })).filter((item) => item.total > 0).sort((a,b) => b.total-a.total);
    const categoryTotal = categories.reduce((sum, item) => sum + item.total, 0) || 1;
    $("#spendingCategories").innerHTML = categories.length ? categories.map((item) => `<div class="spend-category"><div class="spend-category-top"><span>${escapeHTML(expenseCategoryLabel(item.category))}</span><strong>${escapeHTML(money(item.total))}</strong></div><div class="spend-category-track"><i class="${escapeHTML(item.category)}" style="width:${Math.round(item.total/categoryTotal*100)}%"></i></div></div>`).join("") : `<div class="spending-empty">${escapeHTML(translate("noDataYet"))}</div>`;
  }

  function expenseFormMarkup() {
    return `<form id="expenseForm" class="simple-form"><div class="picker-heading"><span class="picker-heading-icon">◉</span><div><p class="eyebrow">${escapeHTML(translate("budgetEyebrow"))}</p><h2 id="modalTitle">${escapeHTML(translate("expenseTitle"))}</h2></div></div><label class="field-label">${escapeHTML(translate("expenseAmount"))}<div class="currency-input"><input name="amount" type="number" min="500" step="500" required placeholder="25000" autofocus><span>₫</span></div></label><label class="field-label">${escapeHTML(translate("expenseCategory"))}<select class="form-select" name="category"><option value="food">${escapeHTML(translate("expenseFood"))}</option><option value="groceries">${escapeHTML(translate("expenseGroceries"))}</option><option value="market">${escapeHTML(translate("expenseMarket"))}</option><option value="other">${escapeHTML(translate("expenseOther"))}</option></select></label><label class="field-label">${escapeHTML(translate("expenseDate"))}<input class="form-input" name="date" type="date" value="${isoDate(new Date())}" required></label><label class="field-label">${escapeHTML(translate("expenseNote"))}<input class="form-input" name="note" maxlength="100" placeholder="${state.lang === "vi" ? "Ví dụ: bữa trưa, mua rau..." : "e.g. lunch, groceries..."}"></label><div class="modal-actions"><button type="button" class="button button-outline" data-close-modal>${escapeHTML(translate("cancel"))}</button><button class="button button-primary" type="submit">${escapeHTML(translate("saveExpense"))} →</button></div></form>`;
  }

  function budgetFormMarkup() {
    return `<form id="budgetForm" class="simple-form"><div class="picker-heading"><span class="picker-heading-icon">◉</span><div><p class="eyebrow">${escapeHTML(translate("budgetEyebrow"))}</p><h2 id="modalTitle">${escapeHTML(translate("editBudget"))}</h2></div></div><label class="field-label">${escapeHTML(translate("monthlyFoodBudget"))}<div class="currency-input"><input name="budget" type="number" min="0" step="50000" value="${Number(state.preferences.monthlyBudget || 0)}" required><span>₫</span></div></label><div class="modal-actions"><button type="button" class="button button-outline" data-close-modal>${escapeHTML(translate("cancel"))}</button><button class="button button-primary" type="submit">${escapeHTML(translate("saveChanges"))} →</button></div></form>`;
  }

  function saveExpense(form) {
    const fields = new FormData(form);
    const amount = Number(fields.get("amount"));
    if (!Number.isFinite(amount) || amount <= 0) return showToast(translate("errorGeneric"), "error");
    state.expenses.push({ id: crypto.randomUUID(), amount, category: String(fields.get("category")), date: String(fields.get("date")), note: String(fields.get("note") || "").trim(), createdAt: new Date().toISOString() });
    closeModal();
    persist();
    showToast(translate("expenseSaved"));
  }

  function removeExpense(id) {
    state.expenses = state.expenses.filter((expense) => expense.id !== id);
    persist();
  }

  function mapsSearchUrl(query) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
  }

  function parseNearbyCoordinates(value) {
    const match = String(value || "").match(/^\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*$/);
    if (!match) return null;
    const lat = Number(match[1]);
    const lng = Number(match[2]);
    return Number.isFinite(lat) && Number.isFinite(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180 ? { lat, lng } : null;
  }

  function nearbySearchContext() {
    const typedArea = $("#nearbySearch").value.trim();
    const typedCoordinates = parseNearbyCoordinates(typedArea);
    if (typedCoordinates) return { label: typedArea, query: typedArea, coordinates: typedCoordinates, hasLocation: true };
    if (typedArea) return { label: typedArea, query: typedArea, coordinates: null, hasLocation: true };
    if (nearbyCoordinates) return {
      label: translate("currentLocation"),
      query: `${nearbyCoordinates.lat.toFixed(5)}, ${nearbyCoordinates.lng.toFixed(5)}`,
      coordinates: nearbyCoordinates,
      hasLocation: true
    };
    const nearbyLabel = state.lang === "vi" ? "gần tôi" : "near me";
    return { label: nearbyLabel, query: nearbyLabel, coordinates: null, hasLocation: false };
  }

  function areaForSearch() {
    return nearbySearchContext().query;
  }

  function placeSearchTerm(place = places[activePlace] || places.grocery) {
    if (state.lang === "en") return place.query;
    const vietnameseTerms = {
      grocery: "cửa hàng thực phẩm",
      market: "chợ",
      supermarket: "siêu thị",
      restaurant: "quán ăn",
      cheapfood: "quán ăn giá rẻ"
    };
    return vietnameseTerms[activePlace] || place.query;
  }

  async function refreshLivePlaces() {
    const list = $("#livePlacesList");
    const status = $("#livePlacesStatus");
    const requestId = ++livePlacesRequestId;
    const context = nearbySearchContext();
    if (!context.hasLocation) {
      status.textContent = translate("livePlacesPrompt");
      list.innerHTML = "";
      return;
    }

    status.textContent = translate("livePlacesLoading");
    list.innerHTML = "";
    const place = places[activePlace] || places.grocery;
    const coordinates = context.coordinates;
    const query = [placeSearchTerm(place), nearbyIngredientQuery, coordinates ? "" : context.query].filter(Boolean).join(" ");
    const parameters = new URLSearchParams({ q: query, lang: state.lang });
    if (coordinates) {
      parameters.set("lat", String(coordinates.lat));
      parameters.set("lng", String(coordinates.lng));
    }

    try {
      const result = await api(`/api/places/search?${parameters.toString()}`);
      if (requestId !== livePlacesRequestId) return;
      if (!result.enabled) {
        status.textContent = "";
        list.innerHTML = `<p class="live-place-empty">${escapeHTML(translate("livePlacesDisabled"))}</p>`;
        return;
      }
      const foundPlaces = Array.isArray(result.places) ? result.places : [];
      if (!foundPlaces.length) {
        status.textContent = "";
        list.innerHTML = `<p class="live-place-empty">${escapeHTML(translate("livePlacesEmpty"))}</p>`;
        $("#nearbyResultCount").textContent = "Google Maps ↗";
        return;
      }
      status.textContent = translate("placesAttribution");
      $("#nearbyResultCount").textContent = `${foundPlaces.length} · Google Maps ↗`;
      const icon = activePlace === "restaurant" || activePlace === "cheapfood" ? "🍜" : activePlace === "market" ? "🥬" : "🛒";
      list.innerHTML = foundPlaces.map((item) => `<a class="live-place-card" href="${escapeHTML(item.mapsUrl)}" target="_blank" rel="noopener noreferrer"><span class="live-place-icon">${icon}</span><span class="live-place-copy"><strong>${escapeHTML(item.name)}</strong><small>${escapeHTML(item.address || translate("placesAttribution"))}</small></span><span class="live-place-open" aria-hidden="true">↗</span></a>`).join("");
    } catch {
      if (requestId !== livePlacesRequestId) return;
      status.textContent = "";
      list.innerHTML = `<p class="live-place-empty">${escapeHTML(translate("livePlacesError"))}</p>`;
    }
  }

  function refreshEmbeddedMap() {
    const map = $("#googleMapFrame");
    const panel = $("#mapPanel");
    if (!map || !panel || !googleMapsEmbedKey) {
      panel?.classList.remove("has-live-map");
      map?.removeAttribute("src");
      return;
    }
    const query = [placeSearchTerm(), nearbyIngredientQuery, areaForSearch()].filter(Boolean).join(" ");
    const parameters = new URLSearchParams({ key: googleMapsEmbedKey, q: query, zoom: "14" });
    map.src = `https://www.google.com/maps/embed/v1/search?${parameters.toString()}`;
    panel.classList.add("has-live-map");
  }

  async function loadPublicConfig() {
    try {
      const result = await api("/api/config");
      googleMapsEmbedKey = typeof result.mapsEmbedKey === "string" ? result.mapsEmbedKey : "";
      renderNearby();
    } catch {
      googleMapsEmbedKey = "";
    }
  }

  function selectedPlaceLabel() {
    const place = places[activePlace] || places.grocery;
    return localized(place);
  }

  function renderNearby() {
    const place = places[activePlace] || places.grocery;
    const context = nearbySearchContext();
    const area = context.label;
    const fullQuery = [placeSearchTerm(place), nearbyIngredientQuery, context.query].filter(Boolean).join(" ");
    const displayQuery = [placeSearchTerm(place), nearbyIngredientQuery, context.label].filter(Boolean).join(" ");
    $("#nearbyResultTitle").textContent = localized(place);
    $("#nearbyResultCount").textContent = state.lang === "vi" ? "Google Maps ↗" : "Google Maps ↗";
    $("#openGoogleMaps").href = mapsSearchUrl(fullQuery);
    refreshEmbeddedMap();
    const suggestedSearches = activePlace === "restaurant" || activePlace === "cheapfood"
      ? (state.lang === "vi" ? ["quán cơm sinh viên", "quán ăn bình dân", "cơm trưa gần tôi"] : ["student lunch restaurant", "affordable restaurant", "cheap lunch near me"])
      : (state.lang === "vi" ? ["cửa hàng rau củ", "siêu thị mini", "chợ truyền thống"] : ["fresh produce shop", "convenience supermarket", "local market"]);
    const shoppingNeeds = [...new Set(Object.keys(state.plan).slice(0, 7).flatMap((dateKey) => {
      const recipe = recipeById(state.plan[dateKey]?.recipeId);
      return recipe ? missingIngredients(recipe).map(([id]) => id) : [];
    }))].slice(0, 5);
    const mainResult = `<a class="nearby-place-card map-place-main" href="${escapeHTML(mapsSearchUrl(fullQuery))}" target="_blank" rel="noopener"><span class="nearby-place-icon">${activePlace === "restaurant" || activePlace === "cheapfood" ? "🍜" : activePlace === "market" ? "🥬" : "🛒"}</span><span class="nearby-place-copy"><strong>${escapeHTML(translate("mapSearchResults"))}: ${escapeHTML(localized(place))}</strong><small>${escapeHTML(displayQuery)}</small><em>${escapeHTML(translate("mapQueryHint"))}</em></span><span class="nearby-place-arrow">↗</span></a>`;
    const suggestions = suggestedSearches.map((term) => {
      const query = `${term} ${area}`;
      return `<a class="nearby-place-card" href="${escapeHTML(mapsSearchUrl(query))}" target="_blank" rel="noopener"><span class="nearby-place-icon">⌖</span><span class="nearby-place-copy"><strong>${escapeHTML(term)}</strong><small>${escapeHTML(area)}</small><em>${escapeHTML(translate("mapQueryHint"))}</em></span><span class="nearby-place-arrow">↗</span></a>`;
    }).join("");
    const priceCards = shoppingNeeds.length ? `<div class="nearby-price-heading"><span class="eyebrow">${escapeHTML(state.lang === "vi" ? "MÓN CẦN MUA THEO THỰC ĐƠN" : "SHOPPING NEEDS FROM YOUR PLAN")}</span></div>${shoppingNeeds.map((id) => {
      const ingredient = ingredientById(id);
      if (!ingredient) return "";
      const query = `${localized(ingredient)} ${placeSearchTerm(place)} ${context.query}`;
      return `<a class="ingredient-price-card" href="${escapeHTML(mapsSearchUrl(query))}" target="_blank" rel="noopener"><span>${ingredient.emoji}</span><span><strong>${escapeHTML(localized(ingredient))}</strong><small>${escapeHTML(translate("indicativePrice"))}</small></span><b>${escapeHTML(money(ingredient.price))}<small>/${escapeHTML(ingredient.unit)}</small></b><i>↗</i></a>`;
    }).join("")}` : "";
    $("#nearbyPlaceList").innerHTML = `${mainResult}${suggestions}${priceCards}`;
    const focus = $("#nearbySearchFocus");
    if (focus) {
      focus.hidden = !nearbyIngredientQuery;
      focus.innerHTML = nearbyIngredientQuery
        ? `<span>${escapeHTML(translate("searchingForIngredients"))}: <strong>${escapeHTML(nearbyIngredientQuery)}</strong></span><button type="button" data-clear-nearby-search aria-label="${escapeHTML(translate("clearSearch"))}">×</button>`
        : "";
    }
  }

  function searchNearby() {
    renderNearby();
    refreshLivePlaces();
  }

  function requestLocation() {
    const status = $("#livePlacesStatus");
    if (!navigator.geolocation) {
      showToast(translate("locationFailed"), "error");
      return;
    }
    status.textContent = translate("livePlacesLocating");
    navigator.geolocation.getCurrentPosition((position) => {
      nearbyCoordinates = { lat: position.coords.latitude, lng: position.coords.longitude };
      $("#nearbySearch").value = "";
      renderNearby();
      refreshLivePlaces();
      showToast(translate("locationReady"));
    }, () => {
      status.textContent = translate("livePlacesPrompt");
      showToast(translate("locationFailed"), "error");
    }, { enableHighAccuracy: false, timeout: 9000, maximumAge: 300000 });
  }

  function renderBlindbox() {
    const history = [...state.drawHistory].slice(-6).reverse();
    $("#drawHistory").innerHTML = history.length ? history.map((item) => {
      const ingredient = ingredientById(item.id);
      if (!ingredient) return "";
      return `<button class="draw-history-card" data-redraw="${ingredient.id}"><span>${ingredient.emoji}</span><strong>${escapeHTML(localized(ingredient))}</strong><small>${escapeHTML(formatDate(new Date(item.at), { day:"numeric", month:"short" }))}</small></button>`;
    }).join("") : `<div class="draw-history-empty">${escapeHTML(translate("noDataYet"))}</div>`;
  }

  function drawIngredient(forcedId = "") {
    const pantry = pantryIds();
    const onlyPantry = $("#usePantryOnly").checked;
    let pool = onlyPantry ? ingredients.filter((item) => pantry.has(item.id)) : ingredients;
    if (forcedId) pool = pool.filter((item) => item.id === forcedId);
    if (!pool.length) {
      showToast(state.lang === "vi" ? "Tủ nguyên liệu đang trống, hãy thêm vài món trước nhé." : "Your pantry is empty. Add a few ingredients first.", "error");
      goToPage("pantry");
      return;
    }
    const picked = pool[Math.floor(Math.random() * pool.length)];
    state.drawHistory.push({ id: picked.id, at: new Date().toISOString() });
    state.drawHistory = state.drawHistory.slice(-30);
    $("#flashcard").classList.add("is-drawing");
    $("#flashcardFood").textContent = picked.emoji;
    $("#flashcardName").textContent = localized(picked);
    $("#flashcardPrompt").textContent = state.lang === "vi" ? `Thử nghĩ xem bạn có thể nấu món gì với ${localized(picked)}?` : `What could you make with ${localized(picked)}?`;
    setTimeout(() => $("#flashcard").classList.remove("is-drawing"), 650);
    const ideas = eligibleRecipes().filter((recipe) => recipe.ingredients.some(([id]) => id === picked.id)).slice(0, 4);
    $("#blindboxResult").innerHTML = ideas.length ? `<div class="blindbox-result-heading"><div><span class="eyebrow">${escapeHTML(translate("recipeIdeas"))}</span><h3>${picked.emoji} ${escapeHTML(localized(picked))}</h3></div><button class="text-button" id="drawAgainButton">${escapeHTML(translate("drawAgain"))} ↻</button></div><div class="blindbox-recipe-grid">${ideas.map((recipe) => `<button class="blindbox-recipe" data-recipe-details="${recipe.id}"><span class="blindbox-recipe-emoji">${recipe.ingredients.map(([id]) => ingredientById(id)?.emoji).find(Boolean) || "🥗"}</span><strong>${escapeHTML(localized(recipe.name))}</strong><small>${recipe.time} ${escapeHTML(translate("minutes"))} · ${escapeHTML(money(recipeCost(recipe)))}</small><i>↗</i></button>`).join("")}</div>` : `<div class="blindbox-result-placeholder"><span>✦</span><p>${escapeHTML(translate("noRecipeForIngredient"))}</p><button class="button button-soft" id="drawAgainButton">${escapeHTML(translate("drawAgain"))} ↻</button></div>`;
    renderBlindbox();
    persist();
  }

  function updateAccountPanel() {
    const status = $("#accountStatusCard");
    const actions = $("#accountActions");
    if (!state.user) {
      status.innerHTML = `<span class="account-status-avatar">☺</span><div><strong>${escapeHTML(translate("accountGuest"))}</strong><p>${escapeHTML(translate("accountSignIn"))}</p></div>`;
      actions.innerHTML = `<button class="button button-primary" data-open-auth="login">${escapeHTML(translate("signIn"))}</button><button class="button button-outline" data-open-auth="register">${escapeHTML(translate("createAccount"))}</button>`;
    } else {
      status.innerHTML = `<span class="account-status-avatar">${escapeHTML(state.user.name.charAt(0).toUpperCase())}</span><div><strong>${escapeHTML(state.user.name)}</strong><p>${escapeHTML(translate("signedInAs"))} ${escapeHTML(state.user.email)}</p></div><span class="account-online">● ${escapeHTML(state.lang === "vi" ? "Đã đồng bộ" : "Synced")}</span>`;
      actions.innerHTML = `<button class="button button-outline" id="signOutButton">${escapeHTML(translate("signOut"))}</button><button class="text-button danger-text" id="deleteAccountButton">${escapeHTML(translate("deleteAccount"))}</button>`;
    }
  }

  function renderSettings() {
    $("#monthlyBudgetInput").value = Number(state.preferences.monthlyBudget || 0);
    $("#householdSize").value = String(state.preferences.people || 1);
    $("#cookingSetup").value = state.preferences.cookingSetup || "full";
    $("#healthGoal").value = state.preferences.healthGoal || "balanced";
    [["#tasteChoices", state.preferences.tastes], ["#preferredMealTypes", state.preferences.preferredMealTypes], ["#allergyChoices", state.preferences.allergies]].forEach(([selector, selectedValues]) => {
      $$(`${selector} .choice-chip`).forEach((button) => {
        const selected = selectedValues.includes(button.dataset.value);
        button.classList.toggle("selected", selected);
        button.setAttribute("aria-pressed", String(selected));
      });
    });
    $("#fontSizeRange").value = String(state.appearance.fontScale || 100);
    renderCustomPreferenceChips();
    $("#customThemeColor").value = /^#[0-9a-f]{6}$/i.test(state.appearance.customColor || "") ? state.appearance.customColor : "#256e4a";
    $$(".theme-swatch").forEach((button) => button.classList.toggle("selected", button.dataset.theme === (state.appearance.theme || "sage")));
    applyAppearance();
    renderAvailabilitySettings();
    updateAccountPanel();
  }

  function refreshPreferenceDrivenViews() {
    renderOverview();
    renderPlanner();
    renderRecipeGrid();
    renderPantry();
    $("#preferenceSaveFeedback").textContent = translate("preferencesAutoSaved");
  }

  function updatePreferenceField(key, value) {
    state.preferences[key] = value;
    persist(true, false);
    refreshPreferenceDrivenViews();
  }

  function renderCustomPreferenceChips() {
    const favoriteItems = Array.isArray(state.preferences.favoriteIngredients) ? state.preferences.favoriteIngredients : [];
    const favoriteDishes = Array.isArray(state.preferences.favoriteDishes) ? state.preferences.favoriteDishes : [];
    const avoidItems = Array.isArray(state.preferences.customAvoidIngredients) ? state.preferences.customAvoidIngredients : [];
    const render = (items, kind) => items.map((item, index) => `<button type="button" class="ingredient-preference-chip ${kind === "avoid" ? "is-avoid" : ""}" data-remove-preference="${kind}" data-index="${index}" aria-label="${escapeHTML(translate("removePreferenceItem"))} ${escapeHTML(item)}"><span>${escapeHTML(item)}</span><i aria-hidden="true">×</i></button>`).join("");
    $("#favoriteIngredientChips").innerHTML = render(favoriteItems, "favorite");
    $("#favoriteDishChips").innerHTML = render(favoriteDishes, "dish");
    $("#customAvoidIngredientChips").innerHTML = render(avoidItems, "avoid");
  }

  function addCustomPreference(kind) {
    const fields = {
      avoid: ["#customAvoidIngredientInput", "customAvoidIngredients"],
      dish: ["#favoriteDishInput", "favoriteDishes"],
      favorite: ["#favoriteIngredientInput", "favoriteIngredients"]
    };
    const [selector, preferenceKey] = fields[kind] || fields.favorite;
    const input = $(selector);
    const value = input.value.trim().slice(0, 50);
    if (value.length < 2) return;
    const items = Array.isArray(state.preferences[preferenceKey]) ? state.preferences[preferenceKey] : [];
    if (items.some((item) => normalizeIngredientText(item) === normalizeIngredientText(value))) {
      input.value = "";
      return;
    }
    items.push(value);
    state.preferences[preferenceKey] = items.slice(-30);
    input.value = "";
    renderCustomPreferenceChips();
    renderRecipeGrid();
    persist();
  }

  function removeCustomPreference(kind, index) {
    const key = { avoid: "customAvoidIngredients", dish: "favoriteDishes", favorite: "favoriteIngredients" }[kind] || "favoriteIngredients";
    const items = Array.isArray(state.preferences[key]) ? state.preferences[key] : [];
    items.splice(index, 1);
    state.preferences[key] = items;
    renderCustomPreferenceChips();
    renderRecipeGrid();
    persist();
  }

  function mixHexColors(first, second, secondWeight) {
    const toRgb = (hex) => [1, 3, 5].map((index) => parseInt(hex.slice(index, index + 2), 16));
    const a = toRgb(first);
    const b = toRgb(second);
    return `#${a.map((value, index) => Math.round(value * (1 - secondWeight) + b[index] * secondWeight).toString(16).padStart(2, "0")).join("")}`;
  }

  function applyAppearance() {
    const body = document.body;
    const scalePercent = Math.max(85, Math.min(150, Number(state.appearance.fontScale) || 100));
    const fontScale = scalePercent / 100;
    const customColor = /^#[0-9a-f]{6}$/i.test(state.appearance.customColor || "") ? state.appearance.customColor : "";
    body.dataset.fontSize = "normal";
    body.style.setProperty("--mate-font-scale", String(fontScale));
    for (let size = 5; size <= 80; size += 1) {
      body.style.setProperty(`--mate-font-size-${size}`, `${(size * fontScale).toFixed(2)}px`);
    }
    if ($("#fontSizeRange")) $("#fontSizeRange").value = String(Math.round(scalePercent / 5) * 5);
    if ($("#fontScaleValue")) $("#fontScaleValue").textContent = `${Math.round(scalePercent)}%`;
    body.dataset.theme = customColor ? "custom" : (state.appearance.theme || "sage");
    ["--green", "--green-deep", "--green-dark", "--green-bright", "--mint", "--mint-deep", "--custom-contrast"].forEach((name) => body.style.removeProperty(name));
    if (customColor) {
      const luminance = (Number.parseInt(customColor.slice(1, 3), 16) * 299
        + Number.parseInt(customColor.slice(3, 5), 16) * 587
        + Number.parseInt(customColor.slice(5, 7), 16) * 114) / 1000;
      body.style.setProperty("--green", customColor);
      body.style.setProperty("--green-deep", mixHexColors("#173e2c", customColor, .28));
      body.style.setProperty("--green-dark", mixHexColors("#123328", customColor, .2));
      body.style.setProperty("--green-bright", mixHexColors(customColor, "#ffffff", .27));
      body.style.setProperty("--mint", mixHexColors(customColor, "#ffffff", .91));
      body.style.setProperty("--mint-deep", mixHexColors(customColor, "#ffffff", .82));
      body.style.setProperty("--custom-contrast", luminance > 165 ? "#26372d" : "#ffffff");
    }
    $$(".theme-swatch").forEach((button) => button.classList.toggle("selected", !customColor && button.dataset.theme === body.dataset.theme));
    $(".custom-color-control")?.classList.toggle("selected", Boolean(customColor));
  }

  function savePreferences() {
    const budget = Number($("#monthlyBudgetInput").value);
    state.preferences.monthlyBudget = Number.isFinite(budget) && budget >= 0 ? budget : 0;
    state.preferences.budgetConfigured = true;
    state.preferences.people = Number($("#householdSize").value) || 1;
    state.preferences.healthGoal = $("#healthGoal").value || "balanced";
    state.preferences.cookingSetup = $("#cookingSetup").value;
    state.preferences.tastes = $$("#tasteChoices .choice-chip.selected").map((button) => button.dataset.value);
    state.preferences.preferredMealTypes = $$("#preferredMealTypes .choice-chip.selected").map((button) => button.dataset.value);
    state.preferences.allergies = $$("#allergyChoices .choice-chip.selected").map((button) => button.dataset.value);
    state.preferences.favoriteIngredients = Array.isArray(state.preferences.favoriteIngredients) ? state.preferences.favoriteIngredients : [];
    state.preferences.favoriteDishes = Array.isArray(state.preferences.favoriteDishes) ? state.preferences.favoriteDishes : [];
    state.preferences.customAvoidIngredients = Array.isArray(state.preferences.customAvoidIngredients) ? state.preferences.customAvoidIngredients : [];
    persist();
    $("#preferenceSaveFeedback").textContent = translate("preferencesSaved");
    showToast(translate("preferencesSaved"));
  }

  function showAuth(mode = "login") {
    authMode = mode;
    const register = authMode === "register";
    const content = `<div class="auth-form-wrap"><p class="eyebrow">${escapeHTML(state.lang === "vi" ? "ĂN NGON, SỐNG KHÔN" : "EAT WELL, LIVE SMART")}</p><h2 id="authTitle">${escapeHTML(translate(register ? "authCreateTitle" : "authLoginTitle"))}</h2><p class="auth-subtitle">${escapeHTML(state.lang === "vi" ? "Lưu thực đơn và chi tiêu của bạn trên MATE." : "Save your meal plans and spending with MATE.")}</p><form id="authForm"><div class="auth-fields">${register ? `<label class="field-label">${escapeHTML(translate("authName"))}<input class="form-input" name="name" autocomplete="name" minlength="2" maxlength="80" required></label>` : ""}<label class="field-label">${escapeHTML(translate("authEmail"))}<input class="form-input" type="email" name="email" autocomplete="email" required></label><label class="field-label">${escapeHTML(translate("authPassword"))}<input class="form-input" type="password" name="password" autocomplete="${register ? "new-password" : "current-password"}" minlength="8" required><small>${escapeHTML(translate("authPasswordHint"))}</small></label>${register ? `<label class="consent-check"><input type="checkbox" name="dataConsent" required><span>${escapeHTML(translate("authConsent"))}</span></label>` : ""}<div class="auth-error" id="authError" role="alert"></div><button class="button button-primary auth-submit" type="submit"><span>${escapeHTML(translate("authContinue"))}</span><span>→</span></button></div></form><p class="auth-switch">${escapeHTML(translate(register ? "authHaveAccount" : "authNeedAccount"))} <button type="button" class="text-button" id="authModeSwitch">${escapeHTML(translate(register ? "signIn" : "createAccount"))}</button></p></div>`;
    $("#authContent").innerHTML = content;
    $("#authBackdrop").hidden = false;
    document.body.classList.add("modal-open");
    setTimeout(() => $("#authContent input")?.focus(), 40);
  }

  function closeAuth() {
    $("#authBackdrop").hidden = true;
    $("#authContent").innerHTML = "";
    document.body.classList.remove("modal-open");
  }

  async function submitAuth(form) {
    const fields = new FormData(form);
    const register = authMode === "register";
    const button = $(".auth-submit", form);
    const error = $("#authError");
    error.textContent = "";
    button.disabled = true;
    $(".auth-submit span:first-child", form).textContent = translate(register ? "authCreating" : "authLoggingIn");
    const body = {
      name: String(fields.get("name") || "").trim(),
      email: String(fields.get("email") || "").trim(),
      password: String(fields.get("password") || ""),
      dataConsent: register ? fields.get("dataConsent") === "on" : true,
      profile: profilePayload()
    };
    try {
      const result = await api(register ? "/api/auth/register" : "/api/auth/login", { method: "POST", body: JSON.stringify(body) });
      state.user = result.user;
      state.token = result.token;
      const remote = result.user.profile || {};
      const hasRemoteData = ["preferences","pantry","plan","expenses","drawHistory","appearance"].some((key) => remote[key] !== undefined);
      if (!register && hasRemoteData) applyRemoteProfile(remote);
      closeAuth();
      persist(false);
      if (register || !hasRemoteData) await syncProfile();
      showToast(translate(register ? "authCreated" : "authSuccess"));
    } catch (authError) {
      const message = authError instanceof TypeError ? translate("authServerUnavailable") : authError.message;
      error.textContent = message || translate("authError");
    } finally {
      if (button.isConnected) {
        button.disabled = false;
        $(".auth-submit span:first-child", form).textContent = translate("authContinue");
      }
    }
  }

  function resetPersonalState() {
    const language = state.lang;
    Object.assign(state, clone(DEFAULT_STATE), { lang: language });
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* private browsing may block storage */ }
  }

  async function signOut() {
    try { await api("/api/auth/logout", { method: "POST", body: "{}" }); } catch { /* local sign-out still works when offline */ }
    resetPersonalState();
    persist(false);
    showToast(state.lang === "vi" ? "Bạn đã đăng xuất." : "You've signed out.");
  }

  function deleteAccountMarkup() {
    return `<form id="deleteAccountForm" class="simple-form"><div class="picker-heading"><span class="picker-heading-icon danger-icon">!</span><div><p class="eyebrow">${escapeHTML(translate("accountTab"))}</p><h2 id="modalTitle">${escapeHTML(translate("deleteAccount"))}</h2></div></div><p class="delete-warning">${escapeHTML(translate("deleteAccountConfirm"))}</p><label class="field-label">${escapeHTML(translate("authPassword"))}<input class="form-input" type="password" name="password" autocomplete="current-password" required></label><div class="auth-error" id="deleteAccountError" role="alert"></div><div class="modal-actions"><button type="button" class="button button-outline" data-close-modal>${escapeHTML(translate("cancel"))}</button><button class="button button-danger" type="submit">${escapeHTML(translate("deleteAccount"))}</button></div></form>`;
  }

  async function confirmDeleteAccount(form) {
    const error = $("#deleteAccountError");
    const password = new FormData(form).get("password");
    try {
      await api("/api/account", { method: "DELETE", body: JSON.stringify({ password }) });
      resetPersonalState();
      closeModal();
      persist(false);
      showToast(translate("accountDeleted"));
    } catch (deleteError) {
      error.textContent = deleteError.message;
    }
  }

  function renderAll() {
    updateHeader();
    renderOverview();
    renderPlanner();
    renderRecipeGrid();
    renderPantry();
    renderBudget();
    renderNearby();
    renderBlindbox();
    renderSettings();
    if (state.appearance.mascot && Number.isFinite(state.appearance.mascot.x) && Number.isFinite(state.appearance.mascot.y)) {
      const mascot = $("#floatingMascot");
      mascot.style.left = `${Math.max(8, Math.min(window.innerWidth - mascot.offsetWidth - 8, state.appearance.mascot.x))}px`;
      mascot.style.top = `${Math.max(8, Math.min(window.innerHeight - mascot.offsetHeight - 8, state.appearance.mascot.y))}px`;
      mascot.style.right = "auto";
      mascot.style.bottom = "auto";
    }
  }

  function renderPage(page) {
    if (page === "overview") renderOverview();
    if (page === "planner") renderPlanner();
    if (page === "recipes") renderRecipeGrid();
    if (page === "pantry") renderPantry();
    if (page === "budget") renderBudget();
    if (page === "nearby") renderNearby();
    if (page === "blindbox") renderBlindbox();
    if (page === "settings") renderSettings();
  }

  function switchSettingsTab(name) {
    $$(".settings-tab").forEach((button) => button.classList.toggle("active", button.dataset.settingsTab === name));
    $$(".settings-panel").forEach((panel) => panel.classList.toggle("active", panel.id === `settings-${name}`));
  }

  function toggleChoice(button) {
    const selected = button.classList.toggle("selected");
    button.setAttribute("aria-pressed", String(selected));
  }

  function selectPlace(place) {
    if (!places[place]) return;
    activePlace = place;
    $$(".nearby-filter").forEach((button) => button.classList.toggle("active", button.dataset.place === place));
    renderNearby();
    refreshLivePlaces();
  }

  function toggleMascotMenu() {
    const menu = $("#mascotQuickMenu");
    const opening = !menu.classList.contains("open");
    menu.classList.toggle("open", opening);
    $("#floatingMascot").classList.toggle("is-open", opening);
    $("#floatingMascot").setAttribute("aria-expanded", String(opening));
    menu.setAttribute("aria-hidden", String(!opening));
    if (opening) requestAnimationFrame(positionMascotMenu);
  }

  function closeMascotMenu() {
    const menu = $("#mascotQuickMenu");
    const mascot = $("#floatingMascot");
    if (!menu || !mascot) return;
    menu.classList.remove("open");
    menu.setAttribute("aria-hidden", "true");
    mascot.classList.remove("is-open");
    mascot.setAttribute("aria-expanded", "false");
  }

  function positionMascotMenu() {
    const menu = $("#mascotQuickMenu");
    const mascot = $("#floatingMascot");
    if (!menu.classList.contains("open")) return;
    const rect = mascot.getBoundingClientRect();
    const width = menu.offsetWidth;
    const height = menu.offsetHeight;
    const gap = 11;
    const edge = 12;
    const rightSpace = window.innerWidth - rect.right;
    let left;
    if (rightSpace >= width + gap + edge) left = rect.right + gap;
    else if (rect.left >= width + gap + edge) left = rect.left - width - gap;
    else left = Math.max(edge, Math.min(window.innerWidth - width - edge, rect.left + (rect.width - width) / 2));
    const top = Math.max(edge, Math.min(window.innerHeight - height - edge, rect.top + (rect.height - height) / 2));
    menu.style.left = `${left}px`;
    menu.style.top = `${top}px`;
  }

  function attachMascotDrag() {
    const mascot = $("#floatingMascot");
    mascot.addEventListener("pointerdown", (event) => {
      if (event.button !== 0) return;
      const rect = mascot.getBoundingClientRect();
      dragState = { pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, left: rect.left, top: rect.top, moved: false };
      mascot.setPointerCapture(event.pointerId);
    });
    mascot.addEventListener("pointermove", (event) => {
      if (!dragState || dragState.pointerId !== event.pointerId) return;
      const dx = event.clientX - dragState.startX;
      const dy = event.clientY - dragState.startY;
      if (Math.abs(dx) + Math.abs(dy) > 7) dragState.moved = true;
      if (!dragState.moved) return;
      closeMascotMenu();
      mascot.style.left = `${Math.max(8, Math.min(window.innerWidth - mascot.offsetWidth - 8, dragState.left + dx))}px`;
      mascot.style.top = `${Math.max(8, Math.min(window.innerHeight - mascot.offsetHeight - 8, dragState.top + dy))}px`;
      mascot.style.right = "auto";
      mascot.style.bottom = "auto";
      event.preventDefault();
    });
    mascot.addEventListener("pointerup", (event) => {
      if (!dragState || dragState.pointerId !== event.pointerId) return;
      if (dragState.moved) {
        const rect = mascot.getBoundingClientRect();
        state.appearance.mascot = { x: rect.left, y: rect.top };
        persist();
        mascot.dataset.dragged = "true";
        setTimeout(() => delete mascot.dataset.dragged, 140);
      }
      dragState = null;
    });
    mascot.addEventListener("pointercancel", () => { dragState = null; });
    mascot.addEventListener("click", (event) => {
      if (mascot.dataset.dragged === "true") {
        event.preventDefault();
        return;
      }
      toggleMascotMenu();
    });
  }

  function attachEvents() {
    document.addEventListener("click", (event) => {
      if (!event.target.closest("#mascotQuickMenu, #floatingMascot")) closeMascotMenu();
      const goButton = event.target.closest("[data-go]");
      if (goButton) { goToPage(goButton.dataset.go); return; }
      const pageButton = event.target.closest("[data-page]");
      if (pageButton) { goToPage(pageButton.dataset.page); return; }
      const settingsTab = event.target.closest("[data-settings-tab]");
      if (settingsTab) { switchSettingsTab(settingsTab.dataset.settingsTab); return; }
      const preferenceChoice = event.target.closest("#tasteChoices .choice-chip, #preferredMealTypes .choice-chip, #allergyChoices .choice-chip");
      if (preferenceChoice) {
        toggleChoice(preferenceChoice);
        const group = preferenceChoice.closest("#tasteChoices, #preferredMealTypes, #allergyChoices");
        const preferenceKey = { tasteChoices: "tastes", preferredMealTypes: "preferredMealTypes", allergyChoices: "allergies" }[group?.id];
        if (preferenceKey) updatePreferenceField(preferenceKey, $(`#${group.id} .choice-chip.selected`).map((button) => button.dataset.value));
        return;
      }
      if (event.target.closest("#savePreferences")) { savePreferences(); return; }
      const recipeButton = event.target.closest("[data-recipe-details]");
      if (recipeButton) { showRecipe(recipeButton.dataset.recipeDetails); return; }
      const addRecipe = event.target.closest("[data-add-recipe]");
      if (addRecipe) { addRecipeToPlan(addRecipe.dataset.addRecipe); return; }
      const planChoice = event.target.closest("[data-plan-choice]");
      if (planChoice) { addRecipeToPlan(planChoice.dataset.planChoice, selectedDayForPlan); return; }
      const addDay = event.target.closest("[data-add-day]");
      if (addDay) { showPlanPicker(addDay.dataset.addDay); return; }
      const removePlan = event.target.closest("[data-remove-plan]");
      if (removePlan) { removePlanForDate(removePlan.dataset.removePlan); return; }
      const toggleDay = event.target.closest("[data-toggle-day]");
      if (toggleDay) { toggleAvailability(Number(toggleDay.dataset.toggleDay)); return; }
      const addIngredient = event.target.closest("[data-add-pantry]");
      if (addIngredient) { addIngredientToPantry(addIngredient.dataset.addPantry); return; }
      const openPantry = event.target.closest("[data-open-pantry-picker]");
      if (openPantry || event.target.closest("#addPantryItem")) { openModal(pantryPickerMarkup(), translate("ingredientPickTitle")); return; }
      const removePantry = event.target.closest("[data-remove-pantry]");
      if (removePantry) { removeIngredientFromPantry(removePantry.dataset.removePantry); return; }
      const openExpense = event.target.closest("[data-open-expense]");
      if (openExpense || event.target.closest("#openExpenseForm")) { openModal(expenseFormMarkup(), translate("expenseTitle")); return; }
      const removeExpenseButton = event.target.closest("[data-remove-expense]");
      if (removeExpenseButton) { removeExpense(removeExpenseButton.dataset.removeExpense); return; }
      if (event.target.closest("#editBudget")) { openModal(budgetFormMarkup(), translate("editBudget")); return; }
      const removePreference = event.target.closest("[data-remove-preference]");
      if (removePreference) { removeCustomPreference(removePreference.dataset.removePreference, Number(removePreference.dataset.index)); return; }
      if (event.target.closest("#addFavoriteIngredient")) { addCustomPreference("favorite"); return; }
      if (event.target.closest("#addFavoriteDish")) { addCustomPreference("dish"); return; }
      if (event.target.closest("#addCustomAvoidIngredient")) { addCustomPreference("avoid"); return; }
      if (event.target.closest("[data-close-modal]")) { closeModal(); return; }
      const openAuth = event.target.closest("[data-open-auth]");
      if (openAuth) { showAuth(openAuth.dataset.openAuth); return; }
      const findMissing = event.target.closest("[data-find-missing]");
      if (findMissing) {
        const recipe = recipeById(findMissing.dataset.findMissing);
        const missing = recipe ? missingIngredients(recipe).map(([id]) => localized(ingredientById(id))) : [];
        closeModal();
        goToPage("nearby");
        if (missing.length) {
          nearbyIngredientQuery = missing.join(", ");
          activePlace = "grocery";
          $(".nearby-filter[data-place='grocery']")?.classList.add("active");
          $$(".nearby-filter:not([data-place='grocery'])").forEach((button) => button.classList.remove("active"));
          renderNearby();
          refreshLivePlaces();
        }
        return;
      }
      if (event.target.closest("[data-clear-nearby-search]")) {
        nearbyIngredientQuery = "";
        renderNearby();
        refreshLivePlaces();
        return;
      }
      const mapSearch = event.target.closest("[data-map-query]");
      if (mapSearch) { window.open(mapsSearchUrl(mapSearch.dataset.mapQuery), "_blank", "noopener,noreferrer"); return; }
      const placeFilter = event.target.closest("[data-place]");
      if (placeFilter) { selectPlace(placeFilter.dataset.place); return; }
      const redraw = event.target.closest("[data-redraw]");
      if (redraw) { drawIngredient(redraw.dataset.redraw); return; }
      if (event.target.closest("#drawAgainButton")) { drawIngredient(); return; }
      const fontSize = event.target.closest("[data-font-size]");
      if (fontSize) { state.appearance.fontSize = fontSize.dataset.fontSize; persist(); return; }
      const themeButton = event.target.closest(".theme-swatch");
      if (themeButton) {
        state.appearance.theme = themeButton.dataset.theme;
        state.appearance.customColor = "";
        applyAppearance();
        persist();
        return;
      }
      if (event.target.closest("#signOutButton")) { signOut(); return; }
      if (event.target.closest("#deleteAccountButton")) { openModal(deleteAccountMarkup(), translate("deleteAccount")); return; }
      if (event.target.closest("#profileSwitch") || event.target.closest("#topbarAccount")) {
        if (state.user) { goToPage("settings"); switchSettingsTab("account"); }
        else showAuth("login");
        return;
      }
    });

    $("#languageSwitch").addEventListener("click", () => {
      state.lang = state.lang === "vi" ? "en" : "vi";
      persist(false);
      applyLanguage();
      refreshLivePlaces();
      showToast(translate(state.lang === "en" ? "languageChanged" : "languageChangedVi"));
    });
    $("#mobileMenu").addEventListener("click", () => $("#sidebar").classList.toggle("mobile-open"));
    $("#prevWeek").addEventListener("click", () => { weekOffset -= 1; renderPlanner(); });
    $("#nextWeek").addEventListener("click", () => { weekOffset += 1; renderPlanner(); });
    $("#clearWeek").addEventListener("click", clearWeekPlan);
    $("#generateWeek").addEventListener("click", generateWeekPlan);
    $("#recipeSearch").addEventListener("input", renderRecipeGrid);
    $("#recipeSearchButton").addEventListener("click", renderRecipeGrid);
    $("#recipeSearch").addEventListener("keydown", (event) => { if (event.key === "Enter") renderRecipeGrid(); });
    $("#recipeSort").addEventListener("change", (event) => { recipeSort = event.target.value; renderRecipeGrid(); });
    $("#healthGoal").addEventListener("change", (event) => updatePreferenceField("healthGoal", event.target.value || "balanced"));
    $("#cookingSetup").addEventListener("change", (event) => updatePreferenceField("cookingSetup", event.target.value || "full"));
    $("#mealTypeFilters").addEventListener("click", (event) => {
      const button = event.target.closest("[data-type]");
      if (!button) return;
      recipeTypeFilter = button.dataset.type;
      $$("#mealTypeFilters .filter-chip").forEach((item) => item.classList.toggle("active", item === button));
      renderRecipeGrid();
    });
    $("#resetRecipeFilters").addEventListener("click", () => {
      recipeTypeFilter = "all";
      recipeSort = "recommended";
      $("#recipeSearch").value = "";
      $("#recipeSort").value = "recommended";
      $$("#mealTypeFilters .filter-chip").forEach((button) => button.classList.toggle("active", button.dataset.type === "all"));
      renderRecipeGrid();
    });
    $("#pantrySearch").addEventListener("input", renderPantry);
    $("#pantryCategoryTabs").addEventListener("click", (event) => {
      const button = event.target.closest("[data-category]");
      if (!button) return;
      pantryCategory = button.dataset.category;
      $$("#pantryCategoryTabs .filter-chip").forEach((item) => item.classList.toggle("active", item === button));
      renderPantry();
    });
    $("#pantryShelfTabs").addEventListener("click", (event) => {
      const button = event.target.closest("[data-shelf]");
      if (!button) return;
      pantryShelfFilter = button.dataset.shelf;
      $$("#pantryShelfTabs .filter-chip").forEach((item) => item.classList.toggle("active", item === button));
      renderPantry();
    });
    $("#expensePeriod").addEventListener("change", renderBudget);
    $("#locateMe").addEventListener("click", requestLocation);
    $("#nearbySearchButton").addEventListener("click", searchNearby);
    $("#nearbySearch").addEventListener("keydown", (event) => { if (event.key === "Enter") searchNearby(); });
    $("#drawIngredient").addEventListener("click", () => drawIngredient());
    $("#clearDrawHistory").addEventListener("click", () => { state.drawHistory = []; persist(); });
    document.addEventListener("keydown", (event) => {
      if (event.key !== "Enter") return;
      const kindByInputId = { favoriteIngredientInput: "favorite", favoriteDishInput: "dish", customAvoidIngredientInput: "avoid" };
      const kind = kindByInputId[event.target?.id];
      if (!kind) return;
      event.preventDefault();
      addCustomPreference(kind);
    });
    $("#saveSchedule").addEventListener("click", () => { persist(); $("#scheduleSaveFeedback").textContent = translate("preferencesSaved"); showToast(translate("preferencesSaved")); });
    $("#saveAppearance").addEventListener("click", () => {
      state.appearance.fontScale = Number($("#fontSizeRange").value);
      applyAppearance();
      persist();
      showToast(translate("preferencesSaved"));
    });
    $("#fontSizeRange").addEventListener("input", (event) => {
      state.appearance.fontScale = Number(event.target.value);
      applyAppearance();
    });
    $("#fontSizeRange").addEventListener("change", () => {
      persist();
      showToast(translate("preferencesSaved"));
    });
    $("#customThemeColor").addEventListener("input", (event) => {
      state.appearance.customColor = event.target.value;
      state.appearance.theme = "custom";
      applyAppearance();
    });
    $("#customThemeColor").addEventListener("change", () => {
      persist();
      showToast(translate("preferencesSaved"));
    });
    $("#authClose").addEventListener("click", closeAuth);
    $("#modalClose").addEventListener("click", closeModal);
    $("#modalBackdrop").addEventListener("click", (event) => { if (event.target.id === "modalBackdrop") closeModal(); });
    $("#authBackdrop").addEventListener("click", (event) => { if (event.target.id === "authBackdrop") closeAuth(); });
    $("#authContent").addEventListener("submit", (event) => {
      if (event.target.id !== "authForm") return;
      event.preventDefault();
      submitAuth(event.target);
    });
    $("#authContent").addEventListener("click", (event) => {
      if (event.target.id === "authModeSwitch") showAuth(authMode === "login" ? "register" : "login");
    });
    $("#modalContent").addEventListener("submit", (event) => {
      event.preventDefault();
      if (event.target.id === "expenseForm") saveExpense(event.target);
      if (event.target.id === "budgetForm") {
        state.preferences.monthlyBudget = Number(new FormData(event.target).get("budget")) || 0;
        state.preferences.budgetConfigured = true;
        closeModal();
        persist();
        showToast(translate("budgetSaved"));
      }
      if (event.target.id === "deleteAccountForm") confirmDeleteAccount(event.target);
    });
    $("#modalContent").addEventListener("input", (event) => {
      if (event.target.id === "ingredientPickerSearch") {
        const query = event.target.value.toLocaleLowerCase(state.lang === "vi" ? "vi-VN" : "en-US");
        $$(".ingredient-picker-row", $("#modalContent")).forEach((row) => row.hidden = !row.textContent.toLocaleLowerCase(state.lang === "vi" ? "vi-VN" : "en-US").includes(query));
      }
      if (event.target.id === "planPickerSearch") {
        const query = event.target.value.toLocaleLowerCase(state.lang === "vi" ? "vi-VN" : "en-US");
        $$(".plan-picker-option", $("#modalContent")).forEach((row) => row.hidden = !row.textContent.toLocaleLowerCase(state.lang === "vi" ? "vi-VN" : "en-US").includes(query));
      }
    });
    $("#notificationButton").addEventListener("click", () => {
      const data = getBudgetStatus();
      showToast(data.ratio >= 0.8 ? translate(data.ratio >= 1 ? "budgetExceeded" : "budgetWarning") : (state.lang === "vi" ? "Chưa có nhắc nhở mới. Ngân sách vẫn ổn!" : "No new reminders. Your budget is on track!"));
    });
    window.addEventListener("resize", () => {
      if (state.appearance.mascot) renderAll();
      positionMascotMenu();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeModal();
        closeAuth();
        closeMascotMenu();
      }
    });
    attachMascotDrag();
  }

  function attachLogoFallbacks() {
    $$(".brand-logo, .auth-logo-image").forEach((image) => {
      const fallback = () => {
        image.hidden = true;
        image.parentElement?.classList.add("logo-image-missing");
      };
      image.addEventListener("error", fallback, { once: true });
      if (image.complete && image.naturalWidth === 0) fallback();
    });
  }

  async function restoreSession() {
    if (!state.token) return;
    try {
      const result = await api("/api/auth/me");
      state.user = result.user;
      const profile = result.user.profile || {};
      const hasRemoteData = ["preferences","pantry","plan","expenses","drawHistory","appearance"].some((key) => profile[key] !== undefined);
      if (hasRemoteData) applyRemoteProfile(profile);
      persist(false);
    } catch {
      state.user = null;
      state.token = "";
      persist(false);
    }
  }

  function initialize() {
    attachLogoFallbacks();
    attachEvents();
    renderAll();
    applyLanguage();
    setPage("overview");
    restoreSession();
    loadPublicConfig();
  }

  initialize();
})();
