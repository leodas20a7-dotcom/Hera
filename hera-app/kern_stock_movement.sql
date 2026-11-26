-- ============================================================================
-- KERN LOGISTICS: 86 Past Inward Records + 85 Outward Delivery Notes
-- Source: Stock_movement_analysis (1).xlsx (Yellow existing 11,922 untouched)
-- ============================================================================

-- 1. Insert 86 Past Inward Records (70,889 qty) into inward_requests (ACCEPTED)
INSERT INTO inward_requests
  (logistics_id, inward_no, grn_no, wh_location, client_name, product, category, brand, variety, qty, unit, weight_kg, vehicle_no, driver_phone, expected_date, doc_no, remarks, status)
VALUES
  ('kern', 'INW-GRN/0002094/26-27-R3', 'GRN/0002094/26-27', 'PAST-INWARD', 'LORDS AND KINGS ENTERPRISES', 'Apple- Himachal', 'Cold Storage', 'HIMACHAL APPLE', 'APPLE- HIMACHAL', 283, 'BOX', 5660, '', '', '12-Sep-2026', '471', 'Supplier: Kanikho Farmer Producer Company Limited | Lot: 471', 'ACCEPTED'),
  ('kern', 'INW-GRN/0002095/26-27-R4', 'GRN/0002095/26-27', 'PAST-INWARD', 'LORDS AND KINGS ENTERPRISES', 'Apple- Himachal', 'Cold Storage', 'HIMACHAL APPLE', 'APPLE- HIMACHAL', 1160, 'BOX', 23200, '', '', '12-Sep-2026', '473', 'Supplier: Kanikho Farmer Producer Company Limited | Lot: 473', 'ACCEPTED'),
  ('kern', 'INW-GRN/0002097/26-27-R5', 'GRN/0002097/26-27', 'PAST-INWARD', 'LORDS AND KINGS ENTERPRISES', 'Apple- Himachal', 'Cold Storage', 'HIMACHAL APPLE', 'APPLE- HIMACHAL', 1160, 'BOX', 23200, '', '', '15-Sep-2026', '474', 'Supplier: Kanikho Farmer Producer Company Limited | Lot: 474', 'ACCEPTED'),
  ('kern', 'INW-GRN/0002096/26-27-R6', 'GRN/0002096/26-27', 'PAST-INWARD', 'LORDS AND KINGS ENTERPRISES', 'Apple- Himachal', 'Cold Storage', 'HIMACHAL APPLE', 'APPLE- HIMACHAL', 1160, 'BOX', 23200, '', '', '15-Sep-2026', '463', 'Supplier: Naresh Fruit Co | Lot: 463', 'ACCEPTED'),
  ('kern', 'INW-GRN/0002101/26-27-R7', 'GRN/0002101/26-27', 'PAST-INWARD', 'LORDS AND KINGS ENTERPRISES', 'Apple- Himachal', 'Cold Storage', 'HIMACHAL APPLE', 'APPLE- HIMACHAL', 1160, 'BOX', 23200, '', '', '18-Sep-2026', '472', 'Supplier: Kanikho Farmer Producer Company Limited | Lot: 472', 'ACCEPTED'),
  ('kern', 'INW-GRN/0002100/26-27-R8', 'GRN/0002100/26-27', 'PAST-INWARD', 'LORDS AND KINGS ENTERPRISES', 'Apple- Himachal', 'Cold Storage', 'HIMACHAL APPLE', 'APPLE- HIMACHAL', 1664, 'BOX', 33280, '', '', '18-Sep-2026', '464', 'Supplier: Naresh Fruit Co | Lot: 464', 'ACCEPTED'),
  ('kern', 'INW-GRN/0002103/26-27-R9', 'GRN/0002103/26-27', 'PAST-INWARD', 'LORDS AND KINGS ENTERPRISES', 'Apple- Himachal', 'Cold Storage', 'HIMACHAL APPLE', 'APPLE- HIMACHAL', 317, 'BOX', 6340, '', '', '19-Sep-2026', '458', 'Supplier: Kanikho Farmer Producer Company Limited | Lot: 458', 'ACCEPTED'),
  ('kern', 'INW-GRN/0002106/26-27-R10', 'GRN/0002106/26-27', 'PAST-INWARD', 'LORDS AND KINGS ENTERPRISES', 'Apple- Himachal', 'Cold Storage', 'HIMACHAL APPLE', 'APPLE- HIMACHAL', 424, 'BOX', 8480, '', '', '20-Sep-2026', '485', 'Supplier: Naresh Fruit Co | Lot: 485', 'ACCEPTED'),
  ('kern', 'INW-GRN/0002104/26-27-R11', 'GRN/0002104/26-27', 'PAST-INWARD', 'LORDS AND KINGS ENTERPRISES', 'Apple- Himachal', 'Cold Storage', 'HIMACHAL APPLE', 'APPLE- HIMACHAL', 1182, 'BOX', 23640, '', '', '20-Sep-2026', '431', 'Supplier: SP Enterprises | Lot: 431', 'ACCEPTED'),
  ('kern', 'INW-GRN/0002107/26-27-R12', 'GRN/0002107/26-27', 'PAST-INWARD', 'LORDS AND KINGS ENTERPRISES', 'Apple- Himachal', 'Cold Storage', 'HIMACHAL APPLE', 'APPLE- HIMACHAL', 1160, 'BOX', 23200, '', '', '21-Sep-2026', '432', 'Supplier: S R Fruits | Lot: 432', 'ACCEPTED'),
  ('kern', 'INW-GRN/0002108/26-27-R13', 'GRN/0002108/26-27', 'PAST-INWARD', 'LORDS AND KINGS ENTERPRISES', 'Apple- Himachal', 'Cold Storage', 'HIMACHAL APPLE', 'APPLE- HIMACHAL', 1217, 'BOX', 24340, '', '', '22-Sep-2026', '433', 'Supplier: S R Fruits | Lot: 433', 'ACCEPTED'),
  ('kern', 'INW-GRN/0002112/26-27-R14', 'GRN/0002112/26-27', 'PAST-INWARD', 'LORDS AND KINGS ENTERPRISES', 'Apple- Himachal', 'Cold Storage', 'HIMACHAL APPLE', 'APPLE- HIMACHAL', 1027, 'BOX', 20540, '', '', '23-Sep-2026', '434', 'Supplier: SR and Sons | Lot: 434', 'ACCEPTED'),
  ('kern', 'INW-GRN/0002119/26-27-R16', 'GRN/0002119/26-27', 'PAST-INWARD', 'LORDS AND KINGS ENTERPRISES', 'Apple- Himachal', 'Cold Storage', 'HIMACHAL APPLE', 'APPLE- HIMACHAL', 1160, 'BOX', 23200, '', '', '01-Oct-2026', '551', 'Supplier: Kanikho Farmer Producer Company Limited | Lot: 551', 'ACCEPTED'),
  ('kern', 'INW-GRN/0002117/26-27-R17', 'GRN/0002117/26-27', 'PAST-INWARD', 'LORDS AND KINGS ENTERPRISES', 'Apple- Himachal', 'Cold Storage', 'HIMACHAL APPLE', 'APPLE- HIMACHAL', 1160, 'BOX', 23200, '', '', '01-Oct-2026', '519', 'Supplier: Naresh Fruit Co | Lot: 519', 'ACCEPTED'),
  ('kern', 'INW-GRN/0002118/26-27-R18', 'GRN/0002118/26-27', 'PAST-INWARD', 'LORDS AND KINGS ENTERPRISES', 'Apple- Himachal', 'Cold Storage', 'HIMACHAL APPLE', 'APPLE- HIMACHAL', 203, 'BOX', 4060, '', '', '01-Oct-2026', '538', 'Supplier: SP Enterprises | Lot: 538', 'ACCEPTED'),
  ('kern', 'INW-GRN/0002122/26-27-R22', 'GRN/0002122/26-27', 'PAST-INWARD', 'LORDS AND KINGS ENTERPRISES', 'Apple- Himachal', 'Cold Storage', 'HIMACHAL APPLE', 'APPLE- HIMACHAL', 300, 'BOX', 6000, '', '', '03-Oct-2026', '496', 'Supplier: ESB Fruits | Lot: 496', 'ACCEPTED'),
  ('kern', 'INW-GRN/0002125/26-27-R23', 'GRN/0002125/26-27', 'PAST-INWARD', 'LORDS AND KINGS ENTERPRISES', 'Apple- Himachal', 'Cold Storage', 'HIMACHAL APPLE', 'APPLE- HIMACHAL', 1160, 'BOX', 23200, '', '', '03-Oct-2026', '553', 'Supplier: Kanikho Farmer Producer Company Limited | Lot: 553', 'ACCEPTED'),
  ('kern', 'INW-GRN/0002123/26-27-R24', 'GRN/0002123/26-27', 'PAST-INWARD', 'LORDS AND KINGS ENTERPRISES', 'Apple- Himachal', 'Cold Storage', 'HIMACHAL APPLE', 'APPLE- HIMACHAL', 1160, 'BOX', 23200, '', '', '03-Oct-2026', '520', 'Supplier: Naresh Fruit Co | Lot: 520', 'ACCEPTED'),
  ('kern', 'INW-GRN/0002126/26-27-R26', 'GRN/0002126/26-27', 'PAST-INWARD', 'LORDS AND KINGS ENTERPRISES', 'Apple- Himachal', 'Cold Storage', 'HIMACHAL APPLE', 'APPLE- HIMACHAL', 1310, 'BOX', 26200, '', '', '04-Oct-2026', '516', 'Supplier: Suriyaa Narayanaa Enterprises | Lot: 516', 'ACCEPTED'),
  ('kern', 'INW-GRN/0002134/26-27-R33', 'GRN/0002134/26-27', 'PAST-INWARD', 'LORDS AND KINGS ENTERPRISES', 'Apple- Himachal', 'Cold Storage', 'HIMACHAL APPLE', 'APPLE- HIMACHAL', 1160, 'BOX', 23200, '', '', '08-Oct-2026', '567', 'Supplier: Kanikho Farmer Producer Company Limited | Lot: 567', 'ACCEPTED'),
  ('kern', 'INW-GRN/0002132/26-27-R34', 'GRN/0002132/26-27', 'PAST-INWARD', 'LORDS AND KINGS ENTERPRISES', 'Apple- Himachal', 'Cold Storage', 'HIMACHAL APPLE', 'APPLE- HIMACHAL', 40, 'BOX', 800, '', '', '08-Oct-2026', '500', 'Supplier: Kondaiya Potdurthi | Lot: 500', 'ACCEPTED'),
  ('kern', 'INW-GRN/0002139/26-27-R38', 'GRN/0002139/26-27', 'PAST-INWARD', 'LORDS AND KINGS ENTERPRISES', 'Apple- Himachal', 'Cold Storage', 'HIMACHAL APPLE', 'APPLE- HIMACHAL', 1660, 'BOX', 33200, '', '', '10-Oct-2026', '569', 'Supplier: Kanikho Farmer Producer Company Limited | Lot: 569', 'ACCEPTED'),
  ('kern', 'INW-GRN/0002140/26-27-R39', 'GRN/0002140/26-27', 'PAST-INWARD', 'LORDS AND KINGS ENTERPRISES', 'Apple- Himachal', 'Cold Storage', 'HIMACHAL APPLE', 'APPLE- HIMACHAL', 850, 'BOX', 17000, '', '', '10-Oct-2026', '570', 'Supplier: Kanikho Farmer Producer Company Limited | Lot: 570', 'ACCEPTED'),
  ('kern', 'INW-GRN/0002137/26-27-R40', 'GRN/0002137/26-27', 'PAST-INWARD', 'LORDS AND KINGS ENTERPRISES', 'Apple- Himachal', 'Cold Storage', 'HIMACHAL APPLE', 'APPLE- HIMACHAL', 1160, 'BOX', 23200, '', '', '10-Oct-2026', '523', 'Supplier: Naresh Fruit Co | Lot: 523', 'ACCEPTED'),
  ('kern', 'INW-GRN/0002143/26-27-R43', 'GRN/0002143/26-27', 'PAST-INWARD', 'LORDS AND KINGS ENTERPRISES', 'Apple- Himachal', 'Cold Storage', 'HIMACHAL APPLE', 'APPLE- HIMACHAL', 1640, 'BOX', 32800, '', '', '11-Oct-2026', '571', 'Supplier: Kanikho Farmer Producer Company Limited | Lot: 571', 'ACCEPTED'),
  ('kern', 'INW-GRN/0002141/26-27-R44', 'GRN/0002141/26-27', 'PAST-INWARD', 'LORDS AND KINGS ENTERPRISES', 'Apple- Himachal', 'Cold Storage', 'HIMACHAL APPLE', 'APPLE- HIMACHAL', 275, 'BOX', 5500, '', '', '11-Oct-2026', '505', 'Supplier: Mohan M | Lot: 505', 'ACCEPTED'),
  ('kern', 'INW-GRN/0002142/26-27-R45', 'GRN/0002142/26-27', 'PAST-INWARD', 'LORDS AND KINGS ENTERPRISES', 'Apple- Himachal', 'Cold Storage', 'HIMACHAL APPLE', 'APPLE- HIMACHAL', 1160, 'BOX', 23200, '', '', '11-Oct-2026', '524', 'Supplier: Naresh Fruit Co | Lot: 524', 'ACCEPTED'),
  ('kern', 'INW-GRN/0002145/26-27-R49', 'GRN/0002145/26-27', 'PAST-INWARD', 'LORDS AND KINGS ENTERPRISES', 'Apple- Himachal', 'Cold Storage', 'HIMACHAL APPLE', 'APPLE- HIMACHAL', 760, 'BOX', 15200, '', '', '12-Oct-2026', '572', 'Supplier: Kanikho Farmer Producer Company Limited | Lot: 572', 'ACCEPTED'),
  ('kern', 'INW-GRN/0002146/26-27-R52', 'GRN/0002146/26-27', 'PAST-INWARD', 'LORDS AND KINGS ENTERPRISES', 'Apple- Himachal', 'Cold Storage', 'HIMACHAL APPLE', 'APPLE- HIMACHAL', 302, 'BOX', 6040, '', '', '13-Oct-2026', '506', 'Supplier: Murugan Enterprises | Lot: 506', 'ACCEPTED'),
  ('kern', 'INW-GRN/0002150/26-27-R53', 'GRN/0002150/26-27', 'PAST-INWARD', 'LORDS AND KINGS ENTERPRISES', 'Apple- Himachal', 'Cold Storage', 'HIMACHAL APPLE', 'APPLE- HIMACHAL', 860, 'BOX', 17200, '', '', '14-Oct-2026', '573', 'Supplier: Kanikho Farmer Producer Company Limited | Lot: 573', 'ACCEPTED'),
  ('kern', 'INW-GRN/0002153/26-27-R54', 'GRN/0002153/26-27', 'PAST-INWARD', 'LORDS AND KINGS ENTERPRISES', 'Apple- Himachal', 'Cold Storage', 'HIMACHAL APPLE', 'APPLE- HIMACHAL', 400, 'BOX', 8000, '', '', '15-Oct-2026', '526', 'Supplier: AKJ FRUITS | Lot: 526', 'ACCEPTED'),
  ('kern', 'INW-GRN/0002154/26-27-R55', 'GRN/0002154/26-27', 'PAST-INWARD', 'LORDS AND KINGS ENTERPRISES', 'Apple- Himachal', 'Cold Storage', 'HIMACHAL APPLE', 'APPLE- HIMACHAL', 633, 'BOX', 12660, '', '', '15-Oct-2026', '536', 'Supplier: SFK Fruits | Lot: 536', 'ACCEPTED'),
  ('kern', 'INW-GRN/0002162/26-27-R57', 'GRN/0002162/26-27', 'PAST-INWARD', 'LORDS AND KINGS ENTERPRISES', 'Apple- Himachal', 'Cold Storage', 'HIMACHAL APPLE', 'APPLE- HIMACHAL', 1160, 'BOX', 23200, '', '', '16-Oct-2026', '544', 'Supplier: Naresh Fruit Co | Lot: 544', 'ACCEPTED'),
  ('kern', 'INW-GRN/0002160/26-27-R58', 'GRN/0002160/26-27', 'PAST-INWARD', 'LORDS AND KINGS ENTERPRISES', 'Apple- Himachal', 'Cold Storage', 'HIMACHAL APPLE', 'APPLE- HIMACHAL', 1105, 'BOX', 22100, '', '', '16-Oct-2026', '514', 'Supplier: S R Fruits | Lot: 514', 'ACCEPTED'),
  ('kern', 'INW-GRN/0002159/26-27-R59', 'GRN/0002159/26-27', 'PAST-INWARD', 'LORDS AND KINGS ENTERPRISES', 'Apple- Himachal', 'Cold Storage', 'HIMACHAL APPLE', 'APPLE- HIMACHAL', 50, 'BOX', 1000, '', '', '16-Oct-2026', '511', 'Supplier: SHRI SADASHIV MUTTYHYA FRUIT COMPANY | Lot: 511', 'ACCEPTED'),
  ('kern', 'INW-GRN/0002161/26-27-R60', 'GRN/0002161/26-27', 'PAST-INWARD', 'LORDS AND KINGS ENTERPRISES', 'Apple- Himachal', 'Cold Storage', 'HIMACHAL APPLE', 'APPLE- HIMACHAL', 25, 'BOX', 500, '', '', '16-Oct-2026', '515', 'Supplier: SHRI SADASHIV MUTTYHYA FRUIT COMPANY | Lot: 515', 'ACCEPTED'),
  ('kern', 'INW-GRN/0002167/26-27-R64', 'GRN/0002167/26-27', 'PAST-INWARD', 'LORDS AND KINGS ENTERPRISES', 'Apple- Himachal', 'Cold Storage', 'HIMACHAL APPLE', 'APPLE- HIMACHAL', 680, 'BOX', 13600, '', '', '18-Oct-2026', '575', 'Supplier: Kanikho Farmer Producer Company Limited | Lot: 575', 'ACCEPTED'),
  ('kern', 'INW-GRN/0002166/26-27-R65', 'GRN/0002166/26-27', 'PAST-INWARD', 'LORDS AND KINGS ENTERPRISES', 'Apple- Himachal', 'Cold Storage', 'HIMACHAL APPLE', 'APPLE- HIMACHAL', 431, 'BOX', 8620, '', '', '18-Oct-2026', '546', 'Supplier: Naresh Fruit Co | Lot: 546', 'ACCEPTED'),
  ('kern', 'INW-GRN/0002168/26-27-R66', 'GRN/0002168/26-27', 'PAST-INWARD', 'LORDS AND KINGS ENTERPRISES', 'Apple- Himachal', 'Cold Storage', 'HIMACHAL APPLE', 'APPLE- HIMACHAL', 860, 'BOX', 17200, '', '', '19-Oct-2026', '576', 'Supplier: Kanikho Farmer Producer Company Limited | Lot: 576', 'ACCEPTED'),
  ('kern', 'INW-GRN/0002170/26-27-R70', 'GRN/0002170/26-27', 'PAST-INWARD', 'LORDS AND KINGS ENTERPRISES', 'Apple- Himachal', 'Cold Storage', 'HIMACHAL APPLE', 'APPLE- HIMACHAL', 640, 'BOX', 12800, '', '', '21-Oct-2026', '578', 'Supplier: Kanikho Farmer Producer Company Limited | Lot: 578', 'ACCEPTED'),
  ('kern', 'INW-GRN/0002169/26-27-R71', 'GRN/0002169/26-27', 'PAST-INWARD', 'LORDS AND KINGS ENTERPRISES', 'Apple- Himachal', 'Cold Storage', 'HIMACHAL APPLE', 'APPLE- HIMACHAL', 1050, 'BOX', 21000, '', '', '21-Oct-2026', '545', 'Supplier: Naresh Fruit Co | Lot: 545', 'ACCEPTED'),
  ('kern', 'INW-GRN/0002171/26-27-R73', 'GRN/0002171/26-27', 'PAST-INWARD', 'LORDS AND KINGS ENTERPRISES', 'Apple- Himachal', 'Cold Storage', 'HIMACHAL APPLE', 'APPLE- HIMACHAL', 1310, 'BOX', 26200, '', '', '21-Oct-2026', '588', 'Supplier: Suriyaa Narayanaa Enterprises | Lot: 588', 'ACCEPTED'),
  ('kern', 'INW-GRN/0002172/26-27-R74', 'GRN/0002172/26-27', 'PAST-INWARD', 'LORDS AND KINGS ENTERPRISES', 'Apple- Himachal', 'Cold Storage', 'HIMACHAL APPLE', 'APPLE- HIMACHAL', 980, 'BOX', 19600, '', '', '22-Oct-2026', '580', 'Supplier: Kanikho Farmer Producer Company Limited | Lot: 580', 'ACCEPTED'),
  ('kern', 'INW-GRN/0002173/26-27-R77', 'GRN/0002173/26-27', 'PAST-INWARD', 'LORDS AND KINGS ENTERPRISES', 'Apple- Himachal', 'Cold Storage', 'HIMACHAL APPLE', 'APPLE- HIMACHAL', 842, 'BOX', 16840, '', '', '23-Oct-2026', '616', 'Supplier: Kanikho Farmer Producer Company Limited | Lot: 616', 'ACCEPTED'),
  ('kern', 'INW-GRN/0002120/26-27-R108', 'GRN/0002120/26-27', 'PAST-INWARD', 'LORDS AND KINGS ENTERPRISES', 'Apple -Kashmir', 'Cold Storage', 'KASHMIR APPLE', 'APPLE -KASHMIR', 775, 'BOX', 15500, '', '', '02-Oct-2026', '490', 'Supplier: AKSHARAA GLOBAL TRADERS | Lot: 490', 'ACCEPTED'),
  ('kern', 'INW-GRN/0002131/26-27-R109', 'GRN/0002131/26-27', 'PAST-INWARD', 'LORDS AND KINGS ENTERPRISES', 'Apple -Kashmir', 'Cold Storage', 'KASHMIR APPLE', 'APPLE -KASHMIR', 500, 'BOX', 10000, '', '', '07-Oct-2026', '498', 'Supplier: IRS Fruits | Lot: 498', 'ACCEPTED'),
  ('kern', 'INW-GRN/0002133/26-27-R111', 'GRN/0002133/26-27', 'PAST-INWARD', 'LORDS AND KINGS ENTERPRISES', 'Apple -Kashmir', 'Cold Storage', 'KASHMIR APPLE', 'APPLE -KASHMIR', 300, 'BOX', 6000, '', '', '08-Oct-2026', '541', 'Supplier: SRM Fruits | Lot: 541', 'ACCEPTED'),
  ('kern', 'INW-GRN/0002135/26-27-R112', 'GRN/0002135/26-27', 'PAST-INWARD', 'LORDS AND KINGS ENTERPRISES', 'Apple -Kashmir', 'Cold Storage', 'KASHMIR APPLE', 'APPLE -KASHMIR', 1192, 'BOX', 23840, '', '', '09-Oct-2026', '502', 'Supplier: Manthan Ventures | Lot: 502', 'ACCEPTED'),
  ('kern', 'INW-GRN/0002136/26-27-R113', 'GRN/0002136/26-27', 'PAST-INWARD', 'LORDS AND KINGS ENTERPRISES', 'Apple -Kashmir', 'Cold Storage', 'KASHMIR APPLE', 'APPLE -KASHMIR', 139, 'BOX', 2780, '', '', '10-Oct-2026', '503', 'Supplier: Maps Enterprises | Lot: 503', 'ACCEPTED'),
  ('kern', 'INW-GRN/0002144/26-27-R114', 'GRN/0002144/26-27', 'PAST-INWARD', 'LORDS AND KINGS ENTERPRISES', 'Apple -Kashmir', 'Cold Storage', 'KASHMIR APPLE', 'APPLE -KASHMIR', 125, 'BOX', 2500, '', '', '12-Oct-2026', '533', 'Supplier: Kondaiya Potdurthi | Lot: 533', 'ACCEPTED'),
  ('kern', 'INW-GRN/0002147/26-27-R116', 'GRN/0002147/26-27', 'PAST-INWARD', 'LORDS AND KINGS ENTERPRISES', 'Apple -Kashmir', 'Cold Storage', 'KASHMIR APPLE', 'APPLE -KASHMIR', 1160, 'BOX', 23200, '', '', '14-Oct-2026', '525', 'Supplier: Naresh Fruit Co | Lot: 525', 'ACCEPTED'),
  ('kern', 'INW-GRN/0002148/26-27-R117', 'GRN/0002148/26-27', 'PAST-INWARD', 'LORDS AND KINGS ENTERPRISES', 'Apple -Kashmir', 'Cold Storage', 'KASHMIR APPLE', 'APPLE -KASHMIR', 870, 'BOX', 17400, '', '', '14-Oct-2026', '535', 'Supplier: Mohan M | Lot: 535', 'ACCEPTED'),
  ('kern', 'INW-GRN/0002157/26-27-R118', 'GRN/0002157/26-27', 'PAST-INWARD', 'LORDS AND KINGS ENTERPRISES', 'Apple -Kashmir', 'Cold Storage', 'KASHMIR APPLE', 'APPLE -KASHMIR', 2782, 'BOX', 55640, '', '', '15-Oct-2026', '585', 'Supplier: Kanikho Farmer Producer Company Limited | Lot: 585', 'ACCEPTED'),
  ('kern', 'INW-GRN/0002158/26-27-R119', 'GRN/0002158/26-27', 'PAST-INWARD', 'LORDS AND KINGS ENTERPRISES', 'Apple -Kashmir', 'Cold Storage', 'KASHMIR APPLE', 'APPLE -KASHMIR', 2500, 'BOX', 50000, '', '', '16-Oct-2026', '510', 'Supplier: SFK Fruits | Lot: 510', 'ACCEPTED'),
  ('kern', 'INW-GRN/0002164/26-27-R120', 'GRN/0002164/26-27', 'PAST-INWARD', 'LORDS AND KINGS ENTERPRISES', 'Apple -Kashmir', 'Cold Storage', 'KASHMIR APPLE', 'APPLE -KASHMIR', 890, 'BOX', 17800, '', '', '18-Oct-2026', '530', 'Supplier: ESB Fruits | Lot: 530', 'ACCEPTED'),
  ('kern', 'INW-GRN/0002165/26-27-R121', 'GRN/0002165/26-27', 'PAST-INWARD', 'LORDS AND KINGS ENTERPRISES', 'Apple -Kashmir', 'Cold Storage', 'KASHMIR APPLE', 'APPLE -KASHMIR', 300, 'BOX', 6000, '', '', '18-Oct-2026', '539', 'Supplier: Rama Mohan S | Lot: 539', 'ACCEPTED'),
  ('kern', 'INW-GRN/0002099/26-27-R129', 'GRN/0002099/26-27', 'PAST-INWARD', 'LORDS AND KINGS ENTERPRISES', 'Gala Apple', 'Cold Storage', 'PREMIUM APPLE', 'GALA APPLE', 565, 'BOX', 11300, '', '', '18-Sep-2026', '456', 'Supplier: Kanikho Farmer Producer Company Limited | Lot: 456', 'ACCEPTED'),
  ('kern', 'INW-GRN/0002102/26-27-R130', 'GRN/0002102/26-27', 'PAST-INWARD', 'LORDS AND KINGS ENTERPRISES', 'Gala Apple', 'Cold Storage', 'PREMIUM APPLE', 'GALA APPLE', 1160, 'BOX', 23200, '', '', '19-Sep-2026', '457', 'Supplier: Kanikho Farmer Producer Company Limited | Lot: 457', 'ACCEPTED'),
  ('kern', 'INW-GRN/0002105/26-27-R131', 'GRN/0002105/26-27', 'PAST-INWARD', 'LORDS AND KINGS ENTERPRISES', 'Gala Apple', 'Cold Storage', 'PREMIUM APPLE', 'GALA APPLE', 1160, 'BOX', 23200, '', '', '20-Sep-2026', '465', 'Supplier: Naresh Fruit Co | Lot: 465', 'ACCEPTED'),
  ('kern', 'INW-GRN/0002109/26-27-R132', 'GRN/0002109/26-27', 'PAST-INWARD', 'LORDS AND KINGS ENTERPRISES', 'Gala Apple', 'Cold Storage', 'PREMIUM APPLE', 'GALA APPLE', 1160, 'BOX', 23200, '', '', '22-Sep-2026', '466', 'Supplier: Naresh Fruit Co | Lot: 466', 'ACCEPTED'),
  ('kern', 'INW-GRN/0002116/26-27-R133', 'GRN/0002116/26-27', 'PAST-INWARD', 'LORDS AND KINGS ENTERPRISES', 'Gala Apple', 'Cold Storage', 'PREMIUM APPLE', 'GALA APPLE', 538, 'BOX', 10760, '', '', '27-Sep-2026', '467', 'Supplier: Naresh Fruit Co | Lot: 467', 'ACCEPTED'),
  ('kern', 'INW-GRN/0002124/26-27-R139', 'GRN/0002124/26-27', 'PAST-INWARD', 'LORDS AND KINGS ENTERPRISES', 'Kiwi Fruit', 'Cold Storage', 'KIWI', 'KIWI FRUIT', 375, 'BOX', 7500, '', '', '03-Oct-2026', '534', 'Supplier: Meenakshi Jayav | Lot: 534', 'ACCEPTED'),
  ('kern', 'INW-GRN/0002127/26-27-R140', 'GRN/0002127/26-27', 'PAST-INWARD', 'LORDS AND KINGS ENTERPRISES', 'Kiwi Fruit', 'Cold Storage', 'KIWI', 'KIWI FRUIT', 160, 'BOX', 3200, '', '', '05-Oct-2026', '507', 'Supplier: P Kesavan - Apple Purchase | Lot: 507', 'ACCEPTED'),
  ('kern', 'INW-GRN/0002128/26-27-R141', 'GRN/0002128/26-27', 'PAST-INWARD', 'LORDS AND KINGS ENTERPRISES', 'Kiwi Fruit', 'Cold Storage', 'KIWI', 'KIWI FRUIT', 125, 'BOX', 2500, '', '', '05-Oct-2026', '528', 'Supplier: Aswin Enterprises | Lot: 528', 'ACCEPTED'),
  ('kern', 'INW-GRN/0002130/26-27-R143', 'GRN/0002130/26-27', 'PAST-INWARD', 'LORDS AND KINGS ENTERPRISES', 'Kiwi Fruit', 'Cold Storage', 'KIWI', 'KIWI FRUIT', 1396, 'BOX', 27920, '', '', '06-Oct-2026', '543', 'Supplier: Suriyaa Narayanaa Enterprises | Lot: 543', 'ACCEPTED'),
  ('kern', 'INW-GRN/0002133/26-27-R144', 'GRN/0002133/26-27', 'PAST-INWARD', 'LORDS AND KINGS ENTERPRISES', 'Kiwi Fruit', 'Cold Storage', 'KIWI', 'KIWI FRUIT', 100, 'BOX', 2000, '', '', '08-Oct-2026', '541', 'Supplier: SRM Fruits | Lot: 541', 'ACCEPTED'),
  ('kern', 'INW-GRN/0002138/26-27-R146', 'GRN/0002138/26-27', 'PAST-INWARD', 'LORDS AND KINGS ENTERPRISES', 'Kiwi Fruit', 'Cold Storage', 'KIWI', 'KIWI FRUIT', 288, 'BOX', 5760, '', '', '10-Oct-2026', '566', 'Supplier: Kanikho Farmer Producer Company Limited | Lot: 566', 'ACCEPTED'),
  ('kern', 'INW-GRN/0002098/26-27-R154', 'GRN/0002098/26-27', 'PAST-INWARD', 'LORDS AND KINGS ENTERPRISES', 'Orange, Imported', 'Cold Storage', 'IMPORTED ORANGE', 'ORANGE, IMPORTED', 500, 'BOX', 10000, '', '', '18-Sep-2026', '423', 'Supplier: PDM Fruits | Lot: 423', 'ACCEPTED'),
  ('kern', 'INW-GRN/0002110/26-27-R155', 'GRN/0002110/26-27', 'PAST-INWARD', 'LORDS AND KINGS ENTERPRISES', 'Orange, Imported', 'Cold Storage', 'IMPORTED ORANGE', 'ORANGE, IMPORTED', 749, 'BOX', 14980, '', '', '22-Sep-2026', '478', 'Supplier: Kanikho Farmer Producer Company Limited | Lot: 478', 'ACCEPTED'),
  ('kern', 'INW-GRN/0002111/26-27-R156', 'GRN/0002111/26-27', 'PAST-INWARD', 'LORDS AND KINGS ENTERPRISES', 'Orange, Imported', 'Cold Storage', 'IMPORTED ORANGE', 'ORANGE, IMPORTED', 1664, 'BOX', 33280, '', '', '22-Sep-2026', '487', 'Supplier: S R Fruits | Lot: 487', 'ACCEPTED'),
  ('kern', 'INW-GRN/0002113/26-27-R157', 'GRN/0002113/26-27', 'PAST-INWARD', 'LORDS AND KINGS ENTERPRISES', 'Orange, Imported', 'Cold Storage', 'IMPORTED ORANGE', 'ORANGE, IMPORTED', 1160, 'BOX', 23200, '', '', '23-Sep-2026', '479', 'Supplier: Kanikho Farmer Producer Company Limited | Lot: 479', 'ACCEPTED'),
  ('kern', 'INW-GRN/0002114/26-27-R158', 'GRN/0002114/26-27', 'PAST-INWARD', 'LORDS AND KINGS ENTERPRISES', 'Orange, Imported', 'Cold Storage', 'IMPORTED ORANGE', 'ORANGE, IMPORTED', 1664, 'BOX', 33280, '', '', '24-Sep-2026', '480', 'Supplier: Kanikho Farmer Producer Company Limited | Lot: 480', 'ACCEPTED'),
  ('kern', 'INW-GRN/0002115/26-27-R159', 'GRN/0002115/26-27', 'PAST-INWARD', 'LORDS AND KINGS ENTERPRISES', 'Orange, Imported', 'Cold Storage', 'IMPORTED ORANGE', 'ORANGE, IMPORTED', 1664, 'BOX', 33280, '', '', '25-Sep-2026', '481', 'Supplier: Kanikho Farmer Producer Company Limited | Lot: 481', 'ACCEPTED'),
  ('kern', 'INW-GRN/0002116/26-27-R160', 'GRN/0002116/26-27', 'PAST-INWARD', 'LORDS AND KINGS ENTERPRISES', 'Orange, Imported', 'Cold Storage', 'IMPORTED ORANGE', 'ORANGE, IMPORTED', 619, 'BOX', 12380, '', '', '27-Sep-2026', '467', 'Supplier: Naresh Fruit Co | Lot: 467', 'ACCEPTED'),
  ('kern', 'INW-GRN/0002129/26-27-R161', 'GRN/0002129/26-27', 'PAST-INWARD', 'LORDS AND KINGS ENTERPRISES', 'Orange, Imported', 'Cold Storage', 'IMPORTED ORANGE', 'ORANGE, IMPORTED', 400, 'BOX', 8000, '', '', '06-Oct-2026', '497', 'Supplier: G Fruit Company | Lot: 497', 'ACCEPTED'),
  ('kern', 'INW-GRN/0002151/26-27-R162', 'GRN/0002151/26-27', 'PAST-INWARD', 'LORDS AND KINGS ENTERPRISES', 'Orange, Imported', 'Cold Storage', 'IMPORTED ORANGE', 'ORANGE, IMPORTED', 212, 'BOX', 4240, '', '', '15-Oct-2026', '509', 'Supplier: MJR Fruit Marchant | Lot: 509', 'ACCEPTED'),
  ('kern', 'INW-GRN/0002152/26-27-R163', 'GRN/0002152/26-27', 'PAST-INWARD', 'LORDS AND KINGS ENTERPRISES', 'Orange, Imported', 'Cold Storage', 'IMPORTED ORANGE', 'ORANGE, IMPORTED', 600, 'BOX', 12000, '', '', '15-Oct-2026', '513', 'Supplier: SR and Sons | Lot: 513', 'ACCEPTED'),
  ('kern', 'INW-GRN/0002156/26-27-R164', 'GRN/0002156/26-27', 'PAST-INWARD', 'LORDS AND KINGS ENTERPRISES', 'Orange, Imported', 'Cold Storage', 'IMPORTED ORANGE', 'ORANGE, IMPORTED', 914, 'BOX', 18280, '', '', '15-Oct-2026', '574', 'Supplier: Kanikho Farmer Producer Company Limited | Lot: 574', 'ACCEPTED'),
  ('kern', 'INW-GRN/0002163/26-27-R165', 'GRN/0002163/26-27', 'PAST-INWARD', 'LORDS AND KINGS ENTERPRISES', 'Orange, Imported', 'Cold Storage', 'IMPORTED ORANGE', 'ORANGE, IMPORTED', 280, 'BOX', 5600, '', '', '17-Oct-2026', '529', 'Supplier: Dhivya G | Lot: 529', 'ACCEPTED'),
  ('kern', 'INW-GRN/0002177/26-27-R166', 'GRN/0002177/26-27', 'PAST-INWARD', 'LORDS AND KINGS ENTERPRISES', 'Orange, Imported', 'Cold Storage', 'IMPORTED ORANGE', 'ORANGE, IMPORTED', 750, 'BOX', 15000, '', '', '27-Oct-2026', '615', 'Supplier: Kanikho Farmer Producer Company Limited | Lot: 615', 'ACCEPTED'),
  ('kern', 'INW-GRN/0002178/26-27-R170', 'GRN/0002178/26-27', 'PAST-INWARD', 'LORDS AND KINGS ENTERPRISES', 'Orange, Imported', 'Cold Storage', 'IMPORTED ORANGE', 'ORANGE, IMPORTED', 1660, 'BOX', 33200, '', '', '30-Oct-2026', '582', 'Supplier: Kanikho Farmer Producer Company Limited | Lot: 582', 'ACCEPTED'),
  ('kern', 'INW-GRN/0002118/26-27-R177', 'GRN/0002118/26-27', 'PAST-INWARD', 'LORDS AND KINGS ENTERPRISES', 'Pear', 'Cold Storage', 'PEAR', 'PEAR', 256, 'BOX', 5120, '', '', '01-Oct-2026', '538', 'Supplier: SP Enterprises | Lot: 538', 'ACCEPTED'),
  ('kern', 'INW-GRN/0002121/26-27-R178', 'GRN/0002121/26-27', 'PAST-INWARD', 'LORDS AND KINGS ENTERPRISES', 'Pear', 'Cold Storage', 'PEAR', 'PEAR', 115, 'BOX', 2300, '', '', '02-Oct-2026', '491', 'Supplier: ANJANERI IMPORTS AND EXPORTS PVT LT | Lot: 491', 'ACCEPTED'),
  ('kern', 'INW-GRN/0002136/26-27-R179', 'GRN/0002136/26-27', 'PAST-INWARD', 'LORDS AND KINGS ENTERPRISES', 'Pear', 'Cold Storage', 'PEAR', 'PEAR', 58, 'BOX', 1160, '', '', '10-Oct-2026', '503', 'Supplier: Maps Enterprises | Lot: 503', 'ACCEPTED'),
  ('kern', 'INW-GRN/0002149/26-27-R180', 'GRN/0002149/26-27', 'PAST-INWARD', 'LORDS AND KINGS ENTERPRISES', 'Pear', 'Cold Storage', 'PEAR', 'PEAR', 164, 'BOX', 3280, '', '', '14-Oct-2026', '540', 'Supplier: S R Fruits | Lot: 540', 'ACCEPTED'),
  ('kern', 'INW-GRN/0002155/26-27-R181', 'GRN/0002155/26-27', 'PAST-INWARD', 'LORDS AND KINGS ENTERPRISES', 'Pear', 'Cold Storage', 'PEAR', 'PEAR', 500, 'BOX', 10000, '', '', '15-Oct-2026', '542', 'Supplier: Subramani Sons | Lot: 542', 'ACCEPTED');

