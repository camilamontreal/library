import re, json
EN = {
"k-next":"Next stop","k-st0":"Start of the line","k-sndoff":"Sound off","k-want":"Get it",
"st0":"Start of the line","h1":"New York, organized,","lede":"so you can enjoy more and plan less.",
"sup":"Camila Montreal's personal guide: a route by neighborhood, an interactive map and the tips of someone who has been countless times.",
"meet":"Meet the guide","seeprice":"See the price",
"st1":"Before boarding","hw":"What is this guide?",
"what1":"It's my personal New York guide, made for people who want to plan on their own without spending weeks researching.",
"what2":"Everything I would do and recommend to a friend: neighborhoods, timing, secrets few tourists know, where to eat, how to save and booking links. Use it on your computer to plan and on your phone during the trip.",
"f1":"places on the interactive map","f2":"movie and TV locations","f3":"stops in the 4-day base itinerary","f4":"extra ideas if you stay longer",
"tl":"Station announcement","tm0":"Visit Summit One Vanderbilt at the first time slot to avoid the crowds.","tnext":"Another one",
"st2":"Pick your line","hd":"See what the days look like",
"dlead":"The guide has a base itinerary and options for longer stays. Pick a day and peek inside.",
"d1":"Day 1","d2":"Day 2","d3":"Day 3","d4":"Day 4","d5":"More days",
"hoods":"Neighborhoods and areas the guide covers:",
"st3":"Inside the car","hg":"See inside the guide",
"st4":"Plan and travel","hf":"Two versions of the same guide",
"flead":"You get both files. The content is the same, only the format changes for each moment of the trip.",
"fd":"Desktop version","fdt":"To plan calmly on your computer with more time: see the days side by side, open the booking links and build your itinerary.",
"fm":"Mobile version","fmt":"To check during the trip: single column, easy to scroll with one hand and made for the small screen while you walk around the city.",
"fo":"Offline route and map","fot":"Download the PDF and open it without internet. Links, videos and the interactive map need a connection.",
"fnote":"Both files arrive together, in the same link, and you choose which one to open at each moment.",
"st5":"Times Sq–42 St","hi":"What's included?","ilead":"Tap each box to see what's inside.",
"b1":"Route by area","b1d":"Morning, afternoon and night, with optional stops marked, so you set your own pace.",
"b2":"Interactive map","b2d":"Over 200 places: restaurants, attractions, secrets and a tab just for free restrooms.",
"b3":"Secrets","b3d":"Places and tips few tourists know, with exact directions to find each one.",
"b4":"Where to eat","b4d":"Restaurants, cafés and sweets split by area, with what to order.",
"b5":"Photo guide","b5d":"Angles and times to photograph places like Times Square and the Brooklyn Bridge.",
"b6":"Discount links","b6d":"Booking links with discounts on tickets and tours.",
"b7":"Movie locations","b7d":"20 places from famous movies and series, with an address that opens in Google Maps.",
"b8":"Seasons","b8d":"Halloween, Thanksgiving, Black Friday and Christmas, with what to do in each.",
"b9":"Free updates","b9d":"Whenever I discover a new place, you get it in the same link, at no extra cost.",
"band1":"Get all the updates for free!","band2":"Whenever I discover a new place, you'll know.",
"st6":"Picture yourself here","hv":"Can you see yourself there?","vlead":"The places I show in the guide, the way I lived each one.",
"st7":"Grand Central–42 St","hc2":"What only someone who's been tells you","t0":"Secrets","t1":"Savings","t2":"Broadway","t3":"Movies",
"st8":"Service alert","hl":"Mistakes to avoid","lsub":"Six delays I've already been through, so you don't have to.",
"tag1":"Delay","tag2":"Detour","tag3":"Alert",
"a1h":"Airport train","a1":"I bought the wrong ticket, missed the right one and spent US$ 200 in the first hour. The guide tells you to check the exact ticket before boarding.",
"a2h":"Statue of Liberty","a2":"Without landing on the island, the Staten Island Ferry is free. The guide tells you how to get there and which side to sit on.",
"a3h":"Broadway tickets","a3":"The lottery gives you a chance at much cheaper tickets, and there are audio guides and Portuguese subtitles for several musicals.",
"a4h":"Pricey coffee","a4":"Before ordering, look for deals at the door. I paid US$ 2 instead of 4 just by asking.",
"a5h":"Ice skating","a5":"Prices for each rink, and which one has free entry: at Bryant Park you only pay for the skate rental.",
"a6h":"Public restrooms","a6":"Public restrooms are nearly impossible to find in New York. The interactive map has a tab just for free restrooms.",
"st9":"Rush hour","hr":"Packed car or empty car?",
"rlead":"Drag the time of day. On the left, someone with no plan. On the right, someone with the guide, which marks the best time for each stop.",
"hlabel":"Time of day","cA":"No plan","cB":"With the guide",
"rnote":"An illustration to play with, not real crowding data. In the guide, the timing tips are real, for example: Summit One Vanderbilt at the first slot and the Natural History Museum through the Gilder Center entrance at 10am.",
"st10":"Local or express","hcmp":"Loose tips, or a guide that goes straight there?",
"cmpa":"Loose tips help","ca1":"Each post covers one place","ca2":"You decide the order alone","ca3":"Hard to find again","ca4":"Everything looks unmissable","ca5":"Links scattered across social media",
"cmpb":"This guide saves time","cb1":"Route organized by area","cb2":"Morning, afternoon and night already suggested","cb3":"Clickable table of contents","cb4":"I mark what's optional and what I'd skip","cb5":"Booking links, map and videos in one place",
"cfoot":"You keep using social media. You just don't have to put it all together alone.",
"st11":"Central Park–59 St","ha":"Who is your guide?",
"ab1":"<b>Cami</b> is 30, has visited 27 countries and has lived in Canada for almost 3 years. She has lost count of how many times she's been to New York.",
"ab2":"Her love for new cultures and flavors makes Cami explore destinations to the fullest and plan every little detail of her trips. She has a degree in Marketing, a postgraduate degree in Competitive Intelligence and Marketing Innovation, and has over <b>600 thousand followers</b> online.",
"wantg":"Get the guide","st12":"Fulton St","wy":"Board here if","wn":"Maybe not your line if",
"wy1":"You're planning a trip to New York and want a ready route to adapt.","wy2":"You prefer everything organized in one place.","wy3":"You want practical tips, with times, addresses and prices.","wy4":"You want a guide with opinions, not a neutral list.",
"wn1":"You prefer to improvise everything and don't like itineraries.","wn2":"You're looking for a guide focused on shopping or nightlife. The guide covers both, but the focus is sightseeing and experiences.","wn3":"You expect one-on-one service. The guide is a digital product.",
"st13":"Turnstile","hp":"Swipe your MetroCard","doors":"Stand clear of the closing doors, please.",
"mc1":"New York · the guide","mc2":"desktop + mobile PDF","scr0":"Swipe your card",
"inc":"You get a link with the desktop and mobile versions of the PDF, the interactive map, free updates and a refund within 7 days.",
"lg":"You're viewing the site in English: price in dollars and checkout in English. To see it in Portuguese, use the PT button at the top.",
"buy":"Swipe the card",
"st14":"Atlantic Av–Barclays Ctr","hq":"Frequently asked questions",
"q1":"When do I get access to the guide?","r1":"As soon as the payment is confirmed, you receive an email with the link to the interactive PDF, with a desktop version and a mobile version.",
"q2":"What's the difference between the desktop and mobile versions?","r2":"The content is the same. The desktop version is for planning calmly on your computer; the mobile version has a single column to check during the trip. You get both.",
"q3":"Do I have to stay exactly 4 days?","r3":"No. The guide has a 4-day base itinerary, but each day is independent and organized by area. If you stay less, pick the days that suit you; if you stay longer, there are extra ideas like day trips and different outings.",
"q4":"Does it work if I only speak Portuguese?","r4":"Yes! The guide is entirely in Portuguese and has many tips for people who've never been, including cultural tips, plus tips for watching musicals in Portuguese. There is also an English version.",
"q5":"Do I need internet during the trip to open the guide?","r5":"No! Both the route and the map can be accessed offline. One less thing to worry about during the trip.",
"q6":"Aren't 16 stops in one day too many?","r6":"It's a menu organized by area, not an obligation. Some stops are marked optional and many are just a quick pass or a photo. You choose the pace.",
"q7":"Are prices and times up to date?","r7":"Prices and times in New York change. The guide gets free updates through the same link, and I recommend checking the official website before buying tickets.",
"q8":"What are the discount links?","r8":"They are booking links for tours, tickets and services with my coupon. Some partners pay me a commission when you book through the link, at no extra cost to you.",
"q9":"What if I don't like it?","r9":"You can ask for a refund within 7 days. Write to the contact in the footer of the page.",
"q10":"Are there guides for other destinations?","r10":"Yes! You can see all my guides on my social media.",
"st15":"Hudson Yards · end of the 7 line","hz":"Ready to see the best of NY?","hpf":"Who already used the guide","pflead":"Real reviews from people who traveled with it.","pfnote":"Reviews sent by customers, published with permission. Shown in the original Portuguese.","heli":"Tap a building!","kk":"Tap a building!",
"zt":"You've already picked the destination. All that's left is how to get there: with 30 tabs open or with a guide in hand.","zb":"Get it",
"ft1":"Terms of use","ft2":"Privacy","ft3":"Contact",
"fine1":"Prices, times and tour availability change. Check the official websites before booking. Some booking links may earn me a commission, at no extra cost to you.","fine2":"tip: there are critters loose in the subway, tap them.",
}
EXTRA_PT={}

