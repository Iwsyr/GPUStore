/*
 Navicat Premium Data Transfer

 Source Server         : MySQL
 Source Server Type    : MySQL
 Source Server Version : 80042
 Source Host           : localhost:3306
 Source Schema         : gpustore

 Target Server Type    : MySQL
 Target Server Version : 80042
 File Encoding         : 65001

 Date: 22/06/2026 14:24:04
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for addresses
-- ----------------------------
DROP TABLE IF EXISTS `addresses`;
CREATE TABLE `addresses`  (
  `id` int(0) NOT NULL AUTO_INCREMENT,
  `user_id` int(0) NULL DEFAULT NULL,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `tel` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `country` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `province` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `city` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `county` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `addressDetail` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `address` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `isDefault` tinyint(1) NULL DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `user_id`(`user_id`) USING BTREE,
  CONSTRAINT `addresses_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of addresses
-- ----------------------------
INSERT INTO `addresses` VALUES (1, 1, 'Test', '13300000000', '', '北京市', '北京市', '东城区', '11', '北京市北京市东城区11', 0);
INSERT INTO `addresses` VALUES (2, 2, 'Test2', '13500000000', '', '广东省', '广州市', '从化区', '111', '广东省广州市从化区111', 0);
INSERT INTO `addresses` VALUES (5, 2, 'Test000', '13500000000', '', '天津市', '天津市', '和平区', '111', '天津市天津市和平区111', 1);
INSERT INTO `addresses` VALUES (6, 1, 'test1113', '15800000000', '', '湖南省', '长沙市', '芙蓉区', 'te', '湖南省长沙市芙蓉区te', 1);

-- ----------------------------
-- Table structure for carts
-- ----------------------------
DROP TABLE IF EXISTS `carts`;
CREATE TABLE `carts`  (
  `id` int(0) NOT NULL AUTO_INCREMENT,
  `user_id` int(0) NULL DEFAULT NULL,
  `product_id` int(0) NULL DEFAULT NULL,
  `quantity` int(0) NULL DEFAULT 1,
  `added_at` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `product_id`(`product_id`) USING BTREE,
  INDEX `idx_user_cart`(`user_id`, `product_id`) USING BTREE,
  CONSTRAINT `carts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `carts_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 14 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of carts
-- ----------------------------
INSERT INTO `carts` VALUES (5, 2, 16, 1, '2026-04-29 15:38:39');
INSERT INTO `carts` VALUES (17, 1, 5, 1, '2026-06-22 14:17:29');
INSERT INTO `carts` VALUES (18, 2, 1, 1, '2026-06-22 14:18:40');

-- ----------------------------
-- Table structure for categories
-- ----------------------------
DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories`  (
  `id` int(0) NOT NULL,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of categories
-- ----------------------------
INSERT INTO `categories` VALUES (0, '全部分类');
INSERT INTO `categories` VALUES (1, '50系列');
INSERT INTO `categories` VALUES (2, '40系列');
INSERT INTO `categories` VALUES (3, '30系列');
INSERT INTO `categories` VALUES (4, '显卡配件');

-- ----------------------------
-- Table structure for favorites
-- ----------------------------
DROP TABLE IF EXISTS `favorites`;
CREATE TABLE `favorites`  (
  `id` int(0) NOT NULL AUTO_INCREMENT,
  `user_id` int(0) NULL DEFAULT NULL,
  `product_id` int(0) NULL DEFAULT NULL COMMENT '关联商品ID',
  `type` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT 'collect=收藏, like=点赞',
  `target_type` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'product' COMMENT 'product=商品, news=文章',
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `desc_text` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `created_at` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `user_id`(`user_id`) USING BTREE,
  INDEX `favorites_ibfk_2`(`product_id`) USING BTREE,
  CONSTRAINT `favorites_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `favorites_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 37 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of favorites
-- ----------------------------
INSERT INTO `favorites` VALUES (2, 1, 1, 'like', 'product', '', '', '2026-04-28 16:36:20');
INSERT INTO `favorites` VALUES (4, 1, 2, 'like', 'product', '', '', '2026-04-28 16:36:22');
INSERT INTO `favorites` VALUES (5, 2, 7, 'collect', 'product', '', '', '2026-04-28 16:39:53');
INSERT INTO `favorites` VALUES (7, 2, 1, 'like', 'product', '', '', '2026-04-28 16:41:03');
INSERT INTO `favorites` VALUES (9, 2, 2, 'like', 'product', '', '', '2026-04-28 16:41:06');
INSERT INTO `favorites` VALUES (18, 2, 16, 'collect', 'product', '', '', '2026-04-29 15:38:38');
INSERT INTO `favorites` VALUES (20, 1, 4, 'like', 'product', '', '', '2026-04-29 19:42:11');
INSERT INTO `favorites` VALUES (22, 2, 4, 'collect', 'news', '显卡常见故障排查', '显卡可能出现黑屏、花屏、自动重启等故障，通过一系列排查步骤可快速定位问题并解决。', '2026-04-29 19:42:31');
INSERT INTO `favorites` VALUES (37, 1, 4, 'collect', 'news', '显卡常见故障排查', '显卡可能出现黑屏、花屏、自动重启等故障，通过一系列排查步骤可快速定位问题并解决。', '2026-06-22 13:24:35');
INSERT INTO `favorites` VALUES (38, 1, 1, 'collect', 'product', '', '', '2026-06-22 14:17:21');
INSERT INTO `favorites` VALUES (39, 1, 2, 'collect', 'product', '', '', '2026-06-22 14:17:24');
INSERT INTO `favorites` VALUES (40, 1, 5, 'collect', 'product', '', '', '2026-06-22 14:17:27');
INSERT INTO `favorites` VALUES (41, 2, 1, 'collect', 'product', '', '', '2026-06-22 14:18:38');

-- ----------------------------
-- Table structure for inventory_logs
-- ----------------------------
DROP TABLE IF EXISTS `inventory_logs`;
CREATE TABLE `inventory_logs`  (
  `id` int(0) NOT NULL AUTO_INCREMENT,
  `admin_id` int(0) NOT NULL,
  `product_id` int(0) NOT NULL,
  `old_stock` int(0) NOT NULL DEFAULT 0,
  `new_stock` int(0) NOT NULL DEFAULT 0,
  `change_reason` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT '',
  `created_at` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `admin_id`(`admin_id`) USING BTREE,
  INDEX `product_id`(`product_id`) USING BTREE,
  CONSTRAINT `inventory_logs_ibfk_1` FOREIGN KEY (`admin_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `inventory_logs_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of inventory_logs
-- ----------------------------
INSERT INTO `inventory_logs` VALUES (1, 1, 1, 50, 60, '管理员手动修改库存', '2026-06-22 11:29:24');
INSERT INTO `inventory_logs` VALUES (2, 1, 5, 50, 5, '管理员手动修改库存', '2026-06-22 11:29:38');
INSERT INTO `inventory_logs` VALUES (3, 1, 6, 50, 0, '管理员手动修改库存', '2026-06-22 11:29:46');
INSERT INTO `inventory_logs` VALUES (4, 1, 7, 50, 20, '管理员手动修改库存', '2026-06-22 11:29:51');
INSERT INTO `inventory_logs` VALUES (5, 1, 6, 0, 30, '管理员手动修改库存', '2026-06-22 13:05:50');
INSERT INTO `inventory_logs` VALUES (6, 1, 8, 50, 0, '管理员手动修改库存', '2026-06-22 13:06:58');

-- ----------------------------
-- Table structure for news
-- ----------------------------
DROP TABLE IF EXISTS `news`;
CREATE TABLE `news`  (
  `id` int(0) NOT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `image_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `publish_date` date NULL DEFAULT NULL,
  `detail_html` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of news
-- ----------------------------
INSERT INTO `news` VALUES (1, '显卡性能选购指南', '选购显卡时需综合考虑显卡的核心参数，如显存容量、显存类型、核心频率等，以满足不同游戏或设计软件的硬件需求。', '1.jpg', '2025-01-15', '<p><span style=\"margin-left: 30px\">在显卡市场中，NVIDIA 和 AMD 是两大主流品牌。NVIDIA 的 GeForce 系列显卡凭借先进的 RTX 实时光追技术和 DLSS 超采样技术，在游戏领域占据优势；AMD 的 Radeon 系列显卡则以高性价比和强大的计算能力著称。</span><br><br><span style=\"margin-left: 30px\">对于游戏玩家，1080p 分辨率游戏推荐选择 6GB 显存以上的显卡，如 GTX 1660 或 RX 580；2K 分辨率游戏则需要 RTX 3060 或 RX 6700 XT 等显卡；4K 分辨率游戏则至少需要 RTX 3080 或 RX 6900 XT 级别的显卡。对于从事 3D 建模、视频编辑等专业工作的用户，建议选择专业显卡，如 NVIDIA 的 Quadro 系列或 AMD 的 Radeon Pro 系列，这些显卡经过专业软件认证，能提供更稳定的性能表现。</span><br><br><span style=\"margin-left: 30px\">此外，还需关注显卡的散热设计和功耗，确保机箱有足够的空间和散热能力来容纳显卡，电源的功率也需满足显卡的需求，一般建议电源功率为显卡功耗的 1.5 - 2 倍，以保证系统稳定运行。</span></p>');
INSERT INTO `news` VALUES (2, '显卡安装步骤详解', '正确安装显卡是确保电脑稳定运行的关键，涉及到硬件安装和驱动程序的配置。', '2.jpg', '2025-03-20', '<p><span style=\"margin-left: 30px\">安装显卡前，需先准备好工具，如螺丝刀、防静电手环等，确保在无静电环境下操作。首先关闭电脑并拔掉电源线，打开机箱侧板，找到主板上的 PCI-E ×16 插槽，这是专门用于安装显卡的插槽。</span><br><br><span style=\"margin-left: 30px\">将显卡对准插槽，垂直向下均匀用力插入，确保金手指完全插入插槽，然后用螺丝将显卡支架固定在机箱的 PCI-E 插槽位置。如果显卡需要外接供电，根据显卡的供电接口类型（6 针、8 针等），连接相应的电源线到显卡上。<span style=\"margin-left: 30px\">安装完成后，合上机箱侧板，连接电脑显示器到显卡的输出接口（HDMI、DisplayPort 等），启动电脑。此时系统会自动检测到新显卡，并尝试安装基础驱动，但建议到显卡官方网站下载最新的官方驱动程序进行安装，以获得最佳性能和兼容性。</span><br><br><span style=\"margin-left: 30px\">在安装驱动时，注意选择正确的操作系统版本和显卡型号，安装过程中可能需要重启电脑，按照提示完成安装后，显卡就成功安装并可使用了。</span></p>');
INSERT INTO `news` VALUES (3, '显卡驱动更新技巧', '及时更新显卡驱动能提升显卡性能、优化游戏兼容性和修复已知漏洞，可通过多种方式进行驱动更新。', '3.jpg', '2025-04-10', '<p><span style=\"margin-left: 30px\">最直接的方法是访问显卡官方驱动下载页面</span>在更新驱动前，建议备份当前驱动程序，以便在新驱动出现问题时可以恢复到之前的版本。同时，更新驱动后如果遇到系统不稳定或显示异常等问题，可尝试回滚驱动程序到之前的版本，通常在设备管理器的显卡属性窗口中，驱动程序选项卡下有回滚驱动程序的选项。</span><br><br><span style=\"margin-left: 30px\">对于游戏玩家，建议在游戏发布大型更新或新游戏发布时，检查显卡驱动是否有更新，因为游戏开发者会与显卡厂商合作优化游戏性能，新的驱动程序可能包含针对新游戏的性能提升和兼容性修复。</span></p >');
INSERT INTO `news` VALUES (4, '显卡常见故障排查', '显卡可能出现黑屏、花屏、自动重启等故障，通过一系列排查步骤可快速定位问题并解决。', '4.jpg', '2025-05-18', '<p><span style=\"margin-left: 30px\">当显卡出现黑屏故障时，首先要检查显卡是否正确安装在 PCI-E 插槽中，检查显卡的外接供电线是否连接牢固，电源是否有足够的功率供应。同时检查显示器的连接线是否插紧在显卡的输出接口上，尝试重新插拔显示器线缆和显卡供电线缆。</span><br><br><span style=\"margin-left: 30px\">如果问题依旧，可尝试进入电脑的 BIOS 设置，检查是否启用了正确的显卡作为首要显示设备，有些主板同时配备了集成显卡和独立显卡，需要在 BIOS 中设置独立显卡为首选。还可以尝试在 BIOS 中将显卡的核心频率和显存频率恢复到默认值，排除超频导致的问题。花屏问题可能是由于显卡驱动程序损坏或不兼容引起的，可尝试卸载当前驱动程序并重新安装官方最新版本的驱动。也可能是显卡的散热出现问题，导致显卡过热而出现花屏，检查显卡的风扇是否正常运转，清理显卡散热器上的灰尘，确保显卡散热良好。</span><br><br><span style=\"margin-left: 30px\">显卡导致的自动重启问题，通常是由于显卡过热保护或显卡故障引起的。检查显卡的温度监控软件，如 MSI Afterburner 等，查看显卡在高负载时的温度是否过高。如果温度过高，除了清理散热器和风扇外，还可以考虑更换散热硅脂或升级散热系统。若显卡在低负载下也出现自动重启，可能是显卡的电容或其他元件损坏，建议联系显卡厂商的售后服务中心进行检测和维修。</span></p>');

-- ----------------------------
-- Table structure for order_items
-- ----------------------------
DROP TABLE IF EXISTS `order_items`;
CREATE TABLE `order_items`  (
  `id` int(0) NOT NULL AUTO_INCREMENT,
  `order_id` int(0) NOT NULL,
  `product_id` int(0) NOT NULL,
  `product_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `price` decimal(10, 2) NOT NULL,
  `quantity` int(0) NOT NULL DEFAULT 1,
  `image_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `order_id`(`order_id`) USING BTREE,
  INDEX `product_id`(`product_id`) USING BTREE,
  CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of order_items
-- ----------------------------
INSERT INTO `order_items` VALUES (3, 3, 2, 'NVIDIA RTX 5080', 9999.00, 1, '@/assets/Index/5080.jpg');
INSERT INTO `order_items` VALUES (4, 4, 1, 'NVIDIA RTX 5090D', 21100.00, 1, '@/assets/Index/5090D.jpg');
INSERT INTO `order_items` VALUES (5, 5, 5, 'NVIDIA RTX 4090', 12500.00, 1, '@/assets/Index/4090.jpg');

-- ----------------------------
-- Table structure for orders
-- ----------------------------
DROP TABLE IF EXISTS `orders`;
CREATE TABLE `orders`  (
  `id` int(0) NOT NULL AUTO_INCREMENT,
  `user_id` int(0) NULL DEFAULT NULL,
  `total_price` decimal(10, 2) NOT NULL,
  `status` enum('pending','paid','shipped','delivered','completed','cancelled') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'pending',
  `created_at` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `user_id`(`user_id`) USING BTREE,
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of orders
-- ----------------------------
INSERT INTO `orders` VALUES (3, 1, 9999.00, 'shipped', '2026-06-22 13:07:19');
INSERT INTO `orders` VALUES (4, 1, 21100.00, 'completed', '2026-06-22 13:24:02');
INSERT INTO `orders` VALUES (5, 1, 12500.00, 'pending', '2026-06-22 14:17:35');

-- ----------------------------
-- Table structure for product_images
-- ----------------------------
DROP TABLE IF EXISTS `product_images`;
CREATE TABLE `product_images`  (
  `id` int(0) NOT NULL AUTO_INCREMENT,
  `product_id` int(0) NULL DEFAULT NULL,
  `type` enum('img','swiper') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `seq` int(0) NULL DEFAULT NULL,
  `image_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 65 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of product_images
-- ----------------------------
INSERT INTO `product_images` VALUES (1, 1, 'img', 1, '@/assets/Simg/5090D1.jpg');
INSERT INTO `product_images` VALUES (2, 1, 'swiper', 1, '@/assets/Simg/5090D1.jpg');
INSERT INTO `product_images` VALUES (3, 1, 'swiper', 2, '@/assets/Simg/5090D2.jpg');
INSERT INTO `product_images` VALUES (4, 1, 'swiper', 3, '@/assets/Simg/5090D3.jpg');
INSERT INTO `product_images` VALUES (5, 2, 'img', 1, '@/assets/Simg/5090D2.jpg');
INSERT INTO `product_images` VALUES (6, 2, 'swiper', 1, '@/assets/Simg/50801.jpg');
INSERT INTO `product_images` VALUES (7, 2, 'swiper', 2, '@/assets/Simg/50802.jpg');
INSERT INTO `product_images` VALUES (8, 2, 'swiper', 3, '@/assets/Simg/50803.jpg');
INSERT INTO `product_images` VALUES (9, 3, 'img', 1, '@/assets/Index/5070E.png');
INSERT INTO `product_images` VALUES (10, 3, 'swiper', 1, '@/assets/Index/5070B.png');
INSERT INTO `product_images` VALUES (11, 3, 'swiper', 2, '@/assets/Index/5070C.png');
INSERT INTO `product_images` VALUES (12, 3, 'swiper', 3, '@/assets/Index/5070D.png');
INSERT INTO `product_images` VALUES (13, 4, 'img', 1, '@/assets/Index/5060E.jpg');
INSERT INTO `product_images` VALUES (14, 4, 'swiper', 1, '@/assets/Index/5060B.jpg');
INSERT INTO `product_images` VALUES (15, 4, 'swiper', 2, '@/assets/Index/5060C.jpg');
INSERT INTO `product_images` VALUES (16, 4, 'swiper', 3, '@/assets/Index/5060D.jpg');
INSERT INTO `product_images` VALUES (17, 5, 'img', 1, '@/assets/Index/4090C.jpg');
INSERT INTO `product_images` VALUES (18, 5, 'swiper', 1, '@/assets/Index/4090B.jpg');
INSERT INTO `product_images` VALUES (19, 5, 'swiper', 2, '@/assets/Index/4090E.jpg');
INSERT INTO `product_images` VALUES (20, 5, 'swiper', 3, '@/assets/Index/4090D.jpg');
INSERT INTO `product_images` VALUES (21, 6, 'img', 1, '@/assets/Index/4080E.jpg');
INSERT INTO `product_images` VALUES (22, 6, 'swiper', 1, '@/assets/Index/4080B.jpg');
INSERT INTO `product_images` VALUES (23, 6, 'swiper', 2, '@/assets/Index/4080C.jpg');
INSERT INTO `product_images` VALUES (24, 6, 'swiper', 3, '@/assets/Index/4080D.jpg');
INSERT INTO `product_images` VALUES (25, 7, 'img', 1, '@/assets/Index/4080SE.jpg');
INSERT INTO `product_images` VALUES (26, 7, 'swiper', 1, '@/assets/Index/4080SB.jpg');
INSERT INTO `product_images` VALUES (27, 7, 'swiper', 2, '@/assets/Index/4080SC.jpg');
INSERT INTO `product_images` VALUES (28, 7, 'swiper', 3, '@/assets/Index/4080SD.jpg');
INSERT INTO `product_images` VALUES (29, 8, 'img', 1, '@/assets/Index/4070E.jpg');
INSERT INTO `product_images` VALUES (30, 8, 'swiper', 1, '@/assets/Index/4070B.jpg');
INSERT INTO `product_images` VALUES (31, 8, 'swiper', 2, '@/assets/Index/4070C.jpg');
INSERT INTO `product_images` VALUES (32, 8, 'swiper', 3, '@/assets/Index/4070D.jpg');
INSERT INTO `product_images` VALUES (33, 9, 'img', 1, '@/assets/Index/4060TiE.jpg');
INSERT INTO `product_images` VALUES (34, 9, 'swiper', 1, '@/assets/Index/4060TiB.jpg');
INSERT INTO `product_images` VALUES (35, 9, 'swiper', 2, '@/assets/Index/4060TiC.jpg');
INSERT INTO `product_images` VALUES (36, 9, 'swiper', 3, '@/assets/Index/4060TiD.jpg');
INSERT INTO `product_images` VALUES (37, 10, 'img', 1, '@/assets/Index/4060E.jpg');
INSERT INTO `product_images` VALUES (38, 10, 'swiper', 1, '@/assets/Index/4060B.jpg');
INSERT INTO `product_images` VALUES (39, 10, 'swiper', 2, '@/assets/Index/4060C.jpg');
INSERT INTO `product_images` VALUES (40, 10, 'swiper', 3, '@/assets/Index/4060D.jpg');
INSERT INTO `product_images` VALUES (41, 11, 'img', 1, '@/assets/Index/3090E.jpg');
INSERT INTO `product_images` VALUES (42, 11, 'swiper', 1, '@/assets/Index/3090B.jpg');
INSERT INTO `product_images` VALUES (43, 11, 'swiper', 2, '@/assets/Index/3090C.jpg');
INSERT INTO `product_images` VALUES (44, 11, 'swiper', 3, '@/assets/Index/3090D.jpg');
INSERT INTO `product_images` VALUES (45, 12, 'img', 1, '@/assets/Index/3080E.jpg');
INSERT INTO `product_images` VALUES (46, 12, 'swiper', 1, '@/assets/Index/3080B.jpg');
INSERT INTO `product_images` VALUES (47, 12, 'swiper', 2, '@/assets/Index/3080C.jpg');
INSERT INTO `product_images` VALUES (48, 12, 'swiper', 3, '@/assets/Index/3080D.jpg');
INSERT INTO `product_images` VALUES (49, 13, 'img', 1, '@/assets/Index/3070E.png');
INSERT INTO `product_images` VALUES (50, 13, 'swiper', 1, '@/assets/Index/3070B.jpg');
INSERT INTO `product_images` VALUES (51, 13, 'swiper', 2, '@/assets/Index/3070C.jpg');
INSERT INTO `product_images` VALUES (52, 13, 'swiper', 3, '@/assets/Index/3070D.png');
INSERT INTO `product_images` VALUES (53, 14, 'img', 1, '@/assets/Index/m1E.png');
INSERT INTO `product_images` VALUES (54, 14, 'swiper', 1, '@/assets/Index/m1B.jpg');
INSERT INTO `product_images` VALUES (55, 14, 'swiper', 2, '@/assets/Index/m1C.png');
INSERT INTO `product_images` VALUES (56, 14, 'swiper', 3, '@/assets/Index/m1D.png');
INSERT INTO `product_images` VALUES (57, 15, 'img', 1, '@/assets/Index/m2E.jpg');
INSERT INTO `product_images` VALUES (58, 15, 'swiper', 1, '@/assets/Index/m2B.jpg');
INSERT INTO `product_images` VALUES (59, 15, 'swiper', 2, '@/assets/Index/m2C.jpg');
INSERT INTO `product_images` VALUES (60, 15, 'swiper', 3, '@/assets/Index/m2D.jpg');
INSERT INTO `product_images` VALUES (61, 16, 'img', 1, '@/assets/Index/m3E.png');
INSERT INTO `product_images` VALUES (62, 16, 'swiper', 1, '@/assets/Index/m3B.png');
INSERT INTO `product_images` VALUES (63, 16, 'swiper', 2, '@/assets/Index/m3C.png');
INSERT INTO `product_images` VALUES (64, 16, 'swiper', 3, '@/assets/Index/m3D.png');

-- ----------------------------
-- Table structure for product_summary
-- ----------------------------
DROP TABLE IF EXISTS `product_summary`;
CREATE TABLE `product_summary`  (
  `id` int(0) NOT NULL,
  `category_id` int(0) NULL DEFAULT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `price` decimal(10, 2) NULL DEFAULT NULL,
  `image_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `stock` int(0) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of product_summary
-- ----------------------------
INSERT INTO `product_summary` VALUES (1, 1, 'NVIDIA RTX 5090D', 21100.00, '@/assets/Index/5090D.jpg', 58);
INSERT INTO `product_summary` VALUES (2, 1, 'NVIDIA RTX 5080', 9999.00, '@/assets/Index/5080.jpg', 48);
INSERT INTO `product_summary` VALUES (3, 1, '5070', 4799.00, '@/assets/Index/5070.png', 50);
INSERT INTO `product_summary` VALUES (4, 1, '5060', 2599.00, '@/assets/Index/5060.jpg', 50);
INSERT INTO `product_summary` VALUES (5, 2, 'NVIDIA RTX 4090', 12500.00, '@/assets/Index/4090.jpg', 3);
INSERT INTO `product_summary` VALUES (6, 2, 'NVIDIA RTX 4080', 7699.00, '@/assets/Index/4080.jpg', 30);
INSERT INTO `product_summary` VALUES (7, 2, ' RTX 4080 SUPER', 8799.00, '@/assets/Index/4080S.jpg', 20);
INSERT INTO `product_summary` VALUES (8, 2, 'NVIDIA RTX 4070', 3869.00, '@/assets/Index/4070.jpg', 0);
INSERT INTO `product_summary` VALUES (9, 2, '4060Ti', 2649.00, '@/assets/Index/4060Ti.png', 50);
INSERT INTO `product_summary` VALUES (10, 2, '4060', 2300.00, '@/assets/Index/4060.jpg', 50);
INSERT INTO `product_summary` VALUES (11, 3, '3090', 6799.00, '@/assets/Index/3090.jpg', 50);
INSERT INTO `product_summary` VALUES (12, 3, '3080', 2299.00, '@/assets/Index/3080.jpg', 50);
INSERT INTO `product_summary` VALUES (13, 3, '3070', 1859.00, '@/assets/Index/3070.jpg', 50);
INSERT INTO `product_summary` VALUES (14, 4, '大力神支架', 299.00, '@/assets/Index/m1.png', 50);
INSERT INTO `product_summary` VALUES (15, 4, '酷月GH2显卡支架', 49.90, '@/assets/Index/m2.jpg', 50);
INSERT INTO `product_summary` VALUES (16, 4, 'Strimer逸彩霓彩线', 417.70, '@/assets/Index/m3.png', 50);

-- ----------------------------
-- Table structure for products
-- ----------------------------
DROP TABLE IF EXISTS `products`;
CREATE TABLE `products`  (
  `id` int(0) NOT NULL AUTO_INCREMENT COMMENT '商品ID，自增',
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `price` decimal(10, 2) NULL DEFAULT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `bright` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `bright2` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `bright3` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `image_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `detail_html` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `stock` int(0) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 17 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of products
-- ----------------------------
INSERT INTO `products` VALUES (1, 'NVIDIA RTX 5090D', 21100.00, '5090D显卡', '❤七天无理由退货 | 极速退款', '☆PLUS额外省', '✈支持送礼', '@/assets/Index/5090D.jpg', '<h3>包装清单</h3>\r\n<p>RTX 5090D 16G 官方显卡</p>\r\n<p>重要信息和保修卡</p>\r\n<h3>商品详情</h3>\r\n<p>支持七天无理由退货</p>', 59);
INSERT INTO `products` VALUES (2, 'NVIDIA RTX 5080', 9999.00, '5080显卡', '❤七天无理由退货 | 极速退款 感恩促销直降 1200,到手价 14800', '☆PLUS额外省', '✈支持送礼', '@/assets/Index/5080.jpg', '<h3>包装清单</h3>\r\n<p>RTX 5080 16G 官方显卡</p>\r\n<p>重要信息和保修卡</p>\r\n<h3>商品详情</h3>\r\n<p>支持七天无理由退货</p>  ...', 49);
INSERT INTO `products` VALUES (3, 'GeForce RTX 5070', 4799.00, '5070显卡', '感恩促销直降 1200,到手价 14800', '☆PLUS额外省', '✈支持送礼', '@/assets/Index/5070.png', '<h3>包装清单</h3>\r\n<p>GeForce RTX 5070 12G SHADOW 2X OC 电竞游戏设计智能学习独立显卡</p>\r\n<p>重要信息和保修卡</p>\r\n<h3>商品详情</h3>\r\n<p>支持七天无理由退货</p>  ...', 50);
INSERT INTO `products` VALUES (4, 'RTX5060 8G', 2599.00, 'RTX5060 8G显卡', '感恩促销直降 1200,到手价 14800', '☆PLUS额外省', '✈支持送礼', '@/assets/Index/5080.jpg', '<h3>包装清单</h3>\r\n<p>RTX5060 8G台式电脑电竞游戏人工智能算力独立显卡</p>\r\n<p>重要信息和保修卡</p>\r\n<h3>商品详情</h3>\r\n<p>支持七天无理由退货</p>  ...', 50);
INSERT INTO `products` VALUES (5, 'NVIDIA RTX 4090', 12500.00, '4090显卡', '花呗免息,0 首付 0 利率轻松购', '☆PLUS额外省', '✈支持送礼', '@/assets/Index/4090.jpg', '<h3>包装清单</h3>\r\n<p>RTX 4090D 16G 官方显卡</p>\r\n<p>重要信息和保修卡</p>\r\n<h3>商品详情</h3>\r\n<p>支持七天无理由退货</p>', 4);
INSERT INTO `products` VALUES (6, 'NVIDIA RTX 4080', 7699.00, '4080显卡', '花呗免息,0 首付 0 利率轻松购', '☆PLUS额外省', '✈支持送礼', '@/assets/Index/4080.jpg', '<h3>包装清单</h3>\r\n<p>RTX 4080 16G 官方显卡</p>\r\n<p>重要信息和保修卡</p>\r\n<h3>商品详情</h3>\r\n<p>支持七天无理由退货</p>', 30);
INSERT INTO `products` VALUES (7, ' RTX 4080 SUPER', 8799.00, '4080s显卡', '感恩促销直降 1200,到手价 14800', '☆PLUS额外省', '✈支持送礼', '@/assets/Index/4080S.jpg', '<h3>包装清单</h3>\r\n<p> RTX 4080 SUPER 16G VENTUS 3X </p>\r\n<p>重要信息和保修卡</p>\r\n<h3>商品详情</h3>\r\n<p>支持七天无理由退货</p>  ...', 20);
INSERT INTO `products` VALUES (8, 'NVIDIA RTX 4070', 3869.00, '4070显卡', '花呗免息,0 首付 0 利率轻松购', '☆PLUS额外省', '✈支持送礼', '@/assets/Index/4070.jpg', '<h3>包装清单</h3>\r\n<p>RTX 4070 12G 官方显卡</p>\r\n<p>重要信息和保修卡</p>\r\n<h3>商品详情</h3>\r\n<p>支持七天无理由退货</p>', 0);
INSERT INTO `products` VALUES (9, 'NVIDIA RTX 4060Ti', 2649.00, '4060Ti显卡', '感恩促销直降 1200,到手价 14800', '☆PLUS额外省', '✈支持送礼', '@/assets/Index/4060Ti.png', '<h3>包装清单</h3>\r\n<p>RTX 4060 Ti 踏雪 8G</p>\r\n<p>重要信息和保修卡</p>\r\n<h3>商品详情</h3>\r\n<p>支持七天无理由退货</p>  ...', 50);
INSERT INTO `products` VALUES (10, 'NVIDIA RTX 4060', 2300.00, '4060显卡', '花呗免息,0 首付 0 利率轻松购', '☆PLUS额外省', '✈支持送礼', '@/assets/Index/4060.jpg', '<h3>包装清单</h3>\r\n<p>RTX4060 DUO 8G 官方显卡</p>\r\n<p>重要信息和保修卡</p>\r\n<h3>商品详情</h3>\r\n<p>支持七天无理由退货</p>', 50);
INSERT INTO `products` VALUES (11, 'NVIDIA RTX 3090', 6799.00, 'RTX 3090 24G', '感恩促销直降 1200,到手价 14800', '☆PLUS额外省', '✈支持送礼', '@/assets/Index/3090.jpg', '<h3>包装清单</h3>\r\n<p>RTX 3090 24G 官方显卡</p>\r\n<p>重要信息和保修卡</p>\r\n<h3>商品详情</h3>\r\n<p>支持七天无理由退货</p>  ...', 50);
INSERT INTO `products` VALUES (12, 'NVIDIA RTX 3080', 2299.00, '3080显卡', '感恩促销直降 1200,到手价 14800', '☆PLUS额外省', '✈支持送礼', '@/assets/Index/3080.jpg', '<h3>包装清单</h3>\r\n<p>RTX 3080 20G 官方显卡</p>\r\n<p>重要信息和保修卡</p>\r\n<h3>商品详情</h3>\r\n<p>支持七天无理由退货</p>  ...', 50);
INSERT INTO `products` VALUES (13, 'NVIDIA RTX 3070', 1859.00, '3070显卡', '感恩促销直降 1200,到手价 14800', '☆PLUS额外省', '✈支持送礼', '@/assets/Index/3070.jpg', '<h3>包装清单</h3>\r\n<p>RTX 3070 8G 官方显卡</p>\r\n<p>重要信息和保修卡</p>\r\n<h3>商品详情</h3>\r\n<p>支持七天无理由退货</p>  ...', 50);
INSERT INTO `products` VALUES (14, '大力神支架', 299.00, '大力神支架', '感恩促销直降 1200,到手价 14800', '☆PLUS额外省', '✈支持送礼', '@/assets/Index/m1.png', '<h3>包装清单</h3>\r\n<p>大力神支架</p>\r\n<p>重要信息和保修卡</p>\r\n<h3>商品详情</h3>\r\n<p>支持七天无理由退货</p>  ...', 50);
INSERT INTO `products` VALUES (15, '酷月GH2显卡支架', 49.90, '酷月GH2显卡支架', '感恩促销直降 1200,到手价 14800', '☆PLUS额外省', '✈支持送礼', '@/assets/Index/m2.jpg', '<h3>包装清单</h3>\r\n<p>酷月GH2显卡支架</p>\r\n<p>重要信息和保修卡</p>\r\n<h3>商品详情</h3>\r\n<p>支持七天无理由退货</p>  ...', 50);
INSERT INTO `products` VALUES (16, 'Strimer逸彩霓彩线', 417.70, 'Strimer逸彩霓彩线', '感恩促销直降 1200,到手价 14800', '☆PLUS额外省', '✈支持送礼', '@/assets/Index/m3.png', '<h3>包装清单</h3>\r\n<p>Strimer逸彩霓彩线</p>\r\n<p>重要信息和保修卡</p>\r\n<h3>商品详情</h3>\r\n<p>支持七天无理由退货</p>  ...', 50);

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`  (
  `id` int(0) NOT NULL AUTO_INCREMENT,
  `username` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `password_hash` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `role` enum('user','admin') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'user',
  `created_at` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `username`(`username`) USING BTREE,
  UNIQUE INDEX `email`(`email`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES (1, 'admin', 'admin@gpustore.com', '13800000000', '$2b$10$jfbkwQa38fjehD7ewP9Ap.xz79eHvfhEiQ4DzdNfJK1ZPF5sXpma6', 'admin', '2026-04-27 15:19:09');
INSERT INTO `users` VALUES (2, 'Test1', NULL, '13500000000', '$2b$10$2dk1UKG/YowL0kUPP..ooOUz5..gCVquZFlMn291VBrXnEOV7BLrK', 'user', '2026-04-27 17:57:37');
INSERT INTO `users` VALUES (3, 'Test22', NULL, '13900000000', '$2b$10$pJCCaoDNfAnB0J.FDRkeoeCNoYIiKQ4RRWwgHYuJOP33B6EifZew6', 'user', '2026-04-29 20:42:29');
INSERT INTO `users` VALUES (4, 'Test7', NULL, '15800000000', '$2b$10$dc/g/pSQHKzeErox4s9jp.ZZRSzDT5nQzir7tLxHXu8GIuU1n0Ea2', 'user', '2026-04-29 21:20:08');

SET FOREIGN_KEY_CHECKS = 1;