-- 2. Insert 85 Outward Delivery Notes (70,889 qty) into delivery_notes & delivery_note_items
WITH ins AS (
  INSERT INTO delivery_notes (logistics_id, dc_no, dc_date, customer_name, address, contact_person, contact_no, destination, prepared_by, vehicle_no, gate_in_no, total_qty)
  VALUES ('kern', 'LKE-F-383/26-27', '01-Oct-2026', 'AAKASH ENTERPRISES', '', '', '', '', 'LORDS AND KINGS ENTERPRISES', '', '', 1160)
  RETURNING id
)
INSERT INTO delivery_note_items (delivery_note_id, grn_no, brand, product, variety, lot_no, count, wh_location, dispatched_qty, unit, rate_type)
SELECT id, '', '', 'Apple- Himachal', '', '', '', 'COLD-HUB', 1160, 'BOX', 'Weekly' FROM ins;

WITH ins AS (
  INSERT INTO delivery_notes (logistics_id, dc_no, dc_date, customer_name, address, contact_person, contact_no, destination, prepared_by, vehicle_no, gate_in_no, total_qty)
  VALUES ('kern', 'LKE-F-385/26-27', '01-Oct-2026', 'SREE VITTALA EXPORTS PRIVATE LTD', '', '', '', '', 'LORDS AND KINGS ENTERPRISES', '', '', 475)
  RETURNING id
)
INSERT INTO delivery_note_items (delivery_note_id, grn_no, brand, product, variety, lot_no, count, wh_location, dispatched_qty, unit, rate_type)
SELECT id, '', '', 'Apple- Himachal', '', '', '', 'COLD-HUB', 475, 'BOX', 'Weekly' FROM ins;