EN.update({
"h1":"The perfect New York guide","lede":"a complete itinerary, adapted to however many days you have.",
"sup":"Neighborhoods, timing, secrets and booking links the way I would do it, organized so you can plan without spending weeks researching.",
"what1":"It's my personal New York guide: a complete itinerary that adapts to however many days you have, so you can plan on your own without spending weeks researching.",
"f3":"stops organized by area","f4":"extra ideas for any trip length",
"tl":"Inside the guide","tnext":"One more","tm0":"There's a secret hidden in one of the city's most famous stations.",
"hd":"Where do you want to start?","dlead":"It doesn't matter how many days you have: the guide is organized by area, so there's always something to do. Pick one and peek inside.",
"d1":"Midtown","d2":"Central Park","d3":"Downtown & Brooklyn","d4":"Hudson Yards","d5":"Beyond the city",
"ptipk":"In the guide: timing, secrets and booking links for every stop.",
"hg":"A peek inside","glead":"Clickable contents, map, videos and booking links in the same file. Here's just a taste.",
"pg1":"Clickable contents","pg2":"Where to eat","pg3":"Movie locations",
"ilead":"Tap each box to see what comes in the guide.",
"hl":"Mistakes I've already made","lsub":"Each one has a solution in the guide.",
"a1h":"From the airport to the city","a1":"A wrong ticket cost me US$ 200 in the first hour. In the guide, I show which one to choose.",
"a2h":"Famous tours","a2":"Not every famous tour has to be expensive. The guide shows the alternatives and the step by step.",
"a3h":"Broadway tickets","a3":"There's a way to try paying less, with subtitle options in Portuguese.",
"a4h":"Coffee and food","a4":"Where it's worth it, where it isn't and how not to pay more than you need to.",
"a5h":"Winter activities","a5":"Prices, options and which one is worth it most.",
"a6h":"Restrooms and mishaps","a6":"Finding a restroom in Manhattan is hard. The guide's map solves it.",
"hr":"Save time and skip the lines","rlead":"Without a plan, you show up at the wrong time, stand in line and lose hours of your day. With the guide, every stop has its best time. Drag the hour and see the difference in the car.",
"cA":"No plan: lines and a packed car","cB":"With the guide: the right time",
"rnote":"An illustration to play with, not real crowding data. In the guide, the timing tips are real, for each stop.",
"hcmp":"Stop saving reels. Start planning.","cmpa":"The way almost everyone plans",
"ca1":"You save dozens of reels and posts on Instagram","ca2":"You jot down loose links and tips in several places","ca3":"You lose hours deciding the order of places","ca4":"You get there without knowing what to prioritize","ca5":"In the end, you don't know where to start",
"cmpb":"With the guide","cb1":"Everything organized by area, in a single file","cb2":"You already know what to do in the morning, afternoon and night","cb3":"You know what's optional and what I'd skip","cb4":"Booking links, map and videos in one place","cb5":"You start the trip knowing exactly where to go",
"cfoot":"Keep using social media for inspiration. The guide organizes it all for you.",
"ab2":"Her love for new cultures and flavors makes Cami explore destinations to the fullest and plan every little detail of her trips. She has a degree in Marketing and a postgraduate degree in Competitive Intelligence and Marketing Innovation.",
"as1":"countries visited","as2":"followers online","as3":"where I've lived for almost 3 years",
"hp":"Get your guide","plead":"Less time planning, more time in New York.","buy":"Buy the guide",
"q3":"Do I have to stay an exact number of days?","r3":"No. The guide is organized by area, so you build the itinerary for however many days you have. If you stay less, pick the areas that suit you; if you stay longer, there are extra ideas like day trips and different outings.",
"t0":"Secrets","t1":"Savings","t2":"Broadway","t3":"Movies"
})
for _k,_v in {"st0":"Início","st1":"O guia","st2":"Roteiro por região","st3":"Por dentro do guia","st4":"Desktop e celular","st5":"O que está incluso","st6":"Inspiração","st7":"Segredos","st8":"Economize","st9":"Tempo e filas","st10":"Organização","st11":"Quem é a Camila","st12":"Para quem é","st13":"Comprar","st14":"Dúvidas","st15":"Embarque","st10b":"Depoimentos","st0b":"Quem já usou"}.items(): EXTRA_PT[_k]=_v
EN.update({"st0":"Start","st1":"The guide","st2":"Route by area","st3":"Inside the guide","st4":"Desktop and mobile","st5":"What's included","st6":"Inspiration","st7":"Secrets","st8":"Save money","st9":"Time and lines","st10":"Organization","st11":"Meet Camila","st12":"Who it's for","st13":"Buy","st14":"Questions","st15":"All aboard","st10b":"Reviews"})

