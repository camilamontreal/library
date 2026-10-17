import re, json
EN = {
"k-next":"You are in","tag":"Travel guide · Paris",
"h1":"Paris through my eyes","lede":"the itinerary I would do again.",
"sub":"An itinerary by area, for however many days you have, with the places, tips and links I recommend the most.",
"want":"Get the Paris guide","seein":"See what's inside",
"micro":"Secure payment · Access by email right after confirmation · 7-day guarantee",
"hw":"What is this guide?",
"what1":"It's Paris through my eyes and my experiences, in an itinerary that adapts to your trip.",
"what2":"It's more than an itinerary: it has the Emily in Paris filming locations, tours to book with a discount, where to eat well and cheap, the best neighborhoods to stay in, transport and safety, thrift shops, photo tips and free things to do. You don't have to follow it all: pick one area, a few days, or build your own.",
"ft-a":"Emily in Paris","f1":"filming locations, with addresses",
"ft-b":"Where to stay","f2":"neighborhoods compared",
"ft-c":"Safety","f3":"common scams and how to react",
"ft-d":"Eat well and cheap","f4":"bouillons, set menus, viral sweets",
"tl":"Inside the guide","tm0":"There's a way to get inside the Eiffel Tower grounds without a ticket.","tnext":"More tips",
"hd":"Where do you want to start?",
"dlead":"It doesn't matter how many days you have: the guide is organized by area, so there's always something to do. Pick one and peek inside.",
"d1":"Eiffel Tower","d2":"Louvre & Notre-Dame","d3":"Emily in Paris","d4":"Versailles","d5":"Champs-Élysées","d6":"Montmartre",
"ptipk":"In the guide, you find the best stops, photo spots and discount links.",
"hg":"A peek inside","glead":"A taste of what's in the file. Tap to flip through.","vhint":"The rest is in the guide",
"hf":"Two versions of the same guide","flead":"You get both files, with the same content.",
"fd":"Desktop version","fdt":"To plan calmly, on your computer.","fm":"Mobile version","fmt":"To check during the trip, with one hand.",
"fo":"Offline","fot":"Download the PDF and use it without internet.",
"hi":"What's included?","ilead":"Tap a rooftop to see what comes in the guide.","kk":"Tap a rooftop!",
"b1":"Route by area","b1d":"Each area with stops and tips, so you set your own pace.",
"b2":"Interactive map","b2d":"All the places in the itinerary on a map you can open on your phone.",
"b3":"Emily in Paris","b3d":"Filming locations, with an address that opens in Google Maps.",
"b4":"Where to stay","b4d":"The best neighborhoods compared, so you choose where to sleep.",
"b5":"Safety and scams","b5d":"What to do when someone approaches you and which scams are common.",
"b6":"Eat well and cheap","b6d":"Bouillons, set menus, markets and the sweets that went viral.",
"b7":"Thrift and shops","b7d":"A thrift route, Sunday markets, outlets and souvenirs.",
"b8":"Looks and photos","b8d":"Spots to photograph the Eiffel Tower without people behind you, and the looks I wore.",
"b9":"Discount links","b9d":"Booking links with discounts on tours, SIM card, insurance and currency.",
"band1":"New place? It lands in your guide, free.","band2":"Whenever I discover a new place, you'll know.",
"hv":"Can you see yourself there?","vlead":"The places I show in the guide, the way I lived each one.",
"hco":"What does it cost not to plan?","colead":"Improvising in Paris can cost money and hours.",
"cs1h":"Ring scam","cs1":"Someone says you dropped an expensive ring. The guide shows how to react.",
"cs2h":"Pyramid line","cs2":"At the Louvre, the main entrance line can run past 1 hour.",
"cs3h":"Wrong ticket","cs3":"Not every metro ticket is valid for the airport.",
"cs4h":"Tourist restaurant","cs4":"How to choose a good restaurant without falling into a trap.",
"coend":"In the guide, all of this comes already solved.",
"hcmp":"Stop saving reels. <em>Start planning.</em>","cmpa":"The way almost everyone plans",
"ca1":"You save dozens of reels and posts on Instagram","ca2":"You jot down loose links and tips in several places","ca3":"You lose hours deciding the order of places","ca4":"You get there without knowing what to prioritize","ca5":"In the end, you don't know where to start",
"cmpb":"With the guide","cb1":"Everything organized by area, in a single file","cb2":"You already know where to stay, how to get around and what to prioritize","cb3":"You know what's worth it and what I'd skip","cb4":"An interactive map and my reels at several places so you don't get lost","cb5":"You start the trip knowing exactly where to go",
"ha":"Who is your guide?",
"ab1":"<b>Cami</b> is 32, has visited 38 countries and has lived in Canada for 4 years. She goes to Paris often.",
"ab2":"Her love for new cultures and flavors makes Cami explore destinations to the fullest and plan every little detail of her trips. She also leads travel groups around the world and loves sharing experiences!",
"as1":"countries visited","as2":"followers online","as3":"living in Montreal, Canada","as4":"I go often",
"wantg":"Get the Paris guide",
"wy":"Board here if","wn":"Maybe not your line if",
"wy1":"You're planning a trip to Paris and want a ready route to adapt.","wy2":"You prefer everything organized in one place.","wy3":"You want practical tips, with addresses and the opinion of someone who goes often.","wy4":"You want a guide with opinions, not a neutral list.",
"wn1":"You prefer to improvise everything and don't want an adaptable itinerary.","wn2":"You only want shopping or nightlife. The guide covers both, but the focus is sightseeing and experiences.","wn3":"You expect one-on-one service. The guide is a digital product.","wn4":"You want to book a hotel through the guide. It compares neighborhoods but doesn't sell lodging.",
"hp":"Get your guide","plead":"Less time planning, more time in Paris.",
"g1":"Desktop and mobile PDF","g2":"Interactive map with the places in the itinerary","g3":"Free updates, whenever I discover a new place","g4":"7-day guarantee",
"mc1":"Paris · the guide","pk":"Complete Paris guide","gar":"7-day guarantee.",
"inc":"You get the link by email, with the desktop and mobile versions of the PDF. Coupon CAMILAMONTREAL5 on the guide's tours.",
"lg":"Showing the site in English: price in Canadian dollars and English checkout. To switch, use the PT button.",
"help":"Questions? Message me on Instagram","buy":"Buy the guide",
"hq":"Frequently asked questions",
"q1":"Is the guide a PDF? How do I access it?","r1":"As soon as the payment is confirmed, you get an email with the link to the interactive PDF, with a desktop version and a mobile version, with clickable contents, buttons, reels and an interactive map.",
"q2":"How many days is it for?","r2":"As many as you have. The itinerary is organized by area and each area works on its own: if you stay fewer days, pick the ones you like; if you stay longer, there are ideas like Versailles, Giverny and Disney.",
"q3":"Does it work if I only have a few hours in Paris?","r3":"Yes. There's a tip for long layovers: how to leave the airport, see the essentials and get back in time, with my own 4-hour day in Paris.",
"q4":"Are prices and times up to date?","r4":"Prices and times in Paris change. The guide points to the official websites to check before booking and gets free updates through the same link.",
"q5":"What are the discount links?","r5":"They are booking links for tours, SIM card, insurance and currency with my coupon. Some partners pay me a commission when you book through the link, at no extra cost to you.",
"q6":"Do I need to speak French?","r6":"No. The guide is entirely in Portuguese and has three phrases to order like a local and etiquette tips, like starting every conversation with “bonjour”.",
"q7":"Does it work on my phone? And without internet?","r7":"Yes. There's a version made for the phone screen, and you can download the PDF and open it without internet. Links and videos need a connection.",
"q8":"Is it good for traveling with kids?","r8":"The guide isn't focused on children, but it has a section with ideas, like the Luxembourg Garden, the Cité des Sciences and going up the Eiffel Tower.",
"q9":"Does it include lodging?","r9":"The guide compares the best neighborhoods to stay in, so you can choose, but it doesn't book hotels.",
"q10":"What if I don't like it?","r10":"You can ask for a refund within 7 days. Write to the contact in the footer of the page.",
"q11":"Is there a Disneyland Paris guide?","r11":"There's a separate e-book with Disney tips only: <a href=\"https://www.camilamontreal.com/ebooks\" target=\"_blank\" rel=\"noopener\">camilamontreal.com/ebooks</a>.",
"q12":"Are there guides for other destinations?","r12":"Yes! You can see all my guides on my website: <a href=\"https://www.camilamontreal.com/ebooks\" target=\"_blank\" rel=\"noopener\">camilamontreal.com/ebooks</a>.",
"hz":"Ready to organize your trip to Paris?","zt":"You've already picked the destination. All that's left is how to get there: with 30 tabs open or with a guide in hand.","zb":"Get the Paris guide",
"ebk":"Going to Disneyland Paris? I have an e-book with Disney tips only.",
"bfree":"Available","bbuy":"Get the guide",
"ft1":"Terms of use","ft2":"Privacy","ft3":"Contact",
"fine1":"Prices, times and tour availability change. Check the official websites before booking. Some booking links may earn me a commission, at no extra cost to you.",
"fine2":"tip: there are critters loose on the sidewalk, tap them.",
"st0":"Start","st1":"The guide","st2":"Pick an area","st3":"Inside the guide","st4":"Desktop and mobile","st5":"What's included","st6":"Inspiration","st8":"Save money","st10":"Organization","st11":"Meet Camila","st12":"Who it's for","st13":"Buy","st14":"Questions","st15":"All aboard",
}

EN.update({
"hc1":"Trocadéro","hc2":"Eiffel Tower at night","hc3":"Louvre","vdrag":"Drag the photos.",
"vc1":"Eiffel Tower at night","vc2":"Louvre pyramid","vc3":"Versailles","vc4":"Arc de Triomphe","vc5":"Crêpe on the sidewalk","vc6":"Trocadéro","vc7":"By the Seine","vc8":"Palais-Royal","vc9":"Ladurée","vc10":"Raspberry tart","vc11":"Boulangerie","vc12":"A Parisian door",
"menut":"Menu of the day","mapnote":"Tap a number to see the area.","ilead":"Tap a window to open it and see what comes in the guide.",
"fine2":"tip: there's a pigeon loose on the sidewalk, tap it.",
})
EXTRA_PT = {"st0":"Início","st1":"O guia","st2":"Roteiro por região","st3":"Por dentro do guia","st4":"Desktop e celular","st5":"O que está incluso","st6":"Inspiração","st8":"Economize","st10":"Organização","st11":"Quem é a Camila","st12":"Para quem é","st13":"Comprar","st14":"Dúvidas","st15":"Embarque"}
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