WITH ins AS (
  INSERT INTO delivery_notes (logistics_id, dc_no, dc_date, customer_name, address, contact_person, contact_no, destination, prepared_by, vehicle_no, gate_in_no, total_qty)
  VALUES ('kern', 'LKE-F-387/26-27', '02-Oct-2026', 'Annora Exports and Imports', '', '', '', '', 'LORDS AND KINGS ENTERPRISES', '', '', 680)
  RETURNING id
)
INSERT INTO delivery_note_items (delivery_note_id, grn_no, brand, product, variety, lot_no, count, wh_location, dispatched_qty, unit, rate_type)
SELECT id, '', '', 'Apple- Himachal', '', '', '', 'COLD-HUB', 680, 'BOX', 'Weekly' FROM ins;

WITH ins AS (
  INSERT INTO delivery_notes (logistics_id, dc_no, dc_date, customer_name, address, contact_person, contact_no, destination, prepared_by, vehicle_no, gate_in_no, total_qty)
  VALUES ('kern', 'LKE-F-388/26-27', '02-Oct-2026', 'Annora Exports and Imports', '', '', '', '', 'LORDS AND KINGS ENTERPRISES', '', '', 850)
  RETURNING id
)
INSERT INTO delivery_note_items (delivery_note_id, grn_no, brand, product, variety, lot_no, count, wh_location, dispatched_qty, unit, rate_type)
SELECT id, '', '', 'Apple- Himachal', '', '', '', 'COLD-HUB', 850, 'BOX', 'Weekly' FROM ins;