EN.update({
"what1":"It's my personal New York guide: a complete itinerary that adapts to your trip, without months of research.",
"what2":"Everything I would do and recommend to a friend: neighborhoods, timing, secrets, where to eat and discount links. On your computer to plan, on your phone during the trip.",
"tnext":"More tips","ptipk":"In the guide: the best stops, photo spots, timing and discount links.",
"glead":"A taste of what's in the file. Tap to flip through.","vhint":"The rest is in the guide",
"flead":"You get both files, with the same content.","fdt":"To plan calmly, on your computer.","fmt":"To check during the trip, with one hand.","fo":"Offline","fot":"Download the PDF and use it without internet.",
"ilead":"Tap a building to see what comes in the guide.",
"band1":"Free updates","band2":"Whenever I discover a new place, you'll know.",
"a1":"The wrong ticket gets expensive.","a2":"Not every tour has to be expensive.","a3":"You can pay less.","a4":"Where it's worth it and where it isn't.","a5":"Which one is worth it.","a6":"Finding a restroom is hard.",
"hr":"Save time and <em>skip the lines</em>","rlead":"Without a plan, you stand in line and lose hours. With the guide, every stop has its best time. Drag the hour and see the difference in the car.",
"hcmp":"Stop saving reels. <em>Start planning.</em>","cmpa":"The way almost everyone plans","cb4":"Interactive map and tutorial videos so you don't get lost",
"ab1":"<b>Cami</b> is 32, has visited 38 countries and has lived in Canada for 4 years. She has lost count of how many times she's been to New York.",
"ab2":"Her love for new cultures and flavors makes Cami explore destinations to the fullest and plan every little detail of her trips. She has a degree in Marketing, a postgraduate degree in Competitive Intelligence and Marketing Innovation, also leads travel groups around the world and loves sharing experiences!",
"as3":"living in Canada","as4":"been countless times",
"wn1":"You prefer to improvise everything and don't want an adaptable itinerary.","wn2":"You want to spend hours planning and revisiting the reels you saved on Instagram.",
"g1":"Desktop and mobile PDF","g2":"Interactive map with +200 places","g3":"Free updates, whenever I discover a new place","g4":"7-day guarantee",
"pk":"Complete New York guide","gar":"If you don't like it, ask for a refund within 7 days.","inc":"You get the link by email, with the desktop and mobile versions of the PDF.",
"r10":"Yes! You can see all my guides on my website: <a href=\"https://camilamontreal.com/ebooks\" target=\"_blank\" rel=\"noopener\">camilamontreal.com/ebooks</a>.",
"zt":"You've already picked the destination. All that's left is how to get there: with 30 tabs open or with a guide in hand.","buy":"Buy the guide"
})

