package com.zosh.service;

import com.zosh.modal.User;
import com.zosh.modal.Size;
import com.zosh.exception.ProductException;
import com.zosh.repository.ProductRepository;
import com.zosh.repository.UserRepository;
import com.zosh.request.CreateProductRequest;
import com.zosh.user.domain.UserRole;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;

@Component
public class DataInitializationComponent implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    private CartService cartService;
    private PasswordEncoder passwordEncoder;
    private ProductService productService;

    @Autowired
    public DataInitializationComponent(UserRepository userRepository,
                                       PasswordEncoder passwordEncoder,
                                       CartService cartService,
                                       ProductRepository productRepository,
                                       ProductService productService) {
        this.userRepository = userRepository;
        this.passwordEncoder=passwordEncoder;
        this.cartService=cartService;
        this.productRepository = productRepository;
        this.productService = productService;
    }

    @Override
    public void run(String... args) throws ProductException {
        initializeAdminUser();
        initializeStarterProducts();
    }

    private void initializeAdminUser() {
        String adminUsername = "codewithzosh@gmail.com";

        if (userRepository.findByEmail(adminUsername)==null) {
            User adminUser = new User();

            adminUser.setPassword(passwordEncoder.encode("codewithzosh"));
            adminUser.setFirstName("Lumina");
            adminUser.setLastName("Admin");
            adminUser.setEmail(adminUsername);
            adminUser.setRole(UserRole.ROLE_ADMIN.toString());

            User admin=userRepository.save(adminUser);

            cartService.createCart(admin);
        }
    }

    private void initializeStarterProducts() throws ProductException {
        if (productRepository.count() > 0) {
            return;
        }

        // ===================== MEN - SHIRTS =====================
        productService.createProduct(product(
                "Linen Resort Shirt",
                "Ao so mi linen form rong, chat vai thoang mat cho ngay nang.",
                720000, 499000, 31, 45, "Maison Mode", "White",
                "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=80",
                "men", "clothing", "shirt"
        ));
        productService.createProduct(product(
                "Oxford Button-Down Shirt",
                "Ao so mi oxford co button-down, lich su va de phoi do cong so.",
                680000, 479000, 29, 40, "WorkWear Co", "Light Blue",
                "https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?auto=format&fit=crop&w=900&q=80",
                "men", "clothing", "shirt"
        ));
        productService.createProduct(product(
                "Plaid Flannel Shirt",
                "Ao so mi flannel ca ro, am ap va phong cach casual cuoi tuan.",
                750000, 549000, 27, 35, "Northline", "Red Plaid",
                "https://images.unsplash.com/photo-1608234808654-2a8875faa7fd?auto=format&fit=crop&w=900&q=80",
                "men", "clothing", "shirt"
        ));
        productService.createProduct(product(
                "Slim Fit Dress Shirt",
                "Ao so mi trang slim fit, phu hop voi bo suit hoac quan tay.",
                890000, 649000, 27, 30, "Elegance", "White",
                "https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=900&q=80",
                "men", "clothing", "shirt"
        ));

        // ===================== MEN - T-SHIRTS =====================
        productService.createProduct(product(
                "Essential Cotton Tee",
                "Ao thun co tron cotton 100%, thoang khi va tiet dung hang ngay.",
                320000, 229000, 28, 80, "Everyday Edit", "Black",
                "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80",
                "men", "clothing", "t-shirt"
        ));
        productService.createProduct(product(
                "Graphic Print Tee",
                "Ao thun in hinh doc dao, the hien phong cach ca tinh va street style.",
                380000, 279000, 26, 60, "Urban Vibes", "White",
                "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=900&q=80",
                "men", "clothing", "t-shirt"
        ));
        productService.createProduct(product(
                "Polo Shirt Classic",
                "Ao polo co be viet co classic, sang trong va lich su.",
                490000, 349000, 29, 50, "Classic Sport", "Navy",
                "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=900&q=80",
                "men", "clothing", "t-shirt"
        ));
        productService.createProduct(product(
                "Oversized Street Tee",
                "Ao thun form rong phong cach streetwear, thoai mai va hien dai.",
                420000, 299000, 29, 55, "Street Culture", "Gray",
                "https://images.unsplash.com/photo-1622445275576-721325763afe?auto=format&fit=crop&w=900&q=80",
                "men", "clothing", "t-shirt"
        ));

        // ===================== MEN - JEANS =====================
        productService.createProduct(product(
                "Straight Denim Classic",
                "Quan jeans xanh dang straight, de phoi voi ao thun hoac blazer.",
                980000, 759000, 23, 38, "Northline", "Blue",
                "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=900&q=80",
                "men", "clothing", "men_jeans"
        ));
        productService.createProduct(product(
                "Slim Fit Dark Jeans",
                "Quan jeans xanh dam ong slim, ton dang va lich su cho nhieu dip.",
                1050000, 799000, 24, 30, "Denim Lab", "Dark Blue",
                "https://images.unsplash.com/photo-1555689502-c4b22d76c56f?auto=format&fit=crop&w=900&q=80",
                "men", "clothing", "men_jeans"
        ));
        productService.createProduct(product(
                "Ripped Skinny Jeans",
                "Quan jeans rach phong cach, the hien ve manh me va ca tinh.",
                890000, 649000, 27, 25, "Urban Loom", "Light Blue",
                "https://images.unsplash.com/photo-1604176354204-9268737828e4?auto=format&fit=crop&w=900&q=80",
                "men", "clothing", "men_jeans"
        ));
        productService.createProduct(product(
                "Cargo Denim Pants",
                "Quan jeans cargo nhieu tui, thuc te va phong cach outdoor.",
                1100000, 849000, 23, 20, "Explorer Gear", "Olive",
                "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=900&q=80",
                "men", "clothing", "men_jeans"
        ));

        // ===================== MEN - KURTAS =====================
        productService.createProduct(product(
                "Modern Kurta Sand",
                "Kurta toi gian voi tone cat am, phu hop di choi va su kien nhe.",
                890000, 649000, 27, 32, "Urban Loom", "Beige",
                "https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?auto=format&fit=crop&w=900&q=80",
                "men", "clothing", "mens_kurta"
        ));
        productService.createProduct(product(
                "Embroidered Festival Kurta",
                "Kurta theu tiet le voi hoa van tinh xao, phu hop le hoi truyen thong.",
                1200000, 899000, 25, 20, "Heritage Craft", "Maroon",
                "https://images.unsplash.com/photo-1624499945898-7a30c30cc745?auto=format&fit=crop&w=900&q=80",
                "men", "clothing", "mens_kurta"
        ));
        productService.createProduct(product(
                "Cotton Straight Kurta",
                "Kurta cotton thang dang, thoang mat cho ngay thuong va cuoi tuan.",
                750000, 549000, 27, 28, "Daily Weave", "White",
                "https://images.unsplash.com/photo-1607006483224-7c7d5e85f0c2?auto=format&fit=crop&w=900&q=80",
                "men", "clothing", "mens_kurta"
        ));

        // ===================== MEN - ACCESSORIES =====================
        productService.createProduct(product(
                "Chronograph Sport Watch",
                "Dong ho chronograph phong cach the thao, mat kinh Sapphire chong xuoc.",
                2500000, 1890000, 24, 15, "TimeForce", "Black",
                "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=900&q=80",
                "men", "accessories", "watch"
        ));
        productService.createProduct(product(
                "Minimalist Leather Watch",
                "Dong ho mat tron day da nau, thiet ke toi gian sang trong.",
                1800000, 1390000, 23, 12, "Timeless", "Brown",
                "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80",
                "men", "accessories", "watch"
        ));
        productService.createProduct(product(
                "Bifold Leather Wallet",
                "Vi da nam gap doi, ngan de the va tien mat, thiet ke mong nhe.",
                450000, 329000, 27, 40, "LeatherCraft", "Brown",
                "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=900&q=80",
                "men", "accessories", "wallet"
        ));
        productService.createProduct(product(
                "Slim Card Wallet",
                "Vi dung the mong, chat lieu da that, gon nhe khi mang theo.",
                320000, 229000, 28, 50, "SlimPack", "Black",
                "https://images.unsplash.com/photo-1612428699068-c33c96a5e58e?auto=format&fit=crop&w=900&q=80",
                "men", "accessories", "wallet"
        ));
        productService.createProduct(product(
                "Woven Canvas Belt",
                "That lung canvas dan tay, phong cach casual manh me.",
                280000, 199000, 29, 60, "BeltUp", "Khaki",
                "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=900&q=80",
                "men", "accessories", "belt"
        ));

        // ===================== WOMEN - DRESSES =====================
        productService.createProduct(product(
                "Pleated Midi Dress",
                "Dam midi xep ly nhe, form ton dang va chat vai mem.",
                1250000, 899000, 28, 27, "Velvet House", "Rose",
                "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80",
                "women", "clothing", "women_dress"
        ));
        productService.createProduct(product(
                "Floral Wrap Dress",
                "Dam quay hoa tiet hoa nho xinh, nu tinh va nang dong cho mua he.",
                990000, 729000, 26, 35, "Bloom Style", "Floral",
                "https://images.unsplash.com/photo-1572804013427-4d7ca7268217?auto=format&fit=crop&w=900&q=80",
                "women", "clothing", "women_dress"
        ));
        productService.createProduct(product(
                "Little Black Dress",
                "Dam den hang co dang, thiet ke bat bien cho moi dip tiec va hen ho.",
                1100000, 799000, 27, 20, "Noir Chic", "Black",
                "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=900&q=80",
                "women", "clothing", "women_dress"
        ));
        productService.createProduct(product(
                "Boho Maxi Dress",
                "Dam maxi phong cach boho voi hoa tiet ethnic, tu nhien va tu do.",
                1150000, 849000, 26, 22, "Free Spirit", "Terracotta",
                "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80",
                "women", "clothing", "women_dress"
        ));
        productService.createProduct(product(
                "Office Shift Dress",
                "Dam shift cong so trang nha, phong cach chuyen nghiep va thoai mai.",
                1050000, 769000, 27, 18, "WorkChic", "Cream",
                "https://images.unsplash.com/photo-1560243563-062bfc001d68?auto=format&fit=crop&w=900&q=80",
                "women", "clothing", "women_dress"
        ));

        // ===================== WOMEN - TOPS =====================
        productService.createProduct(product(
                "Soft Ribbed Top",
                "Ao top gan mem, mau trung tinh, de ket hop trong nhieu outfit.",
                520000, 369000, 29, 60, "Everyday Edit", "Gray",
                "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=900&q=80",
                "women", "clothing", "top"
        ));
        productService.createProduct(product(
                "Lace Trim Blouse",
                "Ao blouse voan ren vien, nu tinh va thanh lich cho cong so va du tiec.",
                680000, 489000, 28, 40, "Lace & Grace", "White",
                "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=900&q=80",
                "women", "clothing", "top"
        ));
        productService.createProduct(product(
                "Crop Knit Sweater",
                "Ao len crop ngan, form om gon, am ap cho mua lanh va dieu hoa.",
                720000, 529000, 27, 35, "Knitwear Co", "Dusty Pink",
                "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=900&q=80",
                "women", "clothing", "top"
        ));
        productService.createProduct(product(
                "Off-Shoulder Top",
                "Ao trat vai sexy va nu tinh, chat linh jersey mem mai.",
                580000, 419000, 28, 45, "Shoulder Drop", "Coral",
                "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=900&q=80",
                "women", "clothing", "top"
        ));
        productService.createProduct(product(
                "Silk Tank Top",
                "Ao hai day lua mem bong, sang trong cho cong so va buoi tiec.",
                760000, 559000, 26, 30, "Silk Touch", "Champagne",
                "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=80",
                "women", "clothing", "top"
        ));

        // ===================== WOMEN - SAREES =====================
        productService.createProduct(product(
                "Silk Saree Emerald",
                "Saree lua mau xanh ngoc voi hoa tiet tinh te cho tiec toi.",
                2100000, 1590000, 24, 18, "Aarya Silk", "Green",
                "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=80",
                "women", "clothing", "saree"
        ));
        productService.createProduct(product(
                "Banarasi Weave Saree",
                "Saree Banarasi det thu cong truyen thong, xa xi va dat gia tri van hoa.",
                3200000, 2490000, 22, 10, "Royal Weaves", "Gold",
                "https://images.unsplash.com/photo-1614252234498-f66e2e08caea?auto=format&fit=crop&w=900&q=80",
                "women", "clothing", "saree"
        ));
        productService.createProduct(product(
                "Georgette Printed Saree",
                "Saree georgette in hoa tiet hien dai, nhe nhang de mac cho ngay thuong.",
                1500000, 1149000, 23, 20, "Georgette Dreams", "Pink",
                "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=900&q=80",
                "women", "clothing", "saree"
        ));

        // ===================== WOMEN - GOWNS =====================
        productService.createProduct(product(
                "Ivory Gown",
                "Dam dai trang kem, phan eo gon va duong cat thanh lich.",
                1890000, 1390000, 26, 14, "Celeste Studio", "Ivory",
                "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=900&q=80",
                "women", "clothing", "gouns"
        ));
        productService.createProduct(product(
                "Emerald Evening Gown",
                "Dam da hoi mau xanh ngoc, duong cut A-line tom gon va long lanh.",
                2500000, 1890000, 24, 8, "Gala Fashion", "Emerald",
                "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=900&q=80",
                "women", "clothing", "gouns"
        ));
        productService.createProduct(product(
                "Red Carpet Ball Gown",
                "Dam xoe long va trang trong, ly tuong cho da hoi va prom.",
                3500000, 2690000, 23, 5, "Prima Donna", "Red",
                "https://images.unsplash.com/photo-1519657337289-077653f724ed?auto=format&fit=crop&w=900&q=80",
                "women", "clothing", "gouns"
        ));

        // ===================== WOMEN - LENGHA CHOLI =====================
        productService.createProduct(product(
                "Embroidered Lengha",
                "Lengha choli theu noi bat, thich hop cho le hoi va chup anh.",
                2600000, 1990000, 23, 11, "Jaipur Muse", "Maroon",
                "https://images.unsplash.com/photo-1612336307429-8a898d10e223?auto=format&fit=crop&w=900&q=80",
                "women", "clothing", "lengha_choli"
        ));
        productService.createProduct(product(
                "Pastel Mirror Work Lengha",
                "Lengha cong guong hoa tiet pastel, nhe nhang va ruc ro cho le hoi.",
                2200000, 1690000, 23, 8, "Mirror Magic", "Peach",
                "https://images.unsplash.com/photo-1583001931096-959e9a1a6223?auto=format&fit=crop&w=900&q=80",
                "women", "clothing", "lengha_choli"
        ));

        // ===================== WOMEN - KURTAS =====================
        productService.createProduct(product(
                "Floral Anarkali Kurta",
                "Kurta Anarkali hoa tiet hoa nho, form tha dat thanh thoat va nu tinh.",
                980000, 729000, 25, 25, "Petal Studio", "Lilac",
                "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=900&q=80",
                "women", "clothing", "kurtas"
        ));
        productService.createProduct(product(
                "Straight Cotton Kurta",
                "Kurta cotton thang dang mau tran, don gian, thoang mat ngay he.",
                750000, 549000, 27, 35, "Daily Weave", "White",
                "https://images.unsplash.com/photo-1614252369475-531eba835eb1?auto=format&fit=crop&w=900&q=80",
                "women", "clothing", "kurtas"
        ));
        productService.createProduct(product(
                "Block Print Kurta",
                "Kurta in block print thu cong phong cach ethinc Rajasthan sang tao.",
                880000, 649000, 26, 28, "Artisan Block", "Indigo",
                "https://images.unsplash.com/photo-1559563458-527698bf5295?auto=format&fit=crop&w=900&q=80",
                "women", "clothing", "kurtas"
        ));

        // ===================== WOMEN - ACCESSORIES =====================
        productService.createProduct(product(
                "Tote Leather Bag",
                "Tui tote da chan thuc, nhieu ngan tien dung, phu hop cong so.",
                1500000, 1149000, 23, 20, "LeatherLux", "Tan",
                "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=80",
                "women", "accessories", "bag"
        ));
        productService.createProduct(product(
                "Crossbody Mini Bag",
                "Tui deo cheo mini xinh xan, tien dung cho di choi va hen ho.",
                890000, 649000, 27, 30, "Mini Luxe", "Blush",
                "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=80",
                "women", "accessories", "bag"
        ));
        productService.createProduct(product(
                "Woven Straw Tote",
                "Tui tote co dan thu cong, phong cach resort mua he.",
                650000, 459000, 29, 25, "Summer Weave", "Natural",
                "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=900&q=80",
                "women", "accessories", "bag"
        ));
        productService.createProduct(product(
                "Oversized Square Sunglasses",
                "Kinh mat vuong kho vong chong tia UV, phong cach thoi thuong retro.",
                420000, 299000, 28, 40, "SunShade", "Black",
                "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=80",
                "women", "accessories", "sunglasse"
        ));
        productService.createProduct(product(
                "Cat-Eye Sunglasses",
                "Kinh mat cat-eye sang trong, gon cot va ton khuon mat cho phai dep.",
                380000, 269000, 29, 45, "CatGaze", "Tortoise",
                "https://images.unsplash.com/photo-1512536670534-b80a7e84e5b9?auto=format&fit=crop&w=900&q=80",
                "women", "accessories", "sunglasse"
        ));
        productService.createProduct(product(
                "Braided Leather Belt",
                "That lung da dan bao, mem va bao ben, phu hop nhieu kieu quan vay.",
                350000, 249000, 28, 50, "BeltCraft", "Brown",
                "https://images.unsplash.com/photo-1553532434-5ab5b6b84993?auto=format&fit=crop&w=900&q=80",
                "women", "accessories", "belt"
        ));
    }

    private CreateProductRequest product(String title, String description, int price, int discountedPrice,
                                         int discountPersent, int quantity, String brand, String color,
                                         String imageUrl, String topCategory, String secondCategory,
                                         String thirdCategory) {
        CreateProductRequest req = new CreateProductRequest();
        req.setTitle(title);
        req.setDescription(description);
        req.setPrice(price);
        req.setDiscountedPrice(discountedPrice);
        req.setDiscountPersent(discountPersent);
        req.setQuantity(quantity);
        req.setBrand(brand);
        req.setColor(color);
        req.setImageUrl(imageUrl);
        req.setTopLavelCategory(topCategory);
        req.setSecondLavelCategory(secondCategory);
        req.setThirdLavelCategory(thirdCategory);
        req.setSize(sizes(quantity));
        return req;
    }

    private Set<Size> sizes(int quantity) {
        Set<Size> sizes = new HashSet<>();
        sizes.add(size("S", Math.max(1, quantity / 4)));
        sizes.add(size("M", Math.max(1, quantity / 3)));
        sizes.add(size("L", Math.max(1, quantity / 4)));
        return sizes;
    }

    private Size size(String name, int quantity) {
        Size size = new Size();
        size.setName(name);
        size.setQuantity(quantity);
        return size;
    }

}