WITH ins AS (
  INSERT INTO delivery_notes (logistics_id, dc_no, dc_date, customer_name, address, contact_person, contact_no, destination, prepared_by, vehicle_no, gate_in_no, total_qty)
  VALUES ('kern', 'LKE-F-396/26-27', '04-Oct-2026', 'SREE VITTALA EXPORTS PRIVATE LTD', '', '', '', '', 'LORDS AND KINGS ENTERPRISES', '', '', 475)
  RETURNING id
)
INSERT INTO delivery_note_items (delivery_note_id, grn_no, brand, product, variety, lot_no, count, wh_location, dispatched_qty, unit, rate_type)
SELECT id, '', '', 'Apple- Himachal', '', '', '', 'COLD-HUB', 475, 'BOX', 'Weekly' FROM ins;

WITH ins AS (
  INSERT INTO delivery_notes (logistics_id, dc_no, dc_date, customer_name, address, contact_person, contact_no, destination, prepared_by, vehicle_no, gate_in_no, total_qty)
  VALUES ('kern', 'LKE-F-397/26-27', '05-Oct-2026', 'Annora Exports and Imports', '', '', '', '', 'LORDS AND KINGS ENTERPRISES', '', '', 860)
  RETURNING id
)
INSERT INTO delivery_note_items (delivery_note_id, grn_no, brand, product, variety, lot_no, count, wh_location, dispatched_qty, unit, rate_type)
SELECT id, '', '', 'Apple- Himachal', '', '', '', 'COLD-HUB', 860, 'BOX', 'Weekly' FROM ins;

WITH ins AS (
  INSERT INTO delivery_notes (logistics_id, dc_no, dc_date, customer_name, address, contact_person, contact_no, destination, prepared_by, vehicle_no, gate_in_no, total_qty)
  VALUES ('kern', 'LKE-F-398/26-27', '05-Oct-2026', 'SREE VITTALA EXPORTS PRIVATE LTD', '', '', '', '', 'LORDS AND KINGS ENTERPRISES', '', '', 475)
  RETURNING id
)
INSERT INTO delivery_note_items (delivery_note_id, grn_no, brand, product, variety, lot_no, count, wh_location, dispatched_qty, unit, rate_type)
SELECT id, '', '', 'Apple- Himachal', '', '', '', 'COLD-HUB', 475, 'BOX', 'Weekly' FROM ins;

WITH ins AS (
  INSERT INTO delivery_notes (logistics_id, dc_no, dc_date, customer_name, address, contact_person, contact_no, destination, prepared_by, vehicle_no, gate_in_no, total_qty)
  VALUES ('kern', 'LKE-F-399/26-27', '05-Oct-2026', 'SREE VITTALA EXPORTS PRIVATE LTD', '', '', '', '', 'LORDS AND KINGS ENTERPRISES', '', '', 475)
  RETURNING id
)
INSERT INTO delivery_note_items (delivery_note_id, grn_no, brand, product, variety, lot_no, count, wh_location, dispatched_qty, unit, rate_type)
SELECT id, '', '', 'Apple- Himachal', '', '', '', 'COLD-HUB', 475, 'BOX', 'Weekly' FROM ins;

WITH ins AS (
  INSERT INTO delivery_notes (logistics_id, dc_no, dc_date, customer_name, address, contact_person, contact_no, destination, prepared_by, vehicle_no, gate_in_no, total_qty)
  VALUES ('kern', 'LKE-F-401/26-27', '06-Oct-2026', 'AAKASH ENTERPRISES', '', '', '', '', 'LORDS AND KINGS ENTERPRISES', '', '', 1291)
  RETURNING id
)
INSERT INTO delivery_note_items (delivery_note_id, grn_no, brand, product, variety, lot_no, count, wh_location, dispatched_qty, unit, rate_type)
SELECT id, '', '', 'Apple- Himachal', '', '', '', 'COLD-HUB', 1291, 'BOX', 'Weekly' FROM ins;

WITH ins AS (
  INSERT INTO delivery_notes (logistics_id, dc_no, dc_date, customer_name, address, contact_person, contact_no, destination, prepared_by, vehicle_no, gate_in_no, total_qty)
  VALUES ('kern', 'LKE-F-402/26-27', '06-Oct-2026', 'Annora Exports and Imports', '', '', '', '', 'LORDS AND KINGS ENTERPRISES', '', '', 645)
  RETURNING id
)
INSERT INTO delivery_note_items (delivery_note_id, grn_no, brand, product, variety, lot_no, count, wh_location, dispatched_qty, unit, rate_type)
SELECT id, '', '', 'Apple- Himachal', '', '', '', 'COLD-HUB', 645, 'BOX', 'Weekly' FROM ins;

WITH ins AS (
  INSERT INTO delivery_notes (logistics_id, dc_no, dc_date, customer_name, address, contact_person, contact_no, destination, prepared_by, vehicle_no, gate_in_no, total_qty)
  VALUES ('kern', 'LKE-F-408/26-27', '08-Oct-2026', 'Annora Exports and Imports', '', '', '', '', 'LORDS AND KINGS ENTERPRISES', '', '', 680)
  RETURNING id
)
INSERT INTO delivery_note_items (delivery_note_id, grn_no, brand, product, variety, lot_no, count, wh_location, dispatched_qty, unit, rate_type)
SELECT id, '', '', 'Apple- Himachal', '', '', '', 'COLD-HUB', 680, 'BOX', 'Weekly' FROM ins;

WITH ins AS (
  INSERT INTO delivery_notes (logistics_id, dc_no, dc_date, customer_name, address, contact_person, contact_no, destination, prepared_by, vehicle_no, gate_in_no, total_qty)
  VALUES ('kern', 'LKE-F-409/26-27', '08-Oct-2026', 'LUNARRS TRADERS', '', '', '', '', 'LORDS AND KINGS ENTERPRISES', '', '', 669)
  RETURNING id
)
INSERT INTO delivery_note_items (delivery_note_id, grn_no, brand, product, variety, lot_no, count, wh_location, dispatched_qty, unit, rate_type)
SELECT id, '', '', 'Apple- Himachal', '', '', '', 'COLD-HUB', 669, 'BOX', 'Weekly' FROM ins;

WITH ins AS (
  INSERT INTO delivery_notes (logistics_id, dc_no, dc_date, customer_name, address, contact_person, contact_no, destination, prepared_by, vehicle_no, gate_in_no, total_qty)
  VALUES ('kern', 'LKE-F-411/26-27', '09-Oct-2026', 'Annora Exports and Imports', '', '', '', '', 'LORDS AND KINGS ENTERPRISES', '', '', 860)
  RETURNING id
)
INSERT INTO delivery_note_items (delivery_note_id, grn_no, brand, product, variety, lot_no, count, wh_location, dispatched_qty, unit, rate_type)
SELECT id, '', '', 'Apple- Himachal', '', '', '', 'COLD-HUB', 860, 'BOX', 'Weekly' FROM ins;

WITH ins AS (
  INSERT INTO delivery_notes (logistics_id, dc_no, dc_date, customer_name, address, contact_person, contact_no, destination, prepared_by, vehicle_no, gate_in_no, total_qty)
  VALUES ('kern', 'LKE-F-413/26-27', '10-Oct-2026', 'Annora Exports and Imports', '', '', '', '', 'LORDS AND KINGS ENTERPRISES', '', '', 760)
  RETURNING id
)
INSERT INTO delivery_note_items (delivery_note_id, grn_no, brand, product, variety, lot_no, count, wh_location, dispatched_qty, unit, rate_type)
SELECT id, '', '', 'Apple- Himachal', '', '', '', 'COLD-HUB', 760, 'BOX', 'Weekly' FROM ins;

WITH ins AS (
  INSERT INTO delivery_notes (logistics_id, dc_no, dc_date, customer_name, address, contact_person, contact_no, destination, prepared_by, vehicle_no, gate_in_no, total_qty)
  VALUES ('kern', 'LKE-F-414/26-27', '10-Oct-2026', 'S Narappa and Sons', '', '', '', '', 'LORDS AND KINGS ENTERPRISES', '', '', 20)
  RETURNING id
)
INSERT INTO delivery_note_items (delivery_note_id, grn_no, brand, product, variety, lot_no, count, wh_location, dispatched_qty, unit, rate_type)
SELECT id, '', '', 'Apple- Himachal', '', '', '', 'COLD-HUB', 20, 'BOX', 'Weekly' FROM ins;

WITH ins AS (
  INSERT INTO delivery_notes (logistics_id, dc_no, dc_date, customer_name, address, contact_person, contact_no, destination, prepared_by, vehicle_no, gate_in_no, total_qty)
  VALUES ('kern', 'LKE-F-417/26-27', '11-Oct-2026', 'Annora Exports and Imports', '', '', '', '', 'LORDS AND KINGS ENTERPRISES', '', '', 720)
  RETURNING id
)
INSERT INTO delivery_note_items (delivery_note_id, grn_no, brand, product, variety, lot_no, count, wh_location, dispatched_qty, unit, rate_type)
SELECT id, '', '', 'Apple- Himachal', '', '', '', 'COLD-HUB', 720, 'BOX', 'Weekly' FROM ins;