EN.update({
"st0b":"Reviews","hv":"Can you see yourself there?",
"eh":"Travelers from all over Brazil have used the guide",
"hco":"What does it cost not to plan?","colead":"Planning takes little time. Improvising in New York usually costs money and hours.",
"sty1":"Street sign","sty2":"Subway sign","coend":"In the guide, all of this comes already solved.",
"cs1h":"Wrong ticket","cs1":"I paid US$ 200 in the first hour.","cs2h":"Line at the wrong time","cs2":"Hours of your day lost standing.",
"cs3h":"Pricier tour","cs3":"Paying for something that had an alternative.","cs4h":"Day with no route","cs4":"Back and forth across the city, with no order.",
"as4":"lost count of how many visits","mc2":"desktop + mobile PDF"
})

EN.update({"gar":"7-day guarantee.","lg":"Showing the site in English: price in dollars and English checkout. To switch, use the PT button.","as3":"living in Montreal, Canada","band1":"New place? It lands in your guide, free.","cs1":"I paid US$ 200 on my first trip.","ptipk":"In the guide, you find the best stops, photo spots, timing and discount links.","mc2":"desktop + mobile PDF"})

EN.update({"colead":"Improvising in New York usually costs money and hours.","cs1":"I wasted US$ 200 on my first trip.","ab2":"Her love for new cultures and flavors makes Cami explore destinations to the fullest and plan every little detail of her trips. She also leads travel groups around the world and loves sharing experiences!"})
EN.update({"bbuy":"Buy","help":"Questions? Message me on Instagram"})
tpl=open('index.tpl.html',encoding='utf-8').read()
PT={}
def rep(m):
    k,t=m.group(1),m.group(2); PT[k]=t
    return '<span data-k="%s">%s</span>'%(k,t)
PT['buy']='Comprar o guia'
html=re.sub(r'\{\{([\w-]+)\|(.*?)\}\}',rep,tpl,flags=re.S)
PT.update(EXTRA_PT)
EN={k:v for k,v in EN.items() if k in PT}
missing=[k for k in PT if k not in EN]
extra=[k for k in EN if k not in PT]
print('missing EN:',missing,'unused EN:',extra)
open('index.html','w',encoding='utf-8').write(html.replace('<script src="app.js"></script>','<script>window.TXT='+json.dumps({"pt":PT,"en":EN},ensure_ascii=False)+';</script>\n<script src="app.js"></script>'))
print(len(html)//1024,'KB')
