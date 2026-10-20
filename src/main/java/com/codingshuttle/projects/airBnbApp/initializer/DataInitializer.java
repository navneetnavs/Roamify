package com.codingshuttle.projects.airBnbApp.initializer;

import com.codingshuttle.projects.airBnbApp.entity.*;
import com.codingshuttle.projects.airBnbApp.entity.enums.Role;
import com.codingshuttle.projects.airBnbApp.repository.*;
import com.codingshuttle.projects.airBnbApp.service.InventoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements ApplicationRunner {

    private final UserRepository userRepository;
    private final HotelRepository hotelRepository;
    private final RoomRepository roomRepository;
    private final HotelMinPriceRepository hotelMinPriceRepository;
    private final InventoryService inventoryService;
    private final PasswordEncoder passwordEncoder;

    @Value("${ROAMIFY_ADMIN_PASSWORD:}")
    private String adminPassword;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        long initialHotelCount = hotelRepository.count();
        log.info("DataInitializer: Ensuring sample catalog is present ({} hotels currently exist).", initialHotelCount);

        User manager = userRepository.findByEmail("admin@roamify.com").orElseGet(() -> {
            if (adminPassword.isBlank()) {
                throw new IllegalStateException(
                        "ROAMIFY_ADMIN_PASSWORD must be configured before creating the initial manager account.");
            }
            User u = new User();
            u.setEmail("admin@roamify.com");
            u.setName("Roamify Admin");
            u.setPassword(passwordEncoder.encode(adminPassword));
            u.setRoles(Set.of(Role.HOTEL_MANAGER, Role.GUEST));
            return userRepository.save(u);
        });

        seedMumbaiHotels(manager);
        seedDelhiHotels(manager);
        seedBengaluruHotels(manager);
        seedGoaHotels(manager);
        seedJaipurHotels(manager);
        seedAdditionalHotels(manager);

        log.info("DataInitializer: Sample catalog ready with {} hotels ({} added).",
                hotelRepository.count(), hotelRepository.count() - initialHotelCount);
    }

    private void seedAdditionalHotels(User manager) {
        List<HotelSeed> seeds = List.of(
                new HotelSeed("Roamify Garden Nook", "Bengaluru", "Indiranagar", "4200"),
                new HotelSeed("Roamify Tech Park Suites", "Bengaluru", "Whitefield", "5100"),
                new HotelSeed("Roamify Cubbon Retreat", "Bengaluru", "MG Road", "4700"),
                new HotelSeed("Roamify Lakeside Rooms", "Bengaluru", "Hebbal", "3900"),
                new HotelSeed("Roamify Marina House", "Chennai", "Mylapore", "3800"),
                new HotelSeed("Roamify Coastline Stay", "Chennai", "Besant Nagar", "4600"),
                new HotelSeed("Roamify Heritage Courtyard", "Chennai", "T. Nagar", "3500"),
                new HotelSeed("Roamify Green Park Lodge", "Chennai", "Guindy", "3200"),
                new HotelSeed("Roamify Charminar View", "Hyderabad", "Old City", "3600"),
                new HotelSeed("Roamify Banjara Suites", "Hyderabad", "Banjara Hills", "5200"),
                new HotelSeed("Roamify Pearl Garden", "Hyderabad", "Gachibowli", "4100"),
                new HotelSeed("Roamify Lakefront House", "Hyderabad", "Hussain Sagar", "4500"),
                new HotelSeed("Roamify Park Street Rooms", "Kolkata", "Park Street", "3900"),
                new HotelSeed("Roamify Hooghly House", "Kolkata", "Bhowanipore", "3400"),
                new HotelSeed("Roamify Salt Lake Suites", "Kolkata", "Salt Lake", "4200"),
                new HotelSeed("Roamify Old Town Stay", "Kolkata", "Esplanade", "3100"),
                new HotelSeed("Roamify Deccan Courtyard", "Pune", "Koregaon Park", "4300"),
                new HotelSeed("Roamify Hillview Rooms", "Pune", "Baner", "3900"),
                new HotelSeed("Roamify Riverside Suites", "Pune", "Kalyani Nagar", "4800"),
                new HotelSeed("Roamify Heritage House", "Pune", "Shivajinagar", "3600"),
                new HotelSeed("Roamify Backwater Haven", "Kochi", "Fort Kochi", "4400"),
                new HotelSeed("Roamify Harbour View", "Kochi", "Marine Drive", "4700"),
                new HotelSeed("Roamify Spice Garden Stay", "Kochi", "Mattancherry", "3500"),
                new HotelSeed("Roamify Palm Courtyard", "Kochi", "Vyttila", "3200"),
                new HotelSeed("Roamify Lake Palace Rooms", "Udaipur", "Lake Pichola", "6200"),
                new HotelSeed("Roamify Aravalli Retreat", "Udaipur", "Fateh Sagar", "4800"),
                new HotelSeed("Roamify Old City Haveli", "Udaipur", "City Palace", "3900"),
                new HotelSeed("Roamify Garden Courtyard", "Udaipur", "Hiran Magri", "3300"),
                new HotelSeed("Roamify Ganga View House", "Varanasi", "Assi Ghat", "3700"),
                new HotelSeed("Roamify Riverside Courtyard", "Varanasi", "Dashashwamedh Ghat", "4100"),
                new HotelSeed("Roamify Temple Lane Stay", "Varanasi", "Godowlia", "2900"),
                new HotelSeed("Roamify Sarnath Garden", "Varanasi", "Sarnath", "3200"),
                new HotelSeed("Roamify Cedar Ridge", "Shimla", "Mall Road", "5100"),
                new HotelSeed("Roamify Pine View Lodge", "Shimla", "Jakhoo", "4600"),
                new HotelSeed("Roamify Mountain Courtyard", "Shimla", "Chotta Shimla", "3900"),
                new HotelSeed("Roamify Valley Rooms", "Shimla", "Kufri Road", "4300"),
                new HotelSeed("Roamify Taj View Stay", "Agra", "Taj Ganj", "4200"),
                new HotelSeed("Roamify Mughal Garden House", "Agra", "Fatehabad Road", "3800"),
                new HotelSeed("Roamify Yamuna View", "Agra", "Civil Lines", "3400"),
                new HotelSeed("Roamify Marble Courtyard", "Agra", "Sikandra Road", "3100")
        );

        String[] photoIds = {
                "photo-1566073771259-6a8506099945",
                "photo-1564501049412-61c2a3083791",
                "photo-1571896349842-33c89424de2d",
                "photo-1542314831-068cd1dbfeeb",
                "photo-1578683010236-d716f9a3f461",
                "photo-1582719478250-c89cae4dc85b",
                "photo-1520250497591-112f2f40a3f4",
                "photo-1600011689032-8b628b8a8747"
        };
        String[] hotelAmenities = {
                "WiFi", "Breakfast", "Air Conditioning", "Restaurant", "Parking", "24-hour Reception"
        };

        for (int i = 0; i < seeds.size(); i++) {
            HotelSeed seed = seeds.get(i);
            String locality = seed.locality();
            String city = seed.city();
            String mapQuery = (locality + " " + city).replace(' ', '+');
            String firstPhoto = photoIds[i % photoIds.length];
            String secondPhoto = photoIds[(i + 1) % photoIds.length];
            String thirdPhoto = photoIds[(i + 2) % photoIds.length];
            BigDecimal basePrice = new BigDecimal(seed.basePrice());

            createHotel(manager, seed.name(), city,
                    new String[]{
                            "https://images.unsplash.com/" + firstPhoto + "?w=800&q=80",
                            "https://images.unsplash.com/" + secondPhoto + "?w=800&q=80",
                            "https://images.unsplash.com/" + thirdPhoto + "?w=800&q=80"
                    },
                    hotelAmenities,
                    locality + ", " + city + ", India",
                    null,
                    null,
                    "https://maps.google.com/?q=" + mapQuery,
                    new RoomSeed[]{
                            new RoomSeed("Classic Room", basePrice, 14, 2,
                                    new String[]{"Queen Bed", "WiFi", "Air Conditioning", "Work Desk"}),
                            new RoomSeed("Family Suite", basePrice.multiply(new BigDecimal("1.65")), 4, 4,
                                    new String[]{"King Bed", "WiFi", "Sitting Area", "Mini Fridge"})
                    });
        }
    }

    // ── Mumbai ────────────────────────────────────────────────────────────

    private void seedMumbaiHotels(User manager) {
        createHotel(manager,
            "The Taj Mahal Palace",
            "Mumbai",
            new String[]{
                "https://images.unsplash.com/photo-1600011689032-8b628b8a8747?w=800&q=80",
                "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&q=80",
                "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&q=80"
            },
            new String[]{"WiFi", "Pool", "Spa", "Gym", "Valet Parking", "Room Service", "Bar", "Restaurant"},
            "Apollo Bunder, Colaba, Mumbai 400001",
            "+91 22 6665 3366",
            "reservations.mumbai@tajhotels.com",
            "https://maps.google.com/?q=Taj+Mahal+Palace+Mumbai",
            new RoomSeed[]{
                new RoomSeed("Deluxe Sea View", new BigDecimal("8500"), 12, 2,
                    new String[]{"King Bed", "WiFi", "Sea View", "Minibar", "LED TV"}),
                new RoomSeed("Executive Suite", new BigDecimal("18000"), 6, 3,
                    new String[]{"King Bed", "WiFi", "Sea View", "Butler Service", "Private Balcony"}),
                new RoomSeed("Palace Room", new BigDecimal("35000"), 4, 4,
                    new String[]{"King Bed", "WiFi", "Heritage Decor", "Private Dining", "Butler"})
            }
        );

        createHotel(manager,
            "Marriott Mumbai",
            "Mumbai",
            new String[]{
                "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
                "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80",
                "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80"
            },
            new String[]{"WiFi", "Pool", "Gym", "Restaurant", "Bar", "Conference Room"},
            "Juhu Tara Road, Juhu, Mumbai 400049",
            "+91 22 6693 3000",
            "info@marriottmumbai.com",
            "https://maps.google.com/?q=Marriott+Mumbai+Juhu",
            new RoomSeed[]{
                new RoomSeed("Deluxe Room", new BigDecimal("5500"), 20, 2,
                    new String[]{"Queen Bed", "WiFi", "City View", "Smart TV"}),
                new RoomSeed("Junior Suite", new BigDecimal("9500"), 10, 2,
                    new String[]{"King Bed", "WiFi", "Lounge", "Sofa", "Mini Kitchen"}),
                new RoomSeed("Presidential Suite", new BigDecimal("25000"), 2, 4,
                    new String[]{"2 King Beds", "WiFi", "Private Pool", "Butler", "Piano"})
            }
        );
    }

    // ── Delhi ─────────────────────────────────────────────────────────────

    private void seedDelhiHotels(User manager) {
        createHotel(manager,
            "The Imperial New Delhi",
            "Delhi",
            new String[]{
                "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80",
                "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80",
                "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&q=80"
            },
            new String[]{"WiFi", "Pool", "Spa", "Restaurant", "Valet Parking", "Gym", "Art Gallery"},
            "Janpath, New Delhi 110001",
            "+91 11 2334 1234",
            "reservations@theimperialindia.com",
            "https://maps.google.com/?q=The+Imperial+New+Delhi",
            new RoomSeed[]{
                new RoomSeed("Imperial Room", new BigDecimal("7200"), 15, 2,
                    new String[]{"King Bed", "WiFi", "Garden View", "Antique Decor"}),
                new RoomSeed("Grand Suite", new BigDecimal("16000"), 8, 3,
                    new String[]{"King Bed", "Sitting Room", "WiFi", "Jacuzzi"}),
                new RoomSeed("Royal Suite", new BigDecimal("40000"), 2, 4,
                    new String[]{"2 Bedrooms", "Private Pool", "WiFi", "Butler", "Kitchen"})
            }
        );

        createHotel(manager,
            "Hyatt Regency Delhi",
            "Delhi",
            new String[]{
                "https://images.unsplash.com/photo-1499856844078-9540de70cc87?w=800&q=80",
                "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&q=80",
                "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80"
            },
            new String[]{"WiFi", "Pool", "Gym", "Restaurant", "Bar", "Conference", "Spa"},
            "Bhikaji Cama Place, Ring Road, New Delhi 110066",
            "+91 11 2679 1234",
            "delhi.regency@hyatt.com",
            "https://maps.google.com/?q=Hyatt+Regency+Delhi",
            new RoomSeed[]{
                new RoomSeed("Standard King", new BigDecimal("4800"), 30, 2,
                    new String[]{"King Bed", "WiFi", "City View", "Work Desk"}),
                new RoomSeed("Regency Club Room", new BigDecimal("7500"), 12, 2,
                    new String[]{"King Bed", "WiFi", "Club Lounge Access", "Evening Cocktails"}),
                new RoomSeed("Diplomatic Suite", new BigDecimal("20000"), 4, 4,
                    new String[]{"2 Bedrooms", "Living Room", "WiFi", "Private Bar"})
            }
        );
    }

    // ── Bengaluru ─────────────────────────────────────────────────────────

    private void seedBengaluruHotels(User manager) {
        createHotel(manager,
            "The Leela Palace Bengaluru",
            "Bengaluru",
            new String[]{
                "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80",
                "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
                "https://images.unsplash.com/photo-1521783988139-89397d761dce?w=800&q=80"
            },
            new String[]{"WiFi", "Pool", "Spa", "Gym", "Restaurant", "Bar", "Butler Service"},
            "23 Airport Road, Bengaluru 560008",
            "+91 80 2521 1234",
            "reservations@bengaluru.theleela.com",
            "https://maps.google.com/?q=Leela+Palace+Bengaluru",
            new RoomSeed[]{
                new RoomSeed("Deluxe Room", new BigDecimal("6500"), 18, 2,
                    new String[]{"King Bed", "WiFi", "Garden View", "Rainfall Shower"}),
                new RoomSeed("Business Suite", new BigDecimal("12000"), 8, 2,
                    new String[]{"King Bed", "WiFi", "Office Setup", "City View", "Lounge"}),
                new RoomSeed("Leela Suite", new BigDecimal("28000"), 3, 3,
                    new String[]{"King Bed", "Private Pool", "Butler", "WiFi", "Kitchen"})
            }
        );

        createHotel(manager,
            "ITC Gardenia Bengaluru",
            "Bengaluru",
            new String[]{
                "https://images.unsplash.com/photo-1455587734955-081b22074882?w=800&q=80",
                "https://images.unsplash.com/photo-1601918774946-25832a4be0d6?w=800&q=80",
                "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&q=80"
            },
            new String[]{"WiFi", "Pool", "Spa", "Gym", "Multiple Restaurants", "Valet"},
            "1 Residency Road, Bengaluru 560025",
            "+91 80 2211 9898",
            "itcgardenia@itchotels.in",
            "https://maps.google.com/?q=ITC+Gardenia+Bengaluru",
            new RoomSeed[]{
                new RoomSeed("Superior Room", new BigDecimal("5000"), 25, 2,
                    new String[]{"Queen Bed", "WiFi", "Garden View", "LED TV"}),
                new RoomSeed("ITC One Room", new BigDecimal("9500"), 10, 2,
                    new String[]{"King Bed", "WiFi", "ITC One Lounge", "City View"}),
                new RoomSeed("Grand Suite", new BigDecimal("22000"), 3, 4,
                    new String[]{"2 Bedrooms", "WiFi", "Private Terrace", "Butler"})
            }
        );
    }

    // ── Goa ──────────────────────────────────────────────────────────────

    private void seedGoaHotels(User manager) {
        createHotel(manager,
            "Taj Fort Aguada Resort",
            "Goa",
            new String[]{
                "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&q=80",
                "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80",
                "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80"
            },
            new String[]{"WiFi", "Beach Access", "Pool", "Spa", "Restaurant", "Water Sports", "Bar"},
            "Sinquerim, Candolim, North Goa 403515",
            "+91 832 664 5858",
            "fortaguada.goa@tajhotels.com",
            "https://maps.google.com/?q=Taj+Fort+Aguada+Goa",
            new RoomSeed[]{
                new RoomSeed("Sea View Room", new BigDecimal("7800"), 20, 2,
                    new String[]{"King Bed", "WiFi", "Sea View", "Balcony", "Mini Bar"}),
                new RoomSeed("Beach Villa", new BigDecimal("22000"), 6, 3,
                    new String[]{"King Bed", "WiFi", "Private Pool", "Beach Access", "Butler"}),
                new RoomSeed("Fort Suite", new BigDecimal("45000"), 2, 4,
                    new String[]{"2 Bedrooms", "Private Pool", "Butler", "WiFi", "Terrace"})
            }
        );

        createHotel(manager,
            "W Goa",
            "Goa",
            new String[]{
                "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=800&q=80",
                "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800&q=80",
                "https://images.unsplash.com/photo-1584132915807-fd1f5fbc078f?w=800&q=80"
            },
            new String[]{"WiFi", "Pool", "Beach", "Gym", "Spa", "Nightclub", "Restaurant"},
            "Vagator Beach, North Goa 403509",
            "+91 832 671 8888",
            "wgoa@whotels.com",
            "https://maps.google.com/?q=W+Goa+Hotel",
            new RoomSeed[]{
                new RoomSeed("Wonderful Room", new BigDecimal("9500"), 15, 2,
                    new String[]{"King Bed", "WiFi", "Garden/Pool View", "Rain Shower"}),
                new RoomSeed("Fabulous Suite", new BigDecimal("19000"), 6, 2,
                    new String[]{"King Bed", "WiFi", "Plunge Pool", "Sea View", "Living Room"}),
                new RoomSeed("Extreme WOW Suite", new BigDecimal("65000"), 1, 6,
                    new String[]{"3 Bedrooms", "Private Pool", "Butler", "Private Beach"})
            }
        );
    }

    // ── Jaipur ────────────────────────────────────────────────────────────

    private void seedJaipurHotels(User manager) {
        createHotel(manager,
            "Rambagh Palace Jaipur",
            "Jaipur",
            new String[]{
                "https://images.unsplash.com/photo-1477120128765-a0528148fed6?w=800&q=80",
                "https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?w=800&q=80",
                "https://images.unsplash.com/photo-1519449556851-5720b33024e7?w=800&q=80"
            },
            new String[]{"WiFi", "Pool", "Spa", "Restaurant", "Polo Field", "Valet", "Heritage Tour"},
            "Bhawani Singh Road, Jaipur 302005",
            "+91 141 238 5700",
            "rambagh.jaipur@tajhotels.com",
            "https://maps.google.com/?q=Rambagh+Palace+Jaipur",
            new RoomSeed[]{
                new RoomSeed("Luxury Room", new BigDecimal("9000"), 10, 2,
                    new String[]{"King Bed", "WiFi", "Garden View", "Heritage Decor", "Clawfoot Tub"}),
                new RoomSeed("Grand Luxury Suite", new BigDecimal("20000"), 5, 3,
                    new String[]{"King Bed", "WiFi", "Private Garden", "Butler", "Antique Furniture"}),
                new RoomSeed("Royal Suite", new BigDecimal("55000"), 2, 4,
                    new String[]{"2 Bedrooms", "Private Pool", "Butler", "WiFi", "Palace Wing"})
            }
        );

        createHotel(manager,
            "Fairmont Jaipur",
            "Jaipur",
            new String[]{
                "https://images.unsplash.com/photo-1574643156929-51fa098b0394?w=800&q=80",
                "https://images.unsplash.com/photo-1606402179428-a57976d71fa4?w=800&q=80",
                "https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=800&q=80"
            },
            new String[]{"WiFi", "Pool", "Spa", "Gym", "Restaurant", "Elephant Rides", "Cultural Shows"},
            "Riico Institutional Area, Kukas, Jaipur 302028",
            "+91 141 464 4444",
            "jaipur@fairmont.com",
            "https://maps.google.com/?q=Fairmont+Jaipur",
            new RoomSeed[]{
                new RoomSeed("Deluxe Room", new BigDecimal("5500"), 22, 2,
                    new String[]{"King Bed", "WiFi", "Pool View", "Rajasthani Decor"}),
                new RoomSeed("Fairmont Room", new BigDecimal("8500"), 10, 2,
                    new String[]{"King Bed", "WiFi", "City View", "Lounge Access"}),
                new RoomSeed("Maharaja Suite", new BigDecimal("30000"), 3, 4,
                    new String[]{"2 Bedrooms", "Private Pool", "Butler", "WiFi", "Terrace"})
            }
        );
    }

    // ── Helper methods ────────────────────────────────────────────────────

    @Transactional
    protected void createHotel(User manager, String name, String city,
                                String[] photos, String[] amenities,
                                String address, String phone, String email, String location,
                                RoomSeed[] roomSeeds) {
        if (hotelRepository.existsByNameAndCity(name, city)) {
            return;
        }

        // Build hotel
        HotelContactInfo contactInfo = new HotelContactInfo();
        contactInfo.setAddress(address);
        contactInfo.setPhoneNumber(phone);
        contactInfo.setEmail(email);
        contactInfo.setLocation(location);

        Hotel hotel = new Hotel();
        hotel.setName(name);
        hotel.setCity(city);
        hotel.setPhotos(photos);
        hotel.setAmenities(amenities);
        hotel.setContactInfo(contactInfo);
        hotel.setActive(false);
        hotel.setOwner(manager);
        hotel = hotelRepository.save(hotel);

        // Build rooms
        BigDecimal minRoomPrice = null;
        for (RoomSeed seed : roomSeeds) {
            Room room = new Room();
            room.setHotel(hotel);
            room.setType(seed.type);
            room.setBasePrice(seed.basePrice);
            room.setTotalCount(seed.totalCount);
            room.setCapacity(seed.capacity);
            room.setAmenities(seed.amenities);
            room.setPhotos(new String[]{});
            room = roomRepository.save(room);
            if (minRoomPrice == null || seed.basePrice.compareTo(minRoomPrice) < 0) {
                minRoomPrice = seed.basePrice;
            }

            // Initialize 1 year of inventory for each room
            inventoryService.initializeRoomForAYear(room);
        }

        LocalDate today = LocalDate.now();
        List<HotelMinPrice> dailyPrices = new ArrayList<>();
        for (LocalDate date = today; !date.isAfter(today.plusYears(1)); date = date.plusDays(1)) {
            HotelMinPrice dailyPrice = new HotelMinPrice(hotel, date);
            dailyPrice.setPrice(minRoomPrice);
            dailyPrices.add(dailyPrice);
        }
        hotelMinPriceRepository.saveAll(dailyPrices);

        // Activate hotel (sets active = true)
        hotel.setActive(true);
        hotelRepository.save(hotel);

        log.info("DataInitializer: Created hotel '{}' in {} with {} room types.", name, city, roomSeeds.length);
    }

    private record HotelSeed(String name, String city, String locality, String basePrice) {}

    record RoomSeed(String type, BigDecimal basePrice, int totalCount, int capacity, String[] amenities) {}
}