WITH ins AS (
  INSERT INTO delivery_notes (logistics_id, dc_no, dc_date, customer_name, address, contact_person, contact_no, destination, prepared_by, vehicle_no, gate_in_no, total_qty)
  VALUES ('kern', 'LKE-F-418/26-27', '11-Oct-2026', 'SREE VITTALA EXPORTS PRIVATE LTD', '', '', '', '', 'LORDS AND KINGS ENTERPRISES', '', '', 475)
  RETURNING id
)
INSERT INTO delivery_note_items (delivery_note_id, grn_no, brand, product, variety, lot_no, count, wh_location, dispatched_qty, unit, rate_type)
SELECT id, '', '', 'Apple- Himachal', '', '', '', 'COLD-HUB', 475, 'BOX', 'Weekly' FROM ins;

WITH ins AS (
  INSERT INTO delivery_notes (logistics_id, dc_no, dc_date, customer_name, address, contact_person, contact_no, destination, prepared_by, vehicle_no, gate_in_no, total_qty)
  VALUES ('kern', 'LKE-F-419/26-27', '11-Oct-2026', 'SREE VITTALA EXPORTS PRIVATE LTD', '', '', '', '', 'LORDS AND KINGS ENTERPRISES', '', '', 475)
  RETURNING id
)
INSERT INTO delivery_note_items (delivery_note_id, grn_no, brand, product, variety, lot_no, count, wh_location, dispatched_qty, unit, rate_type)
SELECT id, '', '', 'Apple- Himachal', '', '', '', 'COLD-HUB', 475, 'BOX', 'Weekly' FROM ins;

WITH ins AS (
  INSERT INTO delivery_notes (logistics_id, dc_no, dc_date, customer_name, address, contact_person, contact_no, destination, prepared_by, vehicle_no, gate_in_no, total_qty)
  VALUES ('kern', 'LKE-F-421/26-27', '12-Oct-2026', 'Annora Exports and Imports', '', '', '', '', 'LORDS AND KINGS ENTERPRISES', '', '', 540)
  RETURNING id
)
INSERT INTO delivery_note_items (delivery_note_id, grn_no, brand, product, variety, lot_no, count, wh_location, dispatched_qty, unit, rate_type)
SELECT id, '', '', 'Apple- Himachal', '', '', '', 'COLD-HUB', 540, 'BOX', 'Weekly' FROM ins;

WITH ins AS (
  INSERT INTO delivery_notes (logistics_id, dc_no, dc_date, customer_name, address, contact_person, contact_no, destination, prepared_by, vehicle_no, gate_in_no, total_qty)
  VALUES ('kern', 'LKE-F-423/26-27', '12-Oct-2026', 'SREE VITTALA EXPORTS PRIVATE LTD', '', '', '', '', 'LORDS AND KINGS ENTERPRISES', '', '', 475)
  RETURNING id
)
INSERT INTO delivery_note_items (delivery_note_id, grn_no, brand, product, variety, lot_no, count, wh_location, dispatched_qty, unit, rate_type)
SELECT id, '', '', 'Apple- Himachal', '', '', '', 'COLD-HUB', 475, 'BOX', 'Weekly' FROM ins;

WITH ins AS (
  INSERT INTO delivery_notes (logistics_id, dc_no, dc_date, customer_name, address, contact_person, contact_no, destination, prepared_by, vehicle_no, gate_in_no, total_qty)
  VALUES ('kern', 'LKE-F-425/26-27', '13-Oct-2026', 'Annora Exports and Imports', '', '', '', '', 'LORDS AND KINGS ENTERPRISES', '', '', 685)
  RETURNING id
)
INSERT INTO delivery_note_items (delivery_note_id, grn_no, brand, product, variety, lot_no, count, wh_location, dispatched_qty, unit, rate_type)
SELECT id, '', '', 'Apple- Himachal', '', '', '', 'COLD-HUB', 685, 'BOX', 'Weekly' FROM ins;

WITH ins AS (
  INSERT INTO delivery_notes (logistics_id, dc_no, dc_date, customer_name, address, contact_person, contact_no, destination, prepared_by, vehicle_no, gate_in_no, total_qty)
  VALUES ('kern', 'LKE-F-426/26-27', '15-Oct-2026', 'SREE VITTALA EXPORTS PRIVATE LTD', '', '', '', '', 'LORDS AND KINGS ENTERPRISES', '', '', 475)
  RETURNING id
)
INSERT INTO delivery_note_items (delivery_note_id, grn_no, brand, product, variety, lot_no, count, wh_location, dispatched_qty, unit, rate_type)
SELECT id, '', '', 'Apple- Himachal', '', '', '', 'COLD-HUB', 475, 'BOX', 'Weekly' FROM ins;

WITH ins AS (
  INSERT INTO delivery_notes (logistics_id, dc_no, dc_date, customer_name, address, contact_person, contact_no, destination, prepared_by, vehicle_no, gate_in_no, total_qty)
  VALUES ('kern', 'LKE-F-430/26-27', '16-Oct-2026', 'SREE VITTALA EXPORTS PRIVATE LTD', '', '', '', '', 'LORDS AND KINGS ENTERPRISES', '', '', 475)
  RETURNING id
)
INSERT INTO delivery_note_items (delivery_note_id, grn_no, brand, product, variety, lot_no, count, wh_location, dispatched_qty, unit, rate_type)
SELECT id, '', '', 'Apple- Himachal', '', '', '', 'COLD-HUB', 475, 'BOX', 'Weekly' FROM ins;

WITH ins AS (
  INSERT INTO delivery_notes (logistics_id, dc_no, dc_date, customer_name, address, contact_person, contact_no, destination, prepared_by, vehicle_no, gate_in_no, total_qty)
  VALUES ('kern', 'LKE-F-432/26-27', '17-Oct-2026', 'SREE VITTALA EXPORTS PRIVATE LTD', '', '', '', '', 'LORDS AND KINGS ENTERPRISES', '', '', 475)
  RETURNING id
)
INSERT INTO delivery_note_items (delivery_note_id, grn_no, brand, product, variety, lot_no, count, wh_location, dispatched_qty, unit, rate_type)
SELECT id, '', '', 'Apple- Himachal', '', '', '', 'COLD-HUB', 475, 'BOX', 'Weekly' FROM ins;

WITH ins AS (
  INSERT INTO delivery_notes (logistics_id, dc_no, dc_date, customer_name, address, contact_person, contact_no, destination, prepared_by, vehicle_no, gate_in_no, total_qty)
  VALUES ('kern', 'LKE-F-433/26-27', '17-Oct-2026', 'SREE VITTALA EXPORTS PRIVATE LTD', '', '', '', '', 'LORDS AND KINGS ENTERPRISES', '', '', 475)
  RETURNING id
)
INSERT INTO delivery_note_items (delivery_note_id, grn_no, brand, product, variety, lot_no, count, wh_location, dispatched_qty, unit, rate_type)
SELECT id, '', '', 'Apple- Himachal', '', '', '', 'COLD-HUB', 475, 'BOX', 'Weekly' FROM ins;

WITH ins AS (
  INSERT INTO delivery_notes (logistics_id, dc_no, dc_date, customer_name, address, contact_person, contact_no, destination, prepared_by, vehicle_no, gate_in_no, total_qty)
  VALUES ('kern', 'LKE-F-434/26-27', '19-Oct-2026', 'SREE VITTALA EXPORTS PRIVATE LTD', '', '', '', '', 'LORDS AND KINGS ENTERPRISES', '', '', 475)
  RETURNING id
)
INSERT INTO delivery_note_items (delivery_note_id, grn_no, brand, product, variety, lot_no, count, wh_location, dispatched_qty, unit, rate_type)
SELECT id, '', '', 'Apple- Himachal', '', '', '', 'COLD-HUB', 475, 'BOX', 'Weekly' FROM ins;

WITH ins AS (
  INSERT INTO delivery_notes (logistics_id, dc_no, dc_date, customer_name, address, contact_person, contact_no, destination, prepared_by, vehicle_no, gate_in_no, total_qty)
  VALUES ('kern', 'LKE-F-435/26-27', '19-Oct-2026', 'SREE VITTALA EXPORTS PRIVATE LTD', '', '', '', '', 'LORDS AND KINGS ENTERPRISES', '', '', 357)
  RETURNING id
)
INSERT INTO delivery_note_items (delivery_note_id, grn_no, brand, product, variety, lot_no, count, wh_location, dispatched_qty, unit, rate_type)
SELECT id, '', '', 'Apple- Himachal', '', '', '', 'COLD-HUB', 357, 'BOX', 'Weekly' FROM ins;

WITH ins AS (
  INSERT INTO delivery_notes (logistics_id, dc_no, dc_date, customer_name, address, contact_person, contact_no, destination, prepared_by, vehicle_no, gate_in_no, total_qty)
  VALUES ('kern', 'LKE-F-436/26-27', '20-Oct-2026', 'SREE VITTALA EXPORTS PRIVATE LTD', '', '', '', '', 'LORDS AND KINGS ENTERPRISES', '', '', 475)
  RETURNING id
)
INSERT INTO delivery_note_items (delivery_note_id, grn_no, brand, product, variety, lot_no, count, wh_location, dispatched_qty, unit, rate_type)
SELECT id, '', '', 'Apple- Himachal', '', '', '', 'COLD-HUB', 475, 'BOX', 'Weekly' FROM ins;

WITH ins AS (
  INSERT INTO delivery_notes (logistics_id, dc_no, dc_date, customer_name, address, contact_person, contact_no, destination, prepared_by, vehicle_no, gate_in_no, total_qty)
  VALUES ('kern', 'LKE-F-439/26-27', '21-Oct-2026', 'SREE VITTALA EXPORTS PRIVATE LTD', '', '', '', '', 'LORDS AND KINGS ENTERPRISES', '', '', 475)
  RETURNING id
)
INSERT INTO delivery_note_items (delivery_note_id, grn_no, brand, product, variety, lot_no, count, wh_location, dispatched_qty, unit, rate_type)
SELECT id, '', '', 'Apple- Himachal', '', '', '', 'COLD-HUB', 475, 'BOX', 'Weekly' FROM ins;

WITH ins AS (
  INSERT INTO delivery_notes (logistics_id, dc_no, dc_date, customer_name, address, contact_person, contact_no, destination, prepared_by, vehicle_no, gate_in_no, total_qty)
  VALUES ('kern', 'LKE-F-440/26-27', '22-Oct-2026', 'SREE VITTALA EXPORTS PRIVATE LTD', '', '', '', '', 'LORDS AND KINGS ENTERPRISES', '', '', 475)
  RETURNING id
)
INSERT INTO delivery_note_items (delivery_note_id, grn_no, brand, product, variety, lot_no, count, wh_location, dispatched_qty, unit, rate_type)
SELECT id, '', '', 'Apple- Himachal', '', '', '', 'COLD-HUB', 475, 'BOX', 'Weekly' FROM ins;

WITH ins AS (
  INSERT INTO delivery_notes (logistics_id, dc_no, dc_date, customer_name, address, contact_person, contact_no, destination, prepared_by, vehicle_no, gate_in_no, total_qty)
  VALUES ('kern', 'LKE-F-441/26-27', '22-Oct-2026', 'SREE VITTALA EXPORTS PRIVATE LTD', '', '', '', '', 'LORDS AND KINGS ENTERPRISES', '', '', 475)
  RETURNING id
)
INSERT INTO delivery_note_items (delivery_note_id, grn_no, brand, product, variety, lot_no, count, wh_location, dispatched_qty, unit, rate_type)
SELECT id, '', '', 'Apple- Himachal', '', '', '', 'COLD-HUB', 475, 'BOX', 'Weekly' FROM ins;

WITH ins AS (
  INSERT INTO delivery_notes (logistics_id, dc_no, dc_date, customer_name, address, contact_person, contact_no, destination, prepared_by, vehicle_no, gate_in_no, total_qty)
  VALUES ('kern', 'LKE-F-443/26-27', '24-Oct-2026', 'SREE VITTALA EXPORTS PRIVATE LTD', '', '', '', '', 'LORDS AND KINGS ENTERPRISES', '', '', 475)
  RETURNING id
)
INSERT INTO delivery_note_items (delivery_note_id, grn_no, brand, product, variety, lot_no, count, wh_location, dispatched_qty, unit, rate_type)
SELECT id, '', '', 'Apple- Himachal', '', '', '', 'COLD-HUB', 475, 'BOX', 'Weekly' FROM ins;

WITH ins AS (
  INSERT INTO delivery_notes (logistics_id, dc_no, dc_date, customer_name, address, contact_person, contact_no, destination, prepared_by, vehicle_no, gate_in_no, total_qty)
  VALUES ('kern', 'LKE-F-444/26-27', '24-Oct-2026', 'SREE VITTALA EXPORTS PRIVATE LTD', '', '', '', '', 'LORDS AND KINGS ENTERPRISES', '', '', 475)
  RETURNING id
)
INSERT INTO delivery_note_items (delivery_note_id, grn_no, brand, product, variety, lot_no, count, wh_location, dispatched_qty, unit, rate_type)
SELECT id, '', '', 'Apple- Himachal', '', '', '', 'COLD-HUB', 475, 'BOX', 'Weekly' FROM ins;

