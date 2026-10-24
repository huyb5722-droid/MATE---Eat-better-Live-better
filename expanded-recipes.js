/* Expanded MATE recipe library. Additional recipes use the same ingredient and preference data as the core app. */
(() => {
  const data = window.MATE_DATA;
  const ingredients = data.ingredients;
  const rows = `
x001|Cơm gà nướng sả|Lemongrass chicken rice|lunch|Vietnamese|35|pan|balanced,high-protein|chicken-thigh,rice,lemongrass,cucumber,fish-sauce,garlic
x002|Cơm sườn nướng|Grilled pork rib rice|lunch|Vietnamese|45|bake|high-protein,meal-prep|pork-ribs,rice,fish-sauce,shallot,cucumber,black-pepper
x003|Cơm thịt kho trứng|Braised pork and egg rice|lunch|Vietnamese|40|braise|high-protein,meal-prep|pork,egg,rice,fish-sauce,shallot,black-pepper
x004|Cơm bò lúc lắc|Vietnamese shaking beef rice|dinner|Vietnamese|25|pan|high-protein,balanced|beef,rice,bell-pepper,onion,lettuce,soy-sauce
x005|Cơm cá hồi áp chảo|Pan-seared salmon rice|dinner|Vietnamese|25|pan|high-protein,balanced|salmon,rice,broccoli,lime,black-pepper,oil
x006|Cơm mực xào dứa|Squid and pineapple rice|dinner|Vietnamese|25|pan|high-protein,balanced|squid,rice,pineapple,tomato,scallion,fish-sauce
x007|Cơm gà cà ri|Chicken curry rice|dinner|Asian|35|curry|high-protein,meal-prep|chicken-thigh,rice,potato,carrot,coconut-milk,curry-powder
x008|Cơm tôm rim mặn ngọt|Sweet-salty shrimp rice|lunch|Vietnamese|25|pan|high-protein|shrimp,rice,fish-sauce,sugar,shallot,scallion
x009|Cơm đậu hũ sốt nấm|Tofu and mushroom rice|dinner|Vietnamese|25|pan|vegetarian,balanced|tofu,rice,shiitake,soy-sauce,scallion,black-pepper
x010|Cơm gà xé rau thơm|Shredded chicken herb rice|lunch|Vietnamese|30|rice|high-protein,balanced|chicken,rice,cucumber,lettuce,mint,fish-sauce
x011|Cơm chiên trứng cay|Spicy egg fried rice|lunch|Asian|18|pan|quick,spicy|rice,egg,carrot,scallion,soy-sauce,chili
x012|Cơm chiên cá ngừ bắp|Tuna and corn fried rice|lunch|Asian|18|pan|quick,high-protein|rice,tuna,corn,egg,scallion,soy-sauce
x013|Cơm chiên bò rau củ|Beef vegetable fried rice|lunch|Asian|20|pan|quick,high-protein,balanced|rice,beef,carrot,green-beans,egg,soy-sauce
x014|Cơm trứng cuộn rau củ|Vegetable egg rice bowl|breakfast|Asian|15|pan|quick,high-protein|rice,egg,cucumber,carrot,soy-sauce,sesame
x015|Cơm gà nấm đông cô|Chicken shiitake rice|dinner|Asian|35|rice|high-protein,meal-prep|chicken,shiitake,rice,ginger,soy-sauce,scallion
x016|Cơm cá kho nghệ|Turmeric braised fish rice|dinner|Vietnamese|35|braise|high-protein|fish,rice,turmeric,fish-sauce,black-pepper,scallion
x017|Cơm heo xào đậu que|Pork and green bean rice|dinner|Vietnamese|25|pan|high-protein,balanced|pork,green-beans,rice,garlic,oyster-sauce,black-pepper
x018|Cơm bò bông cải|Beef and broccoli rice|dinner|Asian|25|pan|high-protein,balanced|beef,broccoli,rice,garlic,oyster-sauce,sesame-oil
x019|Cơm gà sốt chanh|Lime chicken rice|lunch|Vietnamese|25|pan|high-protein,light|chicken,rice,lime,lettuce,cucumber,garlic
x020|Cơm cà tím đậu hũ|Eggplant tofu rice bowl|dinner|Asian|25|pan|vegetarian,balanced|eggplant,tofu,rice,soy-sauce,garlic,chili
x021|Bún bò xào sả|Lemongrass beef vermicelli|lunch|Vietnamese|25|noodle|high-protein,balanced|beef,rice-noodle,lemongrass,lettuce,mint,fish-sauce
x022|Bún thịt nướng rau sống|Grilled pork vermicelli bowl|lunch|Vietnamese|35|pan|high-protein,balanced|pork,rice-noodle,lettuce,mint,cucumber,fish-sauce
x023|Bún cá hồi rau cải|Salmon greens noodle soup|dinner|Vietnamese|30|soup|high-protein,light|salmon,rice-noodle,bok-choy,ginger,scallion,fish-sauce
x024|Bún đậu hũ cà chua|Tomato tofu noodle soup|dinner|Vietnamese|25|soup|vegetarian,light|tofu,rice-noodle,tomato,bean-sprouts,scallion,soy-sauce
x025|Mì xào bò cải thìa|Beef bok choy noodles|lunch|Asian|20|noodle|quick,high-protein|beef,instant-noodle,bok-choy,garlic,oyster-sauce,soy-sauce
x026|Mì xào hải sản rau củ|Seafood vegetable noodles|dinner|Asian|25|noodle|high-protein,balanced|shrimp,squid,instant-noodle,carrot,cabbage,oyster-sauce
x027|Mì gà nấm kim châm|Chicken enoki noodle soup|dinner|Asian|25|soup|high-protein,light|chicken,enoki,instant-noodle,bok-choy,ginger,scallion
x028|Mì trộn gà mè|Sesame chicken noodle bowl|lunch|Asian|25|noodle|high-protein|chicken,instant-noodle,cucumber,sesame,sesame-oil,soy-sauce
x029|Miến xào rau củ|Mixed vegetable glass noodle stir-fry|dinner|Asian|25|noodle|balanced|chicken,carrot,cabbage,bean-sprouts,soy-sauce,sesame-oil
x030|Phở bò tại nhà|Quick beef pho-style bowl|dinner|Vietnamese|30|soup|high-protein|beef,rice-noodle,ginger,scallion,cilantro,lime
x031|Cháo cá hồi bí đỏ|Salmon pumpkin porridge|breakfast|Vietnamese|35|porridge|high-protein,light|salmon,rice,pumpkin,ginger,scallion,fish-sauce
x032|Cháo sườn gừng|Pork rib ginger porridge|breakfast|Vietnamese|50|porridge|high-protein,meal-prep|pork-ribs,rice,ginger,scallion,black-pepper,salt
x033|Canh chua cá basa|Vietnamese sour basa soup|dinner|Vietnamese|30|soup|light,balanced|fish,pineapple,tomato,okra,bean-sprouts,fish-sauce
x034|Canh cải thảo thịt bằm|Napa cabbage pork soup|dinner|Vietnamese|25|soup|light,balanced|minced-pork,napa-cabbage,ginger,scallion,fish-sauce,black-pepper
x035|Súp gà bắp|Chicken sweet corn soup|lunch|Asian|25|soup|high-protein,light|chicken,corn,egg,carrot,cornstarch,scallion
x036|Canh nấm đậu hũ|Mushroom tofu soup|dinner|Asian|20|soup|vegetarian,light|tofu,enoki,shiitake,bok-choy,ginger,soy-sauce
x037|Bún riêu chay nhanh|Quick vegetarian tomato noodle soup|dinner|Vietnamese|25|soup|vegetarian,light|tofu,tomato,rice-noodle,bean-sprouts,cilantro,soy-sauce
x038|Mì rau củ xào|Vegetable noodle stir-fry|lunch|Asian|20|noodle|quick,vegetarian|instant-noodle,bok-choy,carrot,mushroom,soy-sauce,sesame-oil
x039|Bún gà sả gừng|Ginger lemongrass chicken noodles|dinner|Vietnamese|30|soup|high-protein|chicken,rice-noodle,lemongrass,ginger,cilantro,lime
x040|Miến gà nấm hương|Chicken shiitake glass noodle soup|dinner|Vietnamese|35|soup|high-protein,light|chicken,shiitake,carrot,ginger,scallion,fish-sauce
x041|Bò xào lúc lắc rau củ|Shaking beef with vegetables|dinner|Vietnamese|25|pan|high-protein,balanced|beef,bell-pepper,onion,tomato,garlic,black-pepper
x042|Thịt heo xào sả ớt|Lemongrass chili pork|dinner|Vietnamese|25|pan|high-protein,spicy|pork,lemongrass,chili,shallot,fish-sauce,sugar
x043|Gà xào húng quế|Basil chicken stir-fry|dinner|Asian|20|pan|quick,high-protein,spicy|chicken,basil,chili,garlic,soy-sauce,sugar
x044|Gà kho gừng|Ginger braised chicken|dinner|Vietnamese|35|braise|high-protein,meal-prep|chicken-thigh,ginger,fish-sauce,shallot,black-pepper,sugar
x045|Sườn heo rim nước mắm|Fish sauce glazed pork ribs|dinner|Vietnamese|45|braise|high-protein,meal-prep|pork-ribs,fish-sauce,garlic,sugar,black-pepper,scallion
x046|Thịt heo xào cải thảo|Pork napa cabbage stir-fry|dinner|Asian|20|pan|quick,balanced|pork,napa-cabbage,garlic,oyster-sauce,black-pepper,oil
x047|Bò xào đậu que|Beef green bean stir-fry|dinner|Asian|20|pan|quick,high-protein|beef,green-beans,garlic,oyster-sauce,soy-sauce,sesame-oil
x048|Bò sốt tiêu đen|Black pepper beef|dinner|Asian|25|pan|high-protein,spicy|beef,onion,bell-pepper,black-pepper,oyster-sauce,soy-sauce
x049|Gà sốt cam|Orange glazed chicken|dinner|Asian|30|pan|high-protein|chicken,orange,garlic,soy-sauce,cornstarch,black-pepper
x050|Gà nướng sốt ngọt|Sweet glazed baked chicken|dinner|Asian|40|bake|high-protein|chicken-thigh,sugar,garlic,soy-sauce,black-pepper,sesame
x051|Cá hồi sốt chanh|Lime salmon|dinner|Western|25|pan|high-protein,light|salmon,lime,black-pepper,broccoli,oil,garlic
x052|Cá basa kho tiêu|Pepper braised basa fish|dinner|Vietnamese|30|braise|high-protein|fish,fish-sauce,black-pepper,shallot,scallion,sugar
x053|Mực xào rau củ|Squid vegetable stir-fry|dinner|Asian|20|pan|quick,high-protein,balanced|squid,green-beans,carrot,onion,oyster-sauce,black-pepper
x054|Tôm xào bông cải|Shrimp broccoli stir-fry|dinner|Asian|20|pan|quick,high-protein,balanced|shrimp,broccoli,garlic,oyster-sauce,cornstarch,black-pepper
x055|Tôm rang mặn ngọt|Sweet-salty shrimp|dinner|Vietnamese|25|pan|high-protein|shrimp,fish-sauce,sugar,chili,scallion,garlic
x056|Đậu bắp xào tỏi|Garlic okra stir-fry|dinner|Vietnamese|15|pan|quick,vegetarian,light|okra,garlic,soy-sauce,sesame-oil,black-pepper,salt
x057|Cà tím nướng mỡ hành|Roasted eggplant with scallion oil|dinner|Vietnamese|30|bake|vegetarian,light|eggplant,scallion,oil,soy-sauce,peanuts,black-pepper
x058|Gà hấp gừng hành|Steamed ginger scallion chicken|dinner|Vietnamese|35|steam|high-protein,light|chicken-thigh,ginger,scallion,soy-sauce,sesame-oil,black-pepper
x059|Bò cuộn rau củ|Beef and vegetable rolls|dinner|Vietnamese|30|pan|high-protein,balanced|beef,carrot,green-beans,scallion,soy-sauce,black-pepper
x060|Trứng vịt kho cà chua|Duck eggs in tomato sauce|dinner|Vietnamese|25|braise|high-protein,budget|duck-egg,tomato,fish-sauce,shallot,scallion,black-pepper
x061|Đậu hũ sốt nấm|Tofu mushroom sauce|dinner|Asian|20|pan|vegetarian,light|tofu,shiitake,soy-sauce,cornstarch,scallion,sesame-oil
x062|Đậu hũ kho nấm đông cô|Braised tofu shiitake|dinner|Vietnamese|25|braise|vegetarian,meal-prep|tofu,shiitake,soy-sauce,ginger,scallion,black-pepper
x063|Cà ri đậu hũ rau củ|Tofu vegetable curry|dinner|Asian|35|curry|vegetarian,balanced,meal-prep|tofu,potato,carrot,coconut-milk,curry-powder,cauliflower
x064|Cà tím xào đậu hũ|Eggplant tofu stir-fry|dinner|Asian|20|pan|quick,vegetarian|eggplant,tofu,garlic,soy-sauce,scallion,chili
x065|Nấm kim châm cuộn cải|Enoki cabbage rolls|dinner|Asian|25|steam|vegetarian,light|enoki,napa-cabbage,soy-sauce,sesame-oil,scallion,black-pepper
x066|Súp lơ trắng xào tỏi|Garlic cauliflower|dinner|Asian|20|pan|quick,vegetarian,light|cauliflower,garlic,soy-sauce,sesame-oil,black-pepper,salt
x067|Rau muống xào tỏi|Garlic water spinach|dinner|Vietnamese|15|pan|quick,vegetarian|water-spinach,garlic,oil,salt,black-pepper,chili
x068|Cải thìa xào nấm|Bok choy mushroom stir-fry|dinner|Asian|15|pan|quick,vegetarian,light|bok-choy,shiitake,garlic,oyster-sauce,sesame-oil,black-pepper
x069|Bắp cải xào giá đỗ|Cabbage bean sprout stir-fry|dinner|Asian|15|pan|quick,vegetarian,budget|cabbage,bean-sprouts,carrot,soy-sauce,sesame-oil,garlic
x070|Đậu que xào mè|Sesame green beans|dinner|Asian|18|pan|quick,vegetarian|green-beans,sesame,sesame-oil,soy-sauce,garlic,black-pepper
x071|Súp lơ nướng nghệ|Turmeric roasted cauliflower|dinner|Western|30|bake|vegetarian,light|cauliflower,oil,black-pepper,turmeric,salt,yogurt
x072|Canh bí đỏ đậu hũ|Pumpkin tofu soup|dinner|Vietnamese|25|soup|vegetarian,light|pumpkin,tofu,scallion,ginger,soy-sauce,black-pepper
x073|Bí ngòi xào trứng|Zucchini egg stir-fry|dinner|Asian|15|pan|quick,vegetarian|zucchini,egg,garlic,soy-sauce,scallion,black-pepper
x074|Nấm xào bắp|Mushroom corn stir-fry|dinner|Asian|18|pan|quick,vegetarian|mushroom,corn,carrot,oyster-sauce,garlic,black-pepper
x075|Salad đậu hũ mè|Sesame tofu salad|lunch|Asian|20|salad|vegetarian,light|tofu,lettuce,cucumber,sesame,sesame-oil,vinegar
x076|Gỏi đu đủ chay|Vegetarian papaya salad|lunch|Vietnamese|20|no-cook|vegetarian,light|papaya,carrot,mint,peanuts,lime,vinegar
x077|Bún rau củ trộn tương|Vegetable rice noodle bowl with soy dip|lunch|Vietnamese|25|no-cook|vegetarian,light|rice-noodle,lettuce,cucumber,carrot,mint,soy-sauce
x078|Bánh mì nấm xào|Garlic mushroom baguette|lunch|Western|20|pan|vegetarian,quick|bread,mushroom,garlic,lettuce,soy-sauce,black-pepper
x079|Khoai lang nướng sữa chua|Roasted sweet potato and yogurt|snack|Western|35|bake|vegetarian,light|sweet-potato,yogurt,sesame,sugar,black-pepper,salt
x080|Yến mạch mặn nấm cải thìa|Savory mushroom oats|breakfast|Asian|20|porridge|vegetarian,balanced|oats,shiitake,bok-choy,egg,soy-sauce,scallion
x081|Bánh mì ốp la phô mai|Cheese fried egg baguette|breakfast|Western|12|pan|quick,high-protein|bread,egg,cheese,tomato,lettuce,black-pepper
x082|Trứng cuộn rau củ|Vegetable omelette roll|breakfast|Western|15|pan|quick,balanced|egg,carrot,scallion,cheese,spinach,black-pepper
x083|Trứng hấp đậu hũ|Steamed egg tofu|breakfast|Asian|20|steam|high-protein,light|egg,tofu,scallion,soy-sauce,sesame-oil,black-pepper
x084|Bánh pancake yến mạch táo|Apple oat pancakes|breakfast|Western|20|pan|vegetarian,balanced|oats,apple,egg,milk,sugar,banana
x085|Cháo yến mạch trứng|Egg oatmeal porridge|breakfast|Asian|12|microwave|quick,high-protein|oats,egg,milk,scallion,black-pepper,salt
x086|Bánh mì cá ngừ bắp|Tuna corn sandwich|breakfast|Western|12|no-cook|quick,high-protein|bread,tuna,corn,yogurt,lettuce,cucumber
x087|Bánh mì gà xé|Shredded chicken sandwich|breakfast|Western|15|pan|quick,high-protein|bread,chicken,lettuce,cucumber,yogurt,black-pepper
x088|Bánh mì bơ trứng|Avocado egg toast|breakfast|Western|15|pan|quick,balanced|bread,avocado,egg,tomato,black-pepper,lime
x089|Bánh mì chuối đậu phộng|Banana peanut butter toast|breakfast|Western|10|no-cook|quick,vegetarian|bread,banana,peanuts,sugar,milk,oats
x090|Sữa chua xoài yến mạch|Mango yogurt oat bowl|breakfast|Western|8|no-cook|quick,vegetarian,light|mango,yogurt,oats,sugar,sesame,milk
x091|Sinh tố đu đủ sữa chua|Papaya yogurt smoothie|snack|Western|8|blend|quick,vegetarian,light|papaya,yogurt,milk,banana,lime,oats
x092|Sinh tố xoài chuối|Mango banana smoothie|snack|Western|8|blend|quick,vegetarian|mango,banana,milk,yogurt,oats,orange
x093|Trứng cà chua phô mai|Tomato egg breakfast skillet|breakfast|Western|15|pan|quick,high-protein|egg,tomato,cheese,spinach,black-pepper,oil
x094|Khoai tây nghiền trứng|Egg and mashed potato bowl|breakfast|Western|25|boil|vegetarian,balanced|potato,egg,milk,cheese,black-pepper,salt
x095|Bắp luộc trứng|Corn and boiled egg plate|breakfast|Vietnamese|15|boil|quick,balanced|corn,egg,salt,black-pepper,lettuce,cucumber
x096|Bánh chuối yến mạch áp chảo|Banana oat griddle cakes|breakfast|Vietnamese|18|pan|quick,vegetarian|banana,oats,egg,milk,sugar,yogurt
x097|Trứng bác nấm|Mushroom scrambled eggs|breakfast|Western|12|pan|quick,high-protein|egg,mushroom,milk,scallion,black-pepper,bread
x098|Bánh mì xúc xích rau xà lách|Sausage lettuce baguette|breakfast|Western|12|pan|quick|bread,sausage,lettuce,tomato,yogurt,cucumber
x099|Yến mạch chuối sữa chua|Banana yogurt oats|breakfast|Western|5|no-cook|quick,vegetarian,light|oats,milk,yogurt,banana,sugar,sesame
x100|Salad khoai tây trứng|Egg potato salad|lunch|Western|25|boil|vegetarian,balanced|egg,potato,carrot,yogurt,lettuce,black-pepper
x101|Salad gà bơ|Chicken avocado salad|lunch|Western|20|salad|high-protein,light|chicken,avocado,lettuce,cucumber,lime,oil
x102|Salad cá ngừ trứng|Tuna egg salad|lunch|Western|15|boil|quick,high-protein,light|tuna,egg,lettuce,tomato,cucumber,vinegar
x103|Salad xoài tôm|Mango shrimp salad|lunch|Asian|20|salad|high-protein,light|shrimp,mango,lettuce,mint,lime,peanuts
x104|Gỏi gà bắp cải|Vietnamese chicken cabbage salad|lunch|Vietnamese|25|salad|high-protein,light|chicken,cabbage,carrot,mint,peanuts,vinegar
x105|Salad dưa leo cà chua|Cucumber tomato salad|lunch|Western|10|no-cook|quick,vegetarian,light|cucumber,tomato,lettuce,vinegar,oil,black-pepper
x106|Salad bơ bắp|Avocado corn salad|lunch|Western|12|no-cook|quick,vegetarian,light|avocado,corn,cucumber,tomato,lime,lettuce
x107|Gỏi đu đủ tôm|Papaya shrimp salad|lunch|Vietnamese|20|salad|high-protein,light|papaya,shrimp,carrot,mint,peanuts,lime
x108|Bún tôm rau thơm|Shrimp herb vermicelli|lunch|Vietnamese|25|steam|high-protein,light|shrimp,rice-noodle,lettuce,mint,cucumber,cilantro
x109|Bún bò rau thơm|Beef herb vermicelli|lunch|Vietnamese|25|pan|high-protein,balanced|beef,rice-noodle,lettuce,mint,cucumber,cilantro
x110|Salad cải thảo mè|Sesame napa cabbage salad|lunch|Asian|12|no-cook|quick,vegetarian,light|napa-cabbage,carrot,sesame,vinegar,sesame-oil,soy-sauce
x111|Salad bông cải trứng|Broccoli egg salad|lunch|Western|20|boil|high-protein,light|broccoli,egg,yogurt,lettuce,black-pepper,salt
x112|Salad xoài dưa leo|Mango cucumber herb salad|lunch|Asian|12|no-cook|quick,vegetarian,light|mango,cucumber,mint,lime,peanuts,chili
x113|Bún trộn rau thơm chay|Vegetarian herb noodle salad|lunch|Vietnamese|15|no-cook|quick,vegetarian,light|rice-noodle,lettuce,cucumber,mint,peanuts,lime
x114|Bowl khoai lang đậu hũ|Sweet potato tofu bowl|lunch|Western|30|bake|vegetarian,balanced|sweet-potato,tofu,lettuce,cucumber,sesame,vinegar
x115|Bowl gà rau củ|Chicken vegetable grain bowl|lunch|Asian|30|rice|high-protein,balanced|chicken,rice,broccoli,carrot,cucumber,sesame
x116|Bowl cá hồi bơ|Salmon avocado bowl|lunch|Asian|25|pan|high-protein,balanced|salmon,rice,avocado,cucumber,sesame,soy-sauce
x117|Bowl đậu hũ rau củ|Tofu vegetable grain bowl|lunch|Asian|25|pan|vegetarian,balanced|tofu,rice,broccoli,carrot,soy-sauce,sesame-oil
x118|Salad bắp cải gà mè|Sesame chicken cabbage salad|lunch|Asian|20|salad|high-protein,light|chicken,cabbage,carrot,sesame,vinegar,sesame-oil
x119|Salad trứng rau cải|Spinach egg salad|lunch|Western|15|boil|high-protein,light|egg,spinach,tomato,cucumber,oil,black-pepper
x120|Bowl rau củ bơ|Avocado vegetable bowl|lunch|Vietnamese|20|no-cook|quick,vegetarian,light|avocado,lettuce,cucumber,carrot,mint,lime
x121|Mì Ý sốt kem nấm|Creamy mushroom pasta|dinner|Western|25|noodle|vegetarian|pasta,mushroom,milk,cheese,garlic,black-pepper
x122|Mì Ý gà sốt cà chua|Chicken tomato pasta|dinner|Western|30|noodle|high-protein|pasta,chicken,tomato,garlic,cheese,black-pepper
x123|Mì Ý cá ngừ|Tuna pasta|dinner|Western|20|noodle|quick,high-protein|pasta,tuna,tomato,garlic,oil,black-pepper
x124|Mì Ý tôm tỏi|Garlic shrimp pasta|dinner|Western|22|noodle|high-protein|pasta,shrimp,garlic,lime,oil,black-pepper
x125|Mì Ý rau củ|Vegetable pasta|dinner|Western|30|noodle|vegetarian,balanced|pasta,zucchini,bell-pepper,tomato,cheese,oil
x126|Sandwich bò phô mai|Beef cheese sandwich|lunch|Western|20|pan|high-protein|bread,beef,cheese,lettuce,tomato,black-pepper
x127|Sandwich gà bơ|Chicken avocado sandwich|lunch|Western|15|pan|quick,high-protein|bread,chicken,avocado,lettuce,cucumber,lime
x128|Sandwich trứng rau|Egg salad sandwich|lunch|Western|15|boil|quick,vegetarian|bread,egg,yogurt,lettuce,cucumber,black-pepper
x129|Bánh mì cá hồi phô mai|Salmon cheese toast|breakfast|Western|18|pan|high-protein|bread,salmon,cheese,lettuce,lime,black-pepper
x130|Pizza bánh mì chảo|Skillet baguette pizza|snack|Western|20|pan|quick|bread,tomato,cheese,sausage,bell-pepper,basil
x131|Súp bí đỏ cà ri|Curried pumpkin soup|dinner|Asian|30|soup|vegetarian,light|pumpkin,coconut-milk,curry-powder,onion,black-pepper,salt
x132|Súp kem nấm|Creamy mushroom soup|dinner|Western|25|soup|vegetarian|mushroom,milk,cheese,garlic,cornstarch,black-pepper
x133|Súp gà rau củ|Chicken vegetable soup|dinner|Vietnamese|30|soup|high-protein,light|chicken,carrot,potato,cauliflower,scallion,black-pepper
x134|Khoai tây nướng phô mai|Cheesy baked potatoes|snack|Western|40|bake|vegetarian|potato,cheese,milk,scallion,black-pepper,salt
x135|Bông cải nướng phô mai|Cheesy roasted broccoli|dinner|Western|25|bake|vegetarian,balanced|broccoli,cheese,milk,garlic,black-pepper,salt
x136|Cá hồi nướng mè|Sesame baked salmon|dinner|Western|30|bake|high-protein|salmon,soy-sauce,broccoli,black-pepper,sesame,sesame-oil
x137|Gà nướng nghệ sữa chua|Turmeric yogurt chicken|dinner|Asian|40|bake|high-protein|chicken-thigh,turmeric,yogurt,garlic,lime,black-pepper
x138|Thịt viên sốt cà chua|Pork meatballs in tomato sauce|dinner|Western|35|braise|high-protein,meal-prep|minced-pork,tomato,egg,bread,garlic,black-pepper
x139|Đậu hũ sốt cam|Orange glazed tofu|dinner|Asian|25|pan|vegetarian|tofu,orange,soy-sauce,cornstarch,sesame-oil,scallion
x140|Trái cây sữa chua|Fresh fruit yogurt cup|snack|Vietnamese|8|no-cook|quick,vegetarian,light|banana,apple,orange,yogurt,oats,mango
`.trim().split(/\r?\n/).map((line) => {
    const [id, vi, en, mealType, cuisine, time, method, tagText, ingredientText] = line.split("|");
    return {id, vi, en, mealType, cuisine, time:Number(time), method, tags:tagText.split(","), ids:ingredientText.split(",")};
  });

  const methods = {
    pan:{gear:["stove"],photo:"chicken",vi:["Rửa sạch và sơ chế nguyên liệu; cắt phần cần thái, chuẩn bị gia vị.","Làm nóng chảo với ít dầu, cho hành/tỏi hoặc gia vị thơm vào đảo nhanh.","Nấu phần đạm đến khi chín kỹ, sau đó thêm rau củ theo độ cứng mềm.","Nêm vừa khẩu vị, đảo thêm vài phút cho các thành phần hòa quyện rồi dùng nóng."],en:["Wash and prepare the ingredients; cut items as needed and prepare seasonings.","Warm a little oil in a pan and briefly cook the aromatics.","Cook the protein through, then add vegetables from firmest to most tender.","Season to taste, toss for a few more minutes and serve hot."]},
    soup:{gear:["stove","pot"],photo:"soup",vi:["Rửa sạch và cắt nguyên liệu thành miếng vừa ăn; băm nhỏ gia vị thơm.","Đun sôi nước trong nồi; cho nguyên liệu cần thời gian chín lâu vào trước.","Thêm rau củ và gia vị, hạ lửa nấu đến khi mọi nguyên liệu chín mềm.","Nếm lại, điều chỉnh gia vị và dùng nóng; bảo đảm thịt/hải sản chín hoàn toàn."],en:["Wash and cut the ingredients into bite-size pieces; mince the aromatics.","Bring water to a boil and add ingredients that need the longest cooking first.","Add vegetables and seasonings, then simmer until everything is tender and cooked through.","Taste, adjust the seasoning and serve hot; make sure meat and seafood are fully cooked."]},
    braise:{gear:["stove","pot"],photo:"rice",vi:["Sơ chế nguyên liệu, cắt phần đạm thành miếng vừa ăn và ướp nhẹ với gia vị.","Áp chảo nguyên liệu chính với ít dầu cho săn mặt, sau đó thêm hành/tỏi.","Thêm nước vừa đủ cùng phần gia vị còn lại; đậy nắp và nấu liu riu đến khi mềm, chín kỹ.","Mở nắp, nếm và đun thêm cho nước sốt sánh vừa ý; dùng cùng cơm."],en:["Prepare ingredients, cut the protein into bite-size pieces and season lightly.","Sear the main ingredient in a little oil, then add the aromatics.","Add water and remaining seasonings; cover and simmer until tender and fully cooked.","Uncover, taste and reduce the sauce to your liking; serve with rice."]},
    curry:{gear:["stove","pot"],photo:"soup",vi:["Rửa và cắt nguyên liệu; chuẩn bị bột cà ri cùng phần rau củ cứng.","Phi thơm hành/tỏi và bột cà ri với ít dầu; cho thịt hoặc đậu hũ vào đảo đều.","Thêm nước cốt dừa và rau củ, nấu lửa nhỏ đến khi chín mềm và phần đạm chín kỹ.","Nêm lại vừa ăn, thêm nước nếu cần và dùng nóng với cơm hoặc bánh mì."],en:["Wash and cut the ingredients; prepare curry powder and firm vegetables.","Warm aromatics and curry powder in a little oil, then add meat or tofu.","Add coconut milk and vegetables; simmer until tender and the protein is fully cooked.","Adjust seasoning, add water if needed and serve with rice or bread."]},
    rice:{gear:["stove","rice-cooker"],photo:"rice",vi:["Vo và nấu cơm; trong lúc chờ, sơ chế rau củ và phần đạm.","Nấu phần đạm bằng chảo hoặc nồi đến khi chín hoàn toàn, nêm vừa ăn.","Chuẩn bị rau củ ăn kèm; có thể xào nhanh hoặc để tươi nếu phù hợp.","Xếp cơm, đạm và rau vào tô; rưới phần sốt trong chảo và dùng ngay."],en:["Rinse and cook the rice; prepare vegetables and protein while it cooks.","Cook the protein in a pan or pot until fully done and season to taste.","Prepare vegetables; stir-fry briefly or serve fresh when suitable.","Arrange rice, protein and vegetables in a bowl, spoon over pan sauce and serve."]},
    noodle:{gear:["stove","pot","pan"],photo:"noodles",vi:["Sơ chế nguyên liệu; luộc mì/bún theo hướng dẫn trên bao bì rồi để ráo.","Làm nóng chảo, nấu phần đạm đến khi chín kỹ rồi thêm rau củ.","Cho mì/bún và gia vị vào đảo đều, hoặc chan nước dùng tùy món.","Nếm lại, thêm hành/ngò và dùng nóng."],en:["Prepare ingredients; cook noodles according to the package, then drain.","Heat a pan, cook the protein through and add the vegetables.","Add noodles and seasonings, toss well, or ladle over broth as appropriate.","Taste, finish with herbs and serve hot."]},
    porridge:{gear:["stove","pot"],photo:"soup",vi:["Vo gạo hoặc chuẩn bị yến mạch; cắt nhỏ phần đạm và rau củ.","Cho gạo/yến mạch vào nồi cùng nước, nấu nhỏ lửa và khuấy định kỳ.","Thêm phần đạm, gừng hoặc rau củ; tiếp tục nấu đến khi chín hoàn toàn và mềm.","Nêm vừa ăn, rắc hành/ngò và dùng nóng; thêm nước nếu cháo đặc quá."],en:["Rinse rice or measure oats; cut protein and vegetables into small pieces.","Add the grain and water to a pot, simmer gently and stir occasionally.","Add protein, ginger or vegetables; cook until fully done and soft.","Season, finish with herbs and serve hot; add water if too thick."]},
    salad:{gear:["stove","no-cook"],photo:"salad",vi:["Rửa sạch và để ráo rau củ; cắt nguyên liệu thành miếng vừa ăn.","Nếu có thịt, cá hoặc trứng, nấu chín hoàn toàn rồi để nguội bớt.","Pha nước trộn từ chanh/giấm và gia vị; nếm thử trước khi rưới lên salad.","Trộn nhẹ các thành phần ngay trước khi ăn để rau giữ độ giòn."],en:["Wash and dry vegetables, then cut into bite-size pieces.","If using meat, fish or eggs, cook them through and let them cool slightly.","Mix a dressing from lime or vinegar and seasonings; taste before adding it.","Toss gently just before serving so vegetables stay crisp."]},
    "no-cook":{gear:["no-cook"],photo:"salad",vi:["Rửa sạch nguyên liệu cần ăn tươi và để ráo; dùng dao/thớt sạch.","Cắt hoặc xé nguyên liệu thành miếng vừa ăn; dùng thực phẩm đã nấu/chế biến sẵn.","Xếp các thành phần vào tô hoặc bánh mì, thêm sốt và gia vị theo khẩu vị.","Dùng ngay sau khi chuẩn bị; giữ lạnh thực phẩm cần thiết và không để lâu ngoài nhiệt độ phòng."],en:["Wash fresh ingredients and dry them; use a clean board and knife.","Slice or tear them into bite-size pieces and use ready-to-eat packaged foods.","Assemble in a bowl or sandwich, then add sauce and seasoning to taste.","Serve promptly; keep ingredients that need refrigeration cold and do not leave food out for long."]},
    bake:{gear:["oven"],photo:"chicken",vi:["Làm nóng lò ở khoảng 190°C; rửa sạch và cắt nguyên liệu đều nhau.","Trộn nguyên liệu với gia vị và ít dầu, xếp thành lớp trên khay.","Nướng đến khi rau củ mềm và phần thịt/cá chín hoàn toàn; trở mặt nếu cần.","Để nguội vài phút, nếm lại gia vị và dùng nóng."],en:["Preheat the oven to about 190°C; wash and cut ingredients evenly.","Toss with seasonings and a little oil, then spread on a tray.","Bake until vegetables are tender and meat or fish is fully cooked, turning once if needed.","Rest for a few minutes, adjust seasoning and serve warm."]},
    steam:{gear:["stove","pot"],photo:"soup",vi:["Sơ chế nguyên liệu và cắt phần đạm/rau củ thành miếng vừa ăn.","Đun sôi nước trong nồi hấp; xếp nguyên liệu vào đĩa chịu nhiệt, không chồng quá dày.","Hấp đến khi rau củ mềm và phần đạm chín hoàn toàn; kiểm tra phần dày nhất.","Rưới sốt hoặc gia vị sau khi hấp, nếm lại và dùng nóng."],en:["Prepare ingredients and cut proteins or vegetables into even pieces.","Bring water to a boil in a steamer; arrange items on a heat-safe plate without crowding.","Steam until vegetables are tender and proteins are fully cooked; check the thickest piece.","Add sauce or seasonings after steaming, taste and serve hot."]},
    boil:{gear:["stove","pot"],photo:"bowl",vi:["Rửa sạch, gọt/cắt nguyên liệu; đun sôi nước trong nồi.","Cho nguyên liệu cần lâu chín vào trước; thêm trứng hoặc rau đúng thời điểm.","Nấu đến khi khoai/rau mềm và trứng hoặc phần đạm chín theo ý muốn.","Vớt ra, nêm hoặc trộn sốt vừa ăn rồi dùng ngay."],en:["Wash, peel or cut ingredients and bring a pot of water to a boil.","Add items that take longer first; add eggs or greens at the right time.","Cook until vegetables are tender and eggs or proteins are done as desired.","Drain, season or toss with sauce and serve promptly."]}
  };
  methods.blend = {gear:["blender"],photo:"bowl",vi:["Rửa sạch, gọt vỏ và cắt trái cây thành miếng nhỏ.","Cho trái cây cùng sữa, sữa chua hoặc yến mạch vào máy xay.","Xay đến khi hỗn hợp mịn; thêm ít nước hoặc sữa nếu muốn loãng hơn.","Rót ra ly và dùng ngay; vệ sinh máy xay sau khi sử dụng."],en:["Wash, peel and cut the fruit into small pieces.","Add the fruit with milk, yogurt or oats to a blender.","Blend until smooth; add a little water or milk to thin it if desired.","Pour into a glass and serve promptly; clean the blender after use."]};
  methods.microwave = {gear:["microwave"],photo:"bowl",vi:["Cho yến mạch, sữa, chút nước và trứng đã đánh vào tô dùng được trong lò vi sóng; không đậy kín.","Quay 1 phút, lấy ra khuấy; tiếp tục quay từng đợt 30 giây đến khi yến mạch nóng và trứng chín hoàn toàn.","Để nguội bớt, nêm nhẹ rồi thêm hành lá và tiêu.","Dùng ngay; chỉ dùng đồ đựng phù hợp với lò vi sóng."],en:["Combine oats, milk, a splash of water and beaten egg in a microwave-safe bowl; do not seal it.","Microwave for 1 minute and stir; continue in 30-second bursts until hot and the egg is fully cooked.","Let it cool slightly, season lightly and add scallion and pepper.","Serve promptly and use only microwave-safe cookware."]};  const amountFor = (item) => {
    const id = item.id;
    if (["egg","duck-egg"].includes(id)) return [2,"quả"];
    if (id === "tofu") return [1,"bìa"];
    if (id === "tuna") return [0.5,"hộp"];
    if (id === "bread") return [1,"ổ"];
    if (["milk","coconut-milk"].includes(id)) return [80,"ml"];
    if (id === "yogurt") return [1,"hũ"];
    if (id === "cheese") return [2,"lát"];
    if (["rice","rice-noodle","instant-noodle","pasta","oats"].includes(id)) return [id === "pasta" || id === "oats" ? 100 : 150,"g"];
    if (item.category === "protein") return [200,"g"];
    if (["oil","sesame-oil","soy-sauce","fish-sauce","oyster-sauce","vinegar"].includes(id)) return [10,"ml"];
    if (["salt","sugar","curry-powder","turmeric","cornstarch","black-pepper","sesame","peanuts"].includes(id)) return [5,"g"];
    if (["scallion","garlic","ginger","lemongrass","shallot","basil","cilantro","mint","chili"].includes(id)) return [10,"g"];
    if (item.category === "fruit" && ["banana","orange","apple","lime","avocado","mango","papaya","pineapple"].includes(id)) return [1,item.unit];
    if (item.category === "seasoning") return [10,"g"];
    return [100,"g"];
  };
  const estimateCost = (items) => Math.max(5000, Math.round(items.reduce((sum, [id, amount, unit]) => {
    const item = ingredients.find((entry) => entry.id === id);
    if (!item) return sum;
    let part = item.price * 0.08;
    if (unit === "g" && item.unit === "kg") part = amount * item.price / 1000;
    else if (unit === "g" && item.unit === "g") part = amount * item.price;
    else if (unit === "g" && item.unit === "bó") part = amount * item.price / 100;
    else if (unit === "ml" && ["chai","hộp"].includes(item.unit)) part = amount * item.price / 500;
    else if (unit === item.unit) part = amount * item.price;
    else if (unit === "g") part = amount * item.price / 100;
    return sum + part;
  }, 0) / 500) * 500);
  const expanded = rows.map((row) => {
    const method = methods[row.method] || methods.pan;
    const items = row.ids.map((id) => {
      const item = ingredients.find((entry) => entry.id === id);
      return item ? [id, ...amountFor(item)] : null;
    }).filter(Boolean);
    const records = items.map(([id]) => ingredients.find((entry) => entry.id === id));
    const tags = new Set(row.tags);
    if (row.time <= 20) tags.add("quick");
    if (records.some((item) => item.category === "protein")) tags.add("high-protein");
    if (records.some((item) => item.category === "vegetable") && records.some((item) => item.category === "protein")) tags.add("balanced");
    if (["soup","salad","steam","no-cook"].includes(row.method)) tags.add("light");
    const allergens = [...new Set(records.flatMap((item) => item.allergens || []))];
    const photo = data.photos[method.photo] || data.photos.bowl;
    return {id:row.id,name:{vi:row.vi,en:row.en},mealType:row.mealType,time:row.time,cost:estimateCost(items),servings:2,photo,cuisine:row.cuisine,tags:[...tags],allergens,ingredients:items,equipment:method.gear,method:row.method,steps:{vi:method.vi,en:method.en}};
  });
  const allIngredients = new Map(ingredients.map((item) => [item.id,item]));
  expanded.forEach((recipe) => { recipe.allergens = [...new Set([...recipe.allergens,...recipe.ingredients.flatMap(([id]) => allIngredients.get(id)?.allergens || [])])]; });
  data.recipes.push(...expanded);
  data.recipes.forEach((recipe) => {
    const ingredientAllergens = recipe.ingredients.flatMap(([id]) => allIngredients.get(id)?.allergens || []);
    recipe.allergens = [...new Set([...(recipe.allergens || []), ...ingredientAllergens])];
    if (!recipe.equipment) recipe.equipment = recipe.tags.includes("no-cook") ? ["no-cook"] : ["stove"];
  });
})();