WITH ins AS (
  INSERT INTO delivery_notes (logistics_id, dc_no, dc_date, customer_name, address, contact_person, contact_no, destination, prepared_by, vehicle_no, gate_in_no, total_qty)
  VALUES ('kern', 'LKE-F-446/26-27', '25-Oct-2026', 'SREE VITTALA EXPORTS PRIVATE LTD', '', '', '', '', 'LORDS AND KINGS ENTERPRISES', '', '', 475)
  RETURNING id
)
INSERT INTO delivery_note_items (delivery_note_id, grn_no, brand, product, variety, lot_no, count, wh_location, dispatched_qty, unit, rate_type)
SELECT id, '', '', 'Apple- Himachal', '', '', '', 'COLD-HUB', 475, 'BOX', 'Weekly' FROM ins;

WITH ins AS (
  INSERT INTO delivery_notes (logistics_id, dc_no, dc_date, customer_name, address, contact_person, contact_no, destination, prepared_by, vehicle_no, gate_in_no, total_qty)
  VALUES ('kern', 'LKE-F-451/26-27', '26-Oct-2026', 'SREE VITTALA EXPORTS PRIVATE LTD', '', '', '', '', 'LORDS AND KINGS ENTERPRISES', '', '', 475)
  RETURNING id
)
INSERT INTO delivery_note_items (delivery_note_id, grn_no, brand, product, variety, lot_no, count, wh_location, dispatched_qty, unit, rate_type)
SELECT id, '', '', 'Apple- Himachal', '', '', '', 'COLD-HUB', 475, 'BOX', 'Weekly' FROM ins;

WITH ins AS (
  INSERT INTO delivery_notes (logistics_id, dc_no, dc_date, customer_name, address, contact_person, contact_no, destination, prepared_by, vehicle_no, gate_in_no, total_qty)
  VALUES ('kern', 'LKE-F-460/26-27', '01-Nov-2026', 'SREE VITTALA EXPORTS PRIVATE LTD', '', '', '', '', 'LORDS AND KINGS ENTERPRISES', '', '', 475)
  RETURNING id
)
INSERT INTO delivery_note_items (delivery_note_id, grn_no, brand, product, variety, lot_no, count, wh_location, dispatched_qty, unit, rate_type)
SELECT id, '', '', 'Apple- Himachal', '', '', '', 'COLD-HUB', 475, 'BOX', 'Weekly' FROM ins;

WITH ins AS (
  INSERT INTO delivery_notes (logistics_id, dc_no, dc_date, customer_name, address, contact_person, contact_no, destination, prepared_by, vehicle_no, gate_in_no, total_qty)
  VALUES ('kern', 'LKE-F-463/26-27', '02-Nov-2026', 'Annora Exports and Imports', '', '', '', '', 'LORDS AND KINGS ENTERPRISES', '', '', 1160)
  RETURNING id
)
INSERT INTO delivery_note_items (delivery_note_id, grn_no, brand, product, variety, lot_no, count, wh_location, dispatched_qty, unit, rate_type)
SELECT id, '', '', 'Apple- Himachal', '', '', '', 'COLD-HUB', 1160, 'BOX', 'Weekly' FROM ins;

WITH ins AS (
  INSERT INTO delivery_notes (logistics_id, dc_no, dc_date, customer_name, address, contact_person, contact_no, destination, prepared_by, vehicle_no, gate_in_no, total_qty)
  VALUES ('kern', 'LKE-F-466/26-27', '02-Nov-2026', 'Star Traders', '', '', '', '', 'LORDS AND KINGS ENTERPRISES', '', '', 200)
  RETURNING id
)
INSERT INTO delivery_note_items (delivery_note_id, grn_no, brand, product, variety, lot_no, count, wh_location, dispatched_qty, unit, rate_type)
SELECT id, '', '', 'Apple- Himachal', '', '', '', 'COLD-HUB', 200, 'BOX', 'Weekly' FROM ins;

WITH ins AS (
  INSERT INTO delivery_notes (logistics_id, dc_no, dc_date, customer_name, address, contact_person, contact_no, destination, prepared_by, vehicle_no, gate_in_no, total_qty)
  VALUES ('kern', 'LKE-F-467/26-27', '03-Nov-2026', 'SREE VITTALA EXPORTS PRIVATE LTD', '', '', '', '', 'LORDS AND KINGS ENTERPRISES', '', '', 475)
  RETURNING id
)
INSERT INTO delivery_note_items (delivery_note_id, grn_no, brand, product, variety, lot_no, count, wh_location, dispatched_qty, unit, rate_type)
SELECT id, '', '', 'Apple- Himachal', '', '', '', 'COLD-HUB', 475, 'BOX', 'Weekly' FROM ins;

WITH ins AS (
  INSERT INTO delivery_notes (logistics_id, dc_no, dc_date, customer_name, address, contact_person, contact_no, destination, prepared_by, vehicle_no, gate_in_no, total_qty)
  VALUES ('kern', 'LKE-F-468/26-27', '03-Nov-2026', 'Sukhras  Traders', '', '', '', '', 'LORDS AND KINGS ENTERPRISES', '', '', 1160)
  RETURNING id
)
INSERT INTO delivery_note_items (delivery_note_id, grn_no, brand, product, variety, lot_no, count, wh_location, dispatched_qty, unit, rate_type)
SELECT id, '', '', 'Apple- Himachal', '', '', '', 'COLD-HUB', 1160, 'BOX', 'Weekly' FROM ins;

WITH ins AS (
  INSERT INTO delivery_notes (logistics_id, dc_no, dc_date, customer_name, address, contact_person, contact_no, destination, prepared_by, vehicle_no, gate_in_no, total_qty)
  VALUES ('kern', 'LKE-F-471/26-27', '04-Nov-2026', 'SREE VITTALA EXPORTS PRIVATE LTD', '', '', '', '', 'LORDS AND KINGS ENTERPRISES', '', '', 475)
  RETURNING id
)
INSERT INTO delivery_note_items (delivery_note_id, grn_no, brand, product, variety, lot_no, count, wh_location, dispatched_qty, unit, rate_type)
SELECT id, '', '', 'Apple- Himachal', '', '', '', 'COLD-HUB', 475, 'BOX', 'Weekly' FROM ins;

WITH ins AS (
  INSERT INTO delivery_notes (logistics_id, dc_no, dc_date, customer_name, address, contact_person, contact_no, destination, prepared_by, vehicle_no, gate_in_no, total_qty)
  VALUES ('kern', 'LKE-F-472/26-27', '05-Nov-2026', 'Annora Exports and Imports', '', '', '', '', 'LORDS AND KINGS ENTERPRISES', '', '', 1160)
  RETURNING id
)
INSERT INTO delivery_note_items (delivery_note_id, grn_no, brand, product, variety, lot_no, count, wh_location, dispatched_qty, unit, rate_type)
SELECT id, '', '', 'Apple- Himachal', '', '', '', 'COLD-HUB', 1160, 'BOX', 'Weekly' FROM ins;

WITH ins AS (
  INSERT INTO delivery_notes (logistics_id, dc_no, dc_date, customer_name, address, contact_person, contact_no, destination, prepared_by, vehicle_no, gate_in_no, total_qty)
  VALUES ('kern', 'LKE-F-473/26-27', '05-Nov-2026', 'Annora Exports and Imports', '', '', '', '', 'LORDS AND KINGS ENTERPRISES', '', '', 860)
  RETURNING id
)
INSERT INTO delivery_note_items (delivery_note_id, grn_no, brand, product, variety, lot_no, count, wh_location, dispatched_qty, unit, rate_type)
SELECT id, '', '', 'Apple- Himachal', '', '', '', 'COLD-HUB', 860, 'BOX', 'Weekly' FROM ins;

WITH ins AS (
  INSERT INTO delivery_notes (logistics_id, dc_no, dc_date, customer_name, address, contact_person, contact_no, destination, prepared_by, vehicle_no, gate_in_no, total_qty)
  VALUES ('kern', 'LKE-F-477/26-27', '06-Nov-2026', 'Annora Exports and Imports', '', '', '', '', 'LORDS AND KINGS ENTERPRISES', '', '', 1140)
  RETURNING id
)
INSERT INTO delivery_note_items (delivery_note_id, grn_no, brand, product, variety, lot_no, count, wh_location, dispatched_qty, unit, rate_type)
SELECT id, '', '', 'Apple- Himachal', '', '', '', 'COLD-HUB', 1140, 'BOX', 'Weekly' FROM ins;

WITH ins AS (
  INSERT INTO delivery_notes (logistics_id, dc_no, dc_date, customer_name, address, contact_person, contact_no, destination, prepared_by, vehicle_no, gate_in_no, total_qty)
  VALUES ('kern', 'LKE-F-479/26-27', '06-Nov-2026', 'SREE VITTALA EXPORTS PRIVATE LTD', '', '', '', '', 'LORDS AND KINGS ENTERPRISES', '', '', 475)
  RETURNING id
)
INSERT INTO delivery_note_items (delivery_note_id, grn_no, brand, product, variety, lot_no, count, wh_location, dispatched_qty, unit, rate_type)
SELECT id, '', '', 'Apple- Himachal', '', '', '', 'COLD-HUB', 475, 'BOX', 'Weekly' FROM ins;

WITH ins AS (
  INSERT INTO delivery_notes (logistics_id, dc_no, dc_date, customer_name, address, contact_person, contact_no, destination, prepared_by, vehicle_no, gate_in_no, total_qty)
  VALUES ('kern', 'LKE-F-480/26-27', '07-Nov-2026', 'SREE VITTALA EXPORTS PRIVATE LTD', '', '', '', '', 'LORDS AND KINGS ENTERPRISES', '', '', 475)
  RETURNING id
)
INSERT INTO delivery_note_items (delivery_note_id, grn_no, brand, product, variety, lot_no, count, wh_location, dispatched_qty, unit, rate_type)
SELECT id, '', '', 'Apple- Himachal', '', '', '', 'COLD-HUB', 475, 'BOX', 'Weekly' FROM ins;

WITH ins AS (
  INSERT INTO delivery_notes (logistics_id, dc_no, dc_date, customer_name, address, contact_person, contact_no, destination, prepared_by, vehicle_no, gate_in_no, total_qty)
  VALUES ('kern', 'LKE-F-485/26-27', '08-Nov-2026', 'Annora Exports and Imports', '', '', '', '', 'LORDS AND KINGS ENTERPRISES', '', '', 1160)
  RETURNING id
)
INSERT INTO delivery_note_items (delivery_note_id, grn_no, brand, product, variety, lot_no, count, wh_location, dispatched_qty, unit, rate_type)
SELECT id, '', '', 'Apple- Himachal', '', '', '', 'COLD-HUB', 1160, 'BOX', 'Weekly' FROM ins;

WITH ins AS (
  INSERT INTO delivery_notes (logistics_id, dc_no, dc_date, customer_name, address, contact_person, contact_no, destination, prepared_by, vehicle_no, gate_in_no, total_qty)
  VALUES ('kern', 'LKE-F-486/26-27', '08-Nov-2026', 'Annora Exports and Imports', '', '', '', '', 'LORDS AND KINGS ENTERPRISES', '', '', 1120)
  RETURNING id
)
INSERT INTO delivery_note_items (delivery_note_id, grn_no, brand, product, variety, lot_no, count, wh_location, dispatched_qty, unit, rate_type)
SELECT id, '', '', 'Apple- Himachal', '', '', '', 'COLD-HUB', 1120, 'BOX', 'Weekly' FROM ins;

WITH ins AS (
  INSERT INTO delivery_notes (logistics_id, dc_no, dc_date, customer_name, address, contact_person, contact_no, destination, prepared_by, vehicle_no, gate_in_no, total_qty)
  VALUES ('kern', 'LKE-F-487/26-27', '08-Nov-2026', 'Annora Exports and Imports', '', '', '', '', 'LORDS AND KINGS ENTERPRISES', '', '', 1423)
  RETURNING id
)
INSERT INTO delivery_note_items (delivery_note_id, grn_no, brand, product, variety, lot_no, count, wh_location, dispatched_qty, unit, rate_type)
SELECT id, '', '', 'Apple- Himachal', '', '', '', 'COLD-HUB', 1423, 'BOX', 'Weekly' FROM ins;

WITH ins AS (
  INSERT INTO delivery_notes (logistics_id, dc_no, dc_date, customer_name, address, contact_person, contact_no, destination, prepared_by, vehicle_no, gate_in_no, total_qty)
  VALUES ('kern', 'LKE-F-484/26-27', '08-Nov-2026', 'Sukhras  Traders', '', '', '', '', 'LORDS AND KINGS ENTERPRISES', '', '', 1240)
  RETURNING id
)
INSERT INTO delivery_note_items (delivery_note_id, grn_no, brand, product, variety, lot_no, count, wh_location, dispatched_qty, unit, rate_type)
SELECT id, '', '', 'Apple- Himachal', '', '', '', 'COLD-HUB', 1240, 'BOX', 'Weekly' FROM ins;

WITH ins AS (
  INSERT INTO delivery_notes (logistics_id, dc_no, dc_date, customer_name, address, contact_person, contact_no, destination, prepared_by, vehicle_no, gate_in_no, total_qty)
  VALUES ('kern', 'LKE-F-489/26-27', '09-Nov-2026', 'SREE VITTALA EXPORTS PRIVATE LTD', '', '', '', '', 'LORDS AND KINGS ENTERPRISES', '', '', 475)
  RETURNING id
)
INSERT INTO delivery_note_items (delivery_note_id, grn_no, brand, product, variety, lot_no, count, wh_location, dispatched_qty, unit, rate_type)
SELECT id, '', '', 'Apple- Himachal', '', '', '', 'COLD-HUB', 475, 'BOX', 'Weekly' FROM ins;

WITH ins AS (
  INSERT INTO delivery_notes (logistics_id, dc_no, dc_date, customer_name, address, contact_person, contact_no, destination, prepared_by, vehicle_no, gate_in_no, total_qty)
  VALUES ('kern', 'LKE-F-490/26-27', '09-Nov-2026', 'Sri Vari Agro Farm Pvt Ltd', '', '', '', '', 'LORDS AND KINGS ENTERPRISES', '', '', 1140)
  RETURNING id
)
INSERT INTO delivery_note_items (delivery_note_id, grn_no, brand, product, variety, lot_no, count, wh_location, dispatched_qty, unit, rate_type)
SELECT id, '', '', 'Apple- Himachal', '', '', '', 'COLD-HUB', 1140, 'BOX', 'Weekly' FROM ins;

WITH ins AS (
  INSERT INTO delivery_notes (logistics_id, dc_no, dc_date, customer_name, address, contact_person, contact_no, destination, prepared_by, vehicle_no, gate_in_no, total_qty)
  VALUES ('kern', 'LKE-F-492/26-27', '10-Nov-2026', 'Karpagam Muthu', '', '', '', '', 'LORDS AND KINGS ENTERPRISES', '', '', 450)
  RETURNING id
)
INSERT INTO delivery_note_items (delivery_note_id, grn_no, brand, product, variety, lot_no, count, wh_location, dispatched_qty, unit, rate_type)
SELECT id, '', '', 'Apple- Himachal', '', '', '', 'COLD-HUB', 450, 'BOX', 'Weekly' FROM ins;

WITH ins AS (
  INSERT INTO delivery_notes (logistics_id, dc_no, dc_date, customer_name, address, contact_person, contact_no, destination, prepared_by, vehicle_no, gate_in_no, total_qty)
  VALUES ('kern', 'LKE-F-491/26-27', '10-Nov-2026', 'SREE VITTALA EXPORTS PRIVATE LTD', '', '', '', '', 'LORDS AND KINGS ENTERPRISES', '', '', 475)
  RETURNING id
)
INSERT INTO delivery_note_items (delivery_note_id, grn_no, brand, product, variety, lot_no, count, wh_location, dispatched_qty, unit, rate_type)
SELECT id, '', '', 'Apple- Himachal', '', '', '', 'COLD-HUB', 475, 'BOX', 'Weekly' FROM ins;

WITH ins AS (
  INSERT INTO delivery_notes (logistics_id, dc_no, dc_date, customer_name, address, contact_person, contact_no, destination, prepared_by, vehicle_no, gate_in_no, total_qty)
  VALUES ('kern', 'LKE-F-493/26-27', '12-Nov-2026', 'SREE VITTALA EXPORTS PRIVATE LTD', '', '', '', '', 'LORDS AND KINGS ENTERPRISES', '', '', 475)
  RETURNING id
)
INSERT INTO delivery_note_items (delivery_note_id, grn_no, brand, product, variety, lot_no, count, wh_location, dispatched_qty, unit, rate_type)
SELECT id, '', '', 'Apple- Himachal', '', '', '', 'COLD-HUB', 475, 'BOX', 'Weekly' FROM ins;

WITH ins AS (
  INSERT INTO delivery_notes (logistics_id, dc_no, dc_date, customer_name, address, contact_person, contact_no, destination, prepared_by, vehicle_no, gate_in_no, total_qty)
  VALUES ('kern', 'LKE-F-494/26-27', '13-Nov-2026', 'SREE VITTALA EXPORTS PRIVATE LTD', '', '', '', '', 'LORDS AND KINGS ENTERPRISES', '', '', 475)
  RETURNING id
)
INSERT INTO delivery_note_items (delivery_note_id, grn_no, brand, product, variety, lot_no, count, wh_location, dispatched_qty, unit, rate_type)
SELECT id, '', '', 'Apple- Himachal', '', '', '', 'COLD-HUB', 475, 'BOX', 'Weekly' FROM ins;

WITH ins AS (
  INSERT INTO delivery_notes (logistics_id, dc_no, dc_date, customer_name, address, contact_person, contact_no, destination, prepared_by, vehicle_no, gate_in_no, total_qty)
  VALUES ('kern', 'LKE-F-495/26-27', '16-Nov-2026', 'SREE VITTALA EXPORTS PRIVATE LTD', '', '', '', '', 'LORDS AND KINGS ENTERPRISES', '', '', 475)
  RETURNING id
)
INSERT INTO delivery_note_items (delivery_note_id, grn_no, brand, product, variety, lot_no, count, wh_location, dispatched_qty, unit, rate_type)
SELECT id, '', '', 'Apple- Himachal', '', '', '', 'COLD-HUB', 475, 'BOX', 'Weekly' FROM ins;

WITH ins AS (
  INSERT INTO delivery_notes (logistics_id, dc_no, dc_date, customer_name, address, contact_person, contact_no, destination, prepared_by, vehicle_no, gate_in_no, total_qty)
  VALUES ('kern', 'LKE-F-496/26-27', '16-Nov-2026', 'Annora Exports and Imports', '', '', '', '', 'LORDS AND KINGS ENTERPRISES', '', '', 1160)
  RETURNING id
)
INSERT INTO delivery_note_items (delivery_note_id, grn_no, brand, product, variety, lot_no, count, wh_location, dispatched_qty, unit, rate_type)
SELECT id, '', '', 'Apple- Himachal', '', '', '', 'COLD-HUB', 1160, 'BOX', 'Weekly' FROM ins;

WITH ins AS (
  INSERT INTO delivery_notes (logistics_id, dc_no, dc_date, customer_name, address, contact_person, contact_no, destination, prepared_by, vehicle_no, gate_in_no, total_qty)
  VALUES ('kern', 'LKE-F-405/26-27', '07-Oct-2026', 'Annora Exports and Imports', '', '', '', '', 'LORDS AND KINGS ENTERPRISES', '', '', 950)
  RETURNING id
)
INSERT INTO delivery_note_items (delivery_note_id, grn_no, brand, product, variety, lot_no, count, wh_location, dispatched_qty, unit, rate_type)
SELECT id, '', '', 'Apple -Kashmir', '', '', '', 'COLD-HUB', 950, 'BOX', 'Weekly' FROM ins;

WITH ins AS (
  INSERT INTO delivery_notes (logistics_id, dc_no, dc_date, customer_name, address, contact_person, contact_no, destination, prepared_by, vehicle_no, gate_in_no, total_qty)
  VALUES ('kern', 'LKE-F-422/26-27', '12-Oct-2026', 'Annora Exports and Imports', '', '', '', '', 'LORDS AND KINGS ENTERPRISES', '', '', 860)
  RETURNING id
)
INSERT INTO delivery_note_items (delivery_note_id, grn_no, brand, product, variety, lot_no, count, wh_location, dispatched_qty, unit, rate_type)
SELECT id, '', '', 'Apple -Kashmir', '', '', '', 'COLD-HUB', 860, 'BOX', 'Weekly' FROM ins;

WITH ins AS (
  INSERT INTO delivery_notes (logistics_id, dc_no, dc_date, customer_name, address, contact_person, contact_no, destination, prepared_by, vehicle_no, gate_in_no, total_qty)
  VALUES ('kern', 'LKE-F-438/26-27', '20-Oct-2026', 'Sukhras  Traders', '', '', '', '', 'LORDS AND KINGS ENTERPRISES', '', '', 1660)
  RETURNING id
)
INSERT INTO delivery_note_items (delivery_note_id, grn_no, brand, product, variety, lot_no, count, wh_location, dispatched_qty, unit, rate_type)
SELECT id, '', '', 'Apple -Kashmir', '', '', '', 'COLD-HUB', 1660, 'BOX', 'Weekly' FROM ins;

WITH ins AS (
  INSERT INTO delivery_notes (logistics_id, dc_no, dc_date, customer_name, address, contact_person, contact_no, destination, prepared_by, vehicle_no, gate_in_no, total_qty)
  VALUES ('kern', 'LKE-F-449/26-27', '25-Oct-2026', 'Sukhras  Traders', '', '', '', '', 'LORDS AND KINGS ENTERPRISES', '', '', 1160)
  RETURNING id
)
INSERT INTO delivery_note_items (delivery_note_id, grn_no, brand, product, variety, lot_no, count, wh_location, dispatched_qty, unit, rate_type)
SELECT id, '', '', 'Apple -Kashmir', '', '', '', 'COLD-HUB', 1160, 'BOX', 'Weekly' FROM ins;

WITH ins AS (
  INSERT INTO delivery_notes (logistics_id, dc_no, dc_date, customer_name, address, contact_person, contact_no, destination, prepared_by, vehicle_no, gate_in_no, total_qty)
  VALUES ('kern', 'LKE-F-450/26-27', '25-Oct-2026', 'Sri Vari Agro Farm Pvt Ltd', '', '', '', '', 'LORDS AND KINGS ENTERPRISES', '', '', 1160)
  RETURNING id
)
INSERT INTO delivery_note_items (delivery_note_id, grn_no, brand, product, variety, lot_no, count, wh_location, dispatched_qty, unit, rate_type)
SELECT id, '', '', 'Apple -Kashmir', '', '', '', 'COLD-HUB', 1160, 'BOX', 'Weekly' FROM ins;

WITH ins AS (
  INSERT INTO delivery_notes (logistics_id, dc_no, dc_date, customer_name, address, contact_person, contact_no, destination, prepared_by, vehicle_no, gate_in_no, total_qty)
  VALUES ('kern', 'LKE-F-453/26-27', '26-Oct-2026', 'Sukhras  Traders', '', '', '', '', 'LORDS AND KINGS ENTERPRISES', '', '', 1160)
  RETURNING id
)
INSERT INTO delivery_note_items (delivery_note_id, grn_no, brand, product, variety, lot_no, count, wh_location, dispatched_qty, unit, rate_type)
SELECT id, '', '', 'Apple -Kashmir', '', '', '', 'COLD-HUB', 1160, 'BOX', 'Weekly' FROM ins;

WITH ins AS (
  INSERT INTO delivery_notes (logistics_id, dc_no, dc_date, customer_name, address, contact_person, contact_no, destination, prepared_by, vehicle_no, gate_in_no, total_qty)
  VALUES ('kern', 'LKE-F-454/26-27', '26-Oct-2026', 'Sri Vari Agro Farm Pvt Ltd', '', '', '', '', 'LORDS AND KINGS ENTERPRISES', '', '', 1660)
  RETURNING id
)
INSERT INTO delivery_note_items (delivery_note_id, grn_no, brand, product, variety, lot_no, count, wh_location, dispatched_qty, unit, rate_type)
SELECT id, '', '', 'Apple -Kashmir', '', '', '', 'COLD-HUB', 1660, 'BOX', 'Weekly' FROM ins;

WITH ins AS (
  INSERT INTO delivery_notes (logistics_id, dc_no, dc_date, customer_name, address, contact_person, contact_no, destination, prepared_by, vehicle_no, gate_in_no, total_qty)
  VALUES ('kern', 'LKE-F-455/26-27', '27-Oct-2026', 'Sri Vari Agro Farm Pvt Ltd', '', '', '', '', 'LORDS AND KINGS ENTERPRISES', '', '', 1660)
  RETURNING id
)
INSERT INTO delivery_note_items (delivery_note_id, grn_no, brand, product, variety, lot_no, count, wh_location, dispatched_qty, unit, rate_type)
SELECT id, '', '', 'Apple -Kashmir', '', '', '', 'COLD-HUB', 1660, 'BOX', 'Weekly' FROM ins;

WITH ins AS (
  INSERT INTO delivery_notes (logistics_id, dc_no, dc_date, customer_name, address, contact_person, contact_no, destination, prepared_by, vehicle_no, gate_in_no, total_qty)
  VALUES ('kern', 'LKE-F-459/26-27', '30-Oct-2026', 'Sri Vari Agro Farm Pvt Ltd', '', '', '', '', 'LORDS AND KINGS ENTERPRISES', '', '', 1263)
  RETURNING id
)
INSERT INTO delivery_note_items (delivery_note_id, grn_no, brand, product, variety, lot_no, count, wh_location, dispatched_qty, unit, rate_type)
SELECT id, '', '', 'Apple -Kashmir', '', '', '', 'COLD-HUB', 1263, 'BOX', 'Weekly' FROM ins;

WITH ins AS (
  INSERT INTO delivery_notes (logistics_id, dc_no, dc_date, customer_name, address, contact_person, contact_no, destination, prepared_by, vehicle_no, gate_in_no, total_qty)
  VALUES ('kern', 'LKE-F-384/26-27', '01-Oct-2026', 'AAKASH ENTERPRISES', '', '', '', '', 'LORDS AND KINGS ENTERPRISES', '', '', 1160)
  RETURNING id
)
INSERT INTO delivery_note_items (delivery_note_id, grn_no, brand, product, variety, lot_no, count, wh_location, dispatched_qty, unit, rate_type)
SELECT id, '', '', 'Gala Apple', '', '', '', 'COLD-HUB', 1160, 'BOX', 'Weekly' FROM ins;

WITH ins AS (
  INSERT INTO delivery_notes (logistics_id, dc_no, dc_date, customer_name, address, contact_person, contact_no, destination, prepared_by, vehicle_no, gate_in_no, total_qty)
  VALUES ('kern', 'LKE-F-390/26-27', '03-Oct-2026', 'AAKASH ENTERPRISES', '', '', '', '', 'LORDS AND KINGS ENTERPRISES', '', '', 1160)
  RETURNING id
)
INSERT INTO delivery_note_items (delivery_note_id, grn_no, brand, product, variety, lot_no, count, wh_location, dispatched_qty, unit, rate_type)
SELECT id, '', '', 'Gala Apple', '', '', '', 'COLD-HUB', 1160, 'BOX', 'Weekly' FROM ins;

WITH ins AS (
  INSERT INTO delivery_notes (logistics_id, dc_no, dc_date, customer_name, address, contact_person, contact_no, destination, prepared_by, vehicle_no, gate_in_no, total_qty)
  VALUES ('kern', 'LKE-F-395/26-27', '04-Oct-2026', 'AAKASH ENTERPRISES', '', '', '', '', 'LORDS AND KINGS ENTERPRISES', '', '', 1160)
  RETURNING id
)
INSERT INTO delivery_note_items (delivery_note_id, grn_no, brand, product, variety, lot_no, count, wh_location, dispatched_qty, unit, rate_type)
SELECT id, '', '', 'Gala Apple', '', '', '', 'COLD-HUB', 1160, 'BOX', 'Weekly' FROM ins;

WITH ins AS (
  INSERT INTO delivery_notes (logistics_id, dc_no, dc_date, customer_name, address, contact_person, contact_no, destination, prepared_by, vehicle_no, gate_in_no, total_qty)
  VALUES ('kern', 'LKE-F-404/26-27', '07-Oct-2026', 'Annora Exports and Imports', '', '', '', '', 'LORDS AND KINGS ENTERPRISES', '', '', 580)
  RETURNING id
)
INSERT INTO delivery_note_items (delivery_note_id, grn_no, brand, product, variety, lot_no, count, wh_location, dispatched_qty, unit, rate_type)
SELECT id, '', '', 'Gala Apple', '', '', '', 'COLD-HUB', 580, 'BOX', 'Weekly' FROM ins;

WITH ins AS (
  INSERT INTO delivery_notes (logistics_id, dc_no, dc_date, customer_name, address, contact_person, contact_no, destination, prepared_by, vehicle_no, gate_in_no, total_qty)
  VALUES ('kern', 'LKE-F-407/26-27', '08-Oct-2026', 'Annora Exports and Imports', '', '', '', '', 'LORDS AND KINGS ENTERPRISES', '', '', 523)
  RETURNING id
)
INSERT INTO delivery_note_items (delivery_note_id, grn_no, brand, product, variety, lot_no, count, wh_location, dispatched_qty, unit, rate_type)
SELECT id, '', '', 'Gala Apple', '', '', '', 'COLD-HUB', 523, 'BOX', 'Weekly' FROM ins;

WITH ins AS (
  INSERT INTO delivery_notes (logistics_id, dc_no, dc_date, customer_name, address, contact_person, contact_no, destination, prepared_by, vehicle_no, gate_in_no, total_qty)
  VALUES ('kern', 'LKE-F-403/26-27', '06-Oct-2026', 'Blue International', '', '', '', '', 'LORDS AND KINGS ENTERPRISES', '', '', 1040)
  RETURNING id
)
INSERT INTO delivery_note_items (delivery_note_id, grn_no, brand, product, variety, lot_no, count, wh_location, dispatched_qty, unit, rate_type)
SELECT id, '', '', 'Kiwi Fruit', '', '', '', 'COLD-HUB', 1040, 'BOX', 'Weekly' FROM ins;

WITH ins AS (
  INSERT INTO delivery_notes (logistics_id, dc_no, dc_date, customer_name, address, contact_person, contact_no, destination, prepared_by, vehicle_no, gate_in_no, total_qty)
  VALUES ('kern', 'LKE-F-412/26-27', '09-Oct-2026', 'LUNARRS TRADERS', '', '', '', '', 'LORDS AND KINGS ENTERPRISES', '', '', 572)
  RETURNING id
)
INSERT INTO delivery_note_items (delivery_note_id, grn_no, brand, product, variety, lot_no, count, wh_location, dispatched_qty, unit, rate_type)
SELECT id, '', '', 'Kiwi Fruit', '', '', '', 'COLD-HUB', 572, 'BOX', 'Weekly' FROM ins;

WITH ins AS (
  INSERT INTO delivery_notes (logistics_id, dc_no, dc_date, customer_name, address, contact_person, contact_no, destination, prepared_by, vehicle_no, gate_in_no, total_qty)
  VALUES ('kern', 'LKE-F-420/26-27', '11-Oct-2026', 'Taruna Exports', '', '', '', '', 'LORDS AND KINGS ENTERPRISES', '', '', 832)
  RETURNING id
)
INSERT INTO delivery_note_items (delivery_note_id, grn_no, brand, product, variety, lot_no, count, wh_location, dispatched_qty, unit, rate_type)
SELECT id, '', '', 'Kiwi Fruit', '', '', '', 'COLD-HUB', 832, 'BOX', 'Weekly' FROM ins;

WITH ins AS (
  INSERT INTO delivery_notes (logistics_id, dc_no, dc_date, customer_name, address, contact_person, contact_no, destination, prepared_by, vehicle_no, gate_in_no, total_qty)
  VALUES ('kern', 'LKE-F-456/26-27', '28-Oct-2026', 'Sukhras  Traders', '', '', '', '', 'LORDS AND KINGS ENTERPRISES', '', '', 1664)
  RETURNING id
)
INSERT INTO delivery_note_items (delivery_note_id, grn_no, brand, product, variety, lot_no, count, wh_location, dispatched_qty, unit, rate_type)
SELECT id, '', '', 'Orange, Imported', '', '', '', 'COLD-HUB', 1664, 'BOX', 'Weekly' FROM ins;

WITH ins AS (
  INSERT INTO delivery_notes (logistics_id, dc_no, dc_date, customer_name, address, contact_person, contact_no, destination, prepared_by, vehicle_no, gate_in_no, total_qty)
  VALUES ('kern', 'LKE-F-457/26-27', '29-Oct-2026', 'Sukhras  Traders', '', '', '', '', 'LORDS AND KINGS ENTERPRISES', '', '', 1664)
  RETURNING id
)
INSERT INTO delivery_note_items (delivery_note_id, grn_no, brand, product, variety, lot_no, count, wh_location, dispatched_qty, unit, rate_type)
SELECT id, '', '', 'Orange, Imported', '', '', '', 'COLD-HUB', 1664, 'BOX', 'Weekly' FROM ins;

WITH ins AS (
  INSERT INTO delivery_notes (logistics_id, dc_no, dc_date, customer_name, address, contact_person, contact_no, destination, prepared_by, vehicle_no, gate_in_no, total_qty)
  VALUES ('kern', 'LKE-F-458/26-27', '29-Oct-2026', 'Sri Vari Agro Farm Pvt Ltd', '', '', '', '', 'LORDS AND KINGS ENTERPRISES', '', '', 1160)
  RETURNING id
)
INSERT INTO delivery_note_items (delivery_note_id, grn_no, brand, product, variety, lot_no, count, wh_location, dispatched_qty, unit, rate_type)
SELECT id, '', '', 'Orange, Imported', '', '', '', 'COLD-HUB', 1160, 'BOX', 'Weekly' FROM ins;

WITH ins AS (
  INSERT INTO delivery_notes (logistics_id, dc_no, dc_date, customer_name, address, contact_person, contact_no, destination, prepared_by, vehicle_no, gate_in_no, total_qty)
  VALUES ('kern', 'LKE-F-464/26-27', '02-Nov-2026', 'Karpagam Muthu', '', '', '', '', 'LORDS AND KINGS ENTERPRISES', '', '', 1664)
  RETURNING id
)
INSERT INTO delivery_note_items (delivery_note_id, grn_no, brand, product, variety, lot_no, count, wh_location, dispatched_qty, unit, rate_type)
SELECT id, '', '', 'Orange, Imported', '', '', '', 'COLD-HUB', 1664, 'BOX', 'Weekly' FROM ins;

WITH ins AS (
  INSERT INTO delivery_notes (logistics_id, dc_no, dc_date, customer_name, address, contact_person, contact_no, destination, prepared_by, vehicle_no, gate_in_no, total_qty)
  VALUES ('kern', 'LKE-F-470/26-27', '04-Nov-2026', 'Karpagam Muthu', '', '', '', '', 'LORDS AND KINGS ENTERPRISES', '', '', 1160)
  RETURNING id
)
INSERT INTO delivery_note_items (delivery_note_id, grn_no, brand, product, variety, lot_no, count, wh_location, dispatched_qty, unit, rate_type)
SELECT id, '', '', 'Orange, Imported', '', '', '', 'COLD-HUB', 1160, 'BOX', 'Weekly' FROM ins;

WITH ins AS (
  INSERT INTO delivery_notes (logistics_id, dc_no, dc_date, customer_name, address, contact_person, contact_no, destination, prepared_by, vehicle_no, gate_in_no, total_qty)
  VALUES ('kern', 'LKE-F-474/26-27', '05-Nov-2026', 'Karpagam Muthu', '', '', '', '', 'LORDS AND KINGS ENTERPRISES', '', '', 1244)
  RETURNING id
)
INSERT INTO delivery_note_items (delivery_note_id, grn_no, brand, product, variety, lot_no, count, wh_location, dispatched_qty, unit, rate_type)
SELECT id, '', '', 'Orange, Imported', '', '', '', 'COLD-HUB', 1244, 'BOX', 'Weekly' FROM ins;

WITH ins AS (
  INSERT INTO delivery_notes (logistics_id, dc_no, dc_date, customer_name, address, contact_person, contact_no, destination, prepared_by, vehicle_no, gate_in_no, total_qty)
  VALUES ('kern', 'LKE-F-478/26-27', '06-Nov-2026', 'Karpagam Muthu', '', '', '', '', 'LORDS AND KINGS ENTERPRISES', '', '', 1160)
  RETURNING id
)
INSERT INTO delivery_note_items (delivery_note_id, grn_no, brand, product, variety, lot_no, count, wh_location, dispatched_qty, unit, rate_type)
SELECT id, '', '', 'Orange, Imported', '', '', '', 'COLD-HUB', 1160, 'BOX', 'Weekly' FROM ins;

WITH ins AS (
  INSERT INTO delivery_notes (logistics_id, dc_no, dc_date, customer_name, address, contact_person, contact_no, destination, prepared_by, vehicle_no, gate_in_no, total_qty)
  VALUES ('kern', 'LKE-F-483/26-27', '08-Nov-2026', 'Karpagam Muthu', '', '', '', '', 'LORDS AND KINGS ENTERPRISES', '', '', 1460)
  RETURNING id
)
INSERT INTO delivery_note_items (delivery_note_id, grn_no, brand, product, variety, lot_no, count, wh_location, dispatched_qty, unit, rate_type)
SELECT id, '', '', 'Orange, Imported', '', '', '', 'COLD-HUB', 1460, 'BOX', 'Weekly' FROM ins;

WITH ins AS (
  INSERT INTO delivery_notes (logistics_id, dc_no, dc_date, customer_name, address, contact_person, contact_no, destination, prepared_by, vehicle_no, gate_in_no, total_qty)
  VALUES ('kern', 'LKE-F-488/26-27', '09-Nov-2026', 'Karpagam Muthu', '', '', '', '', 'LORDS AND KINGS ENTERPRISES', '', '', 1660)
  RETURNING id
)
INSERT INTO delivery_note_items (delivery_note_id, grn_no, brand, product, variety, lot_no, count, wh_location, dispatched_qty, unit, rate_type)
SELECT id, '', '', 'Orange, Imported', '', '', '', 'COLD-HUB', 1660, 'BOX', 'Weekly' FROM ins;

WITH ins AS (
  INSERT INTO delivery_notes (logistics_id, dc_no, dc_date, customer_name, address, contact_person, contact_no, destination, prepared_by, vehicle_no, gate_in_no, total_qty)
  VALUES ('kern', 'LKE-F-428/26-27', '15-Oct-2026', 'Sukhras  Traders', '', '', '', '', 'LORDS AND KINGS ENTERPRISES', '', '', 1093)
  RETURNING id
)
INSERT INTO delivery_note_items (delivery_note_id, grn_no, brand, product, variety, lot_no, count, wh_location, dispatched_qty, unit, rate_type)
SELECT id, '', '', 'Pear', '', '', '', 'COLD-HUB', 1093, 'BOX', 'Weekly' FROM ins;